#!/usr/bin/env node
import process from 'node:process';
import {
  ALIGNMENT_STATUS,
  CHOREOGRAPHY_STATUS,
  WORD_TIMING_STATUS,
  frameToSeconds,
  getVersion,
  nonEmptyFile,
  packagePath,
  phraseMatch,
  posix,
  readJson,
  requirePackage,
  writeJson,
} from './lib/longform-sync.mjs';

const fail = (message) => { console.error(`LONGFORM CHOREOGRAPHY COMPILE FAILED: ${message}`); process.exit(1); };
let root;
try { root = requirePackage(process.argv[2]); }
catch (error) { fail(error.message); }

let versionFile; let version;
try { ({file: versionFile, version} = await getVersion(root)); }
catch (error) { fail(error.message); }
const wordsPath = packagePath(root, '01-script-audio', 'WORD-TIMINGS.json');
const chaptersPath = packagePath(root, '01-script-audio', 'CHAPTERS.json');
const cuesPath = packagePath(root, '01-script-audio', 'SPEECH-CUES.json');
const qualityPath = packagePath(root, '06-projektdateien', 'ALIGNMENT-QUALITY.json');
const planPath = packagePath(root, '06-projektdateien', 'CHOREOGRAPHY-PLAN.json');
const outPath = packagePath(root, '06-projektdateien', 'CHOREOGRAPHY-RESOLVED.json');
for (const file of [wordsPath, chaptersPath, cuesPath, qualityPath, planPath]) if (!nonEmptyFile(file)) fail(`required file missing/empty: ${posix(file)}`);

const [wordsDoc, chaptersDoc, cuesDoc, quality, plan] = await Promise.all([
  readJson(wordsPath), readJson(chaptersPath), readJson(cuesPath), readJson(qualityPath), readJson(planPath),
]);
if (wordsDoc?.status !== WORD_TIMING_STATUS) fail(`WORD-TIMINGS.status must be ${WORD_TIMING_STATUS}.`);
if (quality?.status !== ALIGNMENT_STATUS) fail(`ALIGNMENT-QUALITY.status must be ${ALIGNMENT_STATUS}.`);
if (chaptersDoc?.status !== 'VOICE_LOCKED') fail('CHAPTERS.status must be VOICE_LOCKED.');
if (!['READY_FOR_ALIGNMENT', 'PLANNED_REQUIRES_AUDIO_ALIGNMENT'].includes(String(plan?.status || ''))) {
  fail('CHOREOGRAPHY-PLAN.status must be READY_FOR_ALIGNMENT or PLANNED_REQUIRES_AUDIO_ALIGNMENT before compile.');
}

const fps = Number(version?.format?.fps || wordsDoc?.fps || 30);
const finalDuration = Number(version?.finalDurationInFrames);
if (!Number.isFinite(fps) || fps <= 0) fail('invalid fps.');
if (!Number.isFinite(finalDuration) || finalDuration <= 0) fail('LONGFORM-VERSION.finalDurationInFrames missing; run alignment first.');
const words = Array.isArray(wordsDoc?.words) ? wordsDoc.words : [];
const chapters = Array.isArray(chaptersDoc?.chapters) ? chaptersDoc.chapters : [];
const cues = Array.isArray(cuesDoc?.cues) ? cuesDoc.cues : [];
const beats = Array.isArray(plan?.beats) ? plan.beats : [];
if (!words.length || !chapters.length || !cues.length || !beats.length) fail('words/chapters/cues/beats must all be non-empty.');

const chapterById = new Map();
for (const chapter of chapters) {
  const id = String(chapter?.id || '');
  if (!id || chapterById.has(id)) fail(`invalid/duplicate chapter id: ${id || 'missing'}`);
  chapterById.set(id, chapter);
}
const beatById = new Map();
for (const beat of beats) {
  const id = String(beat?.id || '');
  if (!id || beatById.has(id)) fail(`invalid/duplicate beat id: ${id || 'missing'}`);
  if (!beat?.chapterId || !chapterById.has(String(beat.chapterId))) fail(`${id}: unknown chapter ${beat?.chapterId || 'missing'}.`);
  if (!beat?.sentenceId) fail(`${id}: sentenceId missing.`);
  if (!beat?.visual?.target) fail(`${id}: visual.target missing.`);
  beatById.set(id, beat);
}

const wordsBySentence = new Map();
for (const word of words) {
  const sid = String(word?.sentenceId || '');
  if (!sid) fail(`word ${word?.index || '?'} missing sentenceId.`);
  const row = wordsBySentence.get(sid) || [];
  row.push(word);
  wordsBySentence.set(sid, row);
}
for (const row of wordsBySentence.values()) row.sort((a, b) => Number(a.startFrame) - Number(b.startFrame));

const resolveSpeechAnchor = (beat, anchor) => {
  const row = wordsBySentence.get(String(beat.sentenceId)) || [];
  if (!row.length) fail(`${beat.id}: no aligned words for sentence ${beat.sentenceId}.`);
  if (String(row[0].chapterId) !== String(beat.chapterId)) fail(`${beat.id}: sentence belongs to ${row[0].chapterId}, not ${beat.chapterId}.`);
  if (anchor?.type === 'SENTENCE_START') return Number(row[0].startFrame);
  if (anchor?.type === 'SENTENCE_END') return Number(row[row.length - 1].endFrame);
  if (anchor?.type === 'PHRASE_START' || anchor?.type === 'PHRASE_END') {
    const match = phraseMatch(row, anchor?.phrase);
    if (!match) fail(`${beat.id}: exact phrase not found: "${anchor?.phrase || ''}".`);
    return anchor.type === 'PHRASE_START' ? Number(match.first.startFrame) : Number(match.last.endFrame);
  }
  fail(`${beat.id}: unsupported speech anchor ${anchor?.type || 'missing'}.`);
};

const speechByBeat = new Map();
for (const beat of beats) {
  const chapter = chapterById.get(String(beat.chapterId));
  const start = resolveSpeechAnchor(beat, beat?.speech?.start);
  const end = resolveSpeechAnchor(beat, beat?.speech?.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) fail(`${beat.id}: invalid speech interval ${start}-${end}.`);
  if (start < Number(chapter.startFrame) || end > Number(chapter.endFrame)) fail(`${beat.id}: speech interval outside chapter ${beat.chapterId}.`);
  speechByBeat.set(String(beat.id), {start, end});
}

const visualStartMemo = new Map();
const resolveRef = (beat, ref, purpose, stack = []) => {
  const chapter = chapterById.get(String(beat.chapterId));
  const ownSpeech = speechByBeat.get(String(beat.id));
  const offset = Number(ref?.offsetFrames || 0);
  if (!Number.isFinite(offset)) fail(`${beat.id}: ${purpose} offsetFrames invalid.`);
  if (ref?.ref === 'speechStart') return ownSpeech.start + offset;
  if (ref?.ref === 'speechEnd') return ownSpeech.end + offset;
  if (ref?.ref === 'chapterStart') return Number(chapter.startFrame) + offset;
  if (ref?.ref === 'chapterEnd') return Number(chapter.endFrame) + offset;
  if (ref?.ref === 'beatSpeechStart' || ref?.ref === 'beatSpeechEnd') {
    const other = speechByBeat.get(String(ref?.beatId || ''));
    if (!other) fail(`${beat.id}: ${purpose} references unknown beat ${ref?.beatId || 'missing'}.`);
    return (ref.ref === 'beatSpeechStart' ? other.start : other.end) + offset;
  }
  if (ref?.ref === 'beatStart') {
    const otherId = String(ref?.beatId || '');
    if (!beatById.has(otherId)) fail(`${beat.id}: ${purpose} references unknown beatStart ${otherId || 'missing'}.`);
    return resolveVisualStart(otherId, stack) + offset;
  }
  fail(`${beat.id}: unsupported ${purpose} ref ${ref?.ref || 'missing'}.`);
};
const resolveVisualStart = (beatId, stack = []) => {
  if (visualStartMemo.has(beatId)) return visualStartMemo.get(beatId);
  if (stack.includes(beatId)) fail(`visual start dependency cycle: ${[...stack, beatId].join(' -> ')}`);
  const beat = beatById.get(beatId);
  const value = Math.round(resolveRef(beat, beat?.visual?.start, 'visual.start', [...stack, beatId]));
  visualStartMemo.set(beatId, value);
  return value;
};
for (const beat of beats) resolveVisualStart(String(beat.id));

const defaultEnter = Math.max(1, Number(plan?.rules?.defaultEnterFrames ?? 8));
const defaultExit = Math.max(1, Number(plan?.rules?.defaultExitFrames ?? 8));
const minimumHold = Math.max(0, Number(plan?.rules?.minimumHoldFrames ?? 6));
const resolved = [];
for (const beat of beats) {
  const chapter = chapterById.get(String(beat.chapterId));
  const ownSpeech = speechByBeat.get(String(beat.id));
  const start = resolveVisualStart(String(beat.id));
  const end = Math.round(resolveRef(beat, beat?.visual?.end, 'visual.end'));
  if (start < Number(chapter.startFrame) || start >= Number(chapter.endFrame)) fail(`${beat.id}: visual start ${start} outside chapter.`);
  if (end <= start || end > Number(chapter.endFrame)) fail(`${beat.id}: visual end ${end} invalid/outside chapter.`);
  const enterFrames = Math.max(1, Number(beat?.visual?.enterFrames ?? defaultEnter));
  const exitFrames = Math.max(1, Number(beat?.visual?.exitFrames ?? defaultExit));
  const available = end - start;
  if (available < enterFrames + minimumHold + exitFrames) {
    fail(`${beat.id}: visual window ${available}f too short for enter ${enterFrames}f + hold ${minimumHold}f + exit ${exitFrames}f. Fix the choreography plan; do not weaken timing.`);
  }
  const enterEnd = start + enterFrames;
  const exitStart = end - exitFrames;
  const sentenceWords = wordsBySentence.get(String(beat.sentenceId)) || [];
  const spokenWords = sentenceWords.filter((word) => Number(word.endFrame) >= ownSpeech.start && Number(word.startFrame) <= ownSpeech.end);
  const spokenText = spokenWords.map((word) => String(word.text)).join(' ').trim();
  const captionCueIds = cues
    .filter((cue) => String(cue.chapterId) === String(beat.chapterId) && Number(cue.endFrame) >= ownSpeech.start && Number(cue.startFrame) <= ownSpeech.end)
    .map((cue) => String(cue.id));
  if (!captionCueIds.length) fail(`${beat.id}: speech interval has no overlapping voice-locked subtitle cue.`);

  let sfx = null;
  if (beat?.sfx) {
    const at = beat.sfx.at || {};
    let frame;
    const offset = Number(at.offsetFrames || 0);
    if (at.ref === 'visualStart') frame = start + offset;
    else if (at.ref === 'enterEnd') frame = enterEnd + offset;
    else if (at.ref === 'speechStart') frame = ownSpeech.start + offset;
    else if (at.ref === 'speechEnd') frame = ownSpeech.end + offset;
    else if (at.ref === 'chapterStart') frame = Number(chapter.startFrame) + offset;
    else if (at.ref === 'chapterEnd') frame = Number(chapter.endFrame) + offset;
    else if (at.ref === 'beatStart') frame = resolveVisualStart(String(at.beatId || '')) + offset;
    else if (at.ref === 'beatSpeechStart') frame = Number(speechByBeat.get(String(at.beatId || ''))?.start) + offset;
    else if (at.ref === 'beatSpeechEnd') frame = Number(speechByBeat.get(String(at.beatId || ''))?.end) + offset;
    else fail(`${beat.id}: unsupported SFX ref ${at.ref || 'missing'}.`);
    frame = Math.round(frame);
    if (!Number.isFinite(frame) || frame < Number(chapter.startFrame) || frame >= Number(chapter.endFrame)) fail(`${beat.id}: SFX frame outside chapter.`);
    sfx = {
      id: String(beat.sfx.id || `${beat.id}-sfx`),
      frame,
      seconds: frameToSeconds(frame, fps),
      file: beat.sfx.file || null,
      gain: Number.isFinite(Number(beat.sfx.gain)) ? Number(beat.sfx.gain) : 1,
    };
  }

  resolved.push({
    id: String(beat.id),
    chapterId: String(beat.chapterId),
    sentenceId: String(beat.sentenceId),
    kind: String(beat?.visual?.kind || 'NATIVE'),
    target: String(beat.visual.target),
    mediaAssetId: beat?.visual?.mediaAssetId || null,
    allowOverlap: beat?.visual?.allowOverlap === true,
    spokenText,
    speech: {
      startFrame: ownSpeech.start,
      endFrame: ownSpeech.end,
      startSeconds: frameToSeconds(ownSpeech.start, fps),
      endSeconds: frameToSeconds(ownSpeech.end, fps),
    },
    visual: {
      startFrame: start,
      enterEndFrame: enterEnd,
      holdStartFrame: enterEnd,
      holdEndFrame: exitStart,
      exitStartFrame: exitStart,
      endFrame: end,
      startSeconds: frameToSeconds(start, fps),
      enterEndSeconds: frameToSeconds(enterEnd, fps),
      holdEndSeconds: frameToSeconds(exitStart, fps),
      exitStartSeconds: frameToSeconds(exitStart, fps),
      endSeconds: frameToSeconds(end, fps),
      enterFrames,
      holdFrames: exitStart - enterEnd,
      exitFrames,
    },
    captionCueIds,
    sfx,
  });
}

const byTarget = new Map();
for (const beat of resolved) {
  const key = `${beat.chapterId}:${beat.target}`;
  const row = byTarget.get(key) || [];
  row.push(beat);
  byTarget.set(key, row);
}
for (const [key, row] of byTarget) {
  row.sort((a, b) => a.visual.startFrame - b.visual.startFrame);
  for (let index = 1; index < row.length; index++) {
    const previous = row[index - 1]; const current = row[index];
    if (current.visual.startFrame < previous.visual.endFrame && !previous.allowOverlap && !current.allowOverlap) {
      fail(`${key}: overlapping visual windows ${previous.id} and ${current.id}; set allowOverlap=true only when deliberate.`);
    }
  }
}

const payload = {
  version: 1,
  status: CHOREOGRAPHY_STATUS,
  syncContract: 'LONGFORM_CHOREOGRAPHY_V1',
  authority: '01-script-audio/WORD-TIMINGS.json',
  consensusAuthority: '06-projektdateien/ALIGNMENT-QUALITY.json',
  planFile: '06-projektdateien/CHOREOGRAPHY-PLAN.json',
  fps,
  finalDurationInFrames: finalDuration,
  finalDurationSeconds: frameToSeconds(finalDuration, fps),
  generatedAt: new Date().toISOString(),
  chapters: chapters.map((chapter) => ({
    chapterId: chapter.id,
    startFrame: Number(chapter.startFrame),
    endFrame: Number(chapter.endFrame),
    startSeconds: Number(chapter.startSeconds),
    endSeconds: Number(chapter.endSeconds),
  })),
  beats: resolved,
};
await writeJson(outPath, payload);
await writeJson(versionFile, {
  ...version,
  syncContract: 'LONGFORM_CHOREOGRAPHY_V1',
  timingStatus: 'CHOREOGRAPHY_LOCKED',
  timingAuthority: '06-projektdateien/CHOREOGRAPHY-RESOLVED.json',
  wordTimingAuthority: '01-script-audio/WORD-TIMINGS.json',
  alignmentQualityAuthority: '06-projektdateien/ALIGNMENT-QUALITY.json',
});
await writeJson(packagePath(root, '06-projektdateien', 'LONGFORM-TIMING-STATUS.json'), {
  version: 1,
  status: 'LONGFORM_TIMING_LOCKED',
  syncContract: 'LONGFORM_CHOREOGRAPHY_V1',
  authority: '06-projektdateien/CHOREOGRAPHY-RESOLVED.json',
  wordAuthority: '01-script-audio/WORD-TIMINGS.json',
  consensusAuthority: '06-projektdateien/ALIGNMENT-QUALITY.json',
  fps,
  finalDurationInFrames: finalDuration,
  generatedAt: new Date().toISOString(),
  flags: {
    audioAligned: true,
    independentAlignmentConsensus: true,
    chaptersVoiceLocked: true,
    explicitSpeechWindows: true,
    explicitAnimationWindows: true,
    animationEnterHoldExitLocked: true,
    sfxAnchoredToChoreographyBeat: resolved.filter((beat) => beat.sfx).every((beat) => Number.isFinite(beat.sfx.frame)),
    subtitlesDerivedFromWordTimings: true,
    durationFromAlignedAudio: true,
  },
});

console.log('LONGFORM CHOREOGRAPHY COMPILED');
console.log(`beats: ${resolved.length}`);
console.log(`authority: ${posix(outPath)}`);
