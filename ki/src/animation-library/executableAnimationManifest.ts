import {ADVANCED_ANIMATION_RECIPES} from './advancedRecipes';
import {EXPERIMENTAL_ANIMATION_RECIPES} from './experimentalRecipes';
import {FINAL_ANIMATION_RECIPES} from './finalRecipes';
import rawPrototypeRenderConfig from './prototype-render-config.json';

const assertUniqueSource = (label: string, ids: readonly string[]): void => {
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${label} contains duplicate animation ids`);
  }
};

const contentRenderIds = rawPrototypeRenderConfig.prototypes.map(
  (prototype) => prototype.animationId,
);
const experimentalIds = EXPERIMENTAL_ANIMATION_RECIPES.map(
  (recipe) => recipe.animationId,
);
const advancedIds = ADVANCED_ANIMATION_RECIPES.map(
  (recipe) => recipe.animationId,
);
const finalIds = FINAL_ANIMATION_RECIPES.map((recipe) => recipe.animationId);

assertUniqueSource('content render config', contentRenderIds);
assertUniqueSource('experimental animation recipes', experimentalIds);
assertUniqueSource('advanced animation recipes', advancedIds);
assertUniqueSource('final animation recipes', finalIds);

// Cross-source overlap is intentional: when an already executable recipe becomes
// fully content-aware, that same animationId is added to the content-render config.
// The executable manifest is therefore the UNION of all executable sources, not a
// concatenation that treats legitimate promotion as a duplicate error.
export const EXECUTABLE_ANIMATION_MANIFEST_IDS = Object.freeze(
  [
    ...new Set([
      ...contentRenderIds,
      ...experimentalIds,
      ...advancedIds,
      ...finalIds,
    ]),
  ].sort(),
);
