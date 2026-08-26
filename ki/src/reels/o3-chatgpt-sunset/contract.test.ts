import {describe, expect, it} from 'vitest';
import {O3_SUNSET_DURATION_IN_FRAMES, O3_SUNSET_SCENES} from './contract';

describe('o3 ChatGPT sunset reel contract', () => {
  it('has one continuous five-scene timeline', () => {
    expect(O3_SUNSET_SCENES).toHaveLength(5);
    expect(O3_SUNSET_SCENES[0].startFrame).toBe(0);
    for (let i = 1; i < O3_SUNSET_SCENES.length; i += 1) {
      expect(O3_SUNSET_SCENES[i].startFrame).toBe(O3_SUNSET_SCENES[i - 1].endFrame);
    }
    expect(O3_SUNSET_SCENES.at(-1)?.endFrame).toBe(O3_SUNSET_DURATION_IN_FRAMES);
  });
});
