import {animationLibraryDocumentSchema} from './schema';
import type {AnimationLibraryEntry} from './schema';
import {
  ANIMATION_LIBRARY as RAW_ANIMATION_LIBRARY,
  ANIMATION_LIBRARY_ENTRIES as RAW_ANIMATION_LIBRARY_ENTRIES,
} from './catalogData';

/**
 * Historical catalog seeds predate the executable prototype registry for two
 * input/output variants. Keep the raw creative data intact and correct only
 * the canonical production metadata here so every consumer sees one truth.
 */
const STATUS_OVERRIDES: Readonly<Record<string, AnimationLibraryEntry['status']>> = {
  'input-output-cause-effect-bridge-v1': 'concept',
  'input-output-funnel-compression-output-v1': 'prototype',
};

const entries: AnimationLibraryEntry[] = RAW_ANIMATION_LIBRARY_ENTRIES.map((entry) => {
  const status = STATUS_OVERRIDES[entry.animationId];
  return status && status !== entry.status ? {...entry, status} : entry;
});

export const ANIMATION_LIBRARY = animationLibraryDocumentSchema.parse({
  ...RAW_ANIMATION_LIBRARY,
  entries,
});

export const ANIMATION_LIBRARY_ENTRIES = ANIMATION_LIBRARY.entries;

export const getAnimationLibraryEntry = (
  animationId: string,
): AnimationLibraryEntry | undefined =>
  ANIMATION_LIBRARY_ENTRIES.find((entry) => entry.animationId === animationId);

export const getAnimationFamilyEntries = (
  visualFamily: string,
): AnimationLibraryEntry[] =>
  ANIMATION_LIBRARY_ENTRIES.filter(
    (entry) => entry.visualFamily === visualFamily,
  );
