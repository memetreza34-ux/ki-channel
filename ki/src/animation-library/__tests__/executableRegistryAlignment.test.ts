import {describe, expect, it} from 'vitest';
import {ADVANCED_PROTOTYPE_REGISTRY} from '../advancedPrototypeRegistry';
import {COMPLETE_PROTOTYPE_REGISTRY} from '../completePrototypeRegistry';
import {EXECUTABLE_ANIMATION_MANIFEST_IDS} from '../executableAnimationManifest';
import {EXPERIMENTAL_PROTOTYPE_REGISTRY} from '../experimentalPrototypeRegistry';
import {FINAL_PROTOTYPE_REGISTRY} from '../finalPrototypeRegistry';

describe('executable animation manifest alignment', () => {
  it('matches the actual React/Remotion component registries exactly', () => {
    const registeredIds = [
      ...COMPLETE_PROTOTYPE_REGISTRY.map((item) => item.animationId),
      ...EXPERIMENTAL_PROTOTYPE_REGISTRY.map((item) => item.animationId),
      ...ADVANCED_PROTOTYPE_REGISTRY.map((item) => item.animationId),
      ...FINAL_PROTOTYPE_REGISTRY.map((item) => item.animationId),
    ].sort();

    expect(registeredIds).toHaveLength(88);
    expect(new Set(registeredIds).size).toBe(88);
    expect(registeredIds).toEqual([...EXECUTABLE_ANIMATION_MANIFEST_IDS].sort());
  });
});
