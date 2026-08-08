import {spawn} from 'node:child_process';
import {mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {loadSceneMeaningEnhancer} from './load-scene-meaning-enhancer.mjs';
import {loadCreatePrototypeRenderProps} from './load-prototype-render-payload.mjs';
import {loadPrototypeRuntimeContentAssociation} from './load-prototype-runtime-content-association.mjs';
import {loadPrototypeRuntimeContentDeriver} from './load-prototype-runtime-content-deriver.mjs';
import {loadPrototypeRuntimeContentSanitizer} from './load-prototype-runtime-content-sanitizer.mjs';
import {getMasterplanFixtureContent} from './masterplan-content-release-utils.mjs';

const DEFAULT_ANIMATION_ID = 'cost-efficiency-budget-leak-meter-v1';
const animationId = process.argv[2] ?? DEFAULT_ANIMATION_ID;
const fixturePath = resolve(
  'ki/src/animation-library/masterplan-content-fixtures.json',
);
const configPath = resolve(
  'ki/src/animation-library/prototype-render-config.json',
);

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [fixtureConfig, renderConfig] = await Promise.all([
  readJson(fixturePath),
  readJson(configPath),
]);

const fixture = fixtureConfig.fixtures?.find(
  (candidate) => candidate.animationId === animationId,
);
const prototype = renderConfig.prototypes?.find(
  (candidate) => candidate.animationId === animationId,
);
if (!fixture || !prototype) {
  throw new Error(
    `First-Grounding-Test benötigt eine Production-Fixture und Render-Config für ${animationId}.`,
  );
}

const sourceContent = getMasterplanFixtureContent(fixture);
if (!sourceContent?.spokenText) {
  throw new Error(`${animationId}: Production-Sprechertext fehlt.`);
}

const enhanceSceneMeaning = await loadSceneMeaningEnhancer();
const derivePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentDeriver();
const sanitizePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentSanitizer();
const associatePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentAssociation();
const createPrototypeRenderProps = await loadCreatePrototypeRenderProps();

const meaningContract =
  sourceContent.meaningContract ?? enhanceSceneMeaning(sourceContent.spokenText);
if (
  !meaningContract?.communicationGoal ||
  !meaningContract?.startState ||
  !meaningContract?.visibleChange ||
  !meaningContract?.endState ||
  !Array.isArray(meaningContract.requiredVisualCues) ||
  meaningContract.requiredVisualCues.length === 0
) {
  throw new Error(`${animationId}: Meaning Contract ist unvollständig.`);
}
if (!meaningContract.preferredVisualFamilies?.includes(animationId.split('-').slice(0, -5).join('-'))) {
  // Do not fail on the generic prefix heuristic; exact domain assertions below
  // cover the first official test cases. This field is still recorded for review.
}

const derived = derivePrototypeRuntimeContent({
  animationId,
  spokenText: sourceContent.spokenText,
  meaningContract,
});
const sanitized = sanitizePrototypeRuntimeContent({
  animationId,
  spokenText: sourceContent.spokenText,
  derived,
});
const associated = associatePrototypeRuntimeContent({
  animationId,
  spokenText: sourceContent.spokenText,
  content: sanitized,
});
const props = createPrototypeRenderProps({
  spokenText: sourceContent.spokenText,
  meaningContract,
  labels: associated.labels,
  values: associated.values,
});

const keyCount =
  Object.keys(associated.labels).length + Object.keys(associated.values).length;
if (keyCount === 0) {
  throw new Error(`${animationId}: Grounding-Kette erzeugt keine Runtime-Keys.`);
}

if (animationId === 'cost-efficiency-budget-leak-meter-v1') {
  if (!meaningContract.preferredVisualFamilies.includes('cost-efficiency')) {
    throw new Error('Kosten-Test wurde semantisch nicht cost-efficiency zugeordnet.');
  }
  if (associated.values.measurementExact !== 1) {
    throw new Error(
      `Kosten-Test muss measurementExact=1 liefern, gefunden: ${associated.values.measurementExact}.`,
    );
  }
  if (
    associated.values.initialCost !== 94 ||
    associated.values.optimizedCost !== 28
  ) {
    throw new Error(
      `Kosten-Test erwartet gesprochene Reihenfolge 94 -> 28, gefunden: ${associated.values.initialCost} -> ${associated.values.optimizedCost}.`,
    );
  }
}

if (animationId === 'scale-performance-latency-tunnel-race-v1') {
  if (!meaningContract.preferredVisualFamilies.includes('scale-performance')) {
    throw new Error('Latenz-Test wurde semantisch nicht scale-performance zugeordnet.');
  }
  if (associated.values.measurementExact !== 1) {
    throw new Error(
      `Latenz-Test muss measurementExact=1 liefern, gefunden: ${associated.values.measurementExact}.`,
    );
  }
  if (
    associated.values.slowLatency !== 780 ||
    associated.values.fastLatency !== 340
  ) {
    throw new Error(
      `Latenz-Test erwartet 780/340 ms, gefunden: ${associated.values.slowLatency}/${associated.values.fastLatency}.`,
    );
  }
}

const outputRoot = resolve('out/first-content-grounding-test', animationId);
await rm(outputRoot, {recursive: true, force: true});
await mkdir(outputRoot, {recursive: true});
const propsPath = resolve(outputRoot, 'grounded-props.json');
await writeFile(propsPath, `${JSON.stringify(props, null, 2)}\n`, 'utf8');

const runPlan = () =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      [
        'scripts/render-content-matched-prototype.mjs',
        animationId,
        propsPath,
        'plan',
      ],
      {
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: {...process.env, CONTENT_MATCHED_OUTPUT_DIR: outputRoot},
      },
    );
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`Remotion-Plan-Validierung endete mit Code ${code}.`));
    });
  });

await runPlan();
const [normalizedProps, request] = await Promise.all([
  readJson(resolve(outputRoot, 'render-props.json')),
  readJson(resolve(outputRoot, 'render-request.json')),
]);

if (JSON.stringify(normalizedProps) !== JSON.stringify(props)) {
  throw new Error('Grounded Props wurden beim Render-Plan verändert.');
}
if (
  request.mode !== 'plan' ||
  request.animationId !== animationId ||
  request.compositionId !== prototype.compositionId
) {
  throw new Error('Render-Request stimmt nicht mit dem getesteten Production-Prototyp überein.');
}

const summary = {
  version: 1,
  status: 'passed',
  animationId,
  compositionId: prototype.compositionId,
  spokenText: sourceContent.spokenText,
  communicationGoal: meaningContract.communicationGoal,
  preferredVisualFamilies: meaningContract.preferredVisualFamilies,
  requiredVisualCues: meaningContract.requiredVisualCues,
  labels: associated.labels,
  values: associated.values,
  keyCount,
  propsPath,
  renderRequestPath: resolve(outputRoot, 'render-request.json'),
};
await writeFile(
  resolve(outputRoot, 'test-summary.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8',
);

console.log(
  `\n[first-content-grounding-test] BESTANDEN · ${animationId} · ${keyCount} Runtime-Keys · Render-Plan gültig.`,
);
console.log(
  `[first-content-grounding-test] Summary: ${resolve(outputRoot, 'test-summary.json')}`,
);
