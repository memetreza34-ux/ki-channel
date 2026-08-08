import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const readJson = (path) =>
  JSON.parse(readFileSync(resolve(path), 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);

const production = readJson(
  'ki/src/animation-library/masterplan-content-fixtures.json',
);
const renderConfig = readJson(
  'ki/src/animation-library/prototype-render-config.json',
);

if (production.version !== 1 || !Array.isArray(production.fixtures)) {
  fail('masterplan-content-fixtures.json ist strukturell ungültig');
}
if (!Array.isArray(renderConfig.prototypes)) {
  fail('prototype-render-config.json enthält kein prototypes-Array');
}

const fixtureIds = (production.fixtures ?? [])
  .map((fixture) => fixture.animationId)
  .sort();
const renderIds = (renderConfig.prototypes ?? [])
  .map((prototype) => prototype.animationId)
  .sort();

if (fixtureIds.length !== 22) {
  fail(`Production-Fixtures: ${fixtureIds.length}/22`);
}
if (renderIds.length !== 22) {
  fail(`Production-Render-Config: ${renderIds.length}/22`);
}
if (new Set(fixtureIds).size !== fixtureIds.length) {
  fail('Production-Fixtures enthalten doppelte animationIds');
}
if (new Set(renderIds).size !== renderIds.length) {
  fail('Production-Render-Config enthält doppelte animationIds');
}
if (JSON.stringify(fixtureIds) !== JSON.stringify(renderIds)) {
  fail('Production-Fixture-IDs stimmen nicht exakt mit den Render-Config-IDs überein');
}

for (const fixture of production.fixtures ?? []) {
  const keys = Object.keys(fixture).sort();
  if (JSON.stringify(keys) !== JSON.stringify(['animationId', 'spokenText'])) {
    fail(`${fixture.animationId}: erlaubt sind nur animationId + spokenText`);
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
  if (!pattern.test(text)) {
    fail(`${animationId}: ${label} ist nicht im gesprochenen Production-Text geerdet`);
  }
};

requireText('cost-efficiency-budget-leak-meter-v1', /94\s*Cent/i, '94 Cent');
requireText('cost-efficiency-budget-leak-meter-v1', /28\s*Cent/i, '28 Cent');
requireText(
  'cost-efficiency-budget-leak-meter-v1',
  /senk\w*|reduzier\w*|spar\w*/i,
  'Kostenreduktion',
);
requireText(
  'probability-probability-fluid-columns-v1',
  /66\s*Prozent/i,
  '66 Prozent',
);
requireText(
  'scale-performance-latency-tunnel-race-v1',
  /780\s*Millisekunden/i,
  '780 Millisekunden',
);
requireText(
  'scale-performance-latency-tunnel-race-v1',
  /340\s*Millisekunden/i,
  '340 Millisekunden',
);
requireText(
  'ranking-dynamic-podium-rise-v1',
  /Platz\s+eins/i,
  'Platz eins',
);
requireText(
  'comparison-benchmark-racetrack-v1',
  /gewinnt\s+Modell\s+B/i,
  'expliziter Gewinner Modell B',
);

if (failures.length > 0) {
  console.error('Masterplan-Production-Input-Test fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Masterplan-Production-Input-Test bestanden: 22/22 IDs deckungsgleich, Production-Fixtures sind Sprechertext-only und precision-sensitive Beispiele sind im gesprochenen Inhalt geerdet.',
);
