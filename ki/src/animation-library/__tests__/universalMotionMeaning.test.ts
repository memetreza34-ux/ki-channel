import {describe, expect, it} from 'vitest';
import {analyzeSceneMeaning} from '../meaningContract';
import {createUniversalReelMotionPlan} from '../universalMotionPlan';

describe('universal motion meaning payload', () => {
  it('carries the exact sentence and an executable meaning contract', () => {
    const spokenText =
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.';
    const plan = createUniversalReelMotionPlan({
      reelId: 'meaning-payload',
      scenes: [
        {
          sceneId: 'performance-scene',
          spokenText,
          durationInFrames: 150,
          animationId: 'performance-bottleneck-v1',
          visualFamily: 'scale-performance',
          layoutFamily: 'capacity-route',
          motionSignature: 'load-rise-bottleneck-latency-result',
        },
      ],
    });

    const scene = plan.scenes[0];
    expect(scene.spokenText).toBe(spokenText);
    expect(scene.meaningContract.preferredVisualFamilies[0]).toBe(
      'scale-performance',
    );
    expect(scene.meaningContract.requiredVisualCues).toContain(
      'visible-bottleneck',
    );
    expect(scene.meaningContract.visibleChange).toContain('bottleneck');
    expect(scene.valid).toBe(true);
  });

  it('preserves a manually authored meaning contract', () => {
    const spokenText =
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.';
    const manualContract = {
      ...analyzeSceneMeaning(spokenText),
      communicationGoal: 'compare' as const,
      startState: 'two systems begin on one editorial shared baseline',
      visibleChange:
        'the animation compares both systems using the exact editorial difference',
      endState: 'both systems remain visible beside the custom conclusion',
      preferredVisualFamilies: ['comparison'],
      preferredExplanationPatterns: ['comparison'],
      requiredVisualCues: ['shared-baseline', 'two-options'],
    };

    const plan = createUniversalReelMotionPlan({
      reelId: 'manual-meaning-contract',
      scenes: [
        {
          sceneId: 'manual-scene',
          spokenText,
          durationInFrames: 150,
          animationId: 'manual-comparison-v1',
          visualFamily: 'comparison',
          layoutFamily: 'manual-comparison-layout',
          motionSignature: 'manual-comparison-motion',
          meaningContract: manualContract,
        },
      ],
    });

    expect(plan.scenes[0].meaningContract).toEqual(manualContract);
  });
});
