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
- `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
- `01-script-audio/SCENE-VOICE-MAP.json`
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

### Zwei Skripte, zwei Aufgaben

`VOICEOVER-ZUM-KOPIEREN.txt` enthält **nur** das, was gesprochen wird.

`SCENE-VOICE-MAP.json` legt **vor Audio-Alignment** fest, welcher exakte Satz zu welcher Szene gehört.

Beispiel:

```text
S01 → scene1
S02 + S03 → scene2
S04 → scene3
```

Der Agent darf die Szenenzuordnung später nicht aus dem kompletten Audio erraten. Alignment beantwortet nur noch die Frage: **Wann wird der bereits gemappte Satz tatsächlich gesprochen?**

## Phase 2 — Voiceover

Voiceover darf real per verfügbarem Tool oder durch Nutzer/Mensch entstehen. Details ausschließlich in `ki/gehirn/AUDIO_PIPELINE.md`.

Remote-URL ist Provenance, kein Render-Master.

## Phase 3 — Lock, Review, Render, Export

Pflichtreihenfolge:

1. lokales Audio vorhanden
2. Runtime-PCM-WAV erzeugen
3. echte Wortzeiten / Alignment auf dieser Runtime-WAV
4. `SCENE-VOICE-MAP.json` gegen Sprechertext + Caption-Zuordnung prüfen
5. Caption-Cues aus echten Wortzeiten bilden
6. Szenenstart an das erste gemappte gesprochene Wort der jeweiligen Szene setzen
7. `reel.json`-Szenengrenzen + Composition-Dauer auf echtes Audio schreiben
8. `validate-scene-voice-map.mjs`
9. `validate-voice-locked-captions.mjs`
10. `prepare-reel-render.mjs`
11. Source-/TypeScript-/fokussierte Tests
12. Smoke/Hero/Contact Sheet
13. 1x Motion-/Audio-/Caption-Sync-Review
14. finaler MP4
15. Video-/Audio-Gate
16. Finalizer
17. Export-Package-Validator
18. exportiertes Video ansehen und anhören

## Scene-/Caption-Sync

Verbindlich:

- Caption-Blöcke dürfen einen Satz in kleinere Einheiten teilen.
- Sie dürfen einen Satz aber **nicht in eine andere Szene verschieben**.
- Alle Caption-Texte einer Szene zusammen müssen exakt den in `SCENE-VOICE-MAP.json` gemappten Sprechertext dieser Szene rekonstruieren.
- Bei finalem `VOICE_LOCKED` startet Szene 2+ am ersten gemappten gesprochenen Wort innerhalb des erlaubten Toleranzfensters.
- Szene 1 darf nur einen kleinen definierten Intro-Lead vor dem ersten Wort haben.
- Alte Planframes sind keine finale Szenen-Autorität.

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

Einzige Layout-Wahrheit:

- `ki/gehirn/CAPTION_SAFE_POSITION.md`
- `ki/src/reels/captionSafe.ts`

Kanonisch bei 1080×1920:

- `bottom: 250px`
- `104px` horizontaler Inset
- `860px` max width
- max. 2 Zeilen
- Glass-/Blur-Overlay
- kein separater Footer / kein zweiter Hintergrund

Timing-Wahrheit:

- Runtime-WAV
- `SCENE-VOICE-MAP.json`
- echte Wortzeiten in `subtitle-cues.json`

## Audio/Render

Vor Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Vor Finalisierung:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt Entertainment-, Scene-Voice-, Voice-Lock-, Motion-, ggf. Source-Isolation- und Video-/Audio-Gates selbst aus. `SCENE-VOICE-MAP.json` wird außerdem per SHA256 in den Render-Provenance-Lock gebunden.

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
