import {describe, expect, it} from 'vitest';
import {AI_IMAGE_UNDERSTANDING_CAPTION_ZONE_Y, AI_IMAGE_UNDERSTANDING_DURATION_IN_FRAMES, AI_IMAGE_UNDERSTANDING_SCENES, AI_IMAGE_UNDERSTANDING_SUBTITLES} from './contract';

describe('AI image understanding reel contract', () => {
  it('keeps the canonical vertical production bounds', () => {
    expect(AI_IMAGE_UNDERSTANDING_DURATION_IN_FRAMES).toBe(1710);
    expect(AI_IMAGE_UNDERSTANDING_CAPTION_ZONE_Y).toBe(1440);
  });

  it('has five contiguous scenes covering the full baseline', () => {
    expect(AI_IMAGE_UNDERSTANDING_SCENES).toHaveLength(5);
    expect(AI_IMAGE_UNDERSTANDING_SCENES[0]?.startFrame).toBe(0);
    for (let i = 1; i < AI_IMAGE_UNDERSTANDING_SCENES.length; i++) {
      expect(AI_IMAGE_UNDERSTANDING_SCENES[i]?.startFrame).toBe(AI_IMAGE_UNDERSTANDING_SCENES[i - 1]?.endFrame);
    }
    expect(AI_IMAGE_UNDERSTANDING_SCENES.at(-1)?.endFrame).toBe(AI_IMAGE_UNDERSTANDING_DURATION_IN_FRAMES);
  });

  it('keeps every subtitle cue inside its owning scene and covers the baseline', () => {
    expect(AI_IMAGE_UNDERSTANDING_SUBTITLES[0]?.startFrame).toBe(0);
    expect(AI_IMAGE_UNDERSTANDING_SUBTITLES.at(-1)?.endFrame).toBe(AI_IMAGE_UNDERSTANDING_DURATION_IN_FRAMES);
    for (const cue of AI_IMAGE_UNDERSTANDING_SUBTITLES) {
      const scene = AI_IMAGE_UNDERSTANDING_SCENES.find((item) => item.sceneId === cue.sceneId);
      expect(scene).toBeTruthy();
      expect(cue.startFrame).toBeGreaterThanOrEqual(scene?.startFrame ?? Infinity);
      expect(cue.endFrame).toBeLessThanOrEqual(scene?.endFrame ?? -Infinity);
    }
  });

  it('uses distinct audience-facing scene headlines', () => {
    expect(new Set(AI_IMAGE_UNDERSTANDING_SCENES.map((scene) => scene.headline)).size).toBe(5);
  });
});
