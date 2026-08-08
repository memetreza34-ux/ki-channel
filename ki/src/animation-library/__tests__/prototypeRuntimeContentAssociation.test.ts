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
  it('binds reversed ranking score mentions to the named tools', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A und Tool B werden verglichen. Tool B erreicht 88 Punkte, Tool A erreicht 96 Punkte.',
    );

    const toolAIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool A',
    );
    const toolBIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool B',
    );
    expect(toolAIndex).toBeDefined();
    expect(toolBIndex).toBeDefined();
    expect(result.values[`candidate${toolAIndex}End`]).toBe(96);
    expect(result.values[`candidate${toolBIndex}End`]).toBe(88);
    expect(result.values[`candidate${toolAIndex}ScoreExact`]).toBe(1);
    expect(result.values[`candidate${toolBIndex}ScoreExact`]).toBe(1);
    expect(result.values.rankingOutcomeGrounded).toBe(1);
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
});
