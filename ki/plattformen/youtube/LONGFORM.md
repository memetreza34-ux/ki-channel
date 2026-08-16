# YouTube Longform

Longform ist ein **eigenes Content-Format**. Es wird nicht automatisch aus einem Reel verlängert.

## Status — aktiv

YouTube Longform ist ab 2026-08-16 als kanonischer Produktionsbereich aktiviert.

Kanonisches Produktionspaket:

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
```

Ausführbarer Remotion-Source:

```text
ki/src/longform/<slug>/
```

Verbindlicher Formatvertrag: `ki/youtube-longform/AGENTS.md`.

Aktives erstes Paket:

```text
ki/youtube-longform/2026-08-16/01_Mit-KI-eine-App-bauen/
```

Video-Composition: `KI-Longform-AIAppWorkflow`
Thumbnail-Composition: `KI-Longform-AIAppWorkflow-Thumbnail`

## Aktuelle Startlänge

Für die erste YouTube-Longform-Phase gilt verbindlich:

- Zielkorridor pro Video: **5:00 bis 6:00 Minuten**
- Skript, Dramaturgie und Visual-Plan werden von Anfang an für diesen Korridor gebaut
- nicht erst ein längeres Video schreiben und danach künstlich kürzen
- keine Wiederholungen oder Füllsätze nur, um die Laufzeit zu erreichen
- die reale Laufzeit wird nach dem fertigen Voiceover gemessen; die finale Fassung bleibt im 5–6-Minuten-Korridor
- längere Formate erst einführen, wenn der Nutzer das ausdrücklich ändert

Dieser Korridor ist eine aktuelle Kanalentscheidung, keine allgemeine YouTube-Regel.

## Wann Longform sinnvoll ist

Longform eignet sich, wenn ein Thema echte Tiefe braucht, zum Beispiel:

- mehrere zusammenhängende Mechanismen
- Tool-Workflow mit mehreren Schritten
- Vergleich mit belastbaren Kriterien
- Recherche/Einordnung eines größeren KI-Themas
- Tutorial mit nachvollziehbarer Demonstration

Wenn die Aussage in unter einer Minute vollständig erklärt ist, bleibt sie Short-Form.

## Dramaturgie

Standardlogik:

```text
HOOK
→ klares Versprechen / Frage
→ Kontext: warum ist das relevant?
→ Mechanismus / Erklärung
→ Beispiele / Demonstration
→ Grenzen / Fehler / Gegenposition
→ klare Zusammenfassung
→ natürlicher CTA nur wenn sinnvoll
```

Kein künstliches Strecken, keine Wiederholung zur Laufzeitverlängerung.

## Produktionsstruktur

Die aktive Struktur lautet:

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

Longform wird ausdrücklich **nicht** in die Reel-01–06-Struktur gezwungen. Recherche, Kapitel, Thumbnail, Metadaten und Longform-Edit besitzen einen eigenen Vertrag.

## Produktionsphasen

```text
PHASE 1 — ChatGPT
Thema + Skript + Kapitel + Visual Beats + Thumbnail + Metadaten + Remotion-Source

PHASE 2 — Mensch
nur echtes Voiceover

PHASE 3 — Codex / Antigravity
Audio analysieren + Timeline synchronisieren + prüfen + Thumbnail/Video rendern
```

Fehlt in Phase 3 das Audio, gilt exakt: `PHASE 2 AUDIO FEHLT`.

## Visuals

- faceless
- gleiche Markenfarben wie Short-Form
- `REMOTION_NATIVE_MAXIMUM`: möglichst den gesamten sichtbaren Inhalt mit React/SVG/CSS/Canvas/WebGL/Remotion bauen
- externe Bilder/Medien nur bei echtem inhaltlichem Zwang und nur, wenn sie tatsächlich bereitgestellt wurden
- Visuals erklären, nicht dekorieren
- Bildschirm-/UI-Demos nur mit lesbarer Skalierung
- Kapitel brauchen eigene visuelle Zustände
- keine durchgehende Bewegungsüberladung
- bei zu flachen Code-Visuals zuerst Tiefe, Perspektive, Layering und Komposition verbessern statt auf KI-Bilder auszuweichen

## Wahrheit

Aktuelle Tools, Preise, Modelle, Regeln oder News vor Veröffentlichung neu prüfen. Longform darf aus mehr Laufzeit nicht mehr unbelegte Behauptungen machen.

Tests, Audio-Sync, Thumbnail-Export, Render und visuelle Freigabe nur als erledigt markieren, wenn sie tatsächlich ausgeführt wurden.

## Thumbnail

`THUMBNAILS.md` ist verbindlich. Das Thumbnail ist ein eigener Deliverable und wird standardmäßig ebenfalls Remotion-native gebaut, solange kein echtes Foto-/Produktasset zwingend nötig ist.
