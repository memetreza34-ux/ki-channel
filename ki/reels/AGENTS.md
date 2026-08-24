# KI-Reels — Produktionsvertrag

Gilt für alle Produktionspakete unter `ki/reels/`.

## Struktur

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

Ausführbarer TS/TSX-Code liegt separat unter `ki/src/reels/<slug>/`.

## Phase 1 — Inhalt + Source

Pflicht:

- finales Skript + Copy-Fließtext
- `reel.json`
- `scene-plan.md`
- `animation-plan.md`
- `ENTERTAINMENT-REVIEW.md`
- `MOTION-READABILITY-REVIEW.md` zunächst PENDING
- `subtitle-cues.json` als Preview-Basis
- `platform-copy.md`
- `FINAL-CAPTION.txt`
- Asset-Manifest/Prompts
- Assembly-/Review-Dateien
- ausführbarer Source + Composition

Plan-only ist nicht Phase-1-fertig.

## Phase 2 — Voiceover

Voiceover darf real per verfügbarem Tool oder durch Nutzer/Mensch entstehen. Details ausschließlich in `ki/gehirn/AUDIO_PIPELINE.md`.

Remote-URL ist Provenance, kein Render-Master.

## Phase 3 — Lock, Review, Render, Export

Pflichtreihenfolge:

1. lokales Audio vorhanden
2. reale Dauer messen
3. Whisper/Voice-Lock
4. Szenengrenzen + Composition-Dauer auf echtes Audio schreiben
5. `prepare-reel-audio.mjs`
6. Source-/TypeScript-/fokussierte Tests
7. Entertainment-/Voice-Lock-/ggf. Isolation-Gates
8. Smoke/Hero/Contact Sheet
9. 1x Motion-Readability-Review
10. finaler MP4
11. Video-/Audio-Gate
12. Finalizer
13. Export-Package-Validator
14. exportiertes Video ansehen und anhören

## Visual / Motion

- Product/UI-first bei konkreten Apps/Features
- `SETUP → AKTION → KONSEQUENZ → PAYOFF`
- mindestens ein Hero-Moment pro Szene
- Light-First
- High Energy ≠ High Speed
- wichtige Zustände `REVEAL → SETTLE → READABLE HOLD`
- höchstens 1–2 neue unabhängige Informationen gleichzeitig
- keine kleine Card-Insel in riesigem Leerraum

## Caption

Einzige Wahrheit:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Kanonisch bei 1080×1920:

- `bottom: 250px`
- `104px` horizontaler Inset
- `860px` max width
- max. 2 Zeilen
- Glass-/Blur-Overlay
- kein separater Footer / kein zweiter Hintergrund

## Audio/Render

Vor Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Vor Finalisierung:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt Entertainment-, Voice-Lock-, Motion-, ggf. Source-Isolation- und Video-/Audio-Gates selbst aus.

## Kanonischer Endzustand

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

Große Binärdateien sind lokal/Artifact-Storage und nicht automatisch Git-tracked. Git hält Source, Provenance, Timings, Reviews und Manifest.

Erst nach vollständiger Prüfung:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
