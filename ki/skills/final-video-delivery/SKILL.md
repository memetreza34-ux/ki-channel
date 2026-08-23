# Skill: Final Video Delivery

## Zweck

Dieser Skill verhindert, dass ein Agent ein stummes, unfertiges oder nur teilweise geprüftes Video als fertige Abgabe zeigt.

## Harte Regel

Der Agent darf ein Reel **nicht** als fertiges Video an den Nutzer übergeben, solange Phase 3 nicht vollständig abgeschlossen ist.

Ein Zwischen-Render, Smoke-Render, Preview-Render oder stummer Test-Render ist interne Arbeitsware. Er darf nicht als finale Abgabe präsentiert werden, außer der Nutzer fordert ausdrücklich eine Preview an.

## Fertig bedeutet

Vor der finalen Ausgabe müssen alle Punkte erfüllt sein:

1. echtes Voiceover liegt vor und ist in der Composition eingebunden
2. finale Composition-Dauer folgt dem tatsächlich verwendeten Audio
3. Whisper-/Voice-Lock-Timing wurde angewendet
4. Captions und Visual Beats wurden hörbar gegen die Stimme geprüft
5. finaler MP4 wurde aus dem aktuellen Source-Stand gerendert
6. MP4 enthält einen Videostream
7. MP4 enthält einen Audiostream
8. Audio ist nicht stumm oder praktisch unhörbar
9. finale MP4 wurde in normaler Geschwindigkeit angesehen und angehört
10. keine offene Revision oder `RERENDER ERFORDERLICH`-Markierung bleibt bestehen
11. `03-caption/FINAL-CAPTION.txt` ist publish-ready
12. ein geeigneter Cover-Hero-Frame wurde nach dem visuellen Review gewählt
13. `reel.json.export.coverTimeSeconds` ist gesetzt
14. das finale Publish-Paket wurde automatisch unter `05-export/` erzeugt
15. das Export-Paket wurde mit `validate-reel-export-package.mjs` bestanden

## Technischer Final-Gate

Vor jeder finalen Video-Abgabe ausführen:

```bash
node ki/scripts/validate-final-video.mjs <final-video.mp4>
```

Der Check muss erfolgreich sein. Er prüft mindestens:

- Videostream vorhanden
- Audiostream vorhanden
- gültige Container-Dauer
- Audio-Lautheit messbar
- Audio nicht praktisch stumm

Wenn der Check fehlschlägt, ist die Aufgabe **nicht fertig**. Fehler beheben, erneut rendern und erneut prüfen.

## Audio-Hörprüfung bleibt Pflicht

Ein vorhandener Audiostream allein reicht nicht. Der Agent muss die finale Datei tatsächlich anhören bzw. technisch und auditiv gegen das erwartete Voiceover prüfen.

Fehlerbeispiele:

- MP4 hat Audio-Track, aber Voiceover ist nicht hörbar
- falscher Audio-Track eingebunden
- Audio beginnt zu spät oder endet zu früh
- Audio ist stark zu leise
- Caption läuft vor/hinter der Stimme
- finaler Export stammt noch aus einem Stand vor der Audio-Integration

Bei einem dieser Fälle: keine Abgabe.

## Finaler Export ist Teil der Fertigstellung

Nach bestandenem Audio-/Video-Gate darf der Agent nicht einfach den Renderpfad nennen und stoppen.

Er muss anschließend ausführen:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Das finale Paket muss unter `05-export/` liegen und enthalten:

```text
<compositionId>.mp4
<compositionId>-cover.png
<compositionId>-caption.txt
<compositionId>-export-manifest.json
```

Wichtig: `finalize-reel-export.mjs` prüft **vor dem Kopieren** erneut das Video-Audio-Gate. Ein stummes Video darf niemals als finales MP4 in `05-export/` landen.

## Verhalten gegenüber dem Nutzer

Wenn der Nutzer eine **fertige Video-Abgabe** verlangt:

- intern weiterarbeiten, bis alle finalen Gates erfüllt sind
- keine unfertige Preview als Endergebnis zeigen
- kein stummes Video als fertig bezeichnen
- nicht bei `render complete` stoppen
- nicht bei einem MP4 außerhalb von `05-export/` stoppen
- vollständiges Export-Paket mit Cover und Caption erzeugen
- erst die vollständige finale Datei mit hörbarem Voiceover zeigen
- danach die Aufgabe beenden

Der Agent soll nicht mitten in Phase 3 stoppen und den Nutzer mit einem halbfertigen Export zurücklassen.

## Ausnahme: ausdrücklich gewünschte Preview

Nur wenn der Nutzer ausdrücklich etwas wie „zeig mir die Preview“, „zeig mir einen Zwischenstand“ oder „erstmal ohne Audio“ verlangt, darf ein unfertiger Render gezeigt werden. Er muss dann klar als **PREVIEW / NICHT FINAL** gekennzeichnet sein und darf nicht in den kanonischen finalen Exportnamen geschrieben werden.

## Statussprache

Zulässig vor Fertigstellung:

- `PHASE 2 AUDIO FEHLT`
- `PHASE 3 IN ARBEIT`
- `REVISION IMPLEMENTIERT — RERENDER ERFORDERLICH`
- `FINAL-GATE FEHLGESCHLAGEN`
- `EXPORT PACKAGE FEHLT`
- `EXPORT PACKAGE GATE FEHLGESCHLAGEN`

Erst nach bestandenem Final- und Export-Gate:

- `FINAL VIDEO READY — EXPORT PACKAGE READY`
