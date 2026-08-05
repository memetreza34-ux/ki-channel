import {MOTION_RENDER_CONFIG} from './renderConfig';
import type {MotionVisualType} from './schema';

export const toMotionCompositionId = (type: MotionVisualType): string =>
  `Motion-${type}`.replace(
    /(^|-)([a-z])/g,
    (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`,
  );

export const MOTION_TIMELINE_COMPOSITION_ID =
  MOTION_RENDER_CONFIG.timeline.compositionId;

export const isValidMotionCompositionId = (value: string): boolean =>
  /^[A-Za-z0-9-]+$/.test(value) && value.startsWith('Motion-');
