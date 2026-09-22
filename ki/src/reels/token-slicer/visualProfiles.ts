import {
  assertAuthoredVisualDiversity,
  evaluateAuthoredVisualDiversity,
  type AuthoredVisualScene,
} from '../../animation-library/authoredProductionGate';

export const TOKEN_SLICER_VISUAL_MANIFEST: readonly AuthoredVisualScene[] = Object.freeze([
  {sceneId:'s01-hook-slicer',visualId:'token-slicer-hero-v1',fingerprint:{primaryPrimitive:'object',cameraMotion:'push',depthStyle:'pseudo-3d',entryMechanism:'depth',medium:'remotion-native',direction:'depth-forward',visualFamily:'physical-tokenization',layoutFamily:'hero-machine',motionSignature:'word-enters-slicer-and-bursts'}},
  {sceneId:'s02-tokenizer-flow',visualId:'token-conveyor-v1',fingerprint:{primaryPrimitive:'path',cameraMotion:'pan',depthStyle:'layered-2d',entryMechanism:'draw',medium:'remotion-native',direction:'left-to-right',visualFamily:'token-flow',layoutFamily:'curved-data-path',motionSignature:'scan-then-follow-path'}},
  {sceneId:'s03-token-types',visualId:'token-granularity-v1',fingerprint:{primaryPrimitive:'typography',cameraMotion:'locked',depthStyle:'layered-2d',entryMechanism:'assemble',medium:'remotion-native',direction:'bottom-to-top',visualFamily:'token-granularity',layoutFamily:'size-spectrum',motionSignature:'staggered-scale-taxonomy'}},
  {sceneId:'s04-encoding-routing',visualId:'encoding-routing-v1',fingerprint:{primaryPrimitive:'path',cameraMotion:'pull',depthStyle:'pseudo-3d',entryMechanism:'draw',medium:'remotion-native',direction:'center-out',visualFamily:'encoding-routing',layoutFamily:'forked-routing',motionSignature:'dual-route-segmentation'}},
  {sceneId:'s05-word-vs-token',visualId:'word-token-counter-v1',fingerprint:{primaryPrimitive:'mixed',cameraMotion:'parallax',depthStyle:'layered-2d',entryMechanism:'slide',medium:'remotion-native',direction:'center-out',visualFamily:'count-comparison',layoutFamily:'stacked-divergence',motionSignature:'coarse-blocks-diverge-to-fine-blocks'}},
  {sceneId:'s06-case-spacing',visualId:'case-spacing-shift-v1',fingerprint:{primaryPrimitive:'typography',cameraMotion:'pan',depthStyle:'flat',entryMechanism:'morph',medium:'remotion-native',direction:'left-to-right',visualFamily:'text-variation',layoutFamily:'three-text-rails',motionSignature:'case-spacing-shifts-cut-marks'}},
  {sceneId:'s07-model-core',visualId:'token-model-core-v1',fingerprint:{primaryPrimitive:'nodes',cameraMotion:'push',depthStyle:'pseudo-3d',entryMechanism:'mixed',medium:'remotion-native',direction:'outside-in',visualFamily:'model-processing',layoutFamily:'radial-core-flow',motionSignature:'multi-stream-converge-and-exit'}},
  {sceneId:'s08-payoff',visualId:'token-payoff-v1',fingerprint:{primaryPrimitive:'object',cameraMotion:'pull',depthStyle:'layered-2d',entryMechanism:'scale',medium:'remotion-native',direction:'center-out',visualFamily:'focus-transfer',layoutFamily:'single-hero-payoff',motionSignature:'word-count-exits-token-focus-holds'}},
]);

export const TOKEN_SLICER_VISUAL_DIVERSITY = Object.freeze(
  evaluateAuthoredVisualDiversity(TOKEN_SLICER_VISUAL_MANIFEST),
);

export const assertTokenSlicerVisualDiversity = (): void => {
  assertAuthoredVisualDiversity(TOKEN_SLICER_VISUAL_MANIFEST);
};

assertTokenSlicerVisualDiversity();
