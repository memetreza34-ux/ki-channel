import {describe, expect, it} from 'vitest';
import {
  TODAY_BEATS,
  TODAY_CAPTION_CUES,
  TODAY_DURATION,
  TODAY_PACKAGE,
  TODAY_SCENES,
  TODAY_SYNC,
  TODAY_SYNC_STATUS,
} from '../sync';
import {getVisibleCaptionWordIndices, REEL_CAPTION_SAFE} from '../../captionSafe';
import {findActiveCaptionWordIndex} from '../../FeedSafeActiveWordCaption';

describe('why-ai-does-not-know-today canonical migration contract', () => {
  it('uses the canonical feed-safe caption standard', () => {
    expect(TODAY_PACKAGE.standardId).toBe('ki-short-form-canonical-v1');
    expect(TODAY_PACKAGE.captions.mode).toBe('feed-safe-active-word-groups');
    expect(TODAY_PACKAGE.captions.sentencesVisible).toBe(1);
    expect(TODAY_PACKAGE.captions.progressIndicator).toBe('none');
    expect(TODAY_PACKAGE.captions.bottomPx).toBe(REEL_CAPTION_SAFE.bottom);
    expect(TODAY_PACKAGE.captions.horizontalInsetPx).toBe(REEL_CAPTION_SAFE.horizontalInset);
    expect(TODAY_PACKAGE.captions.maxWidthPx).toBe(REEL_CAPTION_SAFE.maxWidth);
    expect(TODAY_PACKAGE.captions.maximumWordsVisible).toBe(REEL_CAPTION_SAFE.maxWordsPerGroup);
    expect(['planned-placeholder', 'final-transcript-aligned']).toContain(TODAY_SYNC_STATUS);
  });

  it('does not claim final conformance with the overlong legacy voiceover', () => {
    expect(TODAY_PACKAGE.standardConformance.status).toBe('blocked');
    expect(TODAY_SYNC.audio.durationSeconds).toBeGreaterThan(60);
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
      expect(first.words.length).toBeGreaterThan(0);
      expect(second.words.length).toBeGreaterThan(0);
    });
  });

  it('shows at most six words and always keeps the active word visible', () => {
    for (const cue of TODAY_CAPTION_CUES) {
      const words = cue.words.map((word) => word.text);
      words.forEach((_, activeIndex) => {
        const visible = getVisibleCaptionWordIndices(words, activeIndex);
        expect(visible).toContain(activeIndex);
        expect(visible.length).toBeLessThanOrEqual(REEL_CAPTION_SAFE.maxWordsPerGroup);
      });
    }
  });

  it('does not highlight a word before speech or inside a real word gap', () => {
    const firstCue = TODAY_CAPTION_CUES[0];
    expect(findActiveCaptionWordIndex(firstCue.words, firstCue.startFrame)).toBe(-1);
    expect(findActiveCaptionWordIndex([
      {text: 'vor', startFrame: 10, endFrame: 15},
      {text: 'Pause', startFrame: 18, endFrame: 24},
    ], 16)).toBe(-1);
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
