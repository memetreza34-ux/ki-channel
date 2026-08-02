import {describe, expect, it} from 'vitest';
import {classifySentence, createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';

describe('classifySentence', () => {
  it('erkennt Tool-Orchestrierung', () => {
    expect(classifySentence('Der KI-Agent nutzt Browser, E-Mail und Dateien.')).toBe('tool-orchestration');
  });

  it('erkennt Fehlerpfade', () => {
    expect(classifySentence('Die KI kann eine falsche Antwort halluzinieren.')).toBe('error-path');
  });

  it('fällt sicher auf Input-Output zurück', () => {
    expect(classifySentence('Die KI erstellt eine Zusammenfassung.')).toBe('input-output');
  });
});

describe('createDefaultStoryboard', () => {
  it('erzeugt ein valides Storyboard', () => {
    const storyboard = createDefaultStoryboard('Die KI nutzt mehrere Werkzeuge.');
    expect(() => motionStoryboardSchema.parse(storyboard)).not.toThrow();
    expect(storyboard.durationInFrames).toBeGreaterThanOrEqual(30);
  });
});
