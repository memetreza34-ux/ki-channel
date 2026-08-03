import {describe, expect, it} from 'vitest';
import {
  assertProductionMotionStoryboard,
  buildProductionMotionScene,
  buildProductionMotionTimeline,
  buildProductionMotionTimelineFromScript,
  buildProductionMotionTimelineFromTranscript,
  MotionProductionQualityError,
} from '../production';
import {buildMotionScene, MotionQualityError} from '../runtime';

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

  it('lässt nicht blockierende Warnungen im Produktionsmodus zu', () => {
    const result = buildProductionMotionScene({sentence: 'x'.repeat(141)});

    expect(result.quality.passed).toBe(true);
    expect(result.quality.issues.some((issue) => issue.code === 'sentence-too-long')).toBe(true);
  });

  it('blockiert Storyboard-Elemente, die von der Stage nicht gerendert werden', () => {
    const storyboard = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
    }).storyboard;
    const withHiddenElement = {
      ...storyboard,
      elements: [
        ...storyboard.elements,
        {
          id: 'note',
          kind: 'label' as const,
          label: 'Unsichtbarer Hinweis',
          emphasis: 'normal' as const,
        },
      ],
    };

    expect(() => assertProductionMotionStoryboard(withHiddenElement)).toThrow(
      MotionProductionQualityError,
    );
    try {
      assertProductionMotionStoryboard(withHiddenElement);
    } catch (error) {
      const productionError = error as MotionProductionQualityError;
      expect(productionError.issues.some((issue) => issue.code === 'unrendered-element')).toBe(true);
    }
  });

  it('blockiert fehlende Stage-Timings und kollabierte Folgeaktionen', () => {
    const inputOutput = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
    }).storyboard;
    const missingOutputTiming = {
      ...inputOutput,
      beats: inputOutput.beats.filter(
        (beat) => !(beat.targetId === 'output' && beat.action === 'show'),
      ),
    };
    expect(() => assertProductionMotionStoryboard(missingOutputTiming)).toThrow(
      MotionProductionQualityError,
    );

    const comparison = buildMotionScene({
      sentence: 'Modell A ist im Vergleich besser als Modell B.',
    }).storyboard;
    const rightShow = comparison.beats.find(
      (beat) => beat.targetId === 'right' && beat.action === 'show',
    );
    const collapsed = {
      ...comparison,
      beats: comparison.beats.map((beat) =>
        beat.targetId === 'right' && beat.action === 'highlight' && rightShow
          ? {...beat, atFrame: rightShow.atFrame}
          : beat,
      ),
    };
    expect(() => assertProductionMotionStoryboard(collapsed)).toThrow(
      MotionProductionQualityError,
    );
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

  it('baut globale Wort-Timestamps strikt zur Produktions-Timeline', () => {
    const result = buildProductionMotionTimelineFromTranscript({
      script: 'Die KI nutzt Dateien. Danach entsteht das Ergebnis.',
      words: [
        {text: 'Die', startMs: 0, endMs: 100},
        {text: 'KI', startMs: 150, endMs: 300},
        {text: 'nutzt', startMs: 350, endMs: 500},
        {text: 'Dateien', startMs: 900, endMs: 1150},
        {text: 'Danach', startMs: 1800, endMs: 2000},
        {text: 'entsteht', startMs: 2050, endMs: 2250},
        {text: 'das', startMs: 2300, endMs: 2400},
        {text: 'Ergebnis', startMs: 2700, endMs: 3000},
      ],
      fps: 60,
    });

    expect(result.timeline.passed).toBe(true);
    expect(result.timeline.scenes).toHaveLength(2);
    expect(result.transcriptScenes[1].words[0].startMs).toBe(0);
  });

  it('blockiert Qualitätsfehler aus Skript-Standardwerten', () => {
    expect(() =>
      buildProductionMotionTimelineFromScript({
        script: 'Die KI erstellt eine Zusammenfassung.',
        sceneDefaults: {labels: []},
      }),
    ).toThrow(MotionQualityError);

    expect(() =>
      buildProductionMotionTimelineFromTranscript({
        script: 'Die KI erstellt eine Zusammenfassung.',
        words: [
          {text: 'Die', startMs: 0, endMs: 100},
          {text: 'KI', startMs: 120, endMs: 220},
          {text: 'erstellt', startMs: 250, endMs: 400},
          {text: 'eine', startMs: 420, endMs: 500},
          {text: 'Zusammenfassung', startMs: 550, endMs: 850},
        ],
        sceneDefaults: {labels: []},
      }),
    ).toThrow(MotionQualityError);
  });
});
