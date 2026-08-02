import {describe, expect, it} from 'vitest';
import {getLabelTypography, getSentenceTypography} from '../textLayout';

describe('Satz-Typografie', () => {
  it('verwendet für kurze Sätze die größte Schrift', () => {
    expect(getSentenceTypography('Die KI erstellt ein Ergebnis.').fontSize).toBe(34);
  });

  it('verkleinert die Schrift stufenweise für längere Sätze', () => {
    const short = getSentenceTypography('x'.repeat(70));
    const medium = getSentenceTypography('x'.repeat(120));
    const long = getSentenceTypography('x'.repeat(200));
    const extreme = getSentenceTypography('x'.repeat(240));

    expect(short.fontSize).toBeGreaterThan(medium.fontSize);
    expect(medium.fontSize).toBeGreaterThan(long.fontSize);
    expect(long.fontSize).toBeGreaterThan(extreme.fontSize);
  });

  it('reduziert bei sehr langen Einzelwörtern zusätzlich', () => {
    const regular = getSentenceTypography('Ein normaler kurzer Satz mit mehreren Wörtern.');
    const longToken = getSentenceTypography(
      'Ein Satz mit einem extremlangenungetrenntenFachbegriffimText.',
    );

    expect(longToken.fontSize).toBeLessThan(regular.fontSize);
  });

  it('liefert immer positive, renderbare Werte', () => {
    for (const sentence of ['', 'kurz', 'x'.repeat(400)]) {
      const typography = getSentenceTypography(sentence);
      expect(typography.fontSize).toBeGreaterThan(0);
      expect(typography.lineHeight).toBeGreaterThan(1);
    }
  });
});

describe('Element-Label-Typografie', () => {
  it('verkleinert lange Kartenbeschriftungen', () => {
    const short = getLabelTypography('KI');
    const medium = getLabelTypography('Aktueller Kontext');
    const long = getLabelTypography('Automatisierte Dokumentenanalyse');

    expect(short.fontSize).toBeGreaterThan(medium.fontSize);
    expect(medium.fontSize).toBeGreaterThanOrEqual(long.fontSize);
  });

  it('respektiert individuelle Mindest- und Maximalgrößen', () => {
    const typography = getLabelTypography('Sehr lange Kartenbeschriftung', {
      maxFontSize: 42,
      minFontSize: 28,
    });

    expect(typography.fontSize).toBeGreaterThanOrEqual(28);
    expect(typography.fontSize).toBeLessThanOrEqual(42);
  });

  it('reduziert sehr lange Einzelwörter stärker', () => {
    const normal = getLabelTypography('Dokumenten Analyse');
    const longToken = getLabelTypography('Dokumentenanalyseautomatisierung');

    expect(longToken.fontSize).toBeLessThan(normal.fontSize);
  });

  it('lehnt ungültige Schriftgrenzen ab', () => {
    expect(() => getLabelTypography('Label', {maxFontSize: 20, minFontSize: 24})).toThrow();
    expect(() => getLabelTypography('Label', {maxFontSize: 0})).toThrow();
  });
});
