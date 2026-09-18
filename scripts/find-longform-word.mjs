#!/usr/bin/env node
/**
 * Findet gesprochene Woerter im Voiceover und gibt ihre Frames aus.
 *
 * Damit werden Bilder auf das Wort gelegt, das sie erklaeren — statt auf eine
 * geschaetzte Position. Ausgabe wahlweise absolut oder relativ zu einem
 * Kapitelstart.
 *
 * Aufruf:
 *   node scripts/find-longform-word.mjs <whisper.json> <suchwort> [kapitelstart]
 *   node scripts/find-longform-word.mjs <whisper.json> --range <von> <bis>
 */
import {readFileSync} from 'node:fs';

const [, , whisperPath, ...args] = process.argv;
const fps = 30;

const raw = JSON.parse(readFileSync(whisperPath, 'utf8'));
const words = [];
for (const segment of raw.segments ?? []) {
  for (const word of segment.words ?? []) {
    const text = String(word.word ?? '').trim();
    if (!text) continue;
    words.push({text, start: Math.round(Number(word.start) * fps), end: Math.round(Number(word.end) * fps)});
  }
}

const norm = (v) => v.toLowerCase().replace(/[^a-zäöüß0-9]/gi, '');

if (args[0] === '--range') {
  const from = Number(args[1]);
  const to = Number(args[2]);
  const offset = Number(args[3] ?? 0);
  words
    .filter((w) => w.start >= from && w.start <= to)
    .forEach((w, i) => {
      const rel = w.start - offset;
      process.stdout.write(`${String(rel).padStart(5)}f  ${w.text}${(i + 1) % 6 === 0 ? '\n' : '   '}`);
    });
  process.stdout.write('\n');
} else {
  const needle = norm(args[0] ?? '');
  const offset = Number(args[1] ?? 0);
  const hits = words
    .map((w, i) => ({...w, i}))
    .filter((w) => norm(w.text).includes(needle));
  if (hits.length === 0) {
    console.log(`"${args[0]}" nicht gefunden`);
    process.exit(0);
  }
  hits.forEach((w) => {
    const context = words.slice(Math.max(0, w.i - 3), w.i + 4).map((x) => x.text).join(' ');
    console.log(
      `${String(w.start - offset).padStart(6)}f  (abs ${String(w.start).padStart(5)}f, ${(w.start / fps).toFixed(1)}s)  ${w.text.padEnd(18)} … ${context}`
    );
  });
}
