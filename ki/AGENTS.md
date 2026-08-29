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
- neue Reels auf **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit planen
- bevorzugt **150–175 Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- `reel.json.scriptBudget.targetMinSeconds = 60`, `targetMaxSeconds = 75`
- Visual Beats
- Remotion-Source
- Caption-Basis
- Plattform-Copy
- Entertainment-Review
- Motion-Readability-Datei PENDING

### Phase 2 — ausschließlich Nutzer-Audio

Der Nutzer erstellt das vollständige Voiceover selbst und legt es manuell unter dem in `reel.json.audio.targetFile` definierten Pfad ab, normalerweise `01-script-audio/voiceover.mp3`.

Agenten dürfen das Produktions-Voiceover **weder erzeugen noch herunterladen**. Keine TTS-/Voice-Tools, keine Provider-URLs und keine Preview-Dateien als Ersatz.

Fehlt die Datei, wird gestoppt mit:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

### Phase 3

- `prepare-reel-audio.mjs`: Runtime-WAV + ggf. Pause-Kompression
- bekanntes Skript per lokalem Forced Alignment exakt gegen die Runtime-WAV ausrichten
- `WORD-TIMINGS.json`, Szenen und Captions Voice-Locked schreiben
- tatsächliche finale Dauer prüfen: 60–75 Sekunden oder dokumentierte Ausnahme
- SFX automatisch nach finalen Szenenframes auflösen
- externe Visuals lokal auflösen/validieren
- `prepare-reel-render.mjs` + Provenance-Lock
- Tests/Smoke/Contact-Sheet
- Roh-Render + Social-Audio-Master
- 1x Motion-Readability auf dem gemasterten MP4
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

`Root.tsx` nutzt nur die vorbereitete lokale Runtime-Spur `public/runtime-audio/<compositionId>.wav` via `staticFile`.

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
- 60–75-s-Reels brauchen über die ganze Timeline mehrere sichtbare Beats, Zooms/Fokuswechsel/SFX mit Bedeutung; keine langen statischen Füll-Holds
- dunkle Fullscreen-Szenen nur dokumentierte Ausnahme
- Logos nur aus echten zulässigen Assets

## Final-Export

Ein Reel ist nicht fertig bei `render complete`.

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <final-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Erst danach und nach echtem Ansehen/Anhören:

`FINAL VIDEO READY — EXPORT PACKAGE READY`

## Git/Medien

Git hält Source, Skripte, Provenance, Timings, Reviews und Manifest.

Große MP4/WAV/MP3/PNG bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist. Keine Regel darf verlangen, per `.gitignore` ausgeschlossene Binärdateien normal zu committen.

## Wahrheitspflicht

Keine erfundenen Medien, Dateien, URLs, Testergebnisse oder Render-Claims. Nur tatsächlich ausgeführte Schritte als bestanden melden.
