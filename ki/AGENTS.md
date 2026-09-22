# KI-Channel — Regeln unter `ki/`

Diese Datei erweitert `REPO-STATE.md` und das Root-`AGENTS.md`.

## Gehirn zuerst

Für jede KI-Aufgabe zuerst `ki/gehirn/MASTER.md` lesen. Danach je nach Aufgabe die relevanten Verträge:

- `KANAL.md` — Identität und Ton
- `STORY_RETENTION.md` — Hook, Story, Retention vor Script/Code
- `FAKTENQUELLEN.md` — Claims, Quellen, Recheck
- `REELS.md` — Short-Form-Struktur und Text-Hierarchie
- `VISUAL_STRATEGY.md` — beste Bildsprache pro Beat
- `CREATIVE_QA.md` — finaler Zuschauer-Review
- `PLATTFORMEN.md` — Publishing
- `PRODUKTIONSABLAUF.md` — 3 Phasen
- `REMOTION_ANIMATION_CAPABILITIES.md` — technische Mechaniken nach der kreativen Entscheidung
- `../BILDSTIL.md` — nur wenn externe Still-/Hybrid-Assets gewählt wurden

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
- `02-bilder/` — reale externe Assets/Captures, Prompts/Shot-Briefs, Asset-Manifest
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
→ Mechanik
→ Source
→ Voiceover / reale Pflichtmedien
→ Timeline
→ Render
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
- Animation-/Shot-Plan
- Asset-/Capture-Entscheidung
- Captions/Plattform-Copy Basis
- reel.json
- Source + Composition

### Phase 2

Immer echtes Voiceover.

Nur wenn Phase 1 es ausdrücklich verlangt zusätzlich:

- REAL_CAPTURE
- externes Still/Hybrid/Motion-Asset

Phase 2 verändert keine Planungs-/Source-Dateien.

### Phase 3

Vorhandenen Source verwenden, Audio/Assets integrieren, reale Timeline synchronisieren, prüfen und rendern.

Wenn ein Agent in Phase 3 Source aus Bequemlichkeit komplett neu erfindet, ist das ein Prozessfehler.

Wenn Audio fehlt: `PHASE 2 AUDIO FEHLT`.

## Visual Standard — beste Erklärung gewinnt

**Kein `REMOTION_NATIVE_MAXIMUM` als pauschaler Default.**

Vor Technik gilt `VISUAL_STRATEGY.md`.

Mögliche primäre Modalities:

- `REMOTION_NATIVE` — exakte UI, Daten, Prozesse, technische Mechanismen
- `REAL_CAPTURE` — reales Produktverhalten ist Teil des Beweises
- `HYBRID` — räumliches/physisches Motiv + präzise Remotion-Overlays
- `EXTERNAL_STILL_REQUIRED` — komplexe räumliche/organische Momentaufnahme
- `EXTERNAL_MOTION_REQUIRED` — komplexe physische Bewegung selbst ist Bedeutungsträger

Remotion darf nicht nur aus Bequemlichkeit gewählt werden. Externe Medien dürfen ebenfalls nicht nur zur Abwechslung eingesetzt werden.

### Immer gültig

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
- Karten-/Panelbeats normalerweise höchstens ungefähr ein Drittel
- mindestens ein Hero-/Memorable-Moment

## Real Capture

Wenn echte UI oder reales Tool-Ergebnis die Aussage trägt, `REAL_CAPTURE` prüfen statt erfundene UI zu bauen.

Dokumentieren:

- Produkt
- Capture-Datum
- Plan/Version, falls relevant
- welche Aussage der Capture belegt
- Recheck-Pflicht bei schnelllebigen Features

Sensible Daten entfernen.

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

Longform wird nicht aus Short-Form aufgeblasen und wählt seine Bildsprache ebenfalls nach Inhalt, nicht automatisch nach Remotion-Maximum.

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

Ein bestandenes Unit-Test-Set ersetzt **niemals** visuelle Prüfung.

Final zusätzlich:

- `POST_RENDER_REVIEW.md`
- `CREATIVE_QA.md`
- `creative-review.md` = PASS

Technisch bestanden + kreativ langweilig = nicht fertig.
