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

  it('bevorzugt bei ähnlichen Labels den unterscheidenden Begriff', () => {
    const storyboard = createDefaultStoryboard('Modell A ist im Vergleich besser als Modell B.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Variante', startMs: 300, endMs: 350},
      {text: 'ist', startMs: 380, endMs: 450},
      {text: 'A', startMs: 500, endMs: 600},
      {text: 'B', startMs: 1500, endMs: 1600},
    ]);

    const leftShow = aligned.beats.find(
      (beat) => beat.targetId === 'left' && beat.action === 'show',
    );
    const rightShow = aligned.beats.find(
      (beat) => beat.targetId === 'right' && beat.action === 'show',
    );

    expect(leftShow?.atFrame).toBe(15);
    expect(rightShow?.atFrame).toBe(45);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });

  it('verschiebt Verbindungen mit dem jeweils synchronisierten Anker', () => {
    const storyboard = createDefaultStoryboard('Der KI-Agent nutzt Browser und Dateien.');

    const alignedToAgent = alignStoryboardToWords(storyboard, [
      {text: 'KI', startMs: 1000, endMs: 1200},
    ]);
    const browserConnectionAfterAgentWord = alignedToAgent.beats.find(
      (beat) => beat.sourceId === 'ai' && beat.targetId === 'browser' && beat.action === 'connect',
    )?.atFrame;

    expect(browserConnectionAfterAgentWord).toBe(84);

    const alignedToBrowser = alignStoryboardToWords(storyboard, [
      {text: 'Browser', startMs: 1000, endMs: 1200},
    ]);
    const browserShowAfterBrowserWord = alignedToBrowser.beats.find(
      (beat) => beat.targetId === 'browser' && beat.action === 'show',
    )?.atFrame;
    const browserConnectionAfterBrowserWord = alignedToBrowser.beats.find(
      (beat) => beat.sourceId === 'ai' && beat.targetId === 'browser' && beat.action === 'connect',
    )?.atFrame;

    expect(browserShowAfterBrowserWord).toBe(30);
    expect(browserConnectionAfterBrowserWord).toBe(61);
  });
});
