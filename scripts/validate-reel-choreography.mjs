#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node scripts/validate-reel-choreography.mjs <reel-package-dir>');
  process.exit(2);
}
const reelDir = path.resolve(rawReelDir);
const p = (...parts) => path.join(reelDir, ...parts);
const fail = (message) => { console.error(`CHOREOGRAPHY VALIDATION FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

const reelPath = p('06-projektdateien','reel.json');
const planPath = p('06-projektdateien','CHOREOGRAPHY-PLAN.json');
const resolvedPath = p('06-projektdateien','CHOREOGRAPHY-RESOLVED.json');
const captionsPath = p('03-caption','subtitle-cues.json');
const wordsPath = p('01-script-audio','WORD-TIMINGS.json');
const sfxPath = p('06-projektdateien','sfx-events.json');
for (const file of [reelPath, planPath, resolvedPath, captionsPath, wordsPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);

const reel = await readJson(reelPath);
const plan = await readJson(planPath);
const resolved = await readJson(resolvedPath);
const captions = await readJson(captionsPath);
const wordsDoc = await readJson(wordsPath);
const sfx = existsSync(sfxPath) ? await readJson(sfxPath) : null;
if (resolved?.status !== 'CHOREOGRAPHY_LOCKED') fail('resolved choreography is not locked.');
if (resolved?.authority !== '01-script-audio/WORD-TIMINGS.json') fail('choreography authority mismatch.');
if (String(wordsDoc?.status || '') !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') fail('word timings not accepted.');
if (!String(captions?.timingStatus || '').includes('VOICE_LOCKED')) fail('captions not voice locked.');

const planBeats = Array.isArray(plan?.beats) ? plan.beats : [];
const beats = Array.isArray(resolved?.beats) ? resolved.beats : [];
const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
if (!planBeats.length || beats.length !== planBeats.length) fail(`resolved beat count ${beats.length} != planned ${planBeats.length}.`);
if (!scenes.length || !cues.length) fail('scenes/captions missing.');
const sceneById = new Map(scenes.map((scene) => [String(scene.sceneId), scene]));
const cueById = new Map(cues.map((cue) => [String(cue.id), cue]));
const beatById = new Map(beats.map((beat) => [String(beat.id), beat]));

for (const planned of planBeats) {
  const beat = beatById.get(String(planned.id));
  if (!beat) fail(`planned beat unresolved: ${planned.id}`);
  const scene = sceneById.get(String(beat.sceneId));
  if (!scene) fail(`${beat.id}: unknown scene.`);
  const speech = beat.speech || {};
  const visual = beat.visual || {};
  for (const key of ['startFrame','endFrame']) if (!Number.isFinite(Number(speech[key]))) fail(`${beat.id}: speech.${key} invalid.`);
  for (const key of ['startFrame','enterEndFrame','holdStartFrame','holdEndFrame','exitStartFrame','endFrame']) if (!Number.isFinite(Number(visual[key]))) fail(`${beat.id}: visual.${key} invalid.`);
  if (speech.endFrame < speech.startFrame) fail(`${beat.id}: speech window backwards.`);
  if (!(visual.startFrame < visual.enterEndFrame && visual.enterEndFrame <= visual.holdStartFrame && visual.holdStartFrame <= visual.holdEndFrame && visual.holdEndFrame <= visual.exitStartFrame && visual.exitStartFrame < visual.endFrame)) fail(`${beat.id}: animation phases are not monotonic.`);
  if (visual.startFrame < scene.startFrame || visual.endFrame > scene.endFrame) fail(`${beat.id}: visual window outside scene.`);
  if (speech.startFrame < scene.startFrame || speech.endFrame > scene.endFrame) fail(`${beat.id}: speech window outside scene.`);
  if (!String(beat.target || '').trim()) fail(`${beat.id}: target missing.`);
  if (!Array.isArray(beat.captionCueIds) || !beat.captionCueIds.length) fail(`${beat.id}: captionCueIds missing.`);
  for (const cueId of beat.captionCueIds) if (!cueById.has(String(cueId))) fail(`${beat.id}: unknown caption cue ${cueId}.`);
}

for (let i = 1; i < scenes.length; i++) if (Number(scenes[i].startFrame) !== Number(scenes[i - 1].endFrame)) fail(`${scenes[i].sceneId}: scene gap/overlap.`);
if (Number(scenes[0].startFrame) !== 0) fail('scene1 must start at frame 0.');
if (Number(scenes[scenes.length - 1].endFrame) !== Number(reel?.format?.finalDurationInFrames)) fail('last scene must end at final duration.');

if (sfx && Array.isArray(sfx.events)) {
  const beatBySfx = new Map(beats.filter((beat) => beat.sfx).map((beat) => [String(beat.sfx.id), beat]));
  for (const event of sfx.events) {
    const beat = beatBySfx.get(String(event.id));
    if (!beat) fail(`${event.id}: SFX has no choreography beat.`);
    if (event?.sync?.type !== 'CHOREOGRAPHY_BEAT' || String(event?.sync?.beatId) !== String(beat.id)) fail(`${event.id}: SFX sync is not choreography beat.`);
    const scene = sceneById.get(String(event.sceneId));
    const absolute = Number(scene.startFrame) + Number(event?.anchor?.frame);
    if (absolute !== Number(beat.sfx.frame)) fail(`${event.id}: SFX frame ${absolute} != beat frame ${beat.sfx.frame}.`);
  }
}

const walk = async (dir) => {
  const chunks = [];
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const full = path.join(dir,entry.name);
    if (entry.isDirectory()) chunks.push(...await walk(full));
    else if (/\.(?:ts|tsx)$/i.test(entry.name)) chunks.push(await readFile(full,'utf8'));
  }
  return chunks;
};
const sourceDir = path.resolve(String(reel?.sourceDir || ''));
if (!existsSync(sourceDir)) fail(`sourceDir missing: ${sourceDir}`);
const sourceText = (await walk(sourceDir)).join('\n');
if (!sourceText.includes('createChoreographyTiming')) fail('Remotion source does not consume choreography timing.');
for (const beat of beats) if (!sourceText.includes(`'${beat.id}'`) && !sourceText.includes(`\"${beat.id}\"`)) fail(`${beat.id}: beat id is not used by Remotion source.`);

console.log('CHOREOGRAPHY VALIDATION PASSED');
console.log(`beats: ${beats.length}`);
console.log(`scenes: ${scenes.length}`);
console.log(`captions: ${cues.length}`);
console.log(`sfx: ${sfx?.events?.length || 0}`);
console.log('Every planned beat has explicit speech, ENTER, HOLD and EXIT ranges.');
