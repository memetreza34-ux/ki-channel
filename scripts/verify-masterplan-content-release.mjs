import {resolve} from 'node:path';
import {loadSceneMeaningEnhancer} from './load-scene-meaning-enhancer.mjs';
import {loadCreatePrototypeRenderProps} from './load-prototype-render-payload.mjs';
import {loadPrototypeRuntimeContentAssociation} from './load-prototype-runtime-content-association.mjs';
import {loadPrototypeRuntimeContentDeriver} from './load-prototype-runtime-content-deriver.mjs';
import {loadPrototypeRuntimeContentSanitizer} from './load-prototype-runtime-content-sanitizer.mjs';
import {
  assertMasterplanMp4,
  assertMasterplanPng,
  getMasterplanContentSourceFingerprint,
  getMasterplanFixtureContent,
  MASTERPLAN_CONTENT_OUTPUT_ROOT,
  readMasterplanJson,
} from './masterplan-content-release-utils.mjs';

const complete = process.argv.includes('--complete');
const config = await readMasterplanJson(
  'ki/src/animation-library/prototype-render-config.json',
);
const fixtureConfig = await readMasterplanJson(
  'ki/src/animation-library/content-render-fixtures.json',
);
const manifest = await readMasterplanJson(
  resolve(MASTERPLAN_CONTENT_OUTPUT_ROOT, 'manifest.json'),
);

if (
  manifest.version !== 1 ||
  manifest.payloadBuilder !==
    'meaning+derive+sanitize+associate+createPrototypeRenderProps' ||
  !Array.isArray(manifest.results)
) {
  throw new Error('Masterplan-Content-Manifest ist ungültig.');
}
if (complete && manifest.mode !== 'all') {
  throw new Error(
    `Vollständige Masterplan-Freigabe benötigt mode=all, gefunden: ${manifest.mode}.`,
  );
}
if (complete && manifest.requestedAnimationId !== null) {
  throw new Error(
    'Vollständige Masterplan-Freigabe darf nicht auf eine einzelne Animation gefiltert sein.',
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
    `Masterplan-Manifest enthält ${manifest.prototypeCount}/${expectedPrototypes.length} erwarteten Animationen.`,
  );
}

const currentFingerprint = await getMasterplanContentSourceFingerprint();
if (manifest.sourceFingerprint !== currentFingerprint) {
  throw new Error(
    'Masterplan-Content-Artefakte sind veraltet: Source-Fingerprint stimmt nicht mit dem aktuellen Produktionspfad überein.',
  );
}

const fixtureByAnimationId = new Map(
  fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture]),
);
const prototypeByAnimationId = new Map(
  config.prototypes.map((prototype) => [prototype.animationId, prototype]),
);
const enhanceSceneMeaning = await loadSceneMeaningEnhancer();
const derivePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentDeriver();
const sanitizePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentSanitizer();
const associatePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentAssociation();
const createPrototypeRenderProps = await loadCreatePrototypeRenderProps();

const seen = new Set();
let checkedLabels = 0;
let checkedValues = 0;
let checkedPngs = 0;
let checkedVideos = 0;
for (const result of manifest.results) {
  if (seen.has(result.animationId)) {
    throw new Error(`Doppelte Masterplan-Animation: ${result.animationId}.`);
  }
  seen.add(result.animationId);

  const prototype = prototypeByAnimationId.get(result.animationId);
  const fixture = fixtureByAnimationId.get(result.animationId);
  if (!prototype || !fixture) {
    throw new Error(
      `Masterplan-Ergebnis verweist auf unbekannte Animation ${result.animationId}.`,
    );
  }
  if (result.compositionId !== prototype.compositionId) {
    throw new Error(
      `Composition-ID stimmt für ${result.animationId} nicht mit der Render-Config überein.`,
    );
  }

  const sourceContent = getMasterplanFixtureContent(fixture);
  if (!sourceContent?.spokenText) {
    throw new Error(`Fixture ${result.animationId} benötigt spokenText.`);
  }
  const meaningContract =
    sourceContent.meaningContract ?? enhanceSceneMeaning(sourceContent.spokenText);
  if (!meaningContract?.startState || !meaningContract?.visibleChange || !meaningContract?.endState) {
    throw new Error(`Meaning Contract für ${result.animationId} ist unvollständig.`);
  }
  const expectedMeaningSource = sourceContent.meaningContract
    ? 'fixture-explicit'
    : 'spoken-text-enhancer';
  if (result.meaningSource !== expectedMeaningSource) {
    throw new Error(
      `Meaning-Quelle im Manifest ist für ${result.animationId} veraltet: ${result.meaningSource} statt ${expectedMeaningSource}.`,
    );
  }

  const derived = derivePrototypeRuntimeContent({
    animationId: result.animationId,
    spokenText: sourceContent.spokenText,
    meaningContract,
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId: result.animationId,
    spokenText: sourceContent.spokenText,
    derived,
  });
  const associated = associatePrototypeRuntimeContent({
    animationId: result.animationId,
    spokenText: sourceContent.spokenText,
    content: sanitized,
  });
  const expectedProps = createPrototypeRenderProps({
    spokenText: sourceContent.spokenText,
    meaningContract,
    labels: associated.labels,
    values: associated.values,
  });
  const actualProps = await readMasterplanJson(result.propsPath);
  const normalizedProps = await readMasterplanJson(
    resolve(result.outputRoot, 'render-props.json'),
  );
  if (JSON.stringify(actualProps) !== JSON.stringify(expectedProps)) {
    throw new Error(
      `Masterplan-Props für ${result.animationId} entsprechen nicht der aktuellen Meaning+Deriver+Sanitizer+Association+Payload-Kette.`,
    );
  }
  if (JSON.stringify(normalizedProps) !== JSON.stringify(expectedProps)) {
    throw new Error(
      `Normalisierte Render-Props für ${result.animationId} entsprechen nicht der aktuellen Masterplan-Kette.`,
    );
  }

  const labelCount = Object.keys(associated.labels).length;
  const valueCount = Object.keys(associated.values).length;
  if (labelCount + valueCount === 0) {
    throw new Error(
      `Runtime-Deriver/Sanitizer/Association liefert keine spezifischen Keys für ${result.animationId}.`,
    );
  }
  if (
    result.derivedLabelCount !== labelCount ||
    result.derivedValueCount !== valueCount
  ) {
    throw new Error(
      `Deriver-/Sanitizer-/Association-Key-Zähler im Manifest ist für ${result.animationId} veraltet.`,
    );
  }
  checkedLabels += labelCount;
  checkedValues += valueCount;

  const request = await readMasterplanJson(
    resolve(result.outputRoot, 'render-request.json'),
  );
  if (
    request.animationId !== result.animationId ||
    request.compositionId !== result.compositionId ||
    request.mode !== manifest.mode
  ) {
    throw new Error(
      `Render-Request für ${result.animationId} stimmt nicht mit dem Masterplan-Manifest überein.`,
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
      await assertMasterplanPng(framePath);
      checkedPngs += 1;
    }
  }
  if (['video', 'all'].includes(manifest.mode)) {
    await assertMasterplanMp4(
      resolve(result.outputRoot, 'content-matched.mp4'),
    );
    checkedVideos += 1;
  }
}

for (const prototype of expectedPrototypes) {
  if (!seen.has(prototype.animationId)) {
    throw new Error(
      `Masterplan-Content-Ergebnis fehlt für ${prototype.animationId}.`,
    );
  }
}

console.log(
  `[masterplan-content] Verifikation bestanden: ${seen.size} Animationen, Meaning neu bestätigt, ${checkedLabels} final zugeordnete Labels, ${checkedValues} final zugeordnete Werte, ${checkedPngs} PNGs und ${checkedVideos} Videos.`,
);
if (!complete) {
  console.log(
    '[masterplan-content] Für die vollständige Freigabe: mode=all rendern und mit --complete prüfen.',
  );
}
