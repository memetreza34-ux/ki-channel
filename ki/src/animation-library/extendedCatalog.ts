import {ANIMATION_LIBRARY_ENTRIES} from './catalog';
import {ANIMATION_LIBRARY_EXPANSION_ENTRIES} from './catalogExpansion';
import {
  animationLibraryDocumentSchema,
  type AnimationLibraryEntry,
} from './schema';

export const EXTENDED_ANIMATION_LIBRARY = animationLibraryDocumentSchema.parse({
  version: 1,
  updatedAt: '2026-08-04T15:14:00.000Z',
  entries: [
    ...ANIMATION_LIBRARY_ENTRIES,
    ...ANIMATION_LIBRARY_EXPANSION_ENTRIES,
  ],
});

export const EXTENDED_ANIMATION_LIBRARY_ENTRIES =
  EXTENDED_ANIMATION_LIBRARY.entries;

export const getExtendedAnimationLibraryEntry = (
  animationId: string,
): AnimationLibraryEntry | undefined =>
  EXTENDED_ANIMATION_LIBRARY_ENTRIES.find(
    (entry) => entry.animationId === animationId,
  );

export const getExtendedAnimationFamilyEntries = (
  visualFamily: string,
): AnimationLibraryEntry[] =>
  EXTENDED_ANIMATION_LIBRARY_ENTRIES.filter(
    (entry) => entry.visualFamily === visualFamily,
  );

export const EXTENDED_LIBRARY_SUMMARY = Object.freeze({
  totalConcepts: EXTENDED_ANIMATION_LIBRARY_ENTRIES.length,
  visualFamilies: new Set(
    EXTENDED_ANIMATION_LIBRARY_ENTRIES.map((entry) => entry.visualFamily),
  ).size,
  executableOrVerified: EXTENDED_ANIMATION_LIBRARY_ENTRIES.filter(
    (entry) => entry.status === 'prototype' || entry.status === 'verified',
  ).length,
  conceptsAwaitingImplementation: EXTENDED_ANIMATION_LIBRARY_ENTRIES.filter(
    (entry) => entry.status === 'concept',
  ).length,
});
