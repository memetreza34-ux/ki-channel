#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  ALIGNMENT_STATUS,
  CHOREOGRAPHY_STATUS,
  LONGFORM_SYNC_CONTRACT,
  WORD_TIMING_STATUS,
  getVersion,
  nonEmptyFile,
  packagePath,
  posix,
  readJson,
  requirePackage,
} from './lib/longform-sync.mjs';

const renderSource = process.argv.includes('--render-source');
const errors = [];
const fail = (message) => errors.push(message);
let root;
try { root = requirePackage(process.argv[2]); }
catch (error) { console.error(`LONGFORM CHOREOGRAPHY VALIDATION FAILED: ${error.message}`); process.exit(1); }

let version;
try { ({version} = await getVersion(root)); }
catch (error) { fail(error.message); }

const required = {
  words: '01-script-audio/WORD-TIMINGS.json',
  chapters: '01-script-audio/CHAPTERS.json',
  cues: '01-script-audio/SPEECH-CUES.json',
  plan: '06-projektdateien/CHOREOGRAPHY-PLAN.json',
  quality: '06-projektdateien/ALIGNMENT-QUALITY.json',
  resolved: '06-projektdateien/CHOREOGRAPHY-RESOLVED.json',
  status: '06-projektdateien/LONGFORM-TIMING-STATUS.json',
  audit: '06-projektdateien/TIMELINE-AUDIT.md',
};
const docs = {};
for (const [name, relative] of Object.entries(required)) {
  const file = packagePath(root, relative);
  if (!nonEmptyFile(file)) { fail(`required sync artifact missing/empty: ${relative}`); continue; }
  if (name === 'audit') continue;
  try { docs[name] = await readJson(file); }
  catch (error) { fail(`invalid JSON ${relative}: ${error.message}`); }
}

if (version) {
  if (version.syncContract !== LONGFORM_SYNC_CONTRACT) fail(`LONGFORM-VERSION.syncContract must be ${LONGFORM_SYNC_CONTRACT}.`);
  if (version.timingStatus !== 'CHOREOGRAPHY_LOCKED') fail('LONGFORM-VERSION.timingStatus must be CHOREOGRAPHY_LOCKED.');
  if (version.timingAuthority !== '06-projektdateien/CHOREOGRAPHY-RESOLVED.json') fail('LONGFORM-VERSION.timingAuthority must point to CHOREOGRAPHY-RESOLVED.json.');
}
if (docs.words?.status !== WORD_TIMING_STATUS) fail(`WORD-TIMINGS.status must be ${WORD_TIMING_STATUS}.`);
if (docs.quality?.status !== ALIGNMENT_STATUS) fail(`ALIGNMENT-QUALITY.status must be ${ALIGNMENT_STATUS}.`);
if (docs.chapters?.status !== 'VOICE_LOCKED') fail('CHAPTERS.status must be VOICE_LOCKED.');
if (docs.cues?.status !== 'VOICE_LOCKED') fail('SPEECH-CUES.status must be VOICE_LOCKED.');
if (docs.resolved?.status !== CHOREOGRAPHY_STATUS) fail(`CHOREOGRAPHY-RESOLVED.status must be ${CHOREOGRAPHY_STATUS}.`);
if (docs.status?.status !== 'LONGFORM_TIMING_LOCKED') fail('LONGFORM-TIMING-STATUS.status must be LONGFORM_TIMING_LOCKED.');

const fps = Number(docs.resolved?.fps || version?.format?.fps || 30);
const finalDuration = Number(docs.resolved?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('resolved fps invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('resolved finalDurationInFrames invalid.');
if (version && Number(version.finalDurationInFrames) !== finalDuration) fail('LONGFORM-VERSION and CHOREOGRAPHY-RESOLVED finalDurationInFrames differ.');
if (docs.status && Number(docs.status.finalDurationInFrames) !== finalDuration) fail('LONGFORM-TIMING-STATUS and resolved duration differ.');

const chapters = Array.isArray(docs.chapters?.chapters) ? docs.chapters.chapters : [];
const chapterById = new Map();
let previousEnd = null;
for (const chapter of chapters) {
  const id = String(chapter?.id || '');
  const start = Number(chapter?.startFrame); const end = Number(chapter?.endFrame);
  if (!id || chapterById.has(id)) fail(`invalid/duplicate chapter id ${id || 'missing'}.`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) fail(`${id || '?'}: invalid chapter interval.`);
  if (previousEnd !== null && start !== previousEnd) fail(`${id}: chapters are not contiguous (${start} != ${previousEnd}).`);
  chapterById.set(id, chapter);
  previousEnd = end;
}
if (!chapters.length) fail('CHAPTERS has no chapters.');
if (chapters.length && Number(chapters[0].startFrame) !== 0) fail('first chapter must start at frame 0.');
const audioDuration = Number(docs.words?.audioDurationSeconds);
if (chapters.length && Number.isFinite(audioDuration)) {
  const audioEndFrame = Math.ceil(audioDuration * fps);
  if (Math.abs(Number(chapters.at(-1).endFrame) - audioEndFrame) > 2) fail(`last chapter end must follow actual audio (${chapters.at(-1).endFrame}f vs ${audioEndFrame}f).`);
}

const planned = Array.isArray(docs.plan?.beats) ? docs.plan.beats : [];
const resolved = Array.isArray(docs.resolved?.beats) ? docs.resolved.beats : [];
if (!planned.length) fail('CHOREOGRAPHY-PLAN has no beats.');
if (planned.length !== resolved.length) fail(`planned/resolved beat count mismatch ${planned.length}/${resolved.length}.`);
const planIds = planned.map((beat) => String(beat?.id || ''));
const resolvedIds = resolved.map((beat) => String(beat?.id || ''));
if (new Set(planIds).size !== planIds.length) fail('CHOREOGRAPHY-PLAN contains duplicate beat IDs.');
if (new Set(resolvedIds).size !== resolvedIds.length) fail('CHOREOGRAPHY-RESOLVED contains duplicate beat IDs.');
for (const id of planIds) if (!resolvedIds.includes(id)) fail(`planned beat not resolved: ${id}.`);

const cueIds = new Set((Array.isArray(docs.cues?.cues) ? docs.cues.cues : []).map((cue) => String(cue.id)));
for (const beat of resolved) {
  const chapter = chapterById.get(String(beat.chapterId));
  if (!chapter) { fail(`${beat.id}: unknown chapter ${beat.chapterId}.`); continue; }
  const speech = beat.speech || {}; const visual = beat.visual || {};
  const speechStart = Number(speech.startFrame); const speechEnd = Number(speech.endFrame);
  const start = Number(visual.startFrame); const enterEnd = Number(visual.enterEndFrame);
  const holdStart = Number(visual.holdStartFrame); const holdEnd = Number(visual.holdEndFrame);
  const exitStart = Number(visual.exitStartFrame); const end = Number(visual.endFrame);
  if (!(speechStart >= Number(chapter.startFrame) && speechStart < speechEnd && speechEnd <= Number(chapter.endFrame))) fail(`${beat.id}: speech interval invalid/outside chapter.`);
  if (!(start >= Number(chapter.startFrame) && start < enterEnd && enterEnd === holdStart && holdStart <= holdEnd && holdEnd === exitStart && exitStart < end && end <= Number(chapter.endFrame))) {
    fail(`${beat.id}: visual phases must be strict start < ENTER_END = HOLD_START <= HOLD_END = EXIT_START < end inside chapter.`);
  }
  if (!String(beat.target || '').trim()) fail(`${beat.id}: target missing.`);
  if (!String(beat.spokenText || '').trim()) fail(`${beat.id}: spokenText missing.`);
  const overlapCues = Array.isArray(beat.captionCueIds) ? beat.captionCueIds : [];
  if (!overlapCues.length || overlapCues.some((id) => !cueIds.has(String(id)))) fail(`${beat.id}: invalid/missing captionCueIds.`);
  if (beat.sfx) {
    const frame = Number(beat.sfx.frame);
    if (!Number.isFinite(frame) || frame < Number(chapter.startFrame) || frame >= Number(chapter.endFrame)) fail(`${beat.id}: SFX frame outside chapter.`);
  }
}

const byTarget = new Map();
for (const beat of resolved) {
  if (beat.allowOverlap) continue;
  const key = `${beat.chapterId}:${beat.target}`;
  const row = byTarget.get(key) || [];
  row.push(beat);
  byTarget.set(key, row);
}
for (const [key, row] of byTarget) {
  row.sort((a, b) => Number(a.visual.startFrame) - Number(b.visual.startFrame));
  for (let i = 1; i < row.length; i++) if (Number(row[i].visual.startFrame) < Number(row[i - 1].visual.endFrame)) fail(`${key}: overlapping non-overlap beats ${row[i - 1].id}/${row[i].id}.`);
}

if (renderSource && version?.sourceSlug) {
  const sourceRoot = path.resolve('ki', 'src', 'longform', String(version.sourceSlug));
  if (!existsSync(sourceRoot) || !statSync(sourceRoot).isDirectory()) fail(`longform source missing: ${posix(sourceRoot)}`);
  else {
    const walk = async (dir) => {
      const out = [];
      for (const entry of await readdir(dir, {withFileTypes: true})) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...await walk(file));
        else if (entry.isFile() && /\.(ts|tsx)$/i.test(entry.name)) out.push(file);
      }
      return out;
    };
    const files = await walk(sourceRoot);
    const text = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
    if (!text.includes('createLongformChoreographyTiming')) fail('render source must consume createLongformChoreographyTiming().');
    if (!text.includes('CHOREOGRAPHY-RESOLVED.json')) fail('render source must import/bind the exact CHOREOGRAPHY-RESOLVED.json authority.');
  }

  const mediaPath = packagePath(root, '02-visuals', 'MEDIA-PLAN.json');
  if (nonEmptyFile(mediaPath)) {
    const media = await readJson(mediaPath);
    const byId = new Map((Array.isArray(media?.assets) ? media.assets : []).map((asset) => [String(asset.assetId), asset]));
    for (const beat of resolved.filter((row) => row.mediaAssetId)) {
      const asset = byId.get(String(beat.mediaAssetId));
      if (!asset) fail(`${beat.id}: mediaAssetId ${beat.mediaAssetId} not found in MEDIA-PLAN.`);
      else if (asset.status !== 'APPROVED' || asset.rightsVerified !== true) fail(`${beat.id}: mediaAssetId ${beat.mediaAssetId} is not APPROVED + rightsVerified.`);
    }
  }
}

if (errors.length) {
  console.error(`LONGFORM CHOREOGRAPHY VALIDATION FAILED (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('LONGFORM CHOREOGRAPHY VALIDATION PASSED');
console.log(`beats: ${resolved.length}`);
console.log(`mode: ${renderSource ? 'RENDER_SOURCE_LOCKED' : 'TIMING_ONLY'}`);
