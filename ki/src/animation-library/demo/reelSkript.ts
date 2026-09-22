/**
 * Sprechskript fuer das Reel "Warum KI manchmal Unsinn erzaehlt".
 *
 * Reihenfolge wie im Produktionsablauf: erst der Sprechertext, daraus die
 * Untertitel-Cues, daraus die Szenen. Nicht umgekehrt.
 *
 * 30 fps. Das Timing ist nur die Phase-1-Naeherung. In Phase 3 wird es an das
 * echte Voiceover angepasst. Der Text ist bewusst dichter als die alte Fassung:
 * keine lange Einleitung, der Konflikt steht im ersten Satz.
 */

export const REEL_FPS = 30;

/** Der vollstaendige Sprechertext, so wie er eingesprochen wuerde. */
export const REEL_SPRECHERTEXT = [
  'Diese Studie existiert nicht.',
  'Eine KI koennte sie dir trotzdem nennen: selbstbewusst und voellig plausibel.',
  'Warum passiert das?',
  'Ein Sprachmodell ist keine Suchmaschine.',
  'Es zerlegt Text in Tokens und berechnet plausible Fortsetzungen.',
  'Schritt fuer Schritt entsteht so die Antwort.',
  'Die Auswahl folgt Wahrscheinlichkeiten; nicht immer gewinnt einfach nur Platz eins.',
  'Ohne ein externes Pruefwerkzeug wird eine Behauptung nicht automatisch verifiziert.',
  'Darum kann eine erfundene Quelle sprachlich genauso sauber klingen wie eine echte.',
  'Bei Systemen mit Websuche oder Retrieval sieht es anders aus: Sie koennen Quellen abrufen und Aussagen abgleichen.',
  'Das senkt das Risiko, macht die Antwort aber nicht automatisch fehlerfrei.',
  'Deshalb Zahlen, Namen und Quellen selbst oeffnen und pruefen.',
  'KI ist stark fuer Entwuerfe und Erklaerungen, aber kein alleiniger Beleg.',
].join(' ');

export type UntertitelCue = {
  /** Text, normalerweise hoechstens sechs Woerter - passt in zwei Zeilen. */
  text: string;
  startFrame: number;
  endFrame: number;
};

type CueEntwurf = {text: string; sekunden: number};

const ENTWURF: readonly CueEntwurf[] = [
  {text: 'Diese Studie existiert nicht.', sekunden: 2.2},
  {text: 'Eine KI koennte sie trotzdem nennen.', sekunden: 3.0},
  {text: 'Selbstbewusst und voellig plausibel.', sekunden: 2.4},
  {text: 'Warum passiert das?', sekunden: 1.8},
  {text: 'Ein Sprachmodell ist keine Suchmaschine.', sekunden: 3.0},
  {text: 'Es zerlegt Text in Tokens.', sekunden: 2.8},
  {text: 'Dann berechnet es plausible Fortsetzungen.', sekunden: 3.0},
  {text: 'Schritt fuer Schritt entsteht Antwort.', sekunden: 2.8},
  {text: 'Die Auswahl folgt Wahrscheinlichkeiten.', sekunden: 2.8},
  {text: 'Nicht immer gewinnt Platz eins.', sekunden: 2.8},
  {text: 'Ohne ein externes Pruefwerkzeug', sekunden: 2.5},
  {text: 'wird nichts automatisch verifiziert.', sekunden: 2.6},
  {text: 'Darum klingen erfundene Quellen', sekunden: 2.5},
  {text: 'oft genauso sauber wie echte.', sekunden: 2.6},
  {text: 'Mit Websuche sieht es anders aus.', sekunden: 2.8},
  {text: 'Systeme koennen Quellen abrufen', sekunden: 2.5},
  {text: 'und Aussagen damit abgleichen.', sekunden: 2.5},
  {text: 'Das senkt das Risiko.', sekunden: 2.0},
  {text: 'Fehlerfrei wird es nicht automatisch.', sekunden: 2.6},
  {text: 'Zahlen, Namen und Quellen:', sekunden: 2.5},
  {text: 'selbst oeffnen und pruefen.', sekunden: 2.3},
  {text: 'KI ist stark fuer Entwuerfe.', sekunden: 2.4},
  {text: 'Aber kein alleiniger Beleg.', sekunden: 2.3},
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
