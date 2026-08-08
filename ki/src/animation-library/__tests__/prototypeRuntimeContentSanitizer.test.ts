import {describe, expect, it} from 'vitest';
import {enhanceSceneMeaning} from '../extendedMeaningContract';
import {derivePrototypeRuntimeContent} from '../prototypeRuntimeContentDeriver';
import {sanitizePrototypeRuntimeContent} from '../prototypeRuntimeContentSanitizer';

const deriveSafe = (animationId: string, spokenText: string) => {
  const derived = derivePrototypeRuntimeContent({
    animationId,
    spokenText,
    meaningContract: enhanceSceneMeaning(spokenText),
  });
  return sanitizePrototypeRuntimeContent({
    animationId,
    spokenText,
    derived,
  });
};

describe('prototype runtime content sanitizer', () => {
  it('repairs truncated article-plus-initial entity fragments', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Die Suche vergleicht Tool A und Tool B nach Tempo und Qualität.',
    );
    const candidates = Object.entries(result.labels)
      .filter(([key]) => /^candidate\d+$/.test(key))
      .map(([, value]) => value);

    expect(candidates.some((value) => /^(?:Die|Der|Das|Ein|Eine) [A-ZÄÖÜ0-9]$/.test(value))).toBe(false);
    expect(candidates).toContain('Tool A');
    expect(candidates).toContain('Tool B');
  });

  it('preserves an explicit 100 percent probability as 100/0/0', () => {
    const result = deriveSafe(
      'probability-probability-fluid-columns-v1',
      'Nach dem eindeutigen Kontext liegt die Wahrscheinlichkeit für Antwort A bei 100 Prozent.',
    );

    expect(result.values.candidate1End).toBe(100);
    expect(result.values.candidate2End).toBe(0);
    expect(result.values.candidate3End).toBe(0);
    expect(
      Number(result.values.candidate1End) +
        Number(result.values.candidate2End) +
        Number(result.values.candidate3End),
    ).toBe(100);
  });

  it('keeps exact cost values only when a real unit is present', () => {
    const exact = deriveSafe(
      'cost-efficiency-budget-leak-meter-v1',
      'Der Prompt kostet zuerst 94 Cent und nach weniger Kontext nur noch 28 Cent.',
    );
    expect(exact.values.measurementExact).toBe(1);
    expect(exact.values.initialCost).toBe(94);
    expect(exact.values.optimizedCost).toBe(28);
    expect(exact.labels.currency).toBe('ct');

    const relative = deriveSafe(
      'cost-efficiency-budget-leak-meter-v1',
      'Drei unnötige Schritte treiben die Kosten hoch, danach sinken sie deutlich.',
    );
    expect(relative.values.measurementExact).toBe(0);
    expect(relative.values.initialCost).toBeUndefined();
    expect(relative.values.optimizedCost).toBeUndefined();
    expect(relative.values.leak1Amount).toBeUndefined();
  });

  it('ignores unrelated numbers before unit-bound cost measurements', () => {
    const exact = deriveSafe(
      'cost-efficiency-budget-leak-meter-v1',
      'Drei Schritte kosten zuerst 94 Cent und nach der Optimierung nur noch 28 Cent.',
    );

    expect(exact.values.measurementExact).toBe(1);
    expect(exact.values.initialCost).toBe(94);
    expect(exact.values.optimizedCost).toBe(28);
    expect(exact.labels.currency).toBe('ct');
  });

  it('supports euro values before or after the currency symbol', () => {
    const suffix = deriveSafe(
      'cost-efficiency-budget-leak-meter-v1',
      'Der Lauf kostet zuerst 12 Euro und später 7 Euro.',
    );
    expect(suffix.values.initialCost).toBe(12);
    expect(suffix.values.optimizedCost).toBe(7);
    expect(suffix.labels.currency).toBe('€');

    const prefix = deriveSafe(
      'cost-efficiency-budget-leak-meter-v1',
      'Der Lauf kostet zuerst € 12 und später € 7.',
    );
    expect(prefix.values.initialCost).toBe(12);
    expect(prefix.values.optimizedCost).toBe(7);
    expect(prefix.labels.currency).toBe('€');
  });

  it('keeps exact latency values only when a real time unit is present', () => {
    const exact = deriveSafe(
      'scale-performance-latency-tunnel-race-v1',
      'Der serielle Pfad braucht 780 Millisekunden, der parallele Pfad 340 Millisekunden.',
    );
    expect(exact.values.measurementExact).toBe(1);
    expect(exact.values.slowLatency).toBe(780);
    expect(exact.values.fastLatency).toBe(340);
    expect(exact.labels.latencyUnit).toBe('ms');

    const relative = deriveSafe(
      'scale-performance-latency-tunnel-race-v1',
      'Unter hoher Last wird der serielle Pfad langsamer, während der parallele Pfad schneller bleibt.',
    );
    expect(relative.values.measurementExact).toBe(0);
    expect(relative.values.slowLatency).toBeUndefined();
    expect(relative.values.fastLatency).toBeUndefined();
  });

  it('ignores unrelated numbers before unit-bound latency measurements', () => {
    const exact = deriveSafe(
      'scale-performance-latency-tunnel-race-v1',
      'Drei Pfade werden geprüft: seriell 780 Millisekunden, parallel 340 Millisekunden.',
    );

    expect(exact.values.measurementExact).toBe(1);
    expect(exact.values.slowLatency).toBe(780);
    expect(exact.values.fastLatency).toBe(340);
    expect(exact.labels.latencyUnit).toBe('ms');
  });
});
