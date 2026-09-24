# KI-Channel — Regeln unter `ki/`

Diese Datei erweitert `REPO-STATE.md` und das Root-`AGENTS.md`.

## Gehirn zuerst

Für jede KI-Aufgabe zuerst `ki/gehirn/MASTER.md` lesen. Danach je nach Aufgabe die relevanten Verträge:

- `KANAL.md` — Identität und Ton
- `THEMENWAHL.md` — Current-AI-Themenwahl
- `STORY_RETENTION.md` — Hook, Story, Retention vor Script/Code
- `FAKTENQUELLEN.md` — Claims, Quellen, Recheck
- `REELS.md` — Short-Form-Struktur und Text-Hierarchie
- `VISUAL_STRATEGY.md` — visuelle Idee und Beweisquelle pro Beat
- `REMOTION_VISUAL_SYSTEM.md` — Remotion als vollständiges code-first Visual-System
- `CREATIVE_QA.md` — finaler Zuschauer-Review
- `PLATTFORMEN.md` — Publishing
- `PRODUKTIONSABLAUF.md` — 3 Phasen
- `REMOTION_ANIMATION_CAPABILITIES.md` — technische Mechaniken nach der kreativen Entscheidung
- `../BILDSTIL.md` — nur bei einer ausdrücklich begründeten externen Still-/Hybrid-Ausnahme

Danach den passenden Produktionsvertrag lesen:

- Short-Form → `ki/reels/AGENTS.md`
- YouTube Longform → `ki/youtube-longform/AGENTS.md`

Bei neuer/geänderter Remotion-Animation `REMOTION_ANIMATION_CAPABILITIES.md` mitprüfen. API-/Versionsfragen gegen aktuelle offizielle Remotion-Dokumentation verifizieren.

## Harte Short-Form-Ordnerstruktur

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

Neue Pakete nur mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Vor/nach Strukturänderungen:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

Nicht zulässig:

```text
ki/<reel-name>/
ki/reels/<slug>/
ki/src/reels/<planning-package>/
```

## Datei-Eigentum Short-Form

- `01-script-audio/` — finaler Sprechertext, Copy-Fließtext, echtes Voiceover, Transcript/Timing
- `02-bilder/` — reale Captures/Quellenassets, Shot-Briefs, Asset-Manifest
- `03-caption/` — Subtitle-Cues, Wort-Timestamps, Plattform-Copy
- `04-pdf/` — optionale PDF-Quellen/Exports
- `05-export/` — Smoke-Frames, Review-Renders, finale MP4
- `06-projektdateien/` — V2-Contract, Creative Brief, Source Ledger, Visual Strategy, reel.json, Pläne, Creative Review, Status

Ausführbarer TS/TSX-Code ausschließlich:

```text
ki/src/reels/<slug>/
```

Keine Planungsdokumente in Source-Ordner kopieren.

## V2 Short-Form Contract

Neue Reels führen mindestens:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`

Reihenfolge:

```text
Story
→ Fakten
→ Sprechertext
→ Visual Beats
→ Visual Strategy
→ Remotion-Build-Idee
→ Source
→ Voiceover / reale Pflicht-Captures
→ Timeline
→ Remotion-Render
→ technische QA
→ Creative QA
```

Direkt vom Thema in Remotion-Code springen ist ein Prozessfehler.

## Phasen

### Phase 1

Vor Audio bereits vollständig planen und Code-Grundlage bauen:

- Creative Brief
- Fakten-/Quellen-Ledger
- finaler Sprechertext
- Visual Beats
- Visual Strategy pro Beat
- Remotion-Build-/Shot-Plan
- echte Beweis-/Capture-Entscheidung
- Captions/Plattform-Copy Basis
- reel.json
- Source + Composition

### Phase 2

Immer echtes Voiceover.

Nur wenn Phase 1 es ausdrücklich als echten Beweis verlangt zusätzlich:

- REAL_CAPTURE
- offizielles/reales Quellenasset

Phase 2 verändert keine Planungs-/Source-Dateien.

### Phase 3

Vorhandenen Remotion-Source verwenden, Audio/Captures integrieren, reale Timeline synchronisieren, prüfen und rendern.

Wenn ein Agent in Phase 3 Source aus Bequemlichkeit komplett neu erfindet, ist das ein Prozessfehler.

Wenn Audio fehlt: `PHASE 2 AUDIO FEHLT`.

## Visual Standard — Remotion-first

Für neue Reels gilt zweistufig:

### Quellen-/Beweisebene

- `REMOTION_NATIVE` — bevorzugt, wenn kein realer Produktbeweis nötig ist
- `REAL_CAPTURE` — wenn tatsächliches Produktverhalten selbst der Beweis ist
- `HYBRID` — echter Capture + Remotion-Erklärung
- externe Still-/Motion-Medien — nur begründete Ausnahme

### Ausführungsebene

**Jeder finale Reel-Frame wird in Remotion komponiert und gerendert.**

Auch REAL_CAPTURE/HYBRID werden in Remotion integriert. Ein UI-Nachbau ist eine Illustration und darf nicht als realer Screenshot ausgegeben werden.

### Remotion-native Baupflicht

Bevor ein externes Bild/Video geplant wird, zuerst prüfen, ob die Szene hochwertig direkt gebaut werden kann.

Remotion-native umfasst:

- React + SVG + CSS
- eigene Icons
- Browser-/App-Mockups
- Code/Terminal
- GitHub-/Repo-Szenen
- Diagramme/Daten
- Rankings/Vergleiche
- Geräte/Objekte
- 2.5D
- Shapes/Paths
- Three bei echter Tiefenlogik

Externe Bild-/Video-Generierung ist kein Standardweg für neue Short-Form-Reels.

## Immer gültig

- heller/weißer editorialer Hintergrund als Markenbasis, sofern die Szene nichts anderes begründet
- dunkle, smartphone-lesbare Typografie
- `#B98CFF` Fokus-Akzent
- `#6E45C9` Tiefe/Kontrast
- faceless
- keine generische Cyberpunk-/Neon-Ästhetik
- keine erfundenen Zahlen
- andere `animationId` allein ist keine visuelle Vielfalt
- direkte Wiederholung gleicher visueller Grammatik vermeiden, wenn die Aussage eine bessere Alternative erlaubt
- Lottie/Rive nur mit real vorhandenem Asset und semantischem Fit
- deprecated `@remotion/light-leaks` nicht für neue Visuals verwenden

## Anti-Karten-Grammatik

Karte/Panel nur wenn semantisch wirklich UI, Dokument, Nachricht, Datei, Datensatz oder Token.

Nicht als Standardcontainer für abstrakte Aussagen.

Neue Reels prüfen:

- nicht mehr als zwei gleiche Hauptgrammatiken direkt hintereinander, sofern nicht bewusst derselbe Prozess fortgeführt wird
- Karten-/Panelbeats normalerweise höchstens ungefähr ein Viertel
- mindestens die Hälfte der Beats objekt-, pfad-, form-, raum-, code-, illustration- oder prozessbasiert
- mindestens ein Hero-/Memorable-Moment

## Real Capture

Wenn echte UI oder reales Tool-Ergebnis die Aussage trägt, `REAL_CAPTURE` verwenden statt erfundene UI als Beweis zu bauen.

Dokumentieren:

- Produkt
- Capture-Datum
- Plan/Version, falls relevant
- welche Aussage der Capture belegt
- Recheck-Pflicht bei schnelllebigen Features

Sensible Daten entfernen.

Der Capture wird anschließend in Remotion geschnitten, fokussiert, maskiert oder mit Overlays versehen.

## Logos und Marken

- eigene generische Icons bevorzugt als SVG/Vector bauen
- offizielles Logo nur als echtes vorhandenes Asset verwenden, wenn redaktionell sinnvoll
- kein komplexes Markenlogo so nachzeichnen, dass es fälschlich wie das offizielle Original wirkt
- ohne offizielles Asset lieber Markenname/neutraler Badge/Kategorie-Icon

## Text-Hierarchie

- Short-Form-Zwischenüberschrift: kurz, oben mittig, Marken-Lila, semantisches Icon
- Caption: synchroner Sprechertext, keine zweite Erklärung
- Animationslabels: kurze Objekt-/Zustandsbegriffe
- interne Regie-/Goal-/Debug-Texte: niemals sichtbar
- kein langer Sprechertext doppelt als Header + Animationstext

Für genaue Short-Form-Geometrie `CAPTION_SAFE_POSITION.md` und `ki/src/reels/captionSafe.ts` verwenden.

## Fakten

`FAKTENQUELLEN.md` gilt besonders für:

- Preise/Limits/Pläne
- aktuelle Features/Modelle
- sichtbare Zahlen/Prozentwerte
- Benchmarks/Rankings
- reale Quellen/Paper
- News
- Produktverhalten

Ein Reel darf vereinfachen, aber kein falsches Mentalmodell erzeugen.

## Kanonischer Remotion-Root

Für echte Production-Compositions gilt:

- `ki/src/ProductionRoot.tsx` registriert Production-Compositions
- `ki/src/production-entry.tsx` registriert ausschließlich `ProductionRoot`
- `ki/src/Root.tsx` ist Studio-/Preview-Root
- `MotionPreviewRoot` darf kein indirekter Teil echter Production-Renders sein
- Phase-2-Audio wird nicht statisch in `ProductionRoot.tsx` importiert; Phase 3 bindet es explizit

`scripts/check-production-visual-contracts.mjs` und `ki/src/productionRootIsolation.test.ts` sichern diese Trennung.

## YouTube Longform

Longform bleibt separates Produktionsformat:

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

Source ausschließlich unter `ki/src/longform/<slug>/`.

Longform wird nicht aus Short-Form aufgeblasen; finale visuelle Composition erfolgt ebenfalls in Remotion.

## Plattformbereich

Publishing-Regeln unter `ki/plattformen/`.

Short-Form wird einmal produziert; Plattformen verwenden den freigegebenen Master, solange keine technisch notwendige Anpassung nötig ist.

Plattformordner legen keine zweite Produktionswahrheit an.

## Testing

Mindestens formatbezogen prüfen:

- Struktur/V2-Contract
- Format/FPS/Dauer
- kontinuierliche Szenenbereiche
- eindeutige IDs
- Asset-Pfade und reale Asset-Status
- keine ungrounded Werte
- Source Ledger Rechecks
- Visual-Safe-Zones über echte Smoke-Frames
- Diversity-/Fingerprint-Warnungen
- Production-Root-/Entry-Isolation
- finaler Render gehört exakt zum aktuellen Source-Stand
- UI-Nachbau wird nicht als echter Capture ausgegeben

Ein bestandenes Unit-Test-Set ersetzt **niemals** visuelle Prüfung.

Final zusätzlich:

- `POST_RENDER_REVIEW.md`
- `CREATIVE_QA.md`
- `creative-review.md` = PASS

Technisch bestanden + kreativ langweilig = nicht fertig.
