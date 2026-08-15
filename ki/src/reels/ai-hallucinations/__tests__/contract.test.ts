import {describe, expect, it} from 'vitest';
import {ANIMATION_PROTOTYPE_REGISTRY} from '../../../animation-library/prototypes/registry';
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
    expect(HALLUCINATION_WIDTH).toBe(1080);
    expect(HALLUCINATION_HEIGHT).toBe(1920);
    expect(HALLUCINATION_FPS).toBe(30);
    expect(HALLUCINATION_DURATION_IN_FRAMES).toBe(1295);
  });

  it('uses five continuous unique scenes and animations', () => {
    expect(HALLUCINATION_SCENES).toHaveLength(5);
    expect(new Set(HALLUCINATION_SCENES.map((scene) => scene.sceneId)).size).toBe(5);
    expect(new Set(HALLUCINATION_SCENES.map((scene) => scene.animationId)).size).toBe(5);
    let cursor = 0;
    for (const scene of HALLUCINATION_SCENES) {
      expect(scene.startFrame).toBe(cursor);
      expect(scene.endFrame).toBeGreaterThan(scene.startFrame);
      expect(scene.visualLabels.shellIcon).toBeTruthy();
      cursor = scene.endFrame;
    }
    expect(cursor).toBe(HALLUCINATION_DURATION_IN_FRAMES);
  });

  it('uses only production-ready registered mechanisms', () => {
    const ids = new Set(ANIMATION_PROTOTYPE_REGISTRY.map((item) => item.animationId));
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

  it('covers every spoken word with subtitle cues', () => {
    expect(HALLUCINATION_SUBTITLES).toHaveLength(16);
    for (const scene of HALLUCINATION_SCENES) {
      const cues = HALLUCINATION_SUBTITLES.filter((cue) => cue.sceneId === scene.sceneId).sort((a,b) => a.startFrame - b.startFrame);
      expect(cues.length).toBeGreaterThanOrEqual(2);
      expect(cues[0].startFrame).toBe(scene.startFrame);
      expect(cues[cues.length - 1].endFrame).toBe(scene.endFrame);
      expect(normalizeHallucinationText(cues.map((cue) => cue.text).join(' '))).toBe(normalizeHallucinationText(scene.spokenText));
    }
  });
});
