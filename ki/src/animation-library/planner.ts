import type {
  AnimationLibraryEntry,
  CreativeBrainState,
} from './schema';
import {enhanceSceneMeaning} from './extendedMeaningContract';
import {analyzeSceneMeaning} from './meaningContract';
import {
  planReelChoreography as planStableChoreography,
} from './stableContentMatchedPlanner';
import type {
  AnimationScoreBreakdown,
  NewAnimationProposal,
  PlannedAnimationSelection,
  ReelChoreographyPlan,
  ReelSceneBrief,
} from './contentMatchedPlanner';

export type {
  AnimationScoreBreakdown,
  NewAnimationProposal,
  PlannedAnimationSelection,
  ReelChoreographyPlan,
  ReelSceneBrief,
} from './contentMatchedPlanner';

const resolvePlannerMeaningContract = (
  scene: ReelSceneBrief,
): ReelSceneBrief['meaningContract'] => {
  if (!scene.meaningContract) {
    const enhanced = enhanceSceneMeaning(scene.spokenText);
    return scene.preferredVisualFamilies?.length
      ? {
          ...enhanced,
          preferredVisualFamilies: [
            ...new Set([
              ...scene.preferredVisualFamilies,
              ...enhanced.preferredVisualFamilies,
            ]),
          ],
        }
      : enhanced;
  }

  const automaticallyGeneratedBase = analyzeSceneMeaning(scene.spokenText);
  const suppliedLooksAutomatic =
    JSON.stringify(scene.meaningContract) ===
    JSON.stringify(automaticallyGeneratedBase);

  return suppliedLooksAutomatic
    ? enhanceSceneMeaning(scene.spokenText, scene.meaningContract)
    : scene.meaningContract;
};

export const planReelChoreography = ({
  reelId,
  reelIndex,
  scenes,
  entries,
  brain,
  beamWidth = 12,
  candidateLimit = 10,
}: {
  reelId: string;
  reelIndex: number;
  scenes: readonly ReelSceneBrief[];
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  beamWidth?: number;
  candidateLimit?: number;
}): ReelChoreographyPlan =>
  planStableChoreography({
    reelId,
    reelIndex,
    scenes: scenes.map((scene) => ({
      ...scene,
      meaningContract: resolvePlannerMeaningContract(scene),
    })),
    entries,
    brain,
    beamWidth,
    candidateLimit,
  });
