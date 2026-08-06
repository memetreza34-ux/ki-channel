import {describe, expect, it} from 'vitest';
import {ANSWER_BEATS, ANSWER_CAPTION_CUES, ANSWER_DURATION, ANSWER_PACKAGE, ANSWER_SCENES, ANSWER_SYNC_STATUS} from '../sync';

describe('why-ai-answers-differently v4 contract', () => {
  it('uses the v4 single-sentence visual standard', () => {
    expect(ANSWER_PACKAGE.standardId).toBe('ki-animation-only-reel-v4');
    expect(['planned-placeholder', 'final-transcript-aligned']).toContain(ANSWER_SYNC_STATUS);
    expect(ANSWER_PACKAGE.audio.playbackRate).toBe(1);
    expect(ANSWER_PACKAGE.captions.mode).toBe('single-sentence-active-word');
    expect(ANSWER_PACKAGE.visual.headingIconRequired).toBe(true);
  });

  it('has eight contiguous scenes', () => {
    expect(ANSWER_SCENES).toHaveLength(8);
    let cursor = 0;
    for (const scene of ANSWER_SCENES) {
      expect(scene.startFrame).toBe(cursor);
      expect(scene.endFrame).toBeGreaterThan(scene.startFrame);
      cursor = scene.endFrame;
    }
    expect(cursor).toBe(ANSWER_DURATION);
  });

  it('shows one full sentence at a time and keeps word timings', () => {
    expect(ANSWER_CAPTION_CUES).toHaveLength(16);
    for (const cue of ANSWER_CAPTION_CUES) {
      expect(cue.mode).toBe('single-sentence-active-word');
      expect(cue.bottomPx).toBeGreaterThanOrEqual(300);
      expect(cue.sentence.words.length).toBeGreaterThan(0);
      expect(cue.endFrame).toBeGreaterThan(cue.startFrame);
    }
  });

  it('aligns semantic beats within five frames', () => {
    for (const beat of ANSWER_BEATS) {
      expect(Math.abs(beat.animationStartFrame - beat.transcriptStartFrame)).toBeLessThanOrEqual(5);
    }
  });
});
