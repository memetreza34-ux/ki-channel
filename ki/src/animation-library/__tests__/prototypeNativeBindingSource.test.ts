import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

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
] as const;

describe('native prototype object binding source gate', () => {
  it.each(CONTENT_BOUND_COMPONENT_FILES)(
    '%s consumes the shared content context and dynamic render data',
    (fileName) => {
      const source = readFileSync(
        new URL(`../prototypes/${fileName}`, import.meta.url),
        'utf8',
      );

      expect(source).toContain('usePrototypeContent');
      expect(
        source.includes('getPrototypeLabel') ||
          source.includes('getPrototypeValue'),
      ).toBe(true);
      expect(source).toContain('content');
    },
  );
});
