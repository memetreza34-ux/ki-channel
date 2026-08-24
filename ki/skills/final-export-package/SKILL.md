# Skill: Final Export Package

## Zweck

Ein Reel endet nicht bei einem beliebigen Render, sondern bei einem vollständigen, geprüften Paket unter `05-export/`.

## Zielstruktur

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

## Vor Production-Render

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Damit sind lokales Audio, Voice-Lock, finale Dauer/Szenen und Runtime-Audio vorbereitet.

## Nach finalem Render

1. finalen MP4 bei 1x ansehen/anhören
2. Motion-Readability-Review für **genau diesen MP4** ausfüllen
3. SHA256 + Dauer des MP4 in `MOTION-READABILITY-REVIEW.md` eintragen
4. Hero-/Cover-Zeit wählen und in `reel.json.export.coverTimeSeconds` setzen
5. `FINAL-CAPTION.txt` publish-ready
6. Finalizer:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
```

Der Finalizer blockiert vor dem Export, wenn eines fehlschlägt:

- Entertainment-Gate
- Voice-Lock-Gate
- Motion-Readability-Gate inkl. exaktem Video-Hash
- ggf. Source-Isolation
- Video-/Audio-/Lautheits-Gate

7. danach:

```bash
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

8. den **exportierten** MP4 nochmals ansehen und anhören
9. Cover + Caption prüfen

## Cover

Nicht blind Sekunde 0.

Cover-Frame muss:

- Thema sofort erkennen lassen
- vollständigen Hero-Zustand zeigen
- keine Zwischenanimation/Debug-UI zeigen
- in 9:16 funktionieren

Ohne gültige `coverTimeSeconds` schlägt der Finalizer fehl.

## Caption

Quelle:

`03-caption/FINAL-CAPTION.txt`

Platzhalter wie `OFFEN`, `TODO`, `TBD`, `PLATZHALTER` blockieren den Export.

## Binärdateien / Git

Das Paket liegt lokal im kanonischen `05-export/`. Große MP4/PNG-Dateien sind standardmäßig per `.gitignore` nicht normal Git-tracked, solange Git LFS nicht eingerichtet ist.

In Git bleiben Source, Caption, Provenance, Timing und Manifest-/Review-Logik. Nicht behaupten, ein ignoriertes Binary sei committed, wenn es das nicht ist.

## Endstatus

Erst nach Finalizer + Export-Package-Validator + tatsächlicher Hör-/Sichtprüfung:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
