# YouTube-Longform — Produktionsvertrag

Gilt für Produktionspakete unter `ki/youtube-longform/`.

## Format

- eigenständiges Content-Format, niemals künstlich aus einem Reel verlängern
- aktuelle typische Zielzeit: **5:00–6:00 Minuten**, wenn das Thema diese Tiefe trägt
- Standardformat: **1920×1080, 30 FPS, 16:9**
- deutsch, faceless, heller editorialer KI-Look
- Story, Fakten und Bildsprache werden vor Technik entschieden
- externe Medien nur real verwenden; fehlende Assets nicht vortäuschen

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

## Kreative Reihenfolge

Auch Longform folgt dem Grundprinzip aus `ki/gehirn/MASTER.md`:

```text
Viewer Promise
→ Hook / Kapitelbogen
→ Fakten / Quellen
→ Sprechertext
→ Kapitel + Visual Beats
→ Visual Modality / Shot Strategy
→ erst dann Remotion / Captures / Assets
→ Source
→ Voiceover
→ Timeline / Render / Review
```

Ein Longform-Video braucht mehr Tiefe als ein Reel, aber keine künstliche Länge.

## 3 Phasen

### Phase 1 — ChatGPT

Komplette Grundlage außer echten Medien:

- klares Video-Versprechen
- Hook und Kapitelbogen
- Fakten-/Quellenprüfung
- finaler Sprechertext
- Kapitel und Visual Beats
- Visual-Strategie pro Kapitel/Beat
- Thumbnail-Konzept
- YouTube-Metadaten
- Asset-/Capture-Entscheidungen
- ausführbarer Source + Composition
- technische Checks, soweit ohne echtes Voiceover möglich
- Phase-3-Handoff

### Phase 2 — Mensch

Immer:

- freigegebenen Sprechertext vertonen und als `voiceover.wav` oder `voiceover.mp3` in `01-script-audio/` ablegen

Nur wenn Phase 1 es ausdrücklich verlangt:

- REAL_CAPTURE
- reales/external Still-/Hybrid-/Motion-Asset

### Phase 3 — Codex / Antigravity

- reale Medien prüfen
- Audio messen/analysieren und integrieren
- Kapitel/Visual Beats an reale Stimme anpassen
- Tests/TypeScript ausführen
- Smoke-Frames prüfen
- Thumbnail rendern und in kleiner Darstellung prüfen
- finalen Master rendern
- normal, verkleinert und akustisch prüfen
- Fakten-Rechecks für aktuelle Claims durchführen

Fehlt Audio, exakt stoppen mit:

`PHASE 2 AUDIO FEHLT`

## Visual Strategy — kein Remotion-Zwang

Für jedes Kapitel/Visual Beat wird die beste Bildsprache gewählt.

Mögliche Modalities:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Remotion bleibt stark für:

- Prozesse
- UI
- Daten
- Code
- kontrollierte technische Visualisierung

REAL_CAPTURE ist stärker, wenn tatsächliches Tool-/Produktverhalten selbst der Beweis ist.

Hybrid/externes Asset ist korrekt, wenn Raum, Material, physische Metapher oder organische Szene die Aussage deutlich besser trägt.

Beste Erklärung gewinnt; keine Modality ist pauschaler Default.

## Visual-Rhythmus

Longform braucht weniger Dauerbewegung als Reels. Trotzdem darf neue Sprecherbedeutung nicht minutenlang auf demselben Zustand liegen.

- pro Kapitel ein klarer visueller Mechanismus oder eine klare visuelle Frage
- innerhalb eines Kapitels mehrere bedeutungsgetriebene Zustände
- keine Deko-Motion als Füller
- lesbarer End-Hold vor Kapitelwechsel
- Hard Cuts als Standard; Übergänge nur bei echter visueller Kontinuität
- UI/Diagramme/Captures groß genug für Laptop/TV
- Karten-/Panel-/Dashboard-Grammatik nicht als Standard für mehrere Kapitel
- mindestens mehrere bewusst geplante visuelle Höhepunkte über das ganze Video verteilt

## Text

- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Kapitelüberschrift kurz und sparsam
- Animationstext nur als kurze Objekt-/Zustandslabels
- vollständige Untertiteldatei kann in Phase 3 aus finalem Audio erzeugt werden
- interne Planner-/Goal-/Debug-Texte niemals sichtbar
- Sprechertext nicht als Design-Ersatz mehrfach im Bild wiederholen

## Fakten / Quellen

Die Prinzipien aus `ki/gehirn/FAKTENQUELLEN.md` gelten auch für Longform.

Aktuelle Aussagen über:

- Modelle
- Tools
- Preise
- Limits
- Benchmarks
- Rankings
- Releases

werden vor Veröffentlichung erneut geprüft, wenn sie zeitabhängig sind.

## Thumbnail

`ki/plattformen/youtube/THUMBNAILS.md` ist verbindlich.

Das Thumbnail wird nach seiner **Kommunikationsidee** entschieden, nicht nach dem Tool:

- Remotion/SVG/CSS, wenn kontrollierte grafische Komposition die stärkste Lösung ist
- REAL_CAPTURE, wenn reales Produkt/Resultat entscheidend ist
- Hybrid/externes Motiv, wenn räumliche/physische Bildwirkung klar stärker ist

Thumbnail-Titel und Video-Titel ergänzen sich; kein unnötiges Doppelversprechen.

## Freigabe

Nicht fertig nur weil Render funktioniert.

Vor Freigabe prüfen:

- Versprechen eingelöst
- Kapitelbogen trägt ohne Leerlauf
- Visuals erklären statt dekorieren
- keine monotone UI-/Card-Grammatik
- aktuelle Claims korrekt
- Thumbnail in kleiner Darstellung verständlich
- Audio natürlich
- finaler Render gehört zum aktuellen Source-Stand

Tests, Render, Thumbnail-Export, Audio-Sync oder visuelle Freigabe nur als erledigt markieren, wenn sie tatsächlich ausgeführt wurden.
