import type {Caption} from '@remotion/captions';
import {REEL_CAPTION_SAFE} from './captionSafe';

export type ReelCaption = Caption;

const finite = (value: number): boolean => Number.isFinite(value);

export const countReelCaptionWords = (text: string): number => (
  text.match(/[\p{L}\p{N}]+(?:[’'_-][\p{L}\p{N}]+)*/gu)?.length ?? 0
);

const visibleLineCount = (text: string): number => text.split(/\r?\n/).length;

/**
 * Validates the final Phase-3 caption timeline that is actually used for render.
 * Captions are deliberately kept short: long spoken passages must be split into
 * multiple timed groups instead of shrinking, clipping or showing 3+ lines.
 */
export const assertReelCaptionTimeline = (
  captions: readonly ReelCaption[],
): void => {
  let previousStart = -1;

  captions.forEach((caption, index) => {
    if (!caption.text.trim()) {
      throw new Error(`Caption ${index}: text must not be empty.`);
    }
    const wordCount = countReelCaptionWords(caption.text);
    if (wordCount > REEL_CAPTION_SAFE.maxWordsPerGroup) {
      throw new Error(
        `Caption ${index}: ${wordCount} words exceed maxWordsPerGroup=${REEL_CAPTION_SAFE.maxWordsPerGroup}; split the cue.`,
      );
    }
    const lineCount = visibleLineCount(caption.text);
    if (lineCount > REEL_CAPTION_SAFE.maxVisibleLines) {
      throw new Error(
        `Caption ${index}: ${lineCount} explicit lines exceed maxVisibleLines=${REEL_CAPTION_SAFE.maxVisibleLines}; split the cue.`,
      );
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
