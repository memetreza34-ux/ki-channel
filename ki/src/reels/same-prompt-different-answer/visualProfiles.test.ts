import {describe, expect, it} from 'vitest';
import {
  SAME_PROMPT_VISUAL_DIVERSITY,
  SAME_PROMPT_VISUAL_MANIFEST,
  assertSamePromptVisualDiversity,
} from './visualProfiles';

describe('same-prompt visual diversity', () => {
  it('passes the authored diversity gate', () => {
    expect(() => assertSamePromptVisualDiversity()).not.toThrow();
    expect(SAME_PROMPT_VISUAL_DIVERSITY.passed).toBe(true);
  });

  it('uses eight unique visuals with broad primitive/layout/motion diversity', () => {
    expect(SAME_PROMPT_VISUAL_MANIFEST).toHaveLength(8);
    expect(new Set(SAME_PROMPT_VISUAL_MANIFEST.map((scene) => scene.visualId)).size).toBe(8);
    expect(SAME_PROMPT_VISUAL_DIVERSITY.uniquePrimitiveCount).toBeGreaterThanOrEqual(6);
    expect(SAME_PROMPT_VISUAL_DIVERSITY.uniqueLayoutCount).toBe(8);
    expect(SAME_PROMPT_VISUAL_DIVERSITY.uniqueMotionCount).toBe(8);
  });
});
