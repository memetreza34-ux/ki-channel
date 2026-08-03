import {describe, expect, it} from 'vitest';
import {buildMotionScene, MotionQualityError} from '../runtime';
import {motionStoryboardSchema} from '../schema';
import {buildMotionTimeline, MOTION_TIMELINE_LIMITS} from '../timeline';

describe('buildMotionTimeline', () => {
  it('plant mehrere Szenen lückenlos und deterministisch', () => {
    const input = {
      gapFrames: 15,
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Daten fließen durch die KI zum Ergebnis.'},
        {sentence: 'Der Agent plant und arbeitet autonom weiter.'},
      ],
    };

    const first = buildMotionTimeline(input);
    const second = buildMotionTimeline(input);

    expect(first).toEqual(second);
    expect(first.fps).toBe(30);
    expect(first.scenes.map((scene) => scene.startFrame)).toEqual([0, 165, 330]);
    expect(first.scenes.map((scene) => scene.endFrameExclusive)).toEqual([150, 315, 480]);
    expect(first.totalDurationInFrames).toBe(480);
    expect(first.totalDurationSeconds).toBe(16);
    expect(first.passed).toBe(true);
  });

  it('retimed die gesamte Timeline konsistent auf 60 FPS', () => {
    const timeline = buildMotionTimeline({
      fps: 60,
      gapFrames: 30,
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Vorher war es langsam, jetzt läuft es automatisch.'},
        {sentence: 'Das Modell steht im Ranking auf Platz eins.'},
      ],
    });

    expect(timeline.fps).toBe(60);
    expect(timeline.scenes.map((scene) => scene.durationInFrames)).toEqual([300, 300, 300]);
    expect(timeline.scenes.map((scene) => scene.startFrame)).toEqual([0, 330, 660]);
    expect(timeline.totalDurationInFrames).toBe(960);
    expect(timeline.totalDurationSeconds).toBe(16);
    expect(
      timeline.scenes.every((scene) => motionStoryboardSchema.safeParse(scene.storyboard).success),
    ).toBe(true);
  });

  it('macht automatisch erzeugte IDs bei wiederholten Sätzen eindeutig', () => {
    const timeline = buildMotionTimeline({
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
      ],
    });

    const ids = timeline.scenes.map((scene) => scene.storyboard.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids[1]).toBe(`${ids[0]}-2`);
    expect(ids[2]).toBe(`${ids[0]}-3`);
  });

  it('reserviert explizite IDs und passt stattdessen kollidierende Auto-IDs an', () => {
    const sentence = 'Die KI erstellt eine Zusammenfassung.';
    const reservedId = buildMotionScene({sentence}).storyboard.id;
    const timeline = buildMotionTimeline({
      scenes: [
        {sentence},
        {sentence: 'Die KI erstellt eine andere Ausgabe.', storyboardId: reservedId},
      ],
    });

    expect(timeline.scenes[0].storyboard.id).toBe(`${reservedId}-2`);
    expect(timeline.scenes[1].storyboard.id).toBe(reservedId);
  });

  it('lehnt doppelte explizite IDs ab', () => {
    expect(() =>
      buildMotionTimeline({
        scenes: [
          {sentence: 'Die KI erstellt Text.', storyboardId: 'scene-one'},
          {sentence: 'Die KI erstellt Bilder.', storyboardId: 'scene-one'},
        ],
      }),
    ).toThrow('wird in der Timeline mehrfach verwendet');
  });

  it('lehnt widersprüchliche Szenen-FPS ab', () => {
    expect(() =>
      buildMotionTimeline({
        scenes: [
          {sentence: 'Die KI erstellt Text.', fps: 30},
          {sentence: 'Die KI erstellt Bilder.', fps: 60},
        ],
      }),
    ).toThrow('dieselbe FPS-Zahl');

    expect(() =>
      buildMotionTimeline({
        fps: 60,
        scenes: [{sentence: 'Die KI erstellt Text.', fps: 30}],
      }),
    ).toThrow('widerspricht der Szenen-FPS');
  });

  it('aggregiert Qualitätsprobleme mit Szenenbezug', () => {
    const timeline = buildMotionTimeline({
      scenes: [
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
        {sentence: 'x'.repeat(221)},
      ],
    });

    expect(timeline.passed).toBe(false);
    expect(
      timeline.issues.some(
        (issue) =>
          issue.sceneIndex === 1 &&
          issue.code === 'sentence-too-long' &&
          issue.severity === 'error',
      ),
    ).toBe(true);
  });

  it('kann Qualitätsfehler für die gesamte Timeline strikt blockieren', () => {
    expect(() =>
      buildMotionTimeline({
        qualityMode: 'strict',
        scenes: [
          {sentence: 'Die KI erstellt eine Zusammenfassung.'},
          {sentence: 'x'.repeat(221)},
        ],
      }),
    ).toThrow(MotionQualityError);
  });

  it('lässt Timeline-Warnungen im strikten Modus zu', () => {
    const timeline = buildMotionTimeline({
      qualityMode: 'strict',
      scenes: [{sentence: 'x'.repeat(141)}],
    });

    expect(timeline.passed).toBe(true);
    expect(timeline.issues.some((issue) => issue.severity === 'warning')).toBe(true);
  });

  it('lehnt leere Timelines, ungültige Abstände und zu viele Szenen ab', () => {
    expect(() => buildMotionTimeline({scenes: []})).toThrow('mindestens eine Szene');
    expect(() =>
      buildMotionTimeline({
        scenes: [{sentence: 'Die KI erstellt Text.'}],
        gapFrames: -1,
      }),
    ).toThrow('Timeline-Abstand');

    expect(() =>
      buildMotionTimeline({
        scenes: Array.from(
          {length: MOTION_TIMELINE_LIMITS.maxScenes + 1},
          (_, index) => ({sentence: `Die KI erstellt Ausgabe ${index}.`}),
        ),
      }),
    ).toThrow('höchstens');
  });
});
