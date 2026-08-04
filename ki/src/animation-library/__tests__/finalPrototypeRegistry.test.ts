import {describe, expect, it} from 'vitest';
import {getAnimationLibraryEntry} from '../catalog';
import {FINAL_ANIMATION_RECIPES} from '../finalRecipes';
import {
  FINAL_PROTOTYPE_EXPECTED_ARTIFACTS,
  FINAL_PROTOTYPE_FAMILIES,
  FINAL_PROTOTYPE_REGISTRY,
} from '../finalPrototypeRegistry';

describe('final animation registry', () => {
  it('registers one fourth-wave animation for every visual family', () => {
    expect(FINAL_PROTOTYPE_REGISTRY).toHaveLength(22);
    expect(new Set(FINAL_PROTOTYPE_FAMILIES).size).toBe(22);
    expect(new Set(FINAL_PROTOTYPE_REGISTRY.map((item) => item.compositionId)).size).toBe(22);
    expect(new Set(FINAL_PROTOTYPE_REGISTRY.map((item) => item.animationId)).size).toBe(22);
  });

  it('matches all final recipes to existing catalog entries', () => {
    for (const recipe of FINAL_ANIMATION_RECIPES) {
      const entry = getAnimationLibraryEntry(recipe.animationId);
      expect(entry).toBeDefined();
      expect(entry?.visualFamily).toBe(recipe.family);
      expect(entry?.status).not.toBe('retired');
    }
  });

  it('uses the shared vertical render contract', () => {
    for (const registration of FINAL_PROTOTYPE_REGISTRY) {
      expect(registration.width).toBe(1080);
      expect(registration.height).toBe(1920);
      expect(registration.fps).toBe(30);
      expect(registration.durationInFrames).toBe(180);
      expect(registration.checkpoints).toEqual([0, 30, 60, 90, 120, 150, 179]);
      expect(registration.smokeCheckpoints).toEqual([0, 90, 179]);
    }
    expect(FINAL_PROTOTYPE_EXPECTED_ARTIFACTS).toBe(176);
  });
});
