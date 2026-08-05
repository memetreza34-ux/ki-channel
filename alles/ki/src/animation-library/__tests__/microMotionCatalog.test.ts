import {describe, expect, it} from 'vitest';
import {
  MICRO_MOTION_CATALOG,
  getMicroMotionMechanismsForRole,
} from '../microMotionCatalog';

const REQUIRED_ROLES = [
  'subject','action','transformation','quantity','comparison','negation',
  'cause','effect','risk','source','time','sequence','tool','result',
  'definition','emphasis',
] as const;

describe('semantic micro-motion catalog', () => {
  it('contains a broad unique motion vocabulary', () => {
    expect(MICRO_MOTION_CATALOG.length).toBeGreaterThanOrEqual(36);
    expect(new Set(MICRO_MOTION_CATALOG.map((item) => item.mechanismId)).size)
      .toBe(MICRO_MOTION_CATALOG.length);
    expect(new Set(MICRO_MOTION_CATALOG.map((item) => item.motionSignature)).size)
      .toBe(MICRO_MOTION_CATALOG.length);
  });

  it('covers every semantic beat role', () => {
    for (const role of REQUIRED_ROLES) {
      expect(getMicroMotionMechanismsForRole(role).length).toBeGreaterThan(0);
    }
  });

  it('keeps every mechanism short enough for synchronized word animation', () => {
    expect(MICRO_MOTION_CATALOG.every((item) => item.maximumDurationFrames <= 38)).toBe(true);
  });
});
