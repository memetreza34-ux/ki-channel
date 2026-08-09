import {describe, expect, it} from 'vitest';
import {ANIMATION_PROTOTYPE_REGISTRY} from '../../../animation-library/prototypes/registry';
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
  it('keeps the canonical production format and exact duration', () => {
    expect(CONTEXT_OVERLOAD_WIDTH).toBe(1080);
    expect(CONTEXT_OVERLOAD_HEIGHT).toBe(1920);
    expect(CONTEXT_OVERLOAD_FPS).toBe(30);
    expect(CONTEXT_OVERLOAD_DURATION_IN_FRAMES).toBe(900);
  });

  it('contains five continuous unique 180-frame scenes', () => {
    expect(CONTEXT_OVERLOAD_SCENES).toHaveLength(5);
    expect(new Set(CONTEXT_OVERLOAD_SCENES.map((scene) => scene.sceneId)).size).toBe(5);
    expect(new Set(CONTEXT_OVERLOAD_SCENES.map((scene) => scene.animationId)).size).toBe(5);

    let cursor = 0;
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      expect(scene.startFrame).toBe(cursor);
      expect(scene.endFrame - scene.startFrame).toBe(180);
      cursor = scene.endFrame;
    }
    expect(cursor).toBe(900);
  });

  it('uses only production-ready registered animation mechanisms', () => {
    const productionIds = new Set(
      ANIMATION_PROTOTYPE_REGISTRY.map((registration) => registration.animationId),
    );
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

  it('keeps subtitle cues inside scenes and covers every spoken word', () => {
    expect(CONTEXT_OVERLOAD_SUBTITLES).toHaveLength(10);
    for (const scene of CONTEXT_OVERLOAD_SCENES) {
      const cues = CONTEXT_OVERLOAD_SUBTITLES
        .filter((cue) => cue.sceneId === scene.sceneId)
        .sort((left, right) => left.startFrame - right.startFrame);
      expect(cues).toHaveLength(2);
      expect(cues.every((cue) => cue.startFrame >= scene.startFrame)).toBe(true);
      expect(cues.every((cue) => cue.endFrame <= scene.endFrame)).toBe(true);
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
