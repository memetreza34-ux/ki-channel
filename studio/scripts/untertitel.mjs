#!/usr/bin/env node
/**
 * Erstellt wortgenaue Untertitel aus dem Voiceover (lokal mit whisper.cpp, offline).
 *
 *   npm run untertitel -- <projekt-slug>                 sucht studio/public/projekte/<slug>/voiceover.(wav|mp3|m4a)
 *   npm run untertitel -- <projekt-slug> --model=large-v3-turbo   genauer, langsamer
 *
 * Ergebnis: studio/projekte/<slug>/untertitel.json (für <CaptionTrack captions={…} />)
 *
 * Beim ersten Lauf werden whisper.cpp (Build) und das Modell nach ./whisper.cpp geladen.
 * Danach läuft alles offline.
 */
import {downloadWhisperModel, installWhisperCpp, toCaptions, transcribe} from '@remotion/install-whisper-cpp';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {OUT, parseArgs, ROOT, STUDIO} from './lib.mjs';

const WHISPER_VERSION = '1.5.5';
const WHISPER_DIR = resolve(ROOT, 'whisper.cpp');

const {flags, rest} = parseArgs(process.argv.slice(2));
const slug = rest[0];
if (!slug) {
  console.error('Bitte Projekt angeben, z. B.: npm run untertitel -- so-antwortet-ki');
  process.exit(1);
}

const projectDir = resolve(STUDIO, 'projekte', slug);
const audioDir = resolve(STUDIO, 'public', 'projekte', slug);
const audio = flags.audio
  ? resolve(String(flags.audio))
  : ['wav', 'mp3', 'm4a'].map((ext) => resolve(audioDir, `voiceover.${ext}`)).find((p) => existsSync(p));
if (!audio || !existsSync(audio)) {
  console.error(`Kein Voiceover gefunden. Erwartet: ${audioDir}/voiceover.wav (oder .mp3/.m4a)`);
  process.exit(1);
}
if (!existsSync(projectDir)) {
  console.error(`Projektordner fehlt: ${projectDir}`);
  process.exit(1);
}

const model = String(flags.model ?? 'medium');

await installWhisperCpp({to: WHISPER_DIR, version: WHISPER_VERSION, printOutput: false});
await downloadWhisperModel({model, folder: WHISPER_DIR, printOutput: false});

// whisper.cpp erwartet 16 kHz Mono-WAV.
mkdirSync(resolve(OUT, slug), {recursive: true});
const wav16 = resolve(OUT, slug, 'voiceover.16k.wav');
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', audio, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav16]);

const whisperCppOutput = await transcribe({
  inputPath: wav16,
  whisperPath: WHISPER_DIR,
  whisperCppVersion: WHISPER_VERSION,
  model,
  tokenLevelTimestamps: true,
  language: 'de',
  splitOnWord: true,
  printOutput: false,
});
const {captions} = toCaptions({whisperCppOutput});

const target = resolve(projectDir, 'untertitel.json');
writeFileSync(target, `${JSON.stringify(captions, null, 2)}\n`);
const seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).toString());
console.log(`${captions.length} Wörter, Voiceover ${seconds.toFixed(2)} s (= ${Math.ceil(seconds * 30)} Frames bei 30 fps)`);
console.log(`Untertitel: ${target}`);
console.log('Bitte gegen das Skript gegenlesen – Eigennamen und Fachbegriffe verhört whisper manchmal.');
