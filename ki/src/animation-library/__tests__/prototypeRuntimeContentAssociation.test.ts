import {describe, expect, it} from 'vitest';
import {associatePrototypeRuntimeContent} from '../prototypeRuntimeContentAssociation';
import {enhanceSceneMeaning} from '../extendedMeaningContract';
import {derivePrototypeRuntimeContent} from '../prototypeRuntimeContentDeriver';
import {sanitizePrototypeRuntimeContent} from '../prototypeRuntimeContentSanitizer';

const prepare = (animationId: string, spokenText: string) => {
  const derived = derivePrototypeRuntimeContent({
    animationId,
    spokenText,
    meaningContract: enhanceSceneMeaning(spokenText),
  });
  const sanitized = sanitizePrototypeRuntimeContent({
    animationId,
    spokenText,
    derived,
  });
  return associatePrototypeRuntimeContent({
    animationId,
    spokenText,
    content: sanitized,
  });
};

describe('prototype runtime content association', () => {
  it('binds reversed ranking scores but keeps the winner open while one candidate is unscored', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A, Tool B und Tool C werden verglichen. Tool B erreicht 88 Punkte, Tool A erreicht 96 Punkte.',
    );

    const toolAIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool A',
    );
    const toolBIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool B',
    );
    const toolCIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool C',
    );
    expect(toolAIndex).toBeDefined();
    expect(toolBIndex).toBeDefined();
    expect(toolCIndex).toBeDefined();
    expect(result.values[`candidate${toolAIndex}End`]).toBe(96);
    expect(result.values[`candidate${toolBIndex}End`]).toBe(88);
    expect(result.values[`candidate${toolAIndex}ScoreExact`]).toBe(1);
    expect(result.values[`candidate${toolBIndex}ScoreExact`]).toBe(1);
    expect(result.values[`candidate${toolCIndex}ScoreExact`]).toBe(0);
    expect(result.values.rankingOutcomeGrounded).toBe(0);
  });

  it('grounds a ranking winner when all three named scores are explicit and unique', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool B erreicht 88 Punkte, Tool A erreicht 96 Punkte und Tool C erreicht 82 Punkte.',
    );

    expect(result.values.candidate1ScoreExact).toBe(1);
    expect(result.values.candidate2ScoreExact).toBe(1);
    expect(result.values.candidate3ScoreExact).toBe(1);
    expect(result.values.rankingOutcomeGrounded).toBe(1);
  });

  it('does not ground a ranking winner when the highest explicit scores tie', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A erreicht 96 Punkte, Tool B erreicht 96 Punkte und Tool C erreicht 82 Punkte.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(0);
  });

  it('allows an explicit spoken ranking winner even when not every score is given', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A erreicht 96 Punkte und gewinnt den Vergleich gegen Tool B und Tool C.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(1);
  });

  it('keeps a named ranking winner visually ahead of a 96 point partial score', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A gewinnt den Vergleich. Tool B erreicht 96 Punkte und Tool C bleibt ohne Score.',
    );
    const toolAIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool A',
    )!;
    const toolBIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool B',
    )!;

    expect(result.values.rankingOutcomeGrounded).toBe(1);
    expect(result.values[`candidate${toolAIndex}ScoreExact`]).toBe(0);
    expect(result.values[`candidate${toolBIndex}ScoreExact`]).toBe(1);
    expect(result.values[`candidate${toolBIndex}End`]).toBe(96);
    expect(Number(result.values[`candidate${toolAIndex}End`])).toBeGreaterThan(96);
  });

  it('rejects an explicit ranking winner that cannot beat a known 100 point competitor', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A gewinnt den Vergleich. Tool B erreicht 100 Punkte und Tool C bleibt ohne Score.',
    );

    expect(result.values.rankingOutcomeGrounded).toBe(0);
  });

  it('binds reversed benchmark score mentions to the named models', () => {
    const result = prepare(
      'comparison-benchmark-racetrack-v1',
      'Modell A und Modell B werden verglichen. Modell B erreicht 88 Punkte, Modell A erreicht 96 Punkte.',
    );

    const modelAIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell A',
    );
    const modelBIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell B',
    );
    expect(modelAIndex).toBeDefined();
    expect(modelBIndex).toBeDefined();
    expect(result.values[`competitor${modelAIndex}Final`]).toBe(96);
    expect(result.values[`competitor${modelBIndex}Final`]).toBe(88);
    expect(result.values[`competitor${modelAIndex}ScoreExact`]).toBe(1);
    expect(result.values[`competitor${modelBIndex}ScoreExact`]).toBe(1);
    expect(result.values.comparisonOutcomeGrounded).toBe(1);
  });

  it('does not ground a benchmark winner when both exact scores tie', () => {
    const result = prepare(
      'comparison-benchmark-racetrack-v1',
      'Modell A erreicht 90 Punkte und Modell B erreicht 90 Punkte.',
    );

    expect(result.values.comparisonOutcomeGrounded).toBe(0);
  });

  it('uses the 0 to 100 score scale for a benchmark winner without explicit scores', () => {
    const result = prepare(
      'comparison-benchmark-racetrack-v1',
      'Modell B gewinnt den Vergleich gegen Modell A.',
    );
    const modelAIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell A',
    )!;
    const modelBIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell B',
    )!;

    expect(result.values.comparisonOutcomeGrounded).toBe(1);
    expect(Number(result.values[`competitor${modelBIndex}Final`])).toBeGreaterThanOrEqual(84);
    expect(Number(result.values[`competitor${modelBIndex}Final`])).toBeGreaterThan(
      Number(result.values[`competitor${modelAIndex}Final`]),
    );
  });

  it('keeps a named benchmark winner ahead of a partial exact opponent score', () => {
    const result = prepare(
      'comparison-benchmark-racetrack-v1',
      'Modell A gewinnt den Vergleich. Modell B erreicht 96 Punkte.',
    );
    const modelAIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell A',
    )!;
    const modelBIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell B',
    )!;

    expect(result.values.comparisonOutcomeGrounded).toBe(1);
    expect(result.values[`competitor${modelBIndex}Final`]).toBe(96);
    expect(Number(result.values[`competitor${modelAIndex}Final`])).toBeGreaterThan(96);
  });

  it('rejects an explicit benchmark winner contradicted by a known 100 point opponent', () => {
    const result = prepare(
      'comparison-benchmark-racetrack-v1',
      'Modell A gewinnt den Vergleich. Modell B erreicht 100 Punkte.',
    );

    expect(result.values.comparisonOutcomeGrounded).toBe(0);
  });

  it('keeps an actual spoken cost reduction in spoken order', () => {
    const result = prepare(
      'cost-efficiency-budget-leak-meter-v1',
      'Durch Optimierung sinken die Kosten von 94 Cent auf 28 Cent.',
    );

    expect(result.values.measurementExact).toBe(1);
    expect(result.values.initialCost).toBe(94);
    expect(result.values.optimizedCost).toBe(28);
    expect(result.labels.currency).toBe('ct');
  });

  it('refuses to turn a spoken cost increase into fake savings', () => {
    const result = prepare(
      'cost-efficiency-budget-leak-meter-v1',
      'Trotz Optimierung steigen die Kosten von 28 Cent auf 94 Cent.',
    );

    expect(result.values.measurementExact).toBe(0);
    expect(result.values.initialCost).toBeUndefined();
    expect(result.values.optimizedCost).toBeUndefined();
    expect(result.values.savedAmount).toBeUndefined();
    expect(result.values.leak1Amount).toBeUndefined();
    expect(result.values.leak2Amount).toBeUndefined();
    expect(result.values.leak3Amount).toBeUndefined();
  });

  it.each([
    {unit: 'ct', spokenText: 'Die Kosten sinken von 94 Cent auf 28 Cent.'},
    {unit: '€', spokenText: 'Die Kosten sinken von 94 Euro auf 28 Euro.'},
    {unit: '$', spokenText: 'Die Kosten sinken von $ 94 auf $ 28.'},
    {unit: 'Credits', spokenText: 'Die Kosten sinken von 94 Credits auf 28 Credits.'},
    {unit: 'Token', spokenText: 'Die Kosten sinken von 94 Token auf 28 Token.'},
  ])('parses $unit cost measurements without invalid dynamic regexes', ({unit, spokenText}) => {
    const result = associatePrototypeRuntimeContent({
      animationId: 'cost-efficiency-budget-leak-meter-v1',
      spokenText,
      content: {
        labels: {currency: unit},
        values: {measurementExact: 1},
      },
    });

    expect(result.values.measurementExact).toBe(1);
    expect(result.values.initialCost).toBe(94);
    expect(result.values.optimizedCost).toBe(28);
  });
});
