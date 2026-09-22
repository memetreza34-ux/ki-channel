import {REEL_CUES, REEL_LAENGE_IN_FRAMES} from './reelSkript';

/**
 * Szenen werden aus dem Skript abgeleitet, nicht umgekehrt.
 *
 * Jede Szene verweist auf die Cues, die sie traegt. Ihre Dauer ergibt sich aus
 * deren Timing - wer den Sprechertext aendert, aendert automatisch die Szene.
 * Die Mechaniken sind bewusst objekt-/prozessbasiert statt eine Folge von
 * Textkarten zu sein.
 */

export type SzenenMechanik =
  | 'fake-source-hook'
  | 'search-vs-generate'
  | 'token-stream'
  | 'probability-field'
  | 'sampling'
  | 'verification-gate'
  | 'same-fluency'
  | 'grounding-tools'
  | 'tool-limits'
  | 'manual-check'
  | 'draft-vs-proof';

type SzenenEntwurf = {
  id: string;
  /** Index des ersten und letzten Cues, den diese Szene traegt. */
  cues: [number, number];
  ueberschrift: string;
  mechanik: SzenenMechanik;
};

const ENTWURF: readonly SzenenEntwurf[] = [
  {id: 's01', cues: [0, 2], ueberschrift: 'Die Quelle ist erfunden', mechanik: 'fake-source-hook'},
  {id: 's02', cues: [3, 4], ueberschrift: 'Kein eingebautes Nachschlagen', mechanik: 'search-vs-generate'},
  {id: 's03', cues: [5, 6], ueberschrift: 'Text wird zu Tokens', mechanik: 'token-stream'},
  {id: 's04', cues: [7, 8], ueberschrift: 'Fortsetzungen bekommen Gewichte', mechanik: 'probability-field'},
  {id: 's05', cues: [9, 9], ueberschrift: 'Auswahl statt starrem Platz eins', mechanik: 'sampling'},
  {id: 's06', cues: [10, 11], ueberschrift: 'Plausibel ist nicht geprüft', mechanik: 'verification-gate'},
  {id: 's07', cues: [12, 13], ueberschrift: 'Falsch kann sauber klingen', mechanik: 'same-fluency'},
  {id: 's08', cues: [14, 17], ueberschrift: 'Werkzeuge können nachschlagen', mechanik: 'grounding-tools'},
  {id: 's09', cues: [18, 18], ueberschrift: 'Werkzeuge senken nur das Risiko', mechanik: 'tool-limits'},
  {id: 's10', cues: [19, 20], ueberschrift: 'Kritisches selbst prüfen', mechanik: 'manual-check'},
  {id: 's11', cues: [21, 22], ueberschrift: 'Entwurf statt Beleg', mechanik: 'draft-vs-proof'},
];

export type ReelSzene = {
  id: string;
  ueberschrift: string;
  mechanik: SzenenMechanik;
  startFrame: number;
  dauer: number;
  cues: typeof REEL_CUES;
};

export const REEL_SZENEN: readonly ReelSzene[] = ENTWURF.map((entwurf) => {
  const erster = REEL_CUES[entwurf.cues[0]];
  const letzter = REEL_CUES[entwurf.cues[1]];
  return {
    id: entwurf.id,
    ueberschrift: entwurf.ueberschrift,
    mechanik: entwurf.mechanik,
    startFrame: erster.startFrame,
    dauer: letzter.endFrame - erster.startFrame,
    cues: REEL_CUES.slice(entwurf.cues[0], entwurf.cues[1] + 1),
  };
});

export {REEL_LAENGE_IN_FRAMES};
