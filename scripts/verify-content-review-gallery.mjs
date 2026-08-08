import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const requestedMode = process.argv[2] ?? 'full';
const VALID_MODES = new Set(['smoke', 'full']);
if (!VALID_MODES.has(requestedMode)) {
  throw new Error(
    'Aufruf: node scripts/verify-content-review-gallery.mjs [smoke|full]',
  );
}

const root = resolve('out/content-review-gallery');
const htmlPath = resolve(root, 'index.html');
const manifestPath = resolve(root, 'review-manifest.json');
const masterplanManifestPath = resolve(
  'out/masterplan-content-release/manifest.json',
);
const edgeSummaryPath = resolve(
  'out/content-motion-edge-cases/edge-case-render-summary.json',
);
const renderConfigPath = resolve(
  'ki/src/animation-library/prototype-render-config.json',
);

const assertFile = async (path) => {
  try {
    await access(path);
  } catch {
    throw new Error(`Review-Galerie-Datei fehlt: ${path}`);
  }
};

for (const path of [
  htmlPath,
  manifestPath,
  masterplanManifestPath,
  edgeSummaryPath,
  renderConfigPath,
]) {
  await assertFile(path);
}

const [manifest, masterplanManifest, edgeSummary, renderConfig] =
  await Promise.all([
    readFile(manifestPath, 'utf8').then(JSON.parse),
    readFile(masterplanManifestPath, 'utf8').then(JSON.parse),
    readFile(edgeSummaryPath, 'utf8').then(JSON.parse),
    readFile(renderConfigPath, 'utf8').then(JSON.parse),
  ]);

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

const expectedUpstreamMode = requestedMode === 'full' ? 'all' : 'smoke';
if (masterplanManifest.mode !== expectedUpstreamMode) {
  throw new Error(
    `Masterplan-Review erwartet Modus ${expectedUpstreamMode}, gefunden: ${masterplanManifest.mode}.`,
  );
}
if (masterplanManifest.prototypeCount !== 22) {
  throw new Error(
    `Masterplan-Review benötigt 22 Renderaufträge, gefunden: ${masterplanManifest.prototypeCount}.`,
  );
}
if (edgeSummary.mode !== expectedUpstreamMode) {
  throw new Error(
    `Edge-Case-Review erwartet Modus ${expectedUpstreamMode}, gefunden: ${edgeSummary.mode}.`,
  );
}
if (edgeSummary.caseCount !== 6) {
  throw new Error(
    `Edge-Case-Review benötigt 6 Renderaufträge, gefunden: ${edgeSummary.caseCount}.`,
  );
}

const checkpointKey = requestedMode === 'full'
  ? 'checkpoints'
  : 'smokeCheckpoints';
const expectedFrameCount = renderConfig?.defaults?.[checkpointKey]?.length;
if (!Number.isInteger(expectedFrameCount) || expectedFrameCount <= 0) {
  throw new Error(`Render-Config enthält keine gültigen ${checkpointKey}.`);
}

const failures = [];
for (const card of manifest.cards) {
  if (!card.id || !card.compositionId) {
    failures.push('Review-Karte ohne id/compositionId');
    continue;
  }
  if (card.frameCount !== expectedFrameCount) {
    failures.push(
      `${card.id}: ${card.frameCount} Kontrollframes statt ${expectedFrameCount} für ${requestedMode}`,
    );
  }
  if (requestedMode === 'full' && !card.hasVideo) {
    failures.push(`${card.id}: kein Video im Full-Review`);
  }
  if (requestedMode === 'smoke' && card.hasVideo) {
    failures.push(
      `${card.id}: Smoke-Review enthält unerwartetes Video; möglicher Stale-Artifact-Leak`,
    );
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

const expectedVideos = requestedMode === 'full' ? 28 : 0;
if (manifest.totalVideos !== expectedVideos) {
  throw new Error(
    `Review-Galerie enthält ${manifest.totalVideos} Videos; erwartet ${expectedVideos} für ${requestedMode}.`,
  );
}
if (manifest.totalFrames !== 28 * expectedFrameCount) {
  throw new Error(
    `Review-Galerie enthält ${manifest.totalFrames} Frames; erwartet ${28 * expectedFrameCount} für ${requestedMode}.`,
  );
}

console.log(
  `[content-review] ${requestedMode}-Galerie technisch vollständig: ${manifest.masterplanCount} Production + ${manifest.edgeCaseCount} Edge Cases, ${manifest.totalFrames} Frames, ${manifest.totalVideos} Videos.`,
);
console.log(
  '[content-review] Dies bestätigt nur die Vollständigkeit der Review-Oberfläche, nicht die manuelle visuelle Freigabe.',
);
