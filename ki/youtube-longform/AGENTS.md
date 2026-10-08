# YouTube-Longform — Produktionsvertrag

Gilt für Produktionspakete unter `ki/youtube-longform/`.

## Format

- **primäres Videoformat des KI-Kanals**
- eigenständiges Content-Format; niemals künstlich aus einem Reel verlängern
- typische Zielzeit: **5:00–6:00 Minuten**, wenn das Thema diese Tiefe trägt
- Standard: **1920×1080, 30 FPS, 16:9**
- deutsch, faceless
- visuelle Identität: **Cinematic Editorial Tech**
- verbindlich: `ki/gehirn/YOUTUBE_VISUAL_LANGUAGE.md`
- Story, Fakten und Bildsprache werden vor Technik entschieden

## 100-%-Remotion-Composition

Jeder finale Frame wird in Remotion komponiert und gerendert.

Remotion ist für Longform:

- Illustration
- Motion Design
- UI-/Code-/Terminal-Bühne
- Datenvisualisierung
- 2D/2.5D/optional 3D
- Compositing echter Captures
- Audio-/Caption-/Timeline-Ebene
- finaler Render

Echte Screenshots, Screen-Captures, offizielle Assets oder reale Outputs dürfen als **Beweis-Layer** eingebettet werden. Sie ersetzen nicht die Remotion-Composition.

Nicht als normaler Produktionsweg:

- After Effects
- Premiere als visuelle Haupt-Assembly
- Canva-Video
- externe Bild-/Videogenerierung nur zur Dekoration
- fremde Templates als fertige Bildwelt

Wenn reales Produktverhalten Beweis ist, wird es nicht als Fake-UI nachgebaut.

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

```text
Viewer Promise
→ Hook / Kapitelbogen
→ Fakten / Quellen
→ Sprechertext
→ Kapitel + Visual Beats
→ Visual Strategy
→ Visual Family + sichtbarer Start-/Endzustand
→ Remotion Build / Shot / Art Direction
→ Source
→ Voiceover
→ Timeline
→ Render
→ technische QA
→ Creative Review
```

Direkt von Thema zu Animation/Library springen ist verboten.

## Visual Families

Jeder zentrale Beat soll primär einer der fünf Familien aus `YOUTUBE_VISUAL_LANGUAGE.md` folgen:

- `HERO_OBJECT`
- `PROCESS_SYSTEM`
- `PRODUCT_EVIDENCE`
- `COMPARISON_DATA`
- `KINETIC_TYPE`

Die Familie beschreibt die Erklärlogik, nicht eine starre Vorlage.

## Approved Production Subset

Vor Nutzung der großen Core-/Animation-Library gilt:

`ki/gehirn/APPROVED_KI_VISUALS.md`

Die große Library bleibt verfügbar, aber normale Produktion wählt zuerst aus dem kleineren Approved-Subset.

Wenn nichts semantisch exakt passt: `NEW_BUILD`.

## 3 Phasen

### Phase 1 — ChatGPT

Komplette Grundlage außer echten Medien:

- Video-Versprechen
- Hook und Kapitelbogen
- Fakten-/Quellenprüfung
- finaler Sprechertext
- Kapitel und Visual Beats
- Visual-Familie pro Beat
- Startzustand → sichtbare Veränderung → Endzustand
- Remotion-Build-/Shot-Plan
- Beweis-/Capture-Entscheidungen
- Thumbnail-Konzept
- YouTube-Metadaten
- ausführbarer Source + Composition
- technische Checks, soweit ohne echtes Voiceover möglich
- Phase-3-Handoff

### Phase 2 — Mensch

Immer:

- freigegebenen Sprechertext als `voiceover.wav` oder `voiceover.mp3` in `01-script-audio/` ablegen

Nur wenn Phase 1 echten Produktbeweis verlangt:

- REAL_CAPTURE
- offizielles/reales Quellenasset

Externe generierte Still-/Motion-Assets sind kein normaler Longform-Pfad.

### Phase 3 — Codex / Antigravity

- reale Medien prüfen
- Audio messen/analysieren und integrieren
- Kapitel/Visual Beats an reale Stimme anpassen
- TypeScript/Tests ausführen
- Smoke-Frames prüfen
- Contact-Sheet/visuelle Kapitelprüfung
- Thumbnail rendern und klein prüfen
- finalen Master rendern
- normal, verkleinert und akustisch prüfen
- Fakten-Rechecks für aktuelle Claims durchführen
- Creative Review durchführen

Fehlt Audio:

`PHASE 2 AUDIO FEHLT`

## Visual Strategy

Standard:

- `REMOTION_NATIVE` für konstruierte Erklärvisuals
- `REAL_CAPTURE` wenn echtes Produktverhalten die Behauptung trägt
- `HYBRID` für echten Beweis + Remotion-Erklärung

`EXTERNAL_STILL_REQUIRED` und `EXTERNAL_MOTION_REQUIRED` sind für neue Longform-Produktion keine normalen Modalities mehr. Eine Ausnahme muss konkret begründen, warum Remotion-native + realer Capture die Aussage sichtbar schlechter erklären würden.

## Bildsprache

Verbindlich:

- große Hero-Objekte vor kleinen Cards
- Grid nur bei echter technischer/koordinierter Bedeutung
- Nodes/Kreise nur bei Beziehungs-/Netzlogik
- Rounded Cards nur wenn sie semantisch ein echtes UI-/Dokument-/Datenobjekt darstellen
- helle Editorial-Basis
- gezielte Dark-Reset-/Hero-Szenen
- lila Akzent kontrolliert statt flächig
- Inter als KI-Display-/Body-Standard
- Code in Monospace
- `Signal Thread` als optionales semantisches Markenmotiv

## Motion

Kanonische Runtime:

- `ki/src/motion/easing.ts`
- `ki/src/motion/choreography.ts`

Grundregel:

```text
Startzustand
→ sichtbare Veränderung
→ Endzustand
```

Zusätzlich:

- Hero / Support / Texture
- Hard Cut Standard
- Objektkontinuität vor ständig neuen Slides
- keine Idle-Motion gegen Langeweile
- keine Effekte als Ersatz für Story-Motion
- eine dominante Kamerabewegung pro Beat
- Voiceover bestimmt Rhythmus
- große visuelle Resets über ein längeres Video verteilen

## Visual-Rhythmus

Longform braucht keine Dauerbewegung, aber Sprecherbedeutung darf nicht über lange Strecken auf demselben Bildzustand liegen.

- pro Kapitel eine klare visuelle Frage oder Mechanik
- mehrere bedeutungsgetriebene Zustände pro längerer Passage
- lesbarer End-Hold vor wichtigen Wechseln
- UI/Diagramme/Captures groß genug für Laptop/TV
- keine drei Kapitel hintereinander mit gleicher Panel-/Dashboard-Grammatik
- mehrere geplante visuelle Höhepunkte über das ganze Video

## Text

- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Kapitelmarker kurz
- Animationstext nur als Objekt-/Zustandslabel oder gezielter Hero-Satz
- Transcript nicht als Design-Ersatz im Bild wiederholen
- Planner-/Debug-Texte niemals sichtbar

## Fakten / Quellen

`ki/gehirn/FAKTENQUELLEN.md` gilt vollständig.

Aktuelle Aussagen über Modelle, Tools, Preise, Limits, Benchmarks, Rankings und Releases werden vor Veröffentlichung erneut geprüft.

## Thumbnail

`ki/plattformen/youtube/THUMBNAILS.md` bleibt verbindlich.

Das Thumbnail wird ebenfalls in Remotion komponiert. Echter Capture/Output darf als Beweis-Layer dienen.

Video-Titel und Thumbnail ergänzen sich statt denselben Satz zu duplizieren.

## Freigabe

Nicht fertig nur weil Render funktioniert.

Prüfen:

- Versprechen eingelöst
- Kapitelbogen trägt
- Bildwelt wirkt wie aus einem System
- keine Template-Sammlung
- keine Card-/Dashboard-Monotonie
- keine generische Neon-/Roboter-KI-Ästhetik
- Motion erklärt Zustandsänderung
- Hero-Momente sind wirklich visuell stärker
- aktuelle Claims korrekt
- Thumbnail in klein verständlich
- Audio natürlich
- finaler Render gehört zum aktuellen Source-Stand

Tests, Render, Audio-Sync oder Creative Review nur als erledigt markieren, wenn sie tatsächlich ausgeführt wurden.
