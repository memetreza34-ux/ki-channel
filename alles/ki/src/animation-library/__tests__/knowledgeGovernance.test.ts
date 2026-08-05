import {describe, expect, it} from 'vitest';
import {createInitialCreativeBrainState, findCurrentBrainFact} from '../brain';
import {ANIMATION_LIBRARY_ENTRIES} from '../catalog';
import {applyKnowledgeCandidates} from '../knowledgeGovernance';

const initialState = () =>
  createInitialCreativeBrainState({
    entries: ANIMATION_LIBRARY_ENTRIES,
    now: '2026-08-04T10:00:00.000Z',
  });

describe('creative brain knowledge governance', () => {
  it('adopts new facts and stronger newer revisions', () => {
    const first = applyKnowledgeCandidates({
      state: initialState(),
      candidates: [
        {
          observationId: 'knowledge-1',
          factKey: 'subtitle.max-lines',
          value: 2,
          confidence: 0.9,
          source: 'manual-quality-rule',
          observedAt: '2026-08-04T11:00:00.000Z',
          notes: 'Keep mobile subtitles compact.',
        },
      ],
    });
    const second = applyKnowledgeCandidates({
      state: first.state,
      candidates: [
        {
          observationId: 'knowledge-2',
          factKey: 'subtitle.max-lines',
          value: 3,
          confidence: 0.82,
          source: 'verified-mobile-test',
          observedAt: '2026-08-04T12:00:00.000Z',
          notes: 'Three short lines remained readable in verified renders.',
        },
      ],
    });

    expect(first.adoptedCount).toBe(1);
    expect(second.adoptedCount).toBe(1);
    expect(findCurrentBrainFact(second.state, 'subtitle.max-lines')?.value).toBe(3);
    expect(second.decisions[0].reason).toBe('newer-and-trusted');
  });

  it('records weak or old evidence without replacing trusted current knowledge', () => {
    const seeded = applyKnowledgeCandidates({
      state: initialState(),
      candidates: [
        {
          observationId: 'trusted-fact',
          factKey: 'animation.minimum-final-hold-frames',
          value: 24,
          confidence: 0.95,
          source: 'verified-render-review',
          observedAt: '2026-08-04T12:00:00.000Z',
          notes: 'Final hold was verified across mobile renders.',
        },
      ],
    });
    const result = applyKnowledgeCandidates({
      state: seeded.state,
      candidates: [
        {
          observationId: 'older-fact',
          factKey: 'animation.minimum-final-hold-frames',
          value: 12,
          confidence: 0.99,
          source: 'old-note',
          observedAt: '2026-08-03T12:00:00.000Z',
          notes: 'Older note should not replace newer evidence.',
        },
        {
          observationId: 'weak-fact',
          factKey: 'animation.minimum-final-hold-frames',
          value: 8,
          confidence: 0.4,
          source: 'single-unverified-opinion',
          observedAt: '2026-08-04T13:00:00.000Z',
          notes: 'Weak new claim should remain only in observation history.',
        },
      ],
    });

    expect(result.adoptedCount).toBe(0);
    expect(result.recordedNotAdoptedCount).toBe(2);
    expect(result.decisions.map((decision) => decision.reason)).toEqual([
      'older-than-current',
      'confidence-too-low',
    ]);
    expect(
      findCurrentBrainFact(result.state, 'animation.minimum-final-hold-frames')?.value,
    ).toBe(24);
    expect(result.state.observations).toHaveLength(3);
  });

  it('is idempotent for duplicate observation identifiers', () => {
    const candidate = {
      observationId: 'same-observation',
      factKey: 'transition.default-style',
      value: 'hard-cut',
      confidence: 0.9,
      source: 'editorial-rule',
      observedAt: '2026-08-04T11:00:00.000Z',
      notes: 'Hard cuts remain the default.',
    } as const;
    const first = applyKnowledgeCandidates({
      state: initialState(),
      candidates: [candidate],
    });
    const second = applyKnowledgeCandidates({
      state: first.state,
      candidates: [candidate],
    });

    expect(second.duplicateCount).toBe(1);
    expect(second.nextRevision).toBe(first.nextRevision);
    expect(second.state.observations).toHaveLength(1);
  });

  it('rejects invalid confidence and timestamps', () => {
    expect(() =>
      applyKnowledgeCandidates({
        state: initialState(),
        candidates: [
          {
            observationId: 'invalid-confidence',
            factKey: 'fact.invalid',
            value: true,
            confidence: 1.4,
            source: 'test',
            observedAt: '2026-08-04T11:00:00.000Z',
            notes: 'Invalid confidence.',
          },
        ],
      }),
    ).toThrow(/confidence/);

    expect(() =>
      applyKnowledgeCandidates({
        state: initialState(),
        candidates: [
          {
            observationId: 'invalid-time',
            factKey: 'fact.invalid-time',
            value: true,
            confidence: 0.8,
            source: 'test',
            observedAt: 'not-a-date',
            notes: 'Invalid time.',
          },
        ],
      }),
    ).toThrow(/observedAt/);
  });
});
