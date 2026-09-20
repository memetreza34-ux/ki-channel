import {describe, expect, it} from 'vitest';
import {
  CREATIVE_RECIPE_DEFINITIONS,
  CREATIVE_RECIPE_IDS,
} from '../creativeRecipeCatalog';
import {isCreativeRecipeRuntimeSupported} from '../creativeRecipeRuntime';
import {compileNewAnimationProposal} from '../proposalCompiler';

describe('creative recipe runtime contract', () => {
  it('has a runtime for every canonical creative recipe', () => {
    expect(CREATIVE_RECIPE_IDS.length).toBe(8);
    for (const recipeId of CREATIVE_RECIPE_IDS) {
      expect(isCreativeRecipeRuntimeSupported(recipeId)).toBe(true);
      expect(CREATIVE_RECIPE_DEFINITIONS[recipeId].runtimeMechanisms.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('compiles new-build plans with an explicit executable recipe contract', () => {
    const spec = compileNewAnimationProposal({
      proposal: {
        proposalId: 'runtime-contract-scene-01',
        sceneId: 'scene-01',
        reason: 'requires a purpose-built explanation',
        requiredSemanticTags: ['workflow', 'process', 'result'],
        suggestedVisualFamily: 'process-flow',
        forbiddenLayoutFamilies: [],
        forbiddenMotionSignatures: [],
        suggestedDirection: 'left-to-right',
        suggestedEnergy: 'dynamic',
      },
    });

    expect(isCreativeRecipeRuntimeSupported(spec.creativeRecipeId)).toBe(true);
    expect(spec.runtimeMechanisms).toEqual(
      CREATIVE_RECIPE_DEFINITIONS[spec.creativeRecipeId].runtimeMechanisms,
    );
    expect(
      spec.implementationRules.some((rule) => rule.includes('Runtime mechanisms:')),
    ).toBe(true);
  });

  it('rotates away from a recipe when its layout and motion roots were already used', () => {
    const baseProposal = {
      proposalId: 'rotation-a',
      sceneId: 'scene-a',
      reason: 'new visual required',
      requiredSemanticTags: ['security', 'risk', 'verify'],
      suggestedVisualFamily: 'security-privacy',
      forbiddenLayoutFamilies: [] as string[],
      forbiddenMotionSignatures: [] as string[],
      suggestedDirection: 'outside-in' as const,
      suggestedEnergy: 'dynamic' as const,
    };
    const first = compileNewAnimationProposal({proposal: baseProposal});
    const firstDefinition = CREATIVE_RECIPE_DEFINITIONS[first.creativeRecipeId];
    const second = compileNewAnimationProposal({
      proposal: {
        ...baseProposal,
        proposalId: 'rotation-b',
        sceneId: 'scene-b',
        forbiddenLayoutFamilies: [
          `previous-${firstDefinition.layoutRoot}-layout`,
        ],
        forbiddenMotionSignatures: [
          `previous-${firstDefinition.motionRoot}-motion`,
        ],
      },
    });

    expect(second.creativeRecipeId).not.toBe(first.creativeRecipeId);
  });
});
