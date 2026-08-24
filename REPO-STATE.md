# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-24

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` bleibt der einzige kanonische Produktionsstand.

Aktuelle Stabilisierung läuft in:

- Branch: `fix/repo-stabilisierung-2026-08-24`
- Draft-PR: **#28**, direkt gegen `main`

Wichtig: Die Änderungen dieses Branches werden erst nach einem späteren Merge kanonischer `main`-Stand. Die früher gestapelten Draft-PRs #26 und #27 sind als **SUPERSEDED** geschlossen; ihre Branches sind nur Historie.

Neue normale Arbeiten starten nach der Stabilisierung wieder von `main` auf einem neuen Arbeitsbranch.

## 2. Verbindliche Lesereihenfolge

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. passende Domäne:
   - Reels → `ki/reels/AGENTS.md`
   - Audio → `ki/gehirn/AUDIO_PIPELINE.md`
   - Longform → `ki/youtube-longform/AGENTS.md`
   - Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`
6. named Produktionspaket + dessen Source-Vertrag

Ältere PR-Beschreibungen, historische Branches und alte Layoutwerte überschreiben diese Reihenfolge nicht.

## 3. Short-Form-Struktur

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

Ausführbarer Remotion-Code:

`ki/src/reels/<slug>/`

Planung und ausführbarer Source bleiben getrennt.

## 4. Produktionsphasen

### Phase 1 — Inhalt + Source

Skript, Visual Beats, Source, Preview-Captions, Plattform-Copy, Assets, Entertainment-Review und Motion-Review-Datei vorbereiten.

### Phase 2 — reales Voiceover beschaffen

Voiceover darf tatsächlich:

1. mit einem verfügbaren Voice-/TTS-Tool erzeugt werden, oder
2. durch Nutzer/Mensch bereitgestellt werden.

Remote-/Provider-URL ist nur Provenance. Finaler Audio-Master muss lokal vorliegen.

### Phase 3 — Audio-Lock + Render + Export

```text
lokales Audio
→ ffprobe
→ präzise Wort-Timestamps / Voice-Lock
→ finale Szenen + finalDurationInFrames
→ prepare-reel-render.mjs
→ Tests / Smoke / Contact Sheet
→ Final-Render
→ 1x Motion-Review für exakt diesen MP4
→ Finalizer
→ Export-Package-Validator
→ finales Video ansehen + anhören
```

## 5. Kanonische Audio-Pipeline

Einzige Audio-Wahrheit: `ki/gehirn/AUDIO_PIPELINE.md`.

Vor Production-Render:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Dieser Preflight erzwingt final gelockte Szenen/Dauer, Voice-Lock und lokalen Audio-Master und erzeugt das ignorierte Runtime-Asset:

`public/runtime-audio/<compositionId>.mp3`

`ki/src/Root.tsx` verwendet diese lokalen Runtime-Assets über `staticFile`. Keine statischen Imports auf ignorierte Reel-Audio-Binaries und keine Render-Time-TTS-/CDN-URLs.

## 6. Kanonische Caption-Geometrie

Einzige Quelle:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Für 1080×1920 aktuell:

- `bottom: 250px`
- `104px` horizontaler Inset
- `860px` max width
- max. 2 Zeilen
- halbtransparente Glass-/Blur-Overlay-Caption
- Fullscreen-Hintergrund bleibt durchgehend
- kein separater weißer Footer / kein zweiter Hintergrund

Alte 520px-/boxless-Regeln sind nicht mehr kanonisch.

## 7. Visual-/Motion-Standard

- Light-First
- Product/UI-first bei konkreten Apps/Features
- Fullscreen-Komposition
- Setup → Aktion → Konsequenz → Payoff
- Hero-Moment pro Szene
- High Energy ≠ High Speed
- wichtige Zustände: Reveal → Settle → Readable Hold
- 1–2 neue unabhängige Informationsobjekte gleichzeitig
- dunkle Fullscreen-Szenen nur als dokumentierte Ausnahme

Der Motion-Review muss zum **exakten finalen MP4** gehören: SHA256 + Dauer werden validiert.

## 8. Finaler Export

Ein Reel ist nicht fertig bei `render complete`.

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <final-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt erneut Entertainment-, Voice-Lock-, Motion-, ggf. Source-Isolation- und Video-/Audio-Gates aus.

Kanonisches lokales Endpaket:

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

## 9. Git-/Medienstrategie

Git versioniert reproduzierbare Produktionswahrheit:

- Source
- Skripte
- Provenance
- Timing-/Whisper-Daten
- Contracts
- Reviews
- Manifest/Metadaten

Große MP4/WAV/MP3/PNG-Dateien bleiben standardmäßig lokal bzw. in Artifact-Storage, solange Git LFS nicht eingerichtet ist. `.gitignore` und Produktionsregeln sind darauf abgestimmt.

## 10. Aktiver Study-Mode-Status

Der reale bereitgestellte Study-Mode-Render (~40.192 s) ist **Review-Evidence, nicht Finalfreigabe**.

Aktuell dokumentierte Fails:

- mehrere Beats zu schnell
- Informationsstapel in Szene 2/3
- eine unerwünschte dunkle Fullscreen-Szene
- Schluss-Hold zu kurz

`MOTION-READABILITY-REVIEW.md` bleibt deshalb korrekt auf `FAIL`, bis ein neuer aktueller Render diese Punkte behebt.

## 11. Bekannte externe / noch ungeprüfte Punkte

- GitHub Actions/Runner waren zuletzt auf Konto-/Billing-Ebene eingeschränkt; kein CI-Run ist deshalb automatisch Qualitätsbeweis.
- Ein kanonisches `package-lock.json` ist noch nicht erzeugt. Kein erfundener Lockfile-Inhalt committen.
- Nach dieser Stabilisierung sind vollständiger frischer `npm install`, Repo-Typecheck, Vitest und Remotion-Bundle **noch tatsächlich auszuführen**, bevor PR #28 merge-ready werden darf.
- `ki/scripts/validate-production-contracts.mjs` wurde als Regression-Check angelegt; auch dieser muss in einem echten Checkout ausgeführt werden, bevor sein PASS behauptet wird.

## 12. Statusbegriffe

Diese Zustände niemals vermischen:

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
veröffentlicht
```

Nur tatsächlich ausgeführte Prüfungen als bestanden melden.
