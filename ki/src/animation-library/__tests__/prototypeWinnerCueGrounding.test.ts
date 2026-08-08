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

const numberValue = (value: string | number | undefined): number =>
  Number(value ?? Number.NaN);

describe('winner cue grounding', () => {
  it('does not leak a later Tool B winner cue onto Tool A', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Tool A verliert klar, Tool B gewinnt den Vergleich.',
    );

    expect(result.labels.candidate1).toBe('Tool A');
    expect(result.labels.candidate2).toBe('Tool B');
    expect(result.values.rankingOutcomeGrounded).toBe(1);
    expect(numberValue(result.values.candidate2End)).toBeGreaterThan(
      numberValue(result.values.candidate1End),
    );
  });

  it('does not leak a later Modell B winner cue onto Modell A', () => {
    const result = deriveSafe(
      'comparison-benchmark-racetrack-v1',
      'Modell A verliert klar, Modell B gewinnt den Gesamtvergleich.',
    );

    expect(result.labels.competitor1).toBe('Modell A');
    expect(result.labels.competitor2).toBe('Modell B');
    expect(result.values.comparisonOutcomeGrounded).toBe(1);
    expect(numberValue(result.values.competitor2Final)).toBeGreaterThan(
      numberValue(result.values.competitor1Final),
    );
  });

  it('does not infer a winner from a nearby negative sentence', () => {
    const result = deriveSafe(
      'ranking-dynamic-podium-rise-v1',
      'Tool A ist nicht der Gewinner. Tool B und Tool C werden nur verglichen.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(0);
  });
});
