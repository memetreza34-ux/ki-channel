import {describe, expect, it} from 'vitest';
import {alignStoryboardToWords} from '../audioSync';
import {createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';

describe('Audio-Sync Wortabgleich', () => {
  it('erkennt einzelne Wörter aus mehrteiligen Labels', () => {
    const storyboard = createDefaultStoryboard('Der KI-Agent nutzt Browser und Dateien.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Agent', startMs: 1000, endMs: 1250},
    ]);

    const aiShowBeat = aligned.beats.find(
      (beat) => beat.targetId === 'ai' && beat.action === 'show',
    );

    expect(aiShowBeat?.atFrame).toBe(30);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('verhindert Teiltreffer durch einzelne kurze Buchstaben', () => {
    const storyboard = createDefaultStoryboard('Der KI-Agent nutzt Browser und Dateien.');
    const originalAiFrame = storyboard.beats.find(
      (beat) => beat.targetId === 'ai' && beat.action === 'show',
    )?.atFrame;

    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'A', startMs: 1000, endMs: 1200},
    ]);
    const alignedAiFrame = aligned.beats.find(
      (beat) => beat.targetId === 'ai' && beat.action === 'show',
    )?.atFrame;

    expect(alignedAiFrame).toBe(originalAiFrame);
  });

  it('erlaubt exakte kurze Fachbegriffe wie KI', () => {
    const storyboard = createDefaultStoryboard('Der KI-Agent nutzt Browser und Dateien.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'KI', startMs: 1000, endMs: 1200},
    ]);

    const aiShowBeat = aligned.beats.find(
      (beat) => beat.targetId === 'ai' && beat.action === 'show',
    );
    expect(aiShowBeat?.atFrame).toBe(30);
  });
});
