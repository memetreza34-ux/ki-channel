import {useCurrentFrame} from 'remotion';
import {VOICE_SENTENCES, VOICE_WORDS} from './words.generated';

/**
 * Sprech-Signal fuer die Longform-Szenen.
 *
 * Das Problem der ersten Fassung: jedes Element fuhr einmal ein und stand
 * danach bis zum Kapitelende still. Bei rund 1200 Frames Kapitellaenge und
 * neun Elementen waren das gut 200 bewegte Frames — der Rest war ein
 * Standbild, das sich langsam fuellte.
 *
 * Diese Datei dreht das um. Sie macht aus den Wort-Timestamps ein
 * fortlaufendes Signal, an das sich jedes Element haengen kann:
 *
 *   pulse    — Impuls auf jedem gesprochenen Wort, klingt weich ab
 *   energy   — spricht er gerade, oder ist Pause
 *   flow     — laeuft ueber den Satz von 0 nach 1
 *
 * Damit bewegt sich das Bild, solange die Stimme laeuft, nicht nur an neun
 * Zeitpunkten.
 */

export type SpokenWord = {t: string; a: number; b: number};
export type SpokenSentence = {a: number; b: number; from: number; to: number};

/** Letzter Eintrag, der bei oder vor `frame` beginnt. Binaere Suche. */
export const indexAt = <T extends {a: number}>(list: T[], frame: number): number => {
  let lo = 0;
  let hi = list.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid].a <= frame) {
      found = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return found;
};

export type Speech = {
  /** Frame absolut zum Videostart. */
  frame: number;
  /** Index des zuletzt begonnenen Wortes, -1 vor dem ersten. */
  wordIndex: number;
  /** Das zuletzt begonnene Wort. */
  word: SpokenWord | null;
  /** Frames seit Beginn dieses Wortes. */
  sinceWord: number;
  /** 0..1 — Impuls auf jedem Wort, klingt in rund einer Drittelsekunde ab. */
  pulse: number;
  /** 0..1 — wie dicht im Moment gesprochen wird. In Pausen faellt der Wert. */
  energy: number;
  /** 0..1 — Position im laufenden Satz. */
  flow: number;
  /** Index des laufenden Satzes. */
  sentenceIndex: number;
  /** Wieviele Woerter dieses Satzes schon gesprochen sind, 0..1. */
  sentenceWords: number;
};

const DECAY = 7;   // Frames, in denen ein Wort-Impuls abklingt
const WINDOW = 18; // Frames, ueber die die Sprech-Energie gemittelt wird

/**
 * Liefert das Sprech-Signal fuer den aktuellen Frame.
 *
 * @param offset Frame, an dem die umgebende Sequence im Video beginnt.
 *               Innerhalb einer `<Sequence>` zaehlt `useCurrentFrame()` wieder
 *               bei 0 — die Wort-Timestamps sind aber absolut.
 */
export const useSpeech = (offset = 0): Speech => {
  const local = useCurrentFrame();
  const frame = local + offset;

  const wordIndex = indexAt(VOICE_WORDS, frame);
  const word = wordIndex >= 0 ? VOICE_WORDS[wordIndex] : null;
  const sinceWord = word ? frame - word.a : Number.POSITIVE_INFINITY;

  // Impuls: die letzten drei Woerter ueberlagern sich, damit schnelle Folgen
  // ineinander laufen statt einzeln zu zucken.
  let pulse = 0;
  for (let i = wordIndex; i > wordIndex - 3 && i >= 0; i--) {
    const dt = frame - VOICE_WORDS[i].a;
    if (dt < 0) continue;
    pulse += Math.exp(-dt / DECAY);
  }
  pulse = Math.min(1, pulse);

  // Energie: Anteil gesprochener Frames im Fenster um den aktuellen Frame.
  let spoken = 0;
  for (let i = wordIndex; i >= 0 && i > wordIndex - 12; i--) {
    const w = VOICE_WORDS[i];
    const from = Math.max(w.a, frame - WINDOW);
    const to = Math.min(w.b, frame + 2);
    if (to > from) spoken += to - from;
  }
  const energy = Math.min(1, spoken / WINDOW);

  const sentenceIndex = indexAt(VOICE_SENTENCES, frame);
  const sentence = sentenceIndex >= 0 ? VOICE_SENTENCES[sentenceIndex] : null;
  const flow = sentence
    ? Math.min(1, Math.max(0, (frame - sentence.a) / Math.max(1, sentence.b - sentence.a)))
    : 0;
  const sentenceWords = sentence
    ? Math.min(1, Math.max(0, (wordIndex - sentence.from) / Math.max(1, sentence.to - sentence.from)))
    : 0;

  return {frame, wordIndex, word, sinceWord, pulse, energy, flow, sentenceIndex, sentenceWords};
};

/**
 * Ruhiges Atmen. Jedes Element bekommt ueber `seed` eine eigene Phase, damit
 * nicht die ganze Szene im Gleichtakt wippt.
 */
export const breathe = (frame: number, seed: number, amp = 1, period = 190): number =>
  Math.sin((frame / period) * Math.PI * 2 + seed * 2.399) * amp;

/** Langsames Wandern in zwei Achsen — gegen das eingefrorene Bild. */
export const drift = (frame: number, seed: number, amp = 1): {x: number; y: number} => ({
  x: Math.sin((frame / 232) * Math.PI * 2 + seed * 1.71) * amp,
  y: Math.cos((frame / 287) * Math.PI * 2 + seed * 2.53) * amp * 0.8,
});

/**
 * Wieviele Woerter zwischen zwei Frames gesprochen wurden.
 *
 * Wird je Textbaustein und Frame gebraucht. Als linearer Durchlauf ueber alle
 * 779 Woerter war das der Grund, warum der Render in den Puppeteer-Timeout
 * lief — hier zwei binaere Suchen statt zweier voller Durchlaeufe.
 */
export const wordsBetween = (fromFrame: number, toFrame: number): number => {
  if (toFrame < fromFrame) return 0;
  const before = indexAt(VOICE_WORDS, fromFrame - 1);
  const until = indexAt(VOICE_WORDS, toFrame);
  return Math.max(0, until - before);
};

export {VOICE_SENTENCES, VOICE_WORDS};
