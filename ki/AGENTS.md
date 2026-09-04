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

Für die aktive Woche und alle neuen Reels:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
├── 01_Montag/
│   └── 01_Reel-Titel/
├── 02_Dienstag/
│   └── 01_Reel-Titel/
├── 03_Mittwoch/
│   └── 01_Reel-Titel/
├── 04_Donnerstag/
├── 05_Freitag/
├── 06_Samstag/
└── 07_Sonntag/
```

Im Reel-Themenordner bleiben `README.md` sowie `01-script-audio/` bis `06-projektdateien/` Pflicht.

Kurz: `Woche → Wochentag → Thema → 01–06`.

Mehrere Reels am selben Tag werden innerhalb dieses Tages `01_`, `02_`, `03_` nummeriert.

Neue Reels nur über:

```bash
npm run new-video -- "Reel Titel" YYYY-MM-DD
```

Danach zwingend:

```bash
npm run ki:reel:structure-check
```

Ausführbarer Source nur unter `ki/src/reels/<slug>/`.

## Phasen

### Phase 1

- Inhalt/Skript
- neue Reels auf **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit planen
- bevorzugt **150–175 Wörter**, bis **190 Wörter** ohne Sonderfreigabe
- Visual Beats + Story-/Level-Up-Vertrag
- Remotion-Source
- Caption-Basis
- Plattform-Copy
- Brand-/Proof-/Real-Media-Plan
- Motion-Readability-Datei PENDING

Ab `2026-09-03` gilt Level-Up v3: mindestens 20 Visual Beats, 4 Visual Worlds, 2 Mid-Reel-Reframes und stärkere Brand-/Real-Media-Fidelity.

### Phase 2 — ausschließlich Nutzer-Audio

Der Nutzer erstellt das vollständige Voiceover selbst und legt es manuell unter dem in `reel.json.audio.targetFile` definierten Pfad ab, normalerweise `01-script-audio/voiceover.mp3`.

Agenten dürfen das Produktions-Voiceover **weder erzeugen noch herunterladen**. Keine TTS-/Voice-Tools, keine Provider-URLs und keine Preview-Dateien als Ersatz.

Fehlt die Datei:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

### Phase 3

- `prepare-reel-audio.mjs`: Runtime-WAV + ggf. Pause-Kompression
- lokales Forced Alignment
- `WORD-TIMINGS.json`, Szenen und Captions Voice-Locked
- tatsächliche finale Dauer 60–75 s oder dokumentierte Ausnahme
- SFX nach finalen Szenenframes auflösen
- externe Visuals lokal auflösen/validieren
- `prepare-reel-render.mjs` + Provenance-Lock
- Tests/Smoke/Contact-Sheet
- Roh-Render + Social-Audio-Master
- 1x Motion-Readability auf dem gemasterten MP4
- Finalizer + Export-Package-Validator

## Caption — eine Wahrheit

Bei 1080×1920 ausschließlich Shared-Geometrie aus `ki/src/reels/captionSafe.ts`:

- `bottom: 330px`
- `76px` horizontal
- `928px` max width
- ca. `40px` Schrift
- max. 2 Zeilen
- Ziel max. 6 Wörter je sichtbarer Gruppe
- Cover-Fenster caption-frei

## Audio — eine Wahrheit

Verbindlich `ki/gehirn/AUDIO_PIPELINE.md`.

Vor Production-Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

`Root.tsx` nutzt nur die vorbereitete lokale Runtime-Spur `public/runtime-audio/<compositionId>.wav` via `staticFile`.

## Visual Standard

- Light-First
- Product/UI-first bei Apps/Features
- Fullscreen-Hintergrund
- keine kleine Card-Insel in riesigem Leerraum
- `SETUP → AKTION → KONSEQUENZ → PAYOFF`
- `REVEAL → SETTLE → READABLE HOLD`
- High Energy ≠ High Speed
- Brand muss bei zentralen Markenstories visuell wirklich erkennbar sein
- Logos/Wordmarks nur aus echten zulässigen Assets oder klare Typografie als Fallback
- keine generischen Funktionsicons als Fake-Logo
- reale UI/Proof/Bilder/Videos nur mit Story-Zweck und lokaler Provenance
- keine Render-Time-Remote-Medien

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

Große MP4/WAV/MP3/PNG bleiben standardmäßig lokal/Artifact-Storage, solange Git LFS nicht eingerichtet ist.

## Wahrheitspflicht

Keine erfundenen Medien, Dateien, URLs, Testergebnisse oder Render-Claims. Nur tatsächlich ausgeführte Schritte als bestanden melden.
