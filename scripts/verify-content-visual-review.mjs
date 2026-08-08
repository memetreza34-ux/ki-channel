import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const galleryRoot = resolve('out/content-review-gallery');
const manifestPath = resolve(galleryRoot, 'review-manifest.json');
const visualReviewPath = resolve(
  process.argv[2] ?? resolve(galleryRoot, 'visual-review.json'),
);

const [manifest, review] = await Promise.all([
  readFile(manifestPath, 'utf8').then(JSON.parse),
  readFile(visualReviewPath, 'utf8').then(JSON.parse),
]);

if (manifest.version !== 1 || !manifest.reviewId) {
  throw new Error('Review-Galerie-Manifest besitzt keine gültige Review-ID.');
}
if (manifest.upstreamMode !== 'all') {
  throw new Error(
    `Manuelle Freigabe benötigt eine Full-Galerie mit upstreamMode=all, gefunden: ${manifest.upstreamMode}.`,
  );
}
if (
  manifest.masterplanCount !== 22 ||
  manifest.edgeCaseCount !== 6 ||
  manifest.cards?.length !== 28
) {
  throw new Error(
    `Manuelle Freigabe benötigt 22 Production + 6 Edge Cases, gefunden: ${manifest.masterplanCount} + ${manifest.edgeCaseCount}.`,
  );
}
if (manifest.totalVideos !== 28) {
  throw new Error(
    `Manuelle Freigabe benötigt 28 Full-Videos, gefunden: ${manifest.totalVideos}.`,
  );
}

if (review.version !== 1) {
  throw new Error(`Visual-Review-Version ungültig: ${review.version}.`);
}
if (review.reviewId !== manifest.reviewId) {
  throw new Error(
    `Visual Review gehört zu einer anderen Rendergeneration: review=${review.reviewId}, gallery=${manifest.reviewId}.`,
  );
}
if (!review.reviewedAt || Number.isNaN(Date.parse(review.reviewedAt))) {
  throw new Error('Visual Review benötigt einen gültigen reviewedAt-Zeitstempel.');
}
if (
  manifest.generatedAt &&
  Date.parse(review.reviewedAt) < Date.parse(manifest.generatedAt)
) {
  throw new Error(
    'Visual Review ist älter als die aktuelle Review-Galerie und damit stale.',
  );
}
if (!Array.isArray(review.cards) || review.cardCount !== 28 || review.cards.length !== 28) {
  throw new Error(
    `Visual Review benötigt exakt 28 Karten, gefunden: ${review.cards?.length ?? 0}.`,
  );
}
if (review.completedCardCount !== 28) {
  throw new Error(
    `Visual Review ist unvollständig: ${review.completedCardCount}/28 Karten vollständig geprüft.`,
  );
}

const requiredCheckKeys = [
  'contentCorrect',
  'noDemoDebug',
  'noFakePrecision',
  'stateChangeClear',
  'endHoldClear',
];
const manifestById = new Map(
  manifest.cards.map((card) => [card.id, card]),
);
const seen = new Set();
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
    failures.push(
      `${card.id}: Review-Metadaten stimmen nicht mit der aktuellen Galerie überein`,
    );
  }
  if (card.approved !== true) {
    failures.push(`${card.id}: visuell geprüft/approved fehlt`);
  }
  for (const checkKey of requiredCheckKeys) {
    if (card.checks?.[checkKey] !== true) {
      failures.push(`${card.id}: Pflichtcheck ${checkKey} ist nicht bestätigt`);
    }
  }
}

for (const expected of manifest.cards) {
  if (!seen.has(expected.id)) {
    failures.push(`${expected.id}: fehlt im Visual Review`);
  }
}

if (failures.length > 0) {
  console.error('Manuelle Visual-Review-Verifikation fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `[content-visual-review] Freigabenachweis vollständig: Review-ID ${manifest.reviewId}, 28/28 Karten mit allen Pflichtchecks.`,
);
console.log(
  '[content-visual-review] Der Nachweis bestätigt die dokumentierten manuellen Entscheidungen für genau diese Full-Rendergeneration.',
);
