export const V4_ARCHETYPES = new Set([
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
]);

const scoreKeys = ['hook', 'semanticClarity', 'storyMotion', 'visualVariety', 'readability', 'overall'];
const weakVisualVerbs = new Set([
  'show', 'shows', 'display', 'displays', 'appear', 'appears',
  'zeigen', 'zeigt', 'darstellen', 'stellt dar', 'erscheinen', 'erscheint',
  'einblenden', 'blendet ein', 'stehen', 'steht da', 'bewegen', 'bewegt',
]);
const placeholders = /^(offen|tbd|todo|n\/a|na|none|placeholder|dummy|test)$/i;

const usefulText = (value, min = 8) => typeof value === 'string' && value.trim().length >= min && !placeholders.test(value.trim());
const cueId = (cue) => typeof cue === 'string' ? cue : cue?.id;
const cueDescription = (cue) => typeof cue === 'string' ? cue : cue?.description;

export const futureReelNeedsV4 = (weekName) => String(weekName).slice(0, 10) >= '2026-09-28';

export const validateVisualQualityV4Manifest = (manifest, {label = 'visual-quality-v4.json'} = {}) => {
  const errors = [];
  const fail = (message) => errors.push(`${label}: ${message}`);

  if (!manifest || typeof manifest !== 'object') return [`${label}: manifest missing or invalid`];
  if (manifest.version !== 4) fail('version must be 4');
  if (!usefulText(manifest.compositionId, 3)) fail('compositionId must name the production composition');
  if (!Number.isInteger(manifest.fps) || manifest.fps < 24 || manifest.fps > 60) fail('fps must be an integer from 24 to 60');
  if (typeof manifest.sourceQualityContract !== 'string' || !manifest.sourceQualityContract.endsWith('visualQuality.ts')) {
    fail('sourceQualityContract must point to a reel visualQuality.ts file');
  }

  const fps = Number.isInteger(manifest.fps) ? manifest.fps : 30;
  const hook = manifest.hook ?? {};
  if (!usefulText(hook.sceneId, 3)) fail('hook.sceneId missing');
  if (hook.firstFrameHeroVisible !== true) fail('hook.firstFrameHeroVisible must be true — no fade-from-empty opening');
  if (!Number.isInteger(hook.keyMessageByFrame) || hook.keyMessageByFrame < 0 || hook.keyMessageByFrame > Math.ceil(fps * 0.6)) {
    fail(`hook.keyMessageByFrame must be within the first ${Math.ceil(fps * 0.6)} frames`);
  }
  if (!Number.isInteger(hook.firstMajorChangeByFrame) || hook.firstMajorChangeByFrame < 1 || hook.firstMajorChangeByFrame > fps) {
    fail(`hook.firstMajorChangeByFrame must be within the first ${fps} frames`);
  }
  if (!(hook.heroAreaRatio >= 0.28)) fail('hook.heroAreaRatio must be >= 0.28');
  if (!(hook.semanticVisualAnchors >= 2)) fail('hook.semanticVisualAnchors must be >= 2');
  if (!Array.isArray(hook.recognitionCues) || hook.recognitionCues.length < 2) fail('hook.recognitionCues needs at least 2 concrete cues');
  if (hook.contrast !== 'strong') fail('hook.contrast must be strong');
  if (hook.conflictVisible !== true) fail('hook.conflictVisible must be true');
  if (hook.keyMessageVisible !== true) fail('hook.keyMessageVisible must be true');
  if (!usefulText(hook.visualVerb, 3) || weakVisualVerbs.has(String(hook.visualVerb).trim().toLowerCase())) {
    fail('hook.visualVerb must describe a meaningful action, not show/appear/display');
  }

  const scenes = Array.isArray(manifest.scenes) ? manifest.scenes : [];
  if (scenes.length < 4) fail('at least four scenes are required');
  const ids = new Set();
  let previousEnd = 0;

  for (const [index, scene] of scenes.entries()) {
    const p = `scenes[${index}]`;
    if (!usefulText(scene?.sceneId, 3)) fail(`${p}.sceneId missing`);
    else if (ids.has(scene.sceneId)) fail(`${p}.sceneId duplicate: ${scene.sceneId}`);
    else ids.add(scene.sceneId);

    if (!V4_ARCHETYPES.has(scene?.archetype)) fail(`${p}.archetype invalid`);
    if (!Number.isInteger(scene?.startFrame) || scene.startFrame < 0) fail(`${p}.startFrame must be a non-negative integer`);
    if (!Number.isInteger(scene?.durationFrames) || scene.durationFrames < Math.max(24, Math.round(fps * 0.8))) {
      fail(`${p}.durationFrames must be at least ${Math.max(24, Math.round(fps * 0.8))}`);
    }
    if (Number.isInteger(scene?.startFrame) && Number.isInteger(scene?.durationFrames)) {
      if (index > 0 && scene.startFrame < previousEnd) fail(`${p} overlaps the previous scene`);
      previousEnd = scene.startFrame + scene.durationFrames;
    }

    const story = scene?.story ?? {};
    if (!usefulText(story.startState, 10)) fail(`${p}.story.startState must be concrete`);
    if (!usefulText(story.visibleChange, 10)) fail(`${p}.story.visibleChange must describe an on-screen transformation`);
    if (!usefulText(story.endState, 10)) fail(`${p}.story.endState must be concrete`);
    if (usefulText(story.startState) && usefulText(story.endState) && story.startState.trim() === story.endState.trim()) {
      fail(`${p}.story startState and endState must differ`);
    }
    if (!usefulText(story.visualVerb, 3) || weakVisualVerbs.has(String(story.visualVerb).trim().toLowerCase())) {
      fail(`${p}.story.visualVerb must be an action verb, not show/appear/display`);
    }

    const hero = scene?.hero ?? {};
    if (!usefulText(hero.semanticType, 3)) fail(`${p}.hero.semanticType missing`);
    if (!usefulText(hero.meaning, 10)) fail(`${p}.hero.meaning must explain what the hero communicates`);
    if (!(hero.screenAreaTarget >= 0.22 && hero.screenAreaTarget <= 0.85)) fail(`${p}.hero.screenAreaTarget must be 0.22-0.85`);
    if (!Array.isArray(hero.recognitionCues) || hero.recognitionCues.length < 2) {
      fail(`${p}.hero.recognitionCues needs at least 2 concrete recognition cues`);
    } else {
      const cueIds = new Set();
      for (const [cueIndex, cue] of hero.recognitionCues.entries()) {
        if (!usefulText(cueId(cue), 2)) fail(`${p}.hero.recognitionCues[${cueIndex}] needs an id`);
        if (!usefulText(cueDescription(cue), 6)) fail(`${p}.hero.recognitionCues[${cueIndex}] needs a concrete description`);
        const id = String(cueId(cue) ?? '').trim();
        if (id && cueIds.has(id)) fail(`${p}.hero.recognitionCues duplicate id: ${id}`);
        cueIds.add(id);
      }
    }
    if (scene?.archetype === 'device-scene' && /^(shape|box|rectangle|generic|abstract)$/i.test(String(hero.semanticType ?? '').trim())) {
      fail(`${p}.hero.semanticType is too abstract for device-scene`);
    }

    if (!(scene?.meaningfulStateChanges >= 3)) fail(`${p}.meaningfulStateChanges must be >= 3`);
    if (!(scene?.microBeats >= 2)) fail(`${p}.microBeats must be >= 2`);
    if (!['strong', 'medium', 'soft'].includes(scene?.contrast)) fail(`${p}.contrast must be strong, medium or soft`);

    const motion = scene?.motionPlan ?? {};
    if (!usefulText(motion.entry, 8)) fail(`${p}.motionPlan.entry missing`);
    if (!usefulText(motion.development, 8)) fail(`${p}.motionPlan.development missing`);
    if (!usefulText(motion.payoff, 8)) fail(`${p}.motionPlan.payoff missing`);
    if (!(motion.payoffAtProgress >= 0.55 && motion.payoffAtProgress <= 0.95)) fail(`${p}.motionPlan.payoffAtProgress must be 0.55-0.95`);
    const defaultMaxHold = Math.ceil(fps * 2.5);
    const extendedMaxHold = Math.ceil(fps * 3.5);
    if (!Number.isInteger(motion.maxStaticHoldFrames) || motion.maxStaticHoldFrames < 0) {
      fail(`${p}.motionPlan.maxStaticHoldFrames must be a non-negative integer`);
    } else if (motion.intentionalStillness === true) {
      if (!usefulText(motion.stillnessReason, 20)) fail(`${p}.motionPlan.stillnessReason required for intentionalStillness`);
      if (motion.maxStaticHoldFrames > extendedMaxHold) fail(`${p}.motionPlan.maxStaticHoldFrames exceeds ${extendedMaxHold} even with intentionalStillness`);
    } else if (motion.maxStaticHoldFrames > defaultMaxHold) {
      fail(`${p}.motionPlan.maxStaticHoldFrames must be <= ${defaultMaxHold} unless intentionalStillness is justified`);
    }
  }

  if (scenes.length > 0) {
    const first = scenes[0];
    if (first?.startFrame !== 0) fail('first scene must start at frame 0');
    if (hook.sceneId && first?.sceneId !== hook.sceneId) fail('hook.sceneId must match the first scene');
  }
  for (let i = 1; i < scenes.length; i += 1) {
    if (scenes[i - 1]?.archetype === scenes[i]?.archetype) fail(`consecutive scenes repeat archetype ${scenes[i]?.archetype}`);
  }
  const uniqueArchetypes = new Set(scenes.map((scene) => scene?.archetype)).size;
  if (scenes.length >= 4 && uniqueArchetypes < 4) fail('at least four different shot archetypes are required');
  if (scenes.filter((scene) => scene?.contrast === 'soft').length > Math.floor(scenes.length * 0.2)) {
    fail('too many soft/washed-out scenes — maximum 20%');
  }

  const scores = manifest.targetScores ?? {};
  for (const key of scoreKeys) if (!(scores[key] >= 8 && scores[key] <= 10)) fail(`targetScores.${key} must be 8-10`);

  return errors;
};
