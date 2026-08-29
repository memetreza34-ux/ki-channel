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
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n\n## Produktionsphasen\n\n1. **Phase 1:** Inhalt + Source + exakter Satz→Szene-Plan + semantische SFX-Events + Visual-Entscheidung pro Szene. Neues Standard-Reel: 60–75 Sekunden tatsächliche Voice-Locked-Laufzeit, bevorzugt 150–175 Wörter, bis 190 Wörter ohne Sonderfreigabe.\n2. **Phase 2:** reales Voiceover\n3. **Phase 3:** Pause-Kompression → lokales Forced Alignment → Voice/Scene-Lock → 60–75-s-Dauergate → automatische CC0-SFX-Auswahl → externe Visuals lokal auflösen → vollständige Repo-/Motion-/Remotion-Gates → Remotion-Roh-Render → Social-Audio-Master → 1x Review von Caption, Zoom/Kamera, SFX und Visuals → Export\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/AUDIO_PIPELINE.md\`, \`ki/gehirn/FORCED_ALIGNMENT.md\`, \`ki/gehirn/VISUAL_ASSETS.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`.\n`,
  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPflicht in Phase 1:\n\n- \`VOICEOVER-ZUM-KOPIEREN.txt\` = nur exakter Sprechertext\n- neues Standard-Reel: 60–75 Sekunden tatsächliche Voice-Locked-Laufzeit\n- bevorzugt 150–175 Wörter; bis 190 Wörter ohne dokumentierte Ausnahme\n- \`reel.json.scriptBudget.targetMinSeconds = 60\`, \`targetMaxSeconds = 75\`\n- \`SCENE-VOICE-MAP.json\` = jeder exakte Satz bekommt vor Audio-Lock eine Szene\n\nNach echtem Voiceover erzeugt Phase 3 lokal \`WORD-TIMINGS.json\` über Forced Alignment. Kein Whisper-Raten und kein fuzzy matching als Standard.\n\nEin-Kommando-Sync nach vorhandenem Audio:\n\n\`node ki/scripts/align-reel-local.mjs <reel-package-dir>\`\n`,
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
  '02-bilder/README.md': `# 02 — Bilder\n\nPhase 1 entscheidet pro Szene zwischen \`NATIVE_UI\`, \`OFFICIAL_SOURCE_CARD\`, \`WIKIMEDIA_COMMONS\` oder \`GITHUB_RAW\`.\n\nRichtwert: ungefähr 70–80 % Remotion-native Visuals und 20–30 % echte Bilder/Screens; typischerweise 1–2 starke externe Visual-Momente pro Reel. Präzise UI-Texte, Captions, Zahlen und Zustände bleiben Remotion-native.\n\nExterne Visuals müssen vor Render lokal aufgelöst, lizenzgeprüft und per SHA256 gebunden werden.\n\nSiehe \`ki/gehirn/VISUAL_ASSETS.md\`.\n`,
  '02-bilder/image-prompts.md': `# Image / Asset Prompts\n\n**Status:** OFFEN\n\nFür jede Szene festlegen:\n- native UI oder externes Asset?\n- wenn extern: Suchbegriff, Zweck und gewünschte Orientierung\n- kein Google-Suchergebnis als Lizenznachweis\n- Kamera-/Zoom-Idee nur mit Erklär- oder Fokusnutzen\n`,
  '03-caption/README.md': `# 03 — Captions & Plattform-Copy\n\nPreview-Cues sind nur Planung. Finale Cues werden automatisch aus \`WORD-TIMINGS.json\` erzeugt.\n\nPflicht: Satz→Szene aus \`SCENE-VOICE-MAP.json\`, Start/Ende aus echtem lokalen Forced Alignment.\n\nShared Layout: bottom 250px, 104px horizontal, max 860px, max 2 Zeilen, Glass-/Blur-Overlay, kein separater Footer.\n`,
  '03-caption/platform-copy.md': `# Plattform-Copy — ${title}\n\n**Status:** OFFEN\n\n## Neutraler Kerntitel\n${title}\n\n## YouTube Shorts\n**Titel:**\n\n**Beschreibung:**\n\n**Eigenes Cover nötig:** JA\n\n## Instagram Reels\n**Caption:**\n\n## TikTok\n**Caption:**\n\n## Facebook Reels\n**Begleittext:**\n`,
  '03-caption/FINAL-CAPTION.txt': `OFFEN — vor Final-Export durch die publish-ready Hauptcaption ersetzen.\n`,
  '04-pdf/README.md': `# 04 — PDF\n\nOptional. Nur reel-bezogene PDF-Quellen/Exports.\n`,
  '05-export/README.md': `# 05 — Final Export\n\nVor Production-Render müssen Script-Budget-, 60–75-s-Dauer-, lokale Forced-Alignment-, Scene-Voice-, Voice-Lock-, SFX- und Visual-Gates bestehen, sofern die jeweiligen Systeme aktiviert sind.\n\n\`node ki/scripts/prepare-reel-render.mjs <reel-package-dir>\`\n\nNach dem Remotion-Roh-Render zuerst den kompletten Voice+SFX-Mix mastern:\n\n\`node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>\`\n\`node ki/scripts/validate-social-audio-master.mjs <mastered-render.mp4>\`\n\nDann **genau das gemasterte MP4** bei 1x ansehen/anhören. Caption-Sync, Kamera/Zoom, SFX, Voice-Priorität, externe Visuals und Gesamtmix müssen im Review explizit PASS sein. Erst danach:\n\n\`node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <mastered-render.mp4>\`\n\`node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>\`\n`,
  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nStatus, \`reel.json\`, Szene-/Animationsplan, SFX-Events, Visual-Assets, Review- und Assembly-Dateien. Ausführbarer Source liegt unter \`ki/src/reels/<slug>/\`.\n\n\`reel.json.sceneVoiceMap.file\` muss auf \`01-script-audio/SCENE-VOICE-MAP.json\` zeigen. Für neue Reels \`reel.json.scriptBudget\` auf 150–175 Zielwörter / 190 Hard-Limit und 60–75 Sekunden Zieldauer setzen.\n\nWenn SFX aktiviert sind: \`sfx-events.json\` enthält nur semantische/visuelle Anker. \`sfx-resolved.json\` wird nach finalem Scene-Lock automatisch aus der lokalen CC0-Bibliothek erzeugt.\n\nWenn Visuals aktiviert sind: \`visual-assets.json\` ist der Quellvertrag; \`visual-assets-resolved.json\` wird lokal durch \`resolve-reel-visual-assets.mjs\` erzeugt und per SHA256 validiert.\n`,
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
  '06-projektdateien/SFX-PLAN.md': `# SFX-Plan — ${title}\n\n## Grundregel\n\nNur visuelle/semantische Events definieren. Keine konkreten Sounddateien manuell festnageln.\n\nNach finalem Szenen-Timing wählt \`resolve-reel-sfx.mjs\` automatisch einen passenden Sound aus der lokalen CC0-Bibliothek anhand Rolle, Keywords und Dauer.\n\nErlaubte Auto-Lizenz: **CC0-1.0 only**. Voiceover hat Lautstärke-Priorität. Der finale 1x-Review muss SFX tatsächlich anhören und \`SFX_1X_REVIEW\` sowie \`VOICE_PRIORITY_OVER_SFX\` explizit freigeben.\n\nBeispiel-Event:\n\n\`{\"id\":\"sfx01\",\"sceneId\":\"scene1\",\"anchor\":{\"type\":\"SCENE_OFFSET\",\"frame\":24},\"roles\":[\"ui-click\"],\"keywords\":[\"click\"],\"preferredDurationSeconds\":0.18,\"volume\":0.09}\`\n`,
  '06-projektdateien/visual-assets.json': `{
  "version": 1,
  "status": "DRAFT",
  "rules": {
    "nativeFirst": true,
    "remoteRenderMediaAllowed": false,
    "googleImageSearchAsLicenseAuthority": false,
    "externalBinariesMustResolveLocally": true
  },
  "assets": []
}
`,
  '06-projektdateien/visual-assets-resolved.json': `{
  "version": 2,
  "status": "PENDING_LOCAL_VISUAL_RESOLUTION",
  "assets": []
}
`,
  '06-projektdateien/VISUAL-PLAN.md': `# Visual-Plan — ${title}\n\n## Phase-1-Pflicht\n\nJede Szene bekommt eine bewusste Visual-Entscheidung:\n\n- \`NATIVE_UI\`\n- \`OFFICIAL_SOURCE_CARD\`\n- \`WIKIMEDIA_COMMONS\`\n- \`GITHUB_RAW\`\n\nRichtwert: 70–80 % native Visuals, 20–30 % echte Bilder/Screens; normalerweise 1–2 starke externe Visual-Momente. Kameraeffekte wie Push, Pan, Focus, Parallax und Scan nur mit Erklär-/Fokusnutzen, nicht als Effekt-Spam.\n\nFür Wikimedia können im Asset optional \`selection.minimumLongEdge\`, \`selection.minimumShortEdge\`, \`selection.preferredOrientation\`, \`selection.mediaIntent\`, \`selection.preferPublicDomainOrCC0\` und \`selection.candidateLimit\` gesetzt werden.\n\nVor Render:\n\n\`node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>\`\n\`node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>\`\n`,
  '06-projektdateien/MOTION-READABILITY-REVIEW.md': `# Motion Readability Review — ${title}\n\nNach dem **exakten gemasterten Final-MP4** bei 1x ausfüllen. Nicht den ungemasterten Roh-Render freigeben.\n\nSTATUS: PENDING\nLIGHT_FIRST: PENDING\nDARK_FULL_FRAME_SCENES: 0\nDARK_EXCEPTION_APPROVED: NO\nTOO_FAST_BEATS: 0\nSIMULTANEOUS_INFO_OVERLOADS: 0\nMIN_CRITICAL_HOLD_FRAMES: 12\nPOST_RENDER_1X_REVIEW: PENDING\nCAPTION_SYNC_1X_REVIEW: PENDING\nCAMERA_EFFECTS_1X_REVIEW: PENDING\nAUDIO_MIX_1X_REVIEW: PENDING\nSFX_1X_REVIEW: PENDING\nVOICE_PRIORITY_OVER_SFX: PENDING\nVISUAL_ASSETS_1X_REVIEW: PENDING\nREVIEWED_VIDEO_SHA256: PENDING\nREVIEWED_VIDEO_DURATION_SECONDS: PENDING\n`,
  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1\n**Status:** OFFEN\n\nPflicht: finaler Sprechertext für 60–75 Sekunden tatsächliche Voice-Locked-Laufzeit, bevorzugt 150–175 Wörter (bis 190 ohne Sonderfreigabe) + ausgefüllte \`SCENE-VOICE-MAP.json\` + SFX-Events + Visual-Entscheidung pro Szene.\n\n## Phase 2 — Voiceover\n**Status:** WARTET AUF PHASE 1\n\n## Phase 3\n**Status:** WARTET AUF LOKALES AUDIO\n\n\`node ki/scripts/align-reel-local.mjs <reel-package-dir>\` → Pause-Kompression → \`WORD-TIMINGS.json\` → finale Captions/Szenen → echte 60–75-s-Dauer prüfen → automatische CC0-SFX-Auswahl. Danach externe Visuals lokal auflösen/validieren → committen → Script-Budget-/Pre-Render-Gate → vollständige Repo-/Motion-/Remotion-Gates → Roh-Render → −16-LUFS-Social-Master → exakter 1x Review des gemasterten MP4 inklusive Caption, Kamera/Zoom, SFX, Voice-Priorität und Visuals → Finalizer.\n`,
};

for (const [relative,content] of Object.entries(files)) await writeFile(resolve(reelRoot,relative),content,'utf8');

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Phase 1: 60–75 Sekunden Voice-Locked-Ziel, bevorzugt 150–175 Wörter, 190 Wörter Hard-Limit ohne dokumentierte Ausnahme.');
console.log('Pflicht: VOICEOVER-ZUM-KOPIEREN.txt + SCENE-VOICE-MAP.json + SFX-Events + Visual-Asset-Entscheidung.');
console.log('Nach realem Audio: node ki/scripts/align-reel-local.mjs <reel-package-dir>');
console.log('Vor Render externe Visuals lokal auflösen: node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>');
console.log('Nach Roh-Render: node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>');
console.log('Final-Review: Caption-Sync, Zoom/Kamera, SFX, Voice-Priorität und Visuals auf dem gemasterten MP4 prüfen.');
console.log('Final-Review und Finalizer immer auf dem gemasterten MP4 ausführen.');