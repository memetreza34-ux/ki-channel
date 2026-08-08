import {ADVANCED_ANIMATION_RECIPES} from './advancedRecipes';
import {EXPERIMENTAL_ANIMATION_RECIPES} from './experimentalRecipes';
import {FINAL_ANIMATION_RECIPES} from './finalRecipes';
import rawPrototypeRenderConfig from './prototype-render-config.json';

export const mergeExecutableAnimationSources = (
  sources: Readonly<Record<string, readonly string[]>>,
): string[] => {
  const union = new Set<string>();
  for (const [label, ids] of Object.entries(sources)) {
    if (new Set(ids).size !== ids.length) {
      throw new Error(`${label} contains duplicate animation ids`);
    }
    for (const animationId of ids) union.add(animationId);
  }
  return [...union].sort();
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

// Cross-source overlap is intentional: when an already executable recipe becomes
// fully content-aware, that same animationId is added to the content-render config.
// The executable manifest is therefore the UNION of all executable sources, while
// duplicate IDs inside a single source still indicate a configuration error.
export const EXECUTABLE_ANIMATION_MANIFEST_IDS = Object.freeze(
  mergeExecutableAnimationSources({
    'content render config': contentRenderIds,
    'experimental animation recipes': experimentalIds,
    'advanced animation recipes': advancedIds,
    'final animation recipes': finalIds,
  }),
);
