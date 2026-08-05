import {describe, expect, it} from 'vitest';
import {motionStoryboardSchema} from '../schema';
import {buildMotionTimeline} from '../timeline';

describe('Timeline mit Audio-Timestamps', () => {
  it('verschiebt Folgeszenen hinter eine durch Audio verlängerte Szene', () => {
    const timeline = buildMotionTimeline({
      gapFrames: 12,
      scenes: [
        {
          sentence: 'Die KI erstellt eine Zusammenfassung.',
          words: [
            {text: 'Eingabe', startMs: 0, endMs: 200},
            {text: 'Ergebnis', startMs: 5600, endMs: 6000},
          ],
        },
        {sentence: 'Daten fließen durch die KI zum Ergebnis.'},
      ],
    });

    expect(timeline.scenes[0].durationInFrames).toBe(210);
    expect(timeline.scenes[0].endFrameExclusive).toBe(210);
    expect(timeline.scenes[1].startFrame).toBe(222);
    expect(timeline.totalDurationInFrames).toBe(372);
  });

  it('erhält bei 60 FPS die Zeit in Sekunden und plant variable Szenen korrekt', () => {
    const timeline = buildMotionTimeline({
      fps: 60,
      gapFrames: 30,
      scenes: [
        {
          sentence: 'Die KI erstellt eine Zusammenfassung.',
          words: [{text: 'Ergebnis', startMs: 6000, endMs: 6500}],
        },
        {sentence: 'Der Agent plant und arbeitet autonom weiter.'},
      ],
    });

    expect(timeline.scenes[0].durationInFrames).toBe(450);
    expect(timeline.scenes[0].endSeconds).toBe(7.5);
    expect(timeline.scenes[1].startFrame).toBe(480);
    expect(timeline.scenes[1].startSeconds).toBe(8);
    expect(timeline.totalDurationSeconds).toBe(13);
    expect(
      timeline.scenes.every((scene) => motionStoryboardSchema.safeParse(scene.storyboard).success),
    ).toBe(true);
  });

  it('begrenzt einzelne lange Audioszenen auf 900 Frames ohne die Timeline zu beschädigen', () => {
    const timeline = buildMotionTimeline({
      scenes: [
        {
          sentence: 'Die KI erzeugt einen Fehler und muss geprüft werden.',
          words: [{text: 'Fehler', startMs: 40000, endMs: 45000}],
        },
        {sentence: 'Die KI erstellt eine Zusammenfassung.'},
      ],
    });

    expect(timeline.scenes[0].durationInFrames).toBe(900);
    expect(timeline.scenes[1].startFrame).toBe(900);
    expect(timeline.totalDurationInFrames).toBe(1050);
    expect(
      timeline.scenes[0].storyboard.beats.every(
        (beat) =>
          beat.atFrame + beat.durationFrames <=
          timeline.scenes[0].storyboard.durationInFrames,
      ),
    ).toBe(true);
  });
});
