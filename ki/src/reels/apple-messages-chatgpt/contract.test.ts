import {describe, expect, it} from 'vitest';
import {APPLE_MESSAGES_COMPOSITION_ID, APPLE_MESSAGES_DURATION_IN_FRAMES, APPLE_MESSAGES_SCENES} from './contract';

describe('Apple Messages reel contract', () => {
  it('registers the intended composition', () => {
    expect(APPLE_MESSAGES_COMPOSITION_ID).toBe('KI-AppleMessagesChatGPT');
  });

  it('uses the locked 902-frame timeline with five contiguous scenes', () => {
    expect(APPLE_MESSAGES_SCENES).toHaveLength(5);
    expect(APPLE_MESSAGES_DURATION_IN_FRAMES).toBe(902);
    expect(APPLE_MESSAGES_SCENES[0].startFrame).toBe(0);
    expect(APPLE_MESSAGES_SCENES.at(-1)?.endFrame).toBe(902);
    for (let index = 1; index < APPLE_MESSAGES_SCENES.length; index++) {
      expect(APPLE_MESSAGES_SCENES[index].startFrame).toBe(APPLE_MESSAGES_SCENES[index - 1].endFrame);
    }
  });

  it('keeps every scene voice locked', () => {
    for (const scene of APPLE_MESSAGES_SCENES) {
      expect(scene.timingStatus).toBe('VOICE_LOCKED');
    }
  });
});
