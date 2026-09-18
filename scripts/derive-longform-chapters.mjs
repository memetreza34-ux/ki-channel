#!/usr/bin/env node
/**
 * Leitet die Kapitelgrenzen aus der echten Transkription ab.
 *
 * Bisher standen die Grenzen auf runden Zahlen (720, 1770, 2970 ...). Die
 * haben mit dem Sprecher nichts zu tun: ein Kapitel wechselte mitten im Satz.
 * Hier wird stattdessen der erste Satz jedes Absatzes im Voiceover gesucht und
 * die Grenze auf die Sprechpause davor gelegt.
 *
 * Aufruf:
 *   node scripts/derive-longform-chapters.mjs <whisper.json> <voiceover.txt> [fps]
 */
import {readFileSync} from 'node:fs';

const [, , whisperPath, scriptPath, fpsArg] = process.argv;
const fps = Number(fpsArg ?? 30);

const raw = JSON.parse(readFileSync(whisperPath, 'utf8'));
const paragraphs = readFileSync(scriptPath, 'utf8')
  .split(/\n\s*\n/)
  .map((p) => p.trim())
  .filter(Boolean);

const words = [];
for (const segment of raw.segments ?? []) {
  for (const word of segment.words ?? []) {
    const text = String(word.word ?? '').trim();
    if (!text) continue;
    words.push({text, start: Math.round(Number(word.start) * fps), end: Math.round(Number(word.end) * fps)});
  }
}

const normalize = (value) =>
  value.toLowerCase().replace(/[^a-zäöüß0-9]+/gi, '');

/** Sucht die Wortfolge `tokens` ab `fromIndex` im Wortstrom. */
const findSequence = (tokens, fromIndex) => {
  const needle = tokens.map(normalize).filter(Boolean);
  for (let i = fromIndex; i < words.length - needle.length; i++) {
    let hit = true;
    for (let j = 0; j < needle.length; j++) {
      if (normalize(words[i + j].text) !== needle[j]) {
        hit = false;
        break;
      }
    }
    if (hit) return i;
  }
  return -1;
};

const starts = [];
let cursor = 0;
paragraphs.forEach((paragraph, index) => {
  const tokens = paragraph.split(/\s+/).slice(0, 5);
  const at = index === 0 ? 0 : findSequence(tokens, cursor);
  if (at < 0) {
    console.error(`Absatz ${index + 1} nicht gefunden: "${tokens.join(' ')}"`);
    process.exit(1);
  }
  starts.push(at);
  cursor = at + 3;
});

console.log(`${paragraphs.length} Absaetze, ${words.length} Woerter\n`);

starts.forEach((wordIndex, i) => {
  const startFrame = words[wordIndex].start;
  const prevEnd = wordIndex > 0 ? words[wordIndex - 1].end : 0;
  const gap = startFrame - prevEnd;
  // Grenze in die Sprechpause legen, aber nicht weiter als 18 Frames zurueck.
  const boundary = i === 0 ? 0 : Math.max(prevEnd + 2, startFrame - Math.min(18, Math.floor(gap / 2)));
  const nextWordIndex = starts[i + 1];
  const endFrame = nextWordIndex === undefined
    ? words.at(-1).end + 40
    : null;
  console.log(
    `Absatz ${String(i + 1).padStart(2)} | Wort ${String(wordIndex).padStart(3)} | ` +
    `Start ${String(startFrame).padStart(5)}f (${(startFrame / fps).toFixed(1)}s) | ` +
    `Pause davor ${String(gap).padStart(3)}f | Grenze ${String(boundary).padStart(5)}f` +
    (endFrame ? ` | Ende ${endFrame}f` : '') +
    `  "${words[wordIndex].text} ${words[wordIndex + 1]?.text ?? ''} ..."`
  );
});

const last = words.at(-1);
console.log(`\nLetztes Wort endet ${last.end}f (${(last.end / fps).toFixed(1)}s)`);
console.log(`Empfohlene Gesamtlaenge inkl. Auslauf: ${last.end + 55}f (${((last.end + 55) / fps).toFixed(1)}s)`);

// Maschinenlesbar fuer den naechsten Schritt.
const boundaries = starts.map((wordIndex, i) => {
  if (i === 0) return 0;
  const startFrame = words[wordIndex].start;
  const prevEnd = words[wordIndex - 1].end;
  const gap = startFrame - prevEnd;
  return Math.max(prevEnd + 2, startFrame - Math.min(18, Math.floor(gap / 2)));
});
console.log(`\nJSON: ${JSON.stringify({boundaries, total: last.end + 55})}`);
