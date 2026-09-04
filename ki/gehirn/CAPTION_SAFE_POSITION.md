# Cross-Platform Caption Safe Position — Short-Form

Diese Datei definiert die **kanonische** Untertitelposition für vertikale Production-Reels (1080×1920).

## Kanonischer Standard

Der aktuell freigegebene Kanal-Standard ist bewusst **tiefer und ruhiger** als die frühere 520px-Variante:

- Caption Bottom Offset: **`250px`**
- horizontaler Sicherheitsabstand: **`104px` links/rechts**
- bevorzugte maximale Caption-Breite: **`860px`**
- normalerweise **4–6 Wörter pro Sinnblock**
- maximal **2 Zeilen gleichzeitig**
- Caption als **halbtransparente Glass-/Blur-Overlay-Fläche** auf demselben Fullscreen-Hintergrund
- aktive Sprecherposition in der Szenen-Akzentfarbe
- kein separater Footer und kein zweiter Hintergrund nur für Untertitel

Die Werte kommen zentral aus `ki/src/reels/captionSafe.ts`. Neue Reels dürfen keine eigene Caption-Geometrie hart codieren, sofern der Nutzer keine ausdrückliche Ausnahme verlangt.

## Unterer UI-/Dead-Bereich

- die letzten ungefähr **180px** unten niemals für Untertitel oder andere kritische Informationen verwenden
- ungefähr **180–230px** nur als Puffer behandeln
- Caption standardmäßig mit `bottom: 250px` oberhalb dieses Puffers halten
- rechts weiterhin Like-/Kommentar-/Share-UI gedanklich mitprüfen
- Hauptvisual und Caption dürfen sich nicht optisch bekämpfen

## Beziehung zur Animation

Der **Szenen-Hintergrund läuft immer fullscreen**. Nur bedeutungstragende Objekte brauchen Abstand zur Caption.

Für neue Reels:

- wichtige Hauptvisuals nach Möglichkeit bis ungefähr **y=1440–1480** abschließen
- Caption liegt als Overlay darüber, nicht in einer eigenen Footer-Zone
- wenn Visual und Caption kollidieren: Visual höher/kompakter bauen oder Labels kürzen
- Caption nicht aus Bequemlichkeit wieder nach oben auf alte 500+/520px-Werte schieben
- Caption nicht unter 230px drücken, außer nach ausdrücklichem Nutzerwunsch und neuem Feed-Review

## Source-Gate

Neue Production-Reels müssen:

- `REEL_CAPTION_SAFE` / `REEL_CAPTION_WRAPPER_STYLE` aus `ki/src/reels/captionSafe.ts` verwenden
- `REEL_CAPTION_GLASS_STYLE` oder eine daraus abgeleitete gemeinsame Glass-Variante nutzen
- keine Altwerte wie `bottom: 264`, `270`, `360`, `440`, `460` oder `520` neu hart codieren
- Fullscreen-Hintergründe beibehalten; kein weißer Untertitel-Footer
- nach jeder Caption-Geometrieänderung neu rendern und in Smartphone-/Feed-Größe prüfen

## Review-Gate

Ein Reel ist nicht visuell freigegeben, wenn:

- Untertitel mit Accountname/Beschreibung/CTA kollidieren
- Caption rechts mit Feed-Interaktions-UI konkurriert
- Caption und Hauptvisual sich überlagern
- mehr als 2 Caption-Zeilen sichtbar sind
- ein zweiter Hintergrund/weißer Footer nur für die Caption entsteht
- die Caption wieder auf einen alten hohen Standard verschoben wurde, obwohl keine dokumentierte Ausnahme vorliegt
- ein alter Render nach einer Caption-Positionsänderung weiter als freigegeben gilt

Nach jeder Änderung der Caption-Position ist ein neuer Render plus Smartphone-/Feed-Sichttest Pflicht.
