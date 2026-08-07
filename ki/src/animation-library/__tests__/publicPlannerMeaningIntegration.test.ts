import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {analyzeSceneMeaning} from '../meaningContract';
import {planReelChoreography} from '../planner';

describe('public planner meaning integration', () => {
  it('applies the extended meaning contract before production planning', () => {
    const brain = createInitialCreativeBrainState({
      entries: [],
      now: '2026-08-07T04:15:00.000Z',
    });
    const spokenText =
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.';

    const result = planReelChoreography({
      reelId: 'extended-meaning-through-public-planner',
      reelIndex: 1,
      entries: [],
      brain,
      scenes: [
        {
          sceneId: 'performance-limit',
          spokenText,
          semanticTags: ['latency', 'capacity', 'bottleneck'],
          meaningContract: analyzeSceneMeaning(spokenText),
        },
      ],
    });

    const proposal = result.selections[0].newAnimationProposal;
    expect(proposal).not.toBeNull();
    expect(proposal?.suggestedVisualFamily).toBe('scale-performance');
    expect(proposal?.meaningContract.communicationGoal).toBe('show-limitation');
    expect(proposal?.meaningContract.requiredVisualCues).toContain(
      'visible-bottleneck',
    );
    expect(proposal?.meaningContract.visibleChange).toContain('bottleneck');
  });

  it('preserves a manually authored meaning contract', () => {
    const brain = createInitialCreativeBrainState({
      entries: [],
      now: '2026-08-07T04:16:00.000Z',
    });
    const spokenText =
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.';
    const explicitContract = {
      ...analyzeSceneMeaning(spokenText),
      communicationGoal: 'compare' as const,
      startState:
        'two editorially selected systems begin on one custom shared baseline',
      visibleChange:
        'the custom comparison reveals the requested difference without changing the editorial metaphor',
      endState:
        'both systems and the editorial conclusion remain visible together',
      preferredVisualFamilies: ['comparison'],
      preferredExplanationPatterns: ['comparison', 'tradeoff'],
      requiredVisualCues: ['shared-baseline', 'two-options'],
    };

    const result = planReelChoreography({
      reelId: 'manual-contract-remains-authoritative',
      reelIndex: 2,
      entries: [],
      brain,
      scenes: [
        {
          sceneId: 'editorial-comparison',
          spokenText,
          semanticTags: ['comparison', 'latency'],
          meaningContract: explicitContract,
        },
      ],
    });

    const proposal = result.selections[0].newAnimationProposal;
    expect(proposal).not.toBeNull();
    expect(proposal?.suggestedVisualFamily).toBe('comparison');
    expect(proposal?.meaningContract.communicationGoal).toBe('compare');
    expect(proposal?.meaningContract.startState).toBe(
      explicitContract.startState,
    );
    expect(proposal?.meaningContract.visibleChange).toBe(
      explicitContract.visibleChange,
    );
  });
});
