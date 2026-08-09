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
  resolve(reelRoot, '01-script-audio', 'README.md'),
  '# AUDIO-HANDOFF — PHASE 2\n\n' +
    'Der verbindliche 3-Phasen-Ablauf steht in `ki/gehirn/PRODUKTIONSABLAUF.md`.\n\n' +
    'Phase 1 muss hier `voiceover.md` mit dem finalen wortgetreuen Sprechertext anlegen.\n' +
    'Phase 2 ist ausschließlich der menschliche Audio-Schritt: `voiceover.md` verwenden und bevorzugt `voiceover.wav`, alternativ `voiceover.mp3`, in diesem Ordner ablegen.\n' +
    'Danach übernimmt Phase 3 (Codex/Antigravity) Integration, Timing, Tests, Smoke Review und Final Render.\n',
  'utf8',
);

await writeFile(
  resolve(reelRoot, '06-projektdateien', 'PHASE-STATUS.md'),
  `# Produktionsstatus — ${title}\n\n` +
    '## Phase 1 — ChatGPT\n\n' +
    '**Status:** OFFEN\n\n' +
    'Phase 1 ist erst fertig, wenn Skript, Szenen-/Animationsplanung, Captions/Manifest, ausführbarer Remotion-Source unter `ki/src/reels/<slug>/`, Composition-Registrierung und fokussierte Checks vorhanden sind.\n\n' +
    '## Phase 2 — Mensch\n\n' +
    '**Status:** WARTET AUF PHASE 1\n\n' +
    'Nur das finale Voiceover aus `01-script-audio/voiceover.md` erzeugen und als `voiceover.wav` oder `voiceover.mp3` dort ablegen.\n\n' +
    '## Phase 3 — Codex / Antigravity\n\n' +
    '**Status:** WARTET AUF PHASE 2\n\n' +
    'Audio integrieren, reales Timing prüfen, Tests/Typecheck ausführen, Smoke-Frames visuell prüfen, finales MP4 rendern und Export verifizieren.\n',
  'utf8',
);

await writeFile(
  resolve(reelRoot, 'README.md'),
  `# ${title}\n\n` +
    `**Woche:** ${weekName}\n\n` +
    '## Verbindlicher 3-Phasen-Ablauf\n\n' +
    '1. **Phase 1 — ChatGPT:** komplette Planung + ausführbare Code-Grundlage\n' +
    '2. **Phase 2 — Mensch:** ausschließlich Voiceover erzeugen\n' +
    '3. **Phase 3 — Codex/Antigravity:** Audio integrieren, prüfen, smoke-reviewen, final rendern\n\n' +
    'Details: `ki/gehirn/PRODUKTIONSABLAUF.md`. Aktueller Reel-Status: `06-projektdateien/PHASE-STATUS.md`.\n\n' +
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
console.log('Produktionsvertrag: ki/gehirn/PRODUKTIONSABLAUF.md · Phase 1 muss vor Audio vollständig sein.');
