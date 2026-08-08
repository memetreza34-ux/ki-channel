import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPrototypeRuntimeContentDeriver} from './load-prototype-runtime-content-deriver.mjs';

const PROTOTYPE_SOURCES = new Map([
  ['error-detection-anomaly-xray-scanner-v1', 'AnomalyXRayScannerPrototype.tsx'],
  ['generation-answer-loom-v1', 'AnswerLoomPrototype.tsx'],
  ['comparison-benchmark-racetrack-v1', 'BenchmarkRacetrackPrototype.tsx'],
  ['cost-efficiency-budget-leak-meter-v1', 'BudgetLeakMeterPrototype.tsx'],
  ['risk-contrast-confidence-glass-crack-v1', 'ConfidenceGlassCrackPrototype.tsx'],
  ['context-window-context-window-train-v1', 'ContextWindowTrainPrototype.tsx'],
  ['decision-logic-decision-tree-burst-v1', 'DecisionTreeBurstPrototype.tsx'],
  ['relationship-network-dependency-bridge-builder-v1', 'DependencyBridgeBuilderPrototype.tsx'],
  ['ranking-dynamic-podium-rise-v1', 'DynamicPodiumRisePrototype.tsx'],
  ['security-privacy-encryption-vault-layers-v1', 'EncryptionVaultLayersPrototype.tsx'],
  ['input-output-funnel-compression-output-v1', 'FunnelCompressionOutputPrototype.tsx'],
  ['human-ai-collaboration-human-ai-relay-v1', 'HumanAIRelayPrototype.tsx'],
  ['retrieval-search-knowledge-magnet-v1', 'KnowledgeMagnetPrototype.tsx'],
  ['learning-update-knowledge-tree-graft-v1', 'KnowledgeTreeGraftPrototype.tsx'],
  ['scale-performance-latency-tunnel-race-v1', 'LatencyTunnelRacePrototype.tsx'],
  ['tokenization-magnetic-phrase-slicer-v1', 'MagneticPhraseSlicerPrototype.tsx'],
  ['semantic-space-meaning-terrain-v1', 'MeaningTerrainPrototype.tsx'],
  ['probability-probability-fluid-columns-v1', 'ProbabilityFluidColumnsPrototype.tsx'],
  ['model-processing-residual-river-v1', 'ResidualRiverPrototype.tsx'],
  ['process-flow-subway-workflow-map-v1', 'SubwayWorkflowMapPrototype.tsx'],
  ['time-change-timeline-microscope-v1', 'TimelineMicroscopePrototype.tsx'],
  ['data-transformation-vector-prism-converter-v1', 'VectorPrismConverterPrototype.tsx'],
]);

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildKeyMatcher = (source) => {
  const literalKeys = new Set();
  const templatePatterns = [];
  for (const match of source.matchAll(/key:\s*['"]([^'"]+)['"]/g)) {
    literalKeys.add(match[1]);
  }
  for (const match of source.matchAll(/key:\s*`([^`]+)`/g)) {
    const template = match[1];
    const interpolationCount = (template.match(/\$\{/g) ?? []).length;
    if (interpolationCount === 0) {
      literalKeys.add(template);
      continue;
    }
    const parts = template.split(/\$\{[^}]+\}/g).map(escapeRegex);
    templatePatterns.push(new RegExp(`^${parts.join('\\d+')}$`));
  }
  return {
    accepts: (key) =>
      literalKeys.has(key) ||
      templatePatterns.some((pattern) => pattern.test(key)),
  };
};

const fixtures = JSON.parse(
  readFileSync(
    resolve('ki/src/animation-library/content-render-fixtures.json'),
    'utf8',
  ),
).fixtures;
if (!Array.isArray(fixtures)) {
  throw new Error('Content-Render-Fixtures fehlen oder sind ungültig.');
}
if (PROTOTYPE_SOURCES.size !== 22) {
  throw new Error(
    `Production-Derived-Key-Gate erwartet 22 Prototype-Sources, gefunden: ${PROTOTYPE_SOURCES.size}.`,
  );
}

const derivePrototypeRuntimeContent =
  await loadPrototypeRuntimeContentDeriver();
const failures = [];
let checkedLabels = 0;
let checkedValues = 0;

for (const fixture of fixtures) {
  const fileName = PROTOTYPE_SOURCES.get(fixture.animationId);
  if (!fileName) {
    failures.push(
      `${fixture.animationId}: kein Prototype-Source im Production-Derived-Key-Gate`,
    );
    continue;
  }
  const content = fixture.content ?? fixture.props?.content;
  if (!content?.spokenText || !content?.meaningContract) {
    failures.push(`${fixture.animationId}: Fixture ohne spokenText/meaningContract`);
    continue;
  }

  const source = readFileSync(
    resolve('ki/src/animation-library/prototypes', fileName),
    'utf8',
  );
  const matcher = buildKeyMatcher(source);
  const derived = derivePrototypeRuntimeContent({
    animationId: fixture.animationId,
    spokenText: content.spokenText,
    meaningContract: content.meaningContract,
  });
  const labelKeys = Object.keys(derived.labels);
  const valueKeys = Object.keys(derived.values);
  if (labelKeys.length + valueKeys.length === 0) {
    failures.push(`${fixture.animationId}: Runtime-Deriver liefert keine Keys`);
  }

  for (const key of labelKeys) {
    checkedLabels += 1;
    if (!matcher.accepts(key)) {
      failures.push(
        `${fixture.animationId}: abgeleiteter Label-Key "${key}" wird von ${fileName} nicht konsumiert`,
      );
    }
  }
  for (const key of valueKeys) {
    checkedValues += 1;
    if (!matcher.accepts(key)) {
      failures.push(
        `${fixture.animationId}: abgeleiteter Value-Key "${key}" wird von ${fileName} nicht konsumiert`,
      );
    }
  }
}

for (const animationId of PROTOTYPE_SOURCES.keys()) {
  if (!fixtures.some((fixture) => fixture.animationId === animationId)) {
    failures.push(`${animationId}: Content-Render-Fixture fehlt`);
  }
}

if (failures.length > 0) {
  console.error('Production-Derived-Runtime-Key-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Production-Derived-Runtime-Key-Gate bestanden: 22/22 Animationen, ${checkedLabels} abgeleitete Label-Keys und ${checkedValues} abgeleitete Value-Keys werden von ihren TSX-Komponenten konsumiert.`,
);
