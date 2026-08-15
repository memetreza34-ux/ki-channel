import {describe, expect, it} from 'vitest';
import {
  assertScenesContiguous,
  assertSubtitlesWithinScenes,
  assertVerticalFormat,
} from '../../__test-utils__/assertReelContract';
import {
  AI_AGENTS_CAPTION_ZONE_Y,
  AI_AGENTS_DURATION_IN_FRAMES,
  AI_AGENTS_SCENES,
  AI_AGENTS_SUBTITLES,
  assertAIAgentsContract,
  normalizeAIAgentText,
} from '../contract';

describe('AI agents reel contract', () => {
  it('passes the built-in contract assertion', () => {
    expect(() => assertAIAgentsContract()).not.toThrow();
  });

  it('keeps the canonical vertical format', () => {
    assertVerticalFormat(1080, 1920, 30);
  });

  it('has five contiguous scenes covering the full duration', () => {
    expect(AI_AGENTS_SCENES).toHaveLength(5);
    assertScenesContiguous(AI_AGENTS_SCENES, AI_AGENTS_DURATION_IN_FRAMES);
  });

  it('reserves the caption zone', () => {
    expect(AI_AGENTS_CAPTION_ZONE_Y).toBe(1440);
  });

  it('uses only NEW_BUILD scenes with unique beats', () => {
    expect(AI_AGENTS_SCENES.every((scene) => scene.implementation === 'NEW_BUILD')).toBe(true);
    const beats = AI_AGENTS_SCENES.flatMap((scene) => scene.beatIds);
    expect(new Set(beats).size).toBe(beats.length);
  });

  it('keeps subtitle cues inside scene boundaries', () => {
    assertSubtitlesWithinScenes(AI_AGENTS_SUBTITLES, AI_AGENTS_SCENES);
  });

  it('covers every spoken scene with subtitle text', () => {
    for (const scene of AI_AGENTS_SCENES) {
      const text = AI_AGENTS_SUBTITLES
        .filter((cue) => cue.sceneId === scene.sceneId)
        .sort((a, b) => a.startFrame - b.startFrame)
        .map((cue) => cue.text)
        .join(' ');
      expect(normalizeAIAgentText(text)).toBe(normalizeAIAgentText(scene.spokenText));
    }
  });
});
