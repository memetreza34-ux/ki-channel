import {describe, expect, it} from 'vitest';
import {
  parseExplicitCountNear,
  parseExplicitPercentageNear,
  parseExplicitPercentages,
  parseExplicitVectorTriplet,
} from '../prototypes/PrototypeMeasurementGrounding';

describe('prototype measurement grounding', () => {
  it('extracts only explicit percentages', () => {
    expect(
      parseExplicitPercentages(
        'Die Beziehungen liegen bei 86 Prozent, 72 % und 18 Prozent.',
      ),
    ).toEqual([86, 72, 18]);
    expect(parseExplicitPercentages('Die Verbindung ist nur relativ stark.')).toEqual([]);
  });

  it('binds a percentage to nearby confidence language', () => {
    expect(
      parseExplicitPercentageNear({
        spokenText: 'Das Vertrauen liegt bei 82 Prozent.',
        terms: ['Vertrauen', 'Confidence'],
      }),
    ).toBe(82);
    expect(
      parseExplicitPercentageNear({
        spokenText: '90 Prozent der Nutzer stimmen zu, die Aussage klingt sicher.',
        terms: ['Vertrauen', 'Confidence'],
      }),
    ).toBeNull();
  });

  it('binds an explicit verification threshold separately', () => {
    expect(
      parseExplicitPercentageNear({
        spokenText:
          'Das Vertrauen liegt bei 82 Prozent, die Schwelle bei 75 Prozent.',
        terms: ['Schwelle', 'Grenze', 'Threshold'],
      }),
    ).toBe(75);
  });

  it('detects an explicitly stated context capacity but not a heuristic one', () => {
    expect(
      parseExplicitCountNear({
        spokenText: 'Das Kontextfenster fasst vier Nachrichten.',
        terms: ['Plätze', 'Slots', 'Nachrichten', 'Kapazität', 'Kontextfenster'],
        minimum: 2,
        maximum: 6,
      }),
    ).toBeNull();
    expect(
      parseExplicitCountNear({
        spokenText: 'Das Kontextfenster fasst 4 Nachrichten.',
        terms: ['Plätze', 'Slots', 'Nachrichten', 'Kapazität', 'Kontextfenster'],
        minimum: 2,
        maximum: 6,
      }),
    ).toBe(4);
  });

  it('accepts only an explicitly bracketed vector triplet as exact vector data', () => {
    expect(
      parseExplicitVectorTriplet('Der Vektor ist [0.82, -0.31, 0.47].'),
    ).toEqual([0.82, -0.31, 0.47]);
    expect(
      parseExplicitVectorTriplet(
        'Das Wort wird in numerische Dimensionen für Bedeutung, Kontext und Ton umgewandelt.',
      ),
    ).toBeNull();
  });
});
