import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState, recordAnimationUsage} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {createAnimationRotationReport} from '../rotationReport';
import {animationUsageRecordSchema} from '../schema';

const seedUsage = ({
  animationId,
  count,
  startReelIndex,
}: {
  animationId: string;
  count: number;
  startReelIndex: number;
}) => {
  const entry = ANIMATION_LIBRARY_ENTRIES.find(
    (candidate) => candidate.animationId === animationId,
  );
  if (!entry) throw new Error(`missing test animation ${animationId}`);
  let brain = createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-04T09:00:00.000Z',
  });
  for (let index = 0; index < count; index += 1) {
    brain = recordAnimationUsage({
      state: brain,
      reelIndex: startReelIndex + index,
      usage: animationUsageRecordSchema.parse({
        animationId,
        reelId: `rotation-reel-${index}`,
        sceneId: `scene-${index}`,
        usedAt: `2026-08-04T${String(10 + index).padStart(2, '0')}:00:00.000Z`,
        semanticTags: entry.semanticTags.slice(0, 2),
        visualFamily: entry.visualFamily,
        layoutFamily: entry.layoutFamily,
        motionSignature: entry.motionSignature,
        primaryDirection: entry.primaryDirection,
        result: 'accepted',
      }),
    });
  }
  return brain;
};

describe('animation rotation report', () => {
  it('detects heavy recent reuse and active cooldowns', () => {
    const tokenEntry = ANIMATION_LIBRARY_ENTRIES.find(
      (entry) => entry.visualFamily === 'tokenization',
    );
    if (!tokenEntry) throw new Error('missing tokenization entry');
    const brain = seedUsage({
      animationId: tokenEntry.animationId,
      count: 5,
      startReelIndex: 10,
    });

    const report = createAnimationRotationReport({
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      currentReelIndex: 15,
      recentUsageLimit: 20,
    });

    expect(report.healthy).toBe(false);
    expect(report.blockedAnimationIds).toContain(tokenEntry.animationId);
    expect(report.animationConcentration[0]).toMatchObject({
      key: tokenEntry.animationId,
      count: 5,
      severity: 'blocker',
    });
    expect(report.familyConcentration[0].key).toBe('tokenization');
    expect(report.warnings.some((warning) => warning.includes('100%'))).toBe(true);
  });

  it('recommends unused, available animations before recently used ones', () => {
    const entry = ANIMATION_LIBRARY_ENTRIES[0];
    const brain = seedUsage({
      animationId: entry.animationId,
      count: 1,
      startReelIndex: 20,
    });
    const report = createAnimationRotationReport({
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      currentReelIndex: 30,
      recommendationLimit: 10,
    });

    expect(report.unusedAnimationIds.length).toBe(
      ANIMATION_LIBRARY_ENTRIES.length - 1,
    );
    expect(report.recommendedAnimationIds).not.toContain(entry.animationId);
    expect(report.recommendedAnimationIds.every((animationId) =>
      report.unusedAnimationIds.includes(animationId),
    )).toBe(true);
  });

  it('prioritizes visual families absent from the recent rotation window', () => {
    const entries = ANIMATION_LIBRARY_ENTRIES.filter(
      (entry) => entry.visualFamily === 'tokenization',
    );
    let brain = createInitialCreativeBrainState({
      entries: ANIMATION_LIBRARY_ENTRIES,
      now: '2026-08-04T09:00:00.000Z',
    });
    entries.slice(0, 3).forEach((entry, index) => {
      brain = recordAnimationUsage({
        state: brain,
        reelIndex: 40 + index,
        usage: animationUsageRecordSchema.parse({
          animationId: entry.animationId,
          reelId: `family-reel-${index}`,
          sceneId: `scene-${index}`,
          usedAt: `2026-08-04T1${index}:00:00.000Z`,
          semanticTags: entry.semanticTags.slice(0, 2),
          visualFamily: entry.visualFamily,
          layoutFamily: entry.layoutFamily,
          motionSignature: entry.motionSignature,
          primaryDirection: entry.primaryDirection,
          result: 'accepted',
        }),
      });
    });

    const report = createAnimationRotationReport({
      entries: ANIMATION_LIBRARY_ENTRIES,
      brain,
      currentReelIndex: 50,
    });

    expect(report.priorityVisualFamilies).not.toContain('tokenization');
    expect(report.priorityVisualFamilies.length).toBeGreaterThan(0);
  });

  it('validates report limits and reel index', () => {
    const brain = createInitialCreativeBrainState({
      entries: ANIMATION_LIBRARY_ENTRIES,
      now: '2026-08-04T09:00:00.000Z',
    });
    expect(() =>
      createAnimationRotationReport({
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        currentReelIndex: -1,
      }),
    ).toThrow(/currentReelIndex/);
    expect(() =>
      createAnimationRotationReport({
        entries: ANIMATION_LIBRARY_ENTRIES,
        brain,
        currentReelIndex: 1,
        recentUsageLimit: 0,
      }),
    ).toThrow(/recentUsageLimit/);
  });
});
