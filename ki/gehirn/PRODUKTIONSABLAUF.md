# KI-Kanal — verbindlicher Reel-Produktionsablauf

Dieser Ablauf ist der Normalfall für jedes neue Short-Form-Reel.

## Phase 1 — Inhalt + Source

Ziel: vollständige Produktionsgrundlage.

Pflicht:

- Thema/Fakten/Quellen
- finales `voiceover.md`
- `VOICEOVER-ZUM-KOPIEREN.txt`
- Szenenplan
- `animation-plan.md` mit Visual Beats
- `ENTERTAINMENT-REVIEW.md`
- `MOTION-READABILITY-REVIEW.md` zunächst `PENDING`
- `subtitle-cues.json` als **Preview-Basis**, solange kein finales Audio-Lock vorliegt
- Plattform-Copy + `FINAL-CAPTION.txt`
- Asset-Entscheidung/Manifest
- `reel.json`
- ausführbarer Source unter `ki/src/reels/<slug>/`
- Composition in `Root.tsx`
- fokussierte Source-/Contract-Checks

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

---

## Phase 2 — reales Voiceover beschaffen

Verbindlich: `AUDIO_PIPELINE.md`.

Zulässig:

1. Voiceover tatsächlich mit einem verfügbaren Voice-/TTS-Tool erzeugen, **oder**
2. Nutzer/Mensch liefert die Audiodatei.

Wenn Audio im selben Auftrag bereits real erzeugt wurde, geht die Produktion ohne künstlichen Zwischenstopp direkt weiter.

Finaler lokaler Master liegt am Pfad aus:

`reel.json -> audio.targetFile`

Remote-/Provider-URL ist nur Provenance und kein Render-Master.

---

## Phase 3 — Audio-Lock, Timeline, Render, Export

### 1. Lokales Audio vorbereiten

- kanonische Audiodatei wirklich vorhanden
- `ffprobe` / Dauer prüfen
- Whisper-/Wort-Timestamps gegen genau diese Datei
- `subtitle-cues.json` auf `VOICE_LOCKED...`
- Szenengrenzen + Composition-Dauer auf echte Audio-/Bedeutungsgrenzen aktualisieren

Danach:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Remotion verwendet dann nur:

`public/runtime-audio/<compositionId>.mp3`

Keine Render-Time-Netzwerkquelle.

### 2. Timeline kalibrieren

Das Audio ist Zeit-Autorität, Lesbarkeit bleibt Gate.

Bei problematischen Abschnitten:

1. Visual Beats/Holds/Szenenlänge anpassen
2. unnötige gleichzeitige Informationen reduzieren
3. natürliche Pausen an Phrasengrenzen feinjustieren
4. nur falls nötig komplette Phrase pitch-erhaltend leicht retimen
5. Captions danach erneut gegen tatsächlich verwendetes Audio locken

Nicht erlaubt: mehrere wichtige Zustände in wenige Frames quetschen.

### 3. Technische Checks

- Strukturcheck
- fokussierte Tests
- TypeScript
- Entertainment-Validator
- Voice-Lock-Validator
- ggf. Source-Isolation

### 4. Smoke-/Hero-/Contact-Sheet-Review

Prüfen:

- Opening
- Hero-Momente
- Szenenwechsel
- Caption/Visual-Abstand
- keine Fremd-/Alt-Visuals
- Light-First-Kohärenz
- Motion bei **1x** verständlich

`MOTION-READABILITY-REVIEW.md` erst nach echtem Render auf PASS setzen.

### 5. Final rendern

Danach:

```bash
node ki/scripts/validate-final-video.mjs <final-video.mp4>
```

Stummes/praktisch unhörbares Video = Fail.

### 6. Final-Export

Nicht bei `render complete` stoppen.

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <final-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt die relevanten Entertainment-, Voice-Lock-, Motion-, ggf. Source-Isolation- und Video-/Audio-Gates selbst erneut aus.

Kanonischer Endzustand:

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

Danach exportierten MP4 tatsächlich ansehen/anhören sowie Cover/Caption prüfen.

Erst dann:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Stop-Bedingungen

Nicht als fertig melden bei:

- fehlendem lokalen Audio
- Remote-Audio als Renderquelle
- fehlendem Voice-Lock
- falscher Szenen-/Audio-Dauer
- zu schnellen/unlesbaren Beats
- Caption-/Visual-Kollision
- dunklem Fullscreen-Stilbruch ohne Ausnahme
- fehlgeschlagenen Tests/Validatoren
- stummem Video
- fehlendem Export-Paket
- nicht angesehenem/nicht angehörtem Final-MP4
