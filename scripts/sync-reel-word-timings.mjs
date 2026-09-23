#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {access, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const WORD_PATTERN = /[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu;
const DEFAULT_MODEL = 'medium';
const WHISPER_CPP_VERSION = process.platform === 'win32' ? '1.6.0' : '1.7.4';

const argument = (name) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const writeJson = async (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

export const spokenWords = (text) => String(text ?? '').match(WORD_PATTERN) ?? [];

export const normalizeSpokenWord = (text) => String(text ?? '')
  .normalize('NFKC')
  .toLocaleLowerCase('de-DE')
  .replace(/[’]/g, "'")
  .replace(/[^\p{L}\p{N}']/gu, '')
  .trim();

const frameAtMs = (milliseconds, fps, mode) => {
  const raw = (Number(milliseconds) / 1000) * fps;
  return mode === 'end' ? Math.ceil(raw) : Math.floor(raw);
};

export const alignExactWordTimings = ({subtitlePlan, captions, fps}) => {
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('fps muss > 0 sein.');
  if (!Array.isArray(subtitlePlan?.cues) || subtitlePlan.cues.length === 0) {
    throw new Error('subtitle-cues.json enthält keine Cues.');
  }
  if (!Array.isArray(captions) || captions.length === 0) {
    throw new Error('Whisper hat keine Wort-Captions erzeugt.');
  }

  const expected = subtitlePlan.cues.flatMap((cue, cueIndex) =>
    spokenWords(cue.text).map((text, wordIndex) => ({
      cueIndex,
      wordIndex,
      text,
      normalized: normalizeSpokenWord(text),
    })),
  );

  const recognized = captions.flatMap((caption, captionIndex) => {
    const words = spokenWords(caption.text);
    if (words.length === 0) return [];
    if (words.length !== 1) {
      throw new Error(
        `Whisper-Caption ${captionIndex + 1} enthält ${words.length} Wörter statt exakt einem. ` +
        'Phase 3 benötigt token-/wortgenaue Timestamps.',
      );
    }
    const startMs = Number(caption.startMs);
    const endMs = Number(caption.endMs);
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
      throw new Error(`Whisper-Caption ${captionIndex + 1} besitzt ungültige Wortzeiten.`);
    }
    return [{
      text: words[0],
      normalized: normalizeSpokenWord(words[0]),
      startMs,
      endMs,
      confidence: caption.confidence ?? null,
    }];
  });

  if (recognized.length !== expected.length) {
    throw new Error(
      `Wortanzahl stimmt nicht: Script ${expected.length}, Whisper ${recognized.length}. ` +
      'Keine geschätzten Timestamps werden geschrieben.',
    );
  }

  for (let index = 0; index < expected.length; index += 1) {
    if (expected[index].normalized !== recognized[index].normalized) {
      throw new Error(
        `Wortabweichung an Position ${index + 1}: Script „${expected[index].text}“, ` +
        `Whisper „${recognized[index].text}“. Keine geschätzten Timestamps werden geschrieben.`,
      );
    }
  }

  let cursor = 0;
  const cues = subtitlePlan.cues.map((cue) => {
    const words = spokenWords(cue.text);
    const timed = recognized.slice(cursor, cursor + words.length);
    cursor += words.length;
    if (timed.length !== words.length) throw new Error(`Unvollständige Wortzeiten für Cue ${cue.sceneId ?? cursor}.`);

    const mappedWords = timed.map((word, index) => {
      const startFrame = Math.max(0, frameAtMs(word.startMs, fps, 'start'));
      const endFrame = Math.max(startFrame + 1, frameAtMs(word.endMs, fps, 'end'));
      return {
        text: words[index],
        startFrame,
        endFrame,
        startMs: Math.round(word.startMs),
        endMs: Math.round(word.endMs),
      };
    });

    return {
      ...cue,
      startFrame: mappedWords[0].startFrame,
      endFrame: mappedWords.at(-1).endFrame,
      words: mappedWords,
      timingStatus: 'EXACT_FROM_FINAL_AUDIO',
    };
  });

  return {
    ...subtitlePlan,
    version: Math.max(2, Number(subtitlePlan.version) || 1),
    fps,
    exactWordTimings: true,
    timingSource: 'whisper.cpp-token-level-final-audio',
    cues,
  };
};

const findVoiceover = async (reelDirectory) => {
  const audioRoot = path.join(reelDirectory, '01-script-audio');
  for (const name of ['voiceover.wav', 'voiceover.mp3']) {
    const candidate = path.join(audioRoot, name);
    if (await exists(candidate)) return candidate;
  }
  return null;
};

const convertToWhisperWav = (input, output) => {
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(
    npx,
    ['--no-install', 'remotion', 'ffmpeg', '-i', input, '-ar', '16000', '-ac', '1', output, '-y'],
    {stdio: 'inherit'},
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Audio-Konvertierung für Whisper fehlgeschlagen (exit ${result.status}).`);
};

export const syncReelWordTimings = async ({reelDirectory, model = DEFAULT_MODEL}) => {
  const reelRoot = path.resolve(reelDirectory);
  const audio = await findVoiceover(reelRoot);
  if (!audio) {
    const error = new Error('PHASE 2 AUDIO FEHLT');
    error.code = 'PHASE_2_AUDIO_MISSING';
    throw error;
  }

  const subtitlePath = path.join(reelRoot, '03-caption', 'subtitle-cues.json');
  const reelPath = path.join(reelRoot, '06-projektdateien', 'reel.json');
  const reportPath = path.join(reelRoot, '06-projektdateien', 'word-sync-report.json');
  const rawWordPath = path.join(reelRoot, '03-caption', 'word-timestamps.json');
  const [subtitlePlan, reel] = await Promise.all([readJson(subtitlePath), readJson(reelPath)]);
  const fps = Number(subtitlePlan.fps ?? reel?.format?.fps);
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('Kein gültiger FPS-Wert in subtitle-cues.json/reel.json.');

  const whisperRoot = path.join(process.cwd(), 'node_modules', '.cache', 'ki-channel-whisper');
  const whisperPath = path.join(whisperRoot, 'whisper.cpp');
  await mkdir(whisperRoot, {recursive: true});
  const tempWav = path.join(os.tmpdir(), `ki-channel-${process.pid}-${Date.now()}.wav`);

  try {
    convertToWhisperWav(audio, tempWav);
    const {
      downloadWhisperModel,
      installWhisperCpp,
      transcribe,
      toCaptions,
    } = await import('@remotion/install-whisper-cpp');

    await installWhisperCpp({to: whisperPath, version: WHISPER_CPP_VERSION});
    await downloadWhisperModel({model, folder: whisperPath});
    const whisperCppOutput = await transcribe({
      model,
      whisperPath,
      whisperCppVersion: WHISPER_CPP_VERSION,
      inputPath: tempWav,
      tokenLevelTimestamps: true,
      splitOnWord: true,
      language: 'de',
    });
    const {captions} = toCaptions({whisperCppOutput});
    const synced = alignExactWordTimings({subtitlePlan, captions, fps});

    // Mutate production timing files only after the transcript matches every approved word.
    await writeJson(subtitlePath, synced);
    await writeJson(rawWordPath, captions);
    await writeJson(reportPath, {
      version: 1,
      status: 'PASS',
      exactWordTimings: true,
      sourceAudio: path.basename(audio),
      model,
      whisperCppVersion: WHISPER_CPP_VERSION,
      fps,
      words: synced.cues.reduce((sum, cue) => sum + cue.words.length, 0),
      generatedAt: new Date().toISOString(),
      rule: 'Approved script and Whisper transcript must match word-for-word after punctuation normalization.',
    });

    return {subtitlePath, rawWordPath, reportPath, wordCount: synced.cues.reduce((sum, cue) => sum + cue.words.length, 0)};
  } finally {
    await rm(tempWav, {force: true});
  }
};

const main = async () => {
  const reelDirectory = argument('--dir');
  if (!reelDirectory) {
    console.error('Aufruf: node scripts/sync-reel-word-timings.mjs --dir "ki/reels/.../NN_Titel" [--model medium]');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await syncReelWordTimings({
      reelDirectory,
      model: argument('--model') ?? DEFAULT_MODEL,
    });
    console.log(`EXACT WORD SYNC: PASS (${result.wordCount} Wörter)`);
    console.log(`Untertitel: ${result.subtitlePath}`);
    console.log(`Roh-Timestamps: ${result.rawWordPath}`);
    console.log(`Report: ${result.reportPath}`);
  } catch (error) {
    if (error?.code === 'PHASE_2_AUDIO_MISSING') {
      console.error('PHASE 2 AUDIO FEHLT');
      process.exitCode = 2;
      return;
    }
    console.error(`EXACT WORD SYNC: FAIL — ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) await main();
