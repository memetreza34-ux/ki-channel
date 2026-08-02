import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {spawn} from 'node:child_process';

const ENTRY_POINT = process.env.MOTION_ENTRY_POINT ?? 'ki/src/index.ts';
const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const MODE = process.argv[2] ?? 'stills';
const VALID_MODES = new Set(['stills', 'videos', 'all', 'plan']);

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Modus: ${MODE}. Erlaubt: stills, videos, all, plan.`);
  process.exit(1);
}

const VISUAL_TYPES = [
  'input-output',
  'tool-orchestration',
  'comparison',
  'before-after',
  'data-flow',
  'error-path',
  'context-window',
  'agent-loop',
  'ranking',
  'process-chain',
];

const toCompositionId = (type) =>
  `Motion-${type}`.replace(/(^|-)([a-z])/g, (_, prefix, letter) => `${prefix}${letter.toUpperCase()}`);

const CHECKPOINTS = [0, 37, 75, 112, 149];

const run = (command, args) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {stdio: 'inherit', shell: process.platform === 'win32'});
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`));
    });
  });

const plan = VISUAL_TYPES.map((visualType) => ({
  visualType,
  compositionId: toCompositionId(visualType),
  checkpoints: CHECKPOINTS,
  outputDir: `${OUTPUT_DIR}/${visualType}`,
}));

await mkdir(OUTPUT_DIR, {recursive: true});
await writeFile(resolve(OUTPUT_DIR, 'render-plan.json'), `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

if (MODE === 'plan') {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

for (const item of plan) {
  await mkdir(item.outputDir, {recursive: true});

  if (MODE === 'stills' || MODE === 'all') {
    for (const frame of item.checkpoints) {
      const output = resolve(item.outputDir, `frame-${frame}.png`);
      await mkdir(dirname(output), {recursive: true});
      await run('npx', [
        'remotion',
        'still',
        ENTRY_POINT,
        item.compositionId,
        output,
        `--frame=${frame}`,
        '--overwrite',
      ]);
    }
  }

  if (MODE === 'videos' || MODE === 'all') {
    const output = resolve(item.outputDir, 'final.mp4');
    await run('npx', [
      'remotion',
      'render',
      ENTRY_POINT,
      item.compositionId,
      output,
      '--overwrite',
    ]);
  }
}

console.log(`Motion-Renderprüfung abgeschlossen: ${resolve(OUTPUT_DIR)}`);
