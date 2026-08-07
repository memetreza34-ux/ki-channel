import {
  applyCreativeBrainObservation,
  reconcileCreativeBrainWithCatalog,
  recordAnimationUsage,
} from './brain';
import {
  diagnoseRawReelAnimationPlan,
  type ReelPlanDiagnostics,
} from './planDiagnostics';
import {isProductionReadyLibraryAnimation} from './productionEligibility';
import {
  planReelAnimationsFromText,
  type RawReelAnimationPlan,
  type RawReelSceneInput,
} from './reelPlanningPipeline';
import {
  applyAnimationReviewStatus,
  evaluateAnimationReview,
  type AnimationArtifactReview,
  type AnimationManualReview,
  type AnimationReviewDecision,
} from './renderReview';
import {
  animationUsageRecordSchema,
  type AnimationLibraryEntry,
  type CreativeBrainState,
} from './schema';

export type ReelImplementationQueueItem = {
  sceneId: string;
  animationId: string;
  source: 'library' | 'new-build';
  action: 'reuse-and-adapt' | 'build-new-animation';
  selectionScore: number | null;
  selectionReasons: string[];
  visualFamily: string;
  layoutFamily: string;
  motionSignature: string;
  buildSpec: RawReelAnimationPlan['productionPlan']['scenes'][number]['buildSpec'];
};

export type PreparedReelProduction = {
  plan: RawReelAnimationPlan;
  diagnostics: ReelPlanDiagnostics;
  implementationQueue: ReelImplementationQueueItem[];
  readyForImplementation: boolean;
};

export type SceneReleaseReviewInput = {
  sceneId: string;
  observationId: string;
  createdAt: string;
  artifactReview: AnimationArtifactReview;
  manualReview: AnimationManualReview;
};

export type FinalizedSceneReview = {
  sceneId: string;
  animationId: string;
  source: 'library' | 'new-build';
  decision: AnimationReviewDecision;
};

export type FinalizedReelProduction = {
  reelId: string;
  reelIndex: number;
  releasePassed: boolean;
  acceptedSceneCount: number;
  reworkedSceneCount: number;
  rejectedSceneCount: number;
  entries: AnimationLibraryEntry[];
  brain: CreativeBrainState;
  sceneReviews: FinalizedSceneReview[];
};

const assertUniqueSceneIds = (
  values: readonly {sceneId: string}[],
  label: string,
): void => {
  const seen = new Set<string>();
  for (const value of values) {
    if (!value.sceneId.trim()) throw new Error(`${label} contains an empty sceneId`);
    if (seen.has(value.sceneId)) {
      throw new Error(`${label} contains duplicate sceneId: ${value.sceneId}`);
    }
    seen.add(value.sceneId);
  }
};

export const prepareReelAnimationProduction = ({
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
}): PreparedReelProduction => {
  assertUniqueSceneIds(scenes, 'raw reel scenes');

  const plan = planReelAnimationsFromText({
    reelId,
    reelIndex,
    scenes,
    entries,
    brain,
    maximumNewAnimationRatio,
  });
  const diagnostics = diagnoseRawReelAnimationPlan(plan);
  const implementationQueue = plan.productionPlan.scenes.map((scene) => ({
    sceneId: scene.sceneId,
    animationId: scene.animationId,
    source: scene.source,
    action: scene.source === 'new-build'
      ? 'build-new-animation' as const
      : 'reuse-and-adapt' as const,
    selectionScore: scene.selectionScore,
    selectionReasons: [...scene.selectionReasons],
    visualFamily: scene.catalogEntry.visualFamily,
    layoutFamily: scene.catalogEntry.layoutFamily,
    motionSignature: scene.catalogEntry.motionSignature,
    buildSpec: scene.buildSpec,
  }));

  return {
    plan,
    diagnostics,
    implementationQueue,
    readyForImplementation:
      plan.productionPlan.readyForImplementation && diagnostics.passed,
  };
};

const ensureReviewsMatchPlan = ({
  plan,
  reviews,
}: {
  plan: RawReelAnimationPlan;
  reviews: readonly SceneReleaseReviewInput[];
}): void => {
  assertUniqueSceneIds(reviews, 'scene release reviews');
  const observationIds = new Set<string>();
  for (const review of reviews) {
    if (!review.observationId.trim()) {
      throw new Error(`review ${review.sceneId} contains an empty observationId`);
    }
    if (observationIds.has(review.observationId)) {
      throw new Error(`duplicate observationId: ${review.observationId}`);
    }
    observationIds.add(review.observationId);
  }

  const expected = new Set(
    plan.productionPlan.scenes.map((scene) => scene.sceneId),
  );
  const received = new Set(reviews.map((review) => review.sceneId));
  const missing = [...expected].filter((sceneId) => !received.has(sceneId));
  const unknown = [...received].filter((sceneId) => !expected.has(sceneId));
  if (missing.length > 0 || unknown.length > 0) {
    throw new Error(
      `scene reviews do not match plan; missing=[${missing.join(', ')}], unknown=[${unknown.join(', ')}]`,
    );
  }
};

const upsertEntry = (
  entries: readonly AnimationLibraryEntry[],
  entry: AnimationLibraryEntry,
): AnimationLibraryEntry[] => {
  const index = entries.findIndex(
    (candidate) => candidate.animationId === entry.animationId,
  );
  if (index === -1) return [...entries, entry];
  const next = [...entries];
  next[index] = entry;
  return next;
};

const assertCurrentRuntimeReady = ({
  prepared,
  entries,
}: {
  prepared: PreparedReelProduction;
  entries: readonly AnimationLibraryEntry[];
}): void => {
  for (const scene of prepared.plan.productionPlan.scenes) {
    const currentEntry = entries.find(
      (entry) => entry.animationId === scene.animationId,
    );
    if (!currentEntry) {
      throw new Error(
        `cannot finalize scene ${scene.sceneId}: current catalog entry ${scene.animationId} is missing`,
      );
    }
    if (!isProductionReadyLibraryAnimation(scene.animationId)) {
      throw new Error(
        `cannot finalize scene ${scene.sceneId}: animation ${scene.animationId} is not registered with executable native content binding`,
      );
    }
    if (currentEntry.status === 'retired') {
      throw new Error(
        `cannot finalize scene ${scene.sceneId}: animation ${scene.animationId} is retired`,
      );
    }
  }
};

export const finalizeReelAnimationProduction = ({
  prepared,
  entries,
  brain,
  reviews,
}: {
  prepared: PreparedReelProduction;
  entries: readonly AnimationLibraryEntry[];
  brain: CreativeBrainState;
  reviews: readonly SceneReleaseReviewInput[];
}): FinalizedReelProduction => {
  if (!prepared.diagnostics.passed) {
    const blockers = prepared.diagnostics.diagnostics
      .filter((diagnostic) => diagnostic.severity === 'blocker')
      .map((diagnostic) => diagnostic.code);
    throw new Error(
      `cannot finalize a reel plan with blockers: ${blockers.join(', ')}`,
    );
  }
  ensureReviewsMatchPlan({plan: prepared.plan, reviews});
  assertCurrentRuntimeReady({prepared, entries});

  // Finalization deliberately starts from the CURRENT catalog supplied by the caller.
  // The planned scene snapshot can be older (especially for a new-build that was
  // implemented after planning), so it must never overwrite newer implementation,
  // registry or status metadata before review.
  let nextEntries = [...entries];

  const sortedReviewTimes = reviews
    .map((review) => review.createdAt)
    .sort();
  const latestReviewTime = sortedReviewTimes.length > 0
    ? sortedReviewTimes[sortedReviewTimes.length - 1]
    : brain.updatedAt;
  let nextBrain = reconcileCreativeBrainWithCatalog({
    state: brain,
    entries: nextEntries,
    now: latestReviewTime,
  });

  const reviewBySceneId = new Map(
    reviews.map((review) => [review.sceneId, review]),
  );
  const analysisBySceneId = new Map(
    prepared.plan.analyses.map((analysis) => [analysis.sceneId, analysis]),
  );
  const sceneReviews: FinalizedSceneReview[] = [];

  for (const scene of prepared.plan.productionPlan.scenes) {
    const review = reviewBySceneId.get(scene.sceneId);
    const analysis = analysisBySceneId.get(scene.sceneId);
    if (!review || !analysis) {
      throw new Error(`missing review or analysis for scene ${scene.sceneId}`);
    }

    const currentEntry = nextEntries.find(
      (entry) => entry.animationId === scene.animationId,
    );
    if (!currentEntry) {
      throw new Error(`missing catalog entry for ${scene.animationId}`);
    }

    const decision = evaluateAnimationReview({
      entry: currentEntry,
      reelId: prepared.plan.reelId,
      sceneId: scene.sceneId,
      artifactReview: review.artifactReview,
      manualReview: review.manualReview,
      observationId: review.observationId,
      createdAt: review.createdAt,
    });
    const reviewedEntry = applyAnimationReviewStatus({
      entry: currentEntry,
      decision,
    });
    nextEntries = upsertEntry(nextEntries, reviewedEntry);
    nextBrain = applyCreativeBrainObservation({
      state: nextBrain,
      observation: decision.observation,
    });
    nextBrain = recordAnimationUsage({
      state: nextBrain,
      reelIndex: prepared.plan.reelIndex,
      usage: animationUsageRecordSchema.parse({
        animationId: scene.animationId,
        reelId: prepared.plan.reelId,
        sceneId: scene.sceneId,
        usedAt: review.createdAt,
        semanticTags: analysis.semanticTags,
        visualFamily: reviewedEntry.visualFamily,
        layoutFamily: reviewedEntry.layoutFamily,
        motionSignature: reviewedEntry.motionSignature,
        primaryDirection: reviewedEntry.primaryDirection,
        result: decision.outcome,
      }),
    });
    sceneReviews.push({
      sceneId: scene.sceneId,
      animationId: scene.animationId,
      source: scene.source,
      decision,
    });
  }

  const acceptedSceneCount = sceneReviews.filter(
    (review) => review.decision.outcome === 'accepted',
  ).length;
  const reworkedSceneCount = sceneReviews.filter(
    (review) => review.decision.outcome === 'reworked',
  ).length;
  const rejectedSceneCount = sceneReviews.filter(
    (review) => review.decision.outcome === 'rejected',
  ).length;

  return {
    reelId: prepared.plan.reelId,
    reelIndex: prepared.plan.reelIndex,
    releasePassed:
      acceptedSceneCount === sceneReviews.length &&
      sceneReviews.length > 0,
    acceptedSceneCount,
    reworkedSceneCount,
    rejectedSceneCount,
    entries: nextEntries,
    brain: nextBrain,
    sceneReviews,
  };
};