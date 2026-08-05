import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
  WHY_AI_REEL_CONFIG,
  WHY_AI_REEL_SOURCE_FINGERPRINT,
} from './why-ai-reel-config.mjs';

const MODE = process.argv[2] ?? 'plan';
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'video', 'all']);
const CONCURRENCY = Number(process.env.WHY_AI_REEL_CONCURRENCY ?? '1');
const ENTRY_POINT = process.env.WHY_AI_REEL_ENTRY_POINT ?? WHY_AI_REEL_CONFIG.entryPoint;
const OUTPUT_DIR = process.env.WHY_AI_REEL_OUTPUT_DIR ?? WHY_AI_REEL_CONFIG.outputDir;

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Modus: ${MODE}. Erlaubt: plan, smoke, stills, video, all.`);
  process.exit(1);
}

if (!Number.isInteger(CONCURRENCY) || CONCURRENCY < 1 || CONCURRENCY > 4) {
  console.error('WHY_AI_REEL_CONCURRENCY muss eine ganze Zahl zwischen 1 und 4 sein.');
  process.exit(1);
}

const checkpoints = MODE === 'smoke'
  ? [...WHY_AI_REEL_CONFIG.smokeCheckpoints]
  : [...WHY_AI_REEL_CONFIG.checkpoints];

const plan = {
  version: 1,
  reelId: WHY_AI_REEL_CONFIG.reelId,
  compositionId: WHY_AI_REEL_CONFIG.compositionId,
  entryPoint: ENTRY_POINT,
  outputDir: OUTPUT_DIR,
  width: WHY_AI_REEL_CONFIG.width,
  height: WHY_AI_REEL_CONFIG.height,
  fps: WHY_AI_REEL_CONFIG.fps,
  durationInFrames: WHY_AI_REEL_CONFIG.durationInFrames,
  checkpoints,
  sourceFingerprint: WHY_AI_REEL_SOURCE_FINGERPRINT,
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
const shouldRenderVideo = new Set(['video', 'all']).has(MODE);
const tasks = [];

if (shouldRenderStills) {
  for (const frame of checkpoints) {
    tasks.push(async () => {
      const output = resolve(OUTPUT_DIR, 'stills', `frame-${String(frame).padStart(4, '0')}.png`);
      await mkdir(resolve(OUTPUT_DIR, 'stills'), {recursive: true});
      await run('npx', [
        '--no-install',
        'remotion',
        'still',
        ENTRY_POINT,
        WHY_AI_REEL_CONFIG.compositionId,
        output,
        `--frame=${frame}`,
        '--overwrite',
      ]);
    });
  }
}

if (shouldRenderVideo) {
  tasks.push(async () => {
    const output = resolve(OUTPUT_DIR, 'why-ai-reads-differently.mp4');
    await run('npx', [
      '--no-install',
      'remotion',
      'render',
      ENTRY_POINT,
      WHY_AI_REEL_CONFIG.compositionId,
      output,
      '--codec=h264',
      '--crf=18',
      '--audio-codec=aac',
      '--overwrite',
    ]);
  });
}

console.log(
  `Starte ${tasks.length} Reel-Renderaufgaben im Modus ${MODE} mit Parallelität ${CONCURRENCY}.`,
);
await runPool(tasks, CONCURRENCY);
console.log(`Reel-Render abgeschlossen: ${resolve(OUTPUT_DIR)}`);
