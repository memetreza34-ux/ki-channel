import {describe, expect, it} from 'vitest';
import {loadCreatePrototypeRenderProps} from '../../../../scripts/load-prototype-render-payload.mjs';
import {loadPrototypeRuntimeContentAssociation} from '../../../../scripts/load-prototype-runtime-content-association.mjs';
import {loadPrototypeRuntimeContentDeriver} from '../../../../scripts/load-prototype-runtime-content-deriver.mjs';
import {loadPrototypeRuntimeContentSanitizer} from '../../../../scripts/load-prototype-runtime-content-sanitizer.mjs';

const meaningContract = {
  communicationGoal: 'show-limitation',
  startState: 'Der serielle Pfad ist langsam.',
  visibleChange: 'Die Verarbeitung wird parallelisiert und die Latenz sinkt.',
  endState: 'Der parallele Pfad bleibt sichtbar schneller.',
  subjectTerms: ['Latenz', 'serieller Pfad', 'paralleler Pfad'],
  actionTerms: ['sinkt', 'parallelisiert'],
  resultTerms: ['schneller', '340 Millisekunden'],
  preferredVisualFamilies: ['scale-performance'],
  preferredExplanationPatterns: ['performance', 'comparison'],
  requiredVisualCues: ['two-paths', 'measured-latency', 'visible-speed-difference'],
  forbiddenVisualCues: ['unrelated-ranking'],
};

describe('masterplan runtime payload loaders', () => {
  it('loads derive -> sanitize -> associate -> payload as the exact executable chain', async () => {
    const derivePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentDeriver();
    const sanitizePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentSanitizer();
    const associatePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentAssociation();
    const createPrototypeRenderProps = await loadCreatePrototypeRenderProps();
    const animationId = 'scale-performance-latency-tunnel-race-v1';
    const spokenText =
      'Der serielle Pfad braucht 780 Millisekunden, der parallele Pfad nur 340 Millisekunden.';

    const derived = derivePrototypeRuntimeContent({
      animationId,
      spokenText,
      meaningContract,
    });
    const sanitized = sanitizePrototypeRuntimeContent({
      animationId,
      spokenText,
      derived,
    });
    const associated = associatePrototypeRuntimeContent({
      animationId,
      spokenText,
      content: sanitized,
    });
    const props = createPrototypeRenderProps({
      spokenText,
      meaningContract,
      labels: associated.labels,
      values: associated.values,
    });

    expect(associated.values.slowLatency).toBe(780);
    expect(associated.values.fastLatency).toBe(340);
    expect(associated.values.measurementExact).toBe(1);
    expect(associated.labels.latencyUnit).toBe('ms');
    expect(props.content?.spokenText).toBe(spokenText);
    expect(props.content?.values?.slowLatency).toBe(780);
    expect(props.content?.values?.fastLatency).toBe(340);
    expect(props.content?.values?.measurementExact).toBe(1);
    expect(props.content?.labels?.latencyUnit).toBe('ms');
    expect(props.content?.labels?.subject).toBeTruthy();
    expect(props.content?.labels?.communicationGoal).toBe('show-limitation');
  });

  it('executes the association loader instead of leaking a reversed cost increase into savings props', async () => {
    const associatePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentAssociation();
    const animationId = 'cost-efficiency-budget-leak-meter-v1';
    const spokenText = 'Die Kosten steigen von 28 Cent auf 94 Cent.';
    const associated = associatePrototypeRuntimeContent({
      animationId,
      spokenText,
      content: {
        labels: {currency: 'ct'},
        values: {
          measurementExact: 1,
          initialCost: 94,
          optimizedCost: 28,
          leak1Amount: 22,
          leak2Amount: 22,
          leak3Amount: 22,
        },
      },
    });

    expect(associated.values.measurementExact).toBe(0);
    expect(associated.values.initialCost).toBeUndefined();
    expect(associated.values.optimizedCost).toBeUndefined();
    expect(associated.values.leak1Amount).toBeUndefined();
  });
});
