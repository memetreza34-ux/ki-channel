import {describe, expect, it} from 'vitest';
import {
  CANONICAL_PRODUCTION_ANIMATION_ENTRIES,
  CANONICAL_PRODUCTION_ANIMATION_IDS,
  PREVIEW_ONLY_ANIMATION_ENTRIES,
} from '../productionCatalog';
import {PRODUCTION_READY_LIBRARY_ANIMATION_IDS} from '../productionEligibility';

describe('canonical production animation catalog', () => {
  it('matches the exact production-ready runtime ID set', () => {
    expect([...CANONICAL_PRODUCTION_ANIMATION_IDS].sort()).toEqual(
      [...PRODUCTION_READY_LIBRARY_ANIMATION_IDS].sort(),
    );
  });

  it('contains only reusable production statuses', () => {
    expect(CANONICAL_PRODUCTION_ANIMATION_ENTRIES.length).toBeGreaterThan(0);
    expect(
      CANONICAL_PRODUCTION_ANIMATION_ENTRIES.every(
        (entry) => entry.status === 'prototype' || entry.status === 'verified',
      ),
    ).toBe(true);
  });

  it('keeps non-production concepts in preview space instead of silently promoting them', () => {
    const productionIds = new Set(CANONICAL_PRODUCTION_ANIMATION_IDS);
    expect(
      PREVIEW_ONLY_ANIMATION_ENTRIES.every(
        (entry) => !productionIds.has(entry.animationId),
      ),
    ).toBe(true);
  });
});
