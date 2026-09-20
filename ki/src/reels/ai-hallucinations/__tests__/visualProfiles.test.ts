import {describe, expect, it} from 'vitest';
import {
  HALLUCINATION_VISUAL_DIVERSITY,
  HALLUCINATION_VISUAL_MANIFEST,
  assertHallucinationVisualDiversity,
} from '../visualProfiles';
import {HALLUCINATION_SCENES} from '../ReelHallucinations';

describe('AI hallucinations authored visual diversity', () => {
  it('derives one catalog fingerprint for every production scene', () => {
    expect(HALLUCINATION_VISUAL_MANIFEST).toHaveLength(HALLUCINATION_SCENES.length);
    expect(HALLUCINATION_VISUAL_MANIFEST.map((scene) => scene.sceneId)).toEqual(
      HALLUCINATION_SCENES.map((scene) => scene.sceneId),
    );
    expect(HALLUCINATION_VISUAL_MANIFEST.map((scene) => scene.visualId)).toEqual(
      HALLUCINATION_SCENES.map((scene) => scene.animationId),
    );
  });

  it('passes the authored diversity blocker gate', () => {
    expect(() => assertHallucinationVisualDiversity()).not.toThrow();
    expect(HALLUCINATION_VISUAL_DIVERSITY.passed).toBe(true);
    expect(HALLUCINATION_VISUAL_DIVERSITY.uniquePrimitiveCount).toBeGreaterThanOrEqual(3);
    expect(HALLUCINATION_VISUAL_DIVERSITY.uniqueLayoutCount).toBe(HALLUCINATION_SCENES.length);
    expect(HALLUCINATION_VISUAL_DIVERSITY.uniqueMotionCount).toBe(HALLUCINATION_SCENES.length);
    expect(
      HALLUCINATION_VISUAL_DIVERSITY.issues.some(
        (issue) => issue.severity === 'blocker',
      ),
    ).toBe(false);
  });
});
