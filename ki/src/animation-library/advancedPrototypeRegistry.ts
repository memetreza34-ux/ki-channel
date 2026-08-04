import type {ComponentType} from 'react';
import {ADVANCED_ANIMATION_RECIPES} from './advancedRecipes';
import {getAnimationLibraryEntry} from './catalog';
import {createAdvancedVariantComponent} from './prototypes/AdvancedVariantPrototype';

export type AdvancedPrototypeRegistration = {
  compositionId: string;
  animationId: string;
  component: ComponentType;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  checkpoints: readonly number[];
  smokeCheckpoints: readonly number[];
};

const DEFAULTS = Object.freeze({
  durationInFrames: 180,
  fps: 30,
  width: 1080,
  height: 1920,
  checkpoints: Object.freeze([0, 30, 60, 90, 120, 150, 179]),
  smokeCheckpoints: Object.freeze([0, 90, 179]),
});

export const ADVANCED_PROTOTYPE_REGISTRY: AdvancedPrototypeRegistration[] =
  ADVANCED_ANIMATION_RECIPES.map((recipe) => {
    const entry = getAnimationLibraryEntry(recipe.animationId);
    if (!entry) {
      throw new Error(`advanced variant is absent from catalog: ${recipe.animationId}`);
    }
    if (entry.status === 'retired') {
      throw new Error(`retired animation cannot be registered: ${recipe.animationId}`);
    }
    if (entry.visualFamily !== recipe.family) {
      throw new Error(
        `advanced recipe family mismatch for ${recipe.animationId}: ${recipe.family} != ${entry.visualFamily}`,
      );
    }
    return {
      compositionId: recipe.compositionId,
      animationId: recipe.animationId,
      component: createAdvancedVariantComponent(recipe),
      ...DEFAULTS,
    };
  });

export const ADVANCED_PROTOTYPE_FAMILIES = ADVANCED_PROTOTYPE_REGISTRY.map(
  (registration) =>
    getAnimationLibraryEntry(registration.animationId)?.visualFamily ?? 'unknown',
);

export const ADVANCED_PROTOTYPE_EXPECTED_ARTIFACTS =
  ADVANCED_PROTOTYPE_REGISTRY.length * (DEFAULTS.checkpoints.length + 1);
