import {spawn} from 'node:child_process';
import {mkdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const MODE = process.argv[2] ?? 'plan';
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'videos', 'all']);
const ENTRY_POINT = 'ki/src/animation-library/remotion-entry.tsx';
const OUTPUT_DIR = process.env.CREATIVE_RECIPE_OUTPUT_DIR ?? 'out/creative-recipes';
const CONCURRENCY = Number(process.env.CREATIVE_RECIPE_CONCURRENCY ?? '1');
const RECIPE_IDS = [
  'object-morph-stage',
  'path-trace-field',
  'network-bloom',
  'xray-overlay',
  'typographic-construct',
  'cutaway-stack',
  'depth-corridor',
  'ui-state-machine',
];
const CHECKPOINTS = [0, 30, 60, 90, 120, 150, 179];
const SMOKE_CHECKPOINTS = [0, 90, 179];

if (!VALID_MODES.has(MODE)) {
  console.error(`Unbekannter Creative-Recipe-Modus: ${MODE}.`);
  process.exit(1);
}
if (!Number.isInteger(CONCURRENCY) || CONCURRENCY < 1 || CONCURRENCY > 4) {
  console.error('CREATIVE_RECIPE_CONCURRENCY muss zwischen 1 und 4 liegen.');
  process.exit(1);
}

const requested = process.env.CREATIVE_RECIPE_IDS
  ? new Set(
      process.env.CREATIVE_RECIPE_IDS.split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    )
  : null;
const unknown = requested
  ? [...requested].filter((value) => !RECIPE_IDS.includes(value))
  : [];
if (unknown.length > 0) {
  console.error(`Unbekannte Creative Recipes: ${unknown.join(', ')}`);
  process.exit(1);
}

const selected = RECIPE_IDS.filter((recipeId) => !requested || requested.has(recipeId));
if (selected.length === 0) {
  console.error('Keine Creative Recipes ausgewählt.');
  process.exit(1);
}

const checkpoints = MODE === 'smoke' ? SMOKE_CHECKPOINTS : CHECKPOINTS;
const plan = selected.map((recipeId) => ({
  recipeId,
  compositionId: `CreativeRecipe-${recipeId}`,
  entryPoint: ENTRY_POINT,
  outputDir: `${OUTPUT_DIR}/${recipeId}`,
  fps: 30,
  width: 1080,
  height: 1100,
  durationInFrames: 180,
  checkpoints,
}));

await mkdir(OUTPUT_DIR, {recursive: true});
await writeFile(
  resolve(OUTPUT_DIR, 'render-plan.json'),
  `${JSON.stringify({version: 1, mode: MODE, recipes: plan}, null, 2)}\n`,
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
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} ${args.join(' ')} endete mit Code ${code}.`));
    });
  });

const tasks = [];
const shouldRenderStills = new Set(['smoke', 'stills', 'all']).has(MODE);
const shouldRenderVideos = new Set(['videos', 'all']).has(MODE);

for (const recipe of plan) {
  await mkdir(recipe.outputDir, {recursive: true});
  if (shouldRenderStills) {
    for (const frame of recipe.checkpoints) {
      tasks.push(async () => {
        const output = resolve(
          recipe.outputDir,
          `frame-${String(frame).padStart(3, '0')}.png`,
        );
        await run('npx', [
          '--no-install',
          'remotion',
          'still',
          ENTRY_POINT,
          recipe.compositionId,
          output,
          `--frame=${frame}`,
          '--overwrite',
        ]);
      });
    }
  }
  if (shouldRenderVideos) {
    tasks.push(async () => {
      const output = resolve(recipe.outputDir, 'recipe.mp4');
      await run('npx', [
        '--no-install',
        'remotion',
        'render',
        ENTRY_POINT,
        recipe.compositionId,
        output,
        '--codec=h264',
        '--crf=18',
        '--overwrite',
      ]);
    });
  }
}

let next = 0;
const workers = Array.from(
  {length: Math.min(CONCURRENCY, tasks.length)},
  async () => {
    while (next < tasks.length) {
      const index = next;
      next += 1;
      await tasks[index]();
    }
  },
);

console.log(
  `Starte ${tasks.length} Creative-Recipe-Renderaufgaben (${MODE}) mit Parallelität ${CONCURRENCY}.`,
);
await Promise.all(workers);
console.log(`Creative-Recipe-Render abgeschlossen: ${resolve(OUTPUT_DIR)}`);
