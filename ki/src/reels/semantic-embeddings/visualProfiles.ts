import type {AuthoredVisualScene} from '../../animation-library/authoredProductionGate';

export const SEMANTIC_EMBEDDINGS_VISUAL_PROFILES: readonly AuthoredVisualScene[] = [
  {
    sceneId: 'semantic-01',
    visualId: 'semantic-search-hook-v1',
    fingerprint: {
      primaryPrimitive: 'ui', cameraMotion: 'push', depthStyle: 'layered-2d', entryMechanism: 'slide', medium: 'remotion-native', direction: 'top-to-bottom', visualFamily: 'semantic-search-hook', layoutFamily: 'query-result-split', motionSignature: 'query-enter-result-slide-semantic-link',
    },
  },
  {
    sceneId: 'semantic-02',
    visualId: 'semantic-text-vector-morph-v1',
    fingerprint: {
      primaryPrimitive: 'object', cameraMotion: 'pull', depthStyle: 'pseudo-3d', entryMechanism: 'morph', medium: 'remotion-native', direction: 'center-out', visualFamily: 'text-vector-transform', layoutFamily: 'sentence-to-dimensions', motionSignature: 'sentence-compress-dimensions-fan-out',
    },
  },
  {
    sceneId: 'semantic-03',
    visualId: 'semantic-cluster-field-v1',
    fingerprint: {
      primaryPrimitive: 'nodes', cameraMotion: 'parallax', depthStyle: 'layered-2d', entryMechanism: 'assemble', medium: 'remotion-native', direction: 'outside-in', visualFamily: 'semantic-clustering', layoutFamily: 'multi-cluster-point-field', motionSignature: 'points-scatter-cluster-query-attract',
    },
  },
  {
    sceneId: 'semantic-04',
    visualId: 'semantic-similarity-target-v1',
    fingerprint: {
      primaryPrimitive: 'path', cameraMotion: 'pan', depthStyle: 'flat', entryMechanism: 'draw', medium: 'remotion-native', direction: 'left-to-right', visualFamily: 'similarity-ranking', layoutFamily: 'query-radial-candidates', motionSignature: 'query-form-lines-scan-winner-ring',
    },
  },
  {
    sceneId: 'semantic-05',
    visualId: 'semantic-use-cases-boundary-v1',
    fingerprint: {
      primaryPrimitive: 'illustration', cameraMotion: 'locked', depthStyle: 'flat', entryMechanism: 'scale', medium: 'remotion-native', direction: 'bottom-to-top', visualFamily: 'use-case-boundary', layoutFamily: 'three-icons-boundary-payoff', motionSignature: 'icons-activate-boundary-snap-payoff',
    },
  },
] as const;
