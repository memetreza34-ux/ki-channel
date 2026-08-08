import {ADVANCED_ANIMATION_RECIPES} from './advancedRecipes';
import {EXPERIMENTAL_ANIMATION_RECIPES} from './experimentalRecipes';
import {FINAL_ANIMATION_RECIPES} from './finalRecipes';
import rawPrototypeRenderConfig from './prototype-render-config.json';

const manifestIds = [
  ...rawPrototypeRenderConfig.prototypes.map((prototype) => prototype.animationId),
  ...EXPERIMENTAL_ANIMATION_RECIPES.map((recipe) => recipe.animationId),
  ...ADVANCED_ANIMATION_RECIPES.map((recipe) => recipe.animationId),
  ...FINAL_ANIMATION_RECIPES.map((recipe) => recipe.animationId),
];

if (new Set(manifestIds).size !== manifestIds.length) {
  throw new Error('executable animation manifest contains duplicate animation ids');
}

export const EXECUTABLE_ANIMATION_MANIFEST_IDS = Object.freeze(
  [...manifestIds].sort(),
);
