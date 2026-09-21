/**
 * Drehbuch fuer das Beispiel-Reel "Vom Satz zur Antwort".
 *
 * Kurze, schnelle Szenen statt einer langen: jede traegt genau einen Gedanken
 * und wird hart geschnitten. Untertitel nach ki/src/reels/captionSafe.ts -
 * hoechstens sechs Woerter, damit sie in zwei Zeilen passen.
 */

export type ReelSzene = {
  id: string;
  dauer: number;
  ueberschrift: string;
  untertitel: string;
  mechanik:
    | 'satz'
    | 'zerfall'
    | 'tokens'
    | 'zahlen'
    | 'raum'
    | 'kontext'
    | 'frage'
    | 'saeulen'
    | 'wahl'
    | 'schleife'
    | 'antwort'
    | 'grenze'
    | 'schluss';
};

export const REEL_SZENEN: readonly ReelSzene[] = [
  {id: 's01', dauer: 108, ueberschrift: 'Du tippst einen Satz', untertitel: 'Du schreibst etwas hinein.', mechanik: 'satz'},
  {id: 's02', dauer: 120, ueberschrift: 'Die KI sieht keine Wörter', untertitel: 'Für sie ist das kein Text.', mechanik: 'zerfall'},
  {id: 's03', dauer: 132, ueberschrift: 'Sie zerlegt in Tokens', untertitel: 'Erst wird alles zerlegt.', mechanik: 'tokens'},
  {id: 's04', dauer: 126, ueberschrift: 'Jedes Token wird zur Zahl', untertitel: 'Aus Sprache werden Zahlen.', mechanik: 'zahlen'},
  {id: 's05', dauer: 138, ueberschrift: 'Zahlen bekommen einen Ort', untertitel: 'Ähnliches liegt nah beieinander.', mechanik: 'raum'},
  {id: 's06', dauer: 144, ueberschrift: 'Jedes Wort schaut auf andere', untertitel: 'Der Kontext entscheidet mit.', mechanik: 'kontext'},
  {id: 's07', dauer: 102, ueberschrift: 'Was kommt als Nächstes?', untertitel: 'Jetzt kommt die eigentliche Frage.', mechanik: 'frage'},
  {id: 's08', dauer: 150, ueberschrift: 'Jedes Wort bekommt eine Chance', untertitel: 'Sie rechnet Wahrscheinlichkeiten.', mechanik: 'saeulen'},
  {id: 's09', dauer: 120, ueberschrift: 'Das wahrscheinlichste gewinnt', untertitel: 'Das höchste Wort gewinnt.', mechanik: 'wahl'},
  {id: 's10', dauer: 114, ueberschrift: 'Und dann noch mal', untertitel: 'Danach beginnt alles von vorn.', mechanik: 'schleife'},
  {id: 's11', dauer: 150, ueberschrift: 'Wort für Wort entsteht die Antwort', untertitel: 'So wächst die Antwort.', mechanik: 'antwort'},
  {id: 's12', dauer: 138, ueberschrift: 'Sie weiß nicht, ob es stimmt', untertitel: 'Sie prüft dabei nichts nach.', mechanik: 'grenze'},
  {id: 's13', dauer: 162, ueberschrift: 'Wahrscheinlichkeit, keine Wahrheit', untertitel: 'Darum immer selbst prüfen.', mechanik: 'schluss'},
];

export const REEL_DAUER_IN_FRAMES = REEL_SZENEN.reduce(
  (summe, szene) => summe + szene.dauer,
  0,
);

export const szenenStart = (index: number): number =>
  REEL_SZENEN.slice(0, index).reduce((summe, szene) => summe + szene.dauer, 0);
