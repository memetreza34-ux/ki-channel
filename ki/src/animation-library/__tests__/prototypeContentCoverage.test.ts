import {describe, expect, it} from 'vitest';
import {
  getPrototypeContentBindingLevel,
  isPrototypeContentBindingReady,
  NATIVE_CONTENT_BOUND_PROTOTYPE_IDS,
} from '../prototypeContentCoverage';
import {ANIMATION_PROTOTYPE_REGISTRY} from '../prototypes/registry';

describe('prototype content binding coverage', () => {
  it('covers every registered core prototype with native object binding', () => {
    const registeredIds = ANIMATION_PROTOTYPE_REGISTRY.map(
      (registration) => registration.animationId,
    ).sort();
    const nativeIds = [...NATIVE_CONTENT_BOUND_PROTOTYPE_IDS].sort();

    expect(nativeIds).toEqual(registeredIds);
    expect(NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.size).toBe(22);
  });

  it('does not mark an unadapted library prototype as production-ready', () => {
    const animationId = 'future-unadapted-library-prototype-v1';
    expect(
      getPrototypeContentBindingLevel({animationId, source: 'library'}),
    ).toBe('semantic-shell-only');
    expect(
      isPrototypeContentBindingReady({animationId, source: 'library'}),
    ).toBe(false);
  });

  it('keeps a proposed new animation blocked until implementation', () => {
    const animationId = 'custom-scene-animation-v1';
    expect(
      getPrototypeContentBindingLevel({animationId, source: 'new-build'}),
    ).toBe('purpose-built-new-animation');
    expect(
      isPrototypeContentBindingReady({animationId, source: 'new-build'}),
    ).toBe(false);
  });

  it('promotes a historical new-build source once that exact id has native runtime binding', () => {
    const animationId = 'tokenization-magnetic-phrase-slicer-v1';
    expect(NATIVE_CONTENT_BOUND_PROTOTYPE_IDS.has(animationId)).toBe(true);
    expect(
      getPrototypeContentBindingLevel({animationId, source: 'new-build'}),
    ).toBe('native-object-binding');
    expect(
      isPrototypeContentBindingReady({animationId, source: 'new-build'}),
    ).toBe(true);
  });
});
