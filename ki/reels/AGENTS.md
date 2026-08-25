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

- `VOICEOVER-ZUM-KOPIEREN.txt` mit exakt dem später gesprochenen Text
- `SCENE-VOICE-MAP.json`: jeder Satz wird **vor dem Audio-Lock** einer Szene zugeordnet
- `reel.json`
- Szene-/Animationsplan
- Entertainment- und Motion-Review-Struktur
- Preview-Captions nur als Planung
- Plattform-Copy + Final-Caption
- ausführbarer Source + Composition

Der Agent darf später nicht aus dem fertigen Audio erraten, welcher Satz zu welcher Szene gehört.

## Phase 2 — Voiceover

Reales Audio darf per verfügbarem Tool oder durch Nutzer/Mensch entstehen. Remote-URL ist Provenance, kein Render-Master.

## Phase 3 — lokaler Sync, Render, Export

Primärer Timing-Weg bei bekanntem Sprechertext:

```text
Voiceover-Master
→ Runtime-PCM-WAV
→ lokales Forced Alignment des bekannten Textes
→ WORD-TIMINGS.json
→ finale Caption-Cues
→ automatische Szenengrenzen aus SCENE-VOICE-MAP
→ VOICE_LOCKED
```

Ein-Kommando-Sync:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Whisper ist Fallback/Diagnose für unbekanntes Audio, nicht mehr die Standard-Timing-Autorität für normale KI-Voiceover.

Danach müssen bestehen:

```bash
node ki/scripts/validate-local-forced-alignment.mjs <reel-package-dir>
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Die gelockten JSON-Dateien werden vor dem Production-Render committed.

## Forced-Alignment-Regeln

Kanonische Quelle: `ki/gehirn/FORCED_ALIGNMENT.md`.

- lokal, ohne Cloud-Quota
- kein fuzzy word matching
- Text muss exakt rekonstruiert werden
- Caption-Wörter müssen exakt `WORD-TIMINGS.json` entsprechen
- Szene 2+ startet am ersten tatsächlich gesprochenen Wort ihres ersten gemappten Satzes
- Production nutzt nur die dokumentierten Modellpfade mit kompatibler Lizenz

## Visual / Motion

- Product/UI-first bei konkreten Apps/Features
- Light-First
- `SETUP → AKTION → KONSEQUENZ → PAYOFF`
- wichtige Zustände: `REVEAL → SETTLE → READABLE HOLD`
- höchstens 1–2 neue unabhängige Informationen gleichzeitig

## Caption Layout

Einzige Wahrheit:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Bei 1080×1920: bottom 250px, 104px Inset, max 860px, max 2 Zeilen, Glass-/Blur-Overlay, kein separater Footer.

## Finaler Export

Nach finalem MP4 + echtem 1x-Review:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Das Export-Manifest muss lokale Forced-Alignment-, Scene-Voice-, Voice-Lock-, Motion-, Audio- und Provenance-Gates enthalten.

Erst nach vollständiger Prüfung:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
