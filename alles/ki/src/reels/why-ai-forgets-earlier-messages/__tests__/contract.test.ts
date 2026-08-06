import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  CONTEXT_BEATS,
  CONTEXT_CAPTION_PAIRS,
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

describe('why-ai-forgets-earlier-messages v3 contract', () => {
  it('uses the audio-first v3 standard', () => {
    expect(CONTEXT_PACKAGE.standardId).toBe('ki-animation-only-reel-v3');
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

  it('contains the approved 128-word and 16-sentence script', () => {
    const script = readFileSync(resolve(reelRoot, '01-voice-script', 'script-fliesstext.txt'), 'utf8');
    expect(countWords(script)).toBe(128);
    expect(script.match(/[.!?](?:\s|$)/g)?.length).toBe(16);
  });

  it('shows exactly two full sentences with active-word timing', () => {
    expect(CONTEXT_CAPTION_PAIRS).toHaveLength(8);
    for (const pair of CONTEXT_CAPTION_PAIRS) {
      expect(pair.mode).toBe('dual-sentence-active-word');
      expect(pair.sentences).toHaveLength(2);
      expect(pair.bottomPx).toBeGreaterThanOrEqual(245);
      expect(pair.bottomPx).toBeLessThanOrEqual(285);
      for (const sentence of pair.sentences) {
        expect(sentence.words.length).toBeGreaterThan(0);
        expect(sentence.endFrame).toBeGreaterThan(sentence.startFrame);
        let cursor = sentence.startFrame;
        for (const word of sentence.words) {
          expect(word.startFrame).toBeGreaterThanOrEqual(cursor);
          expect(word.endFrame).toBeGreaterThan(word.startFrame);
          expect(word.startFrame).toBeGreaterThanOrEqual(sentence.startFrame);
          expect(word.endFrame).toBeLessThanOrEqual(sentence.endFrame);
          cursor = word.endFrame;
        }
      }
    }
  });

  it('keeps every semantic trigger within five frames', () => {
    for (const beat of CONTEXT_BEATS) {
      expect(Math.abs(beat.animationStartFrame - beat.transcriptStartFrame)).toBeLessThanOrEqual(5);
      expect(beat.resultFrame).toBeGreaterThanOrEqual(beat.animationStartFrame);
    }
  });

  it('uses the new dual-sentence caption component without a progress line', () => {
    const source = readFileSync(resolve(process.cwd(), 'ki', 'src', 'reels', 'why-ai-forgets-earlier-messages', 'ReelWhyAIForgetsEarlierMessages.tsx'), 'utf8');
    expect(source).toContain('DualSentenceKaraokeCaption');
    expect(source).not.toContain('StableSentenceCaption');
    expect(source).not.toMatch(/single-violet-line|progressIndicator|visibleCount|slice\(0\s*,/i);
  });
});
