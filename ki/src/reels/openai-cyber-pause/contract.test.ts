import {describe, expect, it} from 'vitest';
import {REEL_CAPTION_SAFE} from '../captionSafe';
import {assertScenesContiguous, assertSubtitlesWithinScenes, assertVerticalFormat} from '../__test-utils__/assertReelContract';
import {
  OPENAI_CYBER_PAUSE_DURATION_IN_FRAMES,
  OPENAI_CYBER_PAUSE_FPS,
  OPENAI_CYBER_PAUSE_HEIGHT,
  OPENAI_CYBER_PAUSE_SCENES,
  OPENAI_CYBER_PAUSE_SUBTITLES,
  OPENAI_CYBER_PAUSE_WIDTH,
} from './contract';

describe('OpenAI cyber pause reel contract', () => {
  it('uses the canonical vertical production format', () => {
    assertVerticalFormat(OPENAI_CYBER_PAUSE_WIDTH, OPENAI_CYBER_PAUSE_HEIGHT, OPENAI_CYBER_PAUSE_FPS);
    expect(OPENAI_CYBER_PAUSE_DURATION_IN_FRAMES / OPENAI_CYBER_PAUSE_FPS).toBeCloseTo(54.8, 1);
  });

  it('has five contiguous scenes covering the full reel', () => {
    expect(OPENAI_CYBER_PAUSE_SCENES).toHaveLength(5);
    assertScenesContiguous(OPENAI_CYBER_PAUSE_SCENES, OPENAI_CYBER_PAUSE_DURATION_IN_FRAMES);
  });

  it('keeps phase-1 subtitle cues within their scenes', () => {
    assertSubtitlesWithinScenes(OPENAI_CYBER_PAUSE_SUBTITLES, OPENAI_CYBER_PAUSE_SCENES);
  });

  it('uses the current feed-safe caption geometry', () => {
    expect(REEL_CAPTION_SAFE.bottom).toBe(520);
    expect(REEL_CAPTION_SAFE.horizontalInset).toBe(104);
    expect(REEL_CAPTION_SAFE.maxWidth).toBe(820);
    expect(REEL_CAPTION_SAFE.preferredVisualEndYMax).toBe(1280);
  });

  it('keeps headlines concise and scene ids unique', () => {
    const ids = OPENAI_CYBER_PAUSE_SCENES.map((scene) => scene.sceneId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const scene of OPENAI_CYBER_PAUSE_SCENES) {
      expect(scene.headline.trim().split(/\s+/).length).toBeLessThanOrEqual(7);
    }
  });
});
