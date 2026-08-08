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

const fixtureConfig = JSON.parse(
  read('ki/src/animation-library/masterplan-content-fixtures.json'),
);
const render = read('scripts/render-masterplan-content-release.mjs');
const verify = read('scripts/verify-masterplan-content-release.mjs');
const utils = read('scripts/masterplan-content-release-utils.mjs');
const loader = read('scripts/load-scene-meaning-enhancer.mjs');

if (!Array.isArray(fixtureConfig.fixtures) || fixtureConfig.fixtures.length !== 22) {
  failures.push(
    `masterplan-content-fixtures: benötigt exakt 22 Fixtures, gefunden ${fixtureConfig.fixtures?.length ?? 0}`,
  );
}
const ids = new Set();
for (const fixture of fixtureConfig.fixtures ?? []) {
  if (!fixture.animationId || ids.has(fixture.animationId)) {
    failures.push(`masterplan-content-fixtures: ungültige/doppelte ID ${fixture.animationId}`);
  }
  ids.add(fixture.animationId);
  if (typeof fixture.spokenText !== 'string' || !fixture.spokenText.trim()) {
    failures.push(`${fixture.animationId}: spokenText fehlt`);
  }
  if ('labels' in fixture || 'values' in fixture || 'content' in fixture || 'props' in fixture) {
    failures.push(
      `${fixture.animationId}: Production-Fixture darf keine labels/values/content/props-Hülle enthalten`,
    );
  }
}

for (const [label, source] of [
  ['render-masterplan-content-release', render],
  ['verify-masterplan-content-release', verify],
]) {
  requireContains(
    source,
    'ki/src/animation-library/masterplan-content-fixtures.json',
    label,
  );
  requireExcludes(
    source,
    "readMasterplanJson(\n  'ki/src/animation-library/content-render-fixtures.json'",
    `${label} demo fixture dependency`,
  );
  for (const required of [
    'loadSceneMeaningEnhancer',
    'sourceContent.meaningContract ??',
    'enhanceSceneMeaning(sourceContent.spokenText)',
    'derivePrototypeRuntimeContent({',
    'sanitizePrototypeRuntimeContent({',
    'associatePrototypeRuntimeContent({',
    'createPrototypeRenderProps({',
    'meaning+derive+sanitize+associate+createPrototypeRenderProps',
  ]) {
    requireContains(source, required, label);
  }

  const meaningIndex = source.indexOf('enhanceSceneMeaning(sourceContent.spokenText)');
  const deriveIndex = source.indexOf('derivePrototypeRuntimeContent({');
  const sanitizeIndex = source.indexOf('sanitizePrototypeRuntimeContent({');
  const associateIndex = source.indexOf('associatePrototypeRuntimeContent({');
  const propsIndex = source.indexOf('createPrototypeRenderProps({');
  if (
    meaningIndex < 0 ||
    deriveIndex <= meaningIndex ||
    sanitizeIndex <= deriveIndex ||
    associateIndex <= sanitizeIndex ||
    propsIndex <= associateIndex
  ) {
    failures.push(
      `${label}: Reihenfolge muss meaning -> derive -> sanitize -> associate -> props bleiben`,
    );
  }
}

for (const required of [
  'masterplan-content-fixtures.json',
  'meaningContract.ts',
  'extendedMeaningContract.ts',
  'load-scene-meaning-enhancer.mjs',
]) {
  requireContains(utils, required, 'masterplan-content-release-utils fingerprint');
}
requireExcludes(
  utils,
  "'ki/src/animation-library/content-render-fixtures.json',",
  'masterplan source fingerprint demo fixture dependency',
);

const fixtureExtractorStart = utils.indexOf(
  'export const getMasterplanFixtureContent =',
);
const pngStart = utils.indexOf('export const assertMasterplanPng');
const extractor =
  fixtureExtractorStart >= 0 && pngStart > fixtureExtractorStart
    ? utils.slice(fixtureExtractorStart, pngStart)
    : '';
requireContains(extractor, 'spokenText,', 'getMasterplanFixtureContent');
requireContains(extractor, 'meaningContract,', 'getMasterplanFixtureContent');
requireExcludes(extractor, 'labels:', 'getMasterplanFixtureContent');
requireExcludes(extractor, 'values:', 'getMasterplanFixtureContent');

for (const required of [
  'meaningContract.ts',
  'extendedMeaningContract.ts',
  'enhanceSceneMeaning',
  "from './meaningContract'",
]) {
  requireContains(loader, required, 'load-scene-meaning-enhancer');
}

const costFixture = fixtureConfig.fixtures?.find(
  (fixture) => fixture.animationId === 'cost-efficiency-budget-leak-meter-v1',
);
if (
  !costFixture ||
  !/94\s*Cent/i.test(costFixture.spokenText) ||
  !/28\s*Cent/i.test(costFixture.spokenText) ||
  !/(sink|senk|reduzier|spar)/i.test(costFixture.spokenText)
) {
  failures.push(
    'cost-efficiency Production-Fixture muss die tatsächliche Reduktion inklusive 94 Cent -> 28 Cent im Sprechertext tragen',
  );
}

if (failures.length > 0) {
  console.error('Masterplan-Fixture-Production-Boundary-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Masterplan-Fixture-Production-Boundary-Gate bestanden: 22 spoken-only Fixtures, Meaning vor Deriver, keine Demo-labels/values im Production-Pfad, Meaning-Quellen im Fingerprint.',
);
