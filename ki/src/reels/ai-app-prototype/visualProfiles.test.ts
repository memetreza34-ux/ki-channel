import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../animation-library/authoredProductionGate';
import {AI_APP_VISUAL_PROFILES} from './visualProfiles';

describe('AI app prototype authored visual profiles', () => {
  it('covers all five scenes with distinct layouts and motion signatures', () => {
    expect(AI_APP_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual([
      'app-01', 'app-02', 'app-03', 'app-04', 'app-05',
    ]);
    const result = evaluateAuthoredVisualDiversity(AI_APP_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
  });

  it('contains no card-primary visual', () => {
    expect(AI_APP_VISUAL_PROFILES.some((profile) => profile.fingerprint.primaryPrimitive === 'card')).toBe(false);
  });
});
