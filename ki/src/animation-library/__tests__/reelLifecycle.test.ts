import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {
  finalizeReelAnimationProduction,
  prepareReelAnimationProduction,
  type SceneReleaseReviewInput,
} from '../reelLifecycle';

const createBrain = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-04T12:00:00.000Z',
  });

const SCENES = [
  {sceneId: 'scene-1', spokenText: 'Die KI zerlegt den Satz in Tokens.'},
  {sceneId: 'scene-2', spokenText: 'Jedes Token wird in einen Zahlenvektor umgewandelt.'},
  {sceneId: 'scene-3', spokenText: 'Ähnliche Begriffe liegen im Bedeutungsraum näher zusammen.'},
  {sceneId: 'scene-4', spokenText: 'Attention verbindet wichtige Wörter miteinander.'},
] as const;

const acceptedReview = (
  sceneId: string,
  index: number,
): SceneReleaseReviewInput => ({
  sceneId,
  observationId: `review-${index}`,
  createdAt: `2026-08-04T12:${String(index).padStart(2, '0')}:00.000Z`,
  artifactReview: {
    expectedArtifacts: 8,
    validArtifacts: 8,
    invalidArtifactPaths: [],
    sourceFingerprintCurrent: true,
  },
  manualReview: {
    semanticClarity: 91,
    novelty: 87,
    productionConfidence: 90,
    understandableWithoutSound: true,
    mobileReadable: true,
    deterministicMotion: true,
    noOverflow: true,
    noFullAnimationRepetition: true,
    notes: ['manual mobile and motion review passed'],
  },
});

describe('reel animation lifecycle', () => {
  it('prepares an implementation queue from raw scene text', () => {
    const prepared = prepareReelAnimationProduction({
      reelId: 'lifecycle-reel',
      reelIndex: 30,
      scenes: SCENES,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain: createBrain(),
    });

    expect(prepared.implementationQueue).toHaveLength(4);
    expect(new Set(prepared.implementationQueue.map((item) => item.animationId)).size).toBe(4);
    expect(prepared.implementationQueue.every((item) => item.visualFamily.length > 0)).toBe(true);
    expect(prepared.diagnostics.passed).toBe(true);
    expect(prepared.readyForImplementation).toBe(true);
  });

  it('finalizes accepted reviews, promotes entries, and updates brain memory', () => {
    const brain = createBrain();
    const prepared = prepareReelAnimationProduction({
      reelId: 'accepted-lifecycle-reel',
      reelIndex: 31,
      scenes: SCENES,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
    });
    const result = finalizeReelAnimationProduction({
      prepared,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      reviews: SCENES.map((scene, index) => acceptedReview(scene.sceneId, index + 1)),
    });

    expect(result.releasePassed).toBe(true);
    expect(result.acceptedSceneCount).toBe(4);
    expect(result.reworkedSceneCount).toBe(0);
    expect(result.rejectedSceneCount).toBe(0);
    expect(result.brain.observations).toHaveLength(4);
    expect(result.brain.usageHistory).toHaveLength(4);

    for (const review of result.sceneReviews) {
      expect(review.decision.recommendedStatus).toBe('verified');
      expect(
        result.entries.find((entry) => entry.animationId === review.animationId)?.status,
      ).toBe('verified');
      expect(
        result.brain.animationStats.find(
          (stats) => stats.animationId === review.animationId,
        )?.usageCount,
      ).toBe(1);
    }
  });

  it('refuses to finalize a pending new-build before it is runtime-registered and natively content-bound', () => {
    const brain = createBrain();
    const prepared = prepareReelAnimationProduction({
      reelId: 'pending-new-build-finalization',
      reelIndex: 34,
      scenes: [
        {
          sceneId: 'scene-new-build',
          spokenText:
            'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
          forceNewAnimation: true,
        },
      ],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
    });
    const plannedScene = prepared.plan.productionPlan.scenes[0];

    expect(plannedScene.source).toBe('new-build');
    expect(prepared.readyForImplementation).toBe(false);
    expect(prepared.diagnostics.passed).toBe(true);

    expect(() =>
      finalizeReelAnimationProduction({
        prepared,
        entries: [...ANIMATION_LIBRARY_ENTRIES, plannedScene.catalogEntry],
        brain,
        reviews: [acceptedReview('scene-new-build', 1)],
      }),
    ).toThrow(
      /cannot finalize scene scene-new-build: animation .* is not registered with executable native content binding/,
    );
  });

  it('allows a historical new-build to finalize after that exact runtime is implemented', () => {
    const brain = createBrain();
    const sceneId = 'scene-promoted-new-build';
    const prepared = prepareReelAnimationProduction({
      reelId: 'promoted-new-build-finalization',
      reelIndex: 35,
      scenes: [
        {
          sceneId,
          spokenText:
            'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
          forceNewAnimation: true,
        },
      ],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      maximumNewAnimationRatio: 1,
    });
    expect(prepared.plan.productionPlan.scenes[0].source).toBe('new-build');

    const implementedEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) => entry.animationId === 'scale-performance-latency-tunnel-race-v1',
    );
    expect(implementedEntry).toBeDefined();

    Object.assign(prepared.plan.productionPlan.scenes[0], {
      animationId: implementedEntry!.animationId,
      catalogEntry: implementedEntry!,
    });

    const result = finalizeReelAnimationProduction({
      prepared,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      reviews: [acceptedReview(sceneId, 1)],
    });
    const sceneReview = result.sceneReviews[0];
    const finalizedEntry = result.entries.find(
      (entry) => entry.animationId === implementedEntry!.animationId,
    );

    expect(result.releasePassed).toBe(true);
    expect(sceneReview.source).toBe('new-build');
    expect(sceneReview.animationId).toBe(implementedEntry!.animationId);
    expect(sceneReview.decision.outcome).toBe('accepted');
    expect(finalizedEntry?.status).toBe('verified');
  });

  it('reviews the current catalog entry instead of overwriting it with the older planning snapshot', () => {
    const brain = createBrain();
    const prepared = prepareReelAnimationProduction({
      reelId: 'current-entry-wins',
      reelIndex: 36,
      scenes: [SCENES[0]],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
    });
    const plannedScene = prepared.plan.productionPlan.scenes[0];
    const currentTitle = 'CURRENT RUNTIME ENTRY TITLE';
    const currentEntry = {
      ...plannedScene.catalogEntry,
      title: currentTitle,
      description:
        'Current catalog metadata must survive finalization instead of being replaced by the planning snapshot.',
      status: 'prototype' as const,
    };
    const currentEntries = ANIMATION_LIBRARY_ENTRIES.map((entry) =>
      entry.animationId === currentEntry.animationId ? currentEntry : entry,
    );

    const result = finalizeReelAnimationProduction({
      prepared,
      entries: currentEntries,
      brain,
      reviews: [acceptedReview(SCENES[0].sceneId, 1)],
    });
    const finalizedEntry = result.entries.find(
      (entry) => entry.animationId === currentEntry.animationId,
    );

    expect(result.releasePassed).toBe(true);
    expect(finalizedEntry?.title).toBe(currentTitle);
    expect(finalizedEntry?.description).toBe(currentEntry.description);
    expect(finalizedEntry?.status).toBe('verified');
  });

  it('keeps a failed render review out of release and learns the rejection', () => {
    const brain = createBrain();
    const prepared = prepareReelAnimationProduction({
      reelId: 'failed-lifecycle-reel',
      reelIndex: 32,
      scenes: [SCENES[0]],
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
    });
    const failedReview = acceptedReview('scene-1', 1);
    failedReview.artifactReview.validArtifacts = 6;
    failedReview.artifactReview.invalidArtifactPaths = ['frame-0090.png', 'video.mp4'];
    failedReview.manualReview.semanticClarity = 61;
    failedReview.manualReview.mobileReadable = false;

    const result = finalizeReelAnimationProduction({
      prepared,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      reviews: [failedReview],
    });

    expect(result.releasePassed).toBe(false);
    expect(result.rejectedSceneCount).toBe(1);
    expect(result.sceneReviews[0].decision.blockers.length).toBeGreaterThan(0);
    expect(result.brain.observations[0].outcome).toBe('rejected');
    expect(result.brain.usageHistory[0].result).toBe('rejected');
  });

  it('rejects missing reviews, duplicate review ids, and blocked plans', () => {
    const brain = createBrain();
    const prepared = prepareReelAnimationProduction({
      reelId: 'invalid-lifecycle-reel',
      reelIndex: 33,
      scenes: SCENES,
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
    });

    expect(() =>
      finalizeReelAnimationProduction({
        prepared,
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        reviews: [acceptedReview('scene-1', 1)],
      }),
    ).toThrow(/reviews do not match plan/);

    const duplicateObservationReviews = SCENES.map((scene, index) =>
      acceptedReview(scene.sceneId, index + 1),
    );
    duplicateObservationReviews[1].observationId =
      duplicateObservationReviews[0].observationId;
    expect(() =>
      finalizeReelAnimationProduction({
        prepared,
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        reviews: duplicateObservationReviews,
      }),
    ).toThrow(/duplicate observationId/);

    const blockedPrepared = {
      ...prepared,
      diagnostics: {
        ...prepared.diagnostics,
        passed: false,
        diagnostics: [
          ...prepared.diagnostics.diagnostics,
          {
            code: 'forced-test-blocker',
            severity: 'blocker' as const,
            sceneIds: ['scene-1'],
            message: 'test blocker',
          },
        ],
      },
    };
    expect(() =>
      finalizeReelAnimationProduction({
        prepared: blockedPrepared,
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        reviews: SCENES.map((scene, index) =>
          acceptedReview(scene.sceneId, index + 1),
        ),
      }),
    ).toThrow(/cannot finalize a reel plan with blockers/);
  });
});
