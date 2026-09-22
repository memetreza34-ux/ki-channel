import {describe, expect, it} from 'vitest';
import type {ReelCaption} from './captionContract';
import {
  assertReelCaptionTimeline,
  captionMsToFrame,
  findCaptionAtMs,
} from './captionContract';

const captions: ReelCaption[] = [
  {
    text: 'Diese Quelle',
    startMs: 0,
    endMs: 900,
    timestampMs: 0,
    confidence: 0.99,
  },
  {
    text: 'existiert nicht.',
    startMs: 900,
    endMs: 1900,
    timestampMs: 900,
    confidence: 0.98,
  },
];

describe('captionContract', () => {
  it('accepts a sorted final caption timeline', () => {
    expect(() => assertReelCaptionTimeline(captions)).not.toThrow();
  });

  it('rejects empty or invalid captions', () => {
    expect(() => assertReelCaptionTimeline([
      {...captions[0], text: '   '},
    ])).toThrow(/text must not be empty/);

    expect(() => assertReelCaptionTimeline([
      {...captions[0], endMs: 0},
    ])).toThrow(/endMs must be greater/);
  });

  it('rejects an unsorted timeline', () => {
    expect(() => assertReelCaptionTimeline([
      captions[1],
      captions[0],
    ])).toThrow(/sorted by startMs/);
  });

  it('converts milliseconds to frames deterministically', () => {
    expect(captionMsToFrame(1000, 30)).toBe(30);
    expect(captionMsToFrame(1500, 30)).toBe(45);
  });

  it('finds the active caption with end-exclusive timing', () => {
    expect(findCaptionAtMs(captions, 899)?.text).toBe('Diese Quelle');
    expect(findCaptionAtMs(captions, 900)?.text).toBe('existiert nicht.');
    expect(findCaptionAtMs(captions, 1900)).toBeNull();
  });
});
