import type {AnimationLibraryEntry, CreativeBrainState} from './schema';
import {enhanceSceneMeaning} from './extendedMeaningContract';
import {CANONICAL_PRODUCTION_ANIMATION_ENTRIES} from './productionCatalog';
import {
  planProductionReelAnimations,
  type ProductionReelAnimationPlan,
} from './productionPlanner';
import {
  analyzeScenesForAnimation,
  type AnimationFamilyName,
  type SceneAnimationAnalysis,
} from './sceneAnalyzer';
import type {SceneMeaningContract} from './meaningContract';

export type RawReelSceneInput = {
  sceneId: string;
  spokenText: string;
  forceNewAnimation?: boolean;
};

export type RawReelAnimationPlan = {
  reelId: string;
  reelIndex: number;
  analyses: SceneAnimationAnalysis[];
  productionPlan: ProductionReelAnimationPlan;
  decisionSummary: {
    sceneId: string;
    primaryFamily: string;
    selectedAnimationId: string;
    source: 'library' | 'new-build';
    familyScore: number;
    selectionScore: number | null;
    mustBeNew: boolean;
  }[];
};

const unique = <T,>(values: readonly T[]): T[] => [...new Set(values)];

const normalizeDirectionText = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isCostIncreaseStatement = (spokenText: string): boolean => {
  const text = normalizeDirectionText(spokenText);
  const hasCostSubject = /\b(?:kosten?|preis|budget|cent|euro|dollar|credits?|tokenkosten)\b/.test(text);
  const hasIncrease = /\b(?:steig\w*|hoeher\w*|teurer\w*|erhoeh\w*|zunehm\w*|mehr\s+kosten)\b/.test(text);
  const hasReduction = /\b(?:spar\w*|senk\w*|weniger|guenstig\w*|reduzier\w*|verringer\w*|halbier\w*|einspar\w*|billig\w*|nur\s+noch)\b/.test(text);
  return hasCostSubject && hasIncrease && !hasReduction;
};

const normalizeDirectionalMeaning = (
  spokenText: string,
  meaningContract: SceneMeaningContract,
): SceneMeaningContract => {
  if (!isCostIncreaseStatement(spokenText)) return meaningContract;

  return {
    ...meaningContract,
    communicationGoal: 'show-result',
    startState:
      'the earlier cost is visible on a shared labeled baseline before the stated change',
    visibleChange:
      'the same cost measure rises to the stated higher value without implying savings',
    endState:
      'the higher resulting cost remains visible on the same scale as the earlier baseline',
    preferredVisualFamilies: unique([
      'comparison',
      ...meaningContract.preferredVisualFamilies.filter(
        (family) => family !== 'cost-efficiency',
      ),
    ]).slice(0, 5),
    preferredExplanationPatterns: unique([
      'cost-increase',
      'before-after-comparison',
      ...meaningContract.preferredExplanationPatterns.filter(
        (pattern) =>
          !['cost-optimization', 'efficiency'].includes(pattern),
      ),
    ]).slice(0, 8),
    requiredVisualCues: unique([
      'cost-baseline',
      'visible-increase',
      'higher-cost-result',
      ...meaningContract.requiredVisualCues.filter(
        (cue) => !['visible-reduction', 'savings-result'].includes(cue),
      ),
    ]).slice(0, 12),
    forbiddenVisualCues: unique([
      ...meaningContract.forbiddenVisualCues,
      'visible-reduction',
      'savings-result',
    ]),
  };
};

const synchronizeEnhancedAnalysis = (
  analysis: SceneAnimationAnalysis,
): SceneAnimationAnalysis => {
  const meaningContract = normalizeDirectionalMeaning(
    analysis.spokenText,
    enhanceSceneMeaning(
      analysis.spokenText,
      analysis.meaningContract,
    ),
  );
  const validFamilies = new Set(
    analysis.familyScores.map((score) => score.visualFamily),
  );
  const directionalForbiddenFamilies = new Set<AnimationFamilyName>(
    isCostIncreaseStatement(analysis.spokenText)
      ? ['cost-efficiency']
      : [],
  );
  const directFamilies = analysis.preferredVisualFamilies.filter(
    (family) => !directionalForbiddenFamilies.has(family),
  );
  const meaningFamilies = meaningContract.preferredVisualFamilies.filter(
    (family): family is AnimationFamilyName =>
      validFamilies.has(family as AnimationFamilyName) &&
      !directionalForbiddenFamilies.has(family as AnimationFamilyName),
  );
  // A generic comparison cue (for example “unterschiedlicher Stärke”) must not
  // outrank a stronger domain meaning such as Attention/relationships when the
  // communication goal itself is not a comparison.
  const meaningShouldLead =
    directFamilies[0] === 'comparison' &&
    meaningFamilies[0] !== undefined &&
    meaningFamilies[0] !== 'comparison' &&
    meaningContract.communicationGoal !== 'compare';
  const preferredVisualFamilies = unique(
    meaningShouldLead
      ? [...meaningFamilies, ...directFamilies]
      : [...directFamilies, ...meaningFamilies],
  ).slice(0, 3);
  const semanticTags = unique([
    ...analysis.semanticTags,
    ...meaningContract.subjectTerms,
    ...meaningContract.actionTerms,
    ...meaningContract.resultTerms,
  ]).slice(0, 16);
  const explanationPatterns = unique([
    ...meaningContract.preferredExplanationPatterns,
    ...(analysis.brief.explanationPatterns ?? []),
  ]).slice(0, 10);
  const forbiddenVisualFamilies = unique([
    ...analysis.forbiddenVisualFamilies.filter(
      (family) => !preferredVisualFamilies.includes(family),
    ),
    ...directionalForbiddenFamilies,
  ]);

  return {
    ...analysis,
    semanticTags,
    meaningContract,
    preferredVisualFamilies,
    forbiddenVisualFamilies,
    brief: {
      ...analysis.brief,
      semanticTags,
      explanationPatterns,
      preferredVisualFamilies,
      forbiddenVisualFamilies,
      meaningContract,
    },
  };
};

export const planReelAnimationsFromText = ({
  reelId,
  reelIndex,
  scenes,
  entries = CANONICAL_PRODUCTION_ANIMATION_ENTRIES,
  brain,
  maximumNewAnimationRatio = 0.75,
}: {
  reelId: string;
  reelIndex: number;
  scenes: readonly RawReelSceneInput[];
  entries?: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  maximumNewAnimationRatio?: number;
}): RawReelAnimationPlan => {
  if (!reelId.trim()) throw new Error('reel planning pipeline requires reelId');
  if (!Number.isInteger(reelIndex) || reelIndex < 0) {
    throw new Error('reel planning pipeline requires a non-negative reelIndex');
  }
  const sceneIds = new Set<string>();
  for (const scene of scenes) {
    if (sceneIds.has(scene.sceneId)) {
      throw new Error(`duplicate sceneId in raw reel input: ${scene.sceneId}`);
    }
    sceneIds.add(scene.sceneId);
  }

  const analyses = analyzeScenesForAnimation(scenes).map(
    synchronizeEnhancedAnalysis,
  );
  const productionPlan = planProductionReelAnimations({
    reelId,
    reelIndex,
    scenes: analyses.map((analysis) => analysis.brief),
    entries,
    brain,
    maximumNewAnimationRatio,
  });

  const decisionSummary = productionPlan.scenes.map((scenePlan, index) => {
    const analysis = analyses[index];
    const primaryFamily = analysis.preferredVisualFamilies[0];
    const primaryFamilyScore = analysis.familyScores.find(
      (score) => score.visualFamily === primaryFamily,
    );
    return {
      sceneId: scenePlan.sceneId,
      primaryFamily,
      selectedAnimationId: scenePlan.animationId,
      source: scenePlan.source,
      familyScore: primaryFamilyScore?.score ?? 0,
      selectionScore: scenePlan.selectionScore,
      mustBeNew: analysis.mustBeNew,
    };
  });

  return {
    reelId,
    reelIndex,
    analyses,
    productionPlan,
    decisionSummary,
  };
};
