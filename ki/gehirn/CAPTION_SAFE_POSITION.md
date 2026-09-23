# Cross-Platform Caption Safe Position — Short-Form

Diese Datei definiert die kanonische Untertitelposition für vertikale Production-Reels (1080×1920).

## Warum die Position geändert wird

Der bisherige Standard `bottom: 520px` war technisch sehr konservativ, wirkte im echten 1080×1920-Review aber sichtbar zu hoch und nahm dem Hauptvisual zu viel vertikalen Raum.

Nach dem Review vom 23.09.2026 wird die Caption bewusst tiefer gesetzt, ohne sie in den kritischen unteren Feed-Bereich zu drücken.

## Kanonischer KIwerkraum-Standard

Für 1080×1920 gilt ab jetzt:

- **Standard Caption Bottom Offset: `400px`**
- horizontaler Sicherheitsabstand: **`104px` links und rechts**
- bevorzugte maximale Textbreite: **`820px`**
- sichtbarer Untertitelblock typischerweise ungefähr **y=1400–1530**, abhängig von Schriftgröße und 1–2 Zeilen
- normalerweise **4–6 Wörter pro sichtbarem Sinnblock**
- maximal **2 Zeilen gleichzeitig**
- kein Hintergrundkasten; Lesbarkeit über kontrollierten Halo/Schatten
- aktiver Sprecherfokus weiterhin Marken-Lila

Die Werte werden im Source zentral aus `ki/src/reels/captionSafe.ts` bezogen. Neue Reels dürfen keine eigenen Caption-Werte erfinden.

## Unterer UI-/Dead-Bereich

Der untere Bereich wird weiterhin geschützt:

- die letzten ungefähr **320px** niemals für Untertitel oder andere kritische Informationen verwenden
- ungefähr **320–380px vom unteren Rand** nur als Puffer behandeln
- Untertitel standardmäßig mit `bottom: 400px` knapp oberhalb dieses Puffers halten
- rechts zusätzlichen Abstand zur Interaktionsleiste berücksichtigen

Diese Werte sind ein kanalinterner Cross-Platform-Standard. Plattform-UI kann je nach App, Gerät und Oberfläche variieren; deshalb bleibt der Smartphone-/Feed-Review Pflicht.

## Beziehung zur Animation

Der tiefere Caption-Standard schafft bewusst mehr Platz für große Remotion-Illustrationen und Objektanimationen.

Wenn ein Hauptvisual mit der Caption konkurriert:

1. Visual höher oder kompakter komponieren
2. interne Labels kürzen
3. Fokusbereich neu setzen
4. Visual neu bauen, wenn nötig

Nicht die Caption beliebig weiter nach unten schieben.

Für neue Reels soll der bedeutungstragende Hauptinhalt nach Möglichkeit bis ungefähr `y=1300–1340` abgeschlossen sein. Danach bleibt Luft zum Caption-Bereich.

## Source-Gate für zukünftige Reels

Neue Production-Reels müssen:

- `REEL_CAPTION_SAFE.bottom` aus `ki/src/reels/captionSafe.ts` verwenden oder exakt daraus abgeleitete Shared-Komponenten nutzen
- `REEL_CAPTION_SAFE.horizontalInset` respektieren
- keine alten festen Caption-Werte wie `264`, `270`, `360`, `460`, `500` oder `520` lokal kopieren
- bei 1080×1920 nicht unter `bottom: 360px` gehen, außer der Nutzer verlangt ausdrücklich ein anderes Layout und ein Feed-Review bestätigt es
- nach jeder Safe-Geometrie-Änderung neu rendern und auf Smartphone-/Feed-Größe prüfen

## Review-Gate

Ein Reel ist nicht visuell freigegeben, wenn:

- Untertitel sichtbar im unteren Plattform-UI-Bereich hängen
- Untertitel zu nah an Accountname/Beschreibung/CTA liegen
- Caption rechts mit Like/Kommentar/Share-UI konkurriert
- Caption und Hauptvisual konkurrieren
- mehr als 2 Caption-Zeilen gleichzeitig sichtbar sind
- der Caption-Block wieder unnötig hoch in die Bildmitte rutscht
- ein alter Render nach einer Caption-Positionsänderung weiter als freigegeben gilt

Nach Änderung der Caption-Position ist immer ein neuer Render plus Smartphone-/Feed-Sichttest erforderlich.
