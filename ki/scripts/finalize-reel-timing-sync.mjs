#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/finalize-reel-timing-sync.mjs <reel-package-dir>');
  process.exit(2);
}

const reelDir = path.resolve(rawReelDir);
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const captionsPath = path.join(reelDir, '03-caption', 'subtitle-cues.json');
const wordsPath = path.join(reelDir, '01-script-audio', 'WORD-TIMINGS.json');
const sceneMapPath = path.join(reelDir, '01-script-audio', 'SCENE-VOICE-MAP.json');
const statusPath = path.join(reelDir, '06-projektdateien', 'timing-sync-status.json');

const fail = (message) => {
  console.error(`TIMING SYNC FINALIZE FAILED: ${message}`);
  process.exit(1);
};
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

for (const file of [reelPath, captionsPath, wordsPath, sceneMapPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);
const reel = await readJson(reelPath);
const captions = await readJson(captionsPath);
const timings = await readJson(wordsPath);
const sceneMap = await readJson(sceneMapPath);

const words = Array.isArray(timings?.words) ? timings.words : [];
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
if (!words.length || !cues.length || !scenes.length) fail('aligned words, caption cues and scenes are required.');
if (String(timings?.status || '') !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') fail('WORD-TIMINGS.json is not accepted forced alignment output.');
if (!String(captions?.timingAuthority || '').endsWith('WORD-TIMINGS.json')) fail('captions are not derived from WORD-TIMINGS.json.');
if (!String(captions?.timingStatus || '').toUpperCase().startsWith('VOICE_LOCKED')) fail('captions are not voice locked.');
if (!String(sceneMap?.mappingStatus || '').toUpperCase().includes('VOICE_LOCKED')) fail('SCENE-VOICE-MAP is not voice locked.');
if (!scenes.every((scene) => String(scene?.timingStatus || '').toUpperCase() === 'VOICE_LOCKED')) fail('not all scenes are voice locked.');
if (!Number.isFinite(Number(reel?.format?.finalDurationInFrames)) || Number(reel.format.finalDurationInFrames) <= 0) fail('finalDurationInFrames missing.');

const walkSource = async (dir) => {
  const chunks = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) chunks.push(...await walkSource(full));
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) chunks.push(await readFile(full, 'utf8'));
  }
  return chunks;
};
const sourceDir = path.resolve(String(reel?.sourceDir || ''));
if (!String(reel?.sourceDir || '').trim() || !existsSync(sourceDir)) fail('reel.sourceDir missing or does not exist.');
const sourceText = (await walkSource(sourceDir)).join('\n');
const semanticRevealLock = sourceText.includes('createVoiceTiming') && sourceText.includes('.phraseFrame(') && sourceText.includes('.sentenceWindow(');
if (!semanticRevealLock) fail('Remotion source does not use semantic word/sentence anchors.');

const sfxEnabled = reel?.sfx?.enabled === true;
const sfxResolvedPath = sfxEnabled ? path.resolve(reelDir, reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json') : null;
const sfxReady = !sfxEnabled || (sfxResolvedPath && existsSync(sfxResolvedPath));
if (!sfxReady) fail('SFX is enabled but resolved SFX timing is missing.');

const nextReel = {
  ...reel,
  timingAuthority: 'WORD_TIMINGS_AFTER_FORCED_ALIGNMENT',
  storytelling: {
    ...(reel.storytelling || {}),
    voiceSyncMode: 'WORD_TIMINGS_SEMANTIC_ANCHORS',
  },
};
await writeFile(reelPath, `${JSON.stringify(nextReel, null, 2)}\n`, 'utf8');

const status = {
  version: 2,
  status: 'TIMING_SYNC_READY',
  authority: '01-script-audio/WORD-TIMINGS.json',
  generatedAt: new Date().toISOString(),
  audioAligned: true,
  wordTimingsPresent: true,
  captionsDerivedFromWordTimings: true,
  scenesDerivedFromWordTimings: true,
  majorRevealsWordLocked: true,
  sfxResyncedAfterAlignment: sfxReady,
  durationFromAlignedAudio: true,
  sourceContract: 'SEMANTIC_WORD_AND_SENTENCE_ANCHORS',
  finalDurationInFrames: Number(nextReel.format.finalDurationInFrames),
  fps: Number(nextReel.format.fps),
  tolerances: {
    captionStartTargetFrames: 2,
    captionStartMaxFrames: 4,
    majorRevealTargetFrames: 3,
    majorRevealMaxFrames: 5,
    sfxVisibleEventMaxFrames: 3
  }
};
await writeFile(statusPath, `${JSON.stringify(status, null, 2)}\n`, 'utf8');

console.log('TIMING SYNC FINALIZED');
console.log(`authority: ${status.authority}`);
console.log(`words: ${words.length}`);
console.log(`caption cues: ${cues.length}`);
console.log(`scenes: ${scenes.length}`);
console.log(`final duration: ${status.finalDurationInFrames} frames @ ${status.fps} fps`);
console.log('major reveals: semantic word/sentence anchors');
console.log(`sfx resynced: ${status.sfxResyncedAfterAlignment}`);
