import type {AnimationLibraryEntry, CreativeBrainState} from './schema';
import {
  planReelChoreography,
  type ReelChoreographyPlan,
  type ReelSceneBrief,
} from './planner';
import {
  compileNewAnimationProposal,
  createCatalogEntryFromBuildSpec,
  type AnimationBuildSpec,
} from './proposalCompiler';

export type ProductionSceneAnimationPlan = {
  sceneId: string;
  source: 'library' | 'new-build';
  animationId: string;
  catalogEntry: AnimationLibraryEntry;
  buildSpec: AnimationBuildSpec | null;
  selectionScore: number | null;
  selectionReasons: string[];
};

export type ProductionReelAnimationPlan = {
  reelId: string;
  reelIndex: number;
  choreography: ReelChoreographyPlan;
  scenes: ProductionSceneAnimationPlan[];
  newAnimationCount: number;
  reusedAnimationCount: number;
  visualFamilies: string[];
  layoutFamilies: string[];
  motionSignatures: string[];
  qualityWarnings: string[];
  readyForImplementation: boolean;
};

const getEntry = (
  entries: readonly AnimationLibraryEntry[],
  animationId: string,
): AnimationLibraryEntry => {
  const entry = entries.find((candidate) => candidate.animationId === animationId);
  if (!entry) {
    throw new Error(`planned animation is missing from catalog: ${animationId}`);
  }
  return entry;
};

const createBuildDescription = (
  scene: ReelSceneBrief,
  spec: AnimationBuildSpec,
): string =>
  `A purpose-built ${spec.visualFamily} animation for scene ${scene.sceneId}. ` +
  `It visualizes ${scene.semanticTags.join(', ')} through ${spec.layoutFamily} ` +
  `and the motion signature ${spec.motionSignature}.`;

export const planProductionReelAnimations = ({
  reelId,
  reelIndex,
  scenes,
  entries,
  brain,
  maximumNewAnimationRatio = 0.75,
}: {
  reelId: string;
  reelIndex: number;
  scenes: readonly ReelSceneBrief[];
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  maximumNewAnimationRatio?: number;
}): ProductionReelAnimationPlan => {
  if (scenes.length === 0 || scenes.length > 100) {
    throw new Error('production reel planning requires between 1 and 100 scenes');
  }
  if (
    !Number.isFinite(maximumNewAnimationRatio) ||
    maximumNewAnimationRatio < 0 ||
    maximumNewAnimationRatio > 1
  ) {
    throw new Error('maximumNewAnimationRatio must be between 0 and 1');
  }

  const choreography = planReelChoreography({
    reelId,
    reelIndex,
    scenes,
    entries,
    brain,
  });

  const scenePlans: ProductionSceneAnimationPlan[] = choreography.selections.map(
    (selection, index) => {
      const scene = scenes[index];
      if (selection.animationId) {
        const entry = getEntry(entries, selection.animationId);
        return {
          sceneId: scene.sceneId,
          source: 'library' as const,
          animationId: entry.animationId,
          catalogEntry: entry,
          buildSpec: null,
          selectionScore: selection.score?.total ?? null,
          selectionReasons: selection.reasons,
        };
      }

      if (!selection.newAnimationProposal) {
        throw new Error(
          `scene ${scene.sceneId} has neither a library animation nor a build proposal`,
        );
      }

      const buildSpec = compileNewAnimationProposal({
        proposal: selection.newAnimationProposal,
      });
      const catalogEntry = createCatalogEntryFromBuildSpec({
        spec: buildSpec,
        description: createBuildDescription(scene, buildSpec),
      });
      return {
        sceneId: scene.sceneId,
        source: 'new-build' as const,
        animationId: buildSpec.animationId,
        catalogEntry,
        buildSpec,
        selectionScore: selection.score?.total ?? null,
        selectionReasons: selection.reasons,
      };
    },
  );

  const newAnimationCount = scenePlans.filter(
    (scene) => scene.source === 'new-build',
  ).length;
  const reusedAnimationCount = scenePlans.length - newAnimationCount;
  const visualFamilies = scenePlans.map(
    (scene) => scene.catalogEntry.visualFamily,
  );
  const layoutFamilies = scenePlans.map(
    (scene) => scene.catalogEntry.layoutFamily,
  );
  const motionSignatures = scenePlans.map(
    (scene) => scene.catalogEntry.motionSignature,
  );
  const qualityWarnings = [...choreography.warnings];

  const allowedNewAnimations = Math.ceil(
    scenes.length * maximumNewAnimationRatio,
  );
  const explicitlyNewScenes = scenes.filter((scene) => scene.mustBeNew).length;
  if (
    newAnimationCount > Math.max(allowedNewAnimations, explicitlyNewScenes)
  ) {
    qualityWarnings.push(
      `${newAnimationCount} new animations exceed the configured production ratio`,
    );
  }

  const duplicateAnimationCount =
    scenePlans.length - new Set(scenePlans.map((scene) => scene.animationId)).size;
  if (duplicateAnimationCount > 0) {
    qualityWarnings.push(
      `${duplicateAnimationCount} duplicate full animation selections remain`,
    );
  }

  for (let index = 1; index < scenePlans.length; index += 1) {
    if (
      scenePlans[index - 1].catalogEntry.layoutFamily ===
      scenePlans[index].catalogEntry.layoutFamily
    ) {
      qualityWarnings.push(
        `scenes ${scenePlans[index - 1].sceneId} and ${scenePlans[index].sceneId} repeat the same layout family`,
      );
    }
  }

  const distinctFamilies = new Set(visualFamilies).size;
  const requiredFamilies = Math.min(
    scenes.length,
    brain.globalRules.minimumVisualFamiliesPerReel,
  );
  if (distinctFamilies < requiredFamilies) {
    qualityWarnings.push(
      `only ${distinctFamilies}/${requiredFamilies} required visual families are present`,
    );
  }

  return {
    reelId,
    reelIndex,
    choreography,
    scenes: scenePlans,
    newAnimationCount,
    reusedAnimationCount,
    visualFamilies,
    layoutFamilies,
    motionSignatures,
    qualityWarnings: [...new Set(qualityWarnings)],
    readyForImplementation: qualityWarnings.length === 0,
  };
};
