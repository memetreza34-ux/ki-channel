#!/usr/bin/env node
import {mkdir, readdir, readFile, rename, writeFile} from 'node:fs/promises';
import {basename, dirname, join, resolve} from 'node:path';
import process from 'node:process';
import {spawnSync} from 'node:child_process';

const [rawTitle, rawDate] = process.argv.slice(2);
if (!rawTitle?.trim()) {
  console.error('Aufruf: node scripts/new-ki-reel.mjs "Reel Titel" [YYYY-MM-DD]');
  process.exit(1);
}

const parseDate = (value) => {
  if (!value) return new Date();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Datum muss YYYY-MM-DD sein.');
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) throw new Error('Ungültiges Datum.');
  return parsed;
};

const WEEKDAY_FOLDERS = Object.freeze({
  1: '01_Montag',
  2: '02_Dienstag',
  3: '03_Mittwoch',
  4: '04_Donnerstag',
  5: '05_Freitag',
  6: '06_Samstag',
  0: '07_Sonntag',
});

const selectedDate = parseDate(rawDate);
const weekdayFolder = WEEKDAY_FOLDERS[selectedDate.getUTCDay()];
if (!weekdayFolder) throw new Error('Wochentag konnte nicht bestimmt werden.');

const coreGenerator = resolve('scripts', 'new-ki-reel-core.mjs');
const coreArgs = [coreGenerator, rawTitle];
if (rawDate) coreArgs.push(rawDate);

const core = spawnSync(process.execPath, coreArgs, {
  encoding: 'utf8',
  stdio: ['inherit', 'pipe', 'pipe'],
});

if (core.stdout) process.stdout.write(core.stdout);
if (core.stderr) process.stderr.write(core.stderr);
if (core.error) {
  console.error(`Core-Generator konnte nicht gestartet werden: ${core.error.message}`);
  process.exit(1);
}
if (core.status !== 0) process.exit(core.status ?? 1);

const match = String(core.stdout || '').match(/KI-Reel angelegt:\s*(.+)/);
if (!match?.[1]) {
  console.error('Tagesstruktur fehlgeschlagen: Core-Generator hat keinen Reel-Pfad gemeldet.');
  process.exit(1);
}

const temporaryReelRoot = resolve(match[1].trim());
const weekRoot = dirname(temporaryReelRoot);
const dayRoot = join(weekRoot, weekdayFolder);
await mkdir(dayRoot, {recursive: true});

const existingDayEntries = await readdir(dayRoot, {withFileTypes: true});
const usedTopicSlots = existingDayEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1]))
  .filter(Number.isFinite);

let topicIndex = 1;
while (usedTopicSlots.includes(topicIndex)) topicIndex++;
if (topicIndex > 99) throw new Error(`${weekdayFolder} enthält bereits 99 Reel-Themen.`);

const topicSlug = basename(temporaryReelRoot).replace(/^\d{2}_/, '');
const finalReelName = `${String(topicIndex).padStart(2, '0')}_${topicSlug}`;
const finalReelRoot = join(dayRoot, finalReelName);
await rename(temporaryReelRoot, finalReelRoot);

const readmePath = join(finalReelRoot, 'README.md');
try {
  const dayLabel = weekdayFolder.replace(/^\d{2}_/, '');
  const current = await readFile(readmePath, 'utf8');
  const next = current.includes('**Wochentag:**')
    ? current
    : current.replace(/(\*\*Woche:\*\*[^\n]*\n)/, `$1**Wochentag:** ${dayLabel}\n`);
  if (next !== current) await writeFile(readmePath, next, 'utf8');
} catch (error) {
  console.warn(`README-Wochentag konnte nicht ergänzt werden: ${error instanceof Error ? error.message : error}`);
}

console.log(`KI-Reel Tagesstruktur: ${finalReelRoot}`);
console.log(`Wochentag: ${weekdayFolder}`);
console.log('Kanonisch: Woche → Wochentag → NN_Thema → 01–06 Produktionsordner.');
