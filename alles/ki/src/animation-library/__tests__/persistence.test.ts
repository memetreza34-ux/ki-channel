import {describe, expect, it} from 'vitest';
import {INITIAL_CREATIVE_BRAIN_STATE} from '../initialBrain';
import {
  createCreativeBrainSnapshot,
  parseCreativeBrainSnapshot,
  serializeCreativeBrainSnapshot,
} from '../persistence';

describe('creative brain persistence', () => {
  it('roundtrips a versioned state with a portable fingerprint', () => {
    const snapshot = createCreativeBrainSnapshot({
      state: INITIAL_CREATIVE_BRAIN_STATE,
      createdAt: '2026-08-04T10:45:00.000Z',
    });
    const serialized = serializeCreativeBrainSnapshot(snapshot);
    const restored = parseCreativeBrainSnapshot(serialized);

    expect(restored).toEqual(snapshot);
    expect(restored.fingerprint).toMatch(/^[a-f0-9]{8}$/);
  });

  it('rejects a modified snapshot whose fingerprint is stale', () => {
    const snapshot = createCreativeBrainSnapshot({
      state: INITIAL_CREATIVE_BRAIN_STATE,
      createdAt: '2026-08-04T10:45:00.000Z',
    });
    const modified = JSON.stringify({
      ...snapshot,
      state: {
        ...snapshot.state,
        revision: snapshot.state.revision + 1,
      },
    });

    expect(() => parseCreativeBrainSnapshot(modified)).toThrow(
      /fingerprint mismatch/,
    );
  });
});
