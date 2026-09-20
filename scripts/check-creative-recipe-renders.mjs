import {open, readFile, stat, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
  CREATIVE_RECIPE_IDS,
  CREATIVE_RECIPE_RENDER_CONTRACT,
  getCreativeRecipeSourceFingerprint,
} from './creative-recipe-release-contract.mjs';

const OUTPUT_DIR =
  process.env.CREATIVE_RECIPE_OUTPUT_DIR ??
  CREATIVE_RECIPE_RENDER_CONTRACT.outputDir;
const planPath = resolve(OUTPUT_DIR, 'render-plan.json');
const reportPath = resolve(OUTPUT_DIR, 'technical-check.json');
const PNG_SIGNATURE = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
const ARTIFACT_MODES = new Set(['smoke', 'stills', 'videos', 'all']);

const plan = JSON.parse(await readFile(planPath, 'utf8'));
const currentSourceFingerprint = await getCreativeRecipeSourceFingerprint();
if (
  plan.version !== 2 ||
  plan.contractVersion !== CREATIVE_RECIPE_RENDER_CONTRACT.version ||
  !Array.isArray(plan.recipes) ||
  plan.recipes.length === 0
) {
  throw new Error('Creative-Recipe render-plan.json ist ungültig oder stammt aus einem alten Contract.');
}
if (!ARTIFACT_MODES.has(plan.mode)) {
  throw new Error(
    `Creative-Recipe-Artefaktprüfung benötigt smoke/stills/videos/all; mode=${plan.mode ?? 'unknown'} enthält keinen verifizierbaren Render.`,
  );
}
if (plan.sourceFingerprint !== currentSourceFingerprint) {
  throw new Error(
    `Creative-Recipe-Renders sind stale: plan=${plan.sourceFingerprint ?? 'none'} current=${currentSourceFingerprint}.`,
  );
}
if (!plan.generatedAt || Number.isNaN(Date.parse(plan.generatedAt))) {
  throw new Error('Creative-Recipe-Renderplan benötigt einen gültigen generatedAt-Zeitstempel.');
}

const unknownRecipeIds = plan.recipes
  .map((recipe) => recipe.recipeId)
  .filter((recipeId) => !CREATIVE_RECIPE_IDS.includes(recipeId));
if (unknownRecipeIds.length > 0) {
  throw new Error(`Render-Plan enthält unbekannte Creative Recipes: ${unknownRecipeIds.join(', ')}`);
}
if (new Set(plan.recipes.map((recipe) => recipe.recipeId)).size !== plan.recipes.length) {
  throw new Error('Render-Plan enthält doppelte Creative-Recipe-IDs.');
}

const inspectPng = async (path) => {
  const file = await readFile(path);
  const signatureValid =
    file.length >= 24 &&
    file.subarray(0, 8).equals(PNG_SIGNATURE) &&
    file.subarray(12, 16).toString('ascii') === 'IHDR';
  const width = signatureValid ? file.readUInt32BE(16) : null;
  const height = signatureValid ? file.readUInt32BE(20) : null;
  return {
    path,
    type: 'png',
    sizeBytes: file.length,
    width,
    height,
    valid:
      signatureValid &&
      width === CREATIVE_RECIPE_RENDER_CONTRACT.width &&
      height === CREATIVE_RECIPE_RENDER_CONTRACT.height &&
      file.length >= 1024,
  };
};

const readHeader = async (path, length) => {
  const handle = await open(path, 'r');
  try {
    const buffer = Buffer.alloc(length);
    const {bytesRead} = await handle.read(buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
};

const inspectMp4 = async (path) => {
  const info = await stat(path);
  const header = await readHeader(path, 32);
  const signatureValid =
    header.length >= 8 && header.subarray(4, 8).toString('ascii') === 'ftyp';
  return {
    path,
    type: 'mp4',
    sizeBytes: info.size,
    width: null,
    height: null,
    valid: signatureValid && info.size >= 4096,
  };
};

const artifacts = [];
const expectsStills = new Set(['smoke', 'stills', 'all']).has(plan.mode);
const expectsVideos = new Set(['videos', 'all']).has(plan.mode);
const expectedCheckpoints =
  plan.mode === 'smoke'
    ? CREATIVE_RECIPE_RENDER_CONTRACT.smokeCheckpoints
    : CREATIVE_RECIPE_RENDER_CONTRACT.checkpoints;

for (const recipe of plan.recipes) {
  if (
    recipe.width !== CREATIVE_RECIPE_RENDER_CONTRACT.width ||
    recipe.height !== CREATIVE_RECIPE_RENDER_CONTRACT.height ||
    recipe.fps !== CREATIVE_RECIPE_RENDER_CONTRACT.fps ||
    recipe.durationInFrames !== CREATIVE_RECIPE_RENDER_CONTRACT.durationInFrames
  ) {
    throw new Error(`Render-Plan weicht vom Creative-Recipe-Contract ab: ${recipe.recipeId}`);
  }
  const expectedRecipeCheckpoints = expectsStills ? [...expectedCheckpoints] : [...CREATIVE_RECIPE_RENDER_CONTRACT.checkpoints];
  if (JSON.stringify(recipe.checkpoints) !== JSON.stringify(expectedRecipeCheckpoints)) {
    throw new Error(`Render-Plan enthält unerwartete Checkpoints für ${recipe.recipeId}: ${JSON.stringify(recipe.checkpoints)}.`);
  }
  if (expectsStills) {
    for (const frame of recipe.checkpoints) {
      artifacts.push(
        await inspectPng(
          resolve(recipe.outputDir, `frame-${String(frame).padStart(3, '0')}.png`),
        ),
      );
    }
  }
  if (expectsVideos) {
    artifacts.push(
      await inspectMp4(
        resolve(recipe.outputDir, CREATIVE_RECIPE_RENDER_CONTRACT.videoFileName),
      ),
    );
  }
}

const expectedArtifactCount =
  plan.recipes.length *
  ((expectsStills ? expectedCheckpoints.length : 0) + (expectsVideos ? 1 : 0));
if (artifacts.length !== expectedArtifactCount || expectedArtifactCount === 0) {
  throw new Error(
    `Creative-Recipe-Artefaktmenge ungültig: ${artifacts.length} gefunden, ${expectedArtifactCount} erwartet.`,
  );
}

const invalid = artifacts.filter((artifact) => !artifact.valid);
const report = {
  version: 2,
  contractVersion: CREATIVE_RECIPE_RENDER_CONTRACT.version,
  sourceFingerprint: currentSourceFingerprint,
  generatedAt: plan.generatedAt,
  mode: plan.mode,
  recipeCount: plan.recipes.length,
  expectedArtifactCount,
  artifactCount: artifacts.length,
  validArtifactCount: artifacts.length - invalid.length,
  invalidArtifactCount: invalid.length,
  passed: invalid.length === 0,
  artifacts,
};
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (invalid.length > 0) {
  console.error('Creative-Recipe-Artefaktprüfung fehlgeschlagen:');
  for (const artifact of invalid) {
    console.error(
      `- ${artifact.path}: type=${artifact.type}, size=${artifact.sizeBytes}, dimensions=${artifact.width ?? '?'}x${artifact.height ?? '?'}`,
    );
  }
  process.exit(1);
}

console.log(
  `Creative-Recipe-Artefakte technisch gültig: ${artifacts.length}/${expectedArtifactCount} Dateien für ${plan.recipes.length} Recipes · Fingerprint ${currentSourceFingerprint}.`,
);
