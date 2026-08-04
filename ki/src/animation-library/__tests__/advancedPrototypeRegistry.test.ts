import {describe, expect, it} from 'vitest';
import {ADVANCED_ANIMATION_RECIPES} from '../advancedRecipes';
import {
  ADVANCED_PROTOTYPE_EXPECTED_ARTIFACTS,
  ADVANCED_PROTOTYPE_FAMILIES,
  ADVANCED_PROTOTYPE_REGISTRY,
} from '../advancedPrototypeRegistry';
import {getAnimationLibraryEntry} from '../catalog';

describe('advanced animation registry', () => {
  it('registers one third-wave animation for every visual family', () => {
    expect(ADVANCED_PROTOTYPE_REGISTRY).toHaveLength(22);
    expect(new Set(ADVANCED_PROTOTYPE_FAMILIES).size).toBe(22);
    expect(new Set(ADVANCED_PROTOTYPE_REGISTRY.map((item) => item.compositionId)).size).toBe(22);
    expect(new Set(ADVANCED_PROTOTYPE_REGISTRY.map((item) => item.animationId)).size).toBe(22);
  });

  it('matches all recipes to existing catalog entries', () => {
    for (const recipe of ADVANCED_ANIMATION_RECIPES) {
      const entry = getAnimationLibraryEntry(recipe.animationId);
      expect(entry).toBeDefined();
      expect(entry?.visualFamily).toBe(recipe.family);
      expect(entry?.status).not.toBe('retired');
    }
  });

  it('uses the shared vertical render contract', () => {
    for (const registration of ADVANCED_PROTOTYPE_REGISTRY) {
      expect(registration.width).toBe(1080);
      expect(registration.height).toBe(1920);
      expect(registration.fps).toBe(30);
      expect(registration.durationInFrames).toBe(180);
      expect(registration.checkpoints).toEqual([0, 30, 60, 90, 120, 150, 179]);
      expect(registration.smokeCheckpoints).toEqual([0, 90, 179]);
    }
    expect(ADVANCED_PROTOTYPE_EXPECTED_ARTIFACTS).toBe(176);
  });
});
