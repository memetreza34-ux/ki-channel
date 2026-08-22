#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
  toCaptions,
} from '@remotion/install-whisper-cpp';

const WHISPER_CPP_VERSION = '1.5.5';
const MODEL = process.env.KI_WHISPER_MODEL || 'medium';
const LANGUAGE = 'de';
const FPS = 30;

const packageDirArg = process.argv[2];
if (!packageDirArg || packageDirArg === '--help') {
  console.log('Usage: node ki/scripts/align-voiceover-whisper.mjs <reel-package-dir>');
  console.log('Optional env: KI_WHISPER_MODEL=medium|small|large-v3|large-v3-turbo');
  process.exit(packageDirArg ? 0 : 1);
}

const root = process.cwd();
const packageDir = path.resolve(packageDirArg);
const audioDir = path.join(packageDir, '01-script-audio');
const captionDir = path.join(packageDir, '03-caption');
const copyPath = path.join(audioDir, 'VOICEOVER-ZUM-KOPIEREN.txt');
const currentCuesPath = path.join(captionDir, 'subtitle-cues.json');

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exit(1);
};

if (!fs.existsSync(packageDir)) fail(`Reel package not found: ${packageDir}`);
if (!fs.existsSync(copyPath)) fail(`Missing canonical voiceover copy: ${copyPath}`);
if (!fs.existsSync(currentCuesPath)) fail(`Missing subtitle cue structure: ${currentCuesPath}`);

const supportedAudioExtensions = ['.wav', '.mp3', '.m4a', '.aac', '.mp4', '.mov', '.mkv'];
const audioCandidates = fs.existsSync(audioDir)
  ? fs.readdirSync(audioDir)
      .filter((name) => name.toLowerCase().startsWith('voiceover.'))
      .filter((name) => supportedAudioExtensions.includes(path.extname(name).toLowerCase()))
  : [];

if (audioCandidates.length === 0) {
  fail(`No voiceover audio/video found in ${audioDir}`);
}

const inputPath = path.join(audioDir, audioCandidates[0]);
const cacheRoot = path.join(root, '.cache', 'ki-whisper');
const whisperPath = path.join(cacheRoot, `whisper.cpp-${WHISPER_CPP_VERSION}`);
const tempDir = path.join(cacheRoot, 'audio');
fs.mkdirSync(tempDir, {recursive: true});
fs.mkdirSync(captionDir, {recursive: true});

const slug = path.basename(packageDir).replace(/[^a-zA-Z0-9_-]/g, '-');
const wavPath = path.join(tempDir, `${slug}.16k.wav`);

const ffmpeg = spawnSync(
  'ffmpeg',
  ['-hide_banner', '-loglevel', 'error', '-y', '-i', inputPath, '-vn', '-ac', '1', '-ar', '16000', '-c:a', 'pcm_s16le', wavPath],
  {stdio: 'inherit'},
);
if (ffmpeg.status !== 0) fail('ffmpeg failed while converting voiceover to 16 kHz mono WAV');

const ffprobe = spawnSync(
  'ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', inputPath],
  {encoding: 'utf8'},
);
if (ffprobe.status !== 0) fail('ffprobe failed while measuring voiceover duration');
const durationSeconds = Number.parseFloat(ffprobe.stdout.trim());
if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) fail('Could not read a valid voiceover duration');

console.log(`🎙️ Voiceover: ${path.relative(root, inputPath)} (${durationSeconds.toFixed(3)} s)`);
console.log(`🧠 Whisper: ${MODEL}, language=${LANGUAGE}, token timestamps=on`);

await installWhisperCpp({
  to: whisperPath,
  version: WHISPER_CPP_VERSION,
});
await downloadWhisperModel({
  model: MODEL,
  folder: whisperPath,
});

const whisperCppOutput = await transcribe({
  model: MODEL,
  whisperPath,
  whisperCppVersion: WHISPER_CPP_VERSION,
  inputPath: wavPath,
  tokenLevelTimestamps: true,
  splitOnWord: true,
  language: LANGUAGE,
  translateToEnglish: false,
  printOutput: true,
});

const {captions} = toCaptions({whisperCppOutput});

const normalize = (value) =>
  value
    .normalize('NFKC')
    .toLocaleLowerCase('de-DE')
    .replace(/[„“”"'’`´.,!?;:()\[\]{}…—–\-_/\\]/g, '')
    .replace(/\s+/g, '')
    .trim();

const canonicalTokens = fs.readFileSync(copyPath, 'utf8').trim().split(/\s+/).filter(Boolean);

const observedWords = captions.flatMap((caption) => {
  const tokens = caption.text.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const duration = Math.max(1, caption.endMs - caption.startMs);
  return tokens.map((text, index) => {
    const startMs = caption.startMs + (duration * index) / tokens.length;
    const endMs = caption.startMs + (duration * (index + 1)) / tokens.length;
    return {
      text,
      normalized: normalize(text),
      startMs,
      endMs,
      timestampMs: caption.timestampMs,
      confidence: caption.confidence ?? null,
    };
  });
});

if (observedWords.length === 0) fail('Whisper returned no word-like caption tokens');

// Word-level Levenshtein alignment: canonical script is the text authority;
// Whisper is only the timing authority.
const n = canonicalTokens.length;
const m = observedWords.length;
const canonicalNorm = canonicalTokens.map(normalize);
const dp = Array.from({length: n + 1}, () => new Float64Array(m + 1));
const back = Array.from({length: n + 1}, () => new Uint8Array(m + 1));

for (let i = 1; i <= n; i++) {
  dp[i][0] = i;
  back[i][0] = 2; // delete canonical word
}
for (let j = 1; j <= m; j++) {
  dp[0][j] = j;
  back[0][j] = 3; // insert observed word
}

for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= m; j++) {
    const exact = canonicalNorm[i - 1] === observedWords[j - 1].normalized;
    const substitutionCost = exact ? 0 : 1;
    const diagonal = dp[i - 1][j - 1] + substitutionCost;
    const deletion = dp[i - 1][j] + 1;
    const insertion = dp[i][j - 1] + 1;
    const best = Math.min(diagonal, deletion, insertion);
    dp[i][j] = best;
    back[i][j] = best === diagonal ? 1 : best === deletion ? 2 : 3;
  }
}

const mapping = Array(n).fill(null);
let i = n;
let j = m;
let exactMatches = 0;
let substitutions = 0;
while (i > 0 || j > 0) {
  const op = back[i][j];
  if (i > 0 && j > 0 && op === 1) {
    mapping[i - 1] = j - 1;
    if (canonicalNorm[i - 1] === observedWords[j - 1].normalized) exactMatches++;
    else substitutions++;
    i--;
    j--;
  } else if (i > 0 && (op === 2 || j === 0)) {
    i--;
  } else {
    j--;
  }
}

const matchRatio = exactMatches / Math.max(1, n);
if (matchRatio < 0.78) {
  fail(`Whisper/script exact-word match ratio ${(matchRatio * 100).toFixed(1)}% is too low. Try KI_WHISPER_MODEL=large-v3 or inspect the audio.`);
}

const alignedWords = canonicalTokens.map((text, index) => {
  const observedIndex = mapping[index];
  if (observedIndex !== null) {
    const observed = observedWords[observedIndex];
    return {
      text,
      startMs: observed.startMs,
      endMs: observed.endMs,
      startFrame: Math.max(0, Math.floor((observed.startMs / 1000) * FPS)),
      endFrame: Math.max(1, Math.ceil((observed.endMs / 1000) * FPS)),
      alignment: canonicalNorm[index] === observed.normalized ? 'exact' : 'substitution',
      observedText: observed.text,
      confidence: observed.confidence,
    };
  }
  return {text, startMs: null, endMs: null, startFrame: null, endFrame: null, alignment: 'missing', observedText: null, confidence: null};
});

// Fill rare missing canonical words by interpolating only between real neighboring timestamps.
for (let index = 0; index < alignedWords.length; index++) {
  if (alignedWords[index].startMs !== null) continue;
  let left = index - 1;
  while (left >= 0 && alignedWords[left].endMs === null) left--;
  let right = index + 1;
  while (right < alignedWords.length && alignedWords[right].startMs === null) right++;
  const runEnd = right - 1;
  const runLength = runEnd - index + 1;
  const leftMs = left >= 0 ? alignedWords[left].endMs : 0;
  const rightMs = right < alignedWords.length ? alignedWords[right].startMs : durationSeconds * 1000;
  const gap = Math.max(runLength, rightMs - leftMs);
  for (let k = 0; k < runLength; k++) {
    const startMs = leftMs + (gap * k) / runLength;
    const endMs = leftMs + (gap * (k + 1)) / runLength;
    const word = alignedWords[index + k];
    word.startMs = startMs;
    word.endMs = endMs;
    word.startFrame = Math.max(0, Math.floor((startMs / 1000) * FPS));
    word.endFrame = Math.max(word.startFrame + 1, Math.ceil((endMs / 1000) * FPS));
    word.alignment = 'interpolated-missing';
  }
  index = runEnd;
}

const cueSource = JSON.parse(fs.readFileSync(currentCuesPath, 'utf8'));
let canonicalCursor = 0;
const generatedCues = (cueSource.cues ?? []).map((cue, cueIndex) => {
  const cueTokens = cue.text.trim().split(/\s+/).filter(Boolean);
  const expectedSlice = canonicalTokens.slice(canonicalCursor, canonicalCursor + cueTokens.length);
  if (expectedSlice.join(' ') !== cueTokens.join(' ')) {
    fail(`Cue ${cueIndex + 1} no longer matches the canonical voiceover word order. Fix the script/cue contract before applying Whisper timing.`);
  }
  const words = alignedWords.slice(canonicalCursor, canonicalCursor + cueTokens.length);
  canonicalCursor += cueTokens.length;
  return {
    sceneId: cue.sceneId,
    startFrame: words[0].startFrame,
    endFrame: words[words.length - 1].endFrame,
    text: cue.text,
    words: words.map(({text, startFrame, endFrame, alignment, observedText, confidence}) => ({text, startFrame, endFrame, alignment, observedText, confidence})),
  };
});

if (canonicalCursor !== canonicalTokens.length) {
  fail(`Subtitle cues cover ${canonicalCursor}/${canonicalTokens.length} canonical words`);
}

const sceneIds = [...new Set(generatedCues.map((cue) => cue.sceneId))];
const suggestedScenes = sceneIds.map((sceneId, index) => {
  const firstCue = generatedCues.find((cue) => cue.sceneId === sceneId);
  const nextSceneId = sceneIds[index + 1];
  const nextCue = nextSceneId ? generatedCues.find((cue) => cue.sceneId === nextSceneId) : null;
  return {
    sceneId,
    startFrame: index === 0 ? 0 : firstCue.startFrame,
    endFrame: nextCue ? nextCue.startFrame : Math.ceil(durationSeconds * FPS),
  };
});

const output = {
  version: 1,
  generatedAt: new Date().toISOString(),
  sourceAudio: path.relative(packageDir, inputPath),
  durationSeconds,
  durationInFrames: Math.ceil(durationSeconds * FPS),
  fps: FPS,
  engine: '@remotion/install-whisper-cpp',
  whisperCppVersion: WHISPER_CPP_VERSION,
  model: MODEL,
  language: LANGUAGE,
  tokenLevelTimestamps: true,
  exactWordMatchRatio: matchRatio,
  exactMatches,
  substitutions,
  canonicalWordCount: n,
  observedWordCount: m,
  suggestedScenes,
  cues: generatedCues,
};

const alignmentPath = path.join(captionDir, 'voice-lock.whisper.generated.json');
const rawPath = path.join(captionDir, 'whisper.raw.generated.json');
fs.writeFileSync(alignmentPath, JSON.stringify(output, null, 2));
fs.writeFileSync(rawPath, JSON.stringify({whisperCppOutput, captions}, null, 2));

console.log(`✅ Whisper alignment generated: ${path.relative(root, alignmentPath)}`);
console.log(`   exact word match: ${(matchRatio * 100).toFixed(1)}% (${exactMatches}/${n})`);
console.log(`   substitutions: ${substitutions}`);
console.log(`   suggested duration: ${output.durationInFrames} frames @ ${FPS} fps`);
console.log('ℹ️ Generated JSON is a Phase-3 timing artifact. The agent must review it, then update subtitle-cues.json + scene/source contracts before final render.');
