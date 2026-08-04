import type {AnimationLibraryEntry, CreativeBrainState} from './schema';
import {
  planProductionReelAnimations,
  type ProductionReelAnimationPlan,
} from './productionPlanner';
import {
  analyzeScenesForAnimation,
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

  const analyses = analyzeScenesForAnimation(scenes);
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
    return {
      sceneId: scenePlan.sceneId,
      primaryFamily: analysis.preferredVisualFamilies[0],
      selectedAnimationId: scenePlan.animationId,
      source: scenePlan.source,
      familyScore: analysis.familyScores[0]?.score ?? 0,
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
