# KI-Channel — Regeln unter `ki/`

Diese Datei erweitert `REPO-STATE.md` und `AGENTS.md`.

## Gehirn zuerst

Für jede KI-Reel-Aufgabe zuerst `ki/gehirn/MASTER.md` lesen. Es verweist auf die vier autoritativen Bereiche:

- `KANAL.md` — Identität und Ton
- `REELS.md` — Reel- und Text-Hierarchie
- `PRODUKTIONSABLAUF.md` — 3 Phasen
- `../BILDSTIL.md` — Bild-/Prompt-Qualität

## Harte Ordnerstruktur

Jedes Produktionsreel liegt dauerhaft hier:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
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

## Datei-Eigentum

- `01-script-audio/` — Skript, Copy-Fließtext, echtes Voiceover, Transcript/Timing
- `02-bilder/` — Bildentscheid, hochwertige Prompts, Asset-Manifest, Bilder/Layers/Masks
- `03-caption/` — Subtitle-Cues, Wort-Timestamps, Social Caption
- `04-pdf/` — optionale PDF-Assets
- `05-export/` — Smoke-Frames, Review-Renders, finale MP4
- `06-projektdateien/` — `PHASE-STATUS`, `reel.json`, Szene/Animation, Assembly-Auftrag, Review

Ausführbarer TS/TSX-Code ausschließlich separat:

```text
ki/src/reels/<slug>/
```

Keine Planungsdokumente in den Source-Ordner kopieren.

## Phasen

Phase 1 muss **vor Audio** bereits Source-Code und Composition-Grundlage enthalten. Phase 2 ist nur das menschliche Voiceover. Phase 3 integriert das Audio in den vorhandenen Source, testet, smoke-reviewt und rendert.

Wenn ein Agent in Phase 3 Source neu von Null bauen will, ist das ein Prozessfehler.

## Visual Standard

- heller oder weißer editorialer Hintergrund
- dunkle, mobile-lesbare Typografie
- `#B98CFF` primärer Fokus-Akzent
- `#6E45C9` Tiefe/Kontrast
- faceless
- keine generische Cyberpunk-/Neon-Ästhetik
- eine dominante erklärende Bewegung pro Satz
- maximal drei starke Bewegungen gleichzeitig
- keine erfundenen Zahlen

## Text-Hierarchie

- Überschrift: kurz, Zuschauer-Sprache
- Caption: Sprechertext
- Animationslabels: kurze Objekt-/Zustandsbegriffe
- interne Regie-/Goal-Texte: niemals sichtbar

Kein langer Sprechertext doppelt oben und unten. Keine wortweise Kopie des Untertitels in die Animation.

## Bilder

Bilder nur, wenn sie echten Mehrwert gegenüber Remotion liefern. `ki/BILDSTIL.md` bestimmt Prompt-Aufbau, Safe-Zones, Dateinamen und Qualitätsgate. Bild-KI erzeugt räumliche/illustrative Komplexität; Remotion erzeugt Überschriften, Captions, Zahlen, Pfeile, Diagramme und präzise UI-Texte.

## Testing

Mindestens prüfen:

- Format/FPS/Dauer
- kontinuierliche Szenenbereiche
- eindeutige Scene-/Animation-IDs
- Subtitle-Bounds und vollständige Textabdeckung
- Asset-Pfade
- keine ungrounded Werte
- visuelle Safe-Zones über reale Smoke-Frames

Ein bestandenes Unit-Test-Set ersetzt keine visuelle Prüfung.
