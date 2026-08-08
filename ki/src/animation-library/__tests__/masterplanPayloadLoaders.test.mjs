import {describe, expect, it} from 'vitest';
import {loadCreatePrototypeRenderProps} from '../../../../scripts/load-prototype-render-payload.mjs';
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
  it('loads deriver, sanitizer and payload builder as the exact executable chain', async () => {
    const derivePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentDeriver();
    const sanitizePrototypeRuntimeContent =
      await loadPrototypeRuntimeContentSanitizer();
    const createPrototypeRenderProps = await loadCreatePrototypeRenderProps();
    const spokenText =
      'Der serielle Pfad braucht 780 Millisekunden, der parallele Pfad nur 340 Millisekunden.';

    const derived = derivePrototypeRuntimeContent({
      animationId: 'scale-performance-latency-tunnel-race-v1',
      spokenText,
      meaningContract,
    });
    const sanitized = sanitizePrototypeRuntimeContent({
      animationId: 'scale-performance-latency-tunnel-race-v1',
      spokenText,
      derived,
    });
    const props = createPrototypeRenderProps({
      spokenText,
      meaningContract,
      labels: sanitized.labels,
      values: sanitized.values,
    });

    expect(sanitized.values.slowLatency).toBe(780);
    expect(sanitized.values.fastLatency).toBe(340);
    expect(sanitized.values.measurementExact).toBe(1);
    expect(sanitized.labels.latencyUnit).toBe('ms');
    expect(props.content?.spokenText).toBe(spokenText);
    expect(props.content?.values?.slowLatency).toBe(780);
    expect(props.content?.values?.fastLatency).toBe(340);
    expect(props.content?.values?.measurementExact).toBe(1);
    expect(props.content?.labels?.latencyUnit).toBe('ms');
    expect(props.content?.labels?.subject).toBeTruthy();
    expect(props.content?.labels?.communicationGoal).toBe('show-limitation');
  });
});
