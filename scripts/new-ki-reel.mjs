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
  const monday = addDays(utc, weekday === 0 ? -6 : 1 - weekday);
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
if (!slug) throw new Error('Kein gültiger Ordnername aus Titel erzeugbar.');

const {monday, sunday} = weekBounds(parseDate(rawDate));
const weekName = `${iso(monday)}_bis_${iso(sunday)}`;
const weekRoot = resolve('ki', 'reels', weekName);
await mkdir(weekRoot, {recursive: true});

const existing = await readdir(weekRoot, {withFileTypes: true});
const used = existing
  .filter((entry) => entry.isDirectory())
  .map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1]))
  .filter(Number.isFinite);
let index = 1;
while (used.includes(index)) index += 1;
if (index > 99) throw new Error(`${weekName} enthält bereits 99 Reel-Slots.`);

const reelName = `${String(index).padStart(2, '0')}_${slug}`;
const reelRoot = resolve(weekRoot, reelName);
const dirs = [
  '01-script-audio',
  '02-bilder',
  '03-caption',
  '04-pdf',
  '05-export',
  '06-projektdateien',
];

await mkdir(reelRoot, {recursive: false});
for (const dir of dirs) {
  await mkdir(resolve(reelRoot, dir), {recursive: false});
  await writeFile(
    resolve(reelRoot, dir, '.gitkeep'),
    'Verbindlicher Produktionsordner — nicht entfernen.\n',
    'utf8',
  );
}

const contract = {
  version: 2,
  format: 'short-form-reel',
  title,
  slug,
  week: weekName,
  preProductionRequiredArtifacts: [
    'idea-evaluation.md',
  ],
  phase1RequiredArtifacts: [
    'creative-brief.md',
    'source-ledger.md',
    'visual-strategy.md',
    'visual-quality-v3.json',
    'remotion-capabilities-v1.json',
    'creative-review.md',
    'reel.json',
    'animation-plan.md',
  ],
  postPublishArtifacts: [
    'performance-review.md',
  ],
  visualModalities: [
    'REMOTION_NATIVE',
    'REAL_CAPTURE',
    'HYBRID',
    'EXTERNAL_STILL_REQUIRED',
    'EXTERNAL_MOTION_REQUIRED',
  ],
};

const visualQualityTemplate = {
  version: 3,
  sourceQualityContract: `ki/src/reels/${slug}/visualQuality.ts`,
  hook: {
    heroAreaRatio: 0,
    semanticVisualAnchors: 0,
    brandAnchorAreaRatio: 0,
    stateChangesFirstSecond: 0,
    stateChangesFirst3Seconds: 0,
    contrast: 'soft',
    conflictVisible: false,
    keyMessageVisible: false,
  },
  scenes: [],
  targetScores: {
    hook: 0,
    visualVariety: 0,
    motion: 0,
    iconIllustrationUse: 0,
    readability: 0,
    overall: 0,
  },
};

const remotionCapabilityTemplate = {
  version: 1,
  sourceFiles: [],
  beats: [],
};

const files = {
  'README.md': `# ${title}\n\n**Woche:** ${weekName}\n**Produktionsvertrag:** V2 + Idea/Learning + Visual Quality V3 + Remotion Capability Gate\n\n## Reihenfolge\n\n0. Idea Gate: Angle + Hook-Kandidaten + Score\n1. Creative Brief / Story\n2. Fakten & Quellen\n3. finaler Sprechertext\n4. Visual Beats + Visual Strategy\n5. Remotion-Capability-Auswahl + Visual Quality V3\n6. Animation-/Shot-Plan\n7. ausführbare Source mit echten Capability-Nachweisen\n8. Voiceover / erforderliche reale Medien\n9. Timeline + Render\n10. technische QA + Creative QA\n11. Veröffentlichung + Performance Review\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/MASTER.md\`, \`ki/gehirn/IDEA_GATE.md\`, \`ki/gehirn/STORY_RETENTION.md\`, \`ki/gehirn/FAKTENQUELLEN.md\`, \`ki/gehirn/VISUAL_STRATEGY.md\`, \`ki/gehirn/VISUAL_QUALITY_V3.md\`, \`ki/gehirn/REMOTION_CAPABILITY_GATE.md\`, \`ki/gehirn/REMOTION_ANIMATION_CAPABILITIES.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`, \`ki/gehirn/POST_PUBLISH_LEARNING.md\`.\n\nAktueller Status: \`06-projektdateien/PHASE-STATUS.md\`.\n`,

  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPhase 1 legt nach Idea Gate, Creative Brief und Faktenprüfung \`voiceover.md\` sowie \`VOICEOVER-ZUM-KOPIEREN.txt\` an.\n\nPhase 2 erzeugt bevorzugt \`voiceover.wav\`, alternativ \`voiceover.mp3\`. Der Wortlaut bleibt identisch.\n`,

  '02-bilder/README.md': `# 02 — Assets\n\nDieser Ordner enthält externe Still-/Hybrid-/Motion-Assets, wenn die Visual Strategy sie ausdrücklich verlangt. REAL_CAPTURE kann ebenfalls hier oder in einem reel-spezifisch dokumentierten Unterordner liegen.\n\nKeine Füllbilder. Keine fehlenden Assets vortäuschen.\n\nStill-/Hybrid-Prompts folgen \`ki/BILDSTIL.md\`. Alle Medien werden im \`asset-manifest.json\` mit realem Status geführt.\n`,

  '02-bilder/image-prompts.md': `# Image / Shot Prompts\n\n**Status:** OFFEN\n\nNur verwenden, wenn \`visual-strategy.md\` ein externes Still-/Hybrid-/Motion-Asset begründet.\n\nPro Asset dokumentieren:\n\n- Beat-/Scene-ID\n- Zweck / Kernaussage\n- Modality\n- warum Remotion/Real Capture nicht die bessere Lösung ist\n- erwarteter Dateiname\n- vollständiger Prompt oder Shot-Brief\n- was Remotion später ergänzt\n- Crop/Fokus/Layers, falls relevant\n\nKeine dekorativen Füllassets.\n`,

  '02-bilder/asset-manifest.json': `${JSON.stringify({version: 2, assets: []}, null, 2)}\n`,

  '03-caption/README.md': `# 03 — Captions & Plattform-Copy\n\nPhase 1 legt audio-unabhängige Basiscues und Plattform-Copy an. Phase 3 ersetzt/justiert Cues mit realem Audio-Timing.\n\nCaptions sind Lesbarkeit, nicht zweite Erklärungsebene.\n`,

  '03-caption/platform-copy.md': `# Plattform-Copy — ${title}\n\n**Status:** OFFEN — Phase 1 vervollständigt diese Datei.\n\n## Neutraler Kerntitel\n\n${title}\n\n## YouTube Shorts\n\n**Titel:**\n\n**Beschreibung:**\n\n**Optionale Keywords/Hashtags:**\n\n## Instagram Reels\n\n**Caption:**\n\n## TikTok\n\n**Caption:**\n\n## Facebook Reels\n\n**Begleittext:**\n\n## Snapchat\n\n**Kurztext / nicht genutzt:**\n\n---\n\nKein Transcript-Dump, kein Fake-Hype, keine fachliche Änderung.\n`,

  '04-pdf/README.md': `# 04 — PDF\n\nOptional. Nur reel-bezogene PDF-Quellen/Exports. Planung bleibt in 06-projektdateien.\n`,

  '05-export/README.md': `# 05 — Export\n\nPhase 3 legt hier Smoke-Frames, Review-Renders und finale Exporte ab. Ein MP4 ist erst nach technischer und kreativer Prüfung freigegeben.\n`,

  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nV2-Reels führen hier zwingend Idea-, Story-, Grounding-, Visual-, Capability-, Review- und Learning-Artefakte. Für neue Reels gehören \`visual-quality-v3.json\` und \`remotion-capabilities-v1.json\` zum Phase-1-Vertrag. Ausführbarer TS/TSX-Code gehört nach \`ki/src/reels/<slug>/\`.\n`,

  '06-projektdateien/production-contract-v2.json': `${JSON.stringify(contract, null, 2)}\n`,

  '06-projektdateien/visual-quality-v3.json': `${JSON.stringify(visualQualityTemplate, null, 2)}\n`,

  '06-projektdateien/remotion-capabilities-v1.json': `${JSON.stringify(remotionCapabilityTemplate, null, 2)}\n`,

  '06-projektdateien/idea-evaluation.md': `# Idea Evaluation — ${title}\n\n**Status:** OFFEN\n\nRegeln: \`ki/gehirn/IDEA_GATE.md\`.\n\n## Drei Angles\n\n### A — Konflikt / Irrtum\n\n### B — Demonstration / Ergebnis\n\n### C — Konsequenz / Nutzen\n\n## Gewählter Angle\n\n**Angle:** OFFEN\n\n**Warum:**\n\n## Hook-Kandidaten\n\n1.\n2.\n3.\n\n## 3-Sekunden-Proof\n\n## Visual-Potential\n\nMindestens drei bedeutungstragende Aktionen:\n\n1.\n2.\n3.\n\n## Score\n\n| Kriterium | 0–2 | Begründung |\n|---|---:|---|\n| Neugier | | |\n| Relevanz | | |\n| Visualisierbarkeit | | |\n| Eigenständigkeit | | |\n| Wahrheitsbasis | | |\n| Payoff | | |\n| **Gesamt / 12** | | |\n\n**GO / REWORK / DROP:** OFFEN\n`,

  '06-projektdateien/creative-brief.md': `# Creative Brief — ${title}\n\n**Status:** OFFEN\n\n## Viewer promise\n\n## Hook tension\n\n## 3-second proof\n\n## Why care\n\n## Core mechanism\n\n## Payoff\n\n## Memorable moment\n\n## Truth risk\n\n## Story preflight\n\n- [ ] Idea Gate ist GO\n- [ ] Hook funktioniert ohne Begrüßung/Kanalname\n- [ ] innerhalb weniger Sekunden ist Relevanz klar\n- [ ] Reel entwickelt einen Mechanismus statt nur Informationen aufzuzählen\n- [ ] mindestens ein visueller Höhepunkt ist konkret beschrieben\n- [ ] Schluss liefert eine klare Einordnung/Entscheidung\n`,

  '06-projektdateien/source-ledger.md': `# Source Ledger — ${title}\n\n**Status:** OFFEN\n\nRegeln: \`ki/gehirn/FAKTENQUELLEN.md\`.\n\n| Claim-ID | Claim | Typ | Quelle / Referenz | geprüft am | Primärquelle | Einschränkung | Recheck | Status |\n|---|---|---|---|---|---|---|---|---|\n\nErlaubte Status: \`VERIFIED\`, \`QUALIFIED\`, \`REMOVE\`.\n\nWenn es wirklich keine extern zu prüfenden Claims gibt, statt einer leeren Tabelle exakt dokumentieren:\n\n\`NO_EXTERNAL_CLAIMS: <konkrete Begründung>\`\n`,

  '06-projektdateien/visual-strategy.md': `# Visual Strategy — ${title}\n\n**Status:** OFFEN\n\nRegeln: \`ki/gehirn/VISUAL_STRATEGY.md\`, \`ki/gehirn/REMOTION_CAPABILITY_GATE.md\`.\n\n## Reel-weite Bildidee\n\n**Dominante visuelle Geschichte:** OFFEN\n\n**Hero/Memorable Beat:** OFFEN\n\n**Bewusst vermiedene Wiederholung:** OFFEN\n\n## Beat Sheet\n\n| Beat | Sprecherstelle | Bedeutung | Zuschauer muss sehen | Hauptverb | Start → Veränderung → Ende | Modality | Mechanikfamilie | Primary Remotion capability | Capability rationale | Hero | Asset/Capture |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n\nModality: \`REMOTION_NATIVE\`, \`REAL_CAPTURE\`, \`HYBRID\`, \`EXTERNAL_STILL_REQUIRED\`, \`EXTERNAL_MOTION_REQUIRED\`.\n\nDie Capability-Auswahl wird zusätzlich maschinenlesbar in \`remotion-capabilities-v1.json\` gespiegelt und muss im echten Source nachweisbar sein.\n`,

  '06-projektdateien/creative-review.md': `# Creative Review — ${title}\n\n**Status:** WARTET AUF FINALEN RENDER\n\nRegeln: \`ki/gehirn/CREATIVE_QA.md\`.\n\n## V3 Scorecard\n\n- **Hook score:** OFFEN /10\n- **Visual Variety score:** OFFEN /10\n- **Motion score:** OFFEN /10\n- **Icon/Illustration score:** OFFEN /10\n- **Readability score:** OFFEN /10\n- **Overall score:** OFFEN /10\n\n## Zuschauer-Test\n\n- [ ] Nach 1–2 Sekunden gibt es echten Grund weiterzusehen\n- [ ] Nach wenigen Sekunden ist Thema/Relevanz klar\n- [ ] kein unnötiger Leerlauf\n- [ ] keine repetitive Karten-/Panelserie\n- [ ] mindestens ein erinnerbarer visueller Moment\n- [ ] Kernmechanik grob auch ohne Ton erkennbar\n- [ ] keine Demo-Zahl wirkt versehentlich wie echter Messwert\n- [ ] finale Schlussaussage ist konkret\n- [ ] deklarierte Remotion-Capabilities sind im Source wirklich implementiert\n\n## Ergebnis\n\n**PASS / FAIL:** OFFEN\n\n**Probleme / Änderungen:**\n`,

  '06-projektdateien/performance-review.md': `# Performance Review — ${title}\n\n**Status:** WARTET AUF VERÖFFENTLICHUNG\n\nRegeln: \`ki/gehirn/POST_PUBLISH_LEARNING.md\`.\n\n## Veröffentlichung\n\n| Plattform | Datum | Views | Avg. Watch | Completion | 1–3s Retention | Shares | Saves | Follows |\n|---|---|---:|---:|---:|---:|---:|---:|---:|\n\nNicht verfügbare Werte als \`NICHT VERFÜGBAR\` eintragen.\n\n## Auffällige Retention-Punkte\n\n| Zeitpunkt | Beobachtung | möglicher Grund |\n|---|---|---|\n\n## Qualitatives Feedback\n\n## Lernhypothesen — maximal drei\n\n1.\n2.\n3.\n\n## Kanalweite Konsequenz\n\n- [ ] keine — Einzelbeobachtung\n- [ ] als HYPOTHESE in \`ki/gehirn/LEARNINGS.md\` übernehmen\n- [ ] bestehendes Learning mit weiterer Evidenz aktualisieren\n`,

  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n**Produktionsvertrag:** V2 + Idea/Learning + Visual Quality V3 + Remotion Capability Gate\n\n## Phase 0 — Idea Gate\n\n**Status:** OFFEN\n\nErst bei GO startet Phase 1. Angle, Hook-Kandidaten, 3-Sekunden-Proof, Visual-Potential und Score dokumentieren.\n\n## Phase 1 — ChatGPT\n\n**Status:** WARTET AUF IDEA GATE\n\nFertig erst mit Creative Brief, Source Ledger, finalem Script, Visual Strategy, ausgefülltem \`visual-quality-v3.json\`, ausgefülltem \`remotion-capabilities-v1.json\`, Animation-Plan, Asset-Entscheidung/Manifest, Captions, Plattform-Copy, reel.json, ausführbarem Source, Composition und fokussierten Checks. Deklarierte Capabilities müssen im echten Source nachweisbar sein.\n\n## Phase 2 — Mensch\n\n**Status:** WARTET AUF PHASE 1\n\nVoiceover erzeugen; nur wenn Visual Strategy es verlangt zusätzlich reale Captures/Assets bereitstellen.\n\n## Phase 3 — Codex / Antigravity\n\n**Status:** WARTET AUF PHASE 2\n\nAudio/Assets integrieren, reales Timing, Tests/TypeScript, Smoke-Review, Final-Render, technische QA und Creative QA.\n\n## Phase 4 — Post Publish Learning\n\n**Status:** WARTET AUF VERÖFFENTLICHUNG\n\nEchte Performance-Daten erfassen, maximal drei Hypothesen ableiten und wiederkehrende Evidenz in \`ki/gehirn/LEARNINGS.md\` überführen.\n`,
};

for (const [relative, content] of Object.entries(files)) {
  await writeFile(resolve(reelRoot, relative), content, 'utf8');
}

console.log(`KI-Reel V2 + V3 + Capability Gates angelegt: ${reelRoot}`);
console.log('Pflicht: node scripts/check-ki-reel-folder-structure.mjs');
console.log('Vor Phase 1 FERTIG: node scripts/check-visual-quality-v3.mjs && node scripts/check-remotion-capabilities.mjs');
console.log('Phase 0 startet mit Idea Gate — erst bei GO beginnt die eigentliche Produktion.');