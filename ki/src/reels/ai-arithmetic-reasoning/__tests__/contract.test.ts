import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {
  ARITHMETIC_DURATION_IN_FRAMES,
  ARITHMETIC_SCENES,
} from '../ReelAIArithmeticReasoning';
import {ARITHMETIC_VISUAL_PROFILES} from '../visualProfiles';
import {VISUAL_QUALITY_V4, assertVisualQualityV4} from '../visualQuality';

describe('AI arithmetic reasoning reel contract', () => {
  it('keeps scenes contiguous and matches total duration', () => {
    let cursor = 0;
    for (const scene of ARITHMETIC_SCENES) {
      expect(scene.startFrame).toBe(cursor);
      cursor += scene.durationFrames;
    }
    expect(cursor).toBe(ARITHMETIC_DURATION_IN_FRAMES);
  });

  it('passes authored visual diversity without blockers', () => {
    const result = evaluateAuthoredVisualDiversity(ARITHMETIC_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
  });

  it('keeps Visual Quality V4 source contract valid', () => {
    expect(() => assertVisualQualityV4(VISUAL_QUALITY_V4)).not.toThrow();
    expect(VISUAL_QUALITY_V4.targetScores.overall).toBeGreaterThanOrEqual(8);
  });
});
