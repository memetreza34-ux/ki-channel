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
const addDays = (date, days) => { const copy = new Date(date); copy.setUTCDate(copy.getUTCDate() + days); return copy; };
const weekBounds = (date) => {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
  const weekday = utc.getUTCDay();
  const monday = addDays(utc, weekday === 0 ? -6 : 1 - weekday);
  return {monday, sunday: addDays(monday, 6)};
};
const slugify = (title) => title.trim().replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-');

const title = rawTitle.trim();
const slug = slugify(title);
if (!slug) throw new Error('Kein gültiger Ordnername aus Titel erzeugbar.');

const {monday, sunday} = weekBounds(parseDate(rawDate));
const weekName = `${iso(monday)}_bis_${iso(sunday)}`;
const weekRoot = resolve('ki', 'reels', weekName);
await mkdir(weekRoot, {recursive: true});

const existing = await readdir(weekRoot, {withFileTypes: true});
const used = existing.filter((entry) => entry.isDirectory()).map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1])).filter(Number.isFinite);
let index = 1;
while (used.includes(index)) index += 1;
if (index > 99) throw new Error(`${weekName} enthält bereits 99 Reel-Slots.`);

const reelName = `${String(index).padStart(2, '0')}_${slug}`;
const reelRoot = resolve(weekRoot, reelName);
const dirs = ['01-script-audio','02-bilder','03-caption','05-export','06-projektdateien'];
await mkdir(reelRoot, {recursive: false});
for (const dir of dirs) {
  await mkdir(resolve(reelRoot, dir), {recursive: false});
  await writeFile(resolve(reelRoot, dir, '.gitkeep'), 'Verbindlicher Produktionsordner — nicht entfernen.\n', 'utf8');
}

const files = {
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n\n## 3 Phasen\n\n1. **Phase 1 — ChatGPT:** komplette Planung + Plattform-Copy + ausführbare Remotion-Code-Grundlage\n2. **Phase 2 — Mensch:** nur echtes Voiceover\n3. **Phase 3 — Codex/Antigravity:** Audio integrieren + prüfen + rendern\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/MASTER.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`, \`ki/gehirn/PLATTFORMEN.md\`.\n\nAktueller Status: \`06-projektdateien/PHASE-STATUS.md\`.\n`,
  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPhase 1 muss hier \`voiceover.md\` und den reinen Fließtext \`VOICEOVER-ZUM-KOPIEREN.txt\` anlegen.\n\nPhase 2 erzeugt ausschließlich \`voiceover.wav\` (bevorzugt) oder \`voiceover.mp3\`. Keine Planungs-/Code-Dateien in Phase 2 ändern.\n`,
  '02-bilder/README.md': `# 02 — Bilder\n\nPhase 1 entscheidet zuerst ausdrücklich: **BILDER ERFORDERLICH** oder **BILDER NICHT ERFORDERLICH**.\n\nBei Bildbedarf: \`ki/BILDSTIL.md\` anwenden, finale Prompts in \`image-prompts.md\`, Assets in \`asset-manifest.json\`. Bild-KI baut räumliche/illustrative Komplexität; Überschriften, Captions, Zahlen, Pfeile und präzise UI-Texte bleiben Remotion.\n`,
  '02-bilder/image-prompts.md': `# Image Prompts\n\n**Status:** OFFEN — Phase 1 muss entscheiden: BILDER ERFORDERLICH / BILDER NICHT ERFORDERLICH.\n\nWenn Bilder nötig sind, pro Asset dokumentieren:\n\n- sceneId\n- Zweck / eine Kernaussage\n- erwarteter Dateiname \`scene-XX-kurzname.png\`\n- was Bild-KI erzeugt\n- was Remotion später ergänzt\n- vollständiger englischer Premium-Prompt nach \`ki/BILDSTIL.md\`\n- Crop/Fokus/Layers, falls relevant\n\nKeine dekorativen Füllbilder.\n`,
  '03-caption/README.md': `# 03 — Captions & Social Copy\n\nPhase 1 legt Audio-unabhängige Basiscues an und vervollständigt \`platform-copy.md\`. Phase 3 ersetzt/justiert Subtitle-Cues mit realem Audio-Timing. Jeder gesprochene Inhalt bleibt vollständig abgedeckt; aktive Fenster kompakt halten.\n\n\`platform-copy.md\` enthält genau eine gemeinsame, direkt kopierbare Caption für YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat. Am Ende stehen genau fünf Hashtags. Keine plattformspezifischen Varianten. Regeln: \`ki/gehirn/PLATTFORMEN.md\`.\n`,
  '03-caption/platform-copy.md': `${title}\n\nWas ist deine Erfahrung damit? Schreib es in die Kommentare.\n\n#KI #KuenstlicheIntelligenz #Tech #DigitalWissen #Zukunft\n`,
  '05-export/README.md': `# 05 — Export\n\nPhase 3 legt hier reel-bezogene Smoke-Frames, Review-Renders und finale Exporte ab, sofern der reel-spezifische Vertrag keinen anderen Pfad festlegt. Ein gerendertes MP4 ist erst nach technischer und visueller Prüfung freigegeben.\n`,
  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nHier liegen \`PHASE-STATUS.md\`, \`reel.json\`, Szene-/Animationsplan, Assembly-Auftrag und Review-Checkliste. Ausführbarer TS/TSX-Code gehört **nicht** hierhin, sondern nach \`ki/src/reels/<slug>/\`.\n`,
  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1 — ChatGPT\n\n**Status:** OFFEN\n\nFertig erst mit finalem Skript + Copy-Fließtext, Szenen/Animationen, Bildentscheidung/Prompts/Manifest, Captions, Plattform-Copy, \`reel.json\`, ausführbarem Source unter \`ki/src/reels/<slug>/\`, Composition und fokussierten Checks.\n\n## Phase 2 — Mensch\n\n**Status:** WARTET AUF PHASE 1\n\nNur echtes Voiceover aus \`VOICEOVER-ZUM-KOPIEREN.txt\` erzeugen.\n\n## Phase 3 — Codex / Antigravity\n\n**Status:** WARTET AUF PHASE 2\n\nAudio integrieren, reales Timing, Tests/TypeScript, Smoke-Review, Final-Render und visuelle Freigabe.\n`,
};

for (const [relative, content] of Object.entries(files)) {
  await writeFile(resolve(reelRoot, relative), content, 'utf8');
}

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Pflicht: node scripts/check-ki-reel-folder-structure.mjs');
console.log('Phase 1 muss alles außer dem echten Audio vervollständigen.');
