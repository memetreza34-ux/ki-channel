import {describe, expect, it} from 'vitest';
import {getAnimationLibraryEntry} from '../catalog';
import {
  applyAnimationReviewStatus,
  evaluateAnimationReview,
} from '../renderReview';

const entry = getAnimationLibraryEntry(
  'retrieval-search-knowledge-magnet-v1',
)!;

const passingArtifactReview = {
  expectedArtifacts: 8,
  validArtifacts: 8,
  invalidArtifactPaths: [],
  sourceFingerprintCurrent: true,
};

const passingManualReview = {
  semanticClarity: 94,
  novelty: 88,
  productionConfidence: 84,
  understandableWithoutSound: true,
  mobileReadable: true,
  deterministicMotion: true,
  noOverflow: true,
  noFullAnimationRepetition: true,
  notes: ['Clear retrieval metaphor and stable final state.'],
};

describe('animation render review', () => {
  it('recommends verified only after technical and manual review pass', () => {
    const decision = evaluateAnimationReview({
      entry,
      reelId: 'review-reel',
      sceneId: 'prototype',
      artifactReview: passingArtifactReview,
      manualReview: passingManualReview,
      observationId: 'render-review-pass',
      createdAt: '2026-08-04T14:00:00.000Z',
    });

    expect(decision.passedTechnicalReview).toBe(true);
    expect(decision.passedManualReview).toBe(true);
    expect(decision.recommendedStatus).toBe('verified');
    expect(decision.blockers).toHaveLength(0);

    const updated = applyAnimationReviewStatus({entry, decision});
    expect(updated.status).toBe('verified');
    expect(updated.qualityPrior.semanticClarity).toBe(94);
  });

  it('keeps failed prototypes out of verified status', () => {
    const decision = evaluateAnimationReview({
      entry,
      reelId: 'review-reel',
      sceneId: 'prototype',
      artifactReview: {
        ...passingArtifactReview,
        validArtifacts: 7,
        invalidArtifactPaths: ['frame-90.png'],
      },
      manualReview: {
        ...passingManualReview,
        mobileReadable: false,
        semanticClarity: 68,
      },
      observationId: 'render-review-fail',
      createdAt: '2026-08-04T14:10:00.000Z',
    });

    expect(decision.recommendedStatus).toBe('prototype');
    expect(decision.outcome).toBe('rejected');
    expect(decision.blockers).toEqual(
      expect.arrayContaining([
        expect.stringContaining('7/8 artifacts'),
        'mobile readable',
        'semantic clarity 68/100',
      ]),
    );
  });

  it('never revives a retired entry automatically', () => {
    const retired = {...entry, status: 'retired' as const};
    const decision = evaluateAnimationReview({
      entry: retired,
      reelId: 'review-reel',
      sceneId: 'prototype',
      artifactReview: passingArtifactReview,
      manualReview: passingManualReview,
      observationId: 'render-review-retired',
      createdAt: '2026-08-04T14:20:00.000Z',
    });

    expect(
      applyAnimationReviewStatus({entry: retired, decision}).status,
    ).toBe('retired');
  });
});
