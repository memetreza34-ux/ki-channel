import {describe, expect, it} from 'vitest';
import {getSingleCaptionActiveWordIndex, type SingleCaptionWordCue} from '../SingleSentenceKaraokeCaption';

const words: SingleCaptionWordCue[] = [
  {text: 'Die', startFrame: 10, endFrame: 15},
  {text: 'KI', startFrame: 15, endFrame: 22},
  {text: 'antwortet.', startFrame: 22, endFrame: 33},
];

describe('SingleSentenceKaraokeCaption', () => {
  it('highlights exactly the word active in the real transcript interval', () => {
    expect(getSingleCaptionActiveWordIndex(words, 9)).toBe(-1);
    expect(getSingleCaptionActiveWordIndex(words, 10)).toBe(0);
    expect(getSingleCaptionActiveWordIndex(words, 19)).toBe(1);
    expect(getSingleCaptionActiveWordIndex(words, 32)).toBe(2);
    expect(getSingleCaptionActiveWordIndex(words, 33)).toBe(-1);
  });
});
