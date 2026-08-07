import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
  ANIMATION_LIBRARY_CONTENT_RENDER_FIXTURES,
  ANIMATION_LIBRARY_CONTENT_RENDER_FRAME,
  ANIMATION_LIBRARY_CONTENT_RENDER_FRAMES,
  ANIMATION_LIBRARY_RENDER_CONFIG,
  ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from './animation-library-render-config.mjs';

const MODE = process.argv[2] ?? 'plan';
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'videos', 'all']);
const CONCURRENCY = Number(process.env.ANIMATION_LIBRARY_CONCURRENCY ?? '1');
const ENTRY_POINT =
  process.env.ANIMATION_LIBRARY_ENTRY_POINT ??
  ANIMATION_LIBRARY_RENDER_CONFIG.entryPoint;
const OUTPUT_DIR =
  process.env.ANIMATION_LIBRARY_OUTPUT_DIR ??
  ANIMATION_LIBRARY_RENDER_CONFIG.outputDir;
const PROTOTYPE_FILTER = process.env.ANIMATION_LIBRARY_PROTOTYPES
  ? new Set(
      process.env.ANIMATION_LIBRARY_PROTOTYPES
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    )
  : null;

if (!VALID_MODES.has(MODE)) {
  console.error(
    `Unbekannter Modus: ${MODE}. Erlaubt: plan, smoke, stills, videos, all.`,
  );
  process.exit(1);
}

if (!Number.isInteger(CONCURRENCY) || CONCURRENCY < 1 || CONCURRENCY > 4) {
  console.error(
    'ANIMATION_LIBRARY_CONCURRENCY muss eine ganze Zahl zwischen 1 und 4 sein.',
  );
  process.exit(1);
}

const unknownPrototypes = PROTOTYPE_FILTER
  ? [...PROTOTYPE_FILTER].filter(
      (value) =>
        !ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.some(
          (prototype) =>
            prototype.animationId === value ||
            prototype.compositionId === value,
        ),
    )
  : [];

if (unknownPrototypes.length > 0) {
  console.error(
    `Unbekannte Prototype-Filter: ${unknownPrototypes.join(', ')}`,
  );
  process.exit(1);
}

const selectedPrototypes = ANIMATION_LIBRARY_RENDER_CONFIG.prototypes.filter(
  (prototype) =>
    !PROTOTYPE_FILTER ||
    PROTOTYPE_FILTER.has(prototype.animationId) ||
    PROTOTYPE_FILTER.has(prototype.compositionId),
);

if (selectedPrototypes.length === 0) {
  console.error('Es wurde kein Animation-Prototyp ausgewählt.');
  process.exit(1);
}

const contentFixtureByAnimationId = new Map(
  ANIMATION_LIBRARY_CONTENT_RENDER_FIXTURES.map((fixture) => [
    fixture.animationId,
    fixture,
  ]),
);

const checkpoints =
  MODE === 'smoke'
    ? [...ANIMATION_LIBRARY_RENDER_CONFIG.defaults.smokeCheckpoints]
    : [...ANIMATION_LIBRARY_RENDER_CONFIG.defaults.checkpoints];

const plan = selectedPrototypes.map((prototype) => {
  const contentFixture = contentFixtureByAnimationId.get(prototype.animationId);
  if (!contentFixture) {
    throw new Error(
      `Kein Content-Render-Fixture für ${prototype.animationId} gefunden.`,
    );
  }
  return {
    ...prototype,
    entryPoint: ENTRY_POINT,
    outputDir: `${OUTPUT_DIR}/${prototype.animationId}`,
    durationInFrames:
      ANIMATION_LIBRARY_RENDER_CONFIG.defaults.durationInFrames,
    fps: ANIMATION_LIBRARY_RENDER_CONFIG.defaults.fps,
    width: ANIMATION_LIBRARY_RENDER_CONFIG.defaults.width,
    height: ANIMATION_LIBRARY_RENDER_CONFIG.defaults.height,
    checkpoints,
    contentSmokeFrame: ANIMATION_LIBRARY_CONTENT_RENDER_FRAME,
    contentSmokeFrames: [...ANIMATION_LIBRARY_CONTENT_RENDER_FRAMES],
    sourceFingerprint: ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
  };
});

await mkdir(OUTPUT_DIR, {recursive: true});
await writeFile(
  resolve(OUTPUT_DIR, 'render-plan.json'),
  `${JSON.stringify(
    {
      version: 2,
      mode: MODE,
      sourceFingerprint: ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
      contentSmokeFrame: ANIMATION_LIBRARY_CONTENT_RENDER_FRAME,
      contentSmokeFrames: [...ANIMATION_LIBRARY_CONTENT_RENDER_FRAMES],
      prototypes: plan,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

if (MODE === 'plan') {
  console.log(JSON.stringify(plan, null, 2));
  process.exit(0);
}

const run = (command, args) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else {
        reject(
          new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`),
        );
      }
    });
  });

const runPool = async (tasks, concurrency) => {
  let nextTaskIndex = 0;
  const workers = Array.from(
    {length: Math.min(concurrency, tasks.length)},
    async () => {
      while (nextTaskIndex < tasks.length) {
        const taskIndex = nextTaskIndex;
        nextTaskIndex += 1;
        await tasks[taskIndex]();
      }
    },
  );
  await Promise.all(workers);
};

const shouldRenderStills = new Set(['smoke', 'stills', 'all']).has(MODE);
const shouldRenderVideos = new Set(['videos', 'all']).has(MODE);
const shouldRenderContentSmoke = new Set(['smoke', 'stills', 'all']).has(MODE);
const tasks = [];

for (const prototype of plan) {
  await mkdir(prototype.outputDir, {recursive: true});

  if (shouldRenderStills) {
    for (const frame of prototype.checkpoints) {
      tasks.push(async () => {
        const output = resolve(
          prototype.outputDir,
          `frame-${String(frame).padStart(3, '0')}.png`,
        );
        await run('npx', [
          '--no-install',
          'remotion',
          'still',
          ENTRY_POINT,
          prototype.compositionId,
          output,
          `--frame=${frame}`,
          '--overwrite',
        ]);
      });
    }
  }

  if (shouldRenderContentSmoke) {
    const contentFixture = contentFixtureByAnimationId.get(prototype.animationId);
    const propsPath = resolve(prototype.outputDir, 'content-smoke-props.json');
    await writeFile(
      propsPath,
      `${JSON.stringify(contentFixture.props, null, 2)}\n`,
      'utf8',
    );
    for (const frame of ANIMATION_LIBRARY_CONTENT_RENDER_FRAMES) {
      tasks.push(async () => {
        const output = resolve(
          prototype.outputDir,
          `content-frame-${String(frame).padStart(3, '0')}.png`,
        );
        await run('npx', [
          '--no-install',
          'remotion',
          'still',
          ENTRY_POINT,
          prototype.compositionId,
          output,
          `--frame=${frame}`,
          `--props=${propsPath}`,
          '--overwrite',
        ]);
      });
    }
  }

  if (shouldRenderVideos) {
    tasks.push(async () => {
      const output = resolve(prototype.outputDir, 'prototype.mp4');
      await run('npx', [
        '--no-install',
        'remotion',
        'render',
        ENTRY_POINT,
        prototype.compositionId,
        output,
        '--codec=h264',
        '--crf=18',
        '--overwrite',
      ]);
    });
  }
}

console.log(
  `Starte ${tasks.length} Animation-Library-Renderaufgaben im Modus ${MODE} mit Parallelität ${CONCURRENCY}.`,
);
await runPool(tasks, CONCURRENCY);
console.log(`Animation-Library-Render abgeschlossen: ${resolve(OUTPUT_DIR)}`);
