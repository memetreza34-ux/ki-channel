import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const CONTENT_BOUND_PROTOTYPES = [
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
];

const MOTION_SEMANTIC_RULES = new Map([
  [
    'AnomalyXRayScannerPrototype.tsx',
    {
      required: ['errorScanned', 'repairAtStep', 'REPAIR'],
      forbidden: [],
    },
  ],
  [
    'ContextWindowTrainPrototype.tsx',
    {
      required: ['overflowCount', 'shiftedSlots', 'keepPinned'],
      forbidden: ['windowStart = interpolate'],
    },
  ],
  [
    'DecisionTreeBurstPrototype.tsx',
    {
      required: ['validBranches.map', 'Kriterien tragen den Weg'],
      forbidden: ['routeDistance('],
    },
  ],
  [
    'DependencyBridgeBuilderPrototype.tsx',
    {
      required: ['weight12', 'weakWeight', 'VERWORFEN'],
      forbidden: [],
    },
  ],
  [
    'FunnelCompressionOutputPrototype.tsx',
    {
      required: ['input${index + 1}Keep', 'keptInputs', 'VERWORFEN'],
      forbidden: [],
    },
  ],
  [
    'KnowledgeMagnetPrototype.tsx',
    {
      required: ['source${index + 1}Relevant', 'requestedEvidenceCount', 'relevantDocuments'],
      forbidden: [],
    },
  ],
  [
    'MagneticPhraseSlicerPrototype.tsx',
    {
      required: ['finalPositions', 'REIHENFOLGE BLEIBT ERHALTEN'],
      forbidden: ['lane: index % 3'],
    },
  ],
  [
    'ProbabilityFluidColumnsPrototype.tsx',
    {
      required: ['signalProgresses', 'contextProgress'],
      forbidden: ['const context = prototypeProgress'],
    },
  ],
  [
    'VectorPrismConverterPrototype.tsx',
    {
      required: ['dimensionReveals', 'ZERLEGT MERKMALE'],
      forbidden: [],
    },
  ],
]);

if (CONTENT_BOUND_PROTOTYPES.length !== 22) {
  throw new Error(
    `Native Content-Binding-Gate erwartet 22 Komponenten, gefunden: ${CONTENT_BOUND_PROTOTYPES.length}.`,
  );
}
const animationIds = CONTENT_BOUND_PROTOTYPES.map(([animationId]) => animationId);
const fileNames = CONTENT_BOUND_PROTOTYPES.map(([, fileName]) => fileName);
if (new Set(animationIds).size !== animationIds.length) {
  throw new Error('Native Content-Binding-Gate enthält doppelte Animation-IDs.');
}
if (new Set(fileNames).size !== fileNames.length) {
  throw new Error('Native Content-Binding-Gate enthält doppelte Komponenten.');
}

const fixtureConfig = JSON.parse(
  readFileSync(
    resolve('ki/src/animation-library/content-render-fixtures.json'),
    'utf8',
  ),
);
if (!Array.isArray(fixtureConfig.fixtures)) {
  throw new Error('Content-Render-Fixtures fehlen oder sind ungültig.');
}
const fixtureByAnimationId = new Map(
  fixtureConfig.fixtures.map((fixture) => [fixture.animationId, fixture]),
);
if (fixtureByAnimationId.size !== 22) {
  throw new Error(
    `Content-Fixture-Gate erwartet 22 eindeutige Fixtures, gefunden: ${fixtureByAnimationId.size}.`,
  );
}

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const buildKeyMatcher = (source) => {
  const literalKeys = new Set();
  const templatePatterns = [];

  for (const match of source.matchAll(/key:\s*['"]([^'"]+)['"]/g)) {
    literalKeys.add(match[1]);
  }
  for (const match of source.matchAll(/key:\s*`([^`]+)`/g)) {
    const template = match[1];
    const parts = template.split(/\$\{[^}]+\}/g).map(escapeRegex);
    const interpolationCount = (template.match(/\$\{/g) ?? []).length;
    if (interpolationCount === 0) {
      literalKeys.add(template);
      continue;
    }
    templatePatterns.push(
      new RegExp(`^${parts.join('\\d+')}$`),
    );
  }

  return {
    literalKeys,
    templatePatterns,
    accepts: (key) =>
      literalKeys.has(key) || templatePatterns.some((pattern) => pattern.test(key)),
  };
};

const failures = [];
let checkedFixtureKeys = 0;
let checkedMotionRules = 0;
for (const [animationId, fileName] of CONTENT_BOUND_PROTOTYPES) {
  const path = resolve('ki/src/animation-library/prototypes', fileName);
  const source = readFileSync(path, 'utf8');
  const missing = [];
  if (!source.includes('usePrototypeContent')) {
    missing.push('usePrototypeContent');
  }
  if (
    !source.includes('getPrototypeLabel') &&
    !source.includes('getPrototypeValue')
  ) {
    missing.push('getPrototypeLabel/getPrototypeValue');
  }
  if (!source.includes('content')) {
    missing.push('content usage');
  }
  if (missing.length > 0) {
    failures.push(`${fileName}: ${missing.join(', ')}`);
    continue;
  }

  const motionRule = MOTION_SEMANTIC_RULES.get(fileName);
  if (motionRule) {
    checkedMotionRules += 1;
    for (const requiredFragment of motionRule.required) {
      if (!source.includes(requiredFragment)) {
        failures.push(
          `${fileName}: semantische Bewegungsregel fehlt: ${requiredFragment}`,
        );
      }
    }
    for (const forbiddenFragment of motionRule.forbidden) {
      if (source.includes(forbiddenFragment)) {
        failures.push(
          `${fileName}: verbotener dekorativer/inhaltlich falscher Bewegungsmechanismus gefunden: ${forbiddenFragment}`,
        );
      }
    }
  }

  const fixture = fixtureByAnimationId.get(animationId);
  if (!fixture) {
    failures.push(`${animationId}: Content-Render-Fixture fehlt`);
    continue;
  }
  if (typeof fixture.content?.spokenText !== 'string' || !fixture.content.spokenText.trim()) {
    failures.push(`${animationId}: spokenText fehlt`);
  }

  const matcher = buildKeyMatcher(source);
  const explicitKeys = [
    ...Object.keys(fixture.content?.labels ?? {}),
    ...Object.keys(fixture.content?.values ?? {}),
  ];
  if (explicitKeys.length === 0) {
    failures.push(`${animationId}: Fixture prüft keine expliziten Render-Keys`);
  }
  for (const key of explicitKeys) {
    checkedFixtureKeys += 1;
    if (!matcher.accepts(key)) {
      failures.push(
        `${animationId}: Fixture-Key "${key}" wird von ${fileName} nicht konsumiert`,
      );
    }
  }
}

for (const fixture of fixtureConfig.fixtures) {
  if (!animationIds.includes(fixture.animationId)) {
    failures.push(
      `${fixture.animationId}: Fixture besitzt keine registrierte native Kernkomponente`,
    );
  }
}

if (failures.length > 0) {
  console.error('Native Content-Binding-/Fixture-/Motion-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Native Content-Binding-/Fixture-/Motion-Gate bestanden: 22/22 Komponenten, ${checkedFixtureKeys} explizite Fixture-Keys und ${checkedMotionRules} semantische Bewegungsregeln sind abgesichert.`,
);
