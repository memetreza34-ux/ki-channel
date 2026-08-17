# Cross-Platform Caption Safe Position — Short-Form

Diese Datei definiert die kanonische Untertitelposition für vertikale Production-Reels (1080×1920).

## Warum die alte Position geändert wird

Die bisherige Standardposition um `bottom: 264–270px` liegt im Feed zu tief. Dort konkurrieren Untertitel je nach Plattform und Gerät mit Beschreibung, Accountname, CTA, Audiozeile, Navigations- und Interaktions-UI. Plattformen verschieben diese UI teilweise dynamisch; deshalb gibt es keine einzelne pixelgenaue offizielle Position, die auf jedem Gerät garantiert identisch ist.

## Neuer KIwerkraum-Standard

Für 1080×1920 gilt ab jetzt:

- **Standard Caption Bottom Offset: `460px`**
- Zielbereich des sichtbaren Untertitelblocks: ungefähr **y=1340–1470**
- Untertitel bleiben horizontal zentriert
- normalerweise **4–6 Wörter pro sichtbarem Sinnblock**
- maximal **2 Zeilen gleichzeitig**
- kein Hintergrundkasten; Lesbarkeit über kontrollierten Halo/Schatten
- aktiver Sprecherfokus weiterhin Marken-Lila

Damit liegt der Text im unteren Mittelbereich des Inhalts statt direkt im plattformnahen unteren Randbereich.

## Unterer UI-/Dead-Bereich

Der untere Bereich wird konservativ behandelt:

- die letzten ungefähr **360px** niemals für Untertitel oder andere kritische Informationen verwenden
- ungefähr **360–440px vom unteren Rand** nur als Puffer behandeln, nicht als bevorzugte Caption-Position
- Untertitel standardmäßig mit `bottom: 460px` darüber halten

Diese Werte sind ein kanalinterner Cross-Platform-Sicherheitsstandard, keine Behauptung über eine identische UI-Geometrie aller Apps.

## Beziehung zur Animation

Die Caption darf nicht dadurch gerettet werden, dass sie wieder nach unten geschoben wird.

Wenn ein Hauptvisual mit der neuen Caption-Position konkurriert:

1. Visual höher platzieren
2. Visual kompakter komponieren
3. interne Labels kürzen
4. Visual neu bauen, wenn nötig

**Nicht:** Caption wieder in den unteren Feed-/UI-Bereich verschieben.

Für neue Reels soll der bedeutungstragende Hauptinhalt nach Möglichkeit bis ungefähr `y=1280–1320` abgeschlossen sein. Der bestehende technische Clip-Guard ist nur die letzte Sicherung und ersetzt keinen realen Kollisionscheck.

## Review-Gate

Ein Reel ist nicht visuell freigegeben, wenn:

- Untertitel sichtbar im unteren Plattform-UI-Bereich hängen
- Untertitel zu nah an Accountname/Beschreibung/Buttons liegen
- Caption und Hauptvisual konkurrieren
- die Caption für Platzgewinn unter `bottom: 440px` geschoben wurde
- ein alter Render nach einer Caption-Positionsänderung weiter als freigegeben gilt

Nach Änderung der Caption-Position ist immer ein neuer Render plus Smartphone-/Feed-Sichttest erforderlich.
