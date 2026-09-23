import {describe, expect, it} from 'vitest';
import {REEL_CAPTION_SAFE} from './captionSafe';

describe('reel caption feed-safe geometry', () => {
  it('keeps captions visibly lower while preserving a critical UI buffer', () => {
    expect(REEL_CAPTION_SAFE.bottom).toBe(300);
    expect(REEL_CAPTION_SAFE.bottom).toBeGreaterThanOrEqual(280);
    expect(REEL_CAPTION_SAFE.lowerCriticalDeadZone).toBe(220);
    expect(REEL_CAPTION_SAFE.lowerBufferEnd).toBe(280);
  });

  it('keeps horizontal room away from feed interaction UI', () => {
    expect(REEL_CAPTION_SAFE.horizontalInset).toBe(104);
    expect(REEL_CAPTION_SAFE.maxWidth).toBe(820);
  });

  it('keeps caption density smartphone-readable', () => {
    expect(REEL_CAPTION_SAFE.maxWordsPerGroup).toBe(6);
    expect(REEL_CAPTION_SAFE.maxVisibleLines).toBe(2);
    expect(REEL_CAPTION_SAFE.preferredVisualEndY).toBe(1380);
    expect(REEL_CAPTION_SAFE.preferredVisualEndYMax).toBe(1420);
  });
});
