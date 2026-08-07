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
});
