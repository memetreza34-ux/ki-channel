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

Zuerst Runtime-WAV erzeugen und Voice-Lock auf genau diese Audioquelle legen. Danach:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Der Pre-Render-Gate verlangt einen sauberen Git-Arbeitsstand und erzeugt lokal einen `RENDER_LOCKED`-Datensatz. Dieser bindet den bevorstehenden Render an:

- Git-Commit
- Source-Tree-SHA256
- renderrelevanten Reel-Contract-SHA256
- Caption-JSON-SHA256
- kanonischen Audio-SHA256
- Runtime-WAV-SHA256
- finale Composition-Dauer

Ohne diesen Lock ist ein späterer Final-Export nicht zulässig.

## Nach finalem Render

1. finalen MP4 bei 1x ansehen/anhören
2. Motion-Readability-Review für **genau diesen MP4** ausfüllen
3. SHA256 + Dauer des MP4 in `MOTION-READABILITY-REVIEW.md` eintragen
4. Hero-/Cover-Zeit wählen und in `reel.json.export.coverTimeSeconds` setzen
5. `FINAL-CAPTION.txt` publish-ready machen
6. Review-/Exportmetadaten committen, ohne renderrelevante Source-/Timing-/Audio-Daten zu verändern
7. Finalizer ausführen:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
```

Der Finalizer blockiert vor dem Export, wenn eines fehlschlägt:

- Entertainment-Gate
- Voice-Lock-Gate
- Motion-Readability-Gate inkl. exaktem Video-Hash
- ggf. Source-Isolation
- Video-/Audio-/Lautheits-Gate
- Render-Provenance-Gate

Das Provenance-Gate lehnt insbesondere ab:

- MP4 älter als der Render-Lock
- geänderten Source-Tree
- geänderten renderrelevanten Reel-Contract
- geänderte Voice-Locked Captions
- geänderten kanonischen Audio-Master
- geänderte Runtime-WAV

Post-Render-Exportmetadaten wie der nach Sichtprüfung gewählte `coverTimeSeconds` dürfen geändert werden, solange der renderrelevante Contract identisch bleibt.

8. danach:

```bash
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Export-Package-Validator prüft zusätzlich die SHA256-Werte von MP4, Cover und Caption und verlangt, dass der exportierte MP4 byte-identisch mit dem tatsächlich reviewten MP4 ist.

9. den **exportierten** MP4 nochmals ansehen und anhören
10. Cover + Caption prüfen

## Export-Manifest

Das Manifest dokumentiert mindestens:

- Render-Source-Commit
- Finalization-Commit
- Source-Tree-Hash
- Render-Contract-Hash
- Caption-Hash
- Master-/Runtime-Audio-Hash
- Review-Video-Hash
- finale MP4-/Cover-/Caption-Hashes
- alle bestandenen Gates

Damit kann ein alter oder fremder Render nicht still als aktueller Export ausgegeben werden.

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
