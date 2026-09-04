# Cross-Platform Caption Safe Position — Short-Form

Diese Datei dokumentiert die **kanonische Untertitelgeometrie** für vertikale Production-Reels (1080×1920).

## Single Source of Truth

Die technische Wahrheit liegt ausschließlich in:

`ki/src/reels/captionSafe.ts`

Diese Markdown-Datei erklärt dieselben Werte menschenlesbar. Wenn Source und Dokumentation jemals voneinander abweichen, gilt **der Source als autoritativ** und die Dokumentation muss korrigiert werden. Neue Reels dürfen keine eigene Caption-Geometrie hart codieren, sofern der Nutzer keine ausdrückliche Ausnahme verlangt.

## Kanonischer Standard

Aktueller Source-Stand:

- Caption Bottom Offset: **`330px`**
- horizontaler Sicherheitsabstand: **`76px` links/rechts**
- bevorzugte maximale Caption-Breite: **`928px`**
- Fontgröße ungefähr **`40px`**
- normalerweise **4–6 Wörter pro Sinnblock**
- maximal **2 Zeilen gleichzeitig**
- Caption als **halbtransparente Glass-/Blur-Overlay-Fläche** auf demselben Fullscreen-Hintergrund
- aktive Sprecherposition in der Szenen-Akzentfarbe
- kein separater Footer und kein zweiter Hintergrund nur für Untertitel

## Unterer UI-/Dead-Bereich

Die technischen Grenzwerte werden ebenfalls aus `REEL_CAPTION_SAFE` abgeleitet:

- `lowerCriticalDeadZone: 220`
- `lowerBufferEnd: 300`
- wichtige Visuals bevorzugt bis ungefähr `y=1435`
- obere Toleranz für den bevorzugten Visual-Endbereich: ungefähr `y=1485`

Praktische Regel:

- die untere Plattform-UI-Zone niemals für kritische Informationen verwenden
- rechts Like-/Kommentar-/Share-UI mitprüfen
- Hauptvisual und Caption dürfen sich nicht optisch bekämpfen
- der Fullscreen-Hintergrund läuft weiter; nur bedeutungstragende Objekte brauchen Abstand zur Caption

## Beziehung zur Animation

Für neue Reels:

- wichtige Hauptvisuals nach Möglichkeit bis ungefähr **y=1435–1485** abschließen
- Caption liegt als Overlay darüber, nicht in einer eigenen Footer-Zone
- wenn Visual und Caption kollidieren: Visual höher/kompakter bauen oder Labels kürzen
- Caption-Geometrie nicht reel-spezifisch verändern, um ein Layoutproblem zu kaschieren
- bewusste Ausnahmen müssen dokumentiert und erneut im echten Smartphone-/Feed-Kontext geprüft werden

## Cover-Fenster

Der Cover-Hook wird ebenfalls zentral in `captionSafe.ts` definiert. Captions bleiben im vorgesehenen Cover-Fenster unterdrückt, damit ein sauberer cover-tauglicher Frame innerhalb der ersten Sekunde möglich ist.

## Source-Gate

Neue Production-Reels müssen:

- `REEL_CAPTION_SAFE` / `REEL_CAPTION_WRAPPER_STYLE` aus `ki/src/reels/captionSafe.ts` verwenden
- `REEL_CAPTION_GLASS_STYLE` oder eine daraus abgeleitete gemeinsame Glass-Variante nutzen
- keine eigene alternative Standardgeometrie hart codieren
- Fullscreen-Hintergründe beibehalten; kein weißer Untertitel-Footer
- nach jeder bewussten Caption-Geometrieänderung neu rendern und in Smartphone-/Feed-Größe prüfen

## Review-Gate

Ein Reel ist nicht visuell freigegeben, wenn:

- Untertitel mit Accountname/Beschreibung/CTA kollidieren
- Caption rechts mit Feed-Interaktions-UI konkurriert
- Caption und Hauptvisual sich unlesbar überlagern
- mehr als 2 Caption-Zeilen sichtbar sind
- ein zweiter Hintergrund/weißer Footer nur für die Caption entsteht
- reel-spezifische Geometrie ohne dokumentierte Ausnahme die zentrale Source umgeht
- ein alter Render nach einer Caption-Positionsänderung weiter als freigegeben gilt

Nach jeder Änderung der Caption-Position ist ein neuer Render plus Smartphone-/Feed-Sichttest Pflicht.
