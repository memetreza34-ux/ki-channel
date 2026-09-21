/**
 * Sprechskript fuer das Reel "Warum KI manchmal Unsinn erzaehlt".
 *
 * Reihenfolge wie im Produktionsablauf: erst der Sprechertext, daraus die
 * Untertitel-Cues, daraus die Szenen. Nicht umgekehrt.
 *
 * 30 fps. Timing aus der Sprechdauer geschaetzt: rund 2.6 Woerter je Sekunde
 * bei ruhigem Tempo.
 */

export const REEL_FPS = 30;

/** Der vollstaendige Sprechertext, so wie er eingesprochen wuerde. */
export const REEL_SPRECHERTEXT = [
  'Du fragst eine KI etwas.',
  'Sie antwortet sofort, klar und selbstbewusst.',
  'Und manchmal ist alles davon erfunden.',
  'Der Grund steckt darin, wie sie arbeitet.',
  'Sie sucht keine Antwort. Sie berechnet das nächste Wort.',
  'Jedes Wort bekommt eine Wahrscheinlichkeit.',
  'Das wahrscheinlichste gewinnt und wird gesagt.',
  'Dann fängt sie von vorne an, Wort für Wort.',
  'Dabei prüft sie nichts nach.',
  'Sie kennt nur Muster, keine Fakten.',
  'Eine erfundene Quelle klingt genauso flüssig wie eine echte.',
  'Deshalb wirkt Falsches oft überzeugender als Richtiges.',
  'Nimm Antworten als Entwurf, nicht als Beleg.',
  'Bei Zahlen, Namen und Quellen: immer nachprüfen.',
].join(' ');

export type UntertitelCue = {
  /** Text, hoechstens sechs Woerter - passt in zwei Zeilen. */
  text: string;
  startFrame: number;
  endFrame: number;
};

type CueEntwurf = {text: string; sekunden: number};

const ENTWURF: readonly CueEntwurf[] = [
  {text: 'Du fragst eine KI etwas.', sekunden: 2.7},
  {text: 'Sie antwortet sofort und selbstbewusst.', sekunden: 3.5},
  {text: 'Manchmal ist alles davon erfunden.', sekunden: 3.5},
  {text: 'Der Grund: wie sie arbeitet.', sekunden: 3.0},
  {text: 'Sie sucht keine Antwort.', sekunden: 2.5},
  {text: 'Sie berechnet das nächste Wort.', sekunden: 3.2},
  {text: 'Jedes Wort bekommt eine Wahrscheinlichkeit.', sekunden: 3.7},
  {text: 'Das wahrscheinlichste gewinnt.', sekunden: 2.7},
  {text: 'Dann fängt sie von vorne an.', sekunden: 3.2},
  {text: 'Wort für Wort, ohne Pause.', sekunden: 3.2},
  {text: 'Dabei prüft sie nichts nach.', sekunden: 3.2},
  {text: 'Sie kennt Muster, keine Fakten.', sekunden: 3.5},
  {text: 'Erfundene Quellen klingen echt.', sekunden: 3.5},
  {text: 'Falsches wirkt oft überzeugender.', sekunden: 3.5},
  {text: 'Nimm Antworten als Entwurf.', sekunden: 3.0},
  {text: 'Nicht als Beleg.', sekunden: 2.2},
  {text: 'Zahlen, Namen, Quellen:', sekunden: 2.5},
  {text: 'immer nachprüfen.', sekunden: 3.2},
];

export const REEL_CUES: readonly UntertitelCue[] = ENTWURF.reduce<UntertitelCue[]>(
  (liste, entwurf) => {
    const start = liste.length === 0 ? 0 : liste[liste.length - 1].endFrame;
    liste.push({
      text: entwurf.text,
      startFrame: start,
      endFrame: start + Math.round(entwurf.sekunden * REEL_FPS),
    });
    return liste;
  },
  [],
);

export const REEL_LAENGE_IN_FRAMES =
  REEL_CUES[REEL_CUES.length - 1]?.endFrame ?? 0;
