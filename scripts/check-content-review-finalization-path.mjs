import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];
const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) failures.push(`${label}: erwartet "${fragment}"`);
};

const galleryBuilder = read('scripts/build-content-review-gallery.mjs');
const galleryVerifier = read('scripts/verify-content-review-gallery.mjs');
const visualVerifier = read('scripts/verify-content-visual-review.mjs');
const finalizer = read('scripts/finalize-content-release.mjs');
const releaseStatus = read('scripts/content-release-status.mjs');
const reviewContract = read('scripts/content-review-contract.mjs');
const recipeContract = read('scripts/creative-recipe-release-contract.mjs');
const edgeRenderer = read('scripts/render-content-motion-edge-cases.mjs');
const edgeVerifier = read('scripts/verify-content-motion-edge-case-renders.mjs');
const edgeUtils = read('scripts/edge-case-release-utils.mjs');

for (const required of [
  "import {createHash} from 'node:crypto'",
  "createHash('sha256')",
  'masterplanManifest.generatedAt',
  'edgeSummary.generatedAt',
  'recipePlan?.generatedAt',
  'recipeSourceFingerprint',
  'CONTENT_REVIEW_CHECK_KEYS',
  'CREATIVE_RECIPE_REVIEW_EXPECTATIONS',
  'localStorage',
  'Review JSON exportieren',
  "link.download='visual-review.json'",
  'completedCardCount',
  'recipeCount',
]) {
  requireContains(galleryBuilder, required, 'build-content-review-gallery');
}

for (const required of [
  'getEdgeCaseSourceFingerprint',
  'getCreativeRecipeSourceFingerprint',
  'currentRecipeSourceFingerprint',
  'recipePlan.sourceFingerprint !== currentRecipeSourceFingerprint',
  'Review-Galerie verweist auf veraltete Creative-Recipe-Renders',
  'manifest.reviewId',
  'manifest.upstreamMode !== expectedUpstreamMode',
  'manifest.recipeGeneratedAt !== recipePlan.generatedAt',
  'manifest.recipeSourceFingerprint !== currentRecipeSourceFingerprint',
  'CONTENT_REVIEW_COUNTS',
  'Review JSON exportieren',
  'visual-review.json',
]) {
  requireContains(galleryVerifier, required, 'verify-content-review-gallery');
}

for (const required of [
  "manifest.upstreamMode !== 'all'",
  'CONTENT_REVIEW_COUNTS.total',
  'CONTENT_REVIEW_REQUIRED_CHECK_KEYS',
  'review.reviewId !== manifest.reviewId',
  'review.completedCardCount !== CONTENT_REVIEW_COUNTS.total',
  "card.approved !== true",
  "card.checks?.[checkKey] !== true",
  "recipe: CONTENT_REVIEW_COUNTS.recipe",
  'Date.parse(review.reviewedAt) < Date.parse(manifest.generatedAt)',
]) {
  requireContains(visualVerifier, required, 'verify-content-visual-review');
}

for (const required of [
  "['scripts/verify-content-release-summary.mjs', 'full']",
  "['scripts/verify-all-content-release.mjs']",
  "['scripts/check-creative-recipe-renders.mjs']",
  "['scripts/verify-content-review-gallery.mjs', 'full']",
  "['scripts/verify-content-visual-review.mjs', visualReviewPath]",
  'steps.length !== 5',
  "steps.some((step) => step.status !== 'passed')",
  "status: 'passed'",
  'technicalArtifactsReverified: true',
  'creativeRecipeReviewRequired: true',
  'creativeRecipeReviewVerified: true',
  'technicalCompletedAt',
  'reviewedAt',
  'manualVisualReviewVerified: true',
  'finalization.json',
]) {
  requireContains(finalizer, required, 'finalize-content-release');
}

const summaryIndex = finalizer.indexOf("['scripts/verify-content-release-summary.mjs', 'full']");
const artifactIndex = finalizer.indexOf("['scripts/verify-all-content-release.mjs']");
const recipeIndex = finalizer.indexOf("['scripts/check-creative-recipe-renders.mjs']");
const galleryIndex = finalizer.indexOf("['scripts/verify-content-review-gallery.mjs', 'full']");
const visualIndex = finalizer.indexOf("['scripts/verify-content-visual-review.mjs', visualReviewPath]");
if (
  summaryIndex < 0 ||
  artifactIndex <= summaryIndex ||
  recipeIndex <= artifactIndex ||
  galleryIndex <= recipeIndex ||
  visualIndex <= galleryIndex
) {
  failures.push('finalize-content-release: Reihenfolge muss fresh full summary -> full artifacts -> recipe artifacts -> full gallery -> manual visual review bleiben');
}

for (const required of [
  'production: 22',
  'edge: 6',
  'recipe: CREATIVE_RECIPE_IDS.length',
  'total: 22 + 6 + CREATIVE_RECIPE_IDS.length',
]) {
  requireContains(reviewContract, required, 'content-review-contract');
}
for (const required of [
  'CREATIVE_RECIPE_SOURCE_PATHS',
  'getCreativeRecipeSourceFingerprint',
  'CREATIVE_RECIPE_REVIEW_EXPECTATIONS',
  'sourceFingerprint',
]) {
  requireContains(recipeContract, required, 'creative-recipe-release-contract');
}
for (const required of [
  'creativeRecipes: recipeState',
  'creativeRecipeReviewVerified',
  'reviewState.cardCount !== CONTENT_REVIEW_COUNTS.total',
]) {
  requireContains(releaseStatus, required, 'content-release-status');
}

for (const required of [
  'getEdgeCaseSourceFingerprint',
  'sourceFingerprint,',
  'generatedAt: new Date().toISOString()',
]) {
  requireContains(edgeRenderer, required, 'render-content-motion-edge-cases review generation fingerprint');
}
for (const required of [
  'getEdgeCaseSourceFingerprint',
  'summary.sourceFingerprint !== currentSourceFingerprint',
  'Edge-Case-Render-Artefakte sind veraltet',
]) {
  requireContains(edgeVerifier, required, 'verify-content-motion-edge-case-renders source freshness');
}
for (const required of [
  'getMasterplanContentSourceFingerprint',
  'content-motion-edge-cases.json',
  'render-content-motion-edge-cases.mjs',
  'verify-content-motion-edge-case-renders.mjs',
  'edge-case-release-utils.mjs',
]) {
  requireContains(edgeUtils, required, 'edge-case-release-utils fingerprint inputs');
}

if (failures.length > 0) {
  console.error('Content-Review-Finalization-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Content-Review-Finalization-Gate bestanden: Review-Galerie bindet Production-, Edge- und Creative-Recipe-Rendergenerationen per Fingerprint; Finalizer reverifiziert alle technischen Artefakte; 36/36 manuelle Entscheidungen inklusive 8 Creative Recipes und frischer technischer Full-Report sind verpflichtend.');
