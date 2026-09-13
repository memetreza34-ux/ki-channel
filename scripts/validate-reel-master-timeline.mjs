#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node scripts/validate-reel-master-timeline.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const p = (...parts) => path.join(reelDir, ...parts);
const fail = (message) => {
  console.error(`MASTER TIMELINE FAILED: ${message}`);
  process.exit(1);
};
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

const timelinePath = p('06-projektdateien', 'MASTER-TIMELINE.json');
const planPath = p('06-projektdateien', 'SYNC-PLAN.json');
const wordsPath = p('01-script-audio', 'WORD-TIMINGS.json');
const captionsPath = p('03-caption', 'subtitle-cues.json');
const reelPath = p('06-projektdateien', 'reel.json');
const sfxPath = p('06-projektdateien', 'sfx-events.json');

for (const file of [timelinePath, planPath, wordsPath, captionsPath, reelPath]) {
  if (!existsSync(file)) fail(`required file missing: ${file}`);
}

const timeline = await readJson(timelinePath);
const plan = await readJson(planPath);
const wordsDoc = await readJson(wordsPath);
const captions = await readJson(captionsPath);
const reel = await readJson(reelPath);
const sfx = existsSync(sfxPath) ? await readJson(sfxPath) : null;

if (timeline?.status !== 'MASTER_TIMELINE_LOCKED') fail('MASTER-TIMELINE.json is not locked.');
if (timeline?.authority !== '01-script-audio/WORD-TIMINGS.json') fail('master timeline authority mismatch.');
if (captions?.timingStatus !== 'VOICE_LOCKED_MASTER_TIMELINE') fail('captions are not master-timeline locked.');
if (captions?.timingAuthority !== '01-script-audio/WORD-TIMINGS.json') fail('captions timing authority mismatch.');
if (!String(reel?.timingAuthority || '').includes('WORD_TIMINGS')) fail('reel timing authority is not word timings.');

const words = Array.isArray(wordsDoc?.words) ? wordsDoc.words : [];
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
const events = Array.isArray(timeline?.events) ? timeline.events : [];
const planEvents = Array.isArray(plan?.events) ? plan.events : [];
const scenes = Array.isArray(timeline?.scenes) ? timeline.scenes : [];
if (!words.length || !cues.length || !events.length || !scenes.length) fail('timeline inputs are incomplete.');
if (events.length !== planEvents.length) fail(`resolved event count ${events.length} != plan ${planEvents.length}.`);

const sceneById = new Map(scenes.map((scene) => [String(scene.sceneId), scene]));
for (const event of events) {
  if (event?.exact !== true) fail(`${event?.id || 'unknown'} is not exact.`);
  const scene = sceneById.get(String(event.sceneId));
  if (!scene) fail(`${event.id}: unknown scene.`);
  if (!Number.isFinite(Number(event.globalFrame)) || Number(event.globalFrame) < Number(scene.startFrame) || Number(event.globalFrame) >= Number(scene.endFrame)) {
    fail(`${event.id}: globalFrame outside scene.`);
  }
  if (Number(event.sceneFrame) !== Number(event.globalFrame) - Number(scene.startFrame)) fail(`${event.id}: sceneFrame mismatch.`);
}

const orderedByScene = new Map();
for (const planned of planEvents) {
  const resolved = events.find((event) => event.id === planned.id);
  if (!resolved) fail(`planned event unresolved: ${planned.id}`);
  const arr = orderedByScene.get(planned.sceneId) || [];
  arr.push(resolved);
  orderedByScene.set(planned.sceneId, arr);
}
for (const [sceneId, arr] of orderedByScene) {
  for (let i = 1; i < arr.length; i++) {
    if (Number(arr[i].globalFrame) < Number(arr[i - 1].globalFrame)) {
      fail(`${sceneId}: event order goes backwards (${arr[i - 1].id} -> ${arr[i].id}).`);
    }
  }
}

const flattenedCaptionWords = cues.flatMap((cue) => Array.isArray(cue.words) ? cue.words : []);
if (flattenedCaptionWords.length !== words.length) fail(`caption word coverage ${flattenedCaptionWords.length}/${words.length}.`);
for (let i = 0; i < words.length; i++) {
  const a = words[i];
  const b = flattenedCaptionWords[i];
  if (String(a.text) !== String(b.text) || Number(a.startFrame) !== Number(b.startFrame) || Number(a.endFrame) !== Number(b.endFrame)) {
    fail(`caption word ${i + 1} does not exactly match WORD-TIMINGS.json.`);
  }
}
for (const cue of cues) {
  const count = Array.isArray(cue.words) ? cue.words.length : 0;
  if (count < 1 || count > Number(plan?.rules?.captions?.maxWordsPerCue || 4)) fail(`${cue.id}: invalid word count ${count}.`);
  const first = cue.words[0];
  const last = cue.words[cue.words.length - 1];
  if (Number(cue.startFrame) !== Number(first.startFrame)) fail(`${cue.id}: cue start is not first-word start.`);
  if (Number(cue.endFrame) < Number(last.endFrame)) fail(`${cue.id}: cue ends before last spoken word.`);
}

const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (Number(timeline?.finalDurationInFrames) !== finalDuration) fail('timeline duration != reel finalDurationInFrames.');
for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  if (i === 0 && Number(scene.startFrame) !== 0) fail('scene1 must start at frame 0.');
  if (i > 0 && Number(scene.startFrame) !== Number(scenes[i - 1].endFrame)) fail(`${scene.sceneId}: scene boundary gap/overlap.`);
}
if (Number(scenes[scenes.length - 1].endFrame) !== finalDuration) fail('last scene does not end at final duration.');

if (sfx && Array.isArray(sfx.events) && sfx.events.length) {
  const eventById = new Map(events.map((event) => [event.id, event]));
  for (const item of sfx.events) {
    const syncEventId = String(item.syncEventId || '');
    const mapped = eventById.get(syncEventId);
    if (!mapped) fail(`${item.id}: SFX has no master event.`);
    if (item?.anchor?.type !== 'SCENE_OFFSET') fail(`${item.id}: SFX anchor must be SCENE_OFFSET.`);
    if (Number(item.anchor.frame) !== Number(mapped.sceneFrame)) fail(`${item.id}: SFX anchor is not identical to master event frame.`);
  }
}

console.log('MASTER TIMELINE PASSED');
console.log(`words: ${words.length}`);
console.log(`captions: ${cues.length}`);
console.log(`scenes: ${scenes.length}`);
console.log(`animation events: ${events.length}`);
console.log(`sfx events: ${sfx?.events?.length || 0}`);
console.log(`final duration: ${finalDuration} frames @ ${reel.format.fps} fps`);
