import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const CONTENT_BOUND_COMPONENT_FILES = [
  'AnomalyXRayScannerPrototype.tsx',
  'AnswerLoomPrototype.tsx',
  'BenchmarkRacetrackPrototype.tsx',
  'BudgetLeakMeterPrototype.tsx',
  'ConfidenceGlassCrackPrototype.tsx',
  'ContextWindowTrainPrototype.tsx',
  'DecisionTreeBurstPrototype.tsx',
  'DependencyBridgeBuilderPrototype.tsx',
  'DynamicPodiumRisePrototype.tsx',
  'EncryptionVaultLayersPrototype.tsx',
  'FunnelCompressionOutputPrototype.tsx',
  'HumanAIRelayPrototype.tsx',
  'KnowledgeMagnetPrototype.tsx',
  'KnowledgeTreeGraftPrototype.tsx',
  'LatencyTunnelRacePrototype.tsx',
  'MagneticPhraseSlicerPrototype.tsx',
  'MeaningTerrainPrototype.tsx',
  'ProbabilityFluidColumnsPrototype.tsx',
  'ResidualRiverPrototype.tsx',
  'SubwayWorkflowMapPrototype.tsx',
  'TimelineMicroscopePrototype.tsx',
  'VectorPrismConverterPrototype.tsx',
];

if (CONTENT_BOUND_COMPONENT_FILES.length !== 22) {
  throw new Error(
    `Native Content-Binding-Gate erwartet 22 Komponenten, gefunden: ${CONTENT_BOUND_COMPONENT_FILES.length}.`,
  );
}
if (new Set(CONTENT_BOUND_COMPONENT_FILES).size !== CONTENT_BOUND_COMPONENT_FILES.length) {
  throw new Error('Native Content-Binding-Gate enthält doppelte Komponenten.');
}

const failures = [];
for (const fileName of CONTENT_BOUND_COMPONENT_FILES) {
  const path = resolve(
    'ki/src/animation-library/prototypes',
    fileName,
  );
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
  }
}

if (failures.length > 0) {
  console.error('Native Content-Binding-Gate fehlgeschlagen:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Native Content-Binding-Gate bestanden: ${CONTENT_BOUND_COMPONENT_FILES.length}/22 Komponenten verwenden den gemeinsamen Content-Context und dynamische Renderdaten.`,
);
