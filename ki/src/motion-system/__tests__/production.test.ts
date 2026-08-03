import {describe, expect, it} from 'vitest';
import {
  buildProductionMotionScene,
  buildProductionMotionTimeline,
  buildProductionMotionTimelineFromScript,
} from '../production';
import {MotionQualityError} from '../runtime';

describe('Strikte Motion-Produktionspipeline', () => {
  it('baut valide Einzelszenen und Timelines', () => {
    const scene = buildProductionMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
    });
    expect(scene.quality.passed).toBe(true);

    const timeline = buildProductionMotionTimeline({
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Daten fließen durch die KI zum Ergebnis.'},
      ],
    });
    expect(timeline.passed).toBe(true);
    expect(timeline.scenes).toHaveLength(2);
  });

  it('blockiert Qualitätsfehler in Einzelszenen und Timelines', () => {
    expect(() =>
      buildProductionMotionScene({sentence: 'x'.repeat(221)}),
    ).toThrow(MotionQualityError);

    expect(() =>
      buildProductionMotionTimeline({
        scenes: [
          {sentence: 'Die KI erstellt eine Zusammenfassung.'},
          {sentence: 'x'.repeat(221)},
        ],
      }),
    ).toThrow(MotionQualityError);
  });

  it('erzwingt strict auch gegen abweichende Szenenoptionen', () => {
    expect(() =>
      buildProductionMotionTimeline({
        scenes: [
          {
            sentence: 'x'.repeat(221),
            qualityMode: 'report',
          },
        ],
      }),
    ).toThrow(MotionQualityError);
  });

  it('baut einen vollständigen Sprechtext strikt zur Timeline', () => {
    const timeline = buildProductionMotionTimelineFromScript({
      script:
        'Die KI erhält eine Aufgabe. Der KI-Agent nutzt Browser und Dateien. Danach entsteht das Ergebnis.',
      gapFrames: 6,
    });

    expect(timeline.passed).toBe(true);
    expect(timeline.scenes).toHaveLength(3);
  });

  it('blockiert Qualitätsfehler aus Skript-Standardwerten', () => {
    expect(() =>
      buildProductionMotionTimelineFromScript({
        script: 'Die KI erstellt eine Zusammenfassung.',
        sceneDefaults: {labels: []},
      }),
    ).toThrow(MotionQualityError);
  });
});
