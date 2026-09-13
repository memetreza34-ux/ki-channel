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
const normalize = (value) => String(value ?? '')
  .normalize('NFKC')
  .toLocaleLowerCase('de-DE')
  .replace(/[–—]/g, '-')
  .replace(/[^\p{L}\p{N}]+/gu, '')
  .trim();

for (const required of [statusPath, wordsPath, reelPath, captionsPath, sceneMapPath]) {
  if (!existsSync(required)) fail(`required file missing: ${required}`);
}

const status = await readJson(statusPath);
const timing = await readJson(wordsPath);
const reel = await readJson(reelPath);
const captions = await readJson(captionsPath);
const sceneMap = await readJson(sceneMapPath);

if (status?.authority !== '01-script-audio/WORD-TIMINGS.json') fail('timing authority must be 01-script-audio/WORD-TIMINGS.json');
const wordRows = Array.isArray(timing?.words) ? timing.words : [];
if (wordRows.length < 1) fail('WORD-TIMINGS.json contains no words.');
if (String(timing?.status || '') !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') fail('WORD-TIMINGS.json is not an accepted local forced alignment.');

for (const [index, word] of wordRows.entries()) {
  const startFrame = Number(word?.startFrame);
  const endFrame = Number(word?.endFrame);
  if (!Number.isFinite(startFrame) || !Number.isFinite(endFrame) || startFrame < 0 || endFrame <= startFrame) fail(`invalid word timing at index ${index}`);
  if (!String(word?.sentenceId || '') || !String(word?.sceneId || '')) fail(`word ${index + 1} lacks sentenceId/sceneId`);
}

const cueRows = Array.isArray(captions?.cues) ? captions.cues : [];
if (cueRows.length < 1) fail('subtitle-cues.json contains no cues.');
const captionAuthority = String(captions?.timingAuthority || '');
const captionStatus = String(captions?.timingStatus || '').toUpperCase();
if (!captionAuthority.endsWith('WORD-TIMINGS.json')) fail('subtitle-cues.json timingAuthority must reference WORD-TIMINGS.json.');
if (!captionStatus.startsWith('VOICE_LOCKED') && !captionStatus.startsWith('WORD_ALIGNED')) fail(`subtitle-cues.json timingStatus is not voice locked: ${captions?.timingStatus || 'missing'}`);

const captionWords = cueRows.flatMap((cue) => {
  if (!Array.isArray(cue?.words) || cue.words.length < 1) fail(`caption cue ${cue?.id || cue?.sentenceId || '?'} has no word timings.`);
  return cue.words.map((word) => ({
    text: word.text,
    startFrame: Number(word.startFrame),
    endFrame: Number(word.endFrame),
    sceneId: cue.sceneId,
    sentenceId: cue.sentenceId,
  }));
});
if (captionWords.length !== wordRows.length) fail(`caption word count ${captionWords.length} does not match aligned word count ${wordRows.length}.`);
for (let index = 0; index < wordRows.length; index++) {
  const aligned = wordRows[index];
  const caption = captionWords[index];
  if (normalize(aligned.text) !== normalize(caption.text)) fail(`caption/alignment word mismatch at ${index + 1}: ${caption.text} != ${aligned.text}`);
  if (caption.startFrame !== Number(aligned.startFrame) || caption.endFrame !== Number(aligned.endFrame)) fail(`caption timing drift at word ${index + 1}.`);
  if (caption.sceneId !== aligned.sceneId || caption.sentenceId !== aligned.sentenceId) fail(`caption mapping drift at word ${index + 1}.`);
}

const mappingStatus = String(sceneMap?.mappingStatus || sceneMap?.status || '').toUpperCase();
if (!mappingStatus.includes('VOICE_LOCKED') && !mappingStatus.includes('ALIGN')) fail('SCENE-VOICE-MAP is not voice/alignment locked.');

const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
if (!scenes.length) fail('reel.json scenes missing.');
const fps = Number(reel?.format?.fps || timing?.fps || 30);
const finalFrames = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('invalid fps.');
if (!Number.isFinite(finalFrames) || finalFrames <= 0) fail('reel.format.finalDurationInFrames must be locked from aligned audio.');

let cursor = 0;
for (let index = 0; index < scenes.length; index++) {
  const current = scenes[index];
  if (current.startFrame !== cursor || current.endFrame <= current.startFrame) fail(`${current.sceneId}: invalid contiguous scene bounds.`);
  if (String(current.timingStatus || '').toUpperCase() !== 'VOICE_LOCKED') fail(`${current.sceneId}: timingStatus must be VOICE_LOCKED.`);
  const sceneWords = wordRows.filter((word) => word.sceneId === current.sceneId);
  if (!sceneWords.length) fail(`${current.sceneId}: no aligned words.`);
  const firstWord = sceneWords[0];
  const lastWord = sceneWords[sceneWords.length - 1];
  const expectedStart = index === 0 ? 0 : Number(firstWord.startFrame);
  const expectedEnd = index === scenes.length - 1 ? finalFrames : Number(wordRows.find((word) => word.sceneId === scenes[index + 1].sceneId)?.startFrame);
  if (!Number.isFinite(expectedEnd)) fail(`${current.sceneId}: next scene word anchor missing.`);
  if (current.startFrame !== expectedStart) fail(`${current.sceneId}: scene start ${current.startFrame} != aligned anchor ${expectedStart}.`);
  if (current.endFrame !== expectedEnd) fail(`${current.sceneId}: scene end ${current.endFrame} != aligned anchor ${expectedEnd}.`);
  if (Number(lastWord.endFrame) > current.endFrame) fail(`${current.sceneId}: mapped speech extends beyond scene end.`);
  cursor = current.endFrame;
}
if (cursor !== finalFrames) fail(`scene coverage ends at ${cursor}, final duration is ${finalFrames}.`);

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

const lastWordEnd = Math.max(...wordRows.map((word) => Number(word.endFrame)));
if (lastWordEnd > finalFrames) fail(`last aligned word ends at ${lastWordEnd}, beyond final duration ${finalFrames}.`);
if (finalFrames - lastWordEnd > Math.ceil(fps * 1.5)) fail(`final duration contains more than 1.5 s trailing space after speech (${finalFrames - lastWordEnd} frames).`);

console.log('TIMING SYNC PASSED');
console.log(`aligned words: ${wordRows.length}`);
console.log(`caption cues: ${cueRows.length}`);
console.log(`scenes: ${scenes.length}`);
console.log(`final duration: ${finalFrames} frames @ ${fps} fps`);
