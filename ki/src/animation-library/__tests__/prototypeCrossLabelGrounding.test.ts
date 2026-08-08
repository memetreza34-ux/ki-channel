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

describe('cross-label grounding', () => {
  it('does not assign Tool B score to Tool A when labels share one clause', () => {
    const result = prepare(
      'ranking-dynamic-podium-rise-v1',
      'Tool A wird geprüft und Tool B erreicht 88 Punkte.',
    );

    const toolAIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool A',
    );
    const toolBIndex = [1, 2, 3].find(
      (index) => result.labels[`candidate${index}`] === 'Tool B',
    );
    expect(toolAIndex).toBeDefined();
    expect(toolBIndex).toBeDefined();
    expect(result.values[`candidate${toolAIndex}ScoreExact`]).toBe(0);
    expect(result.values[`candidate${toolBIndex}ScoreExact`]).toBe(1);
    expect(result.values[`candidate${toolBIndex}End`]).toBe(88);
  });

  it('does not assign Modell B score to Modell A when labels share one clause', () => {
    const result = prepare(
      'comparison-benchmark-racetrack-v1',
      'Modell A wird geprüft und Modell B erreicht 88 Punkte.',
    );

    const modelAIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell A',
    );
    const modelBIndex = [1, 2].find(
      (index) => result.labels[`competitor${index}`] === 'Modell B',
    );
    expect(modelAIndex).toBeDefined();
    expect(modelBIndex).toBeDefined();
    expect(result.values[`competitor${modelAIndex}ScoreExact`]).toBe(0);
    expect(result.values[`competitor${modelBIndex}ScoreExact`]).toBe(1);
    expect(result.values[`competitor${modelBIndex}Final`]).toBe(88);
  });

  it('does not assign Answer B percentage to Answer A without punctuation', () => {
    const derived = derivePrototypeRuntimeContent({
      animationId: 'probability-probability-fluid-columns-v1',
      spokenText:
        'Antwort A bleibt möglich und Antwort B liegt bei 70 Prozent.',
      meaningContract: enhanceSceneMeaning(
        'Antwort A bleibt möglich und Antwort B liegt bei 70 Prozent.',
      ),
    });
    const result = sanitizePrototypeRuntimeContent({
      animationId: 'probability-probability-fluid-columns-v1',
      spokenText:
        'Antwort A bleibt möglich und Antwort B liegt bei 70 Prozent.',
      derived,
    });

    expect(result.labels.candidate1).toBe('Antwort A');
    expect(result.labels.candidate2).toBe('Antwort B');
    expect(result.values.candidate1ProbabilityExact).toBe(0);
    expect(result.values.candidate2ProbabilityExact).toBe(1);
    expect(result.values.candidate2End).toBe(70);
  });
});
