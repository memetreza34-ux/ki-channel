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
const masterPath = path.join(reelDir, '06-projektdateien', 'MASTER-TIMELINE.json');
const qualityPath = path.join(reelDir, '06-projektdateien', 'ALIGNMENT-QUALITY.json');
const fail = (message) => { console.error(`TIMING SYNC FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};
for (const required of [statusPath, wordsPath, reelPath, captionsPath, sceneMapPath, masterPath, qualityPath]) if (!existsSync(required)) fail(`required file missing: ${required}`);

const status = await readJson(statusPath);
const reel = await readJson(reelPath);
const captions = await readJson(captionsPath);
const sceneMap = await readJson(sceneMapPath);
const wordsDoc = await readJson(wordsPath);
const master = await readJson(masterPath);
const quality = await readJson(qualityPath);

if (status?.status !== 'TIMING_SYNC_READY') fail('timing-sync-status.json status must be TIMING_SYNC_READY.');
if (status?.authority !== '06-projektdateien/MASTER-TIMELINE.json') fail('timing authority must be MASTER-TIMELINE.json.');
if (status?.wordAuthority !== '01-script-audio/WORD-TIMINGS.json') fail('word authority must be WORD-TIMINGS.json.');
if (master?.status !== 'MASTER_TIMELINE_LOCKED') fail('master timeline is not locked.');
if (quality?.status !== 'ALIGNMENT_CONSENSUS_PASSED') fail('independent alignment consensus not passed.');

const words = Array.isArray(wordsDoc?.words) ? wordsDoc.words : [];
const cueRows = Array.isArray(captions?.cues) ? captions.cues : [];
if (!words.length || !cueRows.length) fail('aligned words/captions missing.');
const firstNumeric = (...values) => values.map(Number).find(Number.isFinite);
const startSeconds = (word) => firstNumeric(word?.startSeconds, word?.start, word?.start_time, word?.startTime);
const endSeconds = (word) => firstNumeric(word?.endSeconds, word?.end, word?.end_time, word?.endTime);
for (const [index, word] of words.entries()) {
  const start = startSeconds(word);
  const end = endSeconds(word);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) fail(`invalid word timing at index ${index}`);
}
if (captions?.timingStatus !== 'VOICE_LOCKED_MASTER_TIMELINE') fail('captions are not master-timeline locked.');
if (captions?.timingAuthority !== '01-script-audio/WORD-TIMINGS.json') fail('captions are not derived from word timings.');
const mappingStatus = String(sceneMap?.mappingStatus || sceneMap?.status || '');
if (!mappingStatus.includes('LOCK') && !mappingStatus.includes('ALIGN')) fail('SCENE-VOICE-MAP is not alignment/voice locked.');

const requiredFlags = [
  'audioAligned',
  'independentAlignmentConsensus',
  'wordTimingsPresent',
  'captionsDerivedFromWordTimings',
  'scenesDerivedFromWordTimings',
  'majorRevealsWordLocked',
  'remotionConsumesMasterEventIds',
  'sfxResyncedAfterAlignment',
  'durationFromAlignedAudio',
];
for (const key of requiredFlags) if (status?.[key] !== true) fail(`${key} must be true before final render.`);

const fps = Number(reel?.format?.fps || 30);
const finalFrames = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(finalFrames) || finalFrames <= 0) fail('reel.format.finalDurationInFrames must be set from aligned audio.');
if (Number(master?.finalDurationInFrames) !== finalFrames) fail('master timeline duration differs from reel final duration.');
const lastWordEnd = Math.max(...words.map(endSeconds));
const wordDurationFrames = Math.ceil(lastWordEnd * fps);
if (finalFrames < wordDurationFrames || finalFrames - wordDurationFrames > Math.max(30, Math.ceil(fps * 1.0))) {
  fail(`final duration (${finalFrames}) is inconsistent with last aligned word (${wordDurationFrames} frames).`);
}
console.log('TIMING SYNC PASSED');
console.log(`words: ${words.length}`);
console.log(`caption cues: ${cueRows.length}`);
console.log(`master events: ${Array.isArray(master?.events) ? master.events.length : 0}`);
console.log(`final duration: ${finalFrames} frames @ ${fps} fps`);
console.log('independent alignment consensus: PASS');
