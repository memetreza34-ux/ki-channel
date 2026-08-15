import {describe, expect, it} from 'vitest';
import {
  assertScenesContiguous,
  assertSubtitlesWithinScenes,
  assertVerticalFormat,
} from '../../__test-utils__/assertReelContract';
import {
  AMBIGUOUS_PROMPTS_CAPTION_ZONE_Y,
  AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES,
  AMBIGUOUS_PROMPTS_SCENES,
  AMBIGUOUS_PROMPTS_SUBTITLES,
  assertAmbiguousPromptsContract,
} from '../contract';

describe('ambiguous-prompts production contract', () => {
  it('passes the built-in contract assertion', () => {
    expect(() => assertAmbiguousPromptsContract()).not.toThrow();
  });

  it('keeps the canonical vertical format', () => {
    assertVerticalFormat(1080, 1920, 30);
  });

  it('has five contiguous scenes covering the full duration', () => {
    expect(AMBIGUOUS_PROMPTS_SCENES).toHaveLength(5);
    assertScenesContiguous(AMBIGUOUS_PROMPTS_SCENES, AMBIGUOUS_PROMPTS_DURATION_IN_FRAMES);
  });

  it('reserves the caption zone', () => {
    expect(AMBIGUOUS_PROMPTS_CAPTION_ZONE_Y).toBe(1440);
  });

  it('uses only NEW_BUILD scenes with unique beats', () => {
    expect(AMBIGUOUS_PROMPTS_SCENES.every((scene) => scene.implementation === 'NEW_BUILD')).toBe(true);
    const beats = AMBIGUOUS_PROMPTS_SCENES.flatMap((scene) => [...scene.beatIds]);
    expect(new Set(beats).size).toBe(beats.length);
  });

  it('keeps subtitle cues inside scene boundaries', () => {
    assertSubtitlesWithinScenes(AMBIGUOUS_PROMPTS_SUBTITLES, AMBIGUOUS_PROMPTS_SCENES);
  });
});
