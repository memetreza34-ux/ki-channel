import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve('out/content-review-gallery');
const htmlPath = resolve(root, 'index.html');
const manifestPath = resolve(root, 'review-manifest.json');

const assertFile = async (path) => {
  try {
    await access(path);
  } catch {
    throw new Error(`Review-Galerie-Datei fehlt: ${path}`);
  }
};

await assertFile(htmlPath);
await assertFile(manifestPath);

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.version !== 1 || !Array.isArray(manifest.cards)) {
  throw new Error('Review-Galerie-Manifest ist ungültig.');
}
if (manifest.masterplanCount !== 22) {
  throw new Error(
    `Review-Galerie benötigt 22 Production-Kompositionen, gefunden: ${manifest.masterplanCount}.`,
  );
}
if (manifest.edgeCaseCount !== 6) {
  throw new Error(
    `Review-Galerie benötigt 6 Edge Cases, gefunden: ${manifest.edgeCaseCount}.`,
  );
}
if (manifest.cards.length !== 28) {
  throw new Error(
    `Review-Galerie benötigt 28 Review-Karten, gefunden: ${manifest.cards.length}.`,
  );
}

const failures = [];
for (const card of manifest.cards) {
  if (!card.id || !card.compositionId) {
    failures.push('Review-Karte ohne id/compositionId');
    continue;
  }
  if (!Number.isInteger(card.frameCount) || card.frameCount <= 0) {
    failures.push(`${card.id}: keine Kontrollframes in Review-Galerie`);
  }
  if (!card.hasVideo) {
    failures.push(`${card.id}: kein Video in Review-Galerie`);
  }
}

if (failures.length > 0) {
  console.error('Review-Galerie-Verifikation fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

const html = await readFile(htmlPath, 'utf8');
for (const required of [
  'Content Release Visual Review',
  'keine Demo-/Debug-Texte',
  'keine unbelegten exakten Zahlen',
  'Start → Veränderung → Ergebnis verständlich',
]) {
  if (!html.includes(required)) {
    throw new Error(`Review-Galerie enthält Pflichtprüfpunkt nicht: ${required}`);
  }
}

console.log(
  `[content-review] Galerie technisch vollständig: ${manifest.masterplanCount} Production + ${manifest.edgeCaseCount} Edge Cases, ${manifest.totalFrames} Frames, ${manifest.totalVideos} Videos.`,
);
console.log(
  '[content-review] Dies bestätigt nur die Vollständigkeit der Review-Oberfläche, nicht die manuelle visuelle Freigabe.',
);
