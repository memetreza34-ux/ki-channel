import {mkdir, readdir, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const [rawTitle, rawDate] = process.argv.slice(2);
if (!rawTitle?.trim()) {
  console.error('Aufruf: node scripts/new-ki-longform.mjs "Video Titel" [YYYY-MM-DD]');
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
const slugify = (title) =>
  title
    .trim()
    .replace(/[–—]/g, '-')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');

const title = rawTitle.trim();
const slug = slugify(title);
if (!slug) throw new Error('Kein gültiger Ordnername aus Titel erzeugbar.');

const dateName = iso(parseDate(rawDate));
const dateRoot = resolve('ki', 'youtube-longform', dateName);
await mkdir(dateRoot, {recursive: true});

const existing = await readdir(dateRoot, {withFileTypes: true});
const used = existing
  .filter((entry) => entry.isDirectory())
  .map((entry) => Number(entry.name.match(/^(\d{2})_/)?.[1]))
  .filter(Number.isFinite);
let index = 1;
while (used.includes(index)) index += 1;
if (index > 99) throw new Error(`${dateName} enthält bereits 99 Longform-Slots.`);

const videoName = `${String(index).padStart(2, '0')}_${slug}`;
const videoRoot = resolve(dateRoot, videoName);
const dirs = [
  '01-script-audio',
  '02-visuals',
  '03-thumbnail',
  '04-metadata',
  '05-export',
  '06-projektdateien',
];
await mkdir(videoRoot, {recursive: false});
for (const dir of dirs) {
  await mkdir(resolve(videoRoot, dir), {recursive: false});
  await writeFile(resolve(videoRoot, dir, '.gitkeep'), 'Verbindlicher Produktionsordner — nicht entfernen.\n', 'utf8');
}

const sourcePath = `ki/src/longform/${slug}/`;

const files = {
  'README.md': `# ${title}\n\n**Datum:** ${dateName}\n**Source:** \`${sourcePath}\`\n\n## Format\n\n- 1920 × 1080, 30 FPS, 16:9\n- Zielzeit 5:00–6:00 Minuten nach echtem Voiceover\n- deutsch, faceless, heller editorialer Look\n- \`REMOTION_NATIVE_MAXIMUM\`\n\n## 3 Phasen\n\n1. **Phase 1 — ChatGPT:** komplette Grundlage außer echtem Voiceover\n2. **Phase 2 — Mensch:** nur das Voiceover erzeugen\n3. **Phase 3 — Codex/Antigravity:** Audio integrieren, Timing, Tests, Render\n\nVerbindlich: \`REPO-STATE.md\`, \`ki/gehirn/MASTER.md\`, \`ki/gehirn/PRODUKTIONSABLAUF.md\`, \`ki/youtube-longform/AGENTS.md\`, \`ki/src/longform/AGENTS.md\`.\n\nAktueller Status: \`06-projektdateien/PHASE-STATUS.md\`.\n`,

  '01-script-audio/README.md': `# 01 — Script & Audio\n\nPhase 1 legt hier \`voiceover.md\` (Skript mit Kapitelstruktur) und \`VOICEOVER-ZUM-KOPIEREN.txt\` (reiner Fließtext, keine Überschriften oder Anweisungen) an.\n\nPhase 2 erzeugt ausschließlich \`voiceover.wav\` (bevorzugt) oder \`voiceover.mp3\`. In Phase 2 keine Planungs- oder Code-Datei ändern.\n\nRichtwert: 5:00–6:00 Minuten entsprechen je nach Sprechtempo ungefähr 700–850 Wörtern.\n`,

  '01-script-audio/voiceover.md': `# Sprechertext — ${title}\n\n**Status:** OFFEN — Phase 1 schreibt den finalen Text.\n\nAufbau pro Kapitel: Kapitelnummer, Kapitelziel, Sprechertext.\nDer Text hier ist die Wahrheit; \`VOICEOVER-ZUM-KOPIEREN.txt\` ist derselbe Text ohne Struktur.\n`,

  '01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt': `PHASE 1 MUSS DIESE DATEI MIT DEM REINEN SPRECHERTEXT FUELLEN.\n\nNur Fliesstext, keine Kapitelueberschriften, keine Regieanweisungen,\nkeine Klammern, keine Szenennummern. Dieser Text wird 1:1 vertont.\n`,

  '02-visuals/README.md': `# 02 — Visuals\n\nPhase 1 legt hier \`visual-plan.md\` und \`asset-manifest.json\` an.\n\n\`REMOTION_NATIVE_MAXIMUM\`: sichtbare Inhalte so weit wie sinnvoll direkt in React/SVG/CSS/Canvas/WebGL bauen. Externe Bilder nur, wenn der Nutzer sie bereitstellt und sie inhaltlich wirklich nötig sind. Keine Assets erfinden.\n`,

  '02-visuals/visual-plan.md': `# Visual-Plan — ${title}\n\n**Status:** OFFEN — Phase 1 vervollständigt diese Datei.\n\nPro Kapitel dokumentieren:\n\n- Kapitelnummer und Kapitelziel\n- Sprecherstelle → Bedeutung\n- Startzustand → sichtbare Veränderung → Endzustand\n- visuelle Mechanik (was genau erklärt das Bild?)\n- Umsetzung in Remotion\n- End-Hold vor Kapitelwechsel\n\nRegeln: ein klarer Mechanismus pro Kapitel, mehrere bedeutungsgetriebene Zustände innerhalb des Kapitels, keine Deko-Motion als Füller, UI und Diagramme groß genug für Laptop/TV.\n`,

  '02-visuals/asset-manifest.json': `{\n  "status": "OFFEN",\n  "externalAssetsRequired": null,\n  "note": "Phase 1 entscheidet ausdruecklich: true oder false. Bei true jedes Asset einzeln begruenden.",\n  "assets": []\n}\n`,

  '03-thumbnail/README.md': `# 03 — Thumbnail\n\n\`ki/plattformen/youtube/THUMBNAILS.md\` ist verbindlich.\n\nThumbnail ebenfalls Remotion-first als eigene Composition im Source-Ordner. Phase 1 legt hier \`thumbnail-brief.md\` an; der Export entsteht in Phase 3.\n`,

  '03-thumbnail/thumbnail-brief.md': `# Thumbnail-Brief — ${title}\n\n**Status:** OFFEN — Phase 1 vervollständigt diese Datei.\n\n- Kernaussage in maximal 3–4 Wörtern\n- visuelles Motiv (Remotion-nativ)\n- Text-/Bildhierarchie\n- Lesbarkeit in kleiner Darstellung\n- Composition-ID\n\nDas Thumbnail darf niemals mehr versprechen als der Inhalt liefert.\n`,

  '04-metadata/README.md': `# 04 — Metadaten\n\nPhase 1 legt hier \`youtube.md\` mit Titel, Beschreibung, Kapitelbezeichnungen und Keywords an.\n\nDie finalen Kapitel-Zeitstempel trägt Phase 3 aus dem tatsächlich verwendeten Audio nach.\n`,

  '04-metadata/youtube.md': `# YouTube-Metadaten — ${title}\n\n**Status:** OFFEN — Phase 1 vervollständigt diese Datei.\n\n## Titel\n\n## Beschreibung\n\n## Kapitel\n\nKapitelbezeichnungen ohne Zeitstempel. Phase 3 ergaenzt die realen Zeiten aus dem finalen Audio.\n\n## Keywords\n\n---\n\nTitel und Beschreibung duerfen die fachliche Aussage nicht uebertreiben.\n`,

  '05-export/README.md': `# 05 — Export\n\nPhase 3 legt hier Smoke-Frames, Thumbnail-Export und den finalen Master ab.\n\nEin gerendertes MP4 ist erst nach technischer **und** visueller Prüfung freigegeben.\n`,

  '06-projektdateien/README.md': `# 06 — Projektdateien\n\nHier liegen \`PHASE-STATUS.md\`, \`longform.json\`, \`chapter-plan.md\`, \`animation-plan.md\`, der Phase-3-Auftrag und die Review-Checkliste.\n\nAusführbarer TS/TSX-Code gehört **nicht** hierhin, sondern nach \`${sourcePath}\`.\n`,

  '06-projektdateien/PHASE-STATUS.md': `# Produktionsstatus — ${title}\n\n## Phase 1 — ChatGPT\n\n**Status:** OFFEN\n\nFertig erst mit: finalem Sprechertext + Copy-Fließtext, Kapitelplan, Visual-Plan, Thumbnail-Brief, YouTube-Metadaten, \`longform.json\`, ausführbarem Source unter \`${sourcePath}\`, registrierter Video- und Thumbnail-Composition sowie fokussiertem Contract-Test.\n\n**Nicht behaupten**, was nicht tatsächlich ausgeführt wurde (TypeScript-, Vitest-, Remotion-Lauf).\n\n## Phase 2 — Mensch\n\n**Status:** WARTET AUF PHASE 1\n\nNur echtes Voiceover aus \`VOICEOVER-ZUM-KOPIEREN.txt\` erzeugen und in \`01-script-audio/\` ablegen.\n\n## Phase 3 — Codex / Antigravity\n\n**Status:** WARTET AUF PHASE 2\n\nAudio messen und integrieren, Kapitel an reale Sprechpausen koppeln, Tests und Strukturchecks ausführen, Smoke-Frames und Thumbnail rendern, finalen Master rendern und visuell/akustisch prüfen.\n\nFehlt Audio: exakt \`PHASE 2 AUDIO FEHLT\`.\n`,

  '06-projektdateien/longform.json': `{\n  "version": 1,\n  "slug": "${slug}",\n  "title": ${JSON.stringify(title)},\n  "language": "de",\n  "format": {\n    "width": 1920,\n    "height": 1080,\n    "fps": 30,\n    "durationInFrames": null\n  },\n  "productionMode": "REMOTION_NATIVE_MAXIMUM",\n  "audio": {\n    "voiceoverRequired": true,\n    "music": false,\n    "sfx": false\n  },\n  "chapters": []\n}\n`,

  '06-projektdateien/chapter-plan.md': `# Kapitelplan — ${title}\n\n**Status:** OFFEN — Phase 1 vervollständigt diese Datei.\n\nPro Kapitel:\n\n- Nummer und Titel\n- Kapitelziel in einem Satz\n- zugehörige Sprecherstelle\n- geplante Baseline-Dauer\n\nDie Baseline ist eine Planungsgröße. Die realen Kapitelgrenzen setzt Phase 3 anhand echter Sprechpausen — niemals linear pro Rata.\n`,

  '06-projektdateien/animation-plan.md': `# Animationsplan — ${title}\n\n**Status:** OFFEN — Phase 1 vervollständigt diese Datei.\n\nPro Visual Beat:\n\nSprecherstelle → Bedeutung → Startzustand → sichtbare Veränderung → Endzustand → Umsetzung → Timing\n\nKein \`Math.random()\`. Direkte Frame-Seeks müssen deterministisch funktionieren.\n`,

  '06-projektdateien/CODEX_ASSEMBLY_TASK.md': `# Phase-3-Auftrag — ${title}\n\n1. \`PHASE-STATUS.md\`, \`longform.json\`, Skript, Kapitel- und Visualplan lesen.\n2. echtes Voiceover in \`01-script-audio/\` suchen. Fehlt es: exakt \`PHASE 2 AUDIO FEHLT\` und stoppen.\n3. reale Audio-Dauer messen. Liegt die natürliche Aufnahme außerhalb 5:00–6:00, nicht heimlich stark stretchen; Ursache melden.\n4. Voiceover render-sicher in die Video-Composition integrieren (\`voiceoverSrc\` tatsächlich übergeben, nicht nur den Prop deklarieren).\n5. Kapitelgrenzen anhand echter Satz-/Phrasenpausen setzen; keine lineare Pro-Rata-Verteilung.\n6. Visual Beats auf reale Sprechstellen legen.\n7. Animationen/Holds zuerst anpassen; nur kleine pitch-erhaltende Audio-Korrekturen an Phrasengrenzen, und diese dokumentieren.\n8. \`npm run ki:longform:structure-check\`, \`npm run typecheck\` und die fokussierten Tests tatsächlich ausführen.\n9. pro Kapitel Opening/Mid/End als Smoke-Frames rendern und ansehen.\n10. Thumbnail-Composition rendern und in kleiner Darstellung prüfen.\n11. finalen 1920×1080-MP4 rendern, technisch prüfen und vollständig ansehen.\n12. zusätzlich verkleinert prüfen: UI, Labels und Kapitelmarker müssen lesbar bleiben.\n13. finale YouTube-Kapitelzeitstempel aus dem verwendeten Audio in \`04-metadata/youtube.md\` eintragen.\n14. Review-Checkliste und Status nur für tatsächlich bestandene Punkte aktualisieren.\n`,

  '06-projektdateien/review-checklist.md': `# Review-Checkliste — ${title}\n\nNur abhaken, was tatsächlich geprüft wurde.\n\n## Technisch\n\n- [ ] \`npm run ki:longform:structure-check\` bestanden\n- [ ] \`npm run typecheck\` bestanden\n- [ ] fokussierter Contract-Test bestanden\n- [ ] MP4 technisch validiert (Auflösung, FPS, Dauer, Tonspur)\n\n## Inhaltlich\n\n- [ ] Sprechertext und Bild sagen dasselbe\n- [ ] jedes Kapitel hat einen klaren visuellen Mechanismus\n- [ ] keine Deko-Motion als Füller\n- [ ] Thumbnail verspricht nicht mehr als der Inhalt liefert\n\n## Visuell\n\n- [ ] Smoke-Frames pro Kapitel angesehen\n- [ ] Video vollständig in Normalgeschwindigkeit angesehen\n- [ ] verkleinert geprüft: UI und Labels lesbar\n- [ ] Markenschrift wird tatsächlich angewendet (keine Fallback-Serife)\n\n## Akustisch\n\n- [ ] Voiceover klingt natürlich, kein hörbarer Speedwechsel\n- [ ] Bildwechsel sitzen auf den gemeinten Sprechstellen\n`,
};

for (const [relativePath, content] of Object.entries(files)) {
  await writeFile(resolve(videoRoot, relativePath), content, 'utf8');
}

console.log(`KI-Longform-Paket angelegt: ${videoRoot}`);
console.log('');
console.log('Nächste Schritte für Phase 1:');
console.log(`  1. Alle Dateien mit Status OFFEN vervollständigen.`);
console.log(`  2. Ausführbaren Remotion-Source unter ${sourcePath} anlegen.`);
console.log(`     Brand-Import dort: import {BRAND} from '../../../brand/brand';`);
console.log(`  3. Video- und Thumbnail-Composition in ki/src/Root.tsx registrieren.`);
console.log('  4. Pflicht: npm run ki:longform:structure-check');
