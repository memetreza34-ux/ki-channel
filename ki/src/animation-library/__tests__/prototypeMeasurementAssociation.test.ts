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
  return sanitizePrototypeRuntimeContent({animationId, spokenText, derived});
};

describe('prototype measurement association', () => {
  it('binds a single explicit probability to the named candidate', () => {
    const result = deriveSafe(
      'probability-probability-fluid-columns-v1',
      'Antwort A bleibt möglich, Antwort B liegt bei 70 Prozent und Antwort C bleibt offen.',
    );

    expect(result.labels.candidate1).toBe('Antwort A');
    expect(result.labels.candidate2).toBe('Antwort B');
    expect(result.labels.candidate3).toBe('Antwort C');
    expect(result.values.candidate1ProbabilityExact).toBe(0);
    expect(result.values.candidate2ProbabilityExact).toBe(1);
    expect(result.values.candidate3ProbabilityExact).toBe(0);
    expect(result.values.candidate2End).toBe(70);
    expect(
      Number(result.values.candidate1End) +
        Number(result.values.candidate2End) +
        Number(result.values.candidate3End),
    ).toBe(100);
  });

  it('binds three explicit probabilities to their spoken candidates', () => {
    const result = deriveSafe(
      'probability-probability-fluid-columns-v1',
      'Antwort A hat 15 Prozent, Antwort B hat 70 Prozent und Antwort C hat 15 Prozent.',
    );

    expect(result.values.candidate1End).toBe(15);
    expect(result.values.candidate2End).toBe(70);
    expect(result.values.candidate3End).toBe(15);
    expect(result.values.candidate1ProbabilityExact).toBe(1);
    expect(result.values.candidate2ProbabilityExact).toBe(1);
    expect(result.values.candidate3ProbabilityExact).toBe(1);
  });

  it('keeps latency measurements attached to spoken path order even when the first path is faster', () => {
    const result = deriveSafe(
      'scale-performance-latency-tunnel-race-v1',
      'Der schnelle Pfad braucht 340 Millisekunden, der langsame Pfad 780 Millisekunden.',
    );

    expect(result.values.measurementExact).toBe(1);
    expect(result.values.slowLatency).toBe(340);
    expect(result.values.fastLatency).toBe(780);
    expect(result.labels.latencyUnit).toBe('ms');
  });

  it('keeps latency measurements attached to spoken path order in the usual slow-then-fast case', () => {
    const result = deriveSafe(
      'scale-performance-latency-tunnel-race-v1',
      'Der serielle Pfad braucht 780 Millisekunden, der parallele Pfad 340 Millisekunden.',
    );

    expect(result.values.slowLatency).toBe(780);
    expect(result.values.fastLatency).toBe(340);
  });
});
