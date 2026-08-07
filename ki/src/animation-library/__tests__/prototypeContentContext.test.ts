import {describe, expect, it} from 'vitest';
import {enhanceSceneMeaning} from '../extendedMeaningContract';
import {resolvePrototypeContent} from '../prototypes/PrototypeContentContext';

describe('prototype content resolution', () => {
  it('keeps the source contract but replaces internal English states for rendering', () => {
    const spokenText =
      'Unter hoher Last steigt die Latenz, weil die Kapazität zum Engpass wird.';
    const sourceMeaningContract = enhanceSceneMeaning(spokenText);
    const resolved = resolvePrototypeContent({
      spokenText,
      meaningContract: sourceMeaningContract,
    });

    expect(resolved).not.toBeNull();
    expect(resolved?.sourceMeaningContract).toEqual(sourceMeaningContract);
    expect(resolved?.meaningContract.startState).not.toBe(
      sourceMeaningContract.startState,
    );
    expect(resolved?.meaningContract.visibleChange).not.toBe(
      sourceMeaningContract.visibleChange,
    );
    expect(resolved?.meaningContract.endState).not.toBe(
      sourceMeaningContract.endState,
    );
    expect(resolved?.meaningContract.startState).toMatch(/last|latenz|kapazitat/i);
    expect(resolved?.meaningContract.visibleChange).toContain('→');
  });

  it('preserves explicitly supplied render wording', () => {
    const spokenText = 'Eine Quelle wird geprüft.';
    const sourceMeaningContract = enhanceSceneMeaning(spokenText);
    const resolved = resolvePrototypeContent({
      spokenText,
      meaningContract: sourceMeaningContract,
      labels: {
        startState: 'Ungeprüfte Quelle',
        visibleChange: 'Beleg wird sichtbar kontrolliert',
        endState: 'Quelle ist verifiziert',
      },
    });

    expect(resolved?.meaningContract.startState).toBe('Ungeprüfte Quelle');
    expect(resolved?.meaningContract.visibleChange).toBe(
      'Beleg wird sichtbar kontrolliert',
    );
    expect(resolved?.meaningContract.endState).toBe('Quelle ist verifiziert');
  });
});
