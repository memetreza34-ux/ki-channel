import {describe, expect, it} from 'vitest';
import {buildMotionScene} from '../runtime';
import {createMotionStoryboardId} from '../storyboardId';

describe('Motion-Storyboard-IDs', () => {
  it('erzeugt für denselben Satz dieselbe ID', () => {
    const first = createMotionStoryboardId(
      'Die KI erstellt eine Zusammenfassung.',
      'input-output',
    );
    const second = createMotionStoryboardId(
      '  DIE KI erstellt   eine Zusammenfassung.  ',
      'input-output',
    );

    expect(first).toBe(second);
  });

  it('trennt unterschiedliche Sätze mit demselben Visualtyp', () => {
    const first = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
    }).storyboard.id;
    const second = buildMotionScene({
      sentence: 'Die KI erstellt eine Übersetzung.',
    }).storyboard.id;

    expect(first).not.toBe(second);
    expect(first.startsWith('motion-input-output-')).toBe(true);
    expect(second.startsWith('motion-input-output-')).toBe(true);
  });

  it('übernimmt eine explizite Storyboard-ID', () => {
    const storyboard = buildMotionScene({
      sentence: 'Die KI erstellt eine Zusammenfassung.',
      storyboardId: '  reel-2026-08-02-scene-01  ',
    }).storyboard;

    expect(storyboard.id).toBe('reel-2026-08-02-scene-01');
  });

  it('lehnt eine leere explizite Storyboard-ID ab', () => {
    expect(() =>
      buildMotionScene({
        sentence: 'Die KI erstellt eine Zusammenfassung.',
        storyboardId: '   ',
      }),
    ).toThrow('Storyboard-ID darf nicht leer sein.');
  });
});
