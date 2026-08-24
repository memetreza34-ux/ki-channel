# KI-Channel — Regeln unter `ki/`

Diese Datei erweitert `REPO-STATE.md` und `AGENTS.md`.

## Lesereihenfolge

Für KI-Aufgaben:

1. `ki/gehirn/MASTER.md`
2. bei Short-Form zusätzlich `ki/reels/AGENTS.md`
3. bei Audio `ki/gehirn/AUDIO_PIPELINE.md`
4. named Reel + Source

Für jedes Short-Form-Reel zusätzlich diese Skills:

- `ki/skills/entertainment-first-reels/SKILL.md`
- `ki/skills/high-energy-remotion-reels/SKILL.md`
- `ki/skills/motion-readability-light-first/SKILL.md`
- `ki/skills/voice-locked-captions/SKILL.md`
- `ki/skills/final-video-delivery/SKILL.md`
- `ki/skills/final-export-package/SKILL.md`

## Ordnerstruktur

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

Ausführbarer Source nur unter `ki/src/reels/<slug>/`.

## Phasen

### Phase 1

- Inhalt/Skript
- Visual Beats
- Remotion-Source
- Caption-Basis
- Plattform-Copy
- Entertainment-Review
- Motion-Readability-Datei PENDING

### Phase 2

Reales Voiceover beschaffen: tatsächliches Voice-/TTS-Tool oder Nutzer/Mensch.

Remote-URL nur als Provenance; lokaler Master ist Pflicht.

### Phase 3

- reales Audio messen
- Whisper/Voice-Lock
- Szenen/Dauer an echte Audio-/Bedeutungsgrenzen
- `prepare-reel-audio.mjs`
- Tests/Smoke/Contact-Sheet
- 1x Motion-Readability
- Final-Render
- Finalizer + Export-Package-Validator

## Caption — eine Wahrheit

Bei 1080×1920 ausschließlich Shared-Geometrie aus `ki/src/reels/captionSafe.ts`:

- `bottom: 250px`
- `104px` horizontal
- `860px` max width
- max. 2 Zeilen
- Glass-/Blur-Overlay
- kein eigener Footer

Keine alten 520px-/Boxless-Regeln neu einführen.

## Audio — eine Wahrheit

Verbindlich `ki/gehirn/AUDIO_PIPELINE.md`.

Vor Production-Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

`Root.tsx` nutzt nur `public/runtime-audio/<compositionId>.mp3` via `staticFile`.

Keine statischen Imports auf ignorierte Reel-Audiodateien und keine Remote-Audio-URL im Render-Source.

## Visual Standard

- Light-First
- Product/UI-first bei Apps/Features
- Fullscreen-Hintergrund
- keine kleine Card-Insel in riesigem Leerraum
- `SETUP → AKTION → KONSEQUENZ → PAYOFF`
- Hero-Moment pro Szene
- `REVEAL → SETTLE → READABLE HOLD`
- High Energy ≠ High Speed
- dunkle Fullscreen-Szenen nur dokumentierte Ausnahme
- Logos nur aus echten zulässigen Assets

## Final-Export

Ein Reel ist nicht fertig bei `render complete`.

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <final-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt Entertainment-, Voice-Lock-, Motion-, ggf. Source-Isolation- und Video-/Audio-Gates erneut aus.

Erst danach und nach echtem Ansehen/Anhören:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Git/Medien

Git hält Source, Skripte, Provenance, Timings, Reviews und Manifest.

Große MP4/WAV/MP3/PNG bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist. Keine Regel darf verlangen, per `.gitignore` ausgeschlossene Binärdateien normal zu committen.

## Wahrheitspflicht

Keine erfundenen Medien, Dateien, URLs, Testergebnisse oder Render-Claims. Nur tatsächlich ausgeführte Schritte als bestanden melden.
