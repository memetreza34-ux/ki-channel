# Skill: Final Video Delivery

## Zweck

Verhindert, dass stumme, ungeprüfte oder veraltete Render als fertig gezeigt werden.

## Vor Production-Render

Pflichtreihenfolge:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
# Whisper/Voice-Lock gegen public/runtime-audio/<compositionId>.wav
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Der Runtime-Audio-Schritt erzeugt die **48-kHz-PCM-WAV**, die Remotion tatsächlich rendert. Genau diese WAV ist finale Wort-/Frame-Timing-Autorität.

`prepare-reel-render.mjs` blockiert:

- fehlenden lokalen Audio-Master / fehlende Runtime-WAV
- nicht Voice-Locked Captions
- nicht Voice-Locked Szenen
- alte Planning-Dauer statt `finalDurationInFrames`
- nicht kontinuierliche Szenengrenzen
- fehlgeschlagene Entertainment-/ggf. Source-Isolation-Gates
- einen schmutzigen Git-Arbeitsstand

Zusätzlich erzeugt es einen `RENDER_LOCKED`-Datensatz mit Git-Commit sowie Source-/Contract-/Caption-/Audio-Hashes.

## Fertig bedeutet

Vor der finalen Ausgabe:

1. lokales Voiceover existiert
2. Runtime-PCM-WAV existiert und ist Timing-/Render-Autorität
3. Szenen + finale Duration folgen dieser Audiospur
4. Captions haben echte Wort-Timestamps
5. Source/TypeScript/fokussierte Tests sind aktuell
6. finaler MP4 stammt aus dem gelockten Source-/Audio-/Timing-Stand
7. Video + hörbares Audio vorhanden
8. MP4 bei 1x geprüft
9. Motion-Readability-Review gehört per SHA256 **genau zu diesem MP4**
10. keine offene Revision
11. `FINAL-CAPTION.txt` publish-ready
12. Cover-Hero gewählt
13. Finalizer inkl. Render-Provenance erfolgreich
14. Export-Package-Validator erfolgreich
15. exportierten MP4 tatsächlich angesehen und angehört

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
- Render-Provenance-Gate gegen den vorher erzeugten `RENDER_LOCKED`-Datensatz

Ein alter MP4, ein Render aus einem anderen Source-Commit oder ein Render nach veränderten gelockten Inputs darf nicht finalisiert werden.

Erst danach erzeugt der Finalizer:

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

Das Manifest speichert Provenance- und Artifact-SHA256-Werte. Der Export-Package-Validator verlangt, dass der exportierte MP4 byte-identisch mit dem tatsächlich reviewten MP4 ist.

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
- `RENDER-PROVENANCE GATE FEHLGESCHLAGEN`
- `FINAL-GATE FEHLGESCHLAGEN`

Erst nach allem:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
