# YouTube Upload / Release Check

Diese Checkliste behandelt die Veröffentlichung, nicht die eigentliche Content-Produktion.

## Vor Upload

- finaler Master ist wirklich freigegeben
- Voiceover stimmt mit Timeline/Visuals überein
- keine internen Regie-/Debug-Texte sichtbar
- Titel ist korrekt und nicht irreführend
- Beschreibung ergänzt statt Transcript zu kopieren
- Thumbnail/Cover passt zur tatsächlichen Aussage
- keine Wasserzeichen oder fremden Logos ohne inhaltlichen/rechtlichen Grund
- Quellen/Links sind geprüft und relevant
- externe Medien besitzen dokumentierte Herkunft/Rechte

## Longform-v1-Upload-Paket

Neue Longform-v1-Pakete sollen vor Veröffentlichung in `05-export/` mindestens enthalten:

```text
video.mp4
thumbnail-selected.png
title.txt
description.md
chapters.txt
subtitles.srt
subtitles.vtt
transcript.txt
sources.md
manifest.json
```

Das maschinenprüfbare Release-Gate ist:

```bash
node scripts/check-ki-longform-release.mjs ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel
```

`PASSED` darf nur als technischer Vertragsbeleg verstanden werden. Der vollständige visuelle und akustische Master-Review bleibt Pflicht.

## Plattform-Metadaten

Für Shorts kommen die vorbereiteten Texte aus:

```text
03-caption/platform-copy.md
```

Für Longform kommen Titel, Beschreibung, Kapitel, Untertitel und Quellen aus dem jeweiligen Longform-Paket und seinem finalen Export.

Vor Veröffentlichung bei Bedarf aktuell prüfen:

- zulässige Upload-Spezifikation
- aktuelle Shorts-/Longform-Erkennung
- Monetarisierungs-/Werberegeln
- Links/Funktionen
- Musik-/Rechtebedingungen

Zeitabhängige Plattformfakten nicht aus alten Repo-Notizen übernehmen.

## Nach Upload

- Titel/Thumbnail korrekt dargestellt
- keine unerwarteten Beschnitt-/Untertitel-Probleme
- Beschreibung/Links korrekt
- Kapitel funktionieren
- veröffentlichte Version entspricht dem freigegebenen Master
- Untertitel sind synchron und korrekt

Performance-Metriken dürfen später analysiert und für kommende Videos genutzt werden, aber schlechte Performance ist kein Grund, Fakten oder Markenregeln rückwirkend zu verfälschen.
