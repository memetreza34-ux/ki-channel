import {describe, expect, it} from 'vitest';
import {classifySentence, createDefaultStoryboard} from '../router';
import {motionStoryboardSchema} from '../schema';
import {alignStoryboardToWords} from '../audioSync';
import {TEMPLATE_REGISTRY} from '../templates/TemplateRegistry';

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

describe('alignStoryboardToWords', () => {
  it('verlängert die Szene bis hinter das Audio', () => {
    const storyboard = createDefaultStoryboard('Die KI nutzt Dateien.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Die', startMs: 0, endMs: 180},
      {text: 'KI', startMs: 200, endMs: 450},
      {text: 'nutzt', startMs: 500, endMs: 800},
      {text: 'Dateien', startMs: 900, endMs: 1400},
    ]);
    expect(aligned.durationInFrames).toBeGreaterThanOrEqual(72);
    expect(() => motionStoryboardSchema.parse(aligned)).not.toThrow();
  });
});

describe('TEMPLATE_REGISTRY', () => {
  it('enthält ein Layout für jeden Visualtyp', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    expect(TEMPLATE_REGISTRY[storyboard.visualType]).toBeDefined();
  });
});
