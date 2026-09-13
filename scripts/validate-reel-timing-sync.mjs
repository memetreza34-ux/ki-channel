#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node scripts/validate-reel-timing-sync.mjs <reel-package-dir>');
  process.exit(2);
}

const reelDir = path.resolve(rawReelDir);
const statusPath = path.join(reelDir, '06-projektdateien', 'timing-sync-status.json');
const wordsPath = path.join(reelDir, '01-script-audio', 'WORD-TIMINGS.json');
const reelPath = path.join(reelDir, '06-projektdateien', 'reel.json');
const captionsPath = path.join(reelDir, '03-caption', 'subtitle-cues.json');
const sceneMapPath = path.join(reelDir, '01-script-audio', 'SCENE-VOICE-MAP.json');

const fail = (message) => {
  console.error(`TIMING SYNC FAILED: ${message}`);
  process.exit(1);
};
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

for (const required of [statusPath, reelPath, captionsPath, sceneMapPath]) {
  if (!existsSync(required)) fail(`required file missing: ${required}`);
}

const status = await readJson(statusPath);
const reel = await readJson(reelPath);
const captions = await readJson(captionsPath);
const sceneMap = await readJson(sceneMapPath);

if (status?.authority !== '01-script-audio/WORD-TIMINGS.json') fail('timing authority must be WORD-TIMINGS.json');
if (!existsSync(wordsPath)) fail('WORD-TIMINGS.json missing. Run local forced alignment first.');
const words = await readJson(wordsPath);

const wordRows = Array.isArray(words) ? words : Array.isArray(words?.words) ? words.words : [];
if (wordRows.length < 1) fail('WORD-TIMINGS.json contains no words.');

const firstNumeric = (...values) => values.map(Number).find(Number.isFinite);
const startSeconds = (word) => firstNumeric(word?.startSeconds, word?.start, word?.start_time, word?.startTime);
const endSeconds = (word) => firstNumeric(word?.endSeconds, word?.end, word?.end_time, word?.endTime);

for (const [index, word] of wordRows.entries()) {
  const start = startSeconds(word);
  const end = endSeconds(word);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) fail(`invalid word timing at index ${index}`);
}

const cueRows = Array.isArray(captions?.cues) ? captions.cues : [];
if (cueRows.length < 1) fail('subtitle-cues.json contains no cues.');
if (!['WORD_TIMINGS', 'FORCED_ALIGNMENT', 'WORD_TIMINGS_DERIVED'].includes(String(captions?.timingAuthority || captions?.source || ''))) {
  fail('subtitle-cues.json is not marked as derived from WORD-TIMINGS/forced alignment.');
}

if (!['WORD_TIMINGS_AFTER_FORCED_ALIGNMENT', 'WORD_TIMINGS'].includes(String(reel?.timingAuthority || reel?.finalTimingAuthority || reel?.format?.finalDurationAuthority || ''))) {
  const nested = String(reel?.sceneVoiceMap?.status || '');
  if (!nested.includes('WORD') && !nested.includes('LOCK')) fail('reel.json does not declare aligned word timing as final authority.');
}

const mappingStatus = String(sceneMap?.mappingStatus || sceneMap?.status || '');
if (!mappingStatus.includes('LOCK') && !mappingStatus.includes('ALIGN')) fail('SCENE-VOICE-MAP is not alignment/voice locked.');

const requiredFlags = [
  'audioAligned',
  'wordTimingsPresent',
  'captionsDerivedFromWordTimings',
  'scenesDerivedFromWordTimings',
  'majorRevealsWordLocked',
  'sfxResyncedAfterAlignment',
  'durationFromAlignedAudio',
];
for (const key of requiredFlags) if (status?.[key] !== true) fail(`${key} must be true before final render.`);
if (status?.status !== 'TIMING_SYNC_READY') fail('timing-sync-status.json status must be TIMING_SYNC_READY.');

const fps = Number(reel?.format?.fps || 30);
const finalFrames = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(finalFrames) || finalFrames <= 0) fail('reel.format.finalDurationInFrames must be set from aligned audio.');
const lastWordEnd = Math.max(...wordRows.map(endSeconds));
const wordDurationFrames = Math.ceil(lastWordEnd * fps);
if (Math.abs(finalFrames - wordDurationFrames) > Math.max(15, Math.ceil(fps * 0.5))) {
  fail(`final duration (${finalFrames}) differs too much from last aligned word (${wordDurationFrames} frames).`);
}

console.log('TIMING SYNC PASSED');
console.log(`words: ${wordRows.length}`);
console.log(`caption cues: ${cueRows.length}`);
console.log(`final duration: ${finalFrames} frames @ ${fps} fps`);
