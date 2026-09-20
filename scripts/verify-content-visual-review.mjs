import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {
  CONTENT_REVIEW_COUNTS,
  CONTENT_REVIEW_REQUIRED_CHECK_KEYS,
  assertContentReviewCounts,
} from './content-review-contract.mjs';

const galleryRoot = resolve('out/content-review-gallery');
const manifestPath = resolve(galleryRoot, 'review-manifest.json');
const visualReviewPath = resolve(
  process.argv[2] ?? resolve(galleryRoot, 'visual-review.json'),
);
const [manifest, review] = await Promise.all([
  readFile(manifestPath, 'utf8').then(JSON.parse),
  readFile(visualReviewPath, 'utf8').then(JSON.parse),
]);

if (manifest.version !== 2 || !manifest.reviewId) {
  throw new Error('Review-Galerie-Manifest besitzt keine gültige Review-ID oder ist veraltet.');
}
if (manifest.upstreamMode !== 'all') {
  throw new Error(`Manuelle Freigabe benötigt upstreamMode=all, gefunden: ${manifest.upstreamMode}.`);
}
assertContentReviewCounts({
  production: manifest.masterplanCount,
  edge: manifest.edgeCaseCount,
  recipe: manifest.recipeCount,
  total: manifest.cards?.length,
  label: 'Manuelle Freigabe',
});
if (manifest.totalVideos !== CONTENT_REVIEW_COUNTS.total) {
  throw new Error(`Manuelle Freigabe benötigt ${CONTENT_REVIEW_COUNTS.total} Full-Videos, gefunden: ${manifest.totalVideos}.`);
}

if (review.version !== 1) throw new Error(`Visual-Review-Version ungültig: ${review.version}.`);
if (review.reviewId !== manifest.reviewId) {
  throw new Error(`Visual Review gehört zu einer anderen Rendergeneration: review=${review.reviewId}, gallery=${manifest.reviewId}.`);
}
if (!review.reviewedAt || Number.isNaN(Date.parse(review.reviewedAt))) {
  throw new Error('Visual Review benötigt einen gültigen reviewedAt-Zeitstempel.');
}
if (manifest.generatedAt && Date.parse(review.reviewedAt) < Date.parse(manifest.generatedAt)) {
  throw new Error('Visual Review ist älter als die aktuelle Review-Galerie und damit stale.');
}
if (!Array.isArray(review.cards) || review.cardCount !== CONTENT_REVIEW_COUNTS.total || review.cards.length !== CONTENT_REVIEW_COUNTS.total) {
  throw new Error(`Visual Review benötigt exakt ${CONTENT_REVIEW_COUNTS.total} Karten, gefunden: ${review.cards?.length ?? 0}.`);
}
if (review.completedCardCount !== CONTENT_REVIEW_COUNTS.total) {
  throw new Error(`Visual Review ist unvollständig: ${review.completedCardCount}/${CONTENT_REVIEW_COUNTS.total} Karten vollständig geprüft.`);
}

const manifestById = new Map(manifest.cards.map((card) => [card.id, card]));
const seen = new Set();
const reviewedKinds = {production: 0, edge: 0, recipe: 0};
const failures = [];
for (const card of review.cards) {
  if (!card?.id || seen.has(card.id)) {
    failures.push(`${card?.id ?? 'unknown'}: fehlende oder doppelte Karten-ID`);
    continue;
  }
  seen.add(card.id);
  const expected = manifestById.get(card.id);
  if (!expected) {
    failures.push(`${card.id}: Karte existiert nicht in der aktuellen Galerie`);
    continue;
  }
  if (
    card.kind !== expected.kind ||
    card.compositionId !== expected.compositionId ||
    card.frameCount !== expected.frameCount ||
    card.hasVideo !== expected.hasVideo
  ) {
    failures.push(`${card.id}: Review-Metadaten stimmen nicht mit der aktuellen Galerie überein`);
  }
  if (card.kind in reviewedKinds) reviewedKinds[card.kind] += 1;
  else failures.push(`${card.id}: unbekannte Review-Art ${card.kind}`);
  if (card.approved !== true) failures.push(`${card.id}: visuell geprüft/approved fehlt`);
  for (const checkKey of CONTENT_REVIEW_REQUIRED_CHECK_KEYS) {
    if (card.checks?.[checkKey] !== true) failures.push(`${card.id}: Pflichtcheck ${checkKey} ist nicht bestätigt`);
  }
}
for (const expected of manifest.cards) {
  if (!seen.has(expected.id)) failures.push(`${expected.id}: fehlt im Visual Review`);
}
for (const [kind, expected] of Object.entries({
  production: CONTENT_REVIEW_COUNTS.production,
  edge: CONTENT_REVIEW_COUNTS.edge,
  recipe: CONTENT_REVIEW_COUNTS.recipe,
})) {
  if (reviewedKinds[kind] !== expected) failures.push(`${kind}: ${reviewedKinds[kind]} Reviews statt ${expected}`);
}

if (failures.length > 0) {
  console.error('Manuelle Visual-Review-Verifikation fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `[content-visual-review] Freigabenachweis vollständig: Review-ID ${manifest.reviewId}, ${CONTENT_REVIEW_COUNTS.total}/${CONTENT_REVIEW_COUNTS.total} Karten mit allen Pflichtchecks inklusive ${CONTENT_REVIEW_COUNTS.recipe} Creative Recipes.`,
);
console.log('[content-visual-review] Der Nachweis bestätigt die dokumentierten manuellen Entscheidungen für genau diese Full-Rendergeneration.');
