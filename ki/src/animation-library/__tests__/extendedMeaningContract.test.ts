import {describe, expect, it} from 'vitest';
import {
  EXTENDED_MEANING_RULE_IDS,
  enhanceSceneMeaning,
} from '../extendedMeaningContract';

describe('extended scene meaning contract', () => {
  it('covers every previously missing high-value animation domain', () => {
    expect(EXTENDED_MEANING_RULE_IDS).toEqual(
      expect.arrayContaining([
        'ranking',
        'input-output',
        'error-detection',
        'model-processing',
        'relationship-network',
        'decision-logic',
        'cost-efficiency',
        'scale-performance',
        'time-change',
      ]),
    );
  });

  it.each([
    {
      text: 'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.',
      family: 'scale-performance',
      goal: 'show-limitation',
      cue: 'visible-bottleneck',
    },
    {
      text: 'Diese Methode senkt die Tokenkosten und benötigt weniger Ressourcen.',
      family: 'cost-efficiency',
      goal: 'show-result',
      cue: 'visible-reduction',
    },
    {
      text: 'Die Eingabe aus mehreren Quellen wird zu einem Ergebnis verdichtet.',
      family: 'input-output',
      goal: 'show-transformation',
      cue: 'traceable-convergence',
    },
    {
      text: 'Wenn die Bedingung erfüllt ist, öffnet sich genau dieser Entscheidungsweg.',
      family: 'decision-logic',
      goal: 'explain-process',
      cue: 'branching-paths',
    },
    {
      text: 'Der Input wird im Transformer durch mehrere Schichten verarbeitet.',
      family: 'model-processing',
      goal: 'explain-process',
      cue: 'ordered-layers',
    },
    {
      text: 'Attention verstärkt die Verbindung zwischen den wichtigsten Wörtern.',
      family: 'relationship-network',
      goal: 'reveal-cause',
      cue: 'weighted-links',
    },
    {
      text: 'Die Modelle werden nach ihrem Score in eine klare Reihenfolge gebracht.',
      family: 'ranking',
      goal: 'rank',
      cue: 'final-order',
    },
    {
      text: 'Von früher bis heute verändert sich das Modell über mehrere Versionen.',
      family: 'time-change',
      goal: 'show-change-over-time',
      cue: 'time-axis',
    },
  ])('maps $family content to an executable visual contract', ({
    text,
    family,
    goal,
    cue,
  }) => {
    const contract = enhanceSceneMeaning(text);

    expect(contract.preferredVisualFamilies[0]).toBe(family);
    expect(contract.communicationGoal).toBe(goal);
    expect(contract.requiredVisualCues).toContain(cue);
    expect(contract.startState.length).toBeGreaterThan(20);
    expect(contract.visibleChange.length).toBeGreaterThan(20);
    expect(contract.endState.length).toBeGreaterThan(20);
  });

  it('does not replace the base meaning from one generic word alone', () => {
    const contract = enhanceSceneMeaning(
      'Das System besitzt eine interne Regel.',
    );

    expect(contract.communicationGoal).toBe('show-result');
    expect(contract.preferredVisualFamilies[0]).not.toBe('decision-logic');
  });
});
