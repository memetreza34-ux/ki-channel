import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  CREATIVE_RECIPE_IDS,
} from '../creativeRecipeCatalog';
import {
  CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS,
} from '../CreativeRecipeGalleryRoot';

const renderScript = readFileSync(
  resolve('scripts/render-creative-recipes.mjs'),
  'utf8',
);

const scriptRecipeIds = (() => {
  const match = /const CREATIVE_RECIPE_IDS = \[([\s\S]*?)\];/.exec(renderScript);
  if (!match) throw new Error('render script is missing CREATIVE_RECIPE_IDS');
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
})();

describe('Creative Recipe render configuration', () => {
  it('keeps the render runner aligned with the canonical recipe catalog', () => {
    expect(scriptRecipeIds).toEqual([...CREATIVE_RECIPE_IDS]);
  });

  it('keeps gallery composition ids unique and aligned with the catalog', () => {
    expect(CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS).toEqual(
      CREATIVE_RECIPE_IDS.map((recipeId) => `CreativeRecipe-${recipeId}`),
    );
    expect(new Set(CREATIVE_RECIPE_GALLERY_COMPOSITION_IDS).size).toBe(
      CREATIVE_RECIPE_IDS.length,
    );
  });

  it('keeps the isolated recipe canvas and deterministic checkpoints in the runner', () => {
    expect(renderScript).toContain('width: 1080');
    expect(renderScript).toContain('height: 1100');
    expect(renderScript).toContain('durationInFrames: 180');
    expect(renderScript).toContain('const SMOKE_CHECKPOINTS = [0, 90, 179]');
  });
});
