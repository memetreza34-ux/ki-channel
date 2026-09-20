import type {SceneMeaningContract} from './meaningContract';

export const CREATIVE_RECIPE_IDS = [
  'object-morph-stage',
  'path-trace-field',
  'network-bloom',
  'xray-overlay',
  'typographic-construct',
  'cutaway-stack',
  'depth-corridor',
  'ui-state-machine',
] as const;

export type CreativeRecipeId = (typeof CREATIVE_RECIPE_IDS)[number];

export type CreativeRecipeDefinition = {
  id: CreativeRecipeId;
  layoutRoot: string;
  motionRoot: string;
  primitiveHints: string[];
  cameraStyle: string;
  transitionIn: string;
  transitionOut: string;
  explanationPattern: string;
  runtimeMechanisms: string[];
};

export const CREATIVE_RECIPE_DEFINITIONS: Readonly<
  Record<CreativeRecipeId, CreativeRecipeDefinition>
> = Object.freeze({
  'object-morph-stage': {
    id: 'object-morph-stage',
    layoutRoot: 'hero-object-morph-stage',
    motionRoot: 'assemble-object-morph-resolve',
    primitiveHints: ['semantic-object', 'shape-morph', 'layered-object'],
    cameraStyle: 'gentle-parallax-object-stage',
    transitionIn: 'assemble-entry',
    transitionOut: 'morph-result',
    explanationPattern: 'object-transformation',
    runtimeMechanisms: ['camera-stage', 'object-morph', 'depth-layer', 'motion-reveal'],
  },
  'path-trace-field': {
    id: 'path-trace-field',
    layoutRoot: 'open-path-trace-field',
    motionRoot: 'draw-path-travel-branch-resolve',
    primitiveHints: ['flow-path', 'path-node', 'trace-marker'],
    cameraStyle: 'directional-follow-pan',
    transitionIn: 'path-reveal',
    transitionOut: 'path-resolve',
    explanationPattern: 'spatial-process-trace',
    runtimeMechanisms: ['camera-stage', 'path-flow', 'trace-marker', 'pulse-halo'],
  },
  'network-bloom': {
    id: 'network-bloom',
    layoutRoot: 'layered-network-bloom',
    motionRoot: 'seed-connect-pulse-prune-resolve',
    primitiveHints: ['network-node', 'bezier-connector', 'pulse-marker'],
    cameraStyle: 'slow-orbital-parallax',
    transitionIn: 'assemble-entry',
    transitionOut: 'network-collapse-result',
    explanationPattern: 'relationship-network',
    runtimeMechanisms: ['camera-stage', 'network-bloom', 'bezier-connector', 'pulse-halo'],
  },
  'xray-overlay': {
    id: 'xray-overlay',
    layoutRoot: 'layered-xray-overlay',
    motionRoot: 'surface-lock-xray-reveal-verify',
    primitiveHints: ['semantic-object', 'xray-layer', 'overlay-marker'],
    cameraStyle: 'controlled-micro-push-with-layer-parallax',
    transitionIn: 'mask-reveal',
    transitionOut: 'overlay-resolve',
    explanationPattern: 'surface-vs-hidden-state',
    runtimeMechanisms: ['camera-stage', 'mask-scanner', 'xray-layer', 'result-lock'],
  },
  'typographic-construct': {
    id: 'typographic-construct',
    layoutRoot: 'kinetic-type-construction-field',
    motionRoot: 'mask-type-build-transform-lock',
    primitiveHints: ['kinetic-type', 'word-form', 'mask-plane'],
    cameraStyle: 'locked-text-plane-with-micro-push',
    transitionIn: 'mask-reveal',
    transitionOut: 'type-morph-result',
    explanationPattern: 'typographic-transformation',
    runtimeMechanisms: ['camera-stage', 'kinetic-type', 'mask-reveal', 'word-morph'],
  },
  'cutaway-stack': {
    id: 'cutaway-stack',
    layoutRoot: 'pseudo-3d-cutaway-stack',
    motionRoot: 'mask-open-layers-separate-inspect-resolve',
    primitiveHints: ['layer-plane', 'cutaway-window', 'state-marker', 'pseudo-3d'],
    cameraStyle: 'angled-cutaway-pan',
    transitionIn: 'mask-reveal',
    transitionOut: 'layers-recompose',
    explanationPattern: 'layered-cutaway-explanation',
    runtimeMechanisms: ['camera-stage', 'cutaway-stack', 'depth-layer', 'mask-reveal'],
  },
  'depth-corridor': {
    id: 'depth-corridor',
    layoutRoot: 'pseudo-3d-semantic-corridor',
    motionRoot: 'depth-enter-pass-layers-focus-result',
    primitiveHints: ['semantic-object', 'depth-layer', 'perspective-plane', 'pseudo-3d'],
    cameraStyle: 'controlled-depth-push-with-stable-text-plane',
    transitionIn: 'depth-entry',
    transitionOut: 'depth-result-hold',
    explanationPattern: 'spatial-depth-reveal',
    runtimeMechanisms: ['camera-stage', 'depth-corridor', 'depth-layer', 'focus-lock'],
  },
  'ui-state-machine': {
    id: 'ui-state-machine',
    layoutRoot: 'single-interface-state-machine',
    motionRoot: 'ui-state-trigger-transform-confirm',
    primitiveHints: ['ui-surface', 'state-control', 'result-indicator'],
    cameraStyle: 'slight-interface-parallax-push',
    transitionIn: 'interface-assemble',
    transitionOut: 'state-confirm-result',
    explanationPattern: 'interface-state-change',
    runtimeMechanisms: ['camera-stage', 'ui-state-machine', 'state-control', 'result-lock'],
  },
});

export const CREATIVE_RECIPE_LIST: readonly CreativeRecipeDefinition[] =
  CREATIVE_RECIPE_IDS.map((id) => CREATIVE_RECIPE_DEFINITIONS[id]);

export const CREATIVE_RECIPES_BY_GOAL: Readonly<
  Record<SceneMeaningContract['communicationGoal'], readonly CreativeRecipeId[]>
> = Object.freeze({
  rank: ['path-trace-field', 'network-bloom', 'typographic-construct'],
  compare: ['object-morph-stage', 'xray-overlay', 'cutaway-stack'],
  'show-limitation': ['xray-overlay', 'cutaway-stack', 'typographic-construct'],
  'show-change-over-time': ['path-trace-field', 'object-morph-stage', 'depth-corridor'],
  'explain-process': ['path-trace-field', 'cutaway-stack', 'depth-corridor'],
  'show-transformation': ['object-morph-stage', 'typographic-construct', 'depth-corridor'],
  'reveal-cause': ['xray-overlay', 'cutaway-stack', 'path-trace-field'],
  'show-collaboration': ['network-bloom', 'path-trace-field', 'object-morph-stage'],
  'warn-or-verify': ['xray-overlay', 'path-trace-field', 'cutaway-stack'],
  'show-result': ['object-morph-stage', 'typographic-construct', 'depth-corridor'],
});

export const isCreativeRecipeId = (value: string): value is CreativeRecipeId =>
  (CREATIVE_RECIPE_IDS as readonly string[]).includes(value);

export const getCreativeRecipe = (
  id: CreativeRecipeId,
): CreativeRecipeDefinition => CREATIVE_RECIPE_DEFINITIONS[id];
