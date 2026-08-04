import {describe, expect, it} from 'vitest';
import {
  EXTENDED_ANIMATION_LIBRARY_ENTRIES,
  EXTENDED_LIBRARY_SUMMARY,
  getExtendedAnimationFamilyEntries,
} from '../extendedCatalog';

describe('extended animation catalog', () => {
  it('contains 132 concepts across 22 families', () => {
    expect(EXTENDED_ANIMATION_LIBRARY_ENTRIES).toHaveLength(132);
    expect(EXTENDED_LIBRARY_SUMMARY.totalConcepts).toBe(132);
    expect(EXTENDED_LIBRARY_SUMMARY.visualFamilies).toBe(22);
  });

  it('contains six concepts per visual family', () => {
    const families = new Set(
      EXTENDED_ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.visualFamily),
    );
    for (const family of families) {
      expect(getExtendedAnimationFamilyEntries(family)).toHaveLength(6);
    }
  });

  it('does not falsely mark the new concepts as executable or verified', () => {
    const newIds = new Set([
      'evidence-radar-sweep-v1',
      'token-cost-waterfall-v1',
      'memory-shelf-overflow-v1',
      'constraint-gate-maze-v1',
    ]);
    for (const entry of EXTENDED_ANIMATION_LIBRARY_ENTRIES) {
      if (newIds.has(entry.animationId)) expect(entry.status).toBe('concept');
    }
  });
});
