import {EXTENDED_ANIMATION_LIBRARY_ENTRIES} from './extendedCatalog';
import {
  getProductionReadyLibraryEntries,
  PRODUCTION_READY_LIBRARY_ANIMATION_IDS,
} from './productionEligibility';
import type {AnimationLibraryEntry} from './schema';

export const CANONICAL_PRODUCTION_ANIMATION_ENTRIES = Object.freeze(
  getProductionReadyLibraryEntries(EXTENDED_ANIMATION_LIBRARY_ENTRIES),
);

export const CANONICAL_PRODUCTION_ANIMATION_IDS = Object.freeze(
  CANONICAL_PRODUCTION_ANIMATION_ENTRIES.map((entry) => entry.animationId).sort(),
);

const expectedProductionIds = [...PRODUCTION_READY_LIBRARY_ANIMATION_IDS].sort();
const actualProductionIds = [...CANONICAL_PRODUCTION_ANIMATION_IDS].sort();

if (JSON.stringify(actualProductionIds) !== JSON.stringify(expectedProductionIds)) {
  const actual = new Set(actualProductionIds);
  const expected = new Set(expectedProductionIds);
  const missing = expectedProductionIds.filter((id) => !actual.has(id));
  const unexpected = actualProductionIds.filter((id) => !expected.has(id));
  throw new Error(
    `canonical production catalog mismatch; missing=[${missing.join(', ')}], unexpected=[${unexpected.join(', ')}]`,
  );
}

const productionIdSet = new Set(CANONICAL_PRODUCTION_ANIMATION_IDS);

export const PREVIEW_ONLY_ANIMATION_ENTRIES = Object.freeze(
  EXTENDED_ANIMATION_LIBRARY_ENTRIES.filter(
    (entry) => !productionIdSet.has(entry.animationId),
  ),
);

export const getCanonicalProductionAnimationEntry = (
  animationId: string,
): AnimationLibraryEntry | undefined =>
  CANONICAL_PRODUCTION_ANIMATION_ENTRIES.find(
    (entry) => entry.animationId === animationId,
  );

export const PRODUCTION_CATALOG_SUMMARY = Object.freeze({
  productionReady: CANONICAL_PRODUCTION_ANIMATION_ENTRIES.length,
  previewOnly: PREVIEW_ONLY_ANIMATION_ENTRIES.length,
  productionVisualFamilies: new Set(
    CANONICAL_PRODUCTION_ANIMATION_ENTRIES.map((entry) => entry.visualFamily),
  ).size,
});
