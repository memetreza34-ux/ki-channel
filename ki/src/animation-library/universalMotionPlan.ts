import {completeImportantWordCoverage} from './importantWordCoverage';
import {enhanceSceneMeaning} from './extendedMeaningContract';
import {
  analyzeSceneMeaning,
  type SceneMeaningContract,
} from './meaningContract';
import type {
  SemanticMotionBeat,
  SentenceMotionCoveragePlan,
} from './semanticBeatPlanner';

export type UniversalSceneMotionInput = {
  sceneId: string;
  spokenText: string;
  durationInFrames: number;
  animationId: string;
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
  transitionInTags?: readonly string[];
  transitionOutTags?: readonly string[];
  meaningContract?: SceneMeaningContract;
};

export type UniversalSceneLayerPlan = {
  layerId:
    | 'headline'
    | 'main-semantic-animation'
    | 'kinetic-subtitles'
    | 'semantic-micro-motions'
    | 'annotations'
    | 'sound-design'
    | 'transition';
  required: boolean;
  purpose: string;
};

export type UniversalTransitionPlan = {
  fromSceneId: string;
  toSceneId: string;
  mechanismId:
    | 'transition-object-carry'
    | 'transition-shape-match'
    | 'transition-hard-cut-impact';
  reason: string;
  maximumDurationFrames: number;
};

export type UniversalSceneMotionPlan = {
  sceneId: string;
  spokenText: string;
  animationId: string;
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
  meaningContract: SceneMeaningContract;
  durationInFrames: number;
  headlineMotionId: 'keyword-rise-lock';
  subtitleMode: 'word-by-word-with-semantic-emphasis';
  sentenceCoverage: SentenceMotionCoveragePlan;
  importantWordBeats: SemanticMotionBeat[];
  soundCues: Array<{
    atFrame: number;
    cue: Exclude<SemanticMotionBeat['soundCue'], 'none'>;
    beatId: string;
  }>;
  layers: UniversalSceneLayerPlan[];
  transitionOut: UniversalTransitionPlan | null;
  maximumSimultaneousStrongMotions: 3;
  stableStartHoldFrames: number;
  stableEndHoldFrames: number;
  valid: boolean;
  warnings: string[];
};

export type UniversalReelMotionPlan = {
  reelId: string;
  sceneCount: number;
  scenes: UniversalSceneMotionPlan[];
  uniqueFullAnimationCount: number;
  uniqueVisualFamilyCount: number;
  importantWordCount: number;
  animatedImportantWordCount: number;
  importantWordCoverage: number;
  sentenceCoverage: number;
  microMotionMechanismCount: number;
  everythingAnimatedAsFarAsUseful: boolean;
  blockers: string[];
  warnings: string[];
};

const REQUIRED_LAYERS: readonly UniversalSceneLayerPlan[] = [
  {layerId:'headline',required:true,purpose:'Give every scene a stable orientation and one concise promise.'},
  {layerId:'main-semantic-animation',required:true,purpose:'Explain the full sentence through one dominant visual mechanism.'},
  {layerId:'kinetic-subtitles',required:true,purpose:'Reveal every spoken word while emphasizing only semantically important words.'},
  {layerId:'semantic-micro-motions',required:true,purpose:'Synchronize important words with visible state changes.'},
  {layerId:'annotations',required:false,purpose:'Add callouts, connectors, measurements, or source markers only when they clarify meaning.'},
  {layerId:'sound-design',required:true,purpose:'Support visible actions with restrained synchronized sound cues.'},
  {layerId:'transition',required:true,purpose:'Connect scenes through meaning, shape, object, direction, or a deliberate hard cut.'},
] as const;

const resolveMeaningContract = (
  scene: UniversalSceneMotionInput,
): SceneMeaningContract => {
  if (!scene.meaningContract) {
    return enhanceSceneMeaning(scene.spokenText);
  }
  const automaticBase = analyzeSceneMeaning(scene.spokenText);
  return JSON.stringify(scene.meaningContract) === JSON.stringify(automaticBase)
    ? enhanceSceneMeaning(scene.spokenText, scene.meaningContract)
    : scene.meaningContract;
};

const chooseTransition = (
  current: UniversalSceneMotionInput,
  next: UniversalSceneMotionInput,
): UniversalTransitionPlan => {
  const outgoing = new Set(current.transitionOutTags ?? []);
  const incoming = new Set(next.transitionInTags ?? []);
  const sharedTag = [...outgoing].find((tag) => incoming.has(tag));
  if (sharedTag) {
    return {
      fromSceneId: current.sceneId,
      toSceneId: next.sceneId,
      mechanismId: 'transition-object-carry',
      reason: `Both scenes share the transition object or state ${sharedTag}.`,
      maximumDurationFrames: 18,
    };
  }
  if (
    current.visualFamily === next.visualFamily ||
    current.layoutFamily.includes('split') ||
    next.layoutFamily.includes('split') ||
    current.layoutFamily.includes('layer') ||
    next.layoutFamily.includes('layer')
  ) {
    return {
      fromSceneId: current.sceneId,
      toSceneId: next.sceneId,
      mechanismId: 'transition-shape-match',
      reason: 'A shared layout shape can transform into the next explanatory state.',
      maximumDurationFrames: 18,
    };
  }
  return {
    fromSceneId: current.sceneId,
    toSceneId: next.sceneId,
    mechanismId: 'transition-hard-cut-impact',
    reason: 'No semantic object should be forced across the cut; use a controlled editorial hard cut.',
    maximumDurationFrames: 8,
  };
};

const countValues = (values: readonly string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
};

export const createUniversalReelMotionPlan = ({
  reelId,
  scenes,
}: {
  reelId: string;
  scenes: readonly UniversalSceneMotionInput[];
}): UniversalReelMotionPlan => {
  if (!reelId.trim()) throw new Error('universal motion plan requires reelId');
  if (scenes.length === 0) throw new Error('universal motion plan requires scenes');
  const sceneIds = new Set<string>();
  const recentMechanismIds: string[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];

  const plannedScenes = scenes.map((scene, index) => {
    if (!scene.sceneId.trim()) throw new Error('every universal motion scene needs a sceneId');
    if (sceneIds.has(scene.sceneId)) throw new Error(`duplicate sceneId: ${scene.sceneId}`);
    sceneIds.add(scene.sceneId);
    if (!scene.animationId.trim()) blockers.push(`scene ${scene.sceneId} has no full animation`);

    const meaningContract = resolveMeaningContract(scene);
    const semanticPayloadComplete =
      Boolean(meaningContract.startState.trim()) &&
      Boolean(meaningContract.visibleChange.trim()) &&
      Boolean(meaningContract.endState.trim()) &&
      meaningContract.requiredVisualCues.length > 0;
    if (!semanticPayloadComplete) {
      blockers.push(`scene ${scene.sceneId} has an incomplete meaning contract`);
    }

    const sentenceCoverage = completeImportantWordCoverage({
      sceneId: scene.sceneId,
      spokenText: scene.spokenText,
      durationInFrames: scene.durationInFrames,
      recentMechanismIds,
    });
    recentMechanismIds.push(
      ...sentenceCoverage.beats.map((beat) => beat.mechanismId),
    );
    const importantWordBeats = sentenceCoverage.beats.filter((beat) => beat.critical);
    const soundCues = sentenceCoverage.beats
      .filter((beat) => beat.soundCue !== 'none')
      .map((beat) => ({
        atFrame: beat.atFrame,
        cue: beat.soundCue as Exclude<SemanticMotionBeat['soundCue'], 'none'>,
        beatId: beat.beatId,
      }));
    const sceneWarnings = [...sentenceCoverage.warnings];
    if (sentenceCoverage.importantBeatCoverage < 1) {
      blockers.push(`scene ${scene.sceneId} does not animate every important word`);
    }
    if (sentenceCoverage.strongMotionCount > 3) {
      blockers.push(`scene ${scene.sceneId} exceeds the strong-motion budget`);
    }
    if (soundCues.length > 8) {
      sceneWarnings.push(`${soundCues.length} sound cues may overload the scene`);
    }
    if (meaningContract.subjectTerms.length === 0) {
      sceneWarnings.push('meaning contract has no labeled subject terms');
    }
    if (meaningContract.actionTerms.length === 0) {
      sceneWarnings.push('meaning contract has no explicit action term; use the visible-change sentence as the motion trigger');
    }
    const transitionOut = index < scenes.length - 1
      ? chooseTransition(scene, scenes[index + 1])
      : null;
    const valid =
      Boolean(scene.animationId.trim()) &&
      semanticPayloadComplete &&
      sentenceCoverage.importantBeatCoverage === 1 &&
      sentenceCoverage.strongMotionCount <= 3;

    return {
      sceneId: scene.sceneId,
      spokenText: scene.spokenText,
      animationId: scene.animationId,
      visualFamily: scene.visualFamily,
      layoutFamily: scene.layoutFamily,
      motionSignature: scene.motionSignature,
      meaningContract,
      durationInFrames: scene.durationInFrames,
      headlineMotionId: 'keyword-rise-lock' as const,
      subtitleMode: 'word-by-word-with-semantic-emphasis' as const,
      sentenceCoverage,
      importantWordBeats,
      soundCues,
      layers: REQUIRED_LAYERS.map((layer) => ({...layer})),
      transitionOut,
      maximumSimultaneousStrongMotions: 3 as const,
      stableStartHoldFrames: sentenceCoverage.startHoldFrames,
      stableEndHoldFrames: sentenceCoverage.endHoldFrames,
      valid,
      warnings: [...new Set(sceneWarnings)],
    } satisfies UniversalSceneMotionPlan;
  });

  const animationCounts = countValues(plannedScenes.map((scene) => scene.animationId));
  for (const [animationId, count] of animationCounts) {
    if (count > 1) blockers.push(`full animation ${animationId} is used ${count} times`);
  }
  for (let index = 1; index < plannedScenes.length; index += 1) {
    const previous = plannedScenes[index - 1];
    const current = plannedScenes[index];
    if (previous.layoutFamily === current.layoutFamily) {
      blockers.push(`scenes ${previous.sceneId} and ${current.sceneId} repeat layout ${current.layoutFamily}`);
    }
    if (previous.motionSignature === current.motionSignature) {
      blockers.push(`scenes ${previous.sceneId} and ${current.sceneId} repeat motion ${current.motionSignature}`);
    }
    if (previous.visualFamily === current.visualFamily) {
      warnings.push(`scenes ${previous.sceneId} and ${current.sceneId} repeat visual family ${current.visualFamily}`);
    }
  }

  const mechanismCounts = countValues(
    plannedScenes.flatMap((scene) =>
      scene.sentenceCoverage.beats.map((beat) => beat.mechanismId),
    ),
  );
  const totalMechanisms = [...mechanismCounts.values()].reduce((sum, count) => sum + count, 0);
  for (const [mechanismId, count] of mechanismCounts) {
    const share = totalMechanisms === 0 ? 0 : count / totalMechanisms;
    if (count >= 4 && share > 0.22) {
      warnings.push(`micro-motion ${mechanismId} represents ${Math.round(share * 100)}% of all word beats`);
    }
  }

  const importantWordCount = plannedScenes.reduce(
    (sum, scene) => sum + scene.sentenceCoverage.criticalBeatCount,
    0,
  );
  const animatedImportantWordCount = plannedScenes.reduce(
    (sum, scene) => sum + scene.sentenceCoverage.coveredCriticalBeatCount,
    0,
  );
  const importantWordCoverage = importantWordCount === 0
    ? 1
    : animatedImportantWordCount / importantWordCount;
  const validSentenceCount = plannedScenes.filter(
    (scene) => Boolean(scene.animationId.trim()) && scene.valid,
  ).length;
  const sentenceCoverage = validSentenceCount / plannedScenes.length;
  const uniqueVisualFamilyCount = new Set(
    plannedScenes.map((scene) => scene.visualFamily),
  ).size;
  const minimumFamilies = Math.min(4, plannedScenes.length);
  if (uniqueVisualFamilyCount < minimumFamilies) {
    blockers.push(`reel uses only ${uniqueVisualFamilyCount}/${minimumFamilies} required visual families`);
  }

  return {
    reelId,
    sceneCount: plannedScenes.length,
    scenes: plannedScenes,
    uniqueFullAnimationCount: animationCounts.size,
    uniqueVisualFamilyCount,
    importantWordCount,
    animatedImportantWordCount,
    importantWordCoverage,
    sentenceCoverage,
    microMotionMechanismCount: mechanismCounts.size,
    everythingAnimatedAsFarAsUseful:
      blockers.length === 0 &&
      importantWordCoverage === 1 &&
      sentenceCoverage === 1,
    blockers: [...new Set(blockers)],
    warnings: [...new Set(warnings)],
  };
};
