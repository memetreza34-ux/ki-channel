# Skill: Final Video Delivery

## Zweck

Verhindert, dass stumme, ungeprüfte oder veraltete Render als fertig gezeigt werden.

## Vor Production-Render

Pflicht:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Dieser Schritt blockiert:

- fehlenden lokalen Audio-Master
- nicht Voice-Locked Captions
- nicht Voice-Locked Szenen
- alte Planning-Dauer statt `finalDurationInFrames`
- nicht kontinuierliche Szenengrenzen
- fehlgeschlagene Entertainment-/ggf. Source-Isolation-Gates

und bereitet das lokale Runtime-Audio für Remotion vor.

## Fertig bedeutet

Vor der finalen Ausgabe:

1. lokales Voiceover existiert
2. Szenen + finale Duration folgen echtem Audio
3. Captions haben echte Wort-Timestamps
4. Source/TypeScript/fokussierte Tests sind aktuell
5. finaler MP4 stammt aus aktuellem Source
6. Video + hörbares Audio vorhanden
7. MP4 bei 1x geprüft
8. Motion-Readability-Review gehört per SHA256 **genau zu diesem MP4**
9. keine offene Revision
10. `FINAL-CAPTION.txt` publish-ready
11. Cover-Hero gewählt
12. Finalizer erfolgreich
13. Export-Package-Validator erfolgreich
14. exportierten MP4 tatsächlich angesehen und angehört

## Final-Gate

```bash
node ki/scripts/validate-final-video.mjs <final-video.mp4>
```

Prüft mindestens Video-/Audiostream, Dauer und Lautheit.

Ein Audiostream allein reicht nicht; die Datei muss auch auditiv gegen das erwartete Voiceover geprüft werden.

## Finaler Export

Nach dem echten 1x-Review und eingetragener SHA256/Dauer:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Der Finalizer führt selbst erneut aus:

- Entertainment-Gate
- Voice-Lock-Gate
- Motion-Readability-Gate gegen exakt den übergebenen MP4
- ggf. Source-Isolation
- Video-/Audio-Gate

Erst danach erzeugt er:

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

## Nutzer-Abgabe

Wenn der Nutzer ein fertiges Video verlangt:

- nicht bei Preview/Smoke stoppen
- nicht bei `render complete` stoppen
- kein stummes Video zeigen
- kein MP4 außerhalb des kanonischen Export-Pakets als final behandeln
- erst nach allen Gates die finale Datei zeigen

## Preview-Ausnahme

Nur bei ausdrücklich gewünschter Preview darf ein unfertiger Render gezeigt werden. Klar als `PREVIEW / NICHT FINAL` kennzeichnen und nicht unter kanonischem Finalnamen exportieren.

## Statussprache

Vor Fertigstellung z. B.:

- `AUDIO DOWNLOAD/PREP FEHLT`
- `VOICE-LOCK FEHLT`
- `REVISION IMPLEMENTIERT — RERENDER ERFORDERLICH`
- `MOTION-READABILITY GATE FEHLGESCHLAGEN`
- `FINAL-GATE FEHLGESCHLAGEN`

Erst nach allem:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
