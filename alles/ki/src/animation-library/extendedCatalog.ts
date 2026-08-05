import {ANIMATION_LIBRARY_ENTRIES} from './catalog';
import {ANIMATION_LIBRARY_EXPANSION_ENTRIES} from './catalogExpansion';
import {
  animationLibraryDocumentSchema,
  type AnimationLibraryEntry,
} from './schema';

const FAMILY_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  'answer-generation': 'generation',
  'risk-truth': 'risk-contrast',
  'performance-scaling': 'scale-performance',
  'learning-updates': 'learning-update',
});

const normalizedExpansionEntries = ANIMATION_LIBRARY_EXPANSION_ENTRIES.map(
  (entry) => ({
    ...entry,
    visualFamily: FAMILY_ALIASES[entry.visualFamily] ?? entry.visualFamily,
  }),
);

export const EXTENDED_ANIMATION_LIBRARY = animationLibraryDocumentSchema.parse({
  version: 1,
  updatedAt: '2026-08-04T15:14:00.000Z',
  entries: [
    ...ANIMATION_LIBRARY_ENTRIES,
    ...normalizedExpansionEntries,
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
