import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {
  DEFAULT_CHECKPOINTS,
  SMOKE_CHECKPOINTS,
  TIMELINE_TARGET,
  VISUAL_TYPES,
  toMotionCompositionId,
} from './motion-render-config.mjs';

const ENTRY_POINT = process.env.MOTION_ENTRY_POINT ?? 'ki/src/motion-system/remotion-entry.tsx';
const OUTPUT_DIR = process.env.MOTION_OUTPUT_DIR ?? 'out/motion-system';
const MODE = process.argv[2] ?? 'stills';
const TYPE_FILTER = process.env.MOTION_TYPES
  ? new Set(process.env.MOTION_TYPES.split(',').map((value) => value.trim()).filter(Boolean))
  : null;
const FRAME_FILTER = process.env.MOTION_FRAMES
  ? process.env.MOTION_FRAMES.split(',').map((value) => Number(value.trim()))
  : null;
const CONCURRENCY = Number(process.env.MOTION_CONCURRENCY ?? '1');
const VALID_MODES = new Set([
  'smoke',
  'stills',
  'videos',
  'all',
  'plan',
  'timeline-smoke',
  'timeline',
]);
const IS_TIMELINE_MODE = MODE === 'timeline-smoke' || MODE === 'timeline';

if (!VALID_MODES.has(MODE)) {
  console.error(
    `Unbekannter Modus: ${MODE}. Erlaubt: smoke, stills, videos, all, plan, timeline-smoke, timeline.`,
  );
  process.exit(1);
}

if (!Number.isInteger(CONCURRENCY) || CONCURRENCY < 1 || CONCURRENCY > 4) {
  console.error('MOTION_CONCURRENCY muss eine ganze Zahl zwischen 1 und 4 sein.');
  process.exit(1);
}

if (IS_TIMELINE_MODE && TYPE_FILTER) {
  console.error('MOTION_TYPES kann nicht mit einem Timeline-Modus kombiniert werden.');
  process.exit(1);
}

const maxAllowedFrame = IS_TIMELINE_MODE
  ? TIMELINE_TARGET.durationInFrames - 1
  : DEFAULT_CHECKPOINTS.at(-1);

if (
  FRAME_FILTER &&
  (FRAME_FILTER.length === 0 ||
    FRAME_FILTER.some(
      (frame) =>
        !Number.isInteger(frame) ||
        frame < 0 ||
        frame > maxAllowedFrame,
    ))
) {
  console.error(
    `MOTION_FRAMES muss ganze Frames zwischen 0 und ${maxAllowedFrame} enthalten.`,
  );
  process.exit(1);
}

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

if (!IS_TIMELINE_MODE && selectedTypes.length === 0) {
  console.error('Es wurde kein Visualtyp für den Render ausgewählt.');
  process.exit(1);
}

const selectedCheckpoints = FRAME_FILTER
  ? [...new Set(FRAME_FILTER)].sort((left, right) => left - right)
  : MODE === 'smoke'
    ? [...SMOKE_CHECKPOINTS]
    : MODE === 'timeline-smoke'
      ? [...TIMELINE_TARGET.smokeCheckpoints]
      : MODE === 'timeline'
        ? [...TIMELINE_TARGET.checkpoints]
        : [...DEFAULT_CHECKPOINTS];

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

const plan = IS_TIMELINE_MODE
  ? [
      {
        targetKey: TIMELINE_TARGET.targetKey,
        compositionId: TIMELINE_TARGET.compositionId,
        checkpoints: selectedCheckpoints,
        outputDir: `${OUTPUT_DIR}/${TIMELINE_TARGET.targetKey}`,
      },
    ]
  : selectedTypes.map((visualType) => ({
      targetKey: visualType,
      visualType,
      compositionId: toMotionCompositionId(visualType),
      checkpoints: selectedCheckpoints,
      outputDir: `${OUTPUT_DIR}/${visualType}`,
    }));

await mkdir(OUTPUT_DIR, {recursive: true});
const planFileName = IS_TIMELINE_MODE
  ? 'timeline-render-plan.json'
  : 'render-plan.json';
await writeFile(
  resolve(OUTPUT_DIR, planFileName),
  `${JSON.stringify(plan, null, 2)}\n`,
  'utf8',
);

if (MODE === 'plan') {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

const shouldRenderStills = new Set([
  'smoke',
  'stills',
  'all',
  'timeline-smoke',
  'timeline',
]).has(MODE);
const shouldRenderVideo = new Set(['videos', 'all', 'timeline']).has(MODE);
const tasks = [];

for (const item of plan) {
  await mkdir(item.outputDir, {recursive: true});

  if (shouldRenderStills) {
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

  if (shouldRenderVideo) {
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
  `Starte ${tasks.length} Renderaufgaben im Modus ${MODE} mit Parallelität ${CONCURRENCY} über ${ENTRY_POINT}.`,
);
await runPool(tasks, CONCURRENCY);
console.log(`Motion-Renderprüfung abgeschlossen: ${resolve(OUTPUT_DIR)}`);
