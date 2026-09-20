import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];
const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) failures.push(`${label}: erwartet "${fragment}"`);
};
const requireExcludes = (source, fragment, label) => {
  if (source.includes(fragment)) failures.push(`${label}: darf "${fragment}" nicht enthalten`);
};

const renderAll = read('scripts/render-all-content-release.mjs');
const verifyAll = read('scripts/verify-all-content-release.mjs');
const renderComplete = read('scripts/render-complete-content-release.mjs');
const verifyComplete = read('scripts/verify-complete-content-release.mjs');
const renderMasterplan = read('scripts/render-masterplan-content-release.mjs');
const verifyMasterplan = read('scripts/verify-masterplan-content-release.mjs');
const masterplanUtils = read('scripts/masterplan-content-release-utils.mjs');
const masterplanFixturePreflight = read('scripts/check-masterplan-production-fixtures.mjs');
const renderEdgeCases = read('scripts/render-content-motion-edge-cases.mjs');
const verifyEdgeCases = read('scripts/verify-content-motion-edge-case-renders.mjs');
const renderRecipes = read('scripts/render-creative-recipes.mjs');
const verifyRecipes = read('scripts/check-creative-recipe-renders.mjs');
const recipeContract = read('scripts/creative-recipe-release-contract.mjs');
const reviewContract = read('scripts/content-review-contract.mjs');
const reviewBuilder = read('scripts/build-content-review-gallery.mjs');
const reviewVerifier = read('scripts/verify-content-review-gallery.mjs');
const releaseRunner = read('scripts/run-content-release.mjs');
const releaseSummaryVerifier = read('scripts/verify-content-release-summary.mjs');
const actionsWorkflow = read('.github/workflows/motion-system-checks.yml');

for (const required of [
  'render-masterplan-content-release.mjs',
  'render-content-motion-edge-cases.mjs',
  'render-creative-recipes.mjs',
  'build-content-review-gallery.mjs',
  'CONTENT_REVIEW_COUNTS.total',
]) {
  requireContains(renderAll, required, 'render-all-content-release');
}
requireExcludes(renderAll, 'render-production-derived-content.mjs', 'render-all-content-release');

for (const required of [
  'verify-masterplan-content-release.mjs',
  'check-content-motion-edge-cases.mjs',
  "['scripts/verify-content-motion-edge-case-renders.mjs', 'full']",
  'check-creative-recipe-renders.mjs',
  'check-canonical-content-release-paths.mjs',
  "['scripts/verify-content-review-gallery.mjs', 'full']",
  'CONTENT_REVIEW_COUNTS.total',
]) {
  requireContains(verifyAll, required, 'verify-all-content-release');
}
requireExcludes(verifyAll, 'verify-production-derived-content.mjs', 'verify-all-content-release');

for (const required of [
  "new Set(['verify', 'smoke', 'full'])",
  'scripts/verify-content-matched-runtime.mjs',
  "['run', 'animation-library:verify']",
  "['run', 'creative-recipes:verify']",
  'scripts/render-masterplan-content-release.mjs',
  'scripts/verify-masterplan-content-release.mjs',
  'scripts/render-content-motion-edge-cases.mjs',
  'scripts/verify-content-motion-edge-case-renders.mjs',
  "['run', 'creative-recipes:smoke']",
  "['run', 'creative-recipes:check']",
  'scripts/build-content-review-gallery.mjs',
  'scripts/verify-content-review-gallery.mjs',
  'scripts/render-all-content-release.mjs',
  'scripts/verify-all-content-release.mjs',
  'CONTENT_REVIEW_COUNTS.total',
  'content-release-run',
  "status: 'failed'",
  "status: 'passed'",
  "completedAt: status === 'running' ? null",
  'gitHead: currentGitHead',
  'expectedStepCount: requestedSteps.length',
  "steps.some((step) => step.status !== 'passed')",
]) {
  requireContains(releaseRunner, required, 'run-content-release');
}
requireExcludes(releaseRunner, 'render-production-derived-content.mjs', 'run-content-release');

const initialRunningSummaryIndex = releaseRunner.indexOf("await writeSummary({status: 'running'});");
const releaseTryIndex = releaseRunner.indexOf('\ntry {');
const releaseLoopIndex = releaseRunner.indexOf('for (const step of requestedSteps)');
if (
  initialRunningSummaryIndex < 0 ||
  releaseTryIndex < 0 ||
  releaseLoopIndex < 0 ||
  initialRunningSummaryIndex >= releaseTryIndex ||
  initialRunningSummaryIndex >= releaseLoopIndex
) {
  failures.push('run-content-release: aktueller running-Report muss vor try/erstem Child-Step geschrieben werden, damit ein alter passed-Report sofort ungültig wird');
}

for (const required of [
  "new Set(['verify', 'smoke', 'full'])",
  "execFileSync('git'",
  "['rev-parse', 'HEAD']",
  "summary.version !== 2",
  'summary.creativeRecipeGateEnabled !== true',
  "summary.status !== 'passed'",
  'summary.gitHead !== currentGitHead',
  'summary.expectedStepCount !== expectedCount',
  "step.status !== 'passed'",
  'expectedCommandFragments',
  'creative-recipes:verify',
  'CONTENT_REVIEW_COUNTS.total',
  'Date.parse(step.completedAt) < Date.parse(step.startedAt)',
]) {
  requireContains(releaseSummaryVerifier, required, 'verify-content-release-summary');
}

for (const required of [
  'workflow_dispatch:',
  'release_mode:',
  '- verify',
  '- smoke',
  '- full',
  'node scripts/run-content-release.mjs "${{ inputs.release_mode }}"',
  'out/content-release-run/',
]) {
  requireContains(actionsWorkflow, required, 'motion-system-checks workflow');
}
for (const forbidden of [
  'node scripts/verify-content-matched-runtime.mjs',
  'npm run animation-library:verify',
  'npm run creative-recipes:verify',
  'node scripts/render-masterplan-content-release.mjs',
  'node scripts/render-content-motion-edge-cases.mjs',
  'node scripts/render-creative-recipes.mjs',
  'node scripts/build-content-review-gallery.mjs',
  'node scripts/render-all-content-release.mjs',
  'node scripts/verify-all-content-release.mjs',
]) {
  requireExcludes(actionsWorkflow, forbidden, 'motion-system-checks workflow direct content-release drift');
}

requireContains(renderComplete, 'render-all-content-release.mjs', 'render-complete-content-release compatibility alias');
requireExcludes(renderComplete, 'render-production-derived-content.mjs', 'render-complete-content-release compatibility alias');
requireContains(verifyComplete, 'verify-all-content-release.mjs', 'verify-complete-content-release compatibility alias');
requireExcludes(verifyComplete, 'verify-production-derived-content.mjs', 'verify-complete-content-release compatibility alias');

for (const [label, source] of [
  ['render-masterplan-content-release', renderMasterplan],
  ['verify-masterplan-content-release', verifyMasterplan],
]) {
  for (const required of [
    'loadSceneMeaningEnhancer',
    'loadPrototypeRuntimeContentDeriver',
    'loadPrototypeRuntimeContentSanitizer',
    'loadPrototypeRuntimeContentAssociation',
    'loadCreatePrototypeRenderProps',
    'masterplan-content-fixtures.json',
    'meaning+derive+sanitize+associate+createPrototypeRenderProps',
  ]) {
    requireContains(source, required, label);
  }
  requireExcludes(source, "'ki/src/animation-library/content-render-fixtures.json'", `${label} demo fixture isolation`);
  const meaningIndex = source.indexOf('enhanceSceneMeaning(sourceContent.spokenText)');
  const deriveIndex = source.indexOf('derivePrototypeRuntimeContent({');
  const sanitizeIndex = source.indexOf('sanitizePrototypeRuntimeContent({');
  const associateIndex = source.indexOf('associatePrototypeRuntimeContent({');
  const propsIndex = source.indexOf('createPrototypeRenderProps({');
  if (
    meaningIndex < 0 || deriveIndex <= meaningIndex || sanitizeIndex <= deriveIndex ||
    associateIndex <= sanitizeIndex || propsIndex <= associateIndex
  ) {
    failures.push(`${label}: Runtime-Reihenfolge muss meaning -> derive -> sanitize -> associate -> props bleiben`);
  }
}

for (const required of [
  'ki/src/animation-library/masterplan-content-fixtures.json',
  'ki/src/animation-library/meaningContract.ts',
  'ki/src/animation-library/extendedMeaningContract.ts',
  'scripts/load-scene-meaning-enhancer.mjs',
  'fixture?.content ?? fixture?.props?.content ?? fixture ?? null',
]) {
  requireContains(masterplanUtils, required, 'masterplan-content-release-utils');
}
requireExcludes(masterplanUtils, "'ki/src/animation-library/content-render-fixtures.json'", 'masterplan-content-release-utils production fingerprint');

for (const required of [
  '22/22 Production-IDs',
  'masterplan-content-fixtures.json',
  'content-render-fixtures.json',
  'meaning -> derive -> sanitize -> associate -> props',
  '94\\s*Cent',
  '780\\s*Millisekunden',
]) {
  requireContains(masterplanFixturePreflight, required, 'check-masterplan-production-fixtures');
}

requireContains(renderMasterplan, 'await rm(outputRoot, {recursive: true, force: true});', 'render-masterplan-content-release artifact isolation');
requireContains(renderEdgeCases, 'await rm(caseOutputRoot, {recursive: true, force: true});', 'render-content-motion-edge-cases artifact isolation');
for (const required of [
  "new Set(['smoke', 'full'])",
  "requestedMode === 'full' ? 'all' : 'smoke'",
  'assertMasterplanPng',
  'assertMasterplanMp4',
  'actualFrameNames',
  'möglicher Stale-Artifact-Leak',
]) {
  requireContains(verifyEdgeCases, required, 'verify-content-motion-edge-case-renders');
}

for (const required of [
  'creative-recipe-release-contract.mjs',
  'getCreativeRecipeSourceFingerprint',
  "rm(recipe.outputDir, {recursive: true, force: true})",
  'sourceFingerprint',
  'generatedAt',
  'CREATIVE_RECIPE_RENDER_CONTRACT',
]) {
  requireContains(renderRecipes, required, 'render-creative-recipes canonical release path');
}
for (const required of [
  'getCreativeRecipeSourceFingerprint',
  'plan.sourceFingerprint !== currentSourceFingerprint',
  'Creative-Recipe-Renders sind stale',
  'CREATIVE_RECIPE_RENDER_CONTRACT',
  'PNG_SIGNATURE',
  'ftyp',
]) {
  requireContains(verifyRecipes, required, 'check-creative-recipe-renders canonical release path');
}
for (const required of [
  'CREATIVE_RECIPE_SOURCE_PATHS',
  'getCreativeRecipeSourceFingerprint',
  'CREATIVE_RECIPE_REVIEW_EXPECTATIONS',
  'width: 1080',
  'height: 1100',
]) {
  requireContains(recipeContract, required, 'creative-recipe-release-contract');
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
  'masterplanManifest?.results',
  'edgeSummary?.cases',
  'recipePlan?.recipes',
  'CREATIVE_RECIPE_REVIEW_EXPECTATIONS',
  'recipeSourceFingerprint',
  'review-manifest.json',
  'Content Release Visual Review',
  'Creative Recipes',
]) {
  requireContains(reviewBuilder, required, 'build-content-review-gallery');
}
for (const required of [
  "new Set(['smoke', 'full'])",
  "requestedMode === 'full' ? 'all' : 'smoke'",
  "const checkpointKey = requestedMode === 'full'",
  'recipeFrameCount',
  'CONTENT_REVIEW_COUNTS.recipe',
  'CONTENT_REVIEW_COUNTS.total',
  'recipePlan.sourceFingerprint !== currentRecipeSourceFingerprint',
  "requestedMode === 'smoke' && card.hasVideo",
  'expectedFrames',
]) {
  requireContains(reviewVerifier, required, 'verify-content-review-gallery');
}
requireExcludes(reviewVerifier, '28 * expectedFrameCount', 'verify-content-review-gallery legacy 28-card count');

if (failures.length > 0) {
  console.error('Canonical-Content-Release-Path-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Canonical-Content-Release-Path-Gate bestanden: Production-Fixtures bleiben von Demo-Fixtures getrennt; Masterplan nutzt meaning -> derive -> sanitize -> associate -> props; Creative Recipes sind source-fingerprinted und Teil des all-inclusive Render-/Verify-Pfads; Unified Runner bleibt einzige CI/lokale Release-Quelle; 22+6+8 = 36 Review-Karten und Render-Isolation sind verpflichtend.');
