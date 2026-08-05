import {describe, expect, it} from 'vitest';
import {createDefaultStoryboard} from '../router';
import {assertMotionStoryboard, validateMotionStoryboard} from '../validation';

describe('Motion-Storyboard-Validierung', () => {
  it('liefert ein validiertes Storyboard zurück', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt aus einer Eingabe ein Ergebnis.');
    const result = validateMotionStoryboard(storyboard);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.storyboard.visualType).toBe('input-output');
      expect(result.issues).toEqual([]);
    }
  });

  it('formatiert verständliche Fehlerpfade', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt aus einer Eingabe ein Ergebnis.');
    const invalid = {
      ...storyboard,
      beats: [{...storyboard.beats[0], targetId: 'missing'}, ...storyboard.beats.slice(1)],
    };

    const result = validateMotionStoryboard(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues.some((issue) => issue.path === 'beats.0.targetId')).toBe(true);
      expect(result.issues.some((issue) => issue.message.includes('Unbekanntes Beat-Ziel'))).toBe(true);
    }
  });

  it('wirft bei ungültigen Daten eine zusammengefasste Fehlermeldung', () => {
    expect(() => assertMotionStoryboard({})).toThrow('Ungültiges Motion-Storyboard');
  });
});
