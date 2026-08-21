import type {AnimationLibraryEntry, CreativeBrainState} from './schema';
import {enhanceSceneMeaning} from './extendedMeaningContract';
import {
  planProductionReelAnimations,
  type ProductionReelAnimationPlan,
} from './productionPlanner';
import {
  analyzeScenesForAnimation,
  type AnimationFamilyName,
  type SceneAnimationAnalysis,
} from './sceneAnalyzer';

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

const synchronizeEnhancedAnalysis = (
  analysis: SceneAnimationAnalysis,
): SceneAnimationAnalysis => {
  const meaningContract = enhanceSceneMeaning(
    analysis.spokenText,
    analysis.meaningContract,
  );
  const validFamilies = new Set(
    analysis.familyScores.map((score) => score.visualFamily),
  );
  const preferredVisualFamilies = unique([
    ...analysis.preferredVisualFamilies,
    ...meaningContract.preferredVisualFamilies.filter(
      (family): family is AnimationFamilyName =>
        validFamilies.has(family as AnimationFamilyName),
    ),
  ]).slice(0, 3);
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
  const forbiddenVisualFamilies = analysis.forbiddenVisualFamilies.filter(
    (family) => !preferredVisualFamilies.includes(family),
  );

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
  entries,
  brain,
  maximumNewAnimationRatio = 0.75,
}: {
  reelId: string;
  reelIndex: number;
  scenes: readonly RawReelSceneInput[];
  entries: readonly AnimationLibraryEntry[];
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
