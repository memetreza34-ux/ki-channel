import {describe, expect, it} from 'vitest';
import {alignStoryboardToWords} from '../audioSync';
import {findBeatFrame, resolveBeatFrame} from '../beatTiming';
import {createDefaultStoryboard} from '../router';

describe('Storyboard-Beat-Timing', () => {
  it('findet den frühesten passenden Beat', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');

    expect(findBeatFrame(storyboard, {targetId: 'output', action: 'show'})).toBe(98);
    expect(findBeatFrame(storyboard, {targetId: 'ai', action: 'show'})).toBe(34);
  });

  it('kann Verbindungen über Quelle und Ziel unterscheiden', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');

    expect(
      findBeatFrame(storyboard, {
        sourceId: 'input',
        targetId: 'ai',
        action: 'connect',
      }),
    ).toBe(62);
  });

  it('liefert bei fehlendem Beat einen kontrollierten Fallback', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');

    expect(resolveBeatFrame(storyboard, {targetId: 'missing', action: 'show'}, 17)).toBe(17);
  });

  it('übernimmt durch Audio-Sync verschobene Beat-Frames', () => {
    const storyboard = createDefaultStoryboard('Die KI nutzt Dateien.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Dateien', startMs: 1000, endMs: 1200},
    ]);

    expect(findBeatFrame(aligned, {targetId: 'files', action: 'show'})).toBe(30);
  });
});
