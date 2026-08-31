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
const selectedDate = parseDate(rawDate);
const publishDate = iso(selectedDate);
const {monday,sunday} = weekBounds(selectedDate);
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
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n**Publish-Date:** ${publishDate}\n\n## Produktionsphasen\n\n1. **Phase 1:** Inhalt + Source + Scene-Voice-Map + Story-Arc + mindestens 15 Visual Beats + LEVEL-UP-PLAN v2 + semantische SFX + Visual-/Brand-/Proof-/Real-Media-Entscheidung. Standard-Reel: 60–75 s Voice-Locked, bevorzugt 150–175 Wörter, 190 Hard-Limit.\n2. **Phase 2:** Voiceover ausschließlich durch den Nutzer.\n3. **Phase 3:** Pause-Kompression → Forced Alignment → Word-/Phrase-Lock → finale Captions/Szenen → SFX/Visuals lokal auflösen → Render → Social-Master → echter 1x Review.\n\nVerbindlich: REPO-STATE.md, ki/gehirn/STORYTELLING_MOTION.md, ki/gehirn/LEVEL_UP_STANDARD.md, AUDIO_PIPELINE.md, FORCED_ALIGNMENT.md, VISUAL_ASSETS.md und PRODUKTIONSABLAUF.md.\n`,

  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPflicht in Phase 1:\n- VOICEOVER-ZUM-KOPIEREN.txt = exakter Sprechertext\n- 60–75 s Voice-Locked-Ziel\n- bevorzugt 150–175 Wörter, Hard-Limit 190\n- SCENE-VOICE-MAP.json = exakte Satz→Szene-Zuordnung\n\nPhase 2 bleibt ausschließlich Nutzer-Audio. Agenten erzeugen oder laden kein Produktions-Voiceover.\n\nNach echtem Nutzer-Audio erzeugt Phase 3 WORD-TIMINGS.json. Große Brand-/Zahl-/Datums-/Status-Reveals werden danach an echte Wörter/Phrasen gekoppelt; sentenceId + progress ist nur Fallback.\n`,

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

  '02-bilder/README.md': `# 02 — Bilder / Videos / Brand Assets\n\nBrand-/Proof-Reihenfolge für aktuelle Markenstories:\n1. offizielles Logo/Wordmark oder echte Produkt-UI, wenn rechtlich/provenance-seitig sauber;\n2. echter offizieller Source-/Help-/Docs-Crop;\n3. reales Bild oder kurze reale B-Roll, wenn sie den Claim besser trägt;\n4. typografischer Markenname als sauberer Fallback;\n5. Funktionsicons nur für Funktionen — niemals als Fake-Logo.\n\nNormalziel: mindestens zwei reale/official Visual-Momente pro branded/current-news Reel oder dokumentierte Ausnahme. Externe Medien vor Render lokal auflösen, Lizenz/Provenance dokumentieren und SHA256 binden. Keine Render-Time-Remote-Medien.\n`,

  '02-bilder/image-prompts.md': `# Image / Video / Asset Prompts\n\n**Status:** OFFEN\n\nPro Szene festlegen:\n- native Motion, echte Brand/UI/Source, reales Bild oder reales Video?\n- welcher Claim wird bewiesen?\n- welche Marke darf nicht durch ein generisches Icon ersetzt werden?\n- welcher Crop/Highlight/Zoom unterstützt den Proof?\n- ist echte Bewegung Teil des Claims? Dann Video/B-Roll bevorzugen.\n- keine Google-Bildsuche als Lizenznachweis.\n`,

  '03-caption/README.md': `# 03 — Captions & Plattform-Copy\n\nPreview-Cues sind Planung; finale Cues kommen aus WORD-TIMINGS.json.\n\nShared Default:\n- bottom 330 px\n- horizontal inset 76 px\n- max width 928 px\n- ca. 40 px Text\n- max 2 Zeilen\n- Ziel max 6 Wörter je sichtbarer Gruppe\n- Glass-/Blur-Overlay, kein Footer\n\nLange Sätze werden gruppiert statt auf Mini-Schrift verkleinert. Der Cover-Kandidat in der ersten Sekunde bleibt caption-frei.\n`,

  '03-caption/platform-copy.md': `# Plattform-Copy — ${title}\n\n**Status:** OFFEN\n\n## Neutraler Kerntitel\n${title}\n\n## YouTube Shorts\n**Titel:**\n\n**Beschreibung:**\n\n## Instagram Reels\n**Caption:**\n\n## TikTok\n**Caption:**\n\n## Facebook Reels\n**Begleittext:**\n`,

  '03-caption/FINAL-CAPTION.txt': `OFFEN — vor Final-Export durch die publish-ready Hauptcaption ersetzen.\n`,
  '04-pdf/README.md': `# 04 — PDF\n\nOptional. Nur reel-bezogene PDF-Quellen/Exports.\n`,

  '05-export/README.md': `# 05 — Final Export\n\nVor Production-Render: Struktur-, Script-Budget-, Storytelling-, Level-Up-, Dauer-, Alignment-, Scene-Voice-, Voice-Lock-, SFX- und Visual-Gates ausführen.\n\nLevel-Up:\nnode ki/scripts/validate-reel-level-up.mjs <reel-package-dir>\n\nDer in reel.json gesetzte coverTimeSeconds muss bei Level-Up-Reels in der ersten Sekunde liegen und auf einen sauberen Cover-Kandidaten zeigen.\n\nDanach normaler Render-, Social-Master- und exakter 1x-Review-Pfad. COVER_FRAME_READY, COVER_FRAME_CLEAN, BRAND_FIDELITY, REAL_PROOF_MOMENT, REAL_MEDIA_MIX, WORD_LOCKED_MAJOR_REVEALS, SCENE_DENSITY, NO_VISUAL_OVERLAP, MOTION_GRAMMAR_DIVERSITY, NO_CARD_DECK_FEEL, FULL_VERTICAL_STAGE_USE, MICRODETAILS_PHONE_READABLE und SFX_SEMANTIC_DENSITY dürfen nur am echten gemasterten MP4 auf PASS gesetzt werden.\n`,

  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nEnthält reel.json, Story-/Level-Up-/Visual-/SFX-Verträge und Reviews. Ausführbarer Source liegt unter ki/src/reels/<slug>/.\n\nNeue Reels ab 2026-09-01 benötigen LEVEL-UP-PLAN.json v2 und müssen validate-reel-level-up.mjs bestehen. Cover, Brand/Proof, Real-Media-Mix, Szenendichte und Overlap werden schon in Phase 1 geplant.\n`,

  '06-projektdateien/story-beats.json': `{
  "version": 1,
  "status": "DRAFT",
  "storyArc": ["HOOK", "PROBLEM", "PROOF", "CHANGE", "CONSEQUENCE", "PAYOFF"],
  "rules": {
    "minVisualBeats": 15,
    "maxStaticSeconds": 4.0,
    "everySpokenCoreClaimNeedsVisualReaction": true,
    "transitionMustHaveMeaning": true,
    "cameraMotionMustHaveMeaning": true,
    "sfxMustMatchVisibleEvent": true,
    "externalVisualTarget": "2_PLUS_PURPOSEFUL_REAL_OR_OFFICIAL_MOMENTS_WHEN_BRANDED",
    "nativeMotionTargetPercent": "FLEXIBLE_NATIVE_FIRST"
  },
  "beats": []
}
`,

  '06-projektdateien/STORY-PLAN.md': `# Story-Plan — ${title}\n\nPflicht vor Phase 2:\n- mindestens 15 konkrete Visual Beats\n- Hook/Proof/Consequence/Payoff\n- Cover-Kandidat innerhalb der ersten Sekunde\n- aktive Voiceover-Strecken entwickeln sich etwa alle 1,5–3,0 s sichtbar weiter\n- max. ca. 4,0 s praktisch unveränderter Hauptzustand\n- jede Szene mehrere sichtbare Zustände, nicht nur dieselbe Karte\n- wichtige Reveals nach Audio an Wörter/Phrasen locken\n- nicht mehr als zwei große Beats hintereinander mit derselben Card/Spring/Slide-Grammatik\n- mindestens eine räumliche/full-frame Hauptszene, wenn das Thema es erlaubt\n- ein primärer Fokus pro Moment; supporting details progressiv\n`,

  '06-projektdateien/LEVEL-UP-PLAN.json': `{
  "version": 2,
  "status": "DRAFT",
  "currentNewsBrandStory": true,
  "timingAuthority": "WORD_TIMINGS_AFTER_FORCED_ALIGNMENT",
  "coverHook": {
    "enabled": true,
    "candidateFrame": 18,
    "holdFrames": 15,
    "captionFree": true,
    "headlineRequired": true,
    "primarySubjectRequired": true,
    "coverMatchesStory": true
  },
  "brandMoments": [],
  "realProofMoments": [],
  "realMediaMix": {
    "minimumMoments": 2,
    "moments": [],
    "exceptionReason": "",
    "videoPreferredWhenMotionIsClaim": true
  },
  "majorReveals": [],
  "motionFamilies": [],
  "maxConsecutiveSameMajorGrammar": 2,
  "sceneDensity": {
    "targetMeaningfulChangeSecondsMin": 1.5,
    "targetMeaningfulChangeSecondsMax": 3.0,
    "maxPracticallyUnchangedSeconds": 4.0,
    "hardCutRequiredEveryChange": false
  },
  "overlapPolicy": {
    "onePrimaryFocusAtATime": true,
    "maxSupportingDetails": 2,
    "captionMayCoverCriticalVisual": false,
    "progressiveRevealRequired": true
  },
  "fullFrameSceneIds": [],
  "captionTarget": {"bottom":330,"horizontalInset":76,"maxWidth":928,"fontSize":40,"maxLines":2,"maxWordsPerGroup":6},
  "microdetails": {"minimumImportantFontPx":22,"progressiveReveal":true},
  "sfxDesign": {"semanticVisibleTriggerRequired":true,"voicePriorityRequired":true}
}
`,

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

  '06-projektdateien/SFX-PLAN.md': `# SFX-Plan — ${title}\n\nNur semantische sichtbare Events definieren. Mehr SFX nur bei mehr echten Visual Events. Voice bleibt dominant. Nach finalem Voice-/Scene-Lock SFX an echte Caption-/Word-Zeit synchronisieren und erst dann lokal CC0 auflösen.\n`,

  '06-projektdateien/visual-assets.json': `{
  "version": 1,
  "status": "DRAFT",
  "rules": {
    "nativeFirst": true,
    "remoteRenderMediaAllowed": false,
    "googleImageSearchAsLicenseAuthority": false,
    "externalBinariesMustResolveLocally": true,
    "genericIconMayImpersonateBrand": false,
    "realMediaMustHaveStoryPurpose": true
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

  '06-projektdateien/VISUAL-PLAN.md': `# Visual-Plan — ${title}\n\nFür branded/current-news Reels zuerst echte Brand-/Produkt-/Source-Fidelity planen. Normalziel: mindestens zwei reale/official Momente — Logo/Wordmark, echte UI, Source-Crop, reales Bild oder kurzes reales Video — sofern sinnvoll und sauber nutzbar. Eine SourceProofCard ersetzt einen echten Proof-Crop nicht automatisch.\n\nWenn Bewegung selbst Teil des Claims ist, echtes Video/B-Roll bevorzugen. Keine Remote-Medien im Render. Der gesamte 9:16-Bereich zwischen Headline und Caption-Safe-Zone ist aktive Bühne. Pro Moment ein primärer Fokus; Caption und wichtige Visuals dürfen nicht überlappen.\n`,

  '06-projektdateien/MOTION-READABILITY-REVIEW.md': `# Motion Readability Review — ${title}\n\nSTATUS: PENDING\nLIGHT_FIRST: PENDING\nDARK_FULL_FRAME_SCENES: 0\nTOO_FAST_BEATS: 0\nSIMULTANEOUS_INFO_OVERLOADS: 0\nMIN_CRITICAL_HOLD_FRAMES: 12\nPOST_RENDER_1X_REVIEW: PENDING\nCOVER_FRAME_READY: PENDING\nCOVER_FRAME_CLEAN: PENDING\nCAPTION_SYNC_1X_REVIEW: PENDING\nCAMERA_EFFECTS_1X_REVIEW: PENDING\nAUDIO_MIX_1X_REVIEW: PENDING\nSFX_1X_REVIEW: PENDING\nVOICE_PRIORITY_OVER_SFX: PENDING\nVISUAL_ASSETS_1X_REVIEW: PENDING\nSTORY_FLOW_1X_REVIEW: PENDING\nVISUAL_REACTION_1X_REVIEW: PENDING\nTRANSITIONS_PURPOSE_1X_REVIEW: PENDING\nSTATIC_STATE_OVER_LIMIT_VIOLATIONS: PENDING\nBRAND_FIDELITY: PENDING\nREAL_PROOF_MOMENT: PENDING\nREAL_MEDIA_MIX: PENDING\nNO_FAKE_BRAND_ICON: PENDING\nWORD_LOCKED_MAJOR_REVEALS: PENDING\nSCENE_DENSITY: PENDING\nNO_VISUAL_OVERLAP: PENDING\nMOTION_GRAMMAR_DIVERSITY: PENDING\nNO_CARD_DECK_FEEL: PENDING\nFULL_VERTICAL_STAGE_USE: PENDING\nMICRODETAILS_PHONE_READABLE: PENDING\nSFX_SEMANTIC_DENSITY: PENDING\nREVIEWED_VIDEO_SHA256: PENDING\nREVIEWED_VIDEO_DURATION_SECONDS: PENDING\n`,

  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1\n**Status:** OFFEN\n\nPflicht: Script + SCENE-VOICE-MAP + story-beats + LEVEL-UP-PLAN v2 + Cover-Plan + SFX + Visual-/Brand-/Proof-/Real-Media-Plan + Source. Vor Phase 2 Struktur-, Storytelling- und Level-Up-Validator real ausführen.\n\n## Phase 2\n**Status:** WARTET AUF PHASE 1\nNur Nutzer erstellt Produktions-Voiceover.\n\n## Phase 3\n**Status:** WARTET AUF LOKALES NUTZER-AUDIO\nNach Forced Alignment große Reveals an echte Wörter/Phrasen locken, SFX neu synchronisieren, lokale Visuals/SFX auflösen, rendern, mastern und exakt bei 1x prüfen. Cover-Frame, Szenendichte, Überlappungen und Real-Media-Mix werden am echten MP4 geprüft.\n`,
};

for (const [relative,content] of Object.entries(files)) await writeFile(resolve(reelRoot,relative),content,'utf8');

console.log(`KI-Reel angelegt: ${reelRoot}`);
console.log('Phase 1: 60–75 s Voice-Locked, bevorzugt 150–175 Wörter, Hard-Limit 190.');
console.log('Cover-first: fertiger Cover-Kandidat innerhalb Frame 0–30, mindestens 12 Frames sauber haltbar.');
console.log('Scene Density: sichtbare Entwicklung etwa alle 1,5–3,0 s, max. ca. 4,0 s praktisch unverändert.');
console.log('Real Media: bei branded/current-news normalerweise mindestens zwei purposeful real/official Momente oder dokumentierte Ausnahme.');
console.log('Overlap: ein primärer Fokus + höchstens zwei unterstützende Details; Caption nie über kritischem Visual.');
console.log('Level-Up: Brand Fidelity + Real Proof + Word/Phrase Lock + mindestens fünf Motion-Familien + Full-Frame-Szene.');
console.log('Caption Default: bottom 330 / inset 76 / max 928 / ca. 40 px / max 6 Wörter pro sichtbarer Gruppe.');
console.log('Vor Nutzer-Audio: Strukturcheck + validate-storytelling-motion + validate-reel-level-up.');
console.log('Phase 2: Voiceover ausschließlich durch den Nutzer.');
