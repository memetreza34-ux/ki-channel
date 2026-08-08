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
const reviewBuilder = read('scripts/build-content-review-gallery.mjs');
const reviewVerifier = read('scripts/verify-content-review-gallery.mjs');

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
  "requestedMode === 'full' ? 'checkpoints'",
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
  'Canonical-Content-Release-Path-Gate bestanden: all-content/complete führen ausschließlich über den exakten Masterplan-Grounding-Pfad; 22+6 Review-Galerie und Render-Artefakt-Isolation sind verpflichtend.',
);
