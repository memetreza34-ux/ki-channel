import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_EXPANSION_ENTRIES} from '../catalogExpansion';
import {animationLibraryEntrySchema} from '../schema';

describe('animation library expansion', () => {
  it('adds 44 valid animation concepts across all 22 families', () => {
    expect(ANIMATION_LIBRARY_EXPANSION_ENTRIES).toHaveLength(44);
    const families = new Map<string, number>();
    for (const entry of ANIMATION_LIBRARY_EXPANSION_ENTRIES) {
      expect(() => animationLibraryEntrySchema.parse(entry)).not.toThrow();
      families.set(entry.visualFamily, (families.get(entry.visualFamily) ?? 0) + 1);
    }
    expect(families.size).toBe(22);
    expect([...families.values()].every((count) => count === 2)).toBe(true);
  });

  it('keeps all ids, layouts, and motion signatures unique', () => {
    expect(new Set(ANIMATION_LIBRARY_EXPANSION_ENTRIES.map((entry) => entry.animationId)).size).toBe(44);
    expect(new Set(ANIMATION_LIBRARY_EXPANSION_ENTRIES.map((entry) => entry.layoutFamily)).size).toBe(44);
    expect(new Set(ANIMATION_LIBRARY_EXPANSION_ENTRIES.map((entry) => entry.motionSignature)).size).toBe(44);
  });

  it('starts as unverified concepts until code and renders exist', () => {
    expect(ANIMATION_LIBRARY_EXPANSION_ENTRIES.every((entry) => entry.status === 'concept')).toBe(true);
    expect(ANIMATION_LIBRARY_EXPANSION_ENTRIES.every((entry) => entry.qualityPrior.productionConfidence < 50)).toBe(true);
  });
});
