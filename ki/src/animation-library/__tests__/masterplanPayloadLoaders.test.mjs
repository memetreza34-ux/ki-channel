import {describe, expect, it} from 'vitest';
import {loadSceneMeaningEnhancer} from '../../../../scripts/load-scene-meaning-enhancer.mjs';
import {loadCreatePrototypeRenderProps} from '../../../../scripts/load-prototype-render-payload.mjs';
import {loadPrototypeRuntimeContentAssociation} from '../../../../scripts/load-prototype-runtime-content-association.mjs';
import {loadPrototypeRuntimeContentDeriver} from '../../../../scripts/load-prototype-runtime-content-deriver.mjs';
import {loadPrototypeRuntimeContentSanitizer} from '../../../../scripts/load-prototype-runtime-content-sanitizer.mjs';

describe('masterplan runtime payload loaders', () => {
  it('loads meaning -> derive -> sanitize -> associate -> payload as the exact executable chain', async () => {
    const enhanceSceneMeaning = await loadSceneMeaningEnhancer();
    const derivePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentDeriver();
    const sanitizePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentSanitizer();
    const associatePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentAssociation();
    const createPrototypeRenderProps = await loadCreatePrototypeRenderProps();
    const animationId = 'scale-performance-latency-tunnel-race-v1';
    const spokenText =
      'Durch Parallelisierung sinkt die Latenz des gleichen Dienstes von 780 Millisekunden auf 340 Millisekunden.';
    const meaningContract = enhanceSceneMeaning(spokenText);

    expect(meaningContract.startState).toBeTruthy();
    expect(meaningContract.visibleChange).toBeTruthy();
    expect(meaningContract.endState).toBeTruthy();
    expect(meaningContract.preferredVisualFamilies).toContain('scale-performance');

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
    expect(props.content?.meaningContract?.startState).toBe(
      meaningContract.startState,
    );
    expect(props.content?.values?.slowLatency).toBe(780);
    expect(props.content?.values?.fastLatency).toBe(340);
    expect(props.content?.values?.measurementExact).toBe(1);
    expect(props.content?.labels?.latencyUnit).toBe('ms');
    expect(props.content?.labels?.subject).toBeTruthy();
    expect(props.content?.labels?.communicationGoal).toBe(
      meaningContract.communicationGoal,
    );
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
