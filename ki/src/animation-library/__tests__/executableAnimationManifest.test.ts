import {describe, expect, it} from 'vitest';
import {
  EXECUTABLE_ANIMATION_MANIFEST_IDS,
  mergeExecutableAnimationSources,
} from '../executableAnimationManifest';

describe('executable animation manifest', () => {
  it('contains the current 88 executable animation ids', () => {
    expect(EXECUTABLE_ANIMATION_MANIFEST_IDS).toHaveLength(88);
    expect(new Set(EXECUTABLE_ANIMATION_MANIFEST_IDS).size).toBe(88);
  });

  it('allows the same executable id to appear in different sources during content-aware promotion', () => {
    expect(
      mergeExecutableAnimationSources({
        recipes: ['animation-a', 'animation-b'],
        contentRender: ['animation-b', 'animation-c'],
      }),
    ).toEqual(['animation-a', 'animation-b', 'animation-c']);
  });

  it('rejects duplicate ids inside one executable source', () => {
    expect(() =>
      mergeExecutableAnimationSources({
        recipes: ['animation-a', 'animation-a'],
        contentRender: ['animation-b'],
      }),
    ).toThrow('recipes contains duplicate animation ids');
  });
});
