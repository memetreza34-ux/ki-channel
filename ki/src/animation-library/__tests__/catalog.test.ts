import {describe, expect, it} from 'vitest';
import {
  ANIMATION_LIBRARY,
  ANIMATION_LIBRARY_ENTRIES,
  getAnimationFamilyEntries,
  getAnimationLibraryEntry,
} from '../catalog';

const unique = (values: readonly string[]): number => new Set(values).size;

describe('animation catalog', () => {
  it('contains 88 distinct animation blueprints across 22 families', () => {
    expect(ANIMATION_LIBRARY.version).toBe(1);
    expect(ANIMATION_LIBRARY_ENTRIES).toHaveLength(88);
    expect(
      unique(ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.animationId)),
    ).toBe(88);
    expect(
      unique(ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.visualFamily)),
    ).toBe(22);
  });

  it('provides four genuinely distinct variants for every family', () => {
    const families = new Set(
      ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.visualFamily),
    );

    for (const family of families) {
      const entries = getAnimationFamilyEntries(family);
      expect(entries).toHaveLength(4);
      expect(unique(entries.map((entry) => entry.layoutFamily))).toBe(4);
      expect(unique(entries.map((entry) => entry.motionSignature))).toBe(4);
      expect(unique(entries.map((entry) => entry.noveltyGroup))).toBe(4);
    }
  });

  it('has one implementation-priority prototype in every family', () => {
    const families = new Set(
      ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.visualFamily),
    );
    for (const family of families) {
      expect(
        getAnimationFamilyEntries(family).filter(
          (entry) => entry.status === 'prototype',
        ),
      ).toHaveLength(1);
    }
  });

  it('looks up animation entries by their stable ID', () => {
    const entry = getAnimationLibraryEntry(
      'learning-update-knowledge-tree-graft-v1',
    );
    expect(entry?.visualFamily).toBe('learning-update');
    expect(entry?.semanticTags).toContain('new-information');
  });
});
