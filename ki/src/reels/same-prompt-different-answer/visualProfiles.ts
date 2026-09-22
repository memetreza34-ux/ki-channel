import {
  assertAuthoredVisualDiversity,
  evaluateAuthoredVisualDiversity,
  type AuthoredVisualScene,
} from '../../animation-library/authoredProductionGate';
import type {VisualFingerprint} from '../../animation-library/visualFingerprint';
import reelJson from '../../../reels/2026-09-21_bis_2026-09-27/01_Warum-KI-auf-dieselbe-Frage-anders-antwortet/06-projektdateien/reel.json';

type SourceScene = {sceneId: string; visualId: string};

const fingerprints: Record<string, VisualFingerprint> = {
  'prompt-split-fork': {
    primaryPrimitive: 'mixed', cameraMotion: 'push', depthStyle: 'layered-2d', entryMechanism: 'draw', medium: 'remotion-native', direction: 'center-out', visualFamily: 'input-output-fork', layoutFamily: 'split-stage', motionSignature: 'fork-snap',
  },
  'radial-token-field': {
    primaryPrimitive: 'nodes', cameraMotion: 'orbit', depthStyle: 'pseudo-3d', entryMechanism: 'assemble', medium: 'remotion-native', direction: 'circular', visualFamily: 'probability-field', layoutFamily: 'radial-field', motionSignature: 'orbit-bloom',
  },
  'sampling-selector-ring': {
    primaryPrimitive: 'object', cameraMotion: 'locked', depthStyle: 'layered-2d', entryMechanism: 'scale', medium: 'remotion-native', direction: 'circular', visualFamily: 'sampling-selector', layoutFamily: 'selector-ring', motionSignature: 'sweep-lock',
  },
  'context-branch-switch': {
    primaryPrimitive: 'path', cameraMotion: 'pan', depthStyle: 'pseudo-3d', entryMechanism: 'draw', medium: 'remotion-native', direction: 'left-to-right', visualFamily: 'context-branch', layoutFamily: 'branch-tree', motionSignature: 'path-fork',
  },
  'dual-sentence-cascade': {
    primaryPrimitive: 'typography', cameraMotion: 'parallax', depthStyle: 'layered-2d', entryMechanism: 'assemble', medium: 'remotion-native', direction: 'center-out', visualFamily: 'sentence-growth', layoutFamily: 'dual-ribbon', motionSignature: 'cascade-chain',
  },
  'temperature-distribution-fan': {
    primaryPrimitive: 'chart', cameraMotion: 'pull', depthStyle: 'flat', entryMechanism: 'morph', medium: 'remotion-native', direction: 'bottom-to-top', visualFamily: 'distribution-control', layoutFamily: 'dial-fan', motionSignature: 'fan-spread',
  },
  'settings-alignment-rails': {
    primaryPrimitive: 'ui', cameraMotion: 'locked', depthStyle: 'layered-2d', entryMechanism: 'slide', medium: 'remotion-native', direction: 'left-to-right', visualFamily: 'reproducibility-controls', layoutFamily: 'alignment-rails', motionSignature: 'snap-align',
  },
  'stability-variation-balance': {
    primaryPrimitive: 'object', cameraMotion: 'push', depthStyle: 'pseudo-3d', entryMechanism: 'depth', medium: 'remotion-native', direction: 'outside-in', visualFamily: 'decision-balance', layoutFamily: 'balance-stage', motionSignature: 'settle-balance',
  },
};

const scenes = (reelJson as {scenes: SourceScene[]}).scenes;

export const SAME_PROMPT_VISUAL_MANIFEST = Object.freeze(
  scenes.map((scene): AuthoredVisualScene => {
    const fingerprint = fingerprints[scene.visualId];
    if (!fingerprint) throw new Error(`missing fingerprint: ${scene.visualId}`);
    return Object.freeze({sceneId: scene.sceneId, visualId: scene.visualId, fingerprint: Object.freeze(fingerprint)});
  }),
);

export const SAME_PROMPT_VISUAL_DIVERSITY = Object.freeze(
  evaluateAuthoredVisualDiversity(SAME_PROMPT_VISUAL_MANIFEST),
);

export const assertSamePromptVisualDiversity = (): void => {
  assertAuthoredVisualDiversity(SAME_PROMPT_VISUAL_MANIFEST);
};

assertSamePromptVisualDiversity();
