import {describe, expect, it} from 'vitest';
import {APPLE_MESSAGES_COMPOSITION_ID, APPLE_MESSAGES_DURATION_IN_FRAMES, APPLE_MESSAGES_SCENES} from './contract';

describe('Apple Messages reel contract', () => {
  it('registers the intended composition', () => {
    expect(APPLE_MESSAGES_COMPOSITION_ID).toBe('KI-AppleMessagesChatGPT');
  });

  it('has five ordered planning scenes before voice lock', () => {
    expect(APPLE_MESSAGES_SCENES).toHaveLength(5);
    expect(APPLE_MESSAGES_DURATION_IN_FRAMES).toBeGreaterThan(900);
  });
});
