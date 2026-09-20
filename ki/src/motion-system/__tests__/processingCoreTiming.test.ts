import {describe, expect, it} from 'vitest';
import {
  getProcessingCoreEntryProgress,
  PROCESSING_CORE_ENTRY_DURATION,
} from '../components/ProcessingCore';

describe('Processing-Core-Einstieg', () => {
  it('bleibt vor dem Show-Frame vollständig unsichtbar', () => {
    expect(getProcessingCoreEntryProgress(0, 30)).toBe(0);
    expect(getProcessingCoreEntryProgress(29, 30)).toBe(0);
  });

  it('blendet den Core kontrolliert nach dem Show-Frame ein', () => {
    const startFrame = 30;
    const midpoint = startFrame + PROCESSING_CORE_ENTRY_DURATION / 2;

    expect(getProcessingCoreEntryProgress(startFrame, startFrame)).toBe(0);
    expect(
      getProcessingCoreEntryProgress(
        startFrame + PROCESSING_CORE_ENTRY_DURATION,
        startFrame,
      ),
    ).toBe(1);

    // Ease-out: der Einstieg hat vorne Tempo und schwingt hinten aus. Auf der
    // Haelfte der Dauer ist deutlich mehr als die Haelfte des Wegs zurueckgelegt.
    // Ein Wert von exakt 0.5 waere lineare - also mechanisch wirkende - Bewegung.
    const mid = getProcessingCoreEntryProgress(midpoint, startFrame);
    expect(mid).toBeGreaterThan(0.6);
    expect(mid).toBeLessThan(1);
  });

  it('laeuft streng monoton und ohne Ueberschwinger', () => {
    const startFrame = 30;
    let previous = -1;

    for (let offset = 0; offset <= PROCESSING_CORE_ENTRY_DURATION; offset += 1) {
      const value = getProcessingCoreEntryProgress(startFrame + offset, startFrame);
      expect(value).toBeGreaterThanOrEqual(previous);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
      previous = value;
    }
  });

  it('bleibt nach dem Einstieg vollständig sichtbar', () => {
    expect(getProcessingCoreEntryProgress(200, 30)).toBe(1);
  });

  it('lehnt ungültige Framewerte und Dauern ab', () => {
    expect(() => getProcessingCoreEntryProgress(Number.NaN, 0)).toThrow(
      'Core-Framewerte müssen endliche Zahlen sein.',
    );
    expect(() => getProcessingCoreEntryProgress(0, 0, 0)).toThrow(
      'Core-Einstiegsdauer muss eine positive Zahl sein.',
    );
  });
});
