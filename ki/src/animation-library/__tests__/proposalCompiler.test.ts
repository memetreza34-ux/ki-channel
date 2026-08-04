import {describe, expect, it} from 'vitest';
import {
  compileNewAnimationProposal,
  createCatalogEntryFromBuildSpec,
} from '../proposalCompiler';

const proposal = {
  proposalId: 'proposal-scene-04-security',
  sceneId: 'scene-04',
  reason: 'no suitable animation exists',
  requiredSemanticTags: ['security', 'data', 'risk'],
  suggestedVisualFamily: 'security-privacy',
  forbiddenLayoutFamilies: [
    'security-privacy-converging-evidence-field',
  ],
  forbiddenMotionSignatures: [
    'security-privacy-scatter-attract-rank-combine',
  ],
  suggestedDirection: 'outside-in' as const,
  suggestedEnergy: 'dynamic' as const,
};

describe('new animation proposal compiler', () => {
  it('creates a deterministic unique build specification', () => {
    const first = compileNewAnimationProposal({proposal});
    const second = compileNewAnimationProposal({proposal});

    expect(first).toEqual(second);
    expect(first.animationId).toContain('security-privacy');
    expect(first.layoutFamily).not.toBe(
      proposal.forbiddenLayoutFamilies[0],
    );
    expect(first.motionSignature).not.toBe(
      proposal.forbiddenMotionSignatures[0],
    );
    expect(first.primitiveTags).toContain('shield-boundary');
    expect(first.phases.map((phase) => phase.phaseId)).toEqual([
      'establish',
      'explain',
      'contrast',
      'resolve',
    ]);
  });

  it('converts the specification into a catalog-compatible concept', () => {
    const spec = compileNewAnimationProposal({proposal});
    const entry = createCatalogEntryFromBuildSpec({
      spec,
      description:
        'Sensitive data converges on a guarded privacy boundary where allowed and blocked information visibly separate.',
    });

    expect(entry.status).toBe('concept');
    expect(entry.visualFamily).toBe('security-privacy');
    expect(entry.qualityPrior.novelty).toBeGreaterThan(90);
    expect(entry.qualityPrior.productionConfidence).toBeLessThan(50);
  });

  it('rejects invalid versions', () => {
    expect(() =>
      compileNewAnimationProposal({proposal, version: 0}),
    ).toThrow(/positive integer/);
  });
});
