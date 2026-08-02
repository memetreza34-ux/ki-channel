import {describe, expect, it} from 'vitest';
import {createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';

describe('Visualtyp-Verträge', () => {
  it('lehnt Input-Output ohne Ausgabeelement ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const invalid = {
      ...storyboard,
      elements: storyboard.elements.filter((element) => element.id !== 'output'),
      beats: storyboard.beats.filter(
        (beat) => beat.targetId !== 'output' && beat.sourceId !== 'output',
      ),
    };

    const result = motionStoryboardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message.includes('benötigt Element output')),
      ).toBe(true);
    }
  });

  it('lehnt Tool-Orchestrierung ohne Werkzeug ab', () => {
    const storyboard = createDefaultStoryboard('Der KI-Agent nutzt Browser und Dateien.');
    const invalid = {
      ...storyboard,
      elements: storyboard.elements.map((element) =>
        element.kind === 'tool' ? {...element, kind: 'card' as const} : element,
      ),
    };

    const result = motionStoryboardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message.includes('mindestens ein Werkzeug')),
      ).toBe(true);
    }
  });

  it('lehnt Ranking mit weniger als zwei Metriken ab', () => {
    const storyboard = createDefaultStoryboard('Dieses Modell landet im Ranking auf Platz eins.');
    const invalid = {
      ...storyboard,
      elements: storyboard.elements.map((element, index) =>
        index === 0 ? element : {...element, kind: 'card' as const},
      ),
    };

    const result = motionStoryboardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message.includes('mindestens zwei Metrik')),
      ).toBe(true);
    }
  });

  it('lehnt Connect-Beats ohne Quelle ab', () => {
    const storyboard = createDefaultStoryboard('Daten fließen durch die KI zum Ergebnis.');
    const invalid = {
      ...storyboard,
      beats: storyboard.beats.map((beat) =>
        beat.action === 'connect' ? {...beat, sourceId: undefined} : beat,
      ),
    };

    const result = motionStoryboardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message.includes('benötigt eine Quelle')),
      ).toBe(true);
    }
  });

  it('lehnt identische Beat-Quelle und Ziel ab', () => {
    const storyboard = createDefaultStoryboard('Daten fließen durch die KI zum Ergebnis.');
    const invalid = {
      ...storyboard,
      beats: storyboard.beats.map((beat) =>
        beat.action === 'connect' ? {...beat, sourceId: beat.targetId} : beat,
      ),
    };

    const result = motionStoryboardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message.includes('nicht identisch')),
      ).toBe(true);
    }
  });

  it('lehnt Beats ab, deren sichtbare Dauer über das Szenenende hinausläuft', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const invalid = {
      ...storyboard,
      beats: storyboard.beats.map((beat, index) =>
        index === 0
          ? {...beat, atFrame: storyboard.durationInFrames - 1, durationFrames: 18}
          : beat,
      ),
    };

    const result = motionStoryboardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.message.includes('endet außerhalb')),
      ).toBe(true);
    }
  });

  it('alle zehn Standard-Storyboards erfüllen ihre Verträge', () => {
    const sentences = [
      'Die KI erstellt eine Zusammenfassung.',
      'Der KI-Agent nutzt Browser und Dateien.',
      'Modell A ist im Vergleich besser als Modell B.',
      'Vorher war es langsam, jetzt läuft es automatisch.',
      'Daten fließen durch die KI zum Ergebnis.',
      'Die KI kann eine falsche Antwort halluzinieren.',
      'Neue Nachrichten verändern den aktuellen Kontext.',
      'Der Agent plant und arbeitet autonom weiter.',
      'Das Modell steht im Ranking auf Platz eins.',
      'Zuerst Eingabe, danach Analyse und Ergebnis.',
    ];

    for (const sentence of sentences) {
      expect(() => motionStoryboardSchema.parse(createDefaultStoryboard(sentence))).not.toThrow();
    }
  });
});
