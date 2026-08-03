import {describe, expect, it} from 'vitest';
import {buildMotionScene, MotionQualityError} from '../runtime';
import {motionStoryboardSchema} from '../schema';

describe('buildMotionScene', () => {
  it('baut aus einem Satz ein valides Storyboard mit Qualitätsbericht', () => {
    const result = buildMotionScene({sentence: 'Der KI-Agent nutzt Browser und Dateien.'});

    expect(result.storyboard.visualType).toBe('tool-orchestration');
    expect(() => motionStoryboardSchema.parse(result.storyboard)).not.toThrow();
    expect(result.quality.passed).toBe(true);
  });

  it('übernimmt FPS ohne die zeitliche Szenenlänge zu verändern', () => {
    const result = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
      fps: 60,
    });
    const outputShow = result.storyboard.beats.find(
      (beat) => beat.targetId === 'output' && beat.action === 'show',
    );

    expect(result.storyboard.fps).toBe(60);
    expect(result.storyboard.durationInFrames).toBe(300);
    expect(outputShow?.atFrame).toBe(196);
    expect(() => motionStoryboardSchema.parse(result.storyboard)).not.toThrow();
  });

  it('synchronisiert auf Wort-Timestamps und übernimmt skalierte FPS', () => {
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
    expect(result.storyboard.durationInFrames).toBe(300);
    expect(
      result.storyboard.beats.find(
        (beat) => beat.targetId === 'files' && beat.action === 'show',
      )?.atFrame,
    ).toBe(60);
    expect(() => motionStoryboardSchema.parse(result.storyboard)).not.toThrow();
  });

  it('liefert Qualitätsfehler standardmäßig als Bericht zurück', () => {
    const result = buildMotionScene({sentence: 'x'.repeat(221)});

    expect(result.quality.passed).toBe(false);
    expect(
      result.quality.issues.some(
        (issue) => issue.code === 'sentence-too-long' && issue.severity === 'error',
      ),
    ).toBe(true);
  });

  it('blockiert Qualitätsfehler im strikten Produktionsmodus', () => {
    try {
      buildMotionScene({
        sentence: 'x'.repeat(221),
        qualityMode: 'strict',
      });
      throw new Error('Strikter Qualitätsmodus hätte fehlschlagen müssen.');
    } catch (error) {
      expect(error).toBeInstanceOf(MotionQualityError);
      const qualityError = error as MotionQualityError;
      expect(qualityError.storyboard.sentence).toHaveLength(221);
      expect(qualityError.quality.passed).toBe(false);
      expect(qualityError.message).toContain('sentence-too-long');
    }
  });

  it('lässt reine Warnungen auch im strikten Modus zu', () => {
    const result = buildMotionScene({
      sentence: 'x'.repeat(141),
      qualityMode: 'strict',
    });

    expect(result.quality.passed).toBe(true);
    expect(result.quality.issues.some((issue) => issue.severity === 'warning')).toBe(true);
  });

  it('lehnt FPS außerhalb des Storyboard-Schemas früh und verständlich ab', () => {
    expect(() =>
      buildMotionScene({
        sentence: 'Die KI erstellt eine Zusammenfassung.',
        fps: 120,
      }),
    ).toThrow('FPS muss eine ganze Zahl zwischen 24 und 60 sein.');
  });

  it('lehnt einen unbekannten Qualitätsmodus ab', () => {
    expect(() =>
      buildMotionScene({
        sentence: 'Die KI erstellt eine Zusammenfassung.',
        qualityMode: 'unknown' as never,
      }),
    ).toThrow('qualityMode muss report oder strict sein.');
  });

  it('lehnt leere Sätze ab', () => {
    expect(() => buildMotionScene({sentence: '   '})).toThrow('Der Satz darf nicht leer sein.');
  });
});
