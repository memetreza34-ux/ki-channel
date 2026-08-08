import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const failures = [];

const requireContains = (source, fragment, label) => {
  if (!source.includes(fragment)) {
    failures.push(`${label}: erwartet "${fragment}"`);
  }
};

const galleryBuilder = read('scripts/build-content-review-gallery.mjs');
const galleryVerifier = read('scripts/verify-content-review-gallery.mjs');
const visualVerifier = read('scripts/verify-content-visual-review.mjs');
const finalizer = read('scripts/finalize-content-release.mjs');
const edgeRenderer = read('scripts/render-content-motion-edge-cases.mjs');
const edgeVerifier = read('scripts/verify-content-motion-edge-case-renders.mjs');
const edgeUtils = read('scripts/edge-case-release-utils.mjs');

for (const required of [
  "import {createHash} from 'node:crypto'",
  "createHash('sha256')",
  'masterplanManifest.generatedAt',
  'edgeSummary.generatedAt',
  'sourceFingerprint',
  'REVIEW_CHECK_KEYS',
  'localStorage',
  'Review JSON exportieren',
  "link.download = 'visual-review.json'",
  'completedCardCount',
  'reviewId,',
]) {
  requireContains(galleryBuilder, required, 'build-content-review-gallery');
}

for (const required of [
  'manifest.reviewId',
  'manifest.upstreamMode !== expectedUpstreamMode',
  'manifest.masterplanGeneratedAt !== masterplanManifest.generatedAt',
  'manifest.edgeGeneratedAt !== edgeSummary.generatedAt',
  'manifest.sourceFingerprint !== masterplanManifest.sourceFingerprint',
  'Review JSON exportieren',
  'visual-review.json',
]) {
  requireContains(galleryVerifier, required, 'verify-content-review-gallery');
}

for (const required of [
  "manifest.upstreamMode !== 'all'",
  'manifest.totalVideos !== 28',
  'review.reviewId !== manifest.reviewId',
  'review.completedCardCount !== 28',
  'requiredCheckKeys',
  "card.approved !== true",
  "card.checks?.[checkKey] !== true",
  'Date.parse(review.reviewedAt) < Date.parse(manifest.generatedAt)',
]) {
  requireContains(visualVerifier, required, 'verify-content-visual-review');
}

for (const required of [
  "['scripts/verify-content-release-summary.mjs', 'full']",
  "['scripts/verify-content-review-gallery.mjs', 'full']",
  "['scripts/verify-content-visual-review.mjs', visualReviewPath]",
  "steps.length !== 3",
  "steps.some((step) => step.status !== 'passed')",
  "status: 'passed'",
  'technicalCompletedAt',
  'reviewedAt',
  'manualVisualReviewVerified: true',
  'finalization.json',
]) {
  requireContains(finalizer, required, 'finalize-content-release');
}

const summaryIndex = finalizer.indexOf(
  "['scripts/verify-content-release-summary.mjs', 'full']",
);
const galleryIndex = finalizer.indexOf(
  "['scripts/verify-content-review-gallery.mjs', 'full']",
);
const visualIndex = finalizer.indexOf(
  "['scripts/verify-content-visual-review.mjs', visualReviewPath]",
);
if (
  summaryIndex < 0 ||
  galleryIndex <= summaryIndex ||
  visualIndex <= galleryIndex
) {
  failures.push(
    'finalize-content-release: Reihenfolge muss fresh full summary -> full gallery -> manual visual review bleiben',
  );
}

for (const required of [
  'getEdgeCaseSourceFingerprint',
  'sourceFingerprint,',
  'generatedAt: new Date().toISOString()',
]) {
  requireContains(
    edgeRenderer,
    required,
    'render-content-motion-edge-cases review generation fingerprint',
  );
}
for (const required of [
  'getEdgeCaseSourceFingerprint',
  'summary.sourceFingerprint !== currentSourceFingerprint',
  'Edge-Case-Render-Artefakte sind veraltet',
]) {
  requireContains(
    edgeVerifier,
    required,
    'verify-content-motion-edge-case-renders source freshness',
  );
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

console.log(
  'Content-Review-Finalization-Gate bestanden: Review-ID bindet die konkrete source-fingerprinted Rendergeneration; Edge Cases besitzen einen eigenen Config-/Renderer-Fingerprint; 28/28 manuelle Entscheidungen und frischer technischer Full-Report sind für die Finalisierung verpflichtend.',
);
