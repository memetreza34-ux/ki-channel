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
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n\n## 3 Phasen\n\n1. **Phase 1 — Inhalt + Source:** Planung, Copy und ausführbare Remotion-Grundlage\n2. **Phase 2 — Voiceover:** reales Audio per verfügbarem Voice-Tool oder durch Nutzer/Mensch\n3. **Phase 3 — Codex/Antigravity:** Audio-Lock + Timeline + Review + Render + vollständiges Export-Paket\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/MASTER.md\`, \`ki/gehirn/AUDIO_PIPELINE.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`, \`ki/gehirn/PLATTFORMEN.md\`.\n\nAktueller Status: \`06-projektdateien/PHASE-STATUS.md\`.\n`,
  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPhase 1 legt \`voiceover.md\` und \`VOICEOVER-ZUM-KOPIEREN.txt\` an.\n\nVoiceover darf anschließend real mit einem verfügbaren Voice-/TTS-Tool oder durch Nutzer/Mensch erzeugt werden. Der finale lokale Master liegt am Pfad aus \`reel.json -> audio.targetFile\`. Bei Tool-Erzeugung \`audio-source.json\` als Provenance anlegen. Remote-URL ist niemals Render-Master. Details: \`ki/gehirn/AUDIO_PIPELINE.md\`.\n`,
  '02-bilder/README.md': `# 02 — Bilder\n\nPhase 1 entscheidet ausdrücklich: **BILDER ERFORDERLICH** oder **BILDER NICHT ERFORDERLICH**.\n\nBei Bildbedarf: \`ki/BILDSTIL.md\` anwenden, Prompts in \`image-prompts.md\`, Assets in \`asset-manifest.json\`. Präzise UI-Texte, Captions, Zahlen und Zustände bleiben Remotion-native.\n`,
  '02-bilder/image-prompts.md': `# Image Prompts\n\n**Status:** OFFEN — BILDER ERFORDERLICH / BILDER NICHT ERFORDERLICH entscheiden.\n\nBei Bedarf pro Asset: sceneId, Zweck, Dateiname, Begründung, vollständiger Prompt, Crop/Fokus/Layers. Keine dekorativen Füllbilder.\n`,
  '03-caption/README.md': `# 03 — Captions & Plattform-Copy\n\nPhase 1 legt Preview-Cues an. Phase 3 ersetzt sie durch echte Whisper-/Voice-Lock-Wortzeiten aus dem lokalen finalen Voiceover.\n\nKanonisches Layout aus \`ki/src/reels/captionSafe.ts\`: bottom 250px, 104px horizontal, max 860px, max 2 Zeilen, Glass-/Blur-Overlay, kein separater Footer.\n\n\`FINAL-CAPTION.txt\` ist für den Export Pflicht.\n`,
  '03-caption/platform-copy.md': `# Plattform-Copy — ${title}\n\n**Status:** OFFEN\n\n## Neutraler Kerntitel\n${title}\n\n## YouTube Shorts\n**Titel:**\n\n**Beschreibung:**\n\n**Optionale Keywords/Hashtags:**\n\n**Eigenes Cover nötig:** JA — Hero-/Contact-Sheet-Review\n\n## Instagram Reels\n**Caption:**\n\n**Optionaler CTA:**\n\n## TikTok\n**Caption:**\n\n**Optionaler CTA:**\n\n## Facebook Reels\n**Begleittext:**\n\n## Snapchat\n**Kurztext / nicht genutzt:**\n\n---\nKein Transcript-Dump, kein Fake-Hype, keine fachliche Änderung.\n`,
  '03-caption/FINAL-CAPTION.txt': `OFFEN — vor Final-Export durch die publish-ready Hauptcaption ersetzen.\n`,
  '04-pdf/README.md': `# 04 — PDF\n\nOptional. Nur reel-bezogene PDF-Quellen/Exports.\n`,
  '05-export/README.md': `# 05 — Final Export\n\nKanonischer Endpunkt eines fertigen Reels. Ein Render anderswo ist Arbeitsware.\n\nPflichtpaket:\n- \`<compositionId>.mp4\`\n- \`<compositionId>-cover.png\`\n- \`<compositionId>-caption.txt\`\n- \`<compositionId>-export-manifest.json\`\n\nVor Render lokales Audio vorbereiten:\n\n\`node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>\`\n\nNach finalem Render:\n\n\`node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>\`\n\`node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>\`\n\nDer Finalizer führt Entertainment-, Voice-Lock-, Motion-, ggf. Source-Isolation- und Video-/Audio-Gates erneut aus.\n`,
  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nHier liegen Status, \`reel.json\`, Szene-/Animationsplan, Assembly-Auftrag, \`ENTERTAINMENT-REVIEW.md\`, \`MOTION-READABILITY-REVIEW.md\` und Review-Checkliste. Ausführbarer Source gehört nach \`ki/src/reels/<slug>/\`.\n`,
  '06-projektdateien/MOTION-READABILITY-REVIEW.md': `# Motion Readability Review — ${title}\n\nNach echtem Render bei 1x ausfüllen.\n\nSTATUS: PENDING\nLIGHT_FIRST: PENDING\nDARK_FULL_FRAME_SCENES: 0\nDARK_EXCEPTION_APPROVED: NO\nTOO_FAST_BEATS: 0\nSIMULTANEOUS_INFO_OVERLOADS: 0\nMIN_CRITICAL_HOLD_FRAMES: 12\nPOST_RENDER_1X_REVIEW: PENDING\n\n## Timing-Audit\n- Sprecherphrase\n- Reveal-Dauer\n- Settle\n- lesbarer Hold\n- nächster Trigger\n- bei 1x ohne Pause verständlich: JA/NEIN\n\nNach Korrekturschleife auf PASS setzen und validieren.\n`,
  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1 — Inhalt + Source\n**Status:** OFFEN\n\nFertig erst mit Skript, Szenen/Animationen, Assets, Captions, Plattform-Copy, \`FINAL-CAPTION.txt\`, \`reel.json\`, ausführbarem Source, Composition und fokussierten Checks. Motion-Review-Datei muss vorhanden sein; PASS erst nach echtem Render.\n\n## Phase 2 — Voiceover\n**Status:** WARTET AUF PHASE 1\n\nReales Audio per Tool oder Nutzer/Mensch. Wenn es im selben Auftrag real erzeugt wurde, direkt mit lokalem Master in Phase 3 weiter.\n\n## Phase 3 — Codex / Antigravity\n**Status:** WARTET AUF LOKALES AUDIO\n\nWhisper/Voice-Lock → Szenen/Dauer → prepare-reel-audio → Tests → Smoke/Contact Sheet → 1x Motion-Review → Final-Render → Finalizer → Export-Package-Validator → exportiertes Video ansehen/anhören.\n\nErst nach \`FINAL VIDEO READY — EXPORT PACKAGE READY\` fertig.\n`,
};

for (const [relative, content] of Object.entries(files)) {
  await writeFile(resolve(reelRoot, relative), content, 'utf8');
}

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Pflicht: node scripts/check-ki-reel-folder-structure.mjs');
console.log('Phase 1 baut Inhalt + Source. Voiceover darf danach real per Tool oder Mensch entstehen.');
console.log('Finale Reel-Abgabe endet erst nach Voice-Lock + Motion-Readability + Audio-Gate + vollständigem 05-export-Paket.');
