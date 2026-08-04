import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {
  applyCreativeBrainObservation,
  createInitialCreativeBrainState,
  findCurrentBrainFact,
  recordAnimationUsage,
} from '../brain';
import type {CreativeBrainObservation} from '../schema';

const NOW = '2026-08-04T10:24:00.000Z';

const createState = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: NOW,
  });

describe('creative brain', () => {
  it('learns more strongly from direct user feedback than from priors', () => {
    const animationId = ANIMATION_LIBRARY_ENTRIES[0].animationId;
    const initial = createState();
    const before = initial.animationStats.find(
      (stats) => stats.animationId === animationId,
    )!;

    const observation: CreativeBrainObservation = {
      observationId: 'feedback-1',
      type: 'user-feedback',
      animationId,
      reelId: 'reel-1',
      sceneId: 'scene-1',
      semanticClarity: 20,
      novelty: 35,
      productionConfidence: 40,
      outcome: 'rejected',
      notes: 'The animation looked polished but did not explain the sentence.',
      createdAt: '2026-08-04T10:30:00.000Z',
      fact: null,
    };

    const updated = applyCreativeBrainObservation({
      state: initial,
      observation,
    });
    const after = updated.animationStats.find(
      (stats) => stats.animationId === animationId,
    )!;

    expect(after.rejectedCount).toBe(1);
    expect(after.learnedSemanticClarity).toBeLessThan(
      before.learnedSemanticClarity,
    );
    expect(after.learnedNovelty).toBeLessThan(before.learnedNovelty);
    expect(updated.revision).toBe(initial.revision + 1);
  });

  it('does not apply the same observation twice', () => {
    const initial = createState();
    const observation: CreativeBrainObservation = {
      observationId: 'duplicate-safe',
      type: 'render-review',
      animationId: ANIMATION_LIBRARY_ENTRIES[0].animationId,
      reelId: 'reel-1',
      sceneId: 'scene-1',
      semanticClarity: 90,
      novelty: 90,
      productionConfidence: 80,
      outcome: 'accepted',
      notes: 'Accepted after render review.',
      createdAt: '2026-08-04T10:31:00.000Z',
      fact: null,
    };

    const once = applyCreativeBrainObservation({state: initial, observation});
    const twice = applyCreativeBrainObservation({state: once, observation});
    expect(twice).toEqual(once);
  });

  it('updates a fact only when the newer fact is sufficiently reliable', () => {
    const initial = createState();
    const first: CreativeBrainObservation = {
      observationId: 'fact-v1',
      type: 'new-knowledge',
      animationId: null,
      reelId: null,
      sceneId: null,
      semanticClarity: null,
      novelty: null,
      productionConfidence: null,
      outcome: 'informational',
      notes: 'Initial verified fact.',
      createdAt: '2026-08-04T10:32:00.000Z',
      fact: {
        factKey: 'knowledge.example',
        value: 'version-1',
        confidence: 0.95,
        source: 'verified-source',
        observedAt: '2026-08-04T10:32:00.000Z',
        supersedesObservationId: null,
      },
    };
    const weakNewer: CreativeBrainObservation = {
      ...first,
      observationId: 'fact-v2-weak',
      notes: 'Newer but weak claim.',
      createdAt: '2026-08-04T10:33:00.000Z',
      fact: {
        ...first.fact!,
        value: 'weak-version',
        confidence: 0.4,
        source: 'unverified-source',
        observedAt: '2026-08-04T10:33:00.000Z',
      },
    };
    const strongNewer: CreativeBrainObservation = {
      ...first,
      observationId: 'fact-v3-strong',
      notes: 'Newer verified update.',
      createdAt: '2026-08-04T10:34:00.000Z',
      fact: {
        ...first.fact!,
        value: 'version-2',
        confidence: 0.92,
        source: 'new-verified-source',
        observedAt: '2026-08-04T10:34:00.000Z',
      },
    };

    const withFirst = applyCreativeBrainObservation({
      state: initial,
      observation: first,
    });
    const afterWeak = applyCreativeBrainObservation({
      state: withFirst,
      observation: weakNewer,
    });
    expect(findCurrentBrainFact(afterWeak, 'knowledge.example')?.value).toBe(
      'version-1',
    );

    const afterStrong = applyCreativeBrainObservation({
      state: afterWeak,
      observation: strongNewer,
    });
    expect(findCurrentBrainFact(afterStrong, 'knowledge.example')?.value).toBe(
      'version-2',
    );
  });

  it('records usage once and activates a reel cooldown', () => {
    const initial = createState();
    const animationId = ANIMATION_LIBRARY_ENTRIES[0].animationId;
    const usage = {
      animationId,
      reelId: 'reel-1',
      sceneId: 'scene-1',
      usedAt: '2026-08-04T10:35:00.000Z',
      semanticTags: ['token', 'text'],
      result: 'unknown' as const,
    };

    const once = recordAnimationUsage({state: initial, usage, reelIndex: 3});
    const twice = recordAnimationUsage({state: once, usage, reelIndex: 3});
    const stats = once.animationStats.find(
      (item) => item.animationId === animationId,
    )!;

    expect(stats.usageCount).toBe(1);
    expect(stats.cooldownUntilReelIndex).toBe(8);
    expect(twice).toEqual(once);
  });
});
