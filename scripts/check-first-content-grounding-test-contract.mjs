import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const source = readFileSync(
  resolve('scripts/run-first-content-grounding-test.mjs'),
  'utf8',
);
const failures = [];
const requireContains = (fragment) => {
  if (!source.includes(fragment)) failures.push(`erwartet: ${fragment}`);
};

for (const required of [
  "const DEFAULT_ANIMATION_ID = 'cost-efficiency-budget-leak-meter-v1'",
  'masterplan-content-fixtures.json',
  'prototype-render-config.json',
  'loadSceneMeaningEnhancer',
  'loadPrototypeRuntimeContentDeriver',
  'loadPrototypeRuntimeContentSanitizer',
  'loadPrototypeRuntimeContentAssociation',
  'loadCreatePrototypeRenderProps',
  'enhanceSceneMeaning(sourceContent.spokenText)',
  'derivePrototypeRuntimeContent({',
  'sanitizePrototypeRuntimeContent({',
  'associatePrototypeRuntimeContent({',
  'createPrototypeRenderProps({',
  "associated.values.measurementExact !== 1",
  'associated.values.initialCost !== 94',
  'associated.values.optimizedCost !== 28',
  "associated.values.slowLatency !== 780",
  "associated.values.fastLatency !== 340",
  'scripts/render-content-matched-prototype.mjs',
  "'plan'",
  "request.mode !== 'plan'",
  'test-summary.json',
  "status: 'passed'",
]) {
  requireContains(required);
}

const meaningIndex = source.indexOf('enhanceSceneMeaning(sourceContent.spokenText)');
const deriveIndex = source.indexOf('derivePrototypeRuntimeContent({');
const sanitizeIndex = source.indexOf('sanitizePrototypeRuntimeContent({');
const associateIndex = source.indexOf('associatePrototypeRuntimeContent({');
const propsIndex = source.indexOf('createPrototypeRenderProps({');
const planIndex = source.indexOf('scripts/render-content-matched-prototype.mjs');
if (
  meaningIndex < 0 ||
  deriveIndex <= meaningIndex ||
  sanitizeIndex <= deriveIndex ||
  associateIndex <= sanitizeIndex ||
  propsIndex <= associateIndex ||
  planIndex <= propsIndex
) {
  failures.push(
    'Reihenfolge muss meaning -> derive -> sanitize -> associate -> props -> render plan bleiben',
  );
}

if (failures.length > 0) {
  console.error('First-Content-Grounding-Test-Vertrag fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'First-Content-Grounding-Test-Vertrag bestanden: offizieller Test 1 prüft Kosten-Grounding 94 -> 28, optional Latenz 780/340 und einen echten Content-Matched-Render-Plan.',
);
