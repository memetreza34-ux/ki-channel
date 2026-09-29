import {describe, expect, it} from 'vitest';
import {
  choreographyProgress,
  createCenterOutRanks,
  staggeredChoreographyProgress,
} from '../choreography';

describe('motion choreography', () => {
  it('creates a deterministic center-out order', () => {
    const ranks = createCenterOutRanks(5, 4);

    expect(ranks).toHaveLength(20);
    expect(new Set(ranks).size).toBe(20);
    expect(ranks[7]).toBe(0);
    expect(ranks[12]).toBe(1);
    expect(ranks[0]).toBeGreaterThan(ranks[7]);
    expect(ranks[19]).toBeGreaterThan(ranks[12]);
  });

  it('keeps object motion short while staggering the group', () => {
    const phase = {
      startFrame: 60,
      durationInFrames: 18,
      easing: 'enterEmphasis' as const,
    };

    expect(choreographyProgress(78, phase)).toBeCloseTo(1, 5);
    expect(
      staggeredChoreographyProgress(78, 8, phase, {
        offsetFrames: 3,
        capFrames: 36,
      }),
    ).toBeLessThan(1);
  });

  it('clamps progress outside the authored event', () => {
    const phase = {startFrame: 30, durationInFrames: 12} as const;
    expect(choreographyProgress(0, phase)).toBe(0);
    expect(choreographyProgress(200, phase)).toBe(1);
  });
});
