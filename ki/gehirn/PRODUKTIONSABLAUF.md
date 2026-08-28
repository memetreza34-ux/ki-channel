# KI-Kanal — verbindlicher Reel-Produktionsablauf

Dieser Ablauf ist der Normalfall für jedes neue Short-Form-Reel.

## Phase 1 — Inhalt + Source

Ziel: vollständige Produktionsgrundlage, bevor Timing geraten werden müsste.

Pflicht:

- Thema/Fakten/Quellen
- finales `voiceover.md`
- exaktes `VOICEOVER-ZUM-KOPIEREN.txt`
- `SCENE-VOICE-MAP.json`: jeder exakte Satz gehört genau zu einer Szene
- Szenenplan + `animation-plan.md`
- semantische `sfx-events.json`
- `visual-assets.json`: bewusste Visual-Entscheidung pro Szene
- `ENTERTAINMENT-REVIEW.md`
- `MOTION-READABILITY-REVIEW.md` zunächst `PENDING`
- `subtitle-cues.json` nur als Preview-Basis, solange kein Audio-Lock vorliegt
- Plattform-Copy + `FINAL-CAPTION.txt`
- `reel.json`
- ausführbarer Source unter `ki/src/reels/<slug>/`
- Composition in `Root.tsx`

### Visual Beat Contract

Für wichtige Beats dokumentieren:

```text
Sprecherphrase
→ Bedeutung
→ Startzustand
→ Reveal
→ Settle
→ lesbarer Hold
→ Endzustand
→ NEW_BUILD / REUSE_EXACT
```

Bestehende Animation nur bei exaktem semantischem Fit.

### Visual-Asset-Entscheidung

Pro Szene bewusst wählen:

- `NATIVE_UI`
- `OFFICIAL_SOURCE_CARD`
- `WIKIMEDIA_COMMONS`
- `GITHUB_RAW`

Richtwert: ungefähr 70–80 % native Visuals und 20–30 % echte Bilder/Screens; meist 1–2 starke externe Visual-Momente statt Füllmaterial. Details: `VISUAL_ASSETS.md`.

---

## Phase 2 — reales Voiceover beschaffen

Verbindlich: `AUDIO_PIPELINE.md`.

Zulässig:

1. Voiceover tatsächlich mit einem verfügbaren Voice-/TTS-Tool erzeugen, oder
2. Nutzer/Mensch liefert die Audiodatei.

Wenn Audio im selben Auftrag bereits real erzeugt wurde, geht die Produktion ohne künstlichen Zwischenstopp direkt weiter.

Der kanonische lokale Ausgangsmaster liegt am Pfad aus:

`reel.json -> audio.targetFile`

Remote-/Provider-URL ist nur Provenance und **keine** Renderquelle.

---

## Phase 3 — Timing-Lock, Assets, Render, Master, Review, Export

### 1. Runtime-Audio + Pause-Kompression

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Ergebnis:

`public/runtime-audio/<compositionId>.wav`

Diese 48-kHz-Stereo-PCM-WAV ist die gemeinsame Timing- und Render-Autorität. Optional aktivierte Pause-Kompression läuft **vor** dem Alignment.

### 2. Exaktes lokales Forced Alignment

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Der bekannte Sprechertext wird gegen genau die Runtime-WAV ausgerichtet. Daraus entstehen:

- `WORD-TIMINGS.json`
- finale Caption-Cues
- finale Szenengrenzen
- finale Composition-Dauer
- `VOICE_LOCKED`
- automatische SFX-Auflösung nach den finalen Szenenframes

Kein fuzzy matching und kein freies Whisper-Raten als Standard bei bekanntem Sprechertext.

### 3. Externe Visuals lokal auflösen

Wenn Visuals aktiviert sind:

```bash
node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>
node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>
```

Externe Bilder werden vor dem Render lokal gespeichert, lizenzgefiltert, nach Relevanz/Qualität/Crop-Eignung gerankt und per SHA256 gebunden. Keine Remote-Media-URL im Remotion-Render.

### 4. Source/Timing/Asset-Änderungen committen

Der Production-Render arbeitet fail-closed mit Git-/Hash-Provenance. Erst wenn die renderrelevanten JSON-/Source-Dateien final sind, committen.

### 5. Pre-Render-Gates

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Der Render-Lock bindet u. a.:

- Source Tree
- Scene-Voice-Map
- Word-Timings
- Captions
- SFX-Resolved
- Visual-Manifest + Visual-Resolved
- kanonisches Audio + Runtime-WAV
- finale Dauer

Zusätzlich fokussierte Tests + TypeScript ausführen.

### 6. Remotion-Roh-Render

1080×1920, 30 fps, lokale Runtime-Medien. Dieser Roh-Render ist noch **nicht automatisch der finale Social-Audio-Master**.

### 7. Social-Audio-Master

```bash
node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>
node ki/scripts/validate-social-audio-master.mjs <mastered-render.mp4>
node ki/scripts/validate-final-video.mjs <mastered-render.mp4>
```

Kanonisches Ziel:

- etwa −16 LUFS Integrated
- True Peak Ziel −1,5 dBTP
- Video wird beim Mastering nicht neu encodiert

### 8. Exakten gemasterten MP4 bei 1x reviewen

Prüfen:

- Opening/Hook
- Pacing und unnötige Pausen
- Caption-/Voice-Sync
- SFX-Timing und -Lautstärke
- echte Bilder: Relevanz, Crop, Bewegung
- Zoom/Focus/Parallax
- Source-Proof-Lesbarkeit
- keine visuelle Überladung
- Stimme klar und Gesamtlautstärke passend

`MOTION-READABILITY-REVIEW.md` erst jetzt auf `PASS` setzen und an **genau den gemasterten MP4-SHA256** binden.

### 9. Final-Export

Nicht bei `render complete` stoppen.

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <mastered-render.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt die relevanten Entertainment-, Forced-Alignment-, Scene-Voice-, Voice-Lock-, SFX-, Visual-, Motion-, Social-Audio-, Provenance- und Video-/Audio-Gates erneut aus.

Kanonischer Endzustand:

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

Danach den exportierten MP4 tatsächlich ansehen/anhören sowie Cover/Caption prüfen.

Erst dann:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Stop-Bedingungen

Nicht als fertig melden bei:

- fehlendem lokalen Audio
- Remote-Audio oder Remote-Bild als Renderquelle
- fehlendem Forced Alignment / Voice-Lock
- falscher Szenen-/Audio-Dauer
- unresolved oder nicht lizenzgeprüften externen Visuals
- zu schnellen/unlesbaren Beats
- Caption-/Visual-Kollision
- fehlgeschlagenen Tests/Validatoren
- stummem oder zu leisem Video
- nicht bestandenem Social-Audio-Master
- fehlendem Export-Paket
- nicht angesehenem/nicht angehörtem **gemasterten** Final-MP4
