# Phase-3 Assembly — Wie KI ein Bild versteht

## Vorbedingung

Das aktuelle Branch-Audio ist vorhanden. Falls es bei der Ausführung fehlt, sofort stoppen mit:

`PHASE 2 AUDIO FEHLT`

## Auftrag für die aktuelle Revision

1. vorhandenen aktuellen Reel-Source verwenden; nicht von Null neu entwerfen
2. die neue Caption-Position **`bottom: 460px`** unverändert übernehmen
3. Caption-Fenster auf 4–6 Wörter und maximal 2 sichtbare Zeilen begrenzen
4. reales Voiceover-/Cue-Timing beibehalten bzw. gegen das tatsächlich verwendete Audio verifizieren
5. Visuals gegen den höheren Caption-Block prüfen; neue kritische Visuals möglichst bis y≈1280–1320 abschließen
6. bei Kollision Visual höher/kompakter/new-build — Caption **nicht** wieder nach unten verschieben
7. technischen Clip-Guard nur als letzte Sicherung behandeln; abgeschnittener wichtiger Inhalt ist ein Layoutfehler
8. TypeScript/fokussierte Tests/Repository-Checks tatsächlich ausführen
9. Smoke-Frames mindestens aus Start, jeder Szene, Caption-kritischen Momenten und Schluss exportieren
10. Smartphone-/Feed-Sichttest: Caption nicht im unteren Plattform-UI-Bereich, Hauptvisual groß, Labels lesbar, keine unnötige Leere
11. Szene 5 muss bis zur letzten inhaltlichen Phrase sichtbar weiterlaufen
12. erst danach final neu rendern und MP4 normalgeschwindig visuell/akustisch prüfen

## Wichtig

Ein vor dieser Caption-Revision gerenderter MP4 darf **nicht** als Freigabe für den aktuellen Source-Stand verwendet werden.

Lokales Audio-Retiming nur nach dem kanonischen ±3 %, bei echtem Bedarf bis ungefähr ±6 %-Vertrag; verwendete Faktoren dokumentieren.
