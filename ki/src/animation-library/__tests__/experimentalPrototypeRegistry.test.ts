import {describe, expect, it} from 'vitest';
import {getAnimationLibraryEntry} from '../catalog';
import {EXPERIMENTAL_ANIMATION_RECIPES} from '../experimentalRecipes';
import {
  EXPERIMENTAL_PROTOTYPE_EXPECTED_ARTIFACTS,
  EXPERIMENTAL_PROTOTYPE_FAMILIES,
  EXPERIMENTAL_PROTOTYPE_REGISTRY,
} from '../experimentalPrototypeRegistry';

describe('alternate animation registry', () => {
  it('registers one alternate composition for every visual family', () => {
    expect(EXPERIMENTAL_PROTOTYPE_REGISTRY).toHaveLength(22);
    expect(new Set(EXPERIMENTAL_PROTOTYPE_FAMILIES).size).toBe(22);
    expect(new Set(EXPERIMENTAL_PROTOTYPE_REGISTRY.map((item) => item.compositionId)).size).toBe(22);
    expect(new Set(EXPERIMENTAL_PROTOTYPE_REGISTRY.map((item) => item.animationId)).size).toBe(22);
  });

  it('matches every recipe to the catalog', () => {
    for (const recipe of EXPERIMENTAL_ANIMATION_RECIPES) {
      const entry = getAnimationLibraryEntry(recipe.animationId);
      expect(entry).toBeDefined();
      expect(entry?.visualFamily).toBe(recipe.family);
    }
  });

  it('uses one shared vertical render contract', () => {
    for (const registration of EXPERIMENTAL_PROTOTYPE_REGISTRY) {
      expect(registration.width).toBe(1080);
      expect(registration.height).toBe(1920);
      expect(registration.fps).toBe(30);
      expect(registration.durationInFrames).toBe(180);
      expect(registration.checkpoints).toEqual([0, 30, 60, 90, 120, 150, 179]);
      expect(registration.smokeCheckpoints).toEqual([0, 90, 179]);
    }
    expect(EXPERIMENTAL_PROTOTYPE_EXPECTED_ARTIFACTS).toBe(176);
  });
});
