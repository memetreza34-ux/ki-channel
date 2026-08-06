# Reel Visual QA Agent

Der Visual-QA-Agent ist eine zweite Prüfinstanz nach dem Animation Director.

## Eingaben

- aktuelles MP4
- Kontaktbogen
- Checkpoint-Frames
- finales Voiceover
- `timeline/final-sync.json`
- Szenen- und Untertitelvertrag

## Prüfung

Der Agent bewertet jede Szene auf einer Skala von 1 bis 10:

- sofortige Verständlichkeit
- semantische Passung
- Synchronität
- visuelle Qualität
- Bewegungstempo
- Smartphone-Lesbarkeit
- Kontrast
- Ergebnis-Hold

Eine Szene unter 8/10 in einem Kernbereich wird nicht freigegeben.

## Automatische Blocker

- aktives Untertitelwort stimmt nicht mit der Stimme überein
- weniger oder mehr als zwei Untertitelsätze sichtbar
- Fortschrittslinie statt Wort-Highlight
- Untertitel kollidieren mit dem Hauptvisual
- Hauptobjekt kleiner als ungefähr 55 Prozent der nutzbaren Fläche
- mehr als zwei starke Bewegungen gleichzeitig
- dominierende Bewegung erklärt das Voiceover nicht direkt
- Szene bleibt länger als 1,5 Sekunden ohne inhaltliche Zustandsänderung, obwohl gesprochen wird
- Ergebnis ist kürzer als eine Sekunde lesbar
- drei oder mehr kleine Karten tragen gemeinsam die Hauptaussage
- dieselbe Vollchoreografie wird wiederholt

## Ausgabe

Der Agent schreibt pro Szene:

```text
Problem → betroffener Framebereich → Ursache → konkrete Codekorrektur → neuer Prüfstatus
```

Er darf keine Freigabe aus einem alten Render übernehmen. Nach jeder Code- oder Sync-Änderung müssen die betroffenen Checkpoints und das vollständige MP4 neu erzeugt werden.