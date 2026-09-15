# YouTube Longform

Longform ist ein **eigenes Content-Format**. Es wird nicht automatisch aus einem Reel verlängert.

## Status — aktiv

YouTube Longform ist seit 2026-08-16 als kanonischer Produktionsbereich aktiviert. Für neue Pakete ab **2026-09-05** gilt **Longform v1**.

Kanonisches Produktionspaket:

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
```

Ausführbarer Remotion-Source:

```text
ki/src/longform/<sourceSlug>/
```

Verbindliche Verträge:

- `ki/youtube-longform/AGENTS.md`
- für neue Pakete ab 2026-09-05 zusätzlich `ki/youtube-longform/LONGFORM-V1.md`
- Source-Code: `ki/src/longform/AGENTS.md`

Das vorhandene Paket von 2026-08-16 bleibt Legacy-kompatibel und wird nicht rückwirkend umgebaut.

## Dauer

Der frühere 5:00–6:00-Minuten-Korridor war die Startentscheidung für die erste Longform-Phase.

Ab Longform v1 gilt:

- Dauer folgt Thema, Story und finalem Voiceover
- kein künstliches Verlängern oder Kürzen auf eine starre Minutenzahl
- keine Wiederholungen/Füllsätze für Watchtime
- komplexe Themen dürfen länger werden, einfache Themen bleiben kompakter
- reale Laufzeit wird nach dem finalen Nutzer-Voiceover gelockt

## Wann Longform sinnvoll ist

Longform eignet sich, wenn ein Thema echte Tiefe braucht, zum Beispiel:

- mehrere zusammenhängende Mechanismen
- Tool-Workflow mit mehreren Schritten
- Vergleich mit belastbaren Kriterien
- Recherche/Einordnung eines größeren KI-Themas
- Tutorial mit nachvollziehbarer Demonstration
- News/Entwicklung mit Quellen, Gegenpositionen und Bedeutung

Wenn die Aussage vollständig als Short-Form funktioniert, wird sie nicht künstlich zu Longform aufgeblasen.

## Dramaturgie

`CHAPTERS.json` ist ab v1 die strukturierte Story-Grundlage. Typische Funktionen können sein:

```text
COLD OPEN
→ SETUP
→ PROBLEM
→ MECHANISM
→ PROOF / DEMO
→ COUNTERPOINT
→ IMPLICATION
→ PAYOFF
→ OUTRO
```

Das ist keine starre Reihenfolge. Story und Erkenntnis bestimmen die tatsächliche Struktur.

## Produktionsstruktur

Die bestehende Top-Level-Struktur bleibt stabil:

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

Longform v1 ergänzt darin insbesondere:

- `01-script-audio/CHAPTERS.json`
- `01-script-audio/CLAIMS.json`
- `02-visuals/MEDIA-PLAN.json`
- `03-thumbnail/THUMBNAIL-PLAN.json`
- `06-projektdateien/LONGFORM-VERSION.json`
- `06-projektdateien/RELEASE-PLAN.json`
- `06-projektdateien/REVIEW-CHECKLIST.md`

Neues Paket:

```bash
node scripts/new-ki-longform.mjs "Video Titel" YYYY-MM-DD
```

Strukturprüfung:

```bash
node scripts/check-ki-longform-structure.mjs
```

## Produktionsphasen

```text
Phase 1 — Inhalt / Research / Source
Thema + Recherche + finales Skript + Kapitel + Claims + Media-/B-Roll-Plan + Thumbnail-Konzepte + Metadaten + Remotion-Source

Phase 2 — Mensch
nur echtes Produktions-Voiceover

Phase 3 — Sync / Build / Review / Export
Audio messen + Forced Alignment + Timeline locken + Visuals/B-Roll final binden + Tests/Smoke/Render + SRT/VTT + Thumbnail + vollständiger Review + Upload-Paket
```

Fehlt in Phase 3 das Audio, gilt exakt: `PHASE 2 AUDIO FEHLT`.

## Visuals und Animation

Verbindliche Motion-Policy ab v1:

`OPEN_ENDED_STORY_DRIVEN`

- keine feste Animations-Whitelist
- React/SVG/CSS/Canvas/WebGL/Three/Skia/Rive/Lottie/GSAP/Remotion und neue geeignete Techniken sind möglich
- vorhandenen Stack, Repo-Komponenten, relevante Skills und Remotion Bits zuerst prüfen
- neue Open-Source-Dependencies nur bei echtem Capability-Gap
- reale Bilder/B-Roll verwenden, wenn reale Bildinformation selbst Teil der Aussage ist
- native Animation nutzen, wenn sie einen abstrakten Mechanismus klarer erklärt
- UI/Diagramme auf Laptop und TV lesbar halten
- Motion-Dichte der Story anpassen; nicht zehn Minuten Reel-Dauerfeuer

## B-Roll, Bilder und Quellen

Externe Medien sind ab v1 erlaubt, aber nur provenance-kontrolliert.

Zulässige Quellklassen sind im `MEDIA-PLAN.json` dokumentiert. Für produktive Nutzung müssen Originalquelle, Rechte/Lizenz, nötige Attribution, lokale Datei und Hash nachvollziehbar sein.

Verboten:

- Render-Time-Downloads
- Google-/Web-Suchergebnis als Lizenzbeweis
- ungeprüfte Stock-/Web-Medien
- Fake-Brand-Assets
- KI-generierte Medien als dokumentarischer Beleg realer Claims

Lokale Video-B-Roll kann mit dem vorhandenen FFmpeg-System über das Longform-Preset vorbereitet werden:

```bash
node scripts/prepare-longform-video-asset.mjs <lokales-video> --provenance=<manifest|USER_PROVIDED> --start=0 --duration=6
```

## Wahrheit / Claims

`CLAIMS.json` verbindet prüfbare Aussagen mit Quellen und Kapiteln.

Aktuelle Tools, Preise, Modelle, Regeln, Gesetze und News unmittelbar vor Veröffentlichung erneut prüfen. Longform darf aus mehr Laufzeit nicht mehr unbelegte Behauptungen machen.

## Captions

Keine permanenten großen Reel-Untertitel als Longform-Standard.

Finales Upload-Paket enthält:

- `subtitles.srt`
- `subtitles.vtt`
- `transcript.txt`

Im Bild nur gezielte Hervorhebungen von Begriffen, Zahlen, Namen, Claims, kurzen Zitaten oder Kapitelmarkern.

## Thumbnail

`THUMBNAILS.md` ist verbindlich. Ab v1 werden mindestens drei deutlich unterschiedliche Konzepte in `THUMBNAIL-PLAN.json` geplant. Das gewählte Thumbnail muss das echte Video-Versprechen einhalten.

## Release

Zielausgabe in `05-export/`:

```text
video.mp4
thumbnail-selected.png
title.txt
description.md
chapters.txt
subtitles.srt
subtitles.vtt
transcript.txt
sources.md
manifest.json
```

Tests, Audio-Sync, Thumbnail-Export, Render und visuelle/akustische Freigabe nur als erledigt markieren, wenn sie tatsächlich ausgeführt wurden. Ein technischer Render ist keine Release-Freigabe.