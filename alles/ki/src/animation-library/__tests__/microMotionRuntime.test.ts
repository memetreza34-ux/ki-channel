import {describe, expect, it} from 'vitest';
import {MICRO_MOTION_CATALOG} from '../microMotionCatalog';
import {toMicroMotionCompositionId} from '../MicroMotionGalleryRoot';

describe('semantic micro-motion runtime', () => {
  it('creates one unique Remotion composition id per mechanism', () => {
    const ids = MICRO_MOTION_CATALOG.map((mechanism) =>
      toMicroMotionCompositionId(mechanism.mechanismId),
    );
    expect(ids.length).toBeGreaterThanOrEqual(36);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^Micro-[A-Za-z0-9-]+$/.test(id))).toBe(true);
  });

  it('uses only renderer layers supported by the runtime', () => {
    const supported = new Set([
      'kinetic-type',
      'main-object',
      'connector',
      'measurement',
      'annotation',
      'ui-simulation',
      'transition',
    ]);
    expect(
      MICRO_MOTION_CATALOG.every((mechanism) => supported.has(mechanism.layer)),
    ).toBe(true);
  });
});
