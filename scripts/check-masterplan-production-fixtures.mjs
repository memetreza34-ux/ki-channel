import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const read = (path) => readFileSync(resolve(path), 'utf8');
const readJson = (path) => JSON.parse(read(path));
const failures = [];
const fail = (message) => failures.push(message);

const productionPath = 'ki/src/animation-library/masterplan-content-fixtures.json';
const renderConfigPath = 'ki/src/animation-library/prototype-render-config.json';

const production = readJson(productionPath);
const renderConfig = readJson(renderConfigPath);
const renderer = read('scripts/render-masterplan-content-release.mjs');
const verifier = read('scripts/verify-masterplan-content-release.mjs');
const utils = read('scripts/masterplan-content-release-utils.mjs');

if (production.version !== 1 || !Array.isArray(production.fixtures)) {
  fail('masterplan-content-fixtures.json ist strukturell ungültig');
}
if (!Array.isArray(renderConfig.prototypes)) {
  fail('prototype-render-config.json enthält kein prototypes-Array');
}

const productionIds = (production.fixtures ?? [])
  .map((fixture) => fixture.animationId)
  .sort();
const renderIds = (renderConfig.prototypes ?? [])
  .map((prototype) => prototype.animationId)
  .sort();

if (productionIds.length !== 22) {
  fail(`Production-Fixtures: ${productionIds.length}/22`);
}
if (new Set(productionIds).size !== productionIds.length) {
  fail('Production-Fixtures enthalten doppelte animationIds');
}
if (JSON.stringify(productionIds) !== JSON.stringify(renderIds)) {
  fail('Production-Fixture-IDs stimmen nicht exakt mit den 22 Render-Config-IDs überein');
}

for (const fixture of production.fixtures ?? []) {
  const keys = Object.keys(fixture).sort();
  if (JSON.stringify(keys) !== JSON.stringify(['animationId', 'spokenText'])) {
    fail(`${fixture.animationId}: Production-Fixture darf nur animationId + spokenText enthalten`);
  }
  if (typeof fixture.spokenText !== 'string' || fixture.spokenText.trim().length < 20) {
    fail(`${fixture.animationId}: spokenText fehlt oder ist zu kurz`);
  }
}

const byId = new Map(
  (production.fixtures ?? []).map((fixture) => [fixture.animationId, fixture.spokenText]),
);
const requireText = (animationId, pattern, label) => {
  const text = byId.get(animationId) ?? '';
  if (!pattern.test(text)) fail(`${animationId}: ${label} nicht im gesprochenen Production-Text geerdet`);
};

requireText('cost-efficiency-budget-leak-meter-v1', /94\s*Cent/i, '94 Cent');
requireText('cost-efficiency-budget-leak-meter-v1', /28\s*Cent/i, '28 Cent');
requireText('cost-efficiency-budget-leak-meter-v1', /senk\w*|reduzier\w*|spar\w*/i, 'Kostenreduktion');
requireText('probability-probability-fluid-columns-v1', /66\s*Prozent/i, '66 Prozent');
requireText('scale-performance-latency-tunnel-race-v1', /780\s*Millisekunden/i, '780 Millisekunden');
requireText('scale-performance-latency-tunnel-race-v1', /340\s*Millisekunden/i, '340 Millisekunden');
requireText('ranking-dynamic-podium-rise-v1', /Platz\s+eins/i, 'Platz eins');
requireText('comparison-benchmark-racetrack-v1', /gewinnt\s+Modell\s+B/i, 'expliziter Gewinner Modell B');

for (const [label, source] of [
  ['renderer', renderer],
  ['verifier', verifier],
]) {
  if (!source.includes("'ki/src/animation-library/masterplan-content-fixtures.json'")) {
    fail(`${label}: verwendet nicht masterplan-content-fixtures.json`);
  }
  if (source.includes("'ki/src/animation-library/content-render-fixtures.json'")) {
    fail(`${label}: darf Demo-Fixtures nicht als kanonische Production-Quelle laden`);
  }
  if (!source.includes('loadSceneMeaningEnhancer')) {
    fail(`${label}: Scene-Meaning-Enhancer fehlt`);
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
    fail(`${label}: Reihenfolge muss meaning -> derive -> sanitize -> associate -> props bleiben`);
  }
}

for (const required of [
  'ki/src/animation-library/masterplan-content-fixtures.json',
  'ki/src/animation-library/meaningContract.ts',
  'ki/src/animation-library/extendedMeaningContract.ts',
  'scripts/load-scene-meaning-enhancer.mjs',
]) {
  if (!utils.includes(required)) {
    fail(`Masterplan-Fingerprint enthält ${required} nicht`);
  }
}
if (!utils.includes('fixture?.content ?? fixture?.props?.content ?? fixture ?? null')) {
  fail('Masterplan-Fixture-Extractor unterstützt die flache Production-Fixture-Form nicht');
}
if (!utils.includes('spokenText,') || !utils.includes('meaningContract,')) {
  fail('Masterplan-Fixture-Extractor liefert nicht ausschließlich semantische Eingaben');
}

if (failures.length > 0) {
  console.error('Masterplan-Production-Fixture-Preflight fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Masterplan-Production-Fixture-Preflight bestanden: 22/22 Production-IDs, Sprechertext-only Fixture-Grenze, geerdete Präzisionsbeispiele und kanonische meaning -> derive -> sanitize -> associate -> props Reihenfolge bestätigt.',
);
