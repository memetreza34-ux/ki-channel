# Cross-Platform Caption Safe Position — Short-Form

Diese Datei definiert die kanonische Untertitelposition für vertikale Production-Reels (1080×1920).

## Warum die Position geändert wird

Die realen Reel-Reviews vom 23.09.2026 zeigten zweimal dasselbe Problem: `bottom: 520px` und später `400px` wirkten noch zu hoch und zogen den Caption-Block zu stark in die Bildmitte.

Der neue V2.2-Standard setzt die Captions deshalb sichtbar tiefer. Der Smartphone-/Feed-Review bleibt Pflicht, weil Plattform-UI je nach App und Gerät variiert.

## Kanonischer KIwerkraum-Standard V2.2

Für 1080×1920 gilt:

- **Standard Caption Bottom Offset: `300px`**
- horizontaler Sicherheitsabstand: **`104px` links und rechts**
- bevorzugte maximale Textbreite: **`820px`**
- normalerweise **4–6 Wörter pro Sinnblock**
- maximal **2 Zeilen gleichzeitig**
- kein Hintergrundkasten
- aktiver Sprecherfokus in Marken-Lila
- finale Worttimings nur aus echtem Audio

Die Werte kommen zentral aus `ki/src/reels/captionSafe.ts`. Neue Reels dürfen keine eigenen Caption-Werte erfinden.

## Unterer Feed-/UI-Bereich

- die letzten ungefähr **220px** bleiben für kritische Informationen tabu
- ungefähr **220–280px vom unteren Rand** gelten als Puffer
- Standard-Caption beginnt bei `bottom: 300px`
- rechts weiterhin Abstand zur Interaktionsleiste berücksichtigen

## Beziehung zur Animation

Der tiefere Caption-Standard soll dem Hauptvisual mehr Raum geben. Für neue Reels darf das bedeutungstragende Visual ungefähr bis `y=1380–1420` reichen, solange es den Caption-Block nicht verdeckt.

Wenn Visual und Caption konkurrieren:

1. Visual neu komponieren
2. Objekt/Fokus verschieben
3. unnötige Objektlabels entfernen
4. erst danach Caption-Geometrie anfassen

## Text-Minimalismus

Im Hauptbild gibt es standardmäßig nur drei Textebenen:

1. kurze Szenenüberschrift + Icon oben
2. zwingend nötige Objekt-/UI-Labels im Visual
3. synchroner Sprecher-Caption unten

Nicht erlaubt als Standard:

- graue Hilfssätze unter dem Visual
- Meta-Erklärungen wie „vereinfachte Darstellung“ mitten im Bild
- Text, der nur wiederholt, was Caption oder Animation bereits erklärt
- zusätzliche vierte Textebene nur zur Absicherung

Eine fachlich notwendige Einschränkung gehört bevorzugt in den Sprechertext. Ein sichtbarer Hinweis bleibt nur dann im Visual, wenn er für die Wahrheit der Darstellung wirklich unverzichtbar ist.

## Source-Gate

Neue Production-Reels müssen:

- `REEL_CAPTION_SAFE.bottom` verwenden
- `REEL_CAPTION_SAFE.horizontalInset` respektieren
- keine alten lokalen Werte wie `264`, `270`, `360`, `400`, `460`, `500` oder `520` kopieren
- keine dekorativen grauen Hilfssätze einführen
- nach Geometrieänderungen neu rendern und auf Smartphone-/Feed-Größe prüfen

## Review-Gate

Ein Reel ist nicht freigegeben, wenn:

- Captions wieder unnötig hoch in der Bildmitte sitzen
- Captions mit Plattform-UI kollidieren
- Caption und Hauptvisual konkurrieren
- mehr als 2 Caption-Zeilen gleichzeitig sichtbar sind
- unnötige graue Zusatztexte eine vierte Textebene bilden
- ein alter Render nach einer Caption-Positionsänderung weiter als freigegeben gilt
