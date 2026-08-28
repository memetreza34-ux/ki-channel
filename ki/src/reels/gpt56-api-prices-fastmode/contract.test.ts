import {describe, expect, it} from 'vitest';
import {
  GPT56_API_COMPOSITION_ID,
  GPT56_API_CUES,
  GPT56_API_DURATION_IN_FRAMES,
  GPT56_API_FPS,
  GPT56_API_HEIGHT,
  GPT56_API_SCENES,
  GPT56_API_WIDTH,
} from './contract';

describe('GPT-5.6 API prices + fast mode reel contract', () => {
  it('keeps the vertical production format', () => {
    expect(GPT56_API_COMPOSITION_ID).toBe('KI-GPT56APIPricesFastMode');
    expect(GPT56_API_WIDTH).toBe(1080);
    expect(GPT56_API_HEIGHT).toBe(1920);
    expect(GPT56_API_FPS).toBe(30);
    expect(GPT56_API_DURATION_IN_FRAMES).toBeGreaterThan(0);
  });

  it('has five ordered scenes and caption coverage', () => {
    expect(GPT56_API_SCENES).toHaveLength(5);
    expect(GPT56_API_SCENES.map((scene) => scene.sceneId)).toEqual(['scene1','scene2','scene3','scene4','scene5']);
    expect(GPT56_API_CUES.length).toBeGreaterThanOrEqual(5);
    for (const cue of GPT56_API_CUES) {
      expect(cue.endFrame).toBeGreaterThan(cue.startFrame);
      expect(cue.text.trim().length).toBeGreaterThan(0);
    }
  });
});
