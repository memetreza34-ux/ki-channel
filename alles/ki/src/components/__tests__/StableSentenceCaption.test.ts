import {describe, expect, it} from 'vitest';
import {getSentenceProgress} from '../StableSentenceCaption';

describe('getSentenceProgress', () => {
  it('stays at zero before the sentence starts', () => {
    expect(getSentenceProgress(5, 10, 40)).toBe(0);
  });

  it('tracks the real sentence duration linearly', () => {
    expect(getSentenceProgress(25, 10, 40)).toBe(0.5);
  });

  it('stays at one after the sentence ends', () => {
    expect(getSentenceProgress(50, 10, 40)).toBe(1);
  });

  it('handles an invalid zero-length cue safely', () => {
    expect(getSentenceProgress(10, 10, 10)).toBe(1);
  });
});
