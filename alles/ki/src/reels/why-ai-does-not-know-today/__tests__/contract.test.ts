import {describe, expect, it} from 'vitest';
import {
  TODAY_BEATS,
  TODAY_CAPTION_CUES,
  TODAY_DURATION,
  TODAY_PACKAGE,
  TODAY_SCENES,
  TODAY_SYNC_STATUS,
} from '../sync';

describe('why-ai-does-not-know-today v4 contract', () => {
  it('uses the v4 single-sentence standard', () => {
    expect(TODAY_PACKAGE.standardId).toBe('ki-animation-only-reel-v4');
    expect(TODAY_PACKAGE.captions.mode).toBe('single-sentence-active-word');
    expect(TODAY_PACKAGE.captions.sentencesVisible).toBe(1);
    expect(TODAY_PACKAGE.captions.progressIndicator).toBe('none');
    expect(TODAY_PACKAGE.captions.bottomPx).toBe(320);
    expect(['planned-placeholder', 'final-transcript-aligned']).toContain(TODAY_SYNC_STATUS);
  });

  it('has eight contiguous scenes', () => {
    expect(TODAY_SCENES).toHaveLength(8);
    let cursor = 0;
    for (const scene of TODAY_SCENES) {
      expect(scene.startFrame).toBe(cursor);
      expect(scene.endFrame).toBeGreaterThan(scene.startFrame);
      cursor = scene.endFrame;
    }
    expect(cursor).toBe(TODAY_DURATION);
  });

  it('creates sixteen sequential single-sentence cues', () => {
    expect(TODAY_CAPTION_CUES).toHaveLength(16);
    TODAY_SCENES.forEach((scene, sceneIndex) => {
      const first = TODAY_CAPTION_CUES[sceneIndex * 2];
      const second = TODAY_CAPTION_CUES[sceneIndex * 2 + 1];
      expect(first.sceneId).toBe(scene.id);
      expect(second.sceneId).toBe(scene.id);
      expect(first.startFrame).toBe(scene.startFrame);
      expect(first.endFrame).toBe(second.startFrame);
      expect(second.endFrame).toBe(scene.endFrame);
      expect(first.sentence.words.length).toBeGreaterThan(0);
      expect(second.sentence.words.length).toBeGreaterThan(0);
    });
  });

  it('uses unique icons and primary motion mechanisms', () => {
    const icons = TODAY_PACKAGE.scenes.map((scene) => scene.headingIcon);
    const motions = TODAY_PACKAGE.scenes.map((scene) => scene.primaryMotion);
    expect(new Set(icons).size).toBe(TODAY_PACKAGE.scenes.length);
    expect(new Set(motions).size).toBe(TODAY_PACKAGE.scenes.length);
    expect(TODAY_PACKAGE.motion.reusedPrimaryMechanismsFromPreviousReel).toBe(0);
    expect(TODAY_PACKAGE.visual.antiRepetitionReviewRequired).toBe(true);
  });

  it('keeps semantic animation triggers within five frames', () => {
    for (const beat of TODAY_BEATS) {
      expect(Math.abs(beat.animationStartFrame - beat.transcriptStartFrame)).toBeLessThanOrEqual(5);
      expect(beat.resultFrame).toBeGreaterThanOrEqual(beat.animationStartFrame);
    }
  });
});
