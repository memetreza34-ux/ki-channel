#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {runtimeAudioPath, safeCompositionId} from './lib/render-provenance.mjs';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/lock-scene-timing-from-captions.mjs <reel-package-dir>');
  process.exit(1);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const captionsPath = path.join(reelDir, '03-caption', 'subtitle-cues.json');
const fail = (message) => { console.error(`SCENE TIMING LOCK FAILED: ${message}`); process.exit(1); };
if (!existsSync(reelPath) || !existsSync(captionsPath)) fail('reel.json or subtitle-cues.json missing.');

let reel;
let captions;
try {
  reel = JSON.parse(await readFile(reelPath, 'utf8'));
  captions = JSON.parse(await readFile(captionsPath, 'utf8'));
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}

const status = String(captions?.timingStatus || '').toUpperCase();
if (!(status.startsWith('WORD_ALIGNED') || status.startsWith('WHISPER_ALIGNED') || status.startsWith('VOICE_LOCKED'))) {
  fail(`caption timingStatus must represent real word alignment, got: ${captions?.timingStatus || 'missing'}`);
}

const fps = Number(reel?.format?.fps);
if (!Number.isFinite(fps) || fps <= 0) fail('reel.format.fps missing/invalid.');
const compositionId = safeCompositionId(reel?.compositionId);
if (!compositionId) fail('compositionId missing.');
const runtimeAudio = runtimeAudioPath(compositionId);
if (!existsSync(runtimeAudio)) fail(`prepared runtime WAV missing: ${runtimeAudio}`);

const probe = spawnSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',runtimeAudio], {encoding:'utf8'});
if (probe.error || probe.status !== 0) fail(`ffprobe failed: ${probe.stderr || probe.stdout || probe.error?.message}`);
const runtimeSeconds = Number(String(probe.stdout).trim());
if (!Number.isFinite(runtimeSeconds) || runtimeSeconds <= 0) fail('runtime WAV duration invalid.');
const finalDurationInFrames = Math.ceil(runtimeSeconds * fps);

const scenes = Array.isArray(reel.scenes) ? reel.scenes : [];
const cues = Array.isArray(captions.cues) ? captions.cues : [];
if (!scenes.length || !cues.length) fail('scenes or captions missing.');

const anchors = [];
for (const scene of scenes) {
  const sceneCues = cues.filter((cue) => cue.sceneId === scene.sceneId).sort((a,b) => a.startFrame - b.startFrame);
  if (!sceneCues.length) fail(`${scene.sceneId}: no aligned caption cue.`);
  const firstCue = sceneCues[0];
  const lastCue = sceneCues[sceneCues.length - 1];
  const firstWord = Array.isArray(firstCue.words) && firstCue.words.length ? firstCue.words[0] : null;
  const lastWord = Array.isArray(lastCue.words) && lastCue.words.length ? lastCue.words[lastCue.words.length - 1] : null;
  if (!firstWord || !lastWord) fail(`${scene.sceneId}: word-level timestamps missing.`);
  if (!Number.isFinite(firstWord.startFrame) || !Number.isFinite(lastWord.endFrame)) fail(`${scene.sceneId}: word frames invalid.`);
  anchors.push({sceneId: scene.sceneId, firstWordFrame: firstWord.startFrame, lastWordFrame: lastWord.endFrame});
}

for (let i = 1; i < anchors.length; i++) {
  if (anchors[i].firstWordFrame <= anchors[i - 1].firstWordFrame) fail(`${anchors[i].sceneId}: first spoken word does not occur after previous scene anchor.`);
}

const lockedScenes = scenes.map((scene, index) => {
  const startFrame = index === 0 ? 0 : anchors[index].firstWordFrame;
  const endFrame = index === scenes.length - 1 ? finalDurationInFrames : anchors[index + 1].firstWordFrame;
  if (endFrame <= startFrame) fail(`${scene.sceneId}: derived scene bounds invalid (${startFrame}-${endFrame}).`);
  if (anchors[index].lastWordFrame > endFrame) fail(`${scene.sceneId}: last mapped word extends beyond derived scene end.`);
  return {...scene, startFrame, endFrame, timingStatus: 'VOICE_LOCKED'};
});

reel = {
  ...reel,
  format: {...reel.format, finalDurationInFrames},
  audio: {
    ...reel.audio,
    observedAudioDurationSeconds: Number(runtimeSeconds.toFixed(6)),
    timingAuthority: true,
    status: 'RUNTIME_PCM_WAV_LOCKED',
  },
  sceneVoiceMap: {
    ...(reel.sceneVoiceMap || {}),
    status: 'VOICE_LOCKED',
  },
  captions: {
    ...(reel.captions || {}),
    status: 'VOICE_LOCKED_SCENE_MAPPED',
  },
  scenes: lockedScenes,
};

captions = {
  ...captions,
  timingStatus: 'VOICE_LOCKED_SCENE_MAPPED',
  note: 'Word timings come from the exact runtime PCM-WAV. Scene boundaries were derived from the first mapped spoken word of each scene.',
};

const mapRelative = reel?.sceneVoiceMap?.file || '01-script-audio/SCENE-VOICE-MAP.json';
const mapPath = path.resolve(reelDir, mapRelative);
if (!existsSync(mapPath)) fail(`scene voice map missing: ${mapPath}`);
let sceneVoiceMap;
try { sceneVoiceMap = JSON.parse(await readFile(mapPath, 'utf8')); }
catch (error) { fail(`scene voice map invalid: ${error.message}`); }
sceneVoiceMap = {...sceneVoiceMap, mappingStatus: 'VOICE_LOCKED'};

await writeFile(reelPath, `${JSON.stringify(reel, null, 2)}\n`, 'utf8');
await writeFile(captionsPath, `${JSON.stringify(captions, null, 2)}\n`, 'utf8');
await writeFile(mapPath, `${JSON.stringify(sceneVoiceMap, null, 2)}\n`, 'utf8');

console.log('SCENE TIMING LOCKED FROM REAL WORD TIMINGS');
console.log(`runtime WAV: ${runtimeSeconds.toFixed(3)} s`);
console.log(`final duration: ${finalDurationInFrames} frames @ ${fps} fps`);
for (const scene of lockedScenes) console.log(`${scene.sceneId}: ${scene.startFrame}-${scene.endFrame}`);
console.log('Next: run validate-scene-voice-map.mjs and validate-voice-locked-captions.mjs, then commit before prepare-reel-render.mjs.');
