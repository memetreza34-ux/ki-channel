import {ANIMATION_LIBRARY_ENTRIES} from './catalog';
import {
  applyCreativeBrainObservation,
  createInitialCreativeBrainState,
} from './brain';
import type {CreativeBrainObservation, CreativeBrainState} from './schema';

const INITIAL_TIME = '2026-08-04T10:24:00.000Z';

const INITIAL_OBSERVATIONS: CreativeBrainObservation[] = [
  {
    observationId: 'user-feedback-no-repeated-full-scenes-2026-08-04',
    type: 'user-feedback',
    animationId: null,
    reelId: null,
    sceneId: null,
    semanticClarity: null,
    novelty: null,
    productionConfidence: null,
    outcome: 'informational',
    notes:
      'The user explicitly rejects reels that repeatedly reuse the same complete animation, even when the animation is technically good.',
    createdAt: INITIAL_TIME,
    fact: {
      factKey: 'creative-policy.full-scene-repetition',
      value: 'forbidden-within-reel-and-strongly-discouraged-across-recent-reels',
      confidence: 1,
      source: 'direct-user-feedback',
      observedAt: INITIAL_TIME,
      supersedesObservationId: null,
    },
  },
  {
    observationId: 'user-feedback-semantic-animation-fit-2026-08-04',
    type: 'user-feedback',
    animationId: null,
    reelId: null,
    sceneId: null,
    semanticClarity: null,
    novelty: null,
    productionConfidence: null,
    outcome: 'informational',
    notes:
      'New animation ideas are welcome, but every animation must explain the spoken content rather than exist only as decoration.',
    createdAt: INITIAL_TIME,
    fact: {
      factKey: 'creative-policy.semantic-fit-before-novelty',
      value: true,
      confidence: 1,
      source: 'direct-user-feedback',
      observedAt: INITIAL_TIME,
      supersedesObservationId: null,
    },
  },
  {
    observationId: 'user-feedback-update-brain-with-new-information-2026-08-04',
    type: 'new-knowledge',
    animationId: null,
    reelId: null,
    sceneId: null,
    semanticClarity: null,
    novelty: null,
    productionConfidence: null,
    outcome: 'informational',
    notes:
      'The creative brain must update versioned facts when newer and sufficiently reliable information arrives; it must not silently overwrite stronger facts with weaker ones.',
    createdAt: INITIAL_TIME,
    fact: {
      factKey: 'brain-policy.versioned-knowledge-updates',
      value: {
        enabled: true,
        requireRecency: true,
        protectHigherConfidenceFacts: true,
      },
      confidence: 1,
      source: 'direct-user-feedback',
      observedAt: INITIAL_TIME,
      supersedesObservationId: null,
    },
  },
];

const baseState = createInitialCreativeBrainState({
  entries: ANIMATION_LIBRARY_ENTRIES,
  now: INITIAL_TIME,
});

export const INITIAL_CREATIVE_BRAIN_STATE: CreativeBrainState =
  INITIAL_OBSERVATIONS.reduce(
    (state, observation) =>
      applyCreativeBrainObservation({state, observation}),
    baseState,
  );
