import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {
  applyCreativeLearningBatch,
  createKnowledgeObservation,
  createRenderReviewObservation,
  createUserFeedbackObservation,
} from '../learningPipeline';

const now = '2026-08-04T11:00:00.000Z';
const animationId = 'retrieval-search-knowledge-magnet-v1';

const createState = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now,
  });

describe('creative learning pipeline', () => {
  it('applies observations and usage in chronological order', () => {
    const renderReview = createRenderReviewObservation({
      observationId: 'review-1',
      animationId,
      reelId: 'reel-1',
      sceneId: 'scene-2',
      semanticClarity: 94,
      novelty: 88,
      productionConfidence: 82,
      outcome: 'accepted',
      notes: 'The retrieval metaphor remained understandable without sound.',
      createdAt: '2026-08-04T11:02:00.000Z',
    });
    const feedback = createUserFeedbackObservation({
      observationId: 'feedback-1',
      animationId,
      reelId: 'reel-1',
      sceneId: 'scene-2',
      semanticClarity: 98,
      novelty: 92,
      productionConfidence: 78,
      outcome: 'accepted',
      notes: 'The user explicitly preferred this over a generic card animation.',
      createdAt: '2026-08-04T11:03:00.000Z',
    });
    const knowledge = createKnowledgeObservation({
      observationId: 'knowledge-1',
      factKey: 'subtitle.safe-zone.bottom',
      value: 126,
      confidence: 0.94,
      source: 'verified-render-review',
      createdAt: '2026-08-04T11:01:00.000Z',
      notes: 'The tested mobile safe zone requires at least 126 px.',
    });

    const result = applyCreativeLearningBatch({
      state: createState(),
      entries: ANIMATION_LIBRARY_ENTRIES,
      batch: {
        batchId: 'batch-1',
        reelIndex: 4,
        now: '2026-08-04T11:04:00.000Z',
        observations: [feedback, renderReview, knowledge],
        usages: [
          {
            animationId,
            reelId: 'reel-1',
            sceneId: 'scene-2',
            usedAt: '2026-08-04T11:03:30.000Z',
            semanticTags: ['retrieval', 'evidence'],
            result: 'accepted',
          },
        ],
      },
    });

    expect(result.appliedObservationIds).toEqual([
      'knowledge-1',
      'review-1',
      'feedback-1',
    ]);
    expect(result.appliedUsageKeys).toEqual([
      `reel-1:scene-2:${animationId}`,
    ]);
    expect(result.state.facts).toContainEqual(
      expect.objectContaining({
        factKey: 'subtitle.safe-zone.bottom',
        value: 126,
      }),
    );
    expect(
      result.state.animationStats.find(
        (stats) => stats.animationId === animationId,
      )?.usageCount,
    ).toBe(1);
  });

  it('skips duplicate observations and usage records', () => {
    const observation = createUserFeedbackObservation({
      observationId: 'feedback-duplicate',
      animationId,
      reelId: 'reel-2',
      sceneId: 'scene-1',
      semanticClarity: 90,
      novelty: 90,
      productionConfidence: 80,
      outcome: 'accepted',
      notes: 'Accepted.',
      createdAt: '2026-08-04T12:00:00.000Z',
    });
    const usage = {
      animationId,
      reelId: 'reel-2',
      sceneId: 'scene-1',
      usedAt: '2026-08-04T12:01:00.000Z',
      semanticTags: ['retrieval'],
      result: 'accepted' as const,
    };

    const first = applyCreativeLearningBatch({
      state: createState(),
      entries: ANIMATION_LIBRARY_ENTRIES,
      batch: {
        batchId: 'first',
        reelIndex: 6,
        now: '2026-08-04T12:02:00.000Z',
        observations: [observation],
        usages: [usage],
      },
    });
    const second = applyCreativeLearningBatch({
      state: first.state,
      entries: ANIMATION_LIBRARY_ENTRIES,
      batch: {
        batchId: 'second',
        reelIndex: 6,
        now: '2026-08-04T12:03:00.000Z',
        observations: [observation],
        usages: [usage],
      },
    });

    expect(second.skippedObservationIds).toEqual(['feedback-duplicate']);
    expect(second.skippedUsageKeys).toEqual([
      `reel-2:scene-1:${animationId}`,
    ]);
  });
});
