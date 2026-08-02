import {describe, expect, it} from 'vitest';
import {getSentenceTypography} from '../textLayout';

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
