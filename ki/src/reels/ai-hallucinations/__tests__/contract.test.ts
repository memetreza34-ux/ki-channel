import {describe, expect, it} from 'vitest';
import {ANIMATION_PROTOTYPE_REGISTRY} from '../../../animation-library/prototypes/registry';
import {
  assertScenesContiguous,
  assertSubtitlesWithinScenes,
  assertVerticalFormat,
} from '../../__test-utils__/assertReelContract';
import {
  HALLUCINATION_DURATION_IN_FRAMES,
  HALLUCINATION_FPS,
  HALLUCINATION_HEIGHT,
  HALLUCINATION_SCENES,
  HALLUCINATION_SUBTITLES,
  HALLUCINATION_WIDTH,
  buildHallucinationSceneRuntime,
  normalizeHallucinationText,
} from '../ReelHallucinations';

describe('ai hallucinations reel contract', () => {
  it('keeps the canonical vertical production format', () => {
    assertVerticalFormat(HALLUCINATION_WIDTH, HALLUCINATION_HEIGHT, HALLUCINATION_FPS);
  });

  it('has five contiguous scenes covering the full duration', () => {
    expect(HALLUCINATION_SCENES).toHaveLength(5);
    assertScenesContiguous(HALLUCINATION_SCENES, HALLUCINATION_DURATION_IN_FRAMES);
  });

  it('uses unique animation IDs from the production registry', () => {
    const ids = new Set(ANIMATION_PROTOTYPE_REGISTRY.map((item) => item.animationId));
    const sceneAnimIds = HALLUCINATION_SCENES.map((scene) => scene.animationId);
    expect(new Set(sceneAnimIds).size).toBe(5);
    for (const scene of HALLUCINATION_SCENES) expect(ids.has(scene.animationId)).toBe(true);
  });

  it('grounds runtime from approved spoken text and viewer headline', () => {
    for (const scene of HALLUCINATION_SCENES) {
      const runtime = buildHallucinationSceneRuntime(scene);
      expect(runtime.renderProps.content?.spokenText).toBe(scene.spokenText);
      expect(runtime.renderProps.content?.title).toBe(scene.headline);
      expect(runtime.renderProps.content?.title).not.toBe(scene.goal);
    }
  });

  it('keeps subtitle cues inside scene boundaries', () => {
    assertSubtitlesWithinScenes(HALLUCINATION_SUBTITLES, HALLUCINATION_SCENES);
  });

  it('covers every spoken word with subtitle cues', () => {
    for (const scene of HALLUCINATION_SCENES) {
      const cues = HALLUCINATION_SUBTITLES
        .filter((cue) => cue.sceneId === scene.sceneId)
        .sort((a, b) => a.startFrame - b.startFrame);
      expect(cues.length).toBeGreaterThanOrEqual(2);
      expect(normalizeHallucinationText(cues.map((cue) => cue.text).join(' '))).toBe(
        normalizeHallucinationText(scene.spokenText),
      );
    }
  });
});
