import {REEL_CUES, REEL_LAENGE_IN_FRAMES} from './reelSkript';

/**
 * Szenen werden aus dem Skript abgeleitet, nicht umgekehrt.
 *
 * Jede Szene verweist auf die Cues, die sie traegt. Ihre Dauer ergibt sich aus
 * deren Timing - wer den Sprechertext aendert, aendert automatisch die Szene.
 */

export type SzenenMechanik =
  | 'frage'
  | 'antwort-schnell'
  | 'erfunden'
  | 'kein-suchen'
  | 'saeulen'
  | 'wahl'
  | 'schleife'
  | 'kein-pruefen'
  | 'muster'
  | 'gleich-fluessig'
  | 'entwurf'
  | 'pruefen';

type SzenenEntwurf = {
  id: string;
  /** Index des ersten und letzten Cues, den diese Szene traegt. */
  cues: [number, number];
  ueberschrift: string;
  mechanik: SzenenMechanik;
};

const ENTWURF: readonly SzenenEntwurf[] = [
  {id: 's01', cues: [0, 0], ueberschrift: 'Du fragst etwas', mechanik: 'frage'},
  {id: 's02', cues: [1, 1], ueberschrift: 'Die Antwort kommt sofort', mechanik: 'antwort-schnell'},
  {id: 's03', cues: [2, 3], ueberschrift: 'Manchmal ist sie erfunden', mechanik: 'erfunden'},
  {id: 's04', cues: [4, 5], ueberschrift: 'Sie sucht nicht, sie rechnet', mechanik: 'kein-suchen'},
  {id: 's05', cues: [6, 6], ueberschrift: 'Jedes Wort hat eine Chance', mechanik: 'saeulen'},
  {id: 's06', cues: [7, 7], ueberschrift: 'Das wahrscheinlichste gewinnt', mechanik: 'wahl'},
  {id: 's07', cues: [8, 9], ueberschrift: 'Und dann von vorne', mechanik: 'schleife'},
  {id: 's08', cues: [10, 10], ueberschrift: 'Geprüft wird nichts', mechanik: 'kein-pruefen'},
  {id: 's09', cues: [11, 11], ueberschrift: 'Muster statt Fakten', mechanik: 'muster'},
  {id: 's10', cues: [12, 13], ueberschrift: 'Erfundenes klingt gleich gut', mechanik: 'gleich-fluessig'},
  {id: 's11', cues: [14, 15], ueberschrift: 'Antwort ist ein Entwurf', mechanik: 'entwurf'},
  {id: 's12', cues: [16, 17], ueberschrift: 'Zahlen, Namen, Quellen', mechanik: 'pruefen'},
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
