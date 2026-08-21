# KI-Channel — Regeln unter `ki/`

Diese Datei erweitert `REPO-STATE.md` und `AGENTS.md`.

## Gehirn zuerst

Für jede KI-Aufgabe zuerst `ki/gehirn/MASTER.md` lesen. Es verweist auf die autoritativen Bereiche:

- `KANAL.md` — Identität und Ton
- `REELS.md` — Reel- und Text-Hierarchie
- `PLATTFORMEN.md` — Publishing, YouTube und weitere Plattformen
- `PRODUKTIONSABLAUF.md` — 3 Phasen
- `../BILDSTIL.md` — Bild-/Prompt-Qualität

Danach den passenden Produktionsvertrag lesen:

- Short-Form → `ki/reels/AGENTS.md`
- YouTube Longform → `ki/youtube-longform/AGENTS.md`

## Harte Short-Form-Ordnerstruktur

Jedes Produktionsreel liegt dauerhaft hier:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 05-export/
└── 06-projektdateien/
```

Nicht zulässig:

```text
ki/<reel-name>/
ki/reels/<slug>/
ki/src/reels/<planning-package>/
```

Neue Pakete nur mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Vor und nach Strukturänderungen:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

## Harte YouTube-Longform-Struktur

Longform ist ein separates aktives Produktionsformat:

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
├── README.md
├── 01-script-audio/
├── 02-visuals/
├── 03-thumbnail/
├── 04-metadata/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer Longform-Source liegt ausschließlich hier:

```text
ki/src/longform/<slug>/
```

Aktueller Formatstandard: 1920×1080, 30 FPS, 16:9, 5:00–6:00 Minuten nach echtem Voiceover.

## Datei-Eigentum Short-Form

- `01-script-audio/` — Skript, Copy-Fließtext, echtes Voiceover, Transcript/Timing
- `02-bilder/` — Bildentscheid, hochwertige Prompts, Asset-Manifest, Bilder/Layers/Masks
- `03-caption/` — Subtitle-Cues, Wort-Timestamps und genau eine universelle, direkt kopierbare Social Caption mit fünf Hashtags
- `05-export/` — Smoke-Frames, Review-Renders, finale MP4
- `06-projektdateien/` — `PHASE-STATUS`, `reel.json`, Szene/Animation, Assembly-Auftrag, Review

Ausführbarer TS/TSX-Code ausschließlich separat:

```text
ki/src/reels/<slug>/
```

Keine Planungsdokumente in den Source-Ordner kopieren.

## Datei-Eigentum Longform

- `01-script-audio/` — finaler Sprechertext, Copy-Text, echtes Voiceover
- `02-visuals/` — Kapitel-/Visualplan und Asset-Entscheidungen
- `03-thumbnail/` — Thumbnail-Briefing und Thumbnail-Handoff
- `04-metadata/` — YouTube-Titel, Beschreibung, Kapitel und Keywords
- `05-export/` — Smoke-Frames, Thumbnail-Export, finaler 16:9-Master
- `06-projektdateien/` — Status, Longform-Contract, Kapitel-/Animationsplan, Assembly und Review

Longform-Source folgt zusätzlich `ki/src/longform/AGENTS.md`.

## Plattformbereich

Publishing-Regeln liegen unter:

```text
ki/plattformen/
```

Bei Plattformaufgaben zusätzlich `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/AGENTS.md` lesen.

Plattformordner dürfen kein zweites Skript, keinen zweiten Source und keine zweite Master-Wahrheit anlegen. Short-Form wird einmal produziert; YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden den freigegebenen Master, solange keine technisch notwendige Anpassung erforderlich ist.

YouTube Longform wird separat unter `ki/youtube-longform/` produziert und nicht automatisch aus Reels erzeugt.

## Phasen

Für Short-Form und Longform gilt:

- Phase 1 muss **vor Audio** bereits Source-Code und Composition-Grundlage enthalten.
- Phase 2 ist nur das menschliche Voiceover.
- Phase 3 integriert das Audio in den vorhandenen Source, synchronisiert an die reale Stimme, testet, smoke-reviewt und rendert.

Wenn ein Agent in Phase 3 Source neu von Null bauen will, ist das ein Prozessfehler.

Wenn Phase-3-Audio fehlt: `PHASE 2 AUDIO FEHLT`.

## Visual Standard

- heller oder weißer editorialer Hintergrund
- dunkle, formatgerecht lesbare Typografie
- `#B98CFF` primärer Fokus-Akzent
- `#6E45C9` Tiefe/Kontrast
- faceless
- keine generische Cyberpunk-/Neon-Ästhetik
- `REMOTION_NATIVE_MAXIMUM`: möglichst alles Sichtbare direkt mit React/SVG/CSS/Canvas/WebGL/Remotion bauen
- bei zu flachen Code-Visuals zuerst Komposition, Perspektive, Schatten, Tiefe und Layering verbessern
- externe Bilder/Medien nur als begründete Ausnahme und niemals erfinden
- keine erfundenen Zahlen

## Text-Hierarchie

- Überschrift/Kapitelmarker: kurz, Zuschauer-Sprache
- Short-Form-Caption: Sprechertext synchron
- Longform: keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Animationslabels: kurze Objekt-/Zustandsbegriffe
- interne Regie-/Goal-Texte: niemals sichtbar

Kein langer Sprechertext doppelt als Headline und Animationstext. Keine wortweise Kopie des Transcripts in die Animation.

## Bilder

Bilder nur, wenn sie echten Mehrwert gegenüber Maximum-Remotion liefern. `ki/BILDSTIL.md` bestimmt Prompt-Aufbau, Safe-Zones, Dateinamen und Qualitätsgate. Für UI, Icons, Diagramme, technische Illustrationen, Mockups, Cover und pseudo-3D zuerst Remotion ausreizen.

## Testing

Mindestens formatbezogen prüfen:

- Format/FPS/Dauer
- kontinuierliche Szenen-/Kapitelbereiche
- eindeutige IDs
- Asset-Pfade
- keine ungrounded Werte
- Visual-Safe-Zones über reale Smoke-Frames
- Packaging/Metadaten vorhanden
- Thumbnail bei Longform separat und in kleiner Darstellung geprüft
- finaler Render gehört exakt zum aktuellen Source-Stand

Ein bestandenes Unit-Test-Set ersetzt keine visuelle Prüfung.
