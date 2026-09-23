#!/usr/bin/env node

import {spawn} from 'node:child_process';
import {access, copyFile, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';

const REEL_DIR = path.resolve('ki/reels/2026-08-10_bis_2026-08-16/02_Warum-unklare-Prompts-die-KI-raten-lassen');
const ENTRY_POINT = path.resolve('ki/src/production-entry.tsx');
const COMPOSITION_ID = 'KI-AmbiguousPrompts';
const PUBLIC_STAGE_DIR = path.resolve('public/__phase3/ambiguous-prompts');
const EXPORT_DIR = path.join(REEL_DIR, '05-export');
const MODE = process.argv[2] ?? 'smoke';
const VALID_MODES = new Set(['smoke', 'video', 'all']);

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const run = (command, args, label) => new Promise((resolvePromise, reject) => {
  console.log(`\n=== ${label} ===`);
  console.log(`$ ${command} ${args.join(' ')}`);
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  child.on('error', reject);
  child.on('exit', (code, signal) => {
    if (code === 0) resolvePromise();
    else reject(new Error(`${label} fehlgeschlagen (code=${code ?? 'null'}, signal=${signal ?? 'none'}).`));
  });
});

const findVoiceover = async () => {
  for (const name of ['voiceover.wav', 'voiceover.mp3']) {
    const file = path.join(REEL_DIR, '01-script-audio', name);
    if (await exists(file)) return file;
  }
  return null;
};

const assertExactCaptionPlan = async () => {
  const plan = JSON.parse(await readFile(path.join(REEL_DIR, '03-caption/subtitle-cues.json'), 'utf8'));
  if (plan.exactWordTimings !== true || plan.timingSource !== 'whisper.cpp-token-level-final-audio') {
    throw new Error('Finale Caption-Timeline besitzt keinen bestätigten Exact Word Sync.');
  }
  const cues = Array.isArray(plan.cues) ? plan.cues : [];
  if (cues.length === 0 || cues.some((cue) => !Array.isArray(cue.words) || cue.words.length === 0 || cue.timingStatus !== 'EXACT_FROM_FINAL_AUDIO')) {
    throw new Error('Mindestens ein Caption-Cue besitzt keine exakten Wort-Timestamps aus dem finalen Audio.');
  }
  return plan;
};

const reelConfig = async () => JSON.parse(await readFile(path.join(REEL_DIR, '06-projektdateien/reel.json'), 'utf8'));

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Modus: ${MODE}. Erlaubt: smoke, video, all.`);
  process.exit(1);
}

const audio = await findVoiceover();
if (!audio) {
  console.error('PHASE 2 AUDIO FEHLT');
  process.exit(2);
}

const stagedName = `voiceover${path.extname(audio).toLowerCase()}`;
const stagedFile = path.join(PUBLIC_STAGE_DIR, stagedName);
const propsDir = path.resolve('out/first-real-ki-reel');
const propsFile = path.join(propsDir, 'input-props.json');

try {
  await run(
    'node',
    ['scripts/sync-reel-word-timings.mjs', '--dir', REEL_DIR],
    'Exact word sync from final audio',
  );
  await assertExactCaptionPlan();

  // Readiness now validates the exact-word tooling as well as the whole production system.
  await run('node', ['scripts/run-remotion-readiness.mjs'], 'Full Remotion readiness');

  await mkdir(PUBLIC_STAGE_DIR, {recursive: true});
  await mkdir(propsDir, {recursive: true});
  await mkdir(EXPORT_DIR, {recursive: true});
  await copyFile(audio, stagedFile);
  await writeFile(
    propsFile,
    `${JSON.stringify({voiceoverSrc: `__phase3/ambiguous-prompts/${stagedName}`, showCaptions: true}, null, 2)}\n`,
    'utf8',
  );

  const reel = await reelConfig();
  const durationInFrames = Number(reel?.format?.durationInFrames);
  if (!Number.isInteger(durationInFrames) || durationInFrames < 3) {
    throw new Error('reel.json enthält keine gültige finale durationInFrames.');
  }

  const shouldSmoke = MODE === 'smoke' || MODE === 'all';
  const shouldVideo = MODE === 'video' || MODE === 'all';
  const remotion = ['--no-install', 'remotion'];
  const propsArg = `--props=${propsFile}`;

  if (shouldSmoke) {
    const smokeDir = path.join(EXPORT_DIR, 'smoke');
    await mkdir(smokeDir, {recursive: true});
    const frames = [...new Set([0, Math.floor(durationInFrames / 2), durationInFrames - 1])];
    for (const frame of frames) {
      await run(
        'npx',
        [...remotion, 'still', ENTRY_POINT, COMPOSITION_ID, path.join(smokeDir, `frame-${String(frame).padStart(4, '0')}.png`), `--frame=${frame}`, propsArg, '--overwrite'],
        `Smoke frame ${frame}`,
      );
    }
    console.log(`Smoke-Frames: ${smokeDir}`);
  }

  if (shouldVideo) {
    const output = path.join(EXPORT_DIR, 'FERTIGES-REEL.mp4');
    await run(
      'npx',
      [...remotion, 'render', ENTRY_POINT, COMPOSITION_ID, output, '--codec=h264', '--crf=18', '--audio-codec=aac', propsArg, '--overwrite'],
      'Final real-audio reel render',
    );
    console.log(`MP4: ${output}`);
  }

  console.log('\nFIRST REAL KI REEL TEST: RENDER COMMAND COMPLETED');
  console.log('Hinweis: Smoke-/MP4-Erzeugung ist noch keine Creative-QA-Freigabe.');
} finally {
  // Only the staged copy is removed. The human-provided original voiceover is never modified or deleted.
  await rm(PUBLIC_STAGE_DIR, {recursive: true, force: true});
}
