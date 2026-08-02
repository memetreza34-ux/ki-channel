import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {spawn} from 'node:child_process';

const ENTRY_POINT = process.env.MOTION_ENTRY_POINT ?? 'ki/src/motion-system/remotion-entry.tsx';
const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const MODE = process.argv[2] ?? 'stills';
const TYPE_FILTER = process.env.MOTION_TYPES
  ? new Set(process.env.MOTION_TYPES.split(',').map((value) => value.trim()).filter(Boolean))
  : null;
const CONCURRENCY = Number(process.env.MOTION_CONCURRENCY ?? '1');
const VALID_MODES = new Set(['stills', 'videos', 'all', 'plan']);

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Modus: ${MODE}. Erlaubt: stills, videos, all, plan.`);
  process.exit(1);
}

if (!Number.isInteger(CONCURRENCY) || CONCURRENCY < 1 || CONCURRENCY > 4) {
  console.error('MOTION_CONCURRENCY muss eine ganze Zahl zwischen 1 und 4 sein.');
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

const unknownTypes = TYPE_FILTER
  ? [...TYPE_FILTER].filter((type) => !VISUAL_TYPES.includes(type))
  : [];

if (unknownTypes.length > 0) {
  console.error(`Unbekannte Visualtypen: ${unknownTypes.join(', ')}`);
  process.exit(1);
}

const selectedTypes = TYPE_FILTER
  ? VISUAL_TYPES.filter((type) => TYPE_FILTER.has(type))
  : VISUAL_TYPES;

if (selectedTypes.length === 0) {
  console.error('Es wurde kein Visualtyp für den Render ausgewählt.');
  process.exit(1);
}

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

const runPool = async (tasks, concurrency) => {
  let nextTaskIndex = 0;
  const workers = Array.from({length: Math.min(concurrency, tasks.length)}, async () => {
    while (nextTaskIndex < tasks.length) {
      const taskIndex = nextTaskIndex;
      nextTaskIndex += 1;
      await tasks[taskIndex]();
    }
  });
  await Promise.all(workers);
};

const plan = selectedTypes.map((visualType) => ({
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

const tasks = [];

for (const item of plan) {
  await mkdir(item.outputDir, {recursive: true});

  if (MODE === 'stills' || MODE === 'all') {
    for (const frame of item.checkpoints) {
      tasks.push(async () => {
        const output = resolve(item.outputDir, `frame-${frame}.png`);
        await mkdir(dirname(output), {recursive: true});
        await run('npx', [
          '--no-install',
          'remotion',
          'still',
          ENTRY_POINT,
          item.compositionId,
          output,
          `--frame=${frame}`,
          '--overwrite',
        ]);
      });
    }
  }

  if (MODE === 'videos' || MODE === 'all') {
    tasks.push(async () => {
      const output = resolve(item.outputDir, 'final.mp4');
      await run('npx', [
        '--no-install',
        'remotion',
        'render',
        ENTRY_POINT,
        item.compositionId,
        output,
        '--overwrite',
      ]);
    });
  }
}

console.log(
  `Starte ${tasks.length} Renderaufgaben mit Parallelität ${CONCURRENCY} über ${ENTRY_POINT}.`,
);
await runPool(tasks, CONCURRENCY);
console.log(`Motion-Renderprüfung abgeschlossen: ${resolve(OUTPUT_DIR)}`);
