import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  CONTEXT_BEATS,
  CONTEXT_CAPTIONS,
  CONTEXT_DURATION,
  CONTEXT_PACKAGE,
  CONTEXT_SCENES,
  CONTEXT_SYNC_STATUS,
} from '../sync';

const reelRoot = resolve(
  process.cwd(),
  '..',
  'reels',
  '2026-08-03_bis_2026-08-09',
  'freitag',
  'reel-01_warum-ki-fruehere-nachrichten-vergisst',
);

const countWords = (text: string): number =>
  text.match(/[A-Za-zÄÖÜäöüß0-9]+(?:[’'-][A-Za-zÄÖÜäöüß0-9]+)*/g)?.length ?? 0;

describe('why-ai-forgets-earlier-messages v2 contract', () => {
  it('uses the audio-first v2 standard', () => {
    expect(CONTEXT_PACKAGE.standardId).toBe('ki-animation-only-reel-v2');
    expect(CONTEXT_PACKAGE.timelineStatus).toBe('planned-placeholder-until-final-audio');
    expect(['planned-placeholder', 'final-transcript-aligned']).toContain(CONTEXT_SYNC_STATUS);
    expect(CONTEXT_PACKAGE.audio.playbackRate).toBe(1);
    expect(CONTEXT_PACKAGE.audio.music).toBe(false);
    expect(CONTEXT_PACKAGE.audio.soundMode).toBe('off');
  });

  it('contains exactly eight contiguous Remotion scenes', () => {
    expect(CONTEXT_SCENES).toHaveLength(8);
    let cursor = 0;
    for (const scene of CONTEXT_SCENES) {
      expect(scene.startFrame).toBe(cursor);
      expect(scene.endFrame).toBeGreaterThan(scene.startFrame);
      expect(scene.resultHoldFrames).toBeGreaterThanOrEqual(30);
      cursor = scene.endFrame;
    }
    expect(cursor).toBe(CONTEXT_DURATION);
    expect(CONTEXT_PACKAGE.scenes.every((scene) => scene.type === 'remotion')).toBe(true);
  });

  it('contains the approved 143-word script', () => {
    const script = readFileSync(resolve(reelRoot, '01-voice-script', 'script-fliesstext.txt'), 'utf8');
    expect(countWords(script)).toBe(143);
  });

  it('uses stable full-sentence captions with one violet progress line', () => {
    expect(CONTEXT_CAPTIONS.length).toBeGreaterThan(8);
    for (const cue of CONTEXT_CAPTIONS) {
      expect(cue.revealMode).toBe('instant');
      expect(cue.wordHighlight).toBe(false);
      expect(cue.progressIndicator).toBe('single-violet-line');
      expect(cue.bottomPx).toBeGreaterThanOrEqual(210);
      expect(cue.bottomPx).toBeLessThanOrEqual(235);
      expect(cue.lineCount).toBeLessThanOrEqual(2);
      expect(cue.endFrame).toBeGreaterThan(cue.startFrame);
    }
  });

  it('keeps every planned semantic trigger within five frames', () => {
    for (const beat of CONTEXT_BEATS) {
      expect(Math.abs(beat.animationStartFrame - beat.transcriptStartFrame)).toBeLessThanOrEqual(5);
      expect(beat.resultFrame).toBeGreaterThanOrEqual(beat.animationStartFrame);
    }
  });

  it('contains no word-by-word subtitle implementation in the production composition', () => {
    const source = readFileSync(resolve(process.cwd(), 'ki', 'src', 'reels', 'why-ai-forgets-earlier-messages', 'ReelWhyAIForgetsEarlierMessages.tsx'), 'utf8');
    expect(source).toContain('StableSentenceCaption');
    expect(source).not.toMatch(/visibleCount|slice\(0\s*,\s*visibleCount|word-by-word|karaoke/i);
  });
});