export const VISUAL_QUALITY_V3_ARCHETYPES = [
  'hero-impact',
  'object-transformation',
  'split-comparison',
  'ui-demo',
  'network-flow',
  'device-scene',
  'timeline-deadline',
  'zoom-detail',
  'terminal-code',
  'final-verdict',
] as const;

export type VisualQualityV3Archetype = (typeof VISUAL_QUALITY_V3_ARCHETYPES)[number];
export type VisualQualityV3Contrast = 'soft' | 'balanced' | 'strong';
export type VisualQualityV3CameraMotion = 'locked' | 'push' | 'pull' | 'pan' | 'parallax' | 'orbit' | 'depth';

export type VisualQualityV3Hook = {
  heroAreaRatio: number;
  semanticVisualAnchors: number;
  brandAnchorAreaRatio: number;
  stateChangesFirstSecond: number;
  stateChangesFirst3Seconds: number;
  contrast: VisualQualityV3Contrast;
  conflictVisible: boolean;
  keyMessageVisible: boolean;
};

export type VisualQualityV3Scene = {
  sceneId: string;
  archetype: VisualQualityV3Archetype;
  heroAreaRatio: number;
  semanticIconCount: number;
  illustrationCount: number;
  supportElementCount: number;
  distinctShapeFamilies: number;
  meaningfulStateChanges: number;
  microBeats: number;
  motionDistancePx: number;
  depthLayers: number;
  contrast: VisualQualityV3Contrast;
  cameraMotion: VisualQualityV3CameraMotion;
};

export type VisualQualityV3Scores = {
  hook: number;
  visualVariety: number;
  motion: number;
  iconIllustrationUse: number;
  readability: number;
  overall: number;
};

export type VisualQualityV3Contract = {
  version: 3;
  hook: VisualQualityV3Hook;
  scenes: readonly VisualQualityV3Scene[];
  targetScores: VisualQualityV3Scores;
};

const assertScore = (label: string, value: number) => {
  if (!Number.isFinite(value) || value < 8 || value > 10) {
    throw new Error(`${label} must target 8-10/10`);
  }
};

export const assertVisualQualityV3 = (contract: VisualQualityV3Contract): void => {
  if (contract.version !== 3) throw new Error('visual quality contract version must be 3');
  if (contract.scenes.length < 4) throw new Error('visual quality v3 needs at least four scenes');

  const hook = contract.hook;
  if (hook.heroAreaRatio < 0.28) throw new Error('hook hero must occupy at least 28% of usable visual area');
  if (hook.semanticVisualAnchors < 2) throw new Error('hook needs at least two semantic visual anchors');
  if (hook.brandAnchorAreaRatio < 0.035) throw new Error('hook brand/product anchor is too small to count');
  if (hook.stateChangesFirstSecond < 2) throw new Error('hook needs at least two visible state changes in the first second');
  if (hook.stateChangesFirst3Seconds < 3) throw new Error('hook needs at least three visible state changes in the first three seconds');
  if (hook.contrast !== 'strong') throw new Error('hook must use strong contrast');
  if (!hook.conflictVisible) throw new Error('hook must show a visible conflict/consequence');
  if (!hook.keyMessageVisible) throw new Error('hook key message must be visually understandable without audio');

  const ids = new Set<string>();
  for (const scene of contract.scenes) {
    if (ids.has(scene.sceneId)) throw new Error(`duplicate visual quality scene: ${scene.sceneId}`);
    ids.add(scene.sceneId);

    if (scene.heroAreaRatio < 0.18) throw new Error(`scene ${scene.sceneId} hero is too small; minimum 18%`);
    if (scene.semanticIconCount + scene.illustrationCount < 2) {
      throw new Error(`scene ${scene.sceneId} needs at least two semantic icons/illustrations`);
    }
    if (scene.supportElementCount < 3) throw new Error(`scene ${scene.sceneId} needs at least three support elements`);
    if (scene.distinctShapeFamilies < 3) throw new Error(`scene ${scene.sceneId} needs at least three distinct visual shape families`);
    if (scene.meaningfulStateChanges < 2) throw new Error(`scene ${scene.sceneId} needs at least two meaningful state changes`);
    if (scene.microBeats < 2) throw new Error(`scene ${scene.sceneId} needs at least two micro beats`);
    if (scene.motionDistancePx < 60 && scene.meaningfulStateChanges < 4) {
      throw new Error(`scene ${scene.sceneId} is too static; add real movement or more state changes`);
    }
    if (scene.cameraMotion === 'locked' && scene.depthLayers < 2 && scene.meaningfulStateChanges < 4) {
      throw new Error(`scene ${scene.sceneId} is too flat for a locked camera`);
    }
  }

  for (let index = 1; index < contract.scenes.length; index += 1) {
    if (contract.scenes[index - 1].archetype === contract.scenes[index].archetype) {
      throw new Error(`consecutive scenes repeat shot archetype ${contract.scenes[index].archetype}`);
    }
  }

  const uniqueArchetypes = new Set(contract.scenes.map((scene) => scene.archetype)).size;
  if (uniqueArchetypes < Math.min(4, contract.scenes.length)) {
    throw new Error(`visual quality v3 needs at least ${Math.min(4, contract.scenes.length)} shot archetypes`);
  }

  const softContrastCount = contract.scenes.filter((scene) => scene.contrast === 'soft').length;
  if (softContrastCount > Math.floor(contract.scenes.length * 0.25)) {
    throw new Error('too many scenes use soft/washed-out contrast');
  }

  for (const [key, value] of Object.entries(contract.targetScores)) assertScore(`targetScores.${key}`, value);
};
