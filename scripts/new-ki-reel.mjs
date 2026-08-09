import {mkdir, readdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

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

const iso = (date) => date.toISOString().slice(0, 10);
const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
};
const weekBounds = (date) => {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
  const weekday = utc.getUTCDay();
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday;
  const monday = addDays(utc, mondayOffset);
  return {monday, sunday: addDays(monday, 6)};
};
const slugify = (title) => title
  .trim()
  .replace(/[–—]/g, '-')
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-+/g, '-');

const title = rawTitle.trim();
const slug = slugify(title);
if (!slug) throw new Error('Aus dem Titel konnte kein gültiger Ordnername gebildet werden.');

const {monday, sunday} = weekBounds(parseDate(rawDate));
const weekName = `${iso(monday)}_bis_${iso(sunday)}`;
const weekRoot = resolve('ki', 'reels', weekName);
await mkdir(weekRoot, {recursive: true});

const existing = await readdir(weekRoot, {withFileTypes: true});
const usedIndexes = existing
  .filter((entry) => entry.isDirectory())
  .map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1]))
  .filter(Number.isFinite);
let index = 1;
while (usedIndexes.includes(index)) index += 1;
if (index > 99) throw new Error(`Wochenordner ${weekName} enthält bereits 99 Reel-Slots.`);

const reelName = `${String(index).padStart(2, '0')}_${slug}`;
const reelRoot = resolve(weekRoot, reelName);
const requiredDirs = [
  '01-script-audio',
  '02-bilder',
  '03-caption',
  '04-pdf',
  '05-export',
  '06-projektdateien',
];

await mkdir(reelRoot, {recursive: false});
for (const dir of requiredDirs) {
  const path = resolve(reelRoot, dir);
  await mkdir(path, {recursive: false});
  await writeFile(
    resolve(path, '.gitkeep'),
    'Dieser Ordner ist Bestandteil der verbindlichen KI-Reel-Produktionsstruktur und darf nicht entfernt werden.\n',
    'utf8',
  );
}

await writeFile(
  resolve(reelRoot, 'README.md'),
  `# ${title}\n\n` +
    `**Woche:** ${weekName}\n\n` +
    '## Verbindliche Produktionsstruktur\n\n' +
    '1. `01-script-audio/` — Skript, Voiceover und Audio\n' +
    '2. `02-bilder/` — Bildprompts und Bilder\n' +
    '3. `03-caption/` — Untertitel und Social-Caption\n' +
    '4. `04-pdf/` — optionale PDF-Inhalte\n' +
    '5. `05-export/` — finale Exporte und Kontrollframes\n' +
    '6. `06-projektdateien/` — Briefing, Storyboard, Motion Design und technische Planungsdateien\n\n' +
    'Planungsdateien niemals direkt unter `ki/` oder `ki/src/reels/` ablegen. Ausführbarer Remotion-Code entsteht separat unter `ki/src/reels/<slug>/`.\n',
  'utf8',
);

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Nächster Pflichtcheck: node scripts/check-ki-reel-folder-structure.mjs');
