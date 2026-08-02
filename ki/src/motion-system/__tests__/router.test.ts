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

  it('erkennt normalisierte Varianten', () => {
    expect(classifySentence('  MODELL A   VERSUS Modell B! ')).toBe('comparison');
    expect(classifySentence('Die RAG-Pipeline verbindet mehrere Quellen.')).toBe('data-flow');
    expect(classifySentence('Der Ablauf besteht aus mehreren Schritten.')).toBe('process-chain');
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

  it('trimmt den Satz vor der Erstellung', () => {
    expect(createDefaultStoryboard('  Die KI erstellt Text.  ').sentence).toBe('Die KI erstellt Text.');
  });

  it('lehnt leere Sätze früh ab', () => {
    expect(() => createDefaultStoryboard('   ')).toThrow('Der Satz darf nicht leer sein.');
  });
});

describe('motionStoryboardSchema', () => {
  it('lehnt doppelte Element-IDs ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const invalid = {
      ...storyboard,
      elements: [storyboard.elements[0], {...storyboard.elements[1], id: storyboard.elements[0].id}],
    };
    expect(motionStoryboardSchema.safeParse(invalid).success).toBe(false);
  });

  it('lehnt doppelte Beat-IDs ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const invalid = {
      ...storyboard,
      beats: [storyboard.beats[0], {...storyboard.beats[1], id: storyboard.beats[0].id}],
    };
    expect(motionStoryboardSchema.safeParse(invalid).success).toBe(false);
  });

  it('lehnt Beats mit unbekannten Ziel-IDs ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const invalid = {
      ...storyboard,
      beats: [{...storyboard.beats[0], targetId: 'missing-element'}, ...storyboard.beats.slice(1)],
    };
    expect(motionStoryboardSchema.safeParse(invalid).success).toBe(false);
  });

  it('lehnt Beats mit unbekannten Quell-IDs ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const connectBeat = storyboard.beats.find((beat) => beat.action === 'connect');
    const invalid = {
      ...storyboard,
      beats: storyboard.beats.map((beat) =>
        beat.id === connectBeat?.id ? {...beat, sourceId: 'missing-source'} : beat,
      ),
    };
    expect(motionStoryboardSchema.safeParse(invalid).success).toBe(false);
  });

  it('lehnt Beats außerhalb der Szenendauer ab', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    const invalid = {
      ...storyboard,
      beats: [{...storyboard.beats[0], atFrame: storyboard.durationInFrames}, ...storyboard.beats.slice(1)],
    };
    expect(motionStoryboardSchema.safeParse(invalid).success).toBe(false);
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

  it('verschiebt passende Beats auf Wort-Timestamps', () => {
    const storyboard = createDefaultStoryboard('Die KI nutzt Dateien.');
    const aligned = alignStoryboardToWords(storyboard, [
      {text: 'Die', startMs: 0, endMs: 100},
      {text: 'KI', startMs: 200, endMs: 400},
      {text: 'Dateien', startMs: 1000, endMs: 1300},
    ]);
    const filesBeat = aligned.beats.find((beat) => beat.targetId === 'files');
    expect(filesBeat?.atFrame).toBe(30);
  });

  it('lässt das Storyboard ohne Wörter unverändert', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    expect(alignStoryboardToWords(storyboard, [])).toBe(storyboard);
  });
});

describe('TEMPLATE_REGISTRY', () => {
  it('enthält ein Layout für jeden Visualtyp', () => {
    const storyboard = createDefaultStoryboard('Die KI erstellt eine Zusammenfassung.');
    expect(TEMPLATE_REGISTRY[storyboard.visualType]).toBeDefined();
  });
});
