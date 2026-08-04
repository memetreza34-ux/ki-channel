import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState} from '../brain';
import {tuneCreativeBrainFromEvidence} from '../brainTuning';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {createUserFeedbackObservation} from '../learningPipeline';

const createState = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-04T12:00:00.000Z',
  });

const feedback = (
  observationId: string,
  notes: string,
  outcome: 'accepted' | 'reworked' | 'rejected',
  semanticClarity: number,
  novelty: number,
  productionConfidence: number,
) =>
  createUserFeedbackObservation({
    observationId,
    animationId: 'retrieval-search-knowledge-magnet-v1',
    reelId: 'reel-feedback',
    sceneId: observationId,
    semanticClarity,
    novelty,
    productionConfidence,
    outcome,
    notes,
    createdAt: `2026-08-04T12:${observationId.slice(-2).padStart(2, '0')}:00.000Z`,
  });

describe('creative brain evidence tuning', () => {
  it('increases novelty and diversity pressure after repeated repetition complaints', () => {
    const state = createState();
    const result = tuneCreativeBrainFromEvidence({
      state,
      now: '2026-08-04T13:00:00.000Z',
      observations: [
        feedback('feedback-01', 'Schon wieder dieselbe Animation und zu ähnlich.', 'reworked', 72, 35, 80),
        feedback('feedback-02', 'Das Layout wiederholt sich und wird langweilig.', 'rejected', 66, 30, 78),
        feedback('feedback-03', 'Same animation again.', 'reworked', 74, 32, 82),
      ],
    });

    expect(result.report.repetitionComplaints).toBe(3);
    expect(result.report.changed).toBe(true);
    expect(result.state.weights.novelty).toBeGreaterThan(state.weights.novelty);
    expect(result.state.weights.reelDiversity).toBeGreaterThan(
      state.weights.reelDiversity,
    );
    expect(
      result.state.globalRules.preferNewAnimationBelowScore,
    ).toBeGreaterThan(state.globalRules.preferNewAnimationBelowScore);
  });

  it('raises production confidence weight after repeated render failures', () => {
    const state = createState();
    const result = tuneCreativeBrainFromEvidence({
      state,
      now: '2026-08-04T13:10:00.000Z',
      observations: [
        feedback('feedback-11', 'Render fail wegen Overflow.', 'reworked', 80, 90, 35),
        feedback('feedback-12', 'Text abgeschnitten und Typecheck fehlgeschlagen.', 'rejected', 76, 88, 30),
      ],
    });

    expect(result.report.productionFailures).toBe(2);
    expect(result.state.weights.productionConfidence).toBeGreaterThan(
      state.weights.productionConfidence,
    );
  });

  it('keeps the state unchanged without enough evidence', () => {
    const state = createState();
    const result = tuneCreativeBrainFromEvidence({
      state,
      now: '2026-08-04T13:20:00.000Z',
      observations: [
        feedback('feedback-21', 'Gute Animation.', 'accepted', 92, 88, 86),
      ],
    });

    expect(result.report.changed).toBe(false);
    expect(result.state).toBe(state);
  });
});
