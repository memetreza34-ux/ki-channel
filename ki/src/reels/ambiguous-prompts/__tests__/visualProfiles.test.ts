import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {AMBIGUOUS_PROMPTS_VISUAL_PROFILES} from '../visualProfiles';

describe('ambiguous prompts authored visual profiles', () => {
  it('covers all five scenes with materially different visual grammar', () => {
    expect(AMBIGUOUS_PROMPTS_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual([
      'ambiguous-01',
      'ambiguous-02',
      'ambiguous-03',
      'ambiguous-04',
      'ambiguous-05',
    ]);

    const result = evaluateAuthoredVisualDiversity(AMBIGUOUS_PROMPTS_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(4);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
    expect(result.issues.filter((issue) => issue.severity === 'blocker')).toEqual([]);
  });

  it('contains no card-primary scene', () => {
    expect(
      AMBIGUOUS_PROMPTS_VISUAL_PROFILES.some(
        (profile) => profile.fingerprint.primaryPrimitive === 'card',
      ),
    ).toBe(false);
  });
});
