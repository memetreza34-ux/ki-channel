import {spawn} from 'node:child_process';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
  CREATIVE_RECIPE_IDS,
  CREATIVE_RECIPE_RENDER_CONTRACT,
  getCreativeRecipeSourceFingerprint,
} from './creative-recipe-release-contract.mjs';

const MODE = process.argv[2] ?? 'plan';
const VALID_MODES = new Set(['plan', 'smoke', 'stills', 'videos', 'all']);
const OUTPUT_DIR =
  process.env.CREATIVE_RECIPE_OUTPUT_DIR ??
  CREATIVE_RECIPE_RENDER_CONTRACT.outputDir;
const CONCURRENCY = Number(process.env.CREATIVE_RECIPE_CONCURRENCY ?? '1');

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
  ? [...requested].filter((value) => !CREATIVE_RECIPE_IDS.includes(value))
  : [];
if (unknown.length > 0) {
  console.error(`Unbekannte Creative Recipes: ${unknown.join(', ')}`);
  process.exit(1);
}

const selected = CREATIVE_RECIPE_IDS.filter(
  (recipeId) => !requested || requested.has(recipeId),
);
if (selected.length === 0) {
  console.error('Keine Creative Recipes ausgewählt.');
  process.exit(1);
}

const checkpoints =
  MODE === 'smoke'
    ? CREATIVE_RECIPE_RENDER_CONTRACT.smokeCheckpoints
    : CREATIVE_RECIPE_RENDER_CONTRACT.checkpoints;
const plan = selected.map((recipeId) => ({
  recipeId,
  compositionId: `CreativeRecipe-${recipeId}`,
  entryPoint: CREATIVE_RECIPE_RENDER_CONTRACT.entryPoint,
  outputDir: `${OUTPUT_DIR}/${recipeId}`,
  fps: CREATIVE_RECIPE_RENDER_CONTRACT.fps,
  width: CREATIVE_RECIPE_RENDER_CONTRACT.width,
  height: CREATIVE_RECIPE_RENDER_CONTRACT.height,
  durationInFrames: CREATIVE_RECIPE_RENDER_CONTRACT.durationInFrames,
  checkpoints: [...checkpoints],
}));
const sourceFingerprint = await getCreativeRecipeSourceFingerprint();
const generatedAt = new Date().toISOString();

await mkdir(OUTPUT_DIR, {recursive: true});
if (MODE !== 'plan') {
  for (const recipe of plan) {
    await rm(recipe.outputDir, {recursive: true, force: true});
  }
}
await writeFile(
  resolve(OUTPUT_DIR, 'render-plan.json'),
  `${JSON.stringify(
    {
      version: 2,
      mode: MODE,
      contractVersion: CREATIVE_RECIPE_RENDER_CONTRACT.version,
      sourceFingerprint,
      generatedAt,
      recipes: plan,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

if (MODE === 'plan') {
  console.log(JSON.stringify({sourceFingerprint, recipes: plan}, null, 2));
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
          CREATIVE_RECIPE_RENDER_CONTRACT.entryPoint,
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
      const output = resolve(
        recipe.outputDir,
        CREATIVE_RECIPE_RENDER_CONTRACT.videoFileName,
      );
      await run('npx', [
        '--no-install',
        'remotion',
        'render',
        CREATIVE_RECIPE_RENDER_CONTRACT.entryPoint,
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
