export type PrototypeContentBindingLevel =
  | 'native-object-binding'
  | 'semantic-shell-only'
  | 'purpose-built-new-animation';

export const NATIVE_CONTENT_BOUND_PROTOTYPE_IDS = new Set<string>([
  'retrieval-search-knowledge-magnet-v1',
  'cost-efficiency-budget-leak-meter-v1',
  'context-window-context-window-train-v1',
  'decision-logic-decision-tree-burst-v1',
  'human-ai-collaboration-human-ai-relay-v1',
  'learning-update-knowledge-tree-graft-v1',
  'tokenization-magnetic-phrase-slicer-v1',
  'data-transformation-vector-prism-converter-v1',
  'ranking-dynamic-podium-rise-v1',
  'process-flow-subway-workflow-map-v1',
  'input-output-funnel-compression-output-v1',
  'error-detection-anomaly-xray-scanner-v1',
  'semantic-space-meaning-terrain-v1',
  'relationship-network-dependency-bridge-builder-v1',
  'probability-probability-fluid-columns-v1',
  'model-processing-residual-river-v1',
  'generation-answer-loom-v1',
  'risk-contrast-confidence-glass-crack-v1',
  'security-privacy-encryption-vault-layers-v1',
  'scale-performance-latency-tunnel-race-v1',
  'time-change-timeline-microscope-v1',
  'comparison-benchmark-racetrack-v1',
]);

export const getPrototypeContentBindingLevel = ({
  animationId,
  source,
}: {
  animationId: string;
  source: 'library' | 'new-build';
}): PrototypeContentBindingLevel => {
  if (source === 'new-build') return 'purpose-built-new-animation';
  return NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(animationId)
    ? 'native-object-binding'
    : 'semantic-shell-only';
};

export const isPrototypeContentBindingReady = ({
  animationId,
  source,
}: {
  animationId: string;
  source: 'library' | 'new-build';
}): boolean =>
  getPrototypeContentBindingLevel({animationId, source}) ===
  'native-object-binding';
