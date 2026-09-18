#!/usr/bin/env node
/**
 * Wandelt eine Whisper-Transkription mit Wort-Timestamps in ein TS-Modul um.
 *
 * Warum ein generiertes Modul und kein JSON-Fetch zur Laufzeit: Remotion
 * rendert jeden Frame einzeln. Ein Fetch waere pro Frame nicht deterministisch,
 * ein importiertes Array ist es. Ausserdem faellt so beim Build auf, wenn die
 * Transkription fehlt — statt erst im fertigen Video.
 *
 * Aufruf:
 *   node scripts/build-longform-words.mjs <whisper.json> <ziel.ts> [fps]
 */
import {readFileSync, writeFileSync} from 'node:fs';

const [, , sourcePath, targetPath, fpsArg] = process.argv;
if (!sourcePath || !targetPath) {
  console.error('Aufruf: build-longform-words.mjs <whisper.json> <ziel.ts> [fps]');
  process.exit(1);
}

const fps = Number(fpsArg ?? 30);
const raw = JSON.parse(readFileSync(sourcePath, 'utf8'));

/** Whisper legt die Woerter je Segment ab. Wir brauchen einen flachen Strom. */
const words = [];
for (const segment of raw.segments ?? []) {
  for (const word of segment.words ?? []) {
    const text = String(word.word ?? '').trim();
    if (!text) continue;
    words.push({
      text,
      start: Math.round(Number(word.start) * fps),
      end: Math.round(Number(word.end) * fps),
    });
  }
}

if (words.length === 0) {
  console.error('Keine Woerter mit Timestamps gefunden. Lief Whisper mit --word_timestamps True?');
  process.exit(1);
}

/**
 * Satzgrenzen aus der Interpunktion. Ein Satz ist die Einheit, in der ein
 * Gedanke abgeschlossen wird — die Szene komponiert sich an diesen Stellen um.
 */
const sentences = [];
let startIndex = 0;
words.forEach((word, index) => {
  const closes = /[.!?](["»“]?)$/.test(word.text);
  const last = index === words.length - 1;
  if (!closes && !last) return;
  sentences.push({
    from: startIndex,
    to: index,
    start: words[startIndex].start,
    end: word.end,
    text: words.slice(startIndex, index + 1).map((w) => w.text).join(' '),
  });
  startIndex = index + 1;
});

const escape = (value) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const out = `/* eslint-disable */
/**
 * GENERIERT — nicht von Hand aendern.
 *
 * Quelle: ${sourcePath}
 * Erzeugt mit: node scripts/build-longform-words.mjs
 *
 * ${words.length} Woerter, ${sentences.length} Saetze, ${fps} fps.
 * Alle Frames sind absolut zum Videostart.
 */
import type {SpokenSentence, SpokenWord} from './speech';

export const VOICE_FPS = ${fps};

export const VOICE_WORDS: SpokenWord[] = [
${words.map((w) => `  {t: '${escape(w.text)}', a: ${w.start}, b: ${w.end}},`).join('\n')}
];

export const VOICE_SENTENCES: SpokenSentence[] = [
${sentences.map((s) => `  {a: ${s.start}, b: ${s.end}, from: ${s.from}, to: ${s.to}}, // ${escape(s.text.slice(0, 96))}`).join('\n')}
];
`;

writeFileSync(targetPath, out, 'utf8');

const lastFrame = words.at(-1).end;
console.log(`${words.length} Woerter, ${sentences.length} Saetze -> ${targetPath}`);
console.log(`Letztes Wort endet bei Frame ${lastFrame} (${(lastFrame / fps).toFixed(1)}s)`);
