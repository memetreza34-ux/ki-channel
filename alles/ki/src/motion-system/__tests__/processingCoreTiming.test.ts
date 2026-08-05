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
    expect(getProcessingCoreEntryProgress(midpoint, startFrame)).toBeCloseTo(0.5);
    expect(
      getProcessingCoreEntryProgress(
        startFrame + PROCESSING_CORE_ENTRY_DURATION,
        startFrame,
      ),
    ).toBe(1);
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
