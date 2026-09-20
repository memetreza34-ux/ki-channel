import type {AuthoredVisualScene} from '../../animation-library/authoredProductionGate';
import rawReel from '../../../reels/2026-08-03_bis_2026-08-09/01_Warum-KI-Text-anders-liest/06-projektdateien/reel.json';

const scenes = rawReel.scenes;

const fingerprintsBySceneId: Record<string, AuthoredVisualScene['fingerprint']> = {
  'scene-01': {
    primaryPrimitive: 'typography',
    cameraMotion: 'push',
    depthStyle: 'layered-2d',
    entryMechanism: 'cut',
    medium: 'remotion-native',
    direction: 'center-out',
    visualFamily: 'tokenization',
    layoutFamily: 'center-to-scatter',
    motionSignature: 'sentence-lock-shatter-magnetic-tiles',
  },
  'scene-02': {
    primaryPrimitive: 'object',
    cameraMotion: 'locked',
    depthStyle: 'layered-2d',
    entryMechanism: 'mask',
    medium: 'remotion-native',
    direction: 'top-to-bottom',
    visualFamily: 'data-transformation',
    layoutFamily: 'vertical-machine',
    motionSignature: 'tokens-descend-scan-convert-numbers',
  },
  'scene-03': {
    primaryPrimitive: 'nodes',
    cameraMotion: 'orbit',
    depthStyle: 'pseudo-3d',
    entryMechanism: 'depth',
    medium: 'remotion-native',
    direction: 'depth-forward',
    visualFamily: 'semantic-space',
    layoutFamily: 'depth-field',
    motionSignature: 'vectors-fly-cluster-camera-orbit',
  },
  'scene-04': {
    primaryPrimitive: 'nodes',
    cameraMotion: 'parallax',
    depthStyle: 'flat',
    entryMechanism: 'draw',
    medium: 'remotion-native',
    direction: 'mixed',
    visualFamily: 'relationship-network',
    layoutFamily: 'distributed-nodes',
    motionSignature: 'keywords-anchor-threads-weave-pulse',
  },
  'scene-05': {
    primaryPrimitive: 'path',
    cameraMotion: 'pan',
    depthStyle: 'flat',
    entryMechanism: 'draw',
    medium: 'remotion-native',
    direction: 'left-to-right',
    visualFamily: 'probability',
    layoutFamily: 'branching-paths',
    motionSignature: 'candidate-paths-race-probability-shift',
  },
  'scene-06': {
    primaryPrimitive: 'object',
    cameraMotion: 'push',
    depthStyle: 'pseudo-3d',
    entryMechanism: 'depth',
    medium: 'remotion-native',
    direction: 'bottom-to-top',
    visualFamily: 'model-processing',
    layoutFamily: 'stacked-layers',
    motionSignature: 'candidate-rises-through-layers-refines',
  },
  'scene-07': {
    primaryPrimitive: 'typography',
    cameraMotion: 'pan',
    depthStyle: 'layered-2d',
    entryMechanism: 'assemble',
    medium: 'remotion-native',
    direction: 'left-to-right',
    visualFamily: 'generation',
    layoutFamily: 'left-to-right-build',
    motionSignature: 'word-capsules-snap-into-answer',
  },
  'scene-08': {
    primaryPrimitive: 'illustration',
    cameraMotion: 'pull',
    depthStyle: 'pseudo-3d',
    entryMechanism: 'morph',
    medium: 'remotion-native',
    direction: 'center-out',
    visualFamily: 'risk-contrast',
    layoutFamily: 'split-balance',
    motionSignature: 'answer-splits-correct-wrong-balance-tilts',
  },
};

export const WHY_AI_VISUAL_PROFILES: readonly AuthoredVisualScene[] = scenes.map(
  (scene): AuthoredVisualScene => {
    const fingerprint = fingerprintsBySceneId[scene.sceneId];
    if (!fingerprint) {
      throw new Error(`missing authored visual fingerprint for ${scene.sceneId}`);
    }
    if (
      fingerprint.visualFamily !== scene.visualFamily ||
      fingerprint.layoutFamily !== scene.layoutFamily ||
      fingerprint.motionSignature !== scene.motionSignature
    ) {
      throw new Error(`visual fingerprint metadata drift for ${scene.sceneId}`);
    }
    return Object.freeze({
      sceneId: scene.sceneId,
      visualId: scene.animationId,
      fingerprint: Object.freeze(fingerprint),
    });
  },
);
