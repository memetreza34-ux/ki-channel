import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];

const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) {
    failures.push(`${label}: erwartet "${fragment}"`);
  }
};

const requireExcludes = (source, fragment, label) => {
  if (source.includes(fragment)) {
    failures.push(`${label}: darf "${fragment}" nicht enthalten`);
  }
};

const renderAll = read('scripts/render-all-content-release.mjs');
const verifyAll = read('scripts/verify-all-content-release.mjs');
const renderComplete = read('scripts/render-complete-content-release.mjs');
const verifyComplete = read('scripts/verify-complete-content-release.mjs');
const renderMasterplan = read('scripts/render-masterplan-content-release.mjs');
const verifyMasterplan = read('scripts/verify-masterplan-content-release.mjs');
const renderEdgeCases = read('scripts/render-content-motion-edge-cases.mjs');
const verifyEdgeCases = read('scripts/verify-content-motion-edge-case-renders.mjs');
const reviewBuilder = read('scripts/build-content-review-gallery.mjs');
const reviewVerifier = read('scripts/verify-content-review-gallery.mjs');
const releaseRunner = read('scripts/run-content-release.mjs');
const releaseSummaryVerifier = read('scripts/verify-content-release-summary.mjs');
const actionsWorkflow = read('.github/workflows/motion-system-checks.yml');

for (const required of [
  'render-masterplan-content-release.mjs',
  'render-content-motion-edge-cases.mjs',
  'build-content-review-gallery.mjs',
]) {
  requireContains(renderAll, required, 'render-all-content-release');
}
requireExcludes(
  renderAll,
  'render-production-derived-content.mjs',
  'render-all-content-release',
);
for (const required of [
  'verify-masterplan-content-release.mjs',
  'check-content-motion-edge-cases.mjs',
  "['scripts/verify-content-motion-edge-case-renders.mjs', 'full']",
  'check-canonical-content-release-paths.mjs',
  "['scripts/verify-content-review-gallery.mjs', 'full']",
]) {
  requireContains(verifyAll, required, 'verify-all-content-release');
}
requireExcludes(
  verifyAll,
  'verify-production-derived-content.mjs',
  'verify-all-content-release',
);

for (const required of [
  "new Set(['verify', 'smoke', 'full'])",
  'scripts/verify-content-matched-runtime.mjs',
  "['run', 'animation-library:verify']",
  'scripts/render-masterplan-content-release.mjs',
  'scripts/verify-masterplan-content-release.mjs',
  'scripts/render-content-motion-edge-cases.mjs',
  'scripts/verify-content-motion-edge-case-renders.mjs',
  'scripts/build-content-review-gallery.mjs',
  'scripts/verify-content-review-gallery.mjs',
  'scripts/render-all-content-release.mjs',
  'scripts/verify-all-content-release.mjs',
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
requireExcludes(
  releaseRunner,
  'render-production-derived-content.mjs',
  'run-content-release',
);

const initialRunningSummaryIndex = releaseRunner.indexOf(
  "await writeSummary({status: 'running'});",
);
const releaseTryIndex = releaseRunner.indexOf('\ntry {');
const releaseLoopIndex = releaseRunner.indexOf('for (const step of requestedSteps)');
if (
  initialRunningSummaryIndex < 0 ||
  releaseTryIndex < 0 ||
  releaseLoopIndex < 0 ||
  initialRunningSummaryIndex >= releaseTryIndex ||
  initialRunningSummaryIndex >= releaseLoopIndex
) {
  failures.push(
    'run-content-release: aktueller running-Report muss vor try/erstem Child-Step geschrieben werden, damit ein alter passed-Report sofort ungültig wird',
  );
}

for (const required of [
  "new Set(['verify', 'smoke', 'full'])",
  "execFileSync('git'",
  "['rev-parse', 'HEAD']",
  'summary.status !== \'passed\'',
  'summary.gitHead !== currentGitHead',
  'summary.expectedStepCount !== expectedCount',
  "step.status !== 'passed'",
  'expectedCommandFragments',
  'Date.parse(step.completedAt) < Date.parse(step.startedAt)',
]) {
  requireContains(
    releaseSummaryVerifier,
    required,
    'verify-content-release-summary',
  );
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
  'node scripts/render-masterplan-content-release.mjs',
  'node scripts/render-content-motion-edge-cases.mjs',
  'node scripts/build-content-review-gallery.mjs',
  'node scripts/render-all-content-release.mjs',
  'node scripts/verify-all-content-release.mjs',
]) {
  requireExcludes(
    actionsWorkflow,
    forbidden,
    'motion-system-checks workflow direct content-release drift',
  );
}

requireContains(
  renderComplete,
  'render-all-content-release.mjs',
  'render-complete-content-release compatibility alias',
);
requireExcludes(
  renderComplete,
  'render-production-derived-content.mjs',
  'render-complete-content-release compatibility alias',
);
requireContains(
  verifyComplete,
  'verify-all-content-release.mjs',
  'verify-complete-content-release compatibility alias',
);
requireExcludes(
  verifyComplete,
  'verify-production-derived-content.mjs',
  'verify-complete-content-release compatibility alias',
);

for (const [label, source] of [
  ['render-masterplan-content-release', renderMasterplan],
  ['verify-masterplan-content-release', verifyMasterplan],
]) {
  for (const required of [
    'loadPrototypeRuntimeContentDeriver',
    'loadPrototypeRuntimeContentSanitizer',
    'loadPrototypeRuntimeContentAssociation',
    'loadCreatePrototypeRenderProps',
  ]) {
    requireContains(source, required, label);
  }
  const deriveIndex = source.indexOf('derivePrototypeRuntimeContent({');
  const sanitizeIndex = source.indexOf('sanitizePrototypeRuntimeContent({');
  const associateIndex = source.indexOf('associatePrototypeRuntimeContent({');
  const propsIndex = source.indexOf('createPrototypeRenderProps({');
  if (
    deriveIndex < 0 ||
    sanitizeIndex <= deriveIndex ||
    associateIndex <= sanitizeIndex ||
    propsIndex <= associateIndex
  ) {
    failures.push(
      `${label}: Runtime-Reihenfolge muss derive -> sanitize -> associate -> props bleiben`,
    );
  }
}

requireContains(
  renderMasterplan,
  'await rm(outputRoot, {recursive: true, force: true});',
  'render-masterplan-content-release artifact isolation',
);
requireContains(
  renderEdgeCases,
  'await rm(caseOutputRoot, {recursive: true, force: true});',
  'render-content-motion-edge-cases artifact isolation',
);
for (const required of [
  "new Set(['smoke', 'full'])",
  "requestedMode === 'full' ? 'all' : 'smoke'",
  'assertMasterplanPng',
  'assertMasterplanMp4',
  'actualFrameNames',
  'möglicher Stale-Artifact-Leak',
]) {
  requireContains(
    verifyEdgeCases,
    required,
    'verify-content-motion-edge-case-renders',
  );
}
for (const required of [
  'masterplanManifest?.results',
  'edgeSummary?.cases',
  'review-manifest.json',
  'Content Release Visual Review',
]) {
  requireContains(reviewBuilder, required, 'build-content-review-gallery');
}
for (const required of [
  "new Set(['smoke', 'full'])",
  "requestedMode === 'full' ? 'all' : 'smoke'",
  "const checkpointKey = requestedMode === 'full'",
  "? 'checkpoints'",
  "requestedMode === 'smoke' && card.hasVideo",
  '28 * expectedFrameCount',
]) {
  requireContains(reviewVerifier, required, 'verify-content-review-gallery');
}

if (failures.length > 0) {
  console.error('Canonical-Content-Release-Path-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Canonical-Content-Release-Path-Gate bestanden: Unified Runner ist die einzige Content-Release-Quelle für CI und lokal; Run-Reports werden vor Step 1 invalidiert und an Git-HEAD/erwartete Schritte gebunden; all-content/complete nutzen den exakten Masterplan-Grounding-Pfad; 22+6 Artefaktprüfung, Review-Galerie und Render-Isolation sind verpflichtend.',
);
