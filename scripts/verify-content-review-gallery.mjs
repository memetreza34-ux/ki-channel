import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getEdgeCaseSourceFingerprint} from './edge-case-release-utils.mjs';
import {
  CREATIVE_RECIPE_RENDER_CONTRACT,
  getCreativeRecipeSourceFingerprint,
} from './creative-recipe-release-contract.mjs';
import {
  CONTENT_REVIEW_COUNTS,
  assertContentReviewCounts,
} from './content-review-contract.mjs';

const requestedMode = process.argv[2] ?? 'full';
const VALID_MODES = new Set(['smoke', 'full']);
if (!VALID_MODES.has(requestedMode)) {
  throw new Error('Aufruf: node scripts/verify-content-review-gallery.mjs [smoke|full]');
}

const root = resolve('out/content-review-gallery');
const htmlPath = resolve(root, 'index.html');
const manifestPath = resolve(root, 'review-manifest.json');
const masterplanManifestPath = resolve('out/masterplan-content-release/manifest.json');
const edgeSummaryPath = resolve('out/content-motion-edge-cases/edge-case-render-summary.json');
const recipePlanPath = resolve(CREATIVE_RECIPE_RENDER_CONTRACT.outputDir, 'render-plan.json');
const renderConfigPath = resolve('ki/src/animation-library/prototype-render-config.json');

const assertFile = async (path) => {
  try {
    await access(path);
  } catch {
    throw new Error(`Review-Galerie-Datei fehlt: ${path}`);
  }
};
for (const path of [htmlPath, manifestPath, masterplanManifestPath, edgeSummaryPath, recipePlanPath, renderConfigPath]) {
  await assertFile(path);
}

const [manifest, masterplanManifest, edgeSummary, recipePlan, renderConfig, currentEdgeSourceFingerprint, currentRecipeSourceFingerprint] = await Promise.all([
  readFile(manifestPath, 'utf8').then(JSON.parse),
  readFile(masterplanManifestPath, 'utf8').then(JSON.parse),
  readFile(edgeSummaryPath, 'utf8').then(JSON.parse),
  readFile(recipePlanPath, 'utf8').then(JSON.parse),
  readFile(renderConfigPath, 'utf8').then(JSON.parse),
  getEdgeCaseSourceFingerprint(),
  getCreativeRecipeSourceFingerprint(),
]);

if (
  manifest.version !== 2 ||
  !Array.isArray(manifest.cards) ||
  typeof manifest.reviewId !== 'string' ||
  !/^[a-f0-9]{64}$/.test(manifest.reviewId)
) {
  throw new Error('Review-Galerie-Manifest ist ungültig oder besitzt keine stabile Review-ID.');
}
if (!manifest.generatedAt || Number.isNaN(Date.parse(manifest.generatedAt))) {
  throw new Error('Review-Galerie benötigt einen gültigen generatedAt-Zeitstempel.');
}
assertContentReviewCounts({
  production: manifest.masterplanCount,
  edge: manifest.edgeCaseCount,
  recipe: manifest.recipeCount,
  total: manifest.cards.length,
  label: 'Review-Galerie',
});

const expectedUpstreamMode = requestedMode === 'full' ? 'all' : 'smoke';
if (masterplanManifest.mode !== expectedUpstreamMode || masterplanManifest.prototypeCount !== CONTENT_REVIEW_COUNTS.production) {
  throw new Error(`Masterplan-Review benötigt ${CONTENT_REVIEW_COUNTS.production} Renderaufträge im Modus ${expectedUpstreamMode}.`);
}
if (edgeSummary.mode !== expectedUpstreamMode || edgeSummary.caseCount !== CONTENT_REVIEW_COUNTS.edge) {
  throw new Error(`Edge-Case-Review benötigt ${CONTENT_REVIEW_COUNTS.edge} Renderaufträge im Modus ${expectedUpstreamMode}.`);
}
if (recipePlan.mode !== expectedUpstreamMode || recipePlan.recipes?.length !== CONTENT_REVIEW_COUNTS.recipe) {
  throw new Error(`Creative-Recipe-Review benötigt ${CONTENT_REVIEW_COUNTS.recipe} Renderaufträge im Modus ${expectedUpstreamMode}.`);
}
for (const [label, value] of [
  ['Masterplan', masterplanManifest.generatedAt],
  ['Edge-Case', edgeSummary.generatedAt],
  ['Creative-Recipe', recipePlan.generatedAt],
]) {
  if (!value || Number.isNaN(Date.parse(value))) {
    throw new Error(`${label}-Rendergeneration benötigt einen gültigen generatedAt-Zeitstempel.`);
  }
}
if (edgeSummary.sourceFingerprint !== currentEdgeSourceFingerprint) {
  throw new Error('Review-Galerie verweist auf veraltete Edge-Case-Renders.');
}
if (recipePlan.sourceFingerprint !== currentRecipeSourceFingerprint) {
  throw new Error('Review-Galerie verweist auf veraltete Creative-Recipe-Renders.');
}
if (
  manifest.upstreamMode !== expectedUpstreamMode ||
  manifest.masterplanGeneratedAt !== masterplanManifest.generatedAt ||
  manifest.edgeGeneratedAt !== edgeSummary.generatedAt ||
  manifest.recipeGeneratedAt !== recipePlan.generatedAt ||
  manifest.sourceFingerprint !== masterplanManifest.sourceFingerprint ||
  manifest.recipeSourceFingerprint !== currentRecipeSourceFingerprint
) {
  throw new Error('Review-Galerie gehört nicht exakt zu den aktuellen Production-, Edge- und Recipe-Rendergenerationen.');
}

const checkpointKey = requestedMode === 'full' ? 'checkpoints' : 'smokeCheckpoints';
const contentFrameCount = renderConfig?.defaults?.[checkpointKey]?.length;
const recipeFrameCount = CREATIVE_RECIPE_RENDER_CONTRACT[checkpointKey].length;
if (!Number.isInteger(contentFrameCount) || contentFrameCount <= 0 || recipeFrameCount <= 0) {
  throw new Error(`Render-Config enthält keine gültigen ${checkpointKey}.`);
}

const expectedCountByKind = {
  production: CONTENT_REVIEW_COUNTS.production,
  edge: CONTENT_REVIEW_COUNTS.edge,
  recipe: CONTENT_REVIEW_COUNTS.recipe,
};
const actualCountByKind = {production: 0, edge: 0, recipe: 0};
const failures = [];
for (const card of manifest.cards) {
  if (!card.id || !card.compositionId || !(card.kind in actualCountByKind)) {
    failures.push(`${card.id ?? 'unknown'}: Review-Karte ohne gültige id/compositionId/kind`);
    continue;
  }
  actualCountByKind[card.kind] += 1;
  const expectedFrameCount = card.kind === 'recipe' ? recipeFrameCount : contentFrameCount;
  if (card.frameCount !== expectedFrameCount) {
    failures.push(`${card.id}: ${card.frameCount} Kontrollframes statt ${expectedFrameCount} für ${requestedMode}`);
  }
  if (requestedMode === 'full' && !card.hasVideo) failures.push(`${card.id}: kein Video im Full-Review`);
  if (requestedMode === 'smoke' && card.hasVideo) failures.push(`${card.id}: Smoke-Review enthält unerwartetes Video; möglicher Stale-Artifact-Leak`);
}
for (const [kind, count] of Object.entries(expectedCountByKind)) {
  if (actualCountByKind[kind] !== count) failures.push(`${kind}: ${actualCountByKind[kind]} Karten statt ${count}`);
}
if (failures.length > 0) {
  console.error('Review-Galerie-Verifikation fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const html = await readFile(htmlPath, 'utf8');
for (const required of [
  'Content Release Visual Review',
  'Creative Recipes',
  'keine Demo-/Debug-Texte',
  'keine unbelegten exakten Zahlen',
  'Start → Veränderung → Ergebnis verständlich',
  'Review JSON exportieren',
  'visual-review.json',
  manifest.reviewId,
]) {
  if (!html.includes(required)) throw new Error(`Review-Galerie enthält Pflichtbestandteil nicht: ${required}`);
}

const expectedVideos = requestedMode === 'full' ? CONTENT_REVIEW_COUNTS.total : 0;
const expectedFrames =
  (CONTENT_REVIEW_COUNTS.production + CONTENT_REVIEW_COUNTS.edge) * contentFrameCount +
  CONTENT_REVIEW_COUNTS.recipe * recipeFrameCount;
if (manifest.totalVideos !== expectedVideos) {
  throw new Error(`Review-Galerie enthält ${manifest.totalVideos} Videos; erwartet ${expectedVideos} für ${requestedMode}.`);
}
if (manifest.totalFrames !== expectedFrames) {
  throw new Error(`Review-Galerie enthält ${manifest.totalFrames} Frames; erwartet ${expectedFrames} für ${requestedMode}.`);
}

console.log(
  `[content-review] ${requestedMode}-Galerie technisch vollständig: Review-ID ${manifest.reviewId}, ${manifest.masterplanCount} Production + ${manifest.edgeCaseCount} Edge Cases + ${manifest.recipeCount} Creative Recipes = ${manifest.cards.length} Karten, ${manifest.totalFrames} Frames, ${manifest.totalVideos} Videos.`,
);
console.log('[content-review] Dies bestätigt nur die Vollständigkeit der Review-Oberfläche; manuelle Entscheidungen bleiben separat verpflichtend.');
