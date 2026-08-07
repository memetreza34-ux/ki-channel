import type {ComponentType} from 'react';
import {z} from 'zod';
import rawRenderConfig from '../prototype-render-config.json';
import {getAnimationLibraryEntry} from '../catalog';
import {AnomalyXRayScannerPrototype} from './AnomalyXRayScannerPrototype';
import {AnswerLoomPrototype} from './AnswerLoomPrototype';
import {BenchmarkRacetrackPrototype} from './BenchmarkRacetrackPrototype';
import {BudgetLeakMeterPrototype} from './BudgetLeakMeterPrototype';
import {ConfidenceGlassCrackPrototype} from './ConfidenceGlassCrackPrototype';
import {ContextWindowTrainPrototype} from './ContextWindowTrainPrototype';
import {DecisionTreeBurstPrototype} from './DecisionTreeBurstPrototype';
import {DependencyBridgeBuilderPrototype} from './DependencyBridgeBuilderPrototype';
import {DynamicPodiumRisePrototype} from './DynamicPodiumRisePrototype';
import {EncryptionVaultLayersPrototype} from './EncryptionVaultLayersPrototype';
import {FunnelCompressionOutputPrototype} from './FunnelCompressionOutputPrototype';
import {HumanAIRelayPrototype} from './HumanAIRelayPrototype';
import {KnowledgeMagnetPrototype} from './KnowledgeMagnetPrototype';
import {KnowledgeTreeGraftPrototype} from './KnowledgeTreeGraftPrototype';
import {LatencyTunnelRacePrototype} from './LatencyTunnelRacePrototype';
import {MagneticPhraseSlicerPrototype} from './MagneticPhraseSlicerPrototype';
import {MeaningTerrainPrototype} from './MeaningTerrainPrototype';
import {ProbabilityFluidColumnsPrototype} from './ProbabilityFluidColumnsPrototype';
import {
  createContentAwarePrototype,
  type PrototypeRenderProps,
} from './PrototypeContentContext';
import {ResidualRiverPrototype} from './ResidualRiverPrototype';
import {SubwayWorkflowMapPrototype} from './SubwayWorkflowMapPrototype';
import {TimelineMicroscopePrototype} from './TimelineMicroscopePrototype';
import {VectorPrismConverterPrototype} from './VectorPrismConverterPrototype';

const renderConfigSchema = z.object({
  version: z.literal(1),
  entryPoint: z.string().min(3),
  outputDir: z.string().min(3),
  defaults: z.object({
    durationInFrames: z.number().int().positive(),
    fps: z.number().int().min(24).max(60),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    checkpoints: z.array(z.number().int().nonnegative()).min(1),
    smokeCheckpoints: z.array(z.number().int().nonnegative()).min(1),
  }),
  prototypes: z.array(z.object({
    compositionId: z.string().min(3),
    animationId: z.string().min(3),
  })).min(1),
});

export const ANIMATION_PROTOTYPE_RENDER_CONFIG = renderConfigSchema.parse(
  rawRenderConfig,
);

export type AnimationPrototypeRegistration = {
  compositionId: string;
  animationId: string;
  component: ComponentType<PrototypeRenderProps>;
  defaultProps: PrototypeRenderProps;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  checkpoints: number[];
};

const COMPONENTS: Record<string, ComponentType> = {
  'retrieval-search-knowledge-magnet-v1': KnowledgeMagnetPrototype,
  'cost-efficiency-budget-leak-meter-v1': BudgetLeakMeterPrototype,
  'context-window-context-window-train-v1': ContextWindowTrainPrototype,
  'decision-logic-decision-tree-burst-v1': DecisionTreeBurstPrototype,
  'human-ai-collaboration-human-ai-relay-v1': HumanAIRelayPrototype,
  'learning-update-knowledge-tree-graft-v1': KnowledgeTreeGraftPrototype,
  'tokenization-magnetic-phrase-slicer-v1': MagneticPhraseSlicerPrototype,
  'data-transformation-vector-prism-converter-v1': VectorPrismConverterPrototype,
  'ranking-dynamic-podium-rise-v1': DynamicPodiumRisePrototype,
  'process-flow-subway-workflow-map-v1': SubwayWorkflowMapPrototype,
  'input-output-funnel-compression-output-v1': FunnelCompressionOutputPrototype,
  'error-detection-anomaly-xray-scanner-v1': AnomalyXRayScannerPrototype,
  'semantic-space-meaning-terrain-v1': MeaningTerrainPrototype,
  'relationship-network-dependency-bridge-builder-v1': DependencyBridgeBuilderPrototype,
  'probability-probability-fluid-columns-v1': ProbabilityFluidColumnsPrototype,
  'model-processing-residual-river-v1': ResidualRiverPrototype,
  'generation-answer-loom-v1': AnswerLoomPrototype,
  'risk-contrast-confidence-glass-crack-v1': ConfidenceGlassCrackPrototype,
  'security-privacy-encryption-vault-layers-v1': EncryptionVaultLayersPrototype,
  'scale-performance-latency-tunnel-race-v1': LatencyTunnelRacePrototype,
  'time-change-timeline-microscope-v1': TimelineMicroscopePrototype,
  'comparison-benchmark-racetrack-v1': BenchmarkRacetrackPrototype,
};

export const ANIMATION_PROTOTYPE_REGISTRY: AnimationPrototypeRegistration[] =
  ANIMATION_PROTOTYPE_RENDER_CONFIG.prototypes.map((prototype) => {
    const rawComponent = COMPONENTS[prototype.animationId];
    if (!rawComponent) {
      throw new Error(
        `missing prototype component for ${prototype.animationId}`,
      );
    }
    if (!getAnimationLibraryEntry(prototype.animationId)) {
      throw new Error(
        `prototype animation is absent from catalog: ${prototype.animationId}`,
      );
    }

    return {
      ...prototype,
      component: createContentAwarePrototype(rawComponent),
      defaultProps: {content: null},
      durationInFrames:
        ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.durationInFrames,
      fps: ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.fps,
      width: ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.width,
      height: ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.height,
      checkpoints: [
        ...ANIMATION_PROTOTYPE_RENDER_CONFIG.defaults.checkpoints,
      ],
    };
  });
