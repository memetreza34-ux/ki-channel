# YouTube-Longform — Produktionsvertrag

Gilt für Produktionspakete unter `ki/youtube-longform/`.

## Format

- eigenständiges Content-Format, niemals künstlich aus einem Reel verlängern
- aktuelle Zielzeit: **5:00–6:00 Minuten**
- Standardformat: **1920×1080, 30 FPS, 16:9**
- deutsch, faceless, heller KIwerkraum-Look
- Maximum-Remotion: sichtbare Inhalte so weit wie sinnvoll mit React/SVG/CSS/Canvas/WebGL/Remotion bauen
- externe Bilder/Medien nur, wenn der Nutzer sie bereitstellt und sie inhaltlich wirklich nötig sind

## Paketstruktur

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

Ausführbarer Source:

```text
ki/src/longform/<slug>/
```

Der Brand-Import liegt im Source drei Ebenen höher — `import {BRAND} from '../../../brand/brand';`. Ein falscher relativer Pfad bricht den kompletten Remotion-Bundle.

## Paket anlegen und prüfen

Neues Longform-Paket niemals von Hand anlegen:

```bash
npm run new-longform -- "Video Titel"
```

Das erzeugt die vollständige 01–06-Struktur mit allen Pflichtdateien im Status `OFFEN`.

Nach jeder Struktur- oder Source-Änderung verpflichtend:

```bash
npm run ki:longform:structure-check
```

Der Check prüft Datumsordner, Paketstruktur, die Trennung von Planung und Source sowie die Auflösbarkeit aller relativen Source-Imports. Er läuft auch als Teil von `npm test`.

## 3 Phasen

### Phase 1 — ChatGPT

Komplette Grundlage außer echtem Voiceover: Thema, Skript, Kapitel, Visual Beats, Thumbnail-Konzept, YouTube-Metadaten, Remotion-Source, Composition, Checks und Phase-3-Handoff.

### Phase 2 — Mensch

Nur den freigegebenen Sprechertext vertonen und als `voiceover.wav` oder `voiceover.mp3` in `01-script-audio/` ablegen.

### Phase 3 — Codex / Antigravity

Audio messen und integrieren, Kapitel/Visual Beats an reale Stimme anpassen, Tests und Smoke-Frames ausführen, Thumbnail rendern, finalen Master rendern und normal sowie verkleinert visuell/akustisch prüfen.

Fehlt Audio, exakt stoppen mit:

`PHASE 2 AUDIO FEHLT`

## Visual-Rhythmus

Longform braucht weniger Dauerbewegung als Reels. Trotzdem darf neue Sprecherbedeutung nicht minutenlang auf demselben Zustand liegen.

- pro Kapitel ein klarer visueller Mechanismus
- innerhalb eines Kapitels mehrere bedeutungsgetriebene Zustände
- keine Deko-Motion als Füller
- lesbarer End-Hold vor Kapitelwechsel
- Hard Cuts als Standard; Übergänge nur bei echter visueller Kontinuität
- UI und Diagramme groß genug für YouTube auf Laptop/TV, nicht als winzige Dashboard-Collage

## Text

- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Kapitelüberschrift kurz und sparsam
- Animationstext nur als kurze Objekt-/Zustandslabels
- vollständige Untertiteldatei kann in Phase 3 aus dem finalen Audio erzeugt werden
- interne Planner-/Goal-/Debug-Texte niemals sichtbar

## Thumbnail

`ki/plattformen/youtube/THUMBNAILS.md` ist verbindlich. Thumbnail ebenfalls Remotion-first, solange kein echtes Foto-/Produktasset zwingend erforderlich ist.

## Wahrheit

Tests, Render, Thumbnail-Export, Audio-Sync oder visuelle Freigabe nur als erledigt markieren, wenn sie tatsächlich ausgeführt wurden.