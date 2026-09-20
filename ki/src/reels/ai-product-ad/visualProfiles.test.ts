import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {AI_PRODUCT_AD_VISUAL_PROFILES} from './visualProfiles';

describe('AI product ad authored visual profiles', () => {
  it('keeps five distinct visual and motion grammars', () => {
    expect(AI_PRODUCT_AD_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual([
      'ad-01', 'ad-02', 'ad-03', 'ad-04', 'ad-05',
    ]);
    const result = evaluateAuthoredVisualDiversity(AI_PRODUCT_AD_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
  });

  it('does not fall back to card-primary scenes', () => {
    expect(AI_PRODUCT_AD_VISUAL_PROFILES.some((profile) => profile.fingerprint.primaryPrimitive === 'card')).toBe(false);
  });
});
