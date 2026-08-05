import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {
  createHistoryAwareCreativeBrain,
  LEGACY_ANIMATION_HISTORY,
} from '../historyAdapter';
import {INITIAL_CREATIVE_BRAIN_STATE} from '../initialBrain';

describe('animation history adapter', () => {
  it('imports all previously used reel animations into brain history', () => {
    const state = createHistoryAwareCreativeBrain({
      state: INITIAL_CREATIVE_BRAIN_STATE,
      entries: ANIMATION_LIBRARY_ENTRIES,
      currentReelIndex: 2,
      now: '2026-08-04T10:40:00.000Z',
    });

    expect(LEGACY_ANIMATION_HISTORY.animations).toHaveLength(8);
    expect(state.usageHistory).toHaveLength(8);
    expect(state.usageHistory[0].visualFamily).toBe('tokenization');
  });

  it('reduces novelty for a recently used visual family without banning it', () => {
    const animationId = 'tokenization-magnetic-phrase-slicer-v1';
    const before = INITIAL_CREATIVE_BRAIN_STATE.animationStats.find(
      (stats) => stats.animationId === animationId,
    )!;
    const state = createHistoryAwareCreativeBrain({
      state: INITIAL_CREATIVE_BRAIN_STATE,
      entries: ANIMATION_LIBRARY_ENTRIES,
      currentReelIndex: 2,
      now: '2026-08-04T10:40:00.000Z',
    });
    const after = state.animationStats.find(
      (stats) => stats.animationId === animationId,
    )!;

    expect(after.learnedNovelty).toBeLessThan(before.learnedNovelty);
    expect(after.learnedNovelty).toBeGreaterThan(0);
  });

  it('adopts the established anti-repetition rules', () => {
    const state = createHistoryAwareCreativeBrain({
      state: INITIAL_CREATIVE_BRAIN_STATE,
      entries: ANIMATION_LIBRARY_ENTRIES,
      currentReelIndex: 2,
      now: '2026-08-04T10:40:00.000Z',
    });

    expect(state.globalRules.exactAnimationCooldownReels).toBe(5);
    expect(state.globalRules.exactAnimationCooldownScenes).toBe(20);
    expect(state.globalRules.forbidDuplicateAnimationWithinReel).toBe(true);
  });
});
