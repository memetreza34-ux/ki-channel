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

  it('preserves German states that contain the standalone word an', () => {
    const spokenText =
      'An der Kapazitätsgrenze steigt die Last, während der Dienst noch stabil bleibt.';
    const base = enhanceSceneMeaning(spokenText);
    const sourceMeaningContract = {
      ...base,
      startState: 'An der Kapazitätsgrenze bleiben die Anfragen zunächst stabil.',
      visibleChange: 'An der Grenze steigt die Last sichtbar an.',
      endState: 'Am Engpass bleibt die Latenz als Ergebnis sichtbar.',
    };
    const resolved = resolvePrototypeContent({
      spokenText,
      meaningContract: sourceMeaningContract,
    });

    expect(resolved?.meaningContract.startState).toBe(
      sourceMeaningContract.startState,
    );
    expect(resolved?.meaningContract.visibleChange).toBe(
      sourceMeaningContract.visibleChange,
    );
    expect(resolved?.meaningContract.endState).toBe(
      sourceMeaningContract.endState,
    );
  });

  it('does not treat a single German technical noun such as Input as English', () => {
    const spokenText = 'Der Input bleibt sichtbar, bis die Prüfung startet.';
    const base = enhanceSceneMeaning(spokenText);
    const sourceMeaningContract = {
      ...base,
      startState: 'Input bleibt vor der Prüfung sichtbar.',
      visibleChange: 'Die Prüfung markiert den Input Schritt für Schritt.',
      endState: 'Der geprüfte Input bleibt als Ergebnis sichtbar.',
    };
    const resolved = resolvePrototypeContent({
      spokenText,
      meaningContract: sourceMeaningContract,
    });

    expect(resolved?.meaningContract.startState).toBe(
      sourceMeaningContract.startState,
    );
    expect(resolved?.meaningContract.visibleChange).toBe(
      sourceMeaningContract.visibleChange,
    );
    expect(resolved?.meaningContract.endState).toBe(
      sourceMeaningContract.endState,
    );
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