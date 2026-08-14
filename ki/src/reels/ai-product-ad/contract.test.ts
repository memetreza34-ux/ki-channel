import {describe, expect, it} from 'vitest';
import {AI_PRODUCT_AD_CAPTION_ZONE_Y, AI_PRODUCT_AD_DURATION_IN_FRAMES, AI_PRODUCT_AD_SCENES, AI_PRODUCT_AD_SUBTITLES} from './contract';

describe('AI product ad reel contract', () => {
  it('covers the full timeline with five contiguous scenes', () => {
    expect(AI_PRODUCT_AD_SCENES).toHaveLength(5);
    expect(AI_PRODUCT_AD_SCENES[0]?.startFrame).toBe(0);
    expect(AI_PRODUCT_AD_SCENES.at(-1)?.endFrame).toBe(AI_PRODUCT_AD_DURATION_IN_FRAMES);
    for (let i=1;i<AI_PRODUCT_AD_SCENES.length;i++) {
      expect(AI_PRODUCT_AD_SCENES[i-1]?.endFrame).toBe(AI_PRODUCT_AD_SCENES[i]?.startFrame);
    }
  });

  it('keeps caption zone hard-coded and subtitles inside duration', () => {
    expect(AI_PRODUCT_AD_CAPTION_ZONE_Y).toBe(1440);
    for (const cue of AI_PRODUCT_AD_SUBTITLES) {
      expect(cue.startFrame).toBeGreaterThanOrEqual(0);
      expect(cue.endFrame).toBeLessThanOrEqual(AI_PRODUCT_AD_DURATION_IN_FRAMES);
      expect(cue.endFrame).toBeGreaterThan(cue.startFrame);
    }
  });

  it('has no long subtitle gap in the planned timeline', () => {
    for (let i=1;i<AI_PRODUCT_AD_SUBTITLES.length;i++) {
      expect(AI_PRODUCT_AD_SUBTITLES[i]?.startFrame).toBe(AI_PRODUCT_AD_SUBTITLES[i-1]?.endFrame);
    }
  });
});
