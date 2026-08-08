import {resolve} from 'node:path';
import {loadPrototypeRuntimeContentDeriver} from './load-prototype-runtime-content-deriver.mjs';
import {
  assertMp4,
  assertPng,
  getFixtureContent,
  getProductionDerivedSourceFingerprint,
  PRODUCTION_DERIVED_OUTPUT_ROOT,
  readJson,
} from './production-derived-release-utils.mjs';

const complete = process.argv.includes('--complete');
const config = await readJson(
  'ki/src/animation-library/prototype-render-config.json',
);
const fixtureConfig = await readJson(
  'ki/src/animation-library/content-render-fixtures.json',
);
const manifest = await readJson(
  resolve(PRODUCTION_DERIVED_OUTPUT_ROOT, 'manifest.json'),
);

if (manifest.version !== 1 || !Array.isArray(manifest.results)) {
  throw new Error('Production-Derived-Manifest ist ungültig.');
}
if (complete && manifest.mode !== 'all') {
  throw new Error(
    `Vollständige Production-Derived-Freigabe benötigt mode=all, gefunden: ${manifest.mode}.`,
  );
}
if (complete && manifest.requestedAnimationId !== null) {
  throw new Error(
    'Vollständige Production-Derived-Freigabe darf nicht auf eine einzelne Animation gefiltert sein.',
  );
}

const expectedPrototypes = complete
  ? config.prototypes
  : manifest.requestedAnimationId
    ? config.prototypes.filter(
        (prototype) => prototype.animationId === manifest.requestedAnimationId,
      )
    : config.prototypes;
if (manifest.prototypeCount !== expectedPrototypes.length) {
  throw new Error(
    `Production-Derived-Manifest enthält ${manifest.prototypeCount}/${expectedPrototypes.length} erwarteten Animationen.`,
  );
}

const currentFingerprint = await getProductionDerivedSourceFingerprint();
if (manifest.sourceFingerprint !== currentFingerprint) {
  throw new Error(
    'Production-Derived-Artefakte sind veraltet: Source-Fingerprint stimmt nicht mit dem aktuellen Code überein.',
  );
}

const fixtureByAnimationId = new Map(
  fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture]),
);
const prototypeByAnimationId = new Map(
  config.prototypes.map((prototype) => [prototype.animationId, prototype]),
);
const derivePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentDeriver();

const seen = new Set();
let checkedLabels = 0;
let checkedValues = 0;
let checkedPngs = 0;
let checkedVideos = 0;
for (const result of manifest.results) {
  if (seen.has(result.animationId)) {
    throw new Error(`Doppelte Production-Derived-Animation: ${result.animationId}.`);
  }
  seen.add(result.animationId);

  const prototype = prototypeByAnimationId.get(result.animationId);
  const fixture = fixtureByAnimationId.get(result.animationId);
  if (!prototype || !fixture) {
    throw new Error(
      `Production-Derived-Ergebnis verweist auf unbekannte Animation ${result.animationId}.`,
    );
  }
  if (result.compositionId !== prototype.compositionId) {
    throw new Error(
      `Composition-ID stimmt für ${result.animationId} nicht mit der Render-Config überein.`,
    );
  }

  const sourceContent = getFixtureContent(fixture);
  if (!sourceContent?.meaningContract || !sourceContent?.spokenText) {
    throw new Error(`Fixture ${result.animationId} ist unvollständig.`);
  }
  const derived = derivePrototypeRuntimeContent({
    animationId: result.animationId,
    spokenText: sourceContent.spokenText,
    meaningContract: sourceContent.meaningContract,
  });
  const expectedProps = {
    content: {
      ...sourceContent,
      labels: derived.labels,
      values: derived.values,
    },
  };
  const actualProps = await readJson(result.propsPath);
  const normalizedProps = await readJson(
    resolve(result.outputRoot, 'render-props.json'),
  );
  if (JSON.stringify(actualProps) !== JSON.stringify(expectedProps)) {
    throw new Error(
      `Production-Derived-Props für ${result.animationId} entsprechen nicht dem aktuellen Runtime-Deriver.`,
    );
  }
  if (JSON.stringify(normalizedProps) !== JSON.stringify(expectedProps)) {
    throw new Error(
      `Normalisierte Render-Props für ${result.animationId} entsprechen nicht dem aktuellen Runtime-Deriver.`,
    );
  }

  const labelCount = Object.keys(derived.labels).length;
  const valueCount = Object.keys(derived.values).length;
  if (labelCount + valueCount === 0) {
    throw new Error(
      `Runtime-Deriver liefert keine spezifischen Keys für ${result.animationId}.`,
    );
  }
  if (
    result.derivedLabelCount !== labelCount ||
    result.derivedValueCount !== valueCount
  ) {
    throw new Error(
      `Deriver-Key-Zähler im Manifest ist für ${result.animationId} veraltet.`,
    );
  }
  checkedLabels += labelCount;
  checkedValues += valueCount;

  const request = await readJson(
    resolve(result.outputRoot, 'render-request.json'),
  );
  if (
    request.animationId !== result.animationId ||
    request.compositionId !== result.compositionId ||
    request.mode !== manifest.mode
  ) {
    throw new Error(
      `Render-Request für ${result.animationId} stimmt nicht mit dem Production-Derived-Manifest überein.`,
    );
  }

  const checkpoints =
    manifest.mode === 'smoke'
      ? config.defaults.smokeCheckpoints
      : config.defaults.checkpoints;
  if (['smoke', 'stills', 'all'].includes(manifest.mode)) {
    for (const frame of checkpoints) {
      const framePath = resolve(
        result.outputRoot,
        `frame-${String(frame).padStart(3, '0')}.png`,
      );
      await assertPng(framePath);
      checkedPngs += 1;
    }
  }
  if (['video', 'all'].includes(manifest.mode)) {
    await assertMp4(resolve(result.outputRoot, 'content-matched.mp4'));
    checkedVideos += 1;
  }
}

for (const prototype of expectedPrototypes) {
  if (!seen.has(prototype.animationId)) {
    throw new Error(
      `Production-Derived-Ergebnis fehlt für ${prototype.animationId}.`,
    );
  }
}

console.log(
  `[production-derived] Verifikation bestanden: ${seen.size} Animationen, ${checkedLabels} abgeleitete Labels, ${checkedValues} abgeleitete Werte, ${checkedPngs} PNGs und ${checkedVideos} Videos.`,
);
if (!complete) {
  console.log(
    '[production-derived] Für die vollständige visuelle Freigabe: Render mode=all erzeugen und mit --complete prüfen.',
  );
}
