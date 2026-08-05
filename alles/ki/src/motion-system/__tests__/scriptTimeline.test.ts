import {describe, expect, it} from 'vitest';
import {
  buildMotionTimelineFromScript,
  createMotionSceneInputsFromScript,
  segmentMotionScript,
} from '../scriptTimeline';
import {motionStoryboardSchema} from '../schema';

describe('Motion-Skript-Segmentierung', () => {
  it('zerlegt Fließtext und Zeilen deterministisch in Szenen', () => {
    const script = [
      'Die KI erhält eine Aufgabe. Danach analysiert sie die Daten!',
      'Zum Schluss entsteht ein Ergebnis?',
    ].join('\n');

    expect(segmentMotionScript(script)).toEqual([
      'Die KI erhält eine Aufgabe.',
      'Danach analysiert sie die Daten!',
      'Zum Schluss entsteht ein Ergebnis?',
    ]);
    expect(segmentMotionScript(script)).toEqual(segmentMotionScript(script));
  });

  it('trennt nicht innerhalb üblicher deutscher Abkürzungen', () => {
    const script =
      'Die KI nutzt z. B. Browser und Dateien. D. h. sie verbindet mehrere Werkzeuge. Danach liefert sie ca. drei Quellen.';

    expect(segmentMotionScript(script)).toEqual([
      'Die KI nutzt z. B. Browser und Dateien.',
      'D. h. sie verbindet mehrere Werkzeuge.',
      'Danach liefert sie ca. drei Quellen.',
    ]);
  });

  it('trennt normale Wörter mit z, d oder u am Satzende weiterhin korrekt', () => {
    expect(segmentMotionScript('Die Antwort ist kurz. Danach geht es weiter.')).toEqual([
      'Die Antwort ist kurz.',
      'Danach geht es weiter.',
    ]);
    expect(segmentMotionScript('Der Ablauf wird. Danach folgt ein Test.')).toEqual([
      'Der Ablauf wird.',
      'Danach folgt ein Test.',
    ]);
  });

  it('hält jede automatisch geteilte Szene innerhalb der Zeichengrenze', () => {
    const script = Array.from(
      {length: 30},
      (_, index) => `Abschnitt ${index} erklärt einen weiteren wichtigen Teil des Systems`,
    ).join(' ');
    const scenes = segmentMotionScript(script, {maxCharactersPerScene: 80});

    expect(scenes.length).toBeGreaterThan(1);
    expect(scenes.every((scene) => scene.length <= 80)).toBe(true);
    expect(scenes.join(' ')).toBe(script);
  });

  it('teilt auch einzelne überlange Tokens sicher', () => {
    const token = 'x'.repeat(125);
    const scenes = segmentMotionScript(token, {maxCharactersPerScene: 40});

    expect(scenes).toEqual(['x'.repeat(40), 'x'.repeat(40), 'x'.repeat(40), 'x'.repeat(5)]);
  });

  it('kann sehr kurze Folgesätze kontrolliert zusammenführen', () => {
    const script = 'Die KI analysiert den vollständigen Bericht. Fertig. Danach wird geprüft.';
    const scenes = segmentMotionScript(script, {
      maxCharactersPerScene: 100,
      mergeShorterThan: 15,
    });

    expect(scenes).toEqual([
      'Die KI analysiert den vollständigen Bericht. Fertig.',
      'Danach wird geprüft.',
    ]);
  });

  it('lehnt leere Skripte und ungültige Grenzen ab', () => {
    expect(() => segmentMotionScript('   ')).toThrow('darf nicht leer sein');
    expect(() => segmentMotionScript('Text.', {maxCharactersPerScene: 39})).toThrow();
    expect(() => segmentMotionScript('Text.', {maxCharactersPerScene: 221})).toThrow();
    expect(() =>
      segmentMotionScript('Text.', {
        maxCharactersPerScene: 80,
        mergeShorterThan: 81,
      }),
    ).toThrow();
  });
});

describe('Skript-zu-Timeline-Pipeline', () => {
  it('erstellt aus einem Fließtext eine valide Timeline', () => {
    const timeline = buildMotionTimelineFromScript({
      script: [
        'Die KI erhält eine Aufgabe.',
        'Der KI-Agent nutzt Browser und Dateien.',
        'Daten fließen durch die KI zum Ergebnis.',
        'Im Vergleich ist die geprüfte Antwort besser.',
      ].join(' '),
      fps: 60,
      gapFrames: 12,
    });

    expect(timeline.scenes).toHaveLength(4);
    expect(timeline.fps).toBe(60);
    expect(timeline.scenes.every((scene) => scene.storyboard.fps === 60)).toBe(true);
    expect(
      timeline.scenes.every((scene) => motionStoryboardSchema.safeParse(scene.storyboard).success),
    ).toBe(true);
  });

  it('übernimmt Standardwerte und gezielte Anpassungen je Szene', () => {
    const scenes = createMotionSceneInputsFromScript({
      script: 'Die KI erstellt Text. Die KI erstellt ein Bild.',
      sceneDefaults: {labels: ['Inhalt', 'KI', 'Ergebnis']},
      sceneOverrides: [
        {elementLabels: {output: 'Text'}},
        {elementLabels: {output: 'Bild'}},
      ],
    });

    expect(scenes[0].labels).toEqual(['Inhalt', 'KI', 'Ergebnis']);
    expect(scenes[0].elementLabels).toEqual({output: 'Text'});
    expect(scenes[1].elementLabels).toEqual({output: 'Bild'});
  });

  it('lehnt mehr Anpassungen als erzeugte Szenen ab', () => {
    expect(() =>
      createMotionSceneInputsFromScript({
        script: 'Die KI erstellt Text.',
        sceneOverrides: [{}, {}],
      }),
    ).toThrow('Szenen-Anpassungen');
  });
});
