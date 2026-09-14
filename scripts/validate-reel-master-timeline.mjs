#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node scripts/validate-reel-master-timeline.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const p = (...parts) => path.join(reelDir, ...parts);
const fail = (message) => { console.error(`MASTER TIMELINE FAILED: ${message}`); process.exit(1); };
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
const qualityPath = p('06-projektdateien', 'ALIGNMENT-QUALITY.json');
for (const file of [timelinePath, planPath, wordsPath, captionsPath, reelPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);

const timeline = await readJson(timelinePath);
const plan = await readJson(planPath);
const wordsDoc = await readJson(wordsPath);
const captions = await readJson(captionsPath);
const reel = await readJson(reelPath);
const sfx = existsSync(sfxPath) ? await readJson(sfxPath) : null;
const quality = existsSync(qualityPath) ? await readJson(qualityPath) : null;

if (timeline?.status !== 'MASTER_TIMELINE_LOCKED') fail('MASTER-TIMELINE.json is not locked.');
if (timeline?.authority !== '01-script-audio/WORD-TIMINGS.json') fail('master timeline authority mismatch.');
if (captions?.timingStatus !== 'VOICE_LOCKED_MASTER_TIMELINE') fail('captions are not master-timeline locked.');
if (captions?.timingAuthority !== '01-script-audio/WORD-TIMINGS.json') fail('captions timing authority mismatch.');
if (!String(reel?.timingAuthority || '').includes('WORD_TIMINGS') && !String(reel?.timingAuthority || '').includes('CHOREOGRAPHY')) fail('reel timing authority is not audio-derived.');
if (plan?.rules?.alignmentConsensus?.required === true && quality?.status !== 'ALIGNMENT_CONSENSUS_PASSED') fail('strict alignment consensus is required but not passed.');

const words = Array.isArray(wordsDoc?.words) ? wordsDoc.words : [];
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
const events = Array.isArray(timeline?.events) ? timeline.events : [];
const planEvents = Array.isArray(plan?.events) ? plan.events : [];
const scenes = Array.isArray(timeline?.scenes) ? timeline.scenes : [];
if (!words.length || !cues.length || !events.length || !scenes.length) fail('timeline inputs are incomplete.');
if (events.length !== planEvents.length) fail(`resolved event count ${events.length} != plan ${planEvents.length}.`);

const sceneById = new Map(scenes.map((scene) => [String(scene.sceneId), scene]));
const eventById = new Map(events.map((event) => [String(event.id), event]));
for (const event of events) {
  if (event?.exact !== true) fail(`${event?.id || 'unknown'} is not exact.`);
  const scene = sceneById.get(String(event.sceneId));
  if (!scene) fail(`${event.id}: unknown scene.`);
  if (!Number.isFinite(Number(event.globalFrame)) || Number(event.globalFrame) < Number(scene.startFrame) || Number(event.globalFrame) >= Number(scene.endFrame)) fail(`${event.id}: globalFrame outside scene.`);
  if (Number(event.sceneFrame) !== Number(event.globalFrame) - Number(scene.startFrame)) fail(`${event.id}: sceneFrame mismatch.`);
}

const orderedByScene = new Map();
for (const planned of planEvents) {
  const resolved = eventById.get(String(planned.id));
  if (!resolved) fail(`planned event unresolved: ${planned.id}`);
  const arr = orderedByScene.get(planned.sceneId) || [];
  arr.push(resolved);
  orderedByScene.set(planned.sceneId, arr);
}
for (const [sceneId, arr] of orderedByScene) {
  for (let i = 1; i < arr.length; i++) if (Number(arr[i].globalFrame) < Number(arr[i - 1].globalFrame)) fail(`${sceneId}: event order goes backwards (${arr[i - 1].id} -> ${arr[i].id}).`);
}

const flattenedCaptionWords = cues.flatMap((cue) => Array.isArray(cue.words) ? cue.words : []);
if (flattenedCaptionWords.length !== words.length) fail(`caption word coverage ${flattenedCaptionWords.length}/${words.length}.`);
for (let i = 0; i < words.length; i++) {
  const a = words[i];
  const b = flattenedCaptionWords[i];
  if (String(a.text) !== String(b.text) || Number(a.startFrame) !== Number(b.startFrame) || Number(a.endFrame) !== Number(b.endFrame)) fail(`caption word ${i + 1} does not exactly match WORD-TIMINGS.json.`);
}
const maxWords = Number(plan?.rules?.captions?.maxWordsPerCue || 4);
for (let index = 0; index < cues.length; index++) {
  const cue = cues[index];
  const count = Array.isArray(cue.words) ? cue.words.length : 0;
  if (count < 1 || count > maxWords) fail(`${cue.id}: invalid word count ${count}.`);
  const first = cue.words[0];
  const last = cue.words[cue.words.length - 1];
  if (Number(cue.startFrame) !== Number(first.startFrame)) fail(`${cue.id}: cue start is not first-word start.`);
  if (Number(cue.endFrame) < Number(last.endFrame)) fail(`${cue.id}: cue ends before last spoken word.`);
  const scene = sceneById.get(String(cue.sceneId));
  if (!scene) fail(`${cue.id}: unknown scene.`);
  if (Number(cue.startFrame) < Number(scene.startFrame) || Number(cue.endFrame) > Number(scene.endFrame)) fail(`${cue.id}: caption crosses scene boundary.`);
  if (index > 0 && Number(cue.startFrame) < Number(cues[index - 1].endFrame)) fail(`${cue.id}: overlaps previous caption cue.`);
}

const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (Number(timeline?.finalDurationInFrames) !== finalDuration) fail('timeline duration != reel finalDurationInFrames.');
const leadLimit = Number(plan?.rules?.scenes?.leadFramesBeforeFirstWord ?? 4);
for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  if (i === 0 && Number(scene.startFrame) !== 0) fail('scene1 must start at frame 0.');
  if (i > 0 && Number(scene.startFrame) !== Number(scenes[i - 1].endFrame)) fail(`${scene.sceneId}: scene boundary gap/overlap.`);
  const sceneWords = words.filter((word) => String(word.sceneId) === String(scene.sceneId));
  if (!sceneWords.length) fail(`${scene.sceneId}: no words.`);
  const firstWordStart = Number(sceneWords[0].startFrame);
  const lead = firstWordStart - Number(scene.startFrame);
  if (lead < 0 || lead > leadLimit) fail(`${scene.sceneId}: scene pre-roll ${lead}f outside 0-${leadLimit}f.`);
  if (Number(sceneWords[sceneWords.length - 1].endFrame) > Number(scene.endFrame)) fail(`${scene.sceneId}: spoken word extends past scene end.`);
}
if (Number(scenes[scenes.length - 1].endFrame) !== finalDuration) fail('last scene does not end at final duration.');

// Once CHOREOGRAPHY-RESOLVED.json exists, SFX are intentionally allowed to be shifted
// a few frames from the lower-level semantic master event so sound can land inside the
// explicit animation ENTER phase. The choreography validator owns that exact equality.
if (sfx && Array.isArray(sfx.events) && sfx.events.length) {
  for (const item of sfx.events) {
    const scene = sceneById.get(String(item.sceneId));
    if (!scene) fail(`${item.id}: unknown SFX scene.`);
    if (item?.anchor?.type !== 'SCENE_OFFSET') fail(`${item.id}: SFX anchor must be SCENE_OFFSET.`);
    const absolute = Number(scene.startFrame) + Number(item.anchor.frame);
    if (!Number.isFinite(absolute) || absolute < Number(scene.startFrame) || absolute >= Number(scene.endFrame)) fail(`${item.id}: SFX anchor outside scene.`);
    if (item?.sync?.type === 'MASTER_EVENT') {
      const mapped = eventById.get(String(item.syncEventId || ''));
      if (!mapped) fail(`${item.id}: SFX has no master event.`);
      if (Number(item.anchor.frame) !== Number(mapped.sceneFrame)) fail(`${item.id}: master-event SFX anchor mismatch.`);
    }
  }
}

const sourceDir = path.resolve(String(reel?.sourceDir || ''));
if (!String(reel?.sourceDir || '').trim() || !existsSync(sourceDir)) fail('reel.sourceDir missing or does not exist.');
const walk = async (dir) => {
  const chunks = [];
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) chunks.push(...await walk(full));
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) chunks.push(await readFile(full, 'utf8'));
  }
  return chunks;
};
const sourceText = (await walk(sourceDir)).join('\n');
const usesMaster = sourceText.includes('createMasterEventTiming');
const usesChoreography = sourceText.includes('createChoreographyTiming');
if (!usesMaster && !usesChoreography) fail('Remotion source is not wired to an audio-derived timing engine.');
if (plan?.rules?.animations?.sourceMustReferenceEveryAnimationEventId === true && usesMaster && !usesChoreography) {
  for (const planned of planEvents.filter((event) => String(event.kind || 'ANIMATION') === 'ANIMATION')) {
    if (!sourceText.includes(`'${planned.id}'`) && !sourceText.includes(`"${planned.id}"`)) fail(`${planned.id}: planned animation event id is not referenced by Remotion source.`);
  }
}

console.log('MASTER TIMELINE PASSED');
console.log(`words: ${words.length}`);
console.log(`captions: ${cues.length}`);
console.log(`scenes: ${scenes.length}`);
console.log(`semantic events: ${events.length}`);
console.log(`sfx events: ${sfx?.events?.length || 0}`);
console.log(`final duration: ${finalDuration} frames @ ${reel.format.fps} fps`);
console.log(`render timing engine: ${usesChoreography ? 'explicit choreography intervals' : 'master event ids'}`);
