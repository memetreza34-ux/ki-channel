import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
  MAXIMAL_ANIMATION_LIBRARY_RENDER_CONFIG as CONFIG,
  MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
} from './maximal-animation-library-render-config.mjs';

const MODE = process.argv[2] ?? 'plan';
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'videos', 'all']);
const CONCURRENCY = Number(process.env.MAXIMAL_ANIMATION_LIBRARY_CONCURRENCY ?? '1');
const ENTRY_POINT = process.env.MAXIMAL_ANIMATION_LIBRARY_ENTRY_POINT ?? CONFIG.entryPoint;
const OUTPUT_DIR = process.env.MAXIMAL_ANIMATION_LIBRARY_OUTPUT_DIR ?? CONFIG.outputDir;

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Modus: ${MODE}. Erlaubt: plan, smoke, stills, videos, all.`);
  process.exit(1);
}
if (!Number.isInteger(CONCURRENCY) || CONCURRENCY < 1 || CONCURRENCY > 4) {
  console.error('MAXIMAL_ANIMATION_LIBRARY_CONCURRENCY muss zwischen 1 und 4 liegen.');
  process.exit(1);
}

const checkpoints = MODE === 'smoke'
  ? [...CONFIG.defaults.smokeCheckpoints]
  : [...CONFIG.defaults.checkpoints];

const plan = {
  version: 1,
  entryPoint: ENTRY_POINT,
  outputDir: OUTPUT_DIR,
  prototypeCount: CONFIG.prototypes.length,
  width: CONFIG.defaults.width,
  height: CONFIG.defaults.height,
  fps: CONFIG.defaults.fps,
  durationInFrames: CONFIG.defaults.durationInFrames,
  checkpoints,
  sourceFingerprint: MAXIMAL_ANIMATION_LIBRARY_SOURCE_FINGERPRINT,
  prototypes: CONFIG.prototypes,
};

await mkdir(OUTPUT_DIR, {recursive: true});
await writeFile(
  resolve(OUTPUT_DIR, 'render-plan.json'),
  `${JSON.stringify(plan, null, 2)}\n`,
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
      else reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`));
    });
  });

const runPool = async (tasks, concurrency) => {
  let cursor = 0;
  const workers = Array.from(
    {length: Math.min(concurrency, Math.max(1, tasks.length))},
    async () => {
      while (cursor < tasks.length) {
        const index = cursor;
        cursor += 1;
        await tasks[index]();
      }
    },
  );
  await Promise.all(workers);
};

const renderStills = new Set(['smoke', 'stills', 'all']).has(MODE);
const renderVideos = new Set(['videos', 'all']).has(MODE);
const tasks = [];

for (const prototype of CONFIG.prototypes) {
  const prototypeDir = resolve(OUTPUT_DIR, prototype.animationId);
  if (renderStills) {
    for (const frame of checkpoints) {
      tasks.push(async () => {
        const stillDir = resolve(prototypeDir, 'stills');
        await mkdir(stillDir, {recursive: true});
        await run('npx', [
          '--no-install',
          'remotion',
          'still',
          ENTRY_POINT,
          prototype.compositionId,
          resolve(stillDir, `frame-${String(frame).padStart(3, '0')}.png`),
          `--frame=${frame}`,
          '--overwrite',
        ]);
      });
    }
  }
  if (renderVideos) {
    tasks.push(async () => {
      await mkdir(prototypeDir, {recursive: true});
      await run('npx', [
        '--no-install',
        'remotion',
        'render',
        ENTRY_POINT,
        prototype.compositionId,
        resolve(prototypeDir, `${prototype.animationId}.mp4`),
        '--codec=h264',
        '--crf=18',
        '--audio-codec=aac',
        '--overwrite',
      ]);
    });
  }
}

console.log(
  `Starte ${tasks.length} Renderaufgaben für ${CONFIG.prototypes.length} Animationen im Modus ${MODE}.`,
);
await runPool(tasks, CONCURRENCY);
console.log(`Maximale Animationsbibliothek gerendert: ${resolve(OUTPUT_DIR)}`);
