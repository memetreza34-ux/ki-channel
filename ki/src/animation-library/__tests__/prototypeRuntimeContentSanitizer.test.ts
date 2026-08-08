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

const numeric = (value: string | number | undefined): number =>
  Number(value ?? Number.NaN);

describe('prototype runtime content sanitizer', () => {
  it('prioritizes structured entities over generic sentence-start nouns', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Die Suche vergleicht Tool A und Tool B nach Tempo und Qualität.',
    );
    const candidates = Object.entries(result.labels)
      .filter(([key]) => /^candidate\d+$/.test(key))
      .map(([, value]) => value);

    expect(
      candidates.some((value) =>
        /^(?:Die|Der|Das|Ein|Eine) [A-ZÄÖÜ0-9]$/.test(value),
      ),
    ).toBe(false);
    expect(candidates[0]).toBe('Tool A');
    expect(candidates[1]).toBe('Tool B');
  });

  it('preserves an explicit 100 percent probability as 100/0/0', () => {
    const result = deriveSafe(
      'probability-probability-fluid-columns-v1',
      'Nach dem eindeutigen Kontext liegt die Wahrscheinlichkeit für Antwort A bei 100 Prozent.',
    );

    expect(result.values.candidate1End).toBe(100);
    expect(result.values.candidate2End).toBe(0);
    expect(result.values.candidate3End).toBe(0);
    expect(result.values.candidate1ProbabilityExact).toBe(1);
    expect(result.values.probabilityOutcomeGrounded).toBe(1);
    expect(
      numeric(result.values.candidate1End) +
        numeric(result.values.candidate2End) +
        numeric(result.values.candidate3End),
    ).toBe(100);
  });

  it('does not claim a probability winner without a number or winner cue', () => {
    const result = deriveSafe(
      'probability-probability-fluid-columns-v1',
      'Kontext, Grammatik und Thema verschieben die möglichen Antworten unterschiedlich.',
    );

    expect(result.values.probabilityOutcomeGrounded).toBe(0);
    expect(result.values.candidate1ProbabilityExact).toBe(0);
    expect(result.values.candidate2ProbabilityExact).toBe(0);
    expect(result.values.candidate3ProbabilityExact).toBe(0);
  });

  it('grounds a probability outcome from an explicit spoken winner without inventing exact percentages', () => {
    const result = deriveSafe(
      'probability-probability-fluid-columns-v1',
      'Nach allen Kontextsignalen gewinnt Antwort B klar vor den anderen Kandidaten.',
    );

    expect(result.values.probabilityOutcomeGrounded).toBe(1);
    expect(result.values.candidate1ProbabilityExact).toBe(0);
    expect(result.values.candidate2ProbabilityExact).toBe(0);
    expect(result.values.candidate3ProbabilityExact).toBe(0);
    expect(result.labels.candidate1).toBe('Antwort B');
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

  it('does not ground a ranking winner from internal illustrative scores alone', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Tool A, Tool B und Tool C werden nach Preis, Tempo und Qualität verglichen.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(0);
    expect(result.values.candidate1ScoreExact).toBe(0);
    expect(result.values.candidate2ScoreExact).toBe(0);
    expect(result.values.candidate3ScoreExact).toBe(0);
  });

  it('grounds a ranking winner from an explicit winner cue without showing fake scores', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Nach Preis, Tempo und Qualität gewinnt Tool B den Vergleich.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(1);
    expect(result.values.candidate1ScoreExact).toBe(0);
    expect(result.values.candidate2ScoreExact).toBe(0);
    expect(result.values.candidate3ScoreExact).toBe(0);

    const toolBIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool B',
    );
    expect(toolBIndex).toBeDefined();
    const winnerScore = numeric(result.values[`candidate${toolBIndex}End`]);
    const otherScores = [1, 2, 3]
      .filter((index) => index !== toolBIndex)
      .map((index) => numeric(result.values[`candidate${index}End`]));
    expect(otherScores.every((score) => winnerScore > score)).toBe(true);
  });

  it('marks only spoken ranking scores as exact', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Tool A erreicht 96 Punkte, Tool B erreicht 88 Punkte und Tool C bleibt ohne exakten Score.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(1);
    expect(result.values.candidate1ScoreExact).toBe(1);
    expect(result.values.candidate2ScoreExact).toBe(1);
    expect(result.values.candidate3ScoreExact).toBe(0);
    expect(result.values.candidate1End).toBe(96);
    expect(result.values.candidate2End).toBe(88);
  });

  it('does not ground a benchmark winner without scores or a spoken winner', () => {
    const result = deriveSafe(
      'comparison-benchmark-racetrack-v1',
      'Modell A und Modell B werden bei Tempo, Kosten und Qualität verglichen.',
    );

    expect(result.values.comparisonOutcomeGrounded).toBe(0);
    expect(result.values.competitor1ScoreExact).toBe(0);
    expect(result.values.competitor2ScoreExact).toBe(0);
  });

  it('grounds a benchmark winner from an explicit spoken winner cue', () => {
    const result = deriveSafe(
      'comparison-benchmark-racetrack-v1',
      'Im Gesamtvergleich gewinnt Modell B klar gegen Modell A.',
    );

    expect(result.values.comparisonOutcomeGrounded).toBe(1);
    const modelBIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell B',
    );
    expect(modelBIndex).toBeDefined();
    const otherIndex = modelBIndex === 1 ? 2 : 1;
    expect(
      numeric(result.values[`competitor${modelBIndex}Final`]),
    ).toBeGreaterThan(
      numeric(result.values[`competitor${otherIndex}Final`]),
    );
  });

  it('marks explicit benchmark scores as exact per competitor', () => {
    const result = deriveSafe(
      'comparison-benchmark-racetrack-v1',
      'Modell A erreicht 96 Punkte, Modell B erreicht 88 Punkte.',
    );

    expect(result.values.comparisonOutcomeGrounded).toBe(1);
    expect(result.values.competitor1ScoreExact).toBe(1);
    expect(result.values.competitor2ScoreExact).toBe(1);
    expect(result.values.competitor1Final).toBe(96);
    expect(result.values.competitor2Final).toBe(88);
  });
});
