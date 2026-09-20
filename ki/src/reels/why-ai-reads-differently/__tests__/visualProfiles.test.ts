import {describe, expect, it} from 'vitest';
import {WHY_AI_SCENES} from '../contract';
import {
  WHY_AI_VISUAL_DIVERSITY,
  WHY_AI_VISUAL_PROFILES,
  assertWhyAIVisualContract,
} from '../visualProfiles';

describe('why AI reads differently authored visual contract', () => {
  it('covers all eight authored scenes in production order', () => {
    expect(WHY_AI_VISUAL_PROFILES.map((profile) => profile.sceneId)).toEqual(
      WHY_AI_SCENES.map((scene) => scene.sceneId),
    );
    expect(WHY_AI_VISUAL_PROFILES).toHaveLength(8);
  });

  it('enforces the eight-family production variation policy', () => {
    expect(() => assertWhyAIVisualContract()).not.toThrow();
    expect(WHY_AI_VISUAL_DIVERSITY.passed).toBe(true);
    expect(WHY_AI_VISUAL_DIVERSITY.uniqueLayoutCount).toBe(8);
    expect(WHY_AI_VISUAL_DIVERSITY.uniqueMotionCount).toBe(8);
    expect(new Set(WHY_AI_VISUAL_PROFILES.map((profile) => profile.fingerprint.visualFamily)).size).toBe(8);
  });

  it('keeps complete authored animations unique inside the reel', () => {
    expect(new Set(WHY_AI_VISUAL_PROFILES.map((profile) => profile.visualId)).size).toBe(8);
  });
});
