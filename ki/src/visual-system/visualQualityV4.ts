export const VISUAL_QUALITY_V4_ARCHETYPES = [
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
  'permission-gate',
  'process-flow',
] as const;

export type VisualQualityV4Archetype = (typeof VISUAL_QUALITY_V4_ARCHETYPES)[number];
export type VisualQualityV4Contrast = 'soft' | 'medium' | 'strong';

export type VisualQualityV4RecognitionCue = {
  id: string;
  description: string;
};

export type VisualQualityV4Hook = {
  sceneId: string;
  firstFrameHeroVisible: boolean;
  keyMessageByFrame: number;
  firstMajorChangeByFrame: number;
  heroAreaRatio: number;
  semanticVisualAnchors: number;
  recognitionCues: readonly string[];
  contrast: VisualQualityV4Contrast;
  conflictVisible: boolean;
  keyMessageVisible: boolean;
  visualVerb: string;
};

export type VisualQualityV4Story = {
  startState: string;
  visibleChange: string;
  endState: string;
  visualVerb: string;
};

export type VisualQualityV4Hero = {
  semanticType: string;
  meaning: string;
  screenAreaTarget: number;
  recognitionCues: readonly VisualQualityV4RecognitionCue[];
};

export type VisualQualityV4MotionPlan = {
  entry: string;
  development: string;
  payoff: string;
  payoffAtProgress: number;
  maxStaticHoldFrames: number;
  intentionalStillness: boolean;
  stillnessReason?: string;
};

export type VisualQualityV4Scene = {
  sceneId: string;
  archetype: VisualQualityV4Archetype;
  startFrame: number;
  durationFrames: number;
  story: VisualQualityV4Story;
  hero: VisualQualityV4Hero;
  meaningfulStateChanges: number;
  microBeats: number;
  contrast: VisualQualityV4Contrast;
  motionPlan: VisualQualityV4MotionPlan;
};

export type VisualQualityV4Scores = {
  hook: number;
  semanticClarity: number;
  storyMotion: number;
  visualVariety: number;
  readability: number;
  overall: number;
};

export type VisualQualityV4Contract = {
  version: 4;
  compositionId: string;
  fps: number;
  hook: VisualQualityV4Hook;
  scenes: readonly VisualQualityV4Scene[];
  targetScores: VisualQualityV4Scores;
};

const weakVisualVerbs = new Set([
  'show', 'shows', 'display', 'displays', 'appear', 'appears',
  'zeigen', 'zeigt', 'darstellen', 'stellt dar', 'erscheinen', 'erscheint',
  'einblenden', 'blendet ein', 'stehen', 'steht da', 'bewegen', 'bewegt',
]);
const placeholders = /^(offen|tbd|todo|n\/a|na|none|placeholder|dummy|test)$/i;
const usefulText = (value: string, min = 8) => value.trim().length >= min && !placeholders.test(value.trim());
const assertScore = (label: string, value: number) => {
  if (!Number.isFinite(value) || value < 8 || value > 10) throw new Error(`${label} must target 8-10/10`);
};
const assertActionVerb = (label: string, value: string) => {
  if (!usefulText(value, 3) || weakVisualVerbs.has(value.trim().toLowerCase())) {
    throw new Error(`${label} must describe a meaningful visual action`);
  }
};

export const assertVisualQualityV4 = (contract: VisualQualityV4Contract): void => {
  if (contract.version !== 4) throw new Error('visual quality contract version must be 4');
  if (!usefulText(contract.compositionId, 3)) throw new Error('visual quality v4 needs a production compositionId');
  if (!Number.isInteger(contract.fps) || contract.fps < 24 || contract.fps > 60) throw new Error('visual quality v4 fps must be 24-60');
  if (contract.scenes.length < 4) throw new Error('visual quality v4 needs at least four scenes');

  const hook = contract.hook;
  if (!hook.firstFrameHeroVisible) throw new Error('hook hero must already be visible in frame 0');
  if (hook.keyMessageByFrame < 0 || hook.keyMessageByFrame > Math.ceil(contract.fps * 0.6)) throw new Error('hook key message appears too late');
  if (hook.firstMajorChangeByFrame < 1 || hook.firstMajorChangeByFrame > contract.fps) throw new Error('hook first major change must happen within one second');
  if (hook.heroAreaRatio < 0.28) throw new Error('hook hero must occupy at least 28% of usable visual area');
  if (hook.semanticVisualAnchors < 2) throw new Error('hook needs at least two semantic visual anchors');
  if (hook.recognitionCues.length < 2) throw new Error('hook needs at least two concrete recognition cues');
  if (hook.contrast !== 'strong') throw new Error('hook must use strong contrast');
  if (!hook.conflictVisible) throw new Error('hook must show a visible conflict/consequence');
  if (!hook.keyMessageVisible) throw new Error('hook key message must be visually understandable without audio');
  assertActionVerb('hook.visualVerb', hook.visualVerb);

  const ids = new Set<string>();
  let previousEnd = 0;
  for (let index = 0; index < contract.scenes.length; index += 1) {
    const scene = contract.scenes[index];
    if (ids.has(scene.sceneId)) throw new Error(`duplicate visual quality scene: ${scene.sceneId}`);
    ids.add(scene.sceneId);
    if (index === 0 && scene.startFrame !== 0) throw new Error('first V4 scene must start at frame 0');
    if (!Number.isInteger(scene.startFrame) || scene.startFrame < 0) throw new Error(`scene ${scene.sceneId} has invalid startFrame`);
    if (!Number.isInteger(scene.durationFrames) || scene.durationFrames < Math.max(24, Math.round(contract.fps * 0.8))) throw new Error(`scene ${scene.sceneId} is too short for V4 review`);
    if (index > 0 && scene.startFrame < previousEnd) throw new Error(`scene ${scene.sceneId} overlaps the previous scene`);
    previousEnd = scene.startFrame + scene.durationFrames;

    if (!usefulText(scene.story.startState, 10)) throw new Error(`scene ${scene.sceneId} needs a concrete start state`);
    if (!usefulText(scene.story.visibleChange, 10)) throw new Error(`scene ${scene.sceneId} needs a concrete visible change`);
    if (!usefulText(scene.story.endState, 10)) throw new Error(`scene ${scene.sceneId} needs a concrete end state`);
    if (scene.story.startState.trim() === scene.story.endState.trim()) throw new Error(`scene ${scene.sceneId} start and end states must differ`);
    assertActionVerb(`scene ${scene.sceneId} visualVerb`, scene.story.visualVerb);

    if (!usefulText(scene.hero.semanticType, 3)) throw new Error(`scene ${scene.sceneId} hero semanticType missing`);
    if (!usefulText(scene.hero.meaning, 10)) throw new Error(`scene ${scene.sceneId} hero meaning missing`);
    if (scene.hero.screenAreaTarget < 0.22 || scene.hero.screenAreaTarget > 0.85) throw new Error(`scene ${scene.sceneId} hero screenAreaTarget must be 0.22-0.85`);
    if (scene.hero.recognitionCues.length < 2) throw new Error(`scene ${scene.sceneId} needs at least two hero recognition cues`);
    if (scene.archetype === 'device-scene' && /^(shape|box|rectangle|generic|abstract)$/i.test(scene.hero.semanticType.trim())) {
      throw new Error(`scene ${scene.sceneId} device hero is too abstract`);
    }

    if (scene.meaningfulStateChanges < 3) throw new Error(`scene ${scene.sceneId} needs at least three meaningful state changes`);
    if (scene.microBeats < 2) throw new Error(`scene ${scene.sceneId} needs at least two micro beats`);
    if (!usefulText(scene.motionPlan.entry, 8) || !usefulText(scene.motionPlan.development, 8) || !usefulText(scene.motionPlan.payoff, 8)) {
      throw new Error(`scene ${scene.sceneId} needs entry, development and payoff motion planning`);
    }
    if (scene.motionPlan.payoffAtProgress < 0.55 || scene.motionPlan.payoffAtProgress > 0.95) throw new Error(`scene ${scene.sceneId} payoff must land at 55-95%`);
    const normalHold = Math.ceil(contract.fps * 2.5);
    const extendedHold = Math.ceil(contract.fps * 3.5);
    if (!Number.isInteger(scene.motionPlan.maxStaticHoldFrames) || scene.motionPlan.maxStaticHoldFrames < 0) throw new Error(`scene ${scene.sceneId} has invalid maxStaticHoldFrames`);
    if (scene.motionPlan.intentionalStillness) {
      if (!scene.motionPlan.stillnessReason || !usefulText(scene.motionPlan.stillnessReason, 20)) throw new Error(`scene ${scene.sceneId} intentional stillness needs a reason`);
      if (scene.motionPlan.maxStaticHoldFrames > extendedHold) throw new Error(`scene ${scene.sceneId} intentional stillness is too long`);
    } else if (scene.motionPlan.maxStaticHoldFrames > normalHold) {
      throw new Error(`scene ${scene.sceneId} static hold exceeds 2.5 seconds`);
    }
  }

  if (contract.scenes[0]?.sceneId !== hook.sceneId) throw new Error('hook.sceneId must match the first V4 scene');
  for (let index = 1; index < contract.scenes.length; index += 1) {
    if (contract.scenes[index - 1].archetype === contract.scenes[index].archetype) {
      throw new Error(`consecutive scenes repeat shot archetype ${contract.scenes[index].archetype}`);
    }
  }
  const uniqueArchetypes = new Set(contract.scenes.map((scene) => scene.archetype)).size;
  if (uniqueArchetypes < Math.min(4, contract.scenes.length)) throw new Error('visual quality v4 needs at least four shot archetypes');
  const softContrastCount = contract.scenes.filter((scene) => scene.contrast === 'soft').length;
  if (softContrastCount > Math.floor(contract.scenes.length * 0.2)) throw new Error('too many scenes use soft/washed-out contrast');

  for (const [key, value] of Object.entries(contract.targetScores)) assertScore(`targetScores.${key}`, value);
};
