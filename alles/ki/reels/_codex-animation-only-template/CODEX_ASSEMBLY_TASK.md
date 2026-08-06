# Auftrag für Codex

Arbeite ausschließlich auf dem aktuellen Branch. Verändere `main` nicht.

## Zuerst lesen

1. Root-`AGENTS.md`
2. `alles/AGENTS.md`
3. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
4. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
5. `alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
6. `alles/ki/reel-brain/brain.json`
7. reel-lokale Dateien

## Vor dem Audio

- Script mit 125 bis 145 Wörtern prüfen
- 8 bis 9 Szenen prüfen
- jede Szene auf einen Hauptgedanken reduzieren
- pro Szene genau ein Hauptobjekt, eine Hauptbewegung und ein Ergebnis planen
- ein bis drei Bedeutungsbeats pro Szene festlegen
- Remotion-Code nur mit klar markiertem Platzhalter-Timing vorbauen

## Nach dem finalen Audio

1. Audio normalisieren.
2. Wörter, Sätze und Sinnpausen transkribieren.
3. Sprachbeginn und Sprachende messen.
4. `timeline/final-sync.json` erzeugen.
5. Szenengrenzen aus Satz- und Sinnpausen ableiten.
6. Composition-Dauer auf Sprachende plus 1,2 bis 2,2 Sekunden setzen.
7. Bedeutungs-Trigger aus echten Wortzeiten ableiten.
8. Untertitel als vollständige Sätze sofort anzeigen.
9. Unter jedem Satz genau eine violette Fortschrittslinie verwenden.
10. Alle Fallback-Zeiten aus dem finalen Produktionspfad entfernen.
11. Checkpoints aus der finalen Timeline neu erzeugen.

## Verbindliche Toleranzen

- Bedeutungs-Trigger maximal ±5 Frames
- Szenenwechsel maximal ±6 Frames von der Sinnpause
- erster Untertitel spätestens 3 Frames nach Sprachbeginn
- Untertitel-Unterkante 210 bis 235 px
- Schluss-Hold 1,2 bis 2,2 Sekunden
- keine aktive Fallback-Zeitquelle

## Visuelle Qualität

- ein Hauptobjekt pro Szene
- maximal zwei kleine unterstützende Elemente
- maximal zwei starke Bewegungen gleichzeitig
- maximal drei Bedeutungsbeats pro Szene
- Hauptvisual nutzt ungefähr 55 bis 72 Prozent der Animationsfläche
- keine Mini-Dashboards
- keine Ansammlung kleiner Karten
- keine dauerhaft sichtbaren Szenennummern oder Kicker
- keine Emojis als Hauptvisual
- keine Bewegung vor dem gesprochenen Sinnabschnitt
- mindestens eine Sekunde ruhiger Ergebnis-Hold

## Untertitel

- kompletter Satz erscheint sofort
- maximal zwei Zeilen
- 46 bis 52 px, mindestens 42 px
- Unterkante standardmäßig 220 px
- keine Wort-für-Wort-Einblendung
- keine Einzelwort-Hervorhebung
- kein Bounce
- nur die violette Linie bewegt sich
- Satz und Linie nutzen echte Satzzeiten aus `final-sync.json`

## Prüfung

1. Planungsvalidator
2. finales Audio und Transcript
3. `final-sync.json`-Validator
4. TypeScript
5. fokussierte Tests
6. Smoke-Frames aus finaler Timeline
7. Checkpoint-Frames
8. Kontaktbogen
9. Cover
10. vollständiges MP4
11. Ansicht bei normaler Geschwindigkeit
12. Smartphone-Prüfung
13. technische Artefaktprüfung

Im Abschlussbericht angeben:

- Sprachbeginn und Sprachende
- Composition-Ende und Schluss-Hold
- größte Trigger-Abweichung
- größte Szenengrenzen-Abweichung
- Untertitelposition
- aktive Timing-Quelle

Keine Prüfung oder Freigabe behaupten, die nicht wirklich erfolgt ist. Nicht mergen und keinen Pull Request als bereit markieren.
