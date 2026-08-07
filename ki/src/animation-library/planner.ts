import type {
  AnimationLibraryEntry,
  CreativeBrainState,
} from './schema';
import {
  enhanceSceneMeaning,
} from './extendedMeaningContract';
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
      meaningContract: enhanceSceneMeaning(
        scene.spokenText,
        scene.meaningContract,
      ),
    })),
    entries,
    brain,
    beamWidth,
    candidateLimit,
  });
