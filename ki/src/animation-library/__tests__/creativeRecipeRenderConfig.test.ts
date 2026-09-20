import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {CREATIVE_RECIPE_IDS} from '../creativeRecipeCatalog';
import {CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS} from '../CreativeRecipeGalleryRoot';

const renderScript = readFileSync(
  resolve('scripts/render-creative-recipes.mjs'),
  'utf8',
);
const releaseContract = readFileSync(
  resolve('scripts/creative-recipe-release-contract.mjs'),
  'utf8',
);

const contractRecipeIds = (() => {
  const match = /CREATIVE_RECIPE_IDS = Object\.freeze\(\[([\s\S]*?)\]\);/.exec(
    releaseContract,
  );
  if (!match) {
    throw new Error('creative recipe release contract is missing CREATIVE_RECIPE_IDS');
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
})();

describe('Creative Recipe render configuration', () => {
  it('keeps release contract aligned with the canonical recipe catalog', () => {
    expect(contractRecipeIds).toEqual([...CREATIVE_RECIPE_IDS]);
  });

  it('keeps gallery composition ids unique and aligned with the catalog', () => {
    expect(CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS).toEqual(
      CREATIVE_RECIPE_IDS.map((recipeId) => `CreativeRecipe-${recipeId}`),
    );
    expect(new Set(CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS).size).toBe(
      CREATIVE_RECIPE_IDS.length,
    );
  });

  it('forces the render runner to consume the shared release contract', () => {
    expect(renderScript).toContain("from './creative-recipe-release-contract.mjs'");
    expect(renderScript).toContain('CREATIVE_RECIPE_RENDER_CONTRACT.width');
    expect(renderScript).toContain('CREATIVE_RECIPE_RENDER_CONTRACT.height');
    expect(renderScript).toContain('CREATIVE_RECIPE_RENDER_CONTRACT.durationInFrames');
    expect(renderScript).toContain('CREATIVE_RECIPE_RENDER_CONTRACT.smokeCheckpoints');
  });

  it('keeps the isolated recipe canvas and deterministic checkpoints in the shared contract', () => {
    expect(releaseContract).toContain('width: 1080');
    expect(releaseContract).toContain('height: 1100');
    expect(releaseContract).toContain('durationInFrames: 180');
    expect(releaseContract).toContain('smokeCheckpoints: Object.freeze([0, 90, 179])');
  });
});
