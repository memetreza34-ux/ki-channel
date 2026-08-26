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
const iso = (date) => date.toISOString().slice(0,10);
const addDays = (date, days) => { const copy = new Date(date); copy.setUTCDate(copy.getUTCDate()+days); return copy; };
const weekBounds = (date) => {
  const utc = new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate(),12));
  const weekday = utc.getUTCDay();
  const monday = addDays(utc,weekday===0?-6:1-weekday);
  return {monday,sunday:addDays(monday,6)};
};
const slugify = (title) => title.trim().replace(/[–—]/g,'-').replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-+|-+$/g,'').replace(/-+/g,'-');

const title = rawTitle.trim();
const slug = slugify(title);
if (!slug) throw new Error('Kein gültiger Ordnername aus Titel erzeugbar.');
const {monday,sunday} = weekBounds(parseDate(rawDate));
const weekName = `${iso(monday)}_bis_${iso(sunday)}`;
const weekRoot = resolve('ki','reels',weekName);
await mkdir(weekRoot,{recursive:true});

const existing = await readdir(weekRoot,{withFileTypes:true});
const used = existing.filter((entry)=>entry.isDirectory()).map((entry)=>Number(entry.name.match(/^(\d{2})_/)?.[1])).filter(Number.isFinite);
let index=1;
while (used.includes(index)) index++;
if (index>99) throw new Error(`${weekName} enthält bereits 99 Reel-Slots.`);

const reelName = `${String(index).padStart(2,'0')}_${slug}`;
const reelRoot = resolve(weekRoot,reelName);
const dirs = ['01-script-audio','02-bilder','03-caption','04-pdf','05-export','06-projektdateien'];
await mkdir(reelRoot,{recursive:false});
for (const dir of dirs) {
  await mkdir(resolve(reelRoot,dir),{recursive:false});
  await writeFile(resolve(reelRoot,dir,'.gitkeep'),'Verbindlicher Produktionsordner — nicht entfernen.\n','utf8');
}

const files = {
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n\n## Produktionsphasen\n\n1. **Phase 1:** Inhalt + Source + exakter Satz→Szene-Plan + semantische SFX-Events\n2. **Phase 2:** reales Voiceover\n3. **Phase 3:** Pause-Kompression → lokales Forced Alignment → Voice/Scene-Lock → automatische CC0-SFX-Auswahl → Tests → Render → Review → Export\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/AUDIO_PIPELINE.md\`, \`ki/gehirn/FORCED_ALIGNMENT.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`.\n`,
  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPflicht in Phase 1:\n\n- \`VOICEOVER-ZUM-KOPIEREN.txt\` = nur exakter Sprechertext\n- \`SCENE-VOICE-MAP.json\` = jeder exakte Satz bekommt vor Audio-Lock eine Szene\n\nNach echtem Voiceover erzeugt Phase 3 lokal \`WORD-TIMINGS.json\` über Forced Alignment. Kein Whisper-Raten und kein fuzzy matching als Standard.\n\nEin-Kommando-Sync nach vorhandenem Audio:\n\n\`node ki/scripts/align-reel-local.mjs <reel-package-dir>\`\n`,
  '01-script-audio/SCENE-VOICE-MAP.json': `{
  "version": 1,
  "mappingStatus": "DRAFT",
  "voiceoverFile": "01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt",
  "captionFile": "03-caption/subtitle-cues.json",
  "rules": {
    "sceneStartAnchor": "FIRST_MAPPED_WORD",
    "sceneStartToleranceFrames": 4,
    "firstSceneLeadFrames": 8,
    "captionGroupingMaySplitSentences": true,
    "sceneTextMustReconstructExactly": true,
    "sceneOrderMustFollowVoiceOrder": true
  },
  "sentences": []
}
`,
  '02-bilder/README.md': `# 02 — Bilder\n\nPhase 1 entscheidet: **BILDER ERFORDERLICH** oder **BILDER NICHT ERFORDERLICH**. Präzise UI-Texte, Captions, Zahlen und Zustände bleiben Remotion-native.\n`,
  '02-bilder/image-prompts.md': `# Image Prompts\n\n**Status:** OFFEN — BILDER ERFORDERLICH / BILDER NICHT ERFORDERLICH entscheiden.\n`,
  '03-caption/README.md': `# 03 — Captions & Plattform-Copy\n\nPreview-Cues sind nur Planung. Finale Cues werden automatisch aus \`WORD-TIMINGS.json\` erzeugt.\n\nPflicht: Satz→Szene aus \`SCENE-VOICE-MAP.json\`, Start/Ende aus echtem lokalen Forced Alignment.\n\nShared Layout: bottom 250px, 104px horizontal, max 860px, max 2 Zeilen, Glass-/Blur-Overlay, kein separater Footer.\n`,
  '03-caption/platform-copy.md': `# Plattform-Copy — ${title}\n\n**Status:** OFFEN\n\n## Neutraler Kerntitel\n${title}\n\n## YouTube Shorts\n**Titel:**\n\n**Beschreibung:**\n\n**Eigenes Cover nötig:** JA\n\n## Instagram Reels\n**Caption:**\n\n## TikTok\n**Caption:**\n\n## Facebook Reels\n**Begleittext:**\n`,
  '03-caption/FINAL-CAPTION.txt': `OFFEN — vor Final-Export durch die publish-ready Hauptcaption ersetzen.\n`,
  '04-pdf/README.md': `# 04 — PDF\n\nOptional. Nur reel-bezogene PDF-Quellen/Exports.\n`,
  '05-export/README.md': `# 05 — Final Export\n\nVor Production-Render müssen lokale Forced-Alignment-, Scene-Voice-, Voice-Lock- und — wenn aktiviert — SFX-Gates bestehen.\n\n\`node ki/scripts/prepare-reel-render.mjs <reel-package-dir>\`\n\nNach finalem MP4 + echtem 1x-Review:\n\n\`node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>\`\n\`node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>\`\n`,
  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nStatus, \`reel.json\`, Szene-/Animationsplan, SFX-Events, Review- und Assembly-Dateien. Ausführbarer Source liegt unter \`ki/src/reels/<slug>/\`.\n\n\`reel.json.sceneVoiceMap.file\` muss auf \`01-script-audio/SCENE-VOICE-MAP.json\` zeigen.\n\nWenn SFX aktiviert sind: \`sfx-events.json\` enthält nur semantische/visuelle Anker. \`sfx-resolved.json\` wird nach finalem Scene-Lock automatisch aus der lokalen CC0-Bibliothek erzeugt.\n`,
  '06-projektdateien/sfx-events.json': `{
  "version": 1,
  "status": "DRAFT",
  "selectionMode": "AUTO_CC0_DETERMINISTIC",
  "events": []
}
`,
  '06-projektdateien/sfx-resolved.json': `{
  "version": 1,
  "status": "PENDING_LOCAL_CC0_RESOLUTION",
  "libraryStatus": "REQUIRES_PUBLIC_REEL_SFX_INDEX",
  "events": []
}
`,
  '06-projektdateien/SFX-PLAN.md': `# SFX-Plan — ${title}\n\n## Grundregel\n\nNur visuelle/semantische Events definieren. Keine konkreten Sounddateien manuell festnageln.\n\nNach finalem Szenen-Timing wählt \`resolve-reel-sfx.mjs\` automatisch einen passenden Sound aus der lokalen CC0-Bibliothek anhand Rolle, Keywords und Dauer.\n\nErlaubte Auto-Lizenz: **CC0-1.0 בלבד**. Voiceover hat Lautstärke-Priorität.\n\nBeispiel-Event:\n\n\`{\"id\":\"sfx01\",\"sceneId\":\"scene1\",\"anchor\":{\"type\":\"SCENE_OFFSET\",\"frame\":24},\"roles\":[\"ui-click\"],\"keywords\":[\"click\"],\"preferredDurationSeconds\":0.18,\"volume\":0.09}\`\n`,
  '06-projektdateien/MOTION-READABILITY-REVIEW.md': `# Motion Readability Review — ${title}\n\nNach dem **exakten finalen MP4** bei 1x ausfüllen.\n\nSTATUS: PENDING\nLIGHT_FIRST: PENDING\nDARK_FULL_FRAME_SCENES: 0\nDARK_EXCEPTION_APPROVED: NO\nTOO_FAST_BEATS: 0\nSIMULTANEOUS_INFO_OVERLOADS: 0\nMIN_CRITICAL_HOLD_FRAMES: 12\nPOST_RENDER_1X_REVIEW: PENDING\nREVIEWED_VIDEO_SHA256: PENDING\nREVIEWED_VIDEO_DURATION_SECONDS: PENDING\n`,
  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1\n**Status:** OFFEN\n\nPflicht: finaler Sprechertext + ausgefüllte \`SCENE-VOICE-MAP.json\` + SFX-Events für echte visuelle Beats.\n\n## Phase 2 — Voiceover\n**Status:** WARTET AUF PHASE 1\n\n## Phase 3\n**Status:** WARTET AUF LOKALES AUDIO\n\n\`node ki/scripts/align-reel-local.mjs <reel-package-dir>\` → Pause-Kompression → \`WORD-TIMINGS.json\` → finale Captions/Szenen → automatische CC0-SFX-Auswahl → Gates. Danach committen → Pre-Render-Gate → Tests → Render → 1x Review → Finalizer.\n`,
};

for (const [relative,content] of Object.entries(files)) await writeFile(resolve(reelRoot,relative),content,'utf8');

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Pflicht: VOICEOVER-ZUM-KOPIEREN.txt + SCENE-VOICE-MAP.json + semantische SFX-Events.');
console.log('Nach realem Audio: node ki/scripts/align-reel-local.mjs <reel-package-dir>');
console.log('Production-Render erst nach lokalem Forced Alignment + VOICE_LOCKED + SFX-Gate (wenn aktiviert).');
