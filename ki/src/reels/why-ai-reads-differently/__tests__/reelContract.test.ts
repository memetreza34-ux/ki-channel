import {describe, expect, it} from 'vitest';
import {
  WHY_AI_DURATION_IN_FRAMES,
  WHY_AI_FPS,
  WHY_AI_HEIGHT,
  WHY_AI_SCENES,
  WHY_AI_WIDTH,
} from '../contract';

describe('Warum-KI-Text-anders-liest Reel-Vertrag', () => {
  it('verwendet das geplante 9:16-Format und 36 Sekunden', () => {
    expect(WHY_AI_WIDTH).toBe(1080);
    expect(WHY_AI_HEIGHT).toBe(1920);
    expect(WHY_AI_FPS).toBe(30);
    expect(WHY_AI_DURATION_IN_FRAMES).toBe(1080);
  });

  it('deckt die Timeline ohne Lücken oder Überschneidungen ab', () => {
    expect(WHY_AI_SCENES).toHaveLength(8);

    WHY_AI_SCENES.forEach((scene, index) => {
      const expectedStart = index === 0
        ? 0
        : WHY_AI_SCENES[index - 1].endFrameExclusive;
      expect(scene.startFrame).toBe(expectedStart);
      expect(scene.endFrameExclusive).toBe(
        scene.startFrame + scene.durationInFrames,
      );
      expect(scene.durationInFrames).toBeGreaterThan(0);
    });

    expect(
      WHY_AI_SCENES[WHY_AI_SCENES.length - 1]?.endFrameExclusive,
    ).toBe(WHY_AI_DURATION_IN_FRAMES);
  });
});
