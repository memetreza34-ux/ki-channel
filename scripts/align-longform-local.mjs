#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  WORD_TIMING_STATUS,
  getVersion,
  mapSentences,
  nonEmptyFile,
  normalizeSpace,
  normalizeToken,
  packagePath,
  posix,
  prepareRuntimeWav,
  readJson,
  reconstructTranscript,
  requirePackage,
  run,
  sha256,
  splitWords,
  subtitleTimestamp,
  writeJson,
  alignmentCacheDir,
} from './lib/longform-sync.mjs';

const rawPackage = process.argv[2];
const requestedBackend = process.argv.find((arg) => arg.startsWith('--backend='))?.split('=')[1] || 'auto';
const fail = (message) => { console.error(`LOCAL LONGFORM ALIGNMENT FAILED: ${message}`); process.exit(1); };

let root;
try { root = requirePackage(rawPackage); }
catch (error) { fail(error.message); }

const transcriptPath = packagePath(root, '01-script-audio', 'VOICEOVER.txt');
const mapPath = packagePath(root, '01-script-audio', 'CHAPTER-VOICE-MAP.json');
const chaptersPath = packagePath(root, '01-script-audio', 'CHAPTERS.json');
for (const file of [transcriptPath, mapPath, chaptersPath]) if (!nonEmptyFile(file)) fail(`required file missing/empty: ${posix(file)}`);

let versionFile; let version;
try { ({file: versionFile, version} = await getVersion(root)); }
catch (error) { fail(error.message); }
const fps = Number(version?.format?.fps || 30);
if (!Number.isFinite(fps) || fps <= 0) fail('LONGFORM-VERSION.format.fps missing/invalid.');

let mapDoc; let chaptersDoc;
try {
  mapDoc = await readJson(mapPath);
  chaptersDoc = await readJson(chaptersPath);
} catch (error) { fail(`invalid JSON: ${error.message}`); }
let sentences;
try { sentences = mapSentences(mapDoc); }
catch (error) { fail(error.message); }

const canonicalTranscript = normalizeSpace(await readFile(transcriptPath, 'utf8'));
const mappedTranscript = reconstructTranscript(sentences);
if (!canonicalTranscript) fail('VOICEOVER.txt is empty.');
if (canonicalTranscript !== mappedTranscript) {
  fail('CHAPTER-VOICE-MAP does not reconstruct VOICEOVER.txt exactly. Keep one exact spoken transcript authority.');
}

const chapterRows = Array.isArray(chaptersDoc?.chapters) ? chaptersDoc.chapters : [];
if (!chapterRows.length) fail('CHAPTERS.json has no chapters.');
const chapterIds = chapterRows.map((chapter) => String(chapter?.id || '').trim());
if (chapterIds.some((id) => !id)) fail('CHAPTERS.json contains chapter without id.');
const mapChapterIds = [...new Set(sentences.map((row) => row.chapterId))];
if (chapterIds.length !== mapChapterIds.length || chapterIds.some((id, index) => id !== mapChapterIds[index])) {
  fail(`CHAPTERS order must exactly match CHAPTER-VOICE-MAP chapters. CHAPTERS=${chapterIds.join(',')} MAP=${mapChapterIds.join(',')}`);
}

let runtime;
try { runtime = await prepareRuntimeWav(root, version); }
catch (error) { fail(error.message); }

const markerPath = path.resolve('.cache', 'reel-aligner-backend.json');
if (!existsSync(markerPath)) {
  console.log('Local aligner is not installed yet; running one-time setup.');
  const args = [path.resolve('ki/scripts/setup-local-forced-aligner.mjs')];
  if (requestedBackend !== 'auto') args.push(`--backend=${requestedBackend}`);
  try { run('local aligner setup', process.execPath, args, {stdio: 'inherit'}); }
  catch (error) { fail(error.message); }
}
let marker;
try { marker = await readJson(markerPath); }
catch (error) { fail(`invalid local aligner marker: ${error.message}`); }
let backend = requestedBackend === 'auto' ? marker?.backend : requestedBackend;
if (!['mlx-qwen3', 'ctc-german'].includes(backend)) fail(`unsupported backend: ${backend}`);
if (requestedBackend !== 'auto' && marker?.backend !== backend) {
  try { run('switch local aligner backend', process.execPath, [path.resolve('ki/scripts/setup-local-forced-aligner.mjs'), `--backend=${backend}`], {stdio: 'inherit'}); }
  catch (error) { fail(error.message); }
  marker = await readJson(markerPath);
}
const python = path.resolve(String(marker?.python || ''));
if (!existsSync(python)) fail(`local aligner python missing: ${python}`);

const workDir = alignmentCacheDir(version);
await mkdir(workDir, {recursive: true});
const rawPath = path.join(workDir, 'alignment.primary.raw.json');
const cachePath = path.join(workDir, 'alignment.primary.cache.json');
const [audioBytes, transcriptBytes, mapBytes] = await Promise.all([
  readFile(runtime.runtime), readFile(transcriptPath), readFile(mapPath),
]);
const sourceFingerprint = sha256(JSON.stringify({
  version: 1,
  audioSha256: sha256(audioBytes),
  transcriptSha256: sha256(transcriptBytes),
  chapterVoiceMapSha256: sha256(mapBytes),
  backend,
  model: String(marker?.model || ''),
  fps,
}));
let cacheHit = false;
if (nonEmptyFile(rawPath) && nonEmptyFile(cachePath)) {
  try {
    const cache = await readJson(cachePath);
    cacheHit = cache?.sourceFingerprint === sourceFingerprint && cache?.backend === backend;
  } catch { cacheHit = false; }
}
if (cacheHit) {
  console.log('LONGFORM FORCED ALIGNMENT CACHE HIT — skipping model inference.');
} else {
  console.log('LONGFORM FORCED ALIGNMENT CACHE MISS — running model for exact voice/transcript/map.');
  try {
    run('longform forced alignment', python, [
      path.resolve('ki/scripts/python/align_words.py'),
      '--audio', runtime.runtime,
      '--text-file', transcriptPath,
      '--output', rawPath,
      '--backend', backend,
    ], {stdio: 'inherit'});
  } catch (error) { fail(error.message); }
  await writeJson(cachePath, {
    version: 1,
    status: 'PRIMARY_ALIGNMENT_CACHED',
    sourceFingerprint,
    backend,
    model: String(marker?.model || ''),
    audioSha256: sha256(audioBytes),
    transcriptSha256: sha256(transcriptBytes),
    chapterVoiceMapSha256: sha256(mapBytes),
    fps,
  });
}

let raw;
try { raw = await readJson(rawPath); }
catch (error) { fail(`forced alignment output invalid: ${error.message}`); }
const aligned = Array.isArray(raw?.words) ? raw.words : [];
if (!aligned.length) fail('forced aligner returned no words.');

const expected = [];
for (const sentence of sentences) {
  for (const word of splitWords(sentence.text)) expected.push({
    text: word,
    sentenceId: sentence.sentenceId,
    chapterId: sentence.chapterId,
  });
}
if (aligned.length !== expected.length) fail(`word count mismatch: aligner=${aligned.length}, canonical=${expected.length}. No fuzzy guessing allowed.`);

const words = aligned.map((word, index) => {
  const exp = expected[index];
  if (normalizeToken(word.text) !== normalizeToken(exp.text)) {
    fail(`word ${index + 1} mismatch: aligner="${word.text}" canonical="${exp.text}". No timing accepted.`);
  }
  const startSeconds = Number(word.start);
  const endSeconds = Number(word.end);
  if (!Number.isFinite(startSeconds) || !Number.isFinite(endSeconds) || startSeconds < 0 || endSeconds <= startSeconds) fail(`invalid timing for word ${index + 1}.`);
  const startFrame = Math.max(0, Math.floor(startSeconds * fps));
  const endFrame = Math.max(startFrame + 1, Math.ceil(endSeconds * fps));
  return {
    index: index + 1,
    text: exp.text,
    sentenceId: exp.sentenceId,
    chapterId: exp.chapterId,
    startSeconds: Number(startSeconds.toFixed(6)),
    endSeconds: Number(endSeconds.toFixed(6)),
    startFrame,
    endFrame,
    score: Number.isFinite(Number(word.score)) ? Number(Number(word.score).toFixed(6)) : undefined,
  };
});
for (let i = 1; i < words.length; i++) {
  if (words[i].startFrame < words[i - 1].startFrame) fail(`word timing goes backwards at word ${i + 1}.`);
}

const wordTimingsPath = packagePath(root, '01-script-audio', 'WORD-TIMINGS.json');
await writeJson(wordTimingsPath, {
  version: 1,
  status: WORD_TIMING_STATUS,
  alignmentType: 'KNOWN_TRANSCRIPT_FORCED_ALIGNMENT',
  backend: raw?.backend || backend,
  model: raw?.model || marker?.model || null,
  modelLicense: raw?.modelLicense || null,
  runtime: raw?.runtime || null,
  fps,
  audioDurationSeconds: Number(runtime.durationSeconds.toFixed(6)),
  runtimeAudio: posix(path.relative(process.cwd(), runtime.runtime)),
  sourceFingerprint,
  cacheHit,
  generatedAt: new Date().toISOString(),
  rules: {
    fuzzyWordMatching: false,
    canonicalTextAuthority: '01-script-audio/VOICEOVER.txt',
    chapterAuthority: '01-script-audio/CHAPTER-VOICE-MAP.json',
  },
  words,
});

const chapterSpeech = chapterRows.map((chapter) => {
  const row = words.filter((word) => word.chapterId === chapter.id);
  if (!row.length) fail(`${chapter.id}: no aligned words.`);
  return {chapter, speechStartFrame: row[0].startFrame, speechEndFrame: row[row.length - 1].endFrame};
});
const chapterBoundaries = [0];
for (let index = 1; index < chapterSpeech.length; index++) {
  const previousEnd = chapterSpeech[index - 1].speechEndFrame;
  const nextStart = chapterSpeech[index].speechStartFrame;
  chapterBoundaries.push(Math.max(previousEnd, Math.floor((previousEnd + nextStart) / 2)));
}
chapterBoundaries.push(Math.max(chapterSpeech.at(-1).speechEndFrame, Math.ceil(runtime.durationSeconds * fps)));
const lockedChapters = chapterSpeech.map((entry, index) => ({
  ...entry.chapter,
  startFrame: chapterBoundaries[index],
  endFrame: chapterBoundaries[index + 1],
  startSeconds: Number((chapterBoundaries[index] / fps).toFixed(6)),
  endSeconds: Number((chapterBoundaries[index + 1] / fps).toFixed(6)),
  speechStartFrame: entry.speechStartFrame,
  speechEndFrame: entry.speechEndFrame,
  speechStartSeconds: Number((entry.speechStartFrame / fps).toFixed(6)),
  speechEndSeconds: Number((entry.speechEndFrame / fps).toFixed(6)),
  timingAuthority: '01-script-audio/WORD-TIMINGS.json',
}));
await writeJson(chaptersPath, {
  ...chaptersDoc,
  status: 'VOICE_LOCKED',
  fps,
  timingAuthority: '01-script-audio/WORD-TIMINGS.json',
  chapters: lockedChapters,
});

const punctuationEnd = /[.!?;:]$/u;
const cues = [];
let cueNumber = 1;
for (const sentence of sentences) {
  const row = words.filter((word) => word.sentenceId === sentence.sentenceId);
  let cursor = 0;
  while (cursor < row.length) {
    let end = Math.min(cursor + 8, row.length);
    const startSeconds = row[cursor].startSeconds;
    for (let candidate = cursor + 2; candidate < end; candidate++) {
      const gap = Number(row[candidate + 1]?.startSeconds ?? row[candidate].endSeconds) - Number(row[candidate].endSeconds);
      const duration = Number(row[candidate].endSeconds) - Number(startSeconds);
      if (punctuationEnd.test(row[candidate].text) || gap >= 0.45 || duration >= 3.5) { end = candidate + 1; break; }
    }
    const group = row.slice(cursor, end);
    const first = group[0]; const last = group[group.length - 1];
    cues.push({
      id: `lc${String(cueNumber++).padStart(4, '0')}`,
      chapterId: sentence.chapterId,
      sentenceId: sentence.sentenceId,
      startFrame: first.startFrame,
      endFrame: last.endFrame,
      startSeconds: first.startSeconds,
      endSeconds: last.endSeconds,
      text: group.map((word) => word.text).join(' '),
      wordIndexes: group.map((word) => word.index),
    });
    cursor = end;
  }
}
const cuesPath = packagePath(root, '01-script-audio', 'SPEECH-CUES.json');
await writeJson(cuesPath, {
  version: 1,
  status: 'VOICE_LOCKED',
  fps,
  timingAuthority: '01-script-audio/WORD-TIMINGS.json',
  cues,
});

const srt = cues.map((cue, index) => `${index + 1}\n${subtitleTimestamp(cue.startSeconds)} --> ${subtitleTimestamp(cue.endSeconds)}\n${cue.text}\n`).join('\n');
const vtt = `WEBVTT\n\n${cues.map((cue) => `${subtitleTimestamp(cue.startSeconds, '.')} --> ${subtitleTimestamp(cue.endSeconds, '.')}\n${cue.text}\n`).join('\n')}`;
await writeFile(packagePath(root, '05-export', 'subtitles.srt'), srt, 'utf8');
await writeFile(packagePath(root, '05-export', 'subtitles.vtt'), vtt, 'utf8');
await writeFile(packagePath(root, '05-export', 'transcript.txt'), `${canonicalTranscript}\n`, 'utf8');

const endHoldFrames = Math.max(0, Number(version?.timingPolicy?.endHoldFrames ?? 12));
const finalDurationInFrames = Math.max(
  Math.ceil(runtime.durationSeconds * fps) + endHoldFrames,
  words[words.length - 1].endFrame + endHoldFrames,
);
await writeJson(versionFile, {
  ...version,
  syncContract: 'LONGFORM_CHOREOGRAPHY_V1',
  timingStatus: 'VOICE_ALIGNED_PENDING_CONSENSUS',
  wordTimingAuthority: '01-script-audio/WORD-TIMINGS.json',
  finalDurationInFrames,
  finalDurationSeconds: Number((finalDurationInFrames / fps).toFixed(6)),
  timingPolicy: {...version?.timingPolicy, endHoldFrames},
});

console.log('\nLOCAL LONGFORM ALIGNMENT COMPLETE');
console.log(`backend: ${raw?.backend || backend}`);
console.log(`cache: ${cacheHit ? 'HIT' : 'MISS'}`);
console.log(`word timings: ${posix(wordTimingsPath)}`);
console.log('chapters: VOICE_LOCKED');
console.log(`subtitles: ${posix(packagePath(root, '05-export', 'subtitles.srt'))}`);
console.log(`duration: ${finalDurationInFrames}f @ ${fps}fps`);
