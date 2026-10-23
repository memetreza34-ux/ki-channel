import {progress, type EaseName} from '../../kit';
import woerter from './woerter.json';

/**
 * Zeiten für „Wie viel Strom frisst KI wirklich?“ – alles in Sekunden aus den
 * Wortzeiten von Armans Aufnahme (`woerter.json`, whisper.cpp medium).
 */

export const FPS = 30;
export const VOICEOVER = 'projekte/ki-strom/voiceover.wav';

type Wort = [start: number, ende: number, text: string];
const WOERTER = woerter as Wort[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');

/** Startzeit (s) des ersten Worts ab `ab`, das mit `wort` beginnt. */
export const at = (wort: string, ab = 0): number => {
  const q = norm(wort);
  const hit = WOERTER.find(([s, , w]) => s >= ab - 0.05 && norm(w).startsWith(q));
  if (!hit) throw new Error(`Wortzeit fehlt: "${wort}" ab ${ab}s`);
  return hit[0];
};

export const STIMME_ENDE = WOERTER[WOERTER.length - 1][1];
export const DAUER_S = STIMME_ENDE + 3.2;

/** 0 → 1 ab Sekunde `start` über `dur` Sekunden. */
export const p = (t: number, start: number, dur = 0.45, ease: EaseName = 'out') => progress(t * FPS, start * FPS, dur * FPS, ease);
/** 1 → 0 ab Sekunde `start`. */
export const raus = (t: number, start: number, dur = 0.35) => 1 - p(t, start, dur, 'in');
/** Kurzer Puls (0 → 1 → 0) um Sekunde `start`. */
export const puls = (t: number, start: number, dur = 0.6) => {
  const q = (t - start) / dur;
  return q < 0 || q > 1 ? 0 : Math.sin(q * Math.PI);
};

/* ───────────── Auslöser je Absatz ───────────── */

export const A1 = {
  frage: at('Frage', 2),
  zeitungen: at('Zeitungen'),
  praesentationen: at('Präsentationen'),
  kommentaren: at('Kommentaren'),
  problem: at('Problem'),
  rechnung: at('Rechnung'),
  j2023: at('2023'),
  heutigen: at('heutigen'),
  zehnmal: at('zehnmal', 16),
  hoch: at('hoch', 17),
};

export const A2 = {
  bevor: at('Bevor'),
  gleichzeitig: at('gleichzeitig'),
  microsoft: at('Microsoft'),
  google: at('Google', 21),
  atom: at('Atomkraftwerke'),
  rechenzentren: at('Rechenzentren', 24),
  wie: at('Wie', 25),
  einzelne: at('einzelne', 27),
  trotzdem: at('trotzdem'),
  knapp: at('knapp', 30),
  genau: at('Genau'),
  echten: at('echten'),
};

export const A3 = {
  fangen: at('Fangen'),
  frage: at('Frage', 36),
  seit: at('Seit'),
  firmen: at('Firmen', 40),
  google: at('Google', 41),
  v024: at('0,24'),
  openai: at('OpenAI'),
  v034: at('0,34'),
  epoch: at('Epoch'),
  v03: at('0,3', 54),
  drei: at('Drei', 55),
  dieselbe: at('dieselbe'),
  unabhaengig: at('Unabhängig', 58),
  passen: at('passen'),
};

export const A4 = {
  was: at('Was', 61),
  led: at('LED'),
  minuten: at('Minuten'),
  fernseher: at('Fernseher'),
  sekunden: at('Sekunden', 69),
  rate: at('rate'),
  mehr: at('mehr', 72),
  hundert: at('100'),
  liter: at('Liter', 75),
  tee: at('Teewasser', 76),
  das: at('Das', 77),
  deutlich: at('deutlich'),
  kocher: at('Wasserkocher'),
  dreihundert: at('300', 82),
};

export const A5 = {
  warum: at('Warum'),
  alte: at('alte', 84),
  erstens: at('Erstens', 86),
  langen: at('langen'),
  zweitens: at('zweitens', 90),
  chips: at('Chips', 90),
  sparsamer: at('sparsamer', 91),
  google: at('Google', 93),
  innerhalb: at('innerhalb'),
  dreiunddreissigstel: at('Dreiunddreißigstel'),
};

export const A6 = {
  aber: at('Aber', 99),
  kurze: at('kurze'),
  laedst: at('Lädst'),
  dokument: at('Dokument', 106),
  hoch: at('hoch', 106),
  epoch: at('Epoch', 108),
  v40: at('40'),
  hundertmal: at('hundertmal'),
  modelle: at('Modelle', 113),
  nachdenken: at('nachdenken'),
  bilder: at('Bilder', 117),
};

export const A7 = {
  mit: at('MIT', 118),
  nachgemessen: at('nachgemessen'),
  bild: at('Bild', 124),
  zwei: at('zwei', 127),
  fuenf: at('fünf', 128),
  video: at('Video', 129),
  v940: at('940'),
  v3000: at('3000'),
  andere: at('Andere', 137),
  aber: at('aber', 139),
  teuerste: at('teuerste'),
};

export const A8 = {
  jetzt: at('Jetzt', 143),
  chatgpt: at('Chatchi', 145),
  zweieinhalb: at('zweieinhalb'),
  milliarden: at('Milliarden', 149),
  tag: at('Tag', 151),
  nur: at('nur', 153),
  gemini: at('Gemini', 156),
  meta: at('Meta'),
  copilot: at('Copilot'),
  apps: at('Apps'),
  firmen: at('Firmen', 159),
  trainiert: at('trainiert'),
  wochen: at('Wochen'),
  zehntausenden: at('zehntausenden'),
};

export const A9 = {
  zusammen: at('Zusammen', 169),
  alle: at('Alle', 171),
  v485: at('485'),
  deutschland: at('Deutschland', 183),
  darin: at('Darin'),
  cloud: at('Cloud'),
  streaming: at('Streaming'),
  webseiten: at('Webseiten'),
  schnellsten: at('schnellsten'),
  ki: at('KI', 191),
  speziell: at('speziell'),
  v50: at('50', 195),
};

export const A10 = {
  geht: at('geht', 199),
  j2030: at('2030'),
  verdoppeln: at('verdoppeln'),
  v950: at('950'),
  teil: at('Teil', 207),
  verdreifachen: at('verdreifachen'),
};

export const A11 = {
  eng: at('Eng'),
  fleck: at('Fleck'),
  irland: at('Irland'),
  viertel: at('Viertel', 217),
  haushalte: at('Haushalte'),
  virginia: at('Virginia'),
};

export const A12 = {
  deshalb: at('Deshalb'),
  microsoft: at('Microsoft', 228),
  zwanzig: at('20', 230),
  reaktor: at('Reaktor'),
  three: at('Three'),
  strom: at('Strom', 234),
  ausgerechnet: at('Ausgerechnet'),
  j1979: at('1979'),
  block: at('Block', 239),
  neustart: at('Neustart'),
  j2027: at('2027'),
  google: at('Google', 246),
  iowa: at('Iowa'),
};

export const A13 = {
  wasser: at('Wasser', 250),
  gekuehlt: at('gekühlt'),
  google: at('Google', 254),
  fuenf: at('fünf', 256),
  vielleicht: at('Vielleicht'),
  flasche: at('Flasche'),
  schaetzung: at('Schätzung'),
  komplette: at('komplette'),
  aelteren: at('älteren'),
  kraftwerken: at('Kraftwerken'),
  beide: at('Beide'),
};

export const A14 = {
  was: at('Was', 274),
  erstens: at('Erstens', 276),
  liter: at('Liter', 281),
  v300: at('300', 283),
  zweitens: at('Zweitens', 285),
  bewusst: at('bewusst'),
  drittens: at('drittens'),
  woher: at('woher'),
  kohle: at('Kohle'),
  gas: at('Gas', 300),
  sonne: at('Sonne'),
  wind: at('Wind', 301),
  atom: at('Atom', 302),
};

export const A15 = {
  halten: at('Halten'),
  winzig: at('winzig'),
  milliarden: at('Milliarden', 307),
  wenn: at('Wenn', 309),
  abonnieren: at('abonnieren'),
  bis: at('Bis', 316),
  toki: at('Toki', 317),
};

/** Erstes Wort jedes Absatzes = Ankunft an der Station. */
export const S = [0, A2.bevor, A3.fangen, A4.was, A5.warum, A6.aber, at('Das', 118), A8.jetzt, A9.zusammen, at('Und', 198.5), A11.eng, A12.deshalb, at('Und', 249.7), A14.was, A15.halten];
