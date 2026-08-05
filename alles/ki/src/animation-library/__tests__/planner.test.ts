import {describe, expect, it} from 'vitest';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {INITIAL_CREATIVE_BRAIN_STATE} from '../initialBrain';
import {planReelChoreography} from '../planner';

const plan = (scenes: Parameters<typeof planReelChoreography>[0]['scenes']) =>
  planReelChoreography({
    reelId: 'planner-test-reel',
    reelIndex: 1,
    scenes,
    entries: ANIMATION_LIBRARY_ENTRIES,
    brain: INITIAL_CREATIVE_BRAIN_STATE,
  });

describe('reel choreography planner', () => {
  it('selects a semantically relevant retrieval animation', () => {
    const result = plan([
      {
        sceneId: 'scene-1',
        spokenText: 'Das System sucht passende Belege in vielen Dokumenten.',
        semanticTags: ['search', 'retrieval', 'evidence', 'document'],
        explanationPatterns: ['retrieval', 'relevance-filtering'],
        preferredVisualFamilies: ['retrieval-search'],
      },
    ]);

    const selection = result.selections[0];
    expect(selection.animationId).not.toBeNull();
    const entry = ANIMATION_LIBRARY_ENTRIES.find(
      (candidate) => candidate.animationId === selection.animationId,
    );
    expect(entry?.visualFamily).toBe('retrieval-search');
    expect(selection.score?.semanticFit).toBeGreaterThan(60);
  });

  it('does not reuse the same complete animation for repeated semantics', () => {
    const result = plan([
      {
        sceneId: 'scene-1',
        spokenText: 'Die KI sucht Belege.',
        semanticTags: ['search', 'retrieval', 'evidence'],
        preferredVisualFamilies: ['retrieval-search'],
      },
      {
        sceneId: 'scene-2',
        spokenText: 'Danach prüft sie weitere Quellen.',
        semanticTags: ['search', 'retrieval', 'document'],
        preferredVisualFamilies: ['retrieval-search'],
      },
    ]);

    const ids = result.selections
      .map((selection) => selection.animationId)
      .filter((animationId): animationId is string => animationId !== null);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('creates a new-animation proposal when a scene explicitly requires novelty', () => {
    const result = plan([
      {
        sceneId: 'scene-new',
        spokenText: 'Diese Aussage braucht eine komplett neue visuelle Metapher.',
        semanticTags: ['learning', 'update', 'new-information'],
        preferredVisualFamilies: ['learning-update'],
        mustBeNew: true,
      },
    ]);

    expect(result.selections[0].animationId).toBeNull();
    expect(result.selections[0].newAnimationProposal).not.toBeNull();
    expect(result.newAnimationCount).toBe(1);
  });

  it('plans diverse families across a multi-topic reel', () => {
    const result = plan([
      {
        sceneId: 'scene-1',
        spokenText: 'Text wird in kleine Teile zerlegt.',
        semanticTags: ['token', 'text', 'segment'],
        preferredVisualFamilies: ['tokenization'],
      },
      {
        sceneId: 'scene-2',
        spokenText: 'Ähnliche Begriffe liegen näher zusammen.',
        semanticTags: ['meaning', 'similarity', 'cluster'],
        preferredVisualFamilies: ['semantic-space'],
      },
      {
        sceneId: 'scene-3',
        spokenText: 'Das Modell wählt das wahrscheinlichste Wort.',
        semanticTags: ['probability', 'candidate', 'prediction'],
        preferredVisualFamilies: ['probability'],
      },
      {
        sceneId: 'scene-4',
        spokenText: 'Trotzdem muss die Antwort geprüft werden.',
        semanticTags: ['risk', 'verify', 'truth'],
        preferredVisualFamilies: ['risk-contrast'],
      },
      {
        sceneId: 'scene-5',
        spokenText: 'Neue Informationen aktualisieren das Wissen.',
        semanticTags: ['learning', 'update', 'new-information'],
        preferredVisualFamilies: ['learning-update'],
      },
    ]);

    expect(new Set(result.visualFamilies).size).toBeGreaterThanOrEqual(4);
    expect(new Set(result.layoutFamilies).size).toBe(
      result.layoutFamilies.length,
    );
    expect(new Set(result.motionSignatures).size).toBe(
      result.motionSignatures.length,
    );
  });
});
