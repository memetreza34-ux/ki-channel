import {describe, expect, it} from 'vitest';
import {
  getPrototypeContentBindingLevel,
  isPrototypeContentBindingReady,
  NATIVE_CONTENT_BOUND_PROTOTYPE_IDS,
} from '../prototypeContentCoverage';

describe('prototype content binding coverage', () => {
  it('tracks the prototypes whose dominant objects consume scene content', () => {
    expect([...NATIVE_CONTENT_BOUND_PROTOTYPE_IDS]).toEqual(
      expect.arrayContaining([
        'tokenization-magnetic-phrase-slicer-v1',
        'retrieval-search-knowledge-magnet-v1',
        'risk-contrast-confidence-glass-crack-v1',
        'scale-performance-latency-tunnel-race-v1',
      ]),
    );
    expect(NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.size).toBe(4);
  });

  it('does not mark shell-only library prototypes as production-ready', () => {
    const animationId = 'comparison-benchmark-racetrack-v1';
    expect(
      getPrototypeContentBindingLevel({animationId, source: 'library'}),
    ).toBe('semantic-shell-only');
    expect(
      isPrototypeContentBindingReady({animationId, source: 'library'}),
    ).toBe(false);
  });

  it('keeps purpose-built new animations separate from generic reuse', () => {
    const animationId = 'custom-scene-animation-v1';
    expect(
      getPrototypeContentBindingLevel({animationId, source: 'new-build'}),
    ).toBe('purpose-built-new-animation');
    expect(
      isPrototypeContentBindingReady({animationId, source: 'new-build'}),
    ).toBe(true);
  });
});
