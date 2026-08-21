# Cross-Platform Caption Safe Position — Short-Form

Diese Datei definiert die kanonische Untertitelposition für vertikale Production-Reels (1080×1920).

## Warum die alte Position geändert wird

Die bisherige Standardposition um `bottom: 264–270px` liegt im echten Feed deutlich zu tief. Ein veröffentlichter Instagram-Reel-Screenshot aus dem Kanal zeigte, dass der Untertitel optisch direkt über Accountname/Beschreibung sitzt und dadurch mit der Plattform-UI konkurriert.

Die erste Korrektur auf `bottom: 460px` war besser, wird nach diesem echten Feed-Beispiel aber noch konservativer kalibriert.

## Kanonischer KIwerkraum-Standard

Für 1080×1920 gilt ab jetzt:

- **Standard Caption Bottom Offset: `520px`**
- horizontaler Sicherheitsabstand: **`104px` links und rechts**
- bevorzugte maximale Textbreite: **`820px`**
- sichtbarer Untertitelblock typischerweise ungefähr **y=1280–1400**, abhängig von Schriftgröße und 1–2 Zeilen
- normalerweise **4–6 Wörter pro sichtbarem Sinnblock**
- maximal **2 Zeilen gleichzeitig**
- kein Hintergrundkasten; Lesbarkeit über kontrollierten Halo/Schatten
- aktiver Sprecherfokus weiterhin Marken-Lila

Die Werte werden im Source zentral aus `ki/src/reels/captionSafe.ts` bezogen. Neue Reels dürfen keine eigenen tieferen Caption-Werte erfinden.

## Unterer UI-/Dead-Bereich

Der untere Bereich wird konservativ behandelt:

- die letzten ungefähr **420px** niemals für Untertitel oder andere kritische Informationen verwenden
- ungefähr **420–500px vom unteren Rand** nur als Puffer behandeln
- Untertitel standardmäßig mit `bottom: 520px` oberhalb dieses Puffers halten
- rechts zusätzlichen Abstand zur Interaktionsleiste berücksichtigen; kritischer Caption-Text soll nicht bis an die rechte Videokante laufen

Diese Werte sind ein kanalinterner Cross-Platform-Sicherheitsstandard auf Basis des realen Kanal-Feed-Eindrucks. Plattform-UI kann je nach App, Gerät und Oberfläche variieren.

## Beziehung zur Animation

Die Caption darf nicht dadurch gerettet werden, dass sie wieder nach unten geschoben wird.

Wenn ein Hauptvisual mit der Caption konkurriert:

1. Visual höher platzieren
2. Visual kompakter komponieren
3. interne Labels kürzen
4. Visual neu bauen, wenn nötig

**Nicht:** Caption wieder in den unteren Feed-/UI-Bereich verschieben.

Für neue Reels gilt eine harte vertikale Trennung: Header `y=110–260`, Animation ausschließlich `y=300–1160`, danach mindestens `100px` freie Luft bis zur konservativen Zwei-Zeilen-Caption. Der technische Clip-Guard ist nur die letzte Sicherung und ersetzt keinen realen Kollisionscheck.

## Source-Gate für zukünftige Reels

Neue Production-Reels müssen:

- `REEL_CAPTION_SAFE.bottom` aus `ki/src/reels/captionSafe.ts` verwenden oder exakt daraus abgeleitete Shared-Komponenten nutzen
- `REEL_CAPTION_SAFE.horizontalInset` respektieren
- keine Altwerte wie `bottom: 264`, `270`, `360`, `440` oder `460` als eigene Caption-Position einführen
- bei 1080×1920 nicht unter `bottom: 500px` gehen, außer der Nutzer verlangt ausdrücklich ein anderes Layout und der Feed-Review bestätigt es
- bei Änderungen an der Safe-Geometrie neu rendern und auf Smartphone-/Feed-Größe prüfen

## Review-Gate

Ein Reel ist nicht visuell freigegeben, wenn:

- Untertitel sichtbar im unteren Plattform-UI-Bereich hängen
- Untertitel zu nah an Accountname/Beschreibung/CTA liegen
- Caption rechts mit Like/Kommentar/Share-UI konkurriert
- Caption und Hauptvisual konkurrieren
- mehr als 2 Caption-Zeilen gleichzeitig sichtbar sind
- die Caption für Platzgewinn unter `bottom: 500px` geschoben wurde
- ein alter Render nach einer Caption-Positionsänderung weiter als freigegeben gilt

Nach Änderung der Caption-Position ist immer ein neuer Render plus Smartphone-/Feed-Sichttest erforderlich.
