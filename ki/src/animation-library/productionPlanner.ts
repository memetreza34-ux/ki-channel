import type {AnimationLibraryEntry, CreativeBrainState} from './schema';
import {
  areProductionRuntimeScenesReady,
  getProductionReadyLibraryEntries,
  PRODUCTION_READY_LIBRARY_ANIMATION_IDS,
} from './productionEligibility';
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
): string => {
  const contract = spec.contentContract ?? scene.meaningContract;
  if (!contract) {
    return `A purpose-built ${spec.visualFamily} animation for scene ${scene.sceneId}. ` +
      `It visualizes ${scene.semanticTags.join(', ')} through ${spec.layoutFamily} ` +
      `and the motion signature ${spec.motionSignature}.`;
  }
  return `A purpose-built ${spec.visualFamily} animation for the exact sentence “${scene.spokenText}”. ` +
    `It begins with ${contract.startState}, visibly shows ${contract.visibleChange}, ` +
    `and resolves with ${contract.endState}. The required visual cues are ` +
    `${contract.requiredVisualCues.join(', ')}.`;
};

const slugifyIdSegment = (value: string): string =>
  value
    .toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);

const reserveUniqueBuildSpec = ({
  spec,
  reservedAnimationIds,
  reelId,
  sceneId,
}: {
  spec: AnimationBuildSpec;
  reservedAnimationIds: Set<string>;
  reelId: string;
  sceneId: string;
}): AnimationBuildSpec => {
  if (!reservedAnimationIds.has(spec.animationId)) {
    reservedAnimationIds.add(spec.animationId);
    return spec;
  }

  const versionMatch = /-v(\d+)$/.exec(spec.animationId);
  const version = versionMatch?.[1] ?? '1';
  const stem = versionMatch
    ? spec.animationId.slice(0, -versionMatch[0].length)
    : spec.animationId;
  const scope = [slugifyIdSegment(reelId), slugifyIdSegment(sceneId)]
    .filter(Boolean)
    .join('-') || 'scene';

  let attempt = 1;
  let candidate = `${stem}-${scope}-v${version}`;
  while (reservedAnimationIds.has(candidate)) {
    attempt += 1;
    candidate = `${stem}-${scope}-${attempt}-v${version}`;
  }
  reservedAnimationIds.add(candidate);
  return {...spec, animationId: candidate};
};

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

  // Production reuse is intentionally stricter than generic choreography planning.
  // Analysis and expansion tooling may still inspect the complete catalog, including
  // executable variants that only have a semantic shell. A real content-matched
  // production plan may reuse only animations that are executable, natively bound,
  // and addressable through the content-render configuration.
  const productionEntries = getProductionReadyLibraryEntries(entries);

  const choreography = planReelChoreography({
    reelId,
    reelIndex,
    scenes,
    entries: productionEntries,
    brain,
  });

  // New-build IDs are deterministic by semantic content. Reserve every supplied
  // catalog ID plus every globally production-ready runtime ID so a newly compiled
  // build can never inherit readiness merely by colliding with an existing runtime.
  const reservedAnimationIds = new Set([
    ...entries.map((entry) => entry.animationId),
    ...PRODUCTION_READY_LIBRARY_ANIMATION_IDS,
  ]);
  const scenePlans: ProductionSceneAnimationPlan[] = [];

  choreography.selections.forEach((selection, index) => {
    const scene = scenes[index];
    if (selection.animationId) {
      const entry = getEntry(productionEntries, selection.animationId);
      scenePlans.push({
        sceneId: scene.sceneId,
        source: 'library',
        animationId: entry.animationId,
        catalogEntry: entry,
        buildSpec: null,
        selectionScore: selection.score?.total ?? null,
        selectionReasons: selection.reasons,
      });
      return;
    }

    if (!selection.newAnimationProposal) {
      throw new Error(
        `scene ${scene.sceneId} has neither a library animation nor a build proposal`,
      );
    }

    const compiledBuildSpec = compileNewAnimationProposal({
      proposal: selection.newAnimationProposal,
    });
    const buildSpec = reserveUniqueBuildSpec({
      spec: compiledBuildSpec,
      reservedAnimationIds,
      reelId,
      sceneId: scene.sceneId,
    });
    const collisionResolved = buildSpec.animationId !== compiledBuildSpec.animationId;
    const catalogEntry = createCatalogEntryFromBuildSpec({
      spec: buildSpec,
      description: createBuildDescription(scene, buildSpec),
    });
    scenePlans.push({
      sceneId: scene.sceneId,
      source: 'new-build',
      animationId: buildSpec.animationId,
      catalogEntry,
      buildSpec,
      selectionScore: selection.score?.total ?? null,
      selectionReasons: [
        ...selection.reasons,
        ...(collisionResolved
          ? [
              `new-build animation id collision resolved: ${compiledBuildSpec.animationId} -> ${buildSpec.animationId}`,
            ]
          : []),
      ],
    });
  });

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

  const uniqueWarnings = [...new Set(qualityWarnings)];
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
    qualityWarnings: uniqueWarnings,
    readyForImplementation:
      uniqueWarnings.length === 0 && areProductionRuntimeScenesReady(scenePlans),
  };
};
