import {describe, expect, it} from 'vitest';
import {customizeMotionStoryboard} from '../customization';
import {buildMotionScene} from '../runtime';
import {createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';

describe('Storyboard-Anpassung', () => {
  it('ersetzt Element- und sichtbare Labels ohne die Struktur zu verändern', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const customized = customizeMotionStoryboard(storyboard, {
      elementLabels: {
        input: 'Langer Bericht',
        output: 'Kurzfassung',
      },
      labels: ['Bericht', 'KI', 'Kurzfassung'],
    });

    expect(customized.elements.find((element) => element.id === 'input')?.label).toBe('Langer Bericht');
    expect(customized.elements.find((element) => element.id === 'output')?.label).toBe('Kurzfassung');
    expect(customized.labels).toEqual(['Bericht', 'KI', 'Kurzfassung']);
    expect(customized.beats).toBe(storyboard.beats);
    expect(() => motionStoryboardSchema.parse(customized)).not.toThrow();
  });

  it('lehnt unbekannte Element-IDs früh ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');

    expect(() =>
      customizeMotionStoryboard(storyboard, {
        elementLabels: {missing: 'Unbekannt'},
      }),
    ).toThrow('Unbekannte Element-IDs');
  });

  it('lehnt leere angepasste Labels ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');

    expect(() =>
      customizeMotionStoryboard(storyboard, {
        elementLabels: {output: '   '},
      }),
    ).toThrow('Label für output darf nicht leer sein.');
  });

  it('validiert zu lange Labels im Runtime-Aufbau', () => {
    expect(() =>
      buildMotionScene({
        sentence: 'Die KI erstellt eine Zusammenfassung.',
        elementLabels: {output: 'x'.repeat(33)},
      }),
    ).toThrow('Ungültiges Motion-Storyboard');
  });

  it('synchronisiert Audio gegen die angepassten Inhaltslabels', () => {
    const result = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
      elementLabels: {output: 'Kurzfassung'},
      words: [{text: 'Kurzfassung', startMs: 1000, endMs: 1250}],
    });

    const outputBeat = result.storyboard.beats.find(
      (beat) => beat.targetId === 'output' && beat.action === 'show',
    );
    expect(outputBeat?.atFrame).toBe(30);
  });
});
