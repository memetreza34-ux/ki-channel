#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawReelDir = process.argv[2];
if (!rawReelDir) {
  console.error('Usage: node ki/scripts/compile-reel-choreography.mjs <reel-package-dir>');
  process.exit(2);
}

const reelDir = path.resolve(rawReelDir);
const p = (...parts) => path.join(reelDir, ...parts);
const fail = (message) => { console.error(`CHOREOGRAPHY COMPILE FAILED: ${message}`); process.exit(1); };
const readJson = async (file) => {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { fail(`${file} missing/invalid: ${error instanceof Error ? error.message : error}`); }
};

const reelPath = p('06-projektdateien', 'reel.json');
const wordsPath = p('01-script-audio', 'WORD-TIMINGS.json');
const captionsPath = p('03-caption', 'subtitle-cues.json');
const planPath = p('06-projektdateien', 'CHOREOGRAPHY-PLAN.json');
const outPath = p('06-projektdateien', 'CHOREOGRAPHY-RESOLVED.json');
const auditPath = p('06-projektdateien', 'TIMELINE-AUDIT.md');
const sfxPath = p('06-projektdateien', 'sfx-events.json');
for (const file of [reelPath, wordsPath, captionsPath, planPath]) if (!existsSync(file)) fail(`required file missing: ${file}`);

const reel = await readJson(reelPath);
const wordsDoc = await readJson(wordsPath);
const captions = await readJson(captionsPath);
const plan = await readJson(planPath);
let sfxPlan = existsSync(sfxPath) ? await readJson(sfxPath) : null;

const fps = Number(reel?.format?.fps);
const finalDuration = Number(reel?.format?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('reel.format.fps missing/invalid.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('reel.format.finalDurationInFrames missing. Run audio alignment first.');
if (String(wordsDoc?.status || '') !== 'LOCAL_FORCED_ALIGNMENT_ACCEPTED') fail('WORD-TIMINGS.json is not accepted alignment output.');
if (!String(captions?.timingStatus || '').includes('VOICE_LOCKED')) fail('captions must be voice locked before choreography compile.');

const words = Array.isArray(wordsDoc?.words) ? wordsDoc.words : [];
const cues = Array.isArray(captions?.cues) ? captions.cues : [];
const scenes = Array.isArray(reel?.scenes) ? reel.scenes : [];
const beats = Array.isArray(plan?.beats) ? plan.beats : [];
if (!words.length || !cues.length || !scenes.length || !beats.length) fail('words/cues/scenes/beats missing.');
const sceneById = new Map(scenes.map((scene) => [String(scene.sceneId), scene]));
const beatById = new Map();
for (const beat of beats) {
  if (!beat?.id) fail('beat without id.');
  if (beatById.has(beat.id)) fail(`duplicate beat id: ${beat.id}`);
  beatById.set(beat.id, beat);
}

const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase('de-DE').replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}]+/gu, '').trim();
const tokens = (value) => String(value ?? '').split(/\s+/).map(normalize).filter(Boolean);
const frameToSeconds = (frame) => Number((Number(frame) / fps).toFixed(3));
const fmtTime = (frame) => {
  const total = Number(frame) / fps;
  const minutes = Math.floor(total / 60);
  const seconds = total - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
};

const wordsBySentence = new Map();
for (const word of words) {
  const sid = String(word?.sentenceId || '').trim();
  if (!sid) fail(`word ${word?.index ?? '?'} missing sentenceId.`);
  const row = wordsBySentence.get(sid) || [];
  row.push(word);
  wordsBySentence.set(sid, row);
}
for (const row of wordsBySentence.values()) row.sort((a, b) => Number(a.startFrame) - Number(b.startFrame));

const phraseMatch = (row, phrase) => {
  const wanted = tokens(phrase);
  if (!wanted.length) return null;
  const normalized = row.map((word) => normalize(word.text));
  for (let index = 0; index <= normalized.length - wanted.length; index++) {
    let ok = true;
    for (let offset = 0; offset < wanted.length; offset++) if (normalized[index + offset] !== wanted[offset]) { ok = false; break; }
    if (ok) return {first: row[index], last: row[index + wanted.length - 1], firstIndex: index, lastIndex: index + wanted.length - 1};
  }
  return null;
};

const resolveSpeechAnchor = (beat, anchor) => {
  const row = wordsBySentence.get(String(beat.sentenceId)) || [];
  if (!row.length) fail(`${beat.id}: no aligned words for ${beat.sentenceId}.`);
  if (anchor?.type === 'SENTENCE_START') return Number(row[0].startFrame);
  if (anchor?.type === 'SENTENCE_END') return Number(row[row.length - 1].endFrame);
  if (anchor?.type === 'PHRASE_START' || anchor?.type === 'PHRASE_END') {
    const match = phraseMatch(row, anchor.phrase);
    if (!match) fail(`${beat.id}: exact phrase not found: "${anchor?.phrase || ''}".`);
    return anchor.type === 'PHRASE_START' ? Number(match.first.startFrame) : Number(match.last.endFrame);
  }
  fail(`${beat.id}: unsupported speech anchor ${anchor?.type || 'missing'}.`);
};

const speech = new Map();
for (const beat of beats) {
  const scene = sceneById.get(String(beat.sceneId));
  if (!scene) fail(`${beat.id}: unknown scene ${beat.sceneId}.`);
  const start = resolveSpeechAnchor(beat, beat?.speech?.start);
  const end = resolveSpeechAnchor(beat, beat?.speech?.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) fail(`${beat.id}: invalid speech window ${start}-${end}.`);
  if (start < Number(scene.startFrame) || end > Number(scene.endFrame)) fail(`${beat.id}: speech window outside scene.`);
  speech.set(beat.id, {start, end});
}

const visualStart = new Map();
const resolveStartRef = (beat, ref) => {
  const scene = sceneById.get(String(beat.sceneId));
  const own = speech.get(beat.id);
  const offset = Number(ref?.offsetFrames || 0);
  if (ref?.ref === 'speechStart') return own.start + offset;
  if (ref?.ref === 'speechEnd') return own.end + offset;
  if (ref?.ref === 'sceneStart') return Number(scene.startFrame) + offset;
  if (ref?.ref === 'sceneEnd') return Number(scene.endFrame) + offset;
  if (ref?.ref === 'beatStart') {
    if (!visualStart.has(ref.beatId)) fail(`${beat.id}: beatStart ${ref.beatId} must reference an earlier beat.`);
    return Number(visualStart.get(ref.beatId)) + offset;
  }
  if (ref?.ref === 'beatEnd') {
    const other = speech.get(ref.beatId);
    if (!other) fail(`${beat.id}: unknown beatEnd ${ref.beatId}.`);
    return Number(other.end) + offset;
  }
  fail(`${beat.id}: unsupported start ref ${ref?.ref || 'missing'}.`);
};

for (const beat of beats) {
  const scene = sceneById.get(String(beat.sceneId));
  const start = Math.round(resolveStartRef(beat, beat?.visual?.start));
  if (start < Number(scene.startFrame) || start >= Number(scene.endFrame)) fail(`${beat.id}: visual start ${start} outside scene.`);
  visualStart.set(beat.id, start);
}

const resolveEndRef = (beat, ref) => {
  const scene = sceneById.get(String(beat.sceneId));
  const own = speech.get(beat.id);
  const offset = Number(ref?.offsetFrames || 0);
  if (ref?.ref === 'speechStart') return own.start + offset;
  if (ref?.ref === 'speechEnd') return own.end + offset;
  if (ref?.ref === 'sceneStart') return Number(scene.startFrame) + offset;
  if (ref?.ref === 'sceneEnd') return Number(scene.endFrame) + offset;
  if (ref?.ref === 'beatStart') {
    if (!visualStart.has(ref.beatId)) fail(`${beat.id}: unknown beatStart ${ref.beatId}.`);
    return Number(visualStart.get(ref.beatId)) + offset;
  }
  if (ref?.ref === 'beatEnd') {
    const other = speech.get(ref.beatId);
    if (!other) fail(`${beat.id}: unknown beatEnd ${ref.beatId}.`);
    return Number(other.end) + offset;
  }
  fail(`${beat.id}: unsupported end ref ${ref?.ref || 'missing'}.`);
};

const defaultEnter = Math.max(1, Number(plan?.rules?.defaultEnterFrames ?? 8));
const defaultExit = Math.max(1, Number(plan?.rules?.defaultExitFrames ?? 6));
const minHold = Math.max(0, Number(plan?.rules?.minimumHoldFrames ?? 3));
const resolved = [];
for (const beat of beats) {
  const scene = sceneById.get(String(beat.sceneId));
  const ownSpeech = speech.get(beat.id);
  const start = Number(visualStart.get(beat.id));
  const end = Math.round(resolveEndRef(beat, beat?.visual?.end));
  if (end <= start) fail(`${beat.id}: visual end ${end} <= start ${start}.`);
  if (end > Number(scene.endFrame)) fail(`${beat.id}: visual end ${end} exceeds scene ${scene.endFrame}.`);
  const available = end - start;
  const requestedEnter = Math.max(1, Number(beat?.visual?.enterFrames ?? defaultEnter));
  const requestedExit = Math.max(1, Number(beat?.visual?.exitFrames ?? defaultExit));
  if (available < requestedEnter + requestedExit + minHold) fail(`${beat.id}: visual window ${available}f too short for enter ${requestedEnter}f + hold ${minHold}f + exit ${requestedExit}f.`);
  const enterEnd = start + requestedEnter;
  const exitStart = end - requestedExit;
  const row = wordsBySentence.get(String(beat.sentenceId)) || [];
  const spokenWords = row.filter((word) => Number(word.endFrame) >= ownSpeech.start && Number(word.startFrame) <= ownSpeech.end);
  const spokenText = spokenWords.map((word) => String(word.text)).join(' ').trim();
  const captionCueIds = cues.filter((cue) => String(cue.sceneId) === String(beat.sceneId) && Number(cue.endFrame) >= ownSpeech.start && Number(cue.startFrame) <= ownSpeech.end).map((cue) => String(cue.id));
  if (!captionCueIds.length) fail(`${beat.id}: speech range has no overlapping caption cue.`);
  let sfx = null;
  if (beat.sfx) {
    const at = beat.sfx.at || {};
    const offset = Number(at.offsetFrames || 0);
    let frame;
    if (at.ref === 'visualStart') frame = start + offset;
    else if (at.ref === 'speechStart') frame = ownSpeech.start + offset;
    else if (at.ref === 'speechEnd') frame = ownSpeech.end + offset;
    else if (at.ref === 'sceneStart') frame = Number(scene.startFrame) + offset;
    else if (at.ref === 'sceneEnd') frame = Number(scene.endFrame) + offset;
    else if (at.ref === 'beatStart') frame = Number(visualStart.get(at.beatId)) + offset;
    else if (at.ref === 'beatEnd') frame = Number(speech.get(at.beatId)?.end) + offset;
    else fail(`${beat.id}: unsupported SFX ref ${at.ref || 'missing'}.`);
    if (!Number.isFinite(frame) || frame < Number(scene.startFrame) || frame >= Number(scene.endFrame)) fail(`${beat.id}: SFX frame outside scene.`);
    sfx = {id: String(beat.sfx.id), frame: Math.round(frame), seconds: frameToSeconds(frame)};
  }
  resolved.push({
    id: String(beat.id),
    sceneId: String(beat.sceneId),
    sentenceId: String(beat.sentenceId),
    target: String(beat?.visual?.target || ''),
    spokenText,
    speech: {startFrame: ownSpeech.start, endFrame: ownSpeech.end, startSeconds: frameToSeconds(ownSpeech.start), endSeconds: frameToSeconds(ownSpeech.end)},
    visual: {
      startFrame: start,
      enterEndFrame: enterEnd,
      holdStartFrame: enterEnd,
      holdEndFrame: exitStart,
      exitStartFrame: exitStart,
      endFrame: end,
      startSeconds: frameToSeconds(start),
      enterEndSeconds: frameToSeconds(enterEnd),
      exitStartSeconds: frameToSeconds(exitStart),
      endSeconds: frameToSeconds(end),
      enterFrames: requestedEnter,
      holdFrames: exitStart - enterEnd,
      exitFrames: requestedExit
    },
    captionCueIds,
    sfx
  });
}

// A target may not have two independent visible windows overlapping inside the same scene.
const byTarget = new Map();
for (const beat of resolved) {
  const key = `${beat.sceneId}:${beat.target}`;
  const row = byTarget.get(key) || [];
  row.push(beat);
  byTarget.set(key, row);
}
for (const [key, row] of byTarget) {
  row.sort((a, b) => a.visual.startFrame - b.visual.startFrame);
  for (let i = 1; i < row.length; i++) if (row[i].visual.startFrame < row[i - 1].visual.endFrame) fail(`${key}: overlapping windows ${row[i - 1].id} and ${row[i].id}.`);
}

if (sfxPlan && Array.isArray(sfxPlan.events)) {
  const beatBySfx = new Map(resolved.filter((beat) => beat.sfx).map((beat) => [beat.sfx.id, beat]));
  sfxPlan = {
    ...sfxPlan,
    status: 'CHOREOGRAPHY_ANCHORED',
    syncAuthority: '06-projektdateien/CHOREOGRAPHY-RESOLVED.json',
    events: sfxPlan.events.map((event) => {
      const beat = beatBySfx.get(String(event.id));
      if (!beat) fail(`${event.id}: no choreography beat carries this SFX id.`);
      const scene = sceneById.get(String(event.sceneId));
      if (!scene || String(event.sceneId) !== beat.sceneId) fail(`${event.id}: SFX scene mismatch.`);
      return {
        ...event,
        syncEventId: beat.id,
        sync: {type: 'CHOREOGRAPHY_BEAT', beatId: beat.id},
        anchor: {type: 'SCENE_OFFSET', frame: beat.sfx.frame - Number(scene.startFrame)}
      };
    })
  };
  await writeFile(sfxPath, `${JSON.stringify(sfxPlan, null, 2)}\n`, 'utf8');
}

const payload = {
  version: 1,
  status: 'CHOREOGRAPHY_LOCKED',
  authority: '01-script-audio/WORD-TIMINGS.json',
  planFile: '06-projektdateien/CHOREOGRAPHY-PLAN.json',
  fps,
  finalDurationInFrames: finalDuration,
  generatedAt: new Date().toISOString(),
  scenes: scenes.map((scene) => ({sceneId: scene.sceneId, startFrame: scene.startFrame, endFrame: scene.endFrame, startSeconds: frameToSeconds(scene.startFrame), endSeconds: frameToSeconds(scene.endFrame)})),
  beats: resolved,
  rules: {
    noApproximateTiming: true,
    everyBeatHasSpeechWindow: true,
    everyBeatHasVisualWindow: true,
    everyBeatListsCaptionCueIds: true,
    everySfxUsesBeatWindow: true
  }
};
await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [
  '# Reel Timeline Audit',
  '',
  `- Status: **${payload.status}**`,
  `- FPS: **${fps}**`,
  `- Final duration: **${frameToSeconds(finalDuration).toFixed(3)} s**`,
  '- Authority: **WORD-TIMINGS.json + CHOREOGRAPHY-PLAN.json**',
  '',
  '| Scene | Beat | Gesprochen von–bis | Gesprochener Text | Animation ENTER | HOLD | EXIT | Untertitel | SFX |',
  '|---|---|---:|---|---:|---:|---:|---|---:|'
];
for (const beat of resolved) {
  const speechRange = `${fmtTime(beat.speech.startFrame)}–${fmtTime(beat.speech.endFrame)}`;
  const enterRange = `${fmtTime(beat.visual.startFrame)}–${fmtTime(beat.visual.enterEndFrame)}`;
  const holdRange = `${fmtTime(beat.visual.holdStartFrame)}–${fmtTime(beat.visual.holdEndFrame)}`;
  const exitRange = `${fmtTime(beat.visual.exitStartFrame)}–${fmtTime(beat.visual.endFrame)}`;
  const text = beat.spokenText.replace(/\|/g, '\\|');
  const captionsText = beat.captionCueIds.join(', ');
  const sfxText = beat.sfx ? `${beat.sfx.id} @ ${fmtTime(beat.sfx.frame)}` : '—';
  lines.push(`| ${beat.sceneId} | ${beat.id} → ${beat.target} | ${speechRange} | ${text} | ${enterRange} | ${holdRange} | ${exitRange} | ${captionsText} | ${sfxText} |`);
}
lines.push('', '## Szenen', '');
for (const scene of payload.scenes) lines.push(`- **${scene.sceneId}**: ${fmtTime(scene.startFrame)}–${fmtTime(scene.endFrame)} (${scene.startFrame}–${scene.endFrame}f)`);
await writeFile(auditPath, `${lines.join('\n')}\n`, 'utf8');

console.log('CHOREOGRAPHY COMPILED');
console.log(`beats: ${resolved.length}`);
console.log(`resolved: ${outPath}`);
console.log(`audit: ${auditPath}`);
console.log('Every beat now has an explicit speech interval, enter interval, hold interval, exit interval, caption references and optional SFX frame.');
