import type {
  AnimationLibraryEntry,
  CreativeBrainState,
} from './schema';
import {
  planReelChoreography as planBaseChoreography,
  type PlannedAnimationSelection,
  type ReelChoreographyPlan,
  type ReelSceneBrief,
} from './contentMatchedPlanner';
import {enhanceSceneMeaning} from './extendedMeaningContract';
import {analyzeSceneMeaning} from './meaningContract';
import {
  findVisualDiversityWarnings,
  VISUAL_SIMILARITY_HARD_LIMIT,
  visualSimilarityScore,
} from './visualFingerprint';

const normalize = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');

const resolveStableMeaningContract = (
  scene: ReelSceneBrief,
): NonNullable<ReelSceneBrief['meaningContract']> => {
  if (!scene.meaningContract) {
    return enhanceSceneMeaning(scene.spokenText);
  }

  const automaticBase = analyzeSceneMeaning(scene.spokenText);
  const suppliedLooksAutomatic =
    JSON.stringify(scene.meaningContract) === JSON.stringify(automaticBase);

  return suppliedLooksAutomatic
    ? enhanceSceneMeaning(scene.spokenText, scene.meaningContract)
    : scene.meaningContract;
};

const isCardPrimaryVisual = (entry: AnimationLibraryEntry): boolean =>
  entry.layoutFamily.includes('card') ||
  entry.primitiveTags.filter((tag) => tag.includes('card')).length >= 2;

const hasGoalIncompatibleShortcut = ({
  scene,
  entry,
}: {
  scene: ReelSceneBrief;
  entry: AnimationLibraryEntry;
}): boolean => {
  const contract = resolveStableMeaningContract(scene);
  const corpus = normalize(
    [
      entry.title,
      entry.description,
      entry.visualFamily,
      entry.layoutFamily,
      entry.motionSignature,
      ...entry.semanticTags,
      ...entry.explanationPatterns,
      ...entry.primitiveTags,
    ].join(' '),
  );

  if (
    contract.communicationGoal !== 'rank' &&
    (corpus.includes('podium') ||
      corpus.includes('winner-badge') ||
      corpus.includes('medal'))
  ) {
    return true;
  }

  return false;
};

const selectionNeedsIsolation = ({
  scene,
  selection,
  entries,
  brain,
}: {
  scene: ReelSceneBrief;
  selection: PlannedAnimationSelection;
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
}): boolean => {
  if (!selection.animationId) return true;
  if (!selection.score) return true;
  if (selection.score.total < brain.globalRules.preferNewAnimationBelowScore) {
    return true;
  }
  if (selection.score.meaningCompatibility < 35) return true;
  if (selection.score.semanticFit < 42) return true;
  if (selection.score.avoidancePenalty > 0) return true;

  const entry = entries.find(
    (candidate) => candidate.animationId === selection.animationId,
  );
  return entry ? hasGoalIncompatibleShortcut({scene, entry}) : true;
};

const mergeProposalConstraints = ({
  selection,
  usedLayouts,
  usedMotions,
}: {
  selection: PlannedAnimationSelection;
  usedLayouts: ReadonlySet<string>;
  usedMotions: ReadonlySet<string>;
}): PlannedAnimationSelection => {
  if (!selection.newAnimationProposal) return selection;
  return {
    ...selection,
    newAnimationProposal: {
      ...selection.newAnimationProposal,
      forbiddenLayoutFamilies: [
        ...new Set([
          ...selection.newAnimationProposal.forbiddenLayoutFamilies,
          ...usedLayouts,
        ]),
      ],
      forbiddenMotionSignatures: [
        ...new Set([
          ...selection.newAnimationProposal.forbiddenMotionSignatures,
          ...usedMotions,
        ]),
      ],
    },
  };
};

const visualWarningsForContiguousRuns = (
  entries: readonly (AnimationLibraryEntry | null)[],
): string[] => {
  const warnings: string[] = [];
  let run: AnimationLibraryEntry[] = [];
  const flush = (): void => {
    if (run.length > 1) warnings.push(...findVisualDiversityWarnings(run));
    run = [];
  };

  for (const entry of entries) {
    if (entry) run.push(entry);
    else flush();
  }
  flush();
  return warnings;
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
}): ReelChoreographyPlan => {
  const enrichedScenes = scenes.map((scene) => ({
    ...scene,
    meaningContract: resolveStableMeaningContract(scene),
  }));
  const selections: PlannedAnimationSelection[] = [];
  const acceptedEntries: AnimationLibraryEntry[] = [];
  const selectedEntries: Array<AnimationLibraryEntry | null> = [];
  const usedAnimationIds = new Set<string>();
  const usedLayouts = new Set<string>();
  const usedMotions = new Set<string>();
  let cardPrimaryCount = 0;
  let previousWasNewBuild = false;

  const availableEntries = (): AnimationLibraryEntry[] => {
    const previous = previousWasNewBuild
      ? undefined
      : acceptedEntries[acceptedEntries.length - 1];
    const policyFiltered = entries.filter((entry) => {
      if (
        brain.globalRules.forbidDuplicateAnimationWithinReel &&
        usedAnimationIds.has(entry.animationId)
      ) {
        return false;
      }
      if (
        brain.globalRules.forbidConsecutiveLayoutFamily &&
        previous?.layoutFamily === entry.layoutFamily
      ) {
        return false;
      }
      if (
        isCardPrimaryVisual(entry) &&
        cardPrimaryCount >= brain.globalRules.maximumCardsAsPrimaryVisualPerReel
      ) {
        return false;
      }
      return true;
    });

    if (!previous || policyFiltered.length <= 1) return policyFiltered;
    const visuallyDistinct = policyFiltered.filter(
      (entry) =>
        visualSimilarityScore(previous, entry) < VISUAL_SIMILARITY_HARD_LIMIT,
    );

    return visuallyDistinct.length > 0 ? visuallyDistinct : policyFiltered;
  };

  const appendSelection = (
    scene: ReelSceneBrief,
    selection: PlannedAnimationSelection,
  ): void => {
    const constrained = mergeProposalConstraints({
      selection,
      usedLayouts,
      usedMotions,
    });
    selections.push(constrained);

    if (!constrained.animationId) {
      selectedEntries.push(null);
      previousWasNewBuild = true;
      return;
    }
    const entry = entries.find(
      (candidate) => candidate.animationId === constrained.animationId,
    );
    if (!entry) {
      throw new Error(
        `stable planner could not resolve ${constrained.animationId} for ${scene.sceneId}`,
      );
    }
    acceptedEntries.push(entry);
    selectedEntries.push(entry);
    previousWasNewBuild = false;
    usedAnimationIds.add(entry.animationId);
    usedLayouts.add(entry.layoutFamily);
    usedMotions.add(entry.motionSignature);
    if (isCardPrimaryVisual(entry)) cardPrimaryCount += 1;
  };

  const planSafeSingleScene = (
    scene: ReelSceneBrief,
  ): PlannedAnimationSelection => {
    let candidates = availableEntries();
    const rejectedIds = new Set<string>();

    while (true) {
      const result = planBaseChoreography({
        reelId: `${reelId}-scene-${scene.sceneId}`,
        reelIndex,
        scenes: [scene],
        entries: candidates,
        brain,
        beamWidth,
        candidateLimit,
      });
      const selection = result.selections[0];
      if (!selection) {
        throw new Error(`stable planner produced no selection for ${scene.sceneId}`);
      }
      if (
        !selection.animationId ||
        !selectionNeedsIsolation({scene, selection, entries, brain})
      ) {
        return selection;
      }

      rejectedIds.add(selection.animationId);
      candidates = candidates.filter(
        (entry) => !rejectedIds.has(entry.animationId),
      );
    }
  };

  const processSegment = (segment: readonly ReelSceneBrief[]): void => {
    if (segment.length === 0) return;

    const result = planBaseChoreography({
      reelId: `${reelId}-segment-${selections.length}`,
      reelIndex,
      scenes: segment,
      entries: availableEntries(),
      brain,
      beamWidth,
      candidateLimit,
    });

    const firstUnsafeIndex = result.selections.findIndex((selection, index) =>
      selectionNeedsIsolation({
        scene: segment[index],
        selection,
        entries,
        brain,
      }),
    );

    if (firstUnsafeIndex === -1) {
      result.selections.forEach((selection, index) =>
        appendSelection(segment[index], selection),
      );
      return;
    }

    if (firstUnsafeIndex > 0) {
      processSegment(segment.slice(0, firstUnsafeIndex));
    }

    const isolatedScene = segment[firstUnsafeIndex];
    appendSelection(isolatedScene, planSafeSingleScene(isolatedScene));
    processSegment(segment.slice(firstUnsafeIndex + 1));
  };

  processSegment(enrichedScenes);

  const visualFamilies = selections.map((selection) => {
    if (selection.newAnimationProposal) {
      return selection.newAnimationProposal.suggestedVisualFamily;
    }
    const entry = selection.animationId
      ? entries.find((candidate) => candidate.animationId === selection.animationId)
      : undefined;
    return entry?.visualFamily ?? 'custom-explanation';
  });
  const layoutFamilies = acceptedEntries.map((entry) => entry.layoutFamily);
  const motionSignatures = acceptedEntries.map((entry) => entry.motionSignature);
  const warnings: string[] = visualWarningsForContiguousRuns(selectedEntries);
  const uniqueVisualFamilies = new Set(visualFamilies);

  if (
    uniqueVisualFamilies.size <
    Math.min(scenes.length, brain.globalRules.minimumVisualFamiliesPerReel)
  ) {
    warnings.push(
      `only ${uniqueVisualFamilies.size} visual families were selected`,
    );
  }
  if (selections.some((selection) => selection.animationId === null)) {
    warnings.push(
      'one or more scenes require a content-specific animation before production',
    );
  }
  for (const selection of selections) {
    if (
      selection.animationId &&
      selection.score &&
      selection.score.meaningCompatibility < 55
    ) {
      warnings.push(
        `scene ${selection.sceneId} has weak spoken-meaning compatibility`,
      );
    }
  }

  return {
    reelId,
    reelIndex,
    selections,
    visualFamilies,
    layoutFamilies,
    motionSignatures,
    newAnimationCount: selections.filter(
      (selection) => selection.newAnimationProposal !== null,
    ).length,
    warnings: [...new Set(warnings)],
  };
};
