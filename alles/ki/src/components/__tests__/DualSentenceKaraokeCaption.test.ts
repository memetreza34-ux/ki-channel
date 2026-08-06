import {describe, expect, it} from 'vitest';
import {getActiveWordIndex, type KaraokeWordCue} from '../DualSentenceKaraokeCaption';

const words: KaraokeWordCue[] = [
  {text: 'Die', startFrame: 10, endFrame: 15},
  {text: 'KI', startFrame: 15, endFrame: 22},
  {text: 'spricht.', startFrame: 22, endFrame: 31},
];

describe('DualSentenceKaraokeCaption', () => {
  it('tracks exactly one active word from real frame timings', () => {
    expect(getActiveWordIndex(words, 9)).toBe(-1);
    expect(getActiveWordIndex(words, 10)).toBe(0);
    expect(getActiveWordIndex(words, 18)).toBe(1);
    expect(getActiveWordIndex(words, 30)).toBe(2);
    expect(getActiveWordIndex(words, 31)).toBe(-1);
  });
});
