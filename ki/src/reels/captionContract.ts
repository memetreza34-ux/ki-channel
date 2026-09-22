import type {Caption} from '@remotion/captions';

export type ReelCaption = Caption;

const finite = (value: number): boolean => Number.isFinite(value);

/**
 * Validates the final Phase-3 caption timeline that is actually used for render.
 * Planning cues may be looser, but final captions must satisfy this contract.
 */
export const assertReelCaptionTimeline = (
  captions: readonly ReelCaption[],
): void => {
  let previousStart = -1;

  captions.forEach((caption, index) => {
    if (!caption.text.trim()) {
      throw new Error(`Caption ${index}: text must not be empty.`);
    }
    if (!finite(caption.startMs) || !finite(caption.endMs)) {
      throw new Error(`Caption ${index}: startMs/endMs must be finite.`);
    }
    if (caption.startMs < 0) {
      throw new Error(`Caption ${index}: startMs must be >= 0.`);
    }
    if (caption.endMs <= caption.startMs) {
      throw new Error(`Caption ${index}: endMs must be greater than startMs.`);
    }
    if (caption.startMs < previousStart) {
      throw new Error(`Caption ${index}: captions must be sorted by startMs.`);
    }
    if (caption.timestampMs !== null && !finite(caption.timestampMs)) {
      throw new Error(`Caption ${index}: timestampMs must be finite or null.`);
    }
    if (caption.confidence !== null && !finite(caption.confidence)) {
      throw new Error(`Caption ${index}: confidence must be finite or null.`);
    }
    previousStart = caption.startMs;
  });
};

export const captionMsToFrame = (milliseconds: number, fps: number): number => {
  if (!finite(milliseconds) || milliseconds < 0) {
    throw new Error('milliseconds must be a finite number >= 0.');
  }
  if (!finite(fps) || fps <= 0) {
    throw new Error('fps must be a finite number > 0.');
  }
  return Math.round((milliseconds / 1000) * fps);
};

export const findCaptionAtMs = (
  captions: readonly ReelCaption[],
  milliseconds: number,
): ReelCaption | null => {
  if (!finite(milliseconds) || milliseconds < 0) return null;
  return captions.find(
    (caption) => milliseconds >= caption.startMs && milliseconds < caption.endMs,
  ) ?? null;
};
