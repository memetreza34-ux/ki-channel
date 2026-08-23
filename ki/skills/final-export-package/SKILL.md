# Skill: Final Export Package

## Zweck

Dieser Skill erzwingt, dass Antigravity/Codex nach einem fertigen Reel nicht bei einem beliebigen Render stoppt, sondern automatisch ein vollständiges, veröffentlichungsnahes Paket unter `05-export/` erzeugt.

## Harte Regel

Ein Short-Form-Reel ist **nicht fertig**, solange der finale Exportordner nicht mindestens enthält:

- finalen MP4 mit hörbarem Voiceover
- eigenes Cover aus einem nach Contact-Sheet-/Hero-Review gewählten Frame
- finale Social-Caption als Textdatei
- Export-Manifest

Ein MP4 irgendwo in `/tmp`, `out/`, `renders/`, Projekt-Root oder einem Preview-Pfad ist **keine finale Abgabe**.

## Kanonischer Ablauf

Nach dem finalen Remotion-Render:

1. finalen Render noch **nicht** als fertig ausgeben
2. `validate-final-video.mjs` muss Video + hörbares Audio erfolgreich bestätigen
3. besten Hero-/Cover-Frame aus Smoke-/Contact-Sheet-Review wählen
4. dessen Zeit in `06-projektdateien/reel.json` unter `export.coverTimeSeconds` eintragen
5. `03-caption/FINAL-CAPTION.txt` mit der final vorgesehenen Social-Caption vervollständigen
6. Finalize-Befehl ausführen:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
```

7. nur wenn der Befehl `FINAL EXPORT PACKAGE READY` meldet, darf die Aufgabe als fertig gelten
8. finalen MP4 im `05-export/` vollständig ansehen **und anhören**
9. Cover prüfen: lesbar, stark, keine ungünstige Zwischenanimation
10. Caption prüfen: keine Platzhalter, keine falschen Fakten, publish-ready

## Audio ist Blocker Nummer 1

Der Finalize-Befehl führt **vor jedem Kopieren** das Final-Video-Gate aus.

Wenn kein Audiostream vorhanden ist oder das Audio praktisch stumm ist:

- kein finales MP4 in `05-export/` erzeugen
- kein Cover/Manifest als fertiges Paket erzeugen
- Status `FINAL-GATE FEHLGESCHLAGEN`
- Audio korrekt integrieren
- neu rendern
- erneut finalisieren

Ein Video ohne Voiceover darf niemals nur deshalb in `05-export/` landen, weil der visuelle Render erfolgreich war.

## Zielstruktur

Beispiel für Composition `KI-MeinReel`:

```text
05-export/
├── KI-MeinReel.mp4
├── KI-MeinReel-cover.png
├── KI-MeinReel-caption.txt
└── KI-MeinReel-export-manifest.json
```

Smoke-Frames oder Review-Renders dürfen zusätzlich vorhanden sein, sind aber keine finale Abgabe.

## Cover-Regel

Cover nicht blind bei Sekunde 0 erzeugen.

Antigravity muss nach dem visuellen Review einen starken Frame wählen, der:

- das Thema sofort erkennen lässt
- keine halb eingeklappte oder unfertige Animation zeigt
- wichtige UI/Objekte nicht verdeckt
- im 9:16-Crop funktioniert
- nicht von Captions oder Debug-Elementen dominiert wird

Die Zeit wird als Sekundenwert in `reel.json` gespeichert:

```json
{
  "export": {
    "coverTimeSeconds": 3.4
  }
}
```

Ohne gültige Cover-Zeit muss der Finalize-Befehl fehlschlagen.

## Caption-Regel

Die kanonische finale Caption liegt vor dem Export hier:

```text
03-caption/FINAL-CAPTION.txt
```

Der Finalize-Befehl kopiert sie in den Exportordner. `OFFEN`, `TODO`, `TBD` oder Platzhalter blockieren den Export.

## Verhalten von Antigravity

Wenn der Nutzer ein fertiges Reel verlangt, endet der Agent nicht bei:

- `render complete`
- Smoke-Render
- stummer MP4
- Preview-Datei
- MP4 außerhalb von `05-export/`

Er arbeitet weiter bis **Exportpaket + Audio + Cover + Caption** vollständig vorliegen.

Erst dann ist zulässig:

`FINAL VIDEO READY — EXPORT PACKAGE READY`
