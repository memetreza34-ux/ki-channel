import {describe, expect, it} from 'vitest';
import {evaluateAuthoredVisualDiversity} from '../../../animation-library/authoredProductionGate';
import {AI_AGENTS_VISUAL_PROFILES} from '../visualProfiles';

describe('AI agents authored visual profiles', () => {
  it('covers all five scenes with materially different visual grammar', () => {
    expect(AI_AGENTS_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual([
      'agents-01',
      'agents-02',
      'agents-03',
      'agents-04',
      'agents-05',
    ]);

    const result = evaluateAuthoredVisualDiversity(AI_AGENTS_VISUAL_PROFILES);
    expect(result.passed).toBe(true);
    expect(result.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
    expect(result.uniqueLayoutCount).toBe(5);
    expect(result.uniqueMotionCount).toBe(5);
    expect(result.issues.filter((issue) => issue.severity === 'blocker')).toEqual([]);
  });

  it('does not use cards as a primary visual family', () => {
    expect(
      AI_AGENTS_VISUAL_PROFILES.some(
        (profile) => profile.fingerprint.primaryPrimitive === 'card',
      ),
    ).toBe(false);
  });
});
