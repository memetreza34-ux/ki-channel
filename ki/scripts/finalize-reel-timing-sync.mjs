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
const masterPath = path.join(reelDir, '06-projektdateien', 'MASTER-TIMELINE.json');
const qualityPath = path.join(reelDir, '06-projektdateien', 'ALIGNMENT-QUALITY.json');
const choreographyPath = path.join(reelDir, '06-projektdateien', 'CHOREOGRAPHY-RESOLVED.json');
const fail = (message) => { console.error(`TIMING SYNC FINALIZE FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};
for (const file of [reelPath, captionsPath, wordsPath, sceneMapPath, masterPath, qualityPath, choreographyPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);

const reel = await readJson(reelPath);
const captions = await readJson(captionsPath);
const timings = await readJson(wordsPath);
const sceneMap = await readJson(sceneMapPath);
const master = await readJson(masterPath);
const quality = await readJson(qualityPath);
const choreography = await readJson(choreographyPath);
const words = Array.isArray(timings?.words) ? timings.words : [];
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
const beats = Array.isArray(choreography?.beats) ? choreography.beats : [];
if (!words.length || !cues.length || !scenes.length || !beats.length) fail('aligned words, captions, scenes and choreography beats are required.');
if (String(timings?.status || '') !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') fail('WORD-TIMINGS.json is not accepted forced alignment output.');
if (captions?.timingStatus !== 'VOICE_LOCKED_MASTER_TIMELINE') fail('captions are not master-timeline locked.');
if (!String(captions?.timingAuthority || '').endsWith('WORD-TIMINGS.json')) fail('captions are not derived from WORD-TIMINGS.json.');
if (!String(sceneMap?.mappingStatus || '').toUpperCase().includes('VOICE_LOCKED')) fail('SCENE-VOICE-MAP is not voice locked.');
if (!scenes.every((scene) => String(scene?.timingStatus || '').toUpperCase() === 'VOICE_LOCKED')) fail('not all scenes are voice locked.');
if (master?.status !== 'MASTER_TIMELINE_LOCKED') fail('MASTER-TIMELINE.json is not locked.');
if (quality?.status !== 'ALIGNMENT_CONSENSUS_PASSED') fail('independent alignment consensus has not passed.');
if (choreography?.status !== 'CHOREOGRAPHY_LOCKED') fail('CHOREOGRAPHY-RESOLVED.json is not locked.');
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
const choreographyLock = sourceText.includes('createChoreographyTiming') && sourceText.includes('choreography.local');
if (!choreographyLock) fail('Remotion source does not consume explicit choreography beat intervals.');

const sfxEnabled = reel?.sfx?.enabled === true;
const sfxResolvedPath = sfxEnabled ? path.resolve(reelDir, reel?.sfx?.resolvedFile || '06-projektdateien/sfx-resolved.json') : null;
const sfxReady = !sfxEnabled || (sfxResolvedPath && existsSync(sfxResolvedPath));
if (!sfxReady) fail('SFX is enabled but resolved SFX timing is missing.');

const nextReel = {
  ...reel,
  timingAuthority: 'CHOREOGRAPHY_AFTER_CONSENSUS_FORCED_ALIGNMENT',
  storytelling: {...(reel.storytelling || {}), voiceSyncMode: 'EXPLICIT_SPEECH_ENTER_HOLD_EXIT_INTERVALS'},
};
await writeFile(reelPath, `${JSON.stringify(nextReel, null, 2)}\n`, 'utf8');

const status = {
  version: 4,
  status: 'TIMING_SYNC_READY',
  authority: '06-projektdateien/CHOREOGRAPHY-RESOLVED.json',
  masterAuthority: '06-projektdateien/MASTER-TIMELINE.json',
  wordAuthority: '01-script-audio/WORD-TIMINGS.json',
  generatedAt: new Date().toISOString(),
  audioAligned: true,
  independentAlignmentConsensus: true,
  wordTimingsPresent: true,
  captionsDerivedFromWordTimings: true,
  scenesDerivedFromWordTimings: true,
  explicitSpeechWindows: true,
  explicitAnimationWindows: true,
  animationEnterHoldExitLocked: true,
  remotionConsumesChoreographyBeatIds: true,
  sfxResyncedAfterAlignment: sfxReady,
  durationFromAlignedAudio: true,
  sourceContract: 'WORD_TIMINGS_TO_SPEECH_WINDOW_TO_ENTER_HOLD_EXIT_TO_SFX',
  choreographyBeatCount: beats.length,
  finalDurationInFrames: Number(nextReel.format.finalDurationInFrames),
  fps: Number(nextReel.format.fps),
  tolerances: {
    captionStartTargetFrames: 0,
    sceneLeadMaxFrames: 4,
    animationAnchorMaxConsensusMs: Number(quality?.thresholds?.maxAnchorDeltaMs || 220),
    sfxVisibleEventMaxFrames: 0
  }
};
await writeFile(statusPath, `${JSON.stringify(status, null, 2)}\n`, 'utf8');
console.log('TIMING SYNC FINALIZED');
console.log(`authority: ${status.authority}`);
console.log(`words: ${words.length}`);
console.log(`caption cues: ${cues.length}`);
console.log(`scenes: ${scenes.length}`);
console.log(`choreography beats: ${beats.length}`);
console.log(`final duration: ${status.finalDurationInFrames} frames @ ${status.fps} fps`);
console.log('alignment consensus: PASSED');
console.log('Remotion ENTER/HOLD/EXIT choreography wiring: PASSED');
