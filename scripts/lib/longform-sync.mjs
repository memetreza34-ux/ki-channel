import {createHash} from 'node:crypto';
import {existsSync, statSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

export const LONGFORM_SYNC_CONTRACT = 'LONGFORM_CHOREOGRAPHY_V1';
export const WORD_TIMING_STATUS = 'LOCAL_FORCED_ALIGNMENT_ACCEPTED';
export const ALIGNMENT_STATUS = 'ALIGNMENT_CONSENSUS_PASSED';
export const CHOREOGRAPHY_STATUS = 'CHOREOGRAPHY_LOCKED';

export const posix = (value) => String(value).split(path.sep).join('/');
export const nonEmptyFile = (file) => existsSync(file) && statSync(file).isFile() && statSync(file).size > 0;
export const normalizeSpace = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
export const normalizeToken = (value) => String(value ?? '')
  .normalize('NFKC')
  .toLocaleLowerCase('de-DE')
  .replace(/[–—]/g, '-')
  .replace(/[^\p{L}\p{N}]+/gu, '')
  .trim();
export const splitWords = (value) => normalizeSpace(value).split(' ').filter(Boolean);
export const phraseTokens = (value) => String(value ?? '').split(/\s+/).map(normalizeToken).filter(Boolean);
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
export const writeJson = async (file, value) => {
  await mkdir(path.dirname(file), {recursive: true});
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

export const requirePackage = (rawPackage) => {
  if (!rawPackage) throw new Error('longform package argument missing.');
  const root = path.resolve(rawPackage);
  if (!existsSync(root) || !statSync(root).isDirectory()) throw new Error(`package missing: ${posix(root)}`);
  return root;
};

export const packagePath = (root, ...parts) => path.join(root, ...parts);

export const getVoicePath = (root) => {
  const candidates = ['voiceover.wav', 'voiceover.mp3'].map((name) => packagePath(root, '01-script-audio', name));
  return candidates.find(nonEmptyFile) || null;
};

export const getVersion = async (root) => {
  const file = packagePath(root, '06-projektdateien', 'LONGFORM-VERSION.json');
  if (!nonEmptyFile(file)) throw new Error(`LONGFORM-VERSION.json missing: ${posix(file)}`);
  const version = await readJson(file);
  if (version?.contract !== 'LONGFORM_V1' || Number(version?.version) !== 1) throw new Error('LONGFORM-VERSION must be LONGFORM_V1 version 1.');
  return {file, version};
};

export const safeKey = (value) => String(value ?? '')
  .trim()
  .replace(/[^a-zA-Z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'longform';

export const alignmentCacheDir = (version) => path.resolve('.cache', 'longform-alignment', safeKey(version?.sourceSlug || version?.title));
export const runtimeWavPath = (version) => path.join(alignmentCacheDir(version), 'voice.runtime.wav');

export const run = (label, command, args, options = {}) => {
  const result = spawnSync(command, args, {encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options});
  if (options.stdio !== 'inherit') {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || result.stderr || result.stdout || `exit ${result.status}`;
    throw new Error(`${label} failed: ${String(detail).trim()}`);
  }
  return result;
};

export const ffprobeDuration = (file) => {
  const result = run('ffprobe voice duration', 'ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file,
  ]);
  const seconds = Number(String(result.stdout || '').trim());
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error(`invalid audio duration for ${posix(file)}`);
  return seconds;
};

export const prepareRuntimeWav = async (root, version) => {
  const voice = getVoicePath(root);
  if (!voice) throw new Error('final user voiceover missing (voiceover.wav or voiceover.mp3).');
  const cacheDir = alignmentCacheDir(version);
  const runtime = runtimeWavPath(version);
  const metaPath = path.join(cacheDir, 'voice.runtime.meta.json');
  await mkdir(cacheDir, {recursive: true});
  const bytes = await readFile(voice);
  const fingerprint = sha256(Buffer.concat([
    Buffer.from('LONGFORM_RUNTIME_PCM_V1\n'),
    bytes,
  ]));
  let cacheHit = false;
  if (nonEmptyFile(runtime) && nonEmptyFile(metaPath)) {
    try {
      const meta = await readJson(metaPath);
      cacheHit = meta?.fingerprint === fingerprint;
    } catch {
      cacheHit = false;
    }
  }
  if (!cacheHit) {
    run('longform runtime audio preparation', 'ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', voice,
      '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', runtime,
    ], {stdio: 'inherit'});
    await writeJson(metaPath, {
      version: 1,
      status: 'RUNTIME_PCM_READY',
      fingerprint,
      source: posix(path.relative(process.cwd(), voice)),
      runtime: posix(path.relative(process.cwd(), runtime)),
      generatedAt: new Date().toISOString(),
    });
  }
  return {voice, runtime, fingerprint, cacheHit, durationSeconds: ffprobeDuration(runtime)};
};

export const mapSentences = (mapDoc) => {
  const chapters = Array.isArray(mapDoc?.chapters) ? mapDoc.chapters : [];
  const out = [];
  const chapterIds = new Set();
  const sentenceIds = new Set();
  for (const chapter of chapters) {
    const chapterId = String(chapter?.chapterId || '').trim();
    if (!chapterId) throw new Error('CHAPTER-VOICE-MAP chapter without chapterId.');
    if (chapterIds.has(chapterId)) throw new Error(`duplicate chapterId in CHAPTER-VOICE-MAP: ${chapterId}`);
    chapterIds.add(chapterId);
    const sentences = Array.isArray(chapter?.sentences) ? chapter.sentences : [];
    if (!sentences.length) throw new Error(`${chapterId}: CHAPTER-VOICE-MAP has no sentences.`);
    for (const sentence of sentences) {
      const sentenceId = String(sentence?.id || '').trim();
      const text = normalizeSpace(sentence?.text);
      if (!sentenceId || !text) throw new Error(`${chapterId}: incomplete sentence in CHAPTER-VOICE-MAP.`);
      if (sentenceIds.has(sentenceId)) throw new Error(`duplicate sentence id: ${sentenceId}`);
      sentenceIds.add(sentenceId);
      out.push({chapterId, sentenceId, text});
    }
  }
  if (!out.length) throw new Error('CHAPTER-VOICE-MAP contains no sentences.');
  return out;
};

export const reconstructTranscript = (sentences) => normalizeSpace(sentences.map((row) => row.text).join(' '));

export const phraseMatch = (row, phrase) => {
  const wanted = phraseTokens(phrase);
  if (!wanted.length) return null;
  const normalized = row.map((word) => normalizeToken(word.text));
  for (let index = 0; index <= normalized.length - wanted.length; index++) {
    let ok = true;
    for (let offset = 0; offset < wanted.length; offset++) {
      if (normalized[index + offset] !== wanted[offset]) { ok = false; break; }
    }
    if (ok) return {first: row[index], last: row[index + wanted.length - 1], firstIndex: index, lastIndex: index + wanted.length - 1};
  }
  return null;
};

export const percentile = (values, q) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1));
  return sorted[index];
};

export const frameToSeconds = (frame, fps) => Number((Number(frame) / fps).toFixed(6));
export const clock = (frame, fps) => {
  const total = Number(frame) / fps;
  const minutes = Math.floor(total / 60);
  const seconds = total - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${seconds.toFixed(3).padStart(6, '0')}`;
};

const pad = (n, width = 2) => String(n).padStart(width, '0');
export const subtitleTimestamp = (seconds, separator = ',') => {
  const safe = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const whole = Math.floor(safe % 60);
  const ms = Math.round((safe - Math.floor(safe)) * 1000);
  return `${pad(hours)}:${pad(minutes)}:${pad(whole)}${separator}${pad(ms, 3)}`;
};
