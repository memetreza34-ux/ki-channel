import {describe, expect, it} from 'vitest';
import {buildMotionScene} from '../runtime';
import {motionStoryboardSchema} from '../schema';

describe('buildMotionScene', () => {
  it('baut aus einem Satz ein valides Storyboard mit Qualitätsbericht', () => {
    const result = buildMotionScene({sentence: 'Der KI-Agent nutzt Browser und Dateien.'});

    expect(result.storyboard.visualType).toBe('tool-orchestration');
    expect(() => motionStoryboardSchema.parse(result.storyboard)).not.toThrow();
    expect(result.quality.passed).toBe(true);
  });

  it('synchronisiert auf Wort-Timestamps und übernimmt FPS', () => {
    const result = buildMotionScene({
      sentence: 'Die KI nutzt Dateien.',
      fps: 60,
      words: [
        {text: 'Die', startMs: 0, endMs: 100},
        {text: 'KI', startMs: 200, endMs: 400},
        {text: 'Dateien', startMs: 1000, endMs: 1300},
      ],
    });

    expect(result.storyboard.fps).toBe(60);
    expect(result.storyboard.beats.find((beat) => beat.targetId === 'files')?.atFrame).toBe(60);
  });

  it('lehnt leere Sätze ab', () => {
    expect(() => buildMotionScene({sentence: '   '})).toThrow('Der Satz darf nicht leer sein.');
  });
});
