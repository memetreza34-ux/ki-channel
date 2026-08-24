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
const dirs = ['01-script-audio','02-bilder','03-caption','04-pdf','05-export','06-projektdateien'];
await mkdir(reelRoot, {recursive: false});
for (const dir of dirs) {
  await mkdir(resolve(reelRoot, dir), {recursive: false});
  await writeFile(resolve(reelRoot, dir, '.gitkeep'), 'Verbindlicher Produktionsordner — nicht entfernen.\n', 'utf8');
}

const files = {
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n\n## 3 Phasen\n\n1. **Phase 1 — Inhalt + Source:** Planung, Copy und ausführbare Remotion-Grundlage\n2. **Phase 2 — Voiceover:** reales Audio per verfügbarem Voice-Tool oder durch Nutzer/Mensch\n3. **Phase 3 — Codex/Antigravity:** Audio-Lock + Timeline + Review + Render + vollständiges Export-Paket\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/MASTER.md\`, \`ki/gehirn/AUDIO_PIPELINE.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`, \`ki/gehirn/PLATTFORMEN.md\`.\n`,
  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPhase 1 legt \`voiceover.md\` und \`VOICEOVER-ZUM-KOPIEREN.txt\` an.\n\nVoiceover darf real mit einem verfügbaren Voice-/TTS-Tool oder durch Nutzer/Mensch erzeugt werden. Finaler lokaler Master: \`reel.json -> audio.targetFile\`. Bei Tool-Erzeugung \`audio-source.json\` als Provenance. Remote-URL ist niemals Render-Master.\n`,
  '02-bilder/README.md': `# 02 — Bilder\n\nPhase 1 entscheidet: **BILDER ERFORDERLICH** oder **BILDER NICHT ERFORDERLICH**. Präzise UI-Texte, Captions, Zahlen und Zustände bleiben Remotion-native.\n`,
  '02-bilder/image-prompts.md': `# Image Prompts\n\n**Status:** OFFEN — BILDER ERFORDERLICH / BILDER NICHT ERFORDERLICH entscheiden.\n`,
  '03-caption/README.md': `# 03 — Captions & Plattform-Copy\n\nPhase 1 legt Preview-Cues an. Phase 3 ersetzt sie durch echte Whisper-/Voice-Lock-Wortzeiten aus dem lokalen finalen Voiceover.\n\nShared Layout: bottom 250px, 104px horizontal, max 860px, max 2 Zeilen, Glass-/Blur-Overlay, kein separater Footer.\n`,
  '03-caption/platform-copy.md': `# Plattform-Copy — ${title}\n\n**Status:** OFFEN\n\n## Neutraler Kerntitel\n${title}\n\n## YouTube Shorts\n**Titel:**\n\n**Beschreibung:**\n\n**Eigenes Cover nötig:** JA\n\n## Instagram Reels\n**Caption:**\n\n## TikTok\n**Caption:**\n\n## Facebook Reels\n**Begleittext:**\n\n## Snapchat\n**Kurztext / nicht genutzt:**\n`,
  '03-caption/FINAL-CAPTION.txt': `OFFEN — vor Final-Export durch die publish-ready Hauptcaption ersetzen.\n`,
  '04-pdf/README.md': `# 04 — PDF\n\nOptional. Nur reel-bezogene PDF-Quellen/Exports.\n`,
  '05-export/README.md': `# 05 — Final Export\n\nVor Production-Render:\n\n\`node ki/scripts/prepare-reel-render.mjs <reel-package-dir>\`\n\nNach finalem Render und echtem 1x-Review:\n\n\`node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>\`\n\`node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>\`\n\nPflichtpaket: MP4 + Cover + Caption + Manifest.\n`,
  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nStatus, \`reel.json\`, Szene-/Animationsplan, Entertainment-, Motion-Readability-, Assembly- und Review-Dateien. Ausführbarer Source nach \`ki/src/reels/<slug>/\`.\n`,
  '06-projektdateien/MOTION-READABILITY-REVIEW.md': `# Motion Readability Review — ${title}\n\nNach dem **exakten finalen MP4** bei 1x ausfüllen.\n\nSTATUS: PENDING\nLIGHT_FIRST: PENDING\nDARK_FULL_FRAME_SCENES: 0\nDARK_EXCEPTION_APPROVED: NO\nTOO_FAST_BEATS: 0\nSIMULTANEOUS_INFO_OVERLOADS: 0\nMIN_CRITICAL_HOLD_FRAMES: 12\nPOST_RENDER_1X_REVIEW: PENDING\nREVIEWED_VIDEO_SHA256: PENDING\nREVIEWED_VIDEO_DURATION_SECONDS: PENDING\n\nValidator:\n\n\`node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir> <reviewed-video.mp4>\`\n`,
  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1 — Inhalt + Source\n**Status:** OFFEN\n\n## Phase 2 — Voiceover\n**Status:** WARTET AUF PHASE 1\n\nReales Audio per Tool oder Nutzer/Mensch.\n\n## Phase 3 — Codex / Antigravity\n**Status:** WARTET AUF LOKALES AUDIO\n\nVoice-Lock → finale Szenen/Dauer → \`prepare-reel-render.mjs\` → Tests → Render → 1x Review mit SHA256 → Finalizer → Export-Package-Validator.\n\nErst nach \`FINAL VIDEO READY — EXPORT PACKAGE READY\` fertig.\n`,
};

for (const [relative, content] of Object.entries(files)) {
  await writeFile(resolve(reelRoot, relative), content, 'utf8');
}

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Pflicht: node scripts/check-ki-reel-folder-structure.mjs');
console.log('Production-Render erst nach finalem Voice-Lock + prepare-reel-render.mjs.');
