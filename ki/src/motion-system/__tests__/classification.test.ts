import {describe, expect, it} from 'vitest';
import {
  classifySentence,
  explainSentenceClassification,
} from '../router';

describe('Tokenbasierte Satzklassifikation', () => {
  it('vermeidet Teiltreffer durch häufige Wortbestandteile', () => {
    expect(classifySentence('Der Ablauf besteht aus mehreren Schritten.')).toBe(
      'process-chain',
    );
    expect(classifySentence('Die Mehrwertsteuer wird automatisch berechnet.')).toBe(
      'input-output',
    );
    expect(classifySentence('Ein kurzer Satz wird zusammengefasst.')).toBe(
      'input-output',
    );
  });

  it('erkennt gebeugte Fachbegriffe über kontrollierte Präfixmuster', () => {
    expect(classifySentence('Die KI halluziniert eine falsche Quelle.')).toBe(
      'error-path',
    );
    expect(classifySentence('Mehrere Werkzeuge werden nacheinander aufgerufen.')).toBe(
      'tool-orchestration',
    );
    expect(classifySentence('Vier Schritte bilden einen klaren Prozess.')).toBe(
      'process-chain',
    );
  });

  it('gewichtet spezifische Phrasen stärker als einzelne Nebenbegriffe', () => {
    expect(
      classifySentence('Modell A ist besser als Modell B und nutzt mehr Daten.'),
    ).toBe('comparison');
    expect(
      classifySentence('Vorher war die API langsam, jetzt ist sie schneller.'),
    ).toBe('before-after');
  });

  it('bevorzugt Werkzeug-Orchestrierung, wenn ein Agent konkrete Tools nutzt', () => {
    const explanation = explainSentenceClassification(
      'Der KI-Agent nutzt Browser und Dateien.',
    );

    expect(explanation.visualType).toBe('tool-orchestration');
    expect(explanation.candidates[0].visualType).toBe('tool-orchestration');
    expect(
      explanation.candidates.some(
        (candidate) => candidate.visualType === 'agent-loop',
      ),
    ).toBe(true);
  });

  it('liefert normalisierten Text, Treffer und nachvollziehbare Scores', () => {
    const explanation = explainSentenceClassification(
      '  MODELL A ist BESSER ALS Modell B!  ',
    );

    expect(explanation.normalizedText).toBe(
      'modell a ist besser als modell b',
    );
    expect(explanation.visualType).toBe('comparison');
    expect(explanation.candidates[0].matchedPatterns).toContain('besser als');
    expect(explanation.candidates[0].score).toBeGreaterThan(0);
  });

  it('fällt ohne Regel-Treffer transparent auf Input-Output zurück', () => {
    const explanation = explainSentenceClassification(
      'Die KI erstellt eine kurze Zusammenfassung.',
    );

    expect(explanation.visualType).toBe('input-output');
    expect(explanation.candidates).toEqual([]);
  });
});
