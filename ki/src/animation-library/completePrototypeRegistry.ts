import type {ComponentType} from 'react';
import {getAnimationLibraryEntry} from './catalog';
import {AnomalyXRayScannerPrototype} from './prototypes/AnomalyXRayScannerPrototype';
import {AnswerLoomPrototype} from './prototypes/AnswerLoomPrototype';
import {BenchmarkRacetrackPrototype} from './prototypes/BenchmarkRacetrackPrototype';
import {BudgetLeakMeterPrototype} from './prototypes/BudgetLeakMeterPrototype';
import {ConfidenceGlassCrackPrototype} from './prototypes/ConfidenceGlassCrackPrototype';
import {ContextWindowTrainPrototype} from './prototypes/ContextWindowTrainPrototype';
import {DecisionTreeBurstPrototype} from './prototypes/DecisionTreeBurstPrototype';
import {DependencyBridgeBuilderPrototype} from './prototypes/DependencyBridgeBuilderPrototype';
import {DynamicPodiumRisePrototype} from './prototypes/DynamicPodiumRisePrototype';
import {EncryptionVaultLayersPrototype} from './prototypes/EncryptionVaultLayersPrototype';
import {FunnelCompressionOutputPrototype} from './prototypes/FunnelCompressionOutputPrototype';
import {HumanAIRelayPrototype} from './prototypes/HumanAIRelayPrototype';
import {KnowledgeMagnetPrototype} from './prototypes/KnowledgeMagnetPrototype';
import {KnowledgeTreeGraftPrototype} from './prototypes/KnowledgeTreeGraftPrototype';
import {LatencyTunnelRacePrototype} from './prototypes/LatencyTunnelRacePrototype';
import {MagneticPhraseSlicerPrototype} from './prototypes/MagneticPhraseSlicerPrototype';
import {MeaningTerrainPrototype} from './prototypes/MeaningTerrainPrototype';
import {ProbabilityFluidColumnsPrototype} from './prototypes/ProbabilityFluidColumnsPrototype';
import {ResidualRiverPrototype} from './prototypes/ResidualRiverPrototype';
import {SubwayWorkflowMapPrototype} from './prototypes/SubwayWorkflowMapPrototype';
import {TimelineMicroscopePrototype} from './prototypes/TimelineMicroscopePrototype';
import {VectorPrismConverterPrototype} from './prototypes/VectorPrismConverterPrototype';

export type CompletePrototypeRegistration = {
  compositionId: string;
  animationId: string;
  component: ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  checkpoints: readonly number[];
  smokeCheckpoints: readonly number[];
};

const DEFAULTS = Object.freeze({
  durationInFrames: 180,
  fps: 30,
  width: 1080,
  height: 1920,
  checkpoints: Object.freeze([0, 30, 60, 90, 120, 150, 179]),
  smokeCheckpoints: Object.freeze([0, 90, 179]),
});

const DEFINITIONS: readonly [string, string, ComponentType][] = [
  ['Library-Magnetic-Phrase-Slicer', 'tokenization-magnetic-phrase-slicer-v1', MagneticPhraseSlicerPrototype],
  ['Library-Vector-Prism-Converter', 'data-transformation-vector-prism-converter-v1', VectorPrismConverterPrototype],
  ['Library-Meaning-Terrain', 'semantic-space-meaning-terrain-v1', MeaningTerrainPrototype],
  ['Library-Dependency-Bridge-Builder', 'relationship-network-dependency-bridge-builder-v1', DependencyBridgeBuilderPrototype],
  ['Library-Probability-Fluid-Columns', 'probability-probability-fluid-columns-v1', ProbabilityFluidColumnsPrototype],
  ['Library-Residual-River', 'model-processing-residual-river-v1', ResidualRiverPrototype],
  ['Library-Answer-Loom', 'generation-answer-loom-v1', AnswerLoomPrototype],
  ['Library-Confidence-Glass-Crack', 'risk-contrast-confidence-glass-crack-v1', ConfidenceGlassCrackPrototype],
  ['Library-Benchmark-Racetrack', 'comparison-benchmark-racetrack-v1', BenchmarkRacetrackPrototype],
  ['Library-Dynamic-Podium-Rise', 'ranking-dynamic-podium-rise-v1', DynamicPodiumRisePrototype],
  ['Library-Funnel-Compression-Output', 'input-output-funnel-compression-output-v1', FunnelCompressionOutputPrototype],
  ['Library-Subway-Workflow-Map', 'process-flow-subway-workflow-map-v1', SubwayWorkflowMapPrototype],
  ['Library-Anomaly-XRay-Scanner', 'error-detection-anomaly-xray-scanner-v1', AnomalyXRayScannerPrototype],
  ['Library-Knowledge-Magnet', 'retrieval-search-knowledge-magnet-v1', KnowledgeMagnetPrototype],
  ['Library-Encryption-Vault-Layers', 'security-privacy-encryption-vault-layers-v1', EncryptionVaultLayersPrototype],
  ['Library-Latency-Tunnel-Race', 'scale-performance-latency-tunnel-race-v1', LatencyTunnelRacePrototype],
  ['Library-Budget-Leak-Meter', 'cost-efficiency-budget-leak-meter-v1', BudgetLeakMeterPrototype],
  ['Library-Timeline-Microscope', 'time-change-timeline-microscope-v1', TimelineMicroscopePrototype],
  ['Library-Human-AI-Relay', 'human-ai-collaboration-human-ai-relay-v1', HumanAIRelayPrototype],
  ['Library-Decision-Tree-Burst', 'decision-logic-decision-tree-burst-v1', DecisionTreeBurstPrototype],
  ['Library-Context-Window-Train', 'context-window-context-window-train-v1', ContextWindowTrainPrototype],
  ['Library-Knowledge-Tree-Graft', 'learning-update-knowledge-tree-graft-v1', KnowledgeTreeGraftPrototype],
] as const;

export const COMPLETE_PROTOTYPE_REGISTRY: CompletePrototypeRegistration[] =
  DEFINITIONS.map(([compositionId, animationId, component]) => {
    const entry = getAnimationLibraryEntry(animationId);
    if (!entry) {
      throw new Error(`complete prototype is absent from catalog: ${animationId}`);
    }
    if (entry.status !== 'prototype' && entry.status !== 'verified') {
      throw new Error(`complete prototype has invalid catalog status: ${animationId}`);
    }
    return {
      compositionId,
      animationId,
      component,
      ...DEFAULTS,
    };
  });

export const COMPLETE_PROTOTYPE_FAMILIES = COMPLETE_PROTOTYPE_REGISTRY.map(
  (registration) =>
    getAnimationLibraryEntry(registration.animationId)?.visualFamily ?? 'unknown',
);

export const COMPLETE_PROTOTYPE_EXPECTED_ARTIFACTS =
  COMPLETE_PROTOTYPE_REGISTRY.length * (DEFAULTS.checkpoints.length + 1);
