#!/usr/bin/env node
import {spawn} from 'node:child_process';
import {mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

/**
 * Rendert die Technik-Demos aus ki/src/animation-library/demo/.
 *
 * Sie sind bewusst nicht in der Prototypen-Registry: der Katalog ist auf
 * exakt 88 Eintraege und vier Varianten je Familie festgelegt. Eine vierte
 * Variante zu verdraengen waere eine inhaltliche Entscheidung, keine
 * technische. Bis die gefallen ist, laufen die Demos ueber diesen Weg.
 *
 *   node scripts/render-motion-demos.mjs stills
 *   node scripts/render-motion-demos.mjs videos
 */

const ENTRY_POINT = 'ki/src/animation-library/demo/remotion-entry.tsx';
const OUTPUT_DIR = 'out/motion-demos';
const MODE = process.argv[2] ?? 'stills';

const DEMOS = [
  {
    compositionId: 'Demo-Shape-Morph',
    slug: 'shape-morph',
    technik: '@remotion/paths interpolatePath + @remotion/shapes',
    checkpoints: [30, 70, 110, 160],
  },
  {
    compositionId: 'Demo-Path-Travel',
    slug: 'path-travel',
    technik: '@remotion/paths evolvePath + getPointAtLength + getTangentAtLength',
    checkpoints: [20, 70, 120, 170],
  },
  {
    compositionId: 'Demo-Transitions',
    slug: 'transitions',
    technik: '@remotion/transitions TransitionSeries clockWipe + wipe',
    checkpoints: [20, 60, 100, 150],
  },
];

const run = (command, args) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`));
    });
  });

if (MODE === 'list') {
  for (const demo of DEMOS) {
    console.log(`${demo.compositionId.padEnd(22)} ${demo.technik}`);
  }
  process.exit(0);
}

if (!['stills', 'videos', 'all'].includes(MODE)) {
  console.error(`Unbekannter Modus: ${MODE}. Erlaubt: list, stills, videos, all.`);
  process.exit(1);
}

for (const demo of DEMOS) {
  const outputDir = resolve(OUTPUT_DIR, demo.slug);
  await mkdir(outputDir, {recursive: true});

  if (MODE === 'stills' || MODE === 'all') {
    for (const frame of demo.checkpoints) {
      await run('npx', [
        '--no-install',
        'remotion',
        'still',
        ENTRY_POINT,
        demo.compositionId,
        resolve(outputDir, `frame-${String(frame).padStart(3, '0')}.png`),
        `--frame=${frame}`,
        '--overwrite',
      ]);
    }
  }

  if (MODE === 'videos' || MODE === 'all') {
    await run('npx', [
      '--no-install',
      'remotion',
      'render',
      ENTRY_POINT,
      demo.compositionId,
      resolve(outputDir, `${demo.slug}.mp4`),
      '--overwrite',
    ]);
  }
}

console.log(`Motion-Demos gerendert: ${resolve(OUTPUT_DIR)}`);
