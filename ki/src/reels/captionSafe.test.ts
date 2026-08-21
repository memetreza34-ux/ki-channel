import {describe, expect, it} from 'vitest';
import {REEL_CAPTION_SAFE} from './captionSafe';
import {REEL_LAYOUT_SAFE} from './reelLayout';

describe('reel caption feed-safe geometry', () => {
  it('keeps captions above lower feed UI', () => {
    expect(REEL_CAPTION_SAFE.bottom).toBe(520);
    expect(REEL_CAPTION_SAFE.bottom).toBeGreaterThanOrEqual(500);
    expect(REEL_CAPTION_SAFE.lowerCriticalDeadZone).toBe(420);
    expect(REEL_CAPTION_SAFE.lowerBufferEnd).toBe(500);
  });

  it('keeps horizontal room away from feed interaction UI', () => {
    expect(REEL_CAPTION_SAFE.horizontalInset).toBe(104);
    expect(REEL_CAPTION_SAFE.maxWidth).toBe(820);
  });

  it('keeps caption density smartphone-readable', () => {
    expect(REEL_CAPTION_SAFE.maxWordsPerGroup).toBe(6);
    expect(REEL_CAPTION_SAFE.maxVisibleLines).toBe(2);
    expect(REEL_CAPTION_SAFE.fontSize).toBe(48);
    expect(REEL_CAPTION_SAFE.preferredVisualEndY).toBe(1120);
    expect(REEL_CAPTION_SAFE.preferredVisualEndYMax).toBe(1160);
  });

  it('keeps header, animation and caption in separate vertical zones', () => {
    expect(REEL_LAYOUT_SAFE.header.top).toBe(110);
    expect(REEL_LAYOUT_SAFE.header.top + REEL_LAYOUT_SAFE.header.height).toBeLessThan(REEL_LAYOUT_SAFE.animation.top);
    expect(REEL_LAYOUT_SAFE.animation.endY).toBe(1160);
    expect(REEL_LAYOUT_SAFE.animation.minimumCaptionGap).toBe(100);
  });
});
