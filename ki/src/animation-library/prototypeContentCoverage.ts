export type PrototypeContentBindingLevel =
  | 'native-object-binding'
  | 'semantic-shell-only'
  | 'purpose-built-new-animation';

export const NATIVE_CONTENT_BOUND_PROTOTYPE_IDS = new Set<string>([
  'tokenization-magnetic-phrase-slicer-v1',
  'data-transformation-vector-prism-converter-v1',
  'semantic-space-meaning-terrain-v1',
  'probability-probability-fluid-columns-v1',
  'decision-logic-decision-tree-burst-v1',
  'retrieval-search-knowledge-magnet-v1',
  'risk-contrast-confidence-glass-crack-v1',
  'scale-performance-latency-tunnel-race-v1',
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
  getPrototypeContentBindingLevel({animationId, source}) !==
  'semantic-shell-only';
