import {describe, expect, it} from 'vitest';
import {ANIMATION_PROTOTYPE_REGISTRY} from '../../../animation-library/prototypes/registry';
import {
  assertScenesContiguous,
  assertSubtitlesWithinScenes,
  assertVerticalFormat,
} from '../../__test-utils__/assertReelContract';
import {
  CONTEXT_OVERLOAD_DURATION_IN_FRAMES,
  CONTEXT_OVERLOAD_FPS,
  CONTEXT_OVERLOAD_HEIGHT,
  CONTEXT_OVERLOAD_SCENES,
  CONTEXT_OVERLOAD_SUBTITLES,
  CONTEXT_OVERLOAD_WIDTH,
  normalizeContextOverloadText,
} from '../contract';
import {buildContextOverloadSceneRuntime} from '../runtime';

describe('antigravity context overload reel contract', () => {
  it('keeps the canonical vertical production format', () => {
    assertVerticalFormat(CONTEXT_OVERLOAD_WIDTH, CONTEXT_OVERLOAD_HEIGHT, CONTEXT_OVERLOAD_FPS);
  });

  it('has five contiguous scenes covering the full duration', () => {
    expect(CONTEXT_OVERLOAD_SCENES).toHaveLength(5);
    assertScenesContiguous(CONTEXT_OVERLOAD_SCENES, CONTEXT_OVERLOAD_DURATION_IN_FRAMES);
  });

  it('uses unique animation IDs from the production registry', () => {
    const productionIds = new Set(
      ANIMATION_PROTOTYPE_REGISTRY.map((registration) => registration.animationId),
    );
    const sceneAnimIds = CONTEXT_OVERLOAD_SCENES.map((s) => s.animationId);
    expect(new Set(sceneAnimIds).size).toBe(5);
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      expect(productionIds.has(scene.animationId)).toBe(true);
    }
  });

  it('grounds every executable scene from its approved spoken text', () => {
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const runtime = buildContextOverloadSceneRuntime(scene);
      expect(runtime.renderProps.content).toBeTruthy();
      expect(runtime.renderProps.content?.spokenText).toBe(scene.spokenText);
      expect(runtime.renderProps.content?.meaningContract).toBeTruthy();
      expect(runtime.registration.animationId).toBe(scene.animationId);
    }
  });

  it('uses short viewer-facing headlines instead of internal scene goals', () => {
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const runtime = buildContextOverloadSceneRuntime(scene);
      expect(scene.headline.trim().length).toBeGreaterThan(0);
      expect(scene.headline.length).toBeLessThanOrEqual(38);
      expect(runtime.renderProps.content?.title).toBe(scene.headline);
      expect(runtime.renderProps.content?.title).not.toBe(scene.goal);
      expect(normalizeContextOverloadText(scene.headline)).not.toBe(
        normalizeContextOverloadText(scene.spokenText),
      );
    }
  });

  it('keeps animation copy compact instead of copying the complete subtitle sentence', () => {
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const spoken = normalizeContextOverloadText(scene.spokenText);
      const labels = Object.values(scene.visualLabels);
      expect(labels.length).toBeGreaterThan(0);
      for (const label of labels) {
        const normalizedLabel = normalizeContextOverloadText(label);
        expect(normalizedLabel).not.toBe(spoken);
        expect(label.length).toBeLessThanOrEqual(42);
      }
    }
  });

  it('keeps subtitle cues inside scene boundaries', () => {
    assertSubtitlesWithinScenes(CONTEXT_OVERLOAD_SUBTITLES, CONTEXT_OVERLOAD_SCENES);
  });

  it('covers every spoken word with subtitle cues', () => {
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const cues = CONTEXT_OVERLOAD_SUBTITLES
        .filter((cue) => cue.sceneId === scene.sceneId)
        .sort((left, right) => left.startFrame - right.startFrame);
      expect(cues.length).toBeGreaterThanOrEqual(2);
      expect(normalizeContextOverloadText(cues.map((cue) => cue.text).join(' '))).toBe(
        normalizeContextOverloadText(scene.spokenText),
      );
    }
  });

  it('does not require demo values to construct scene render props', () => {
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const runtime = buildContextOverloadSceneRuntime(scene);
      expect(runtime.renderProps.content?.labels).toBeDefined();
      expect(runtime.renderProps.content?.values).toBeDefined();
    }
  });
});
