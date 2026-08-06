# Auftrag für Codex

Arbeite ausschließlich auf dem aktuellen Branch. Verändere `main` nicht.

## Zuerst lesen

1. Root-`AGENTS.md`
2. `alles/AGENTS.md`
3. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
4. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
5. `alles/ki/reel-brain/brain.json`
6. reel-lokale Dateien

## Vor dem Build

- Wortzahl 125 bis 145 prüfen
- geplante Dauer 60 bis 70 Sekunden prüfen
- 8 bis 9 Szenen prüfen
- vollständigen Remotion-Code aller Szenen prüfen
- semantische Beat-Abdeckung prüfen
- reales Audio prüfen
- keine generierten Szenenbilder akzeptieren

## Synchronisierung

1. finales Audio transkribieren
2. echte Wortzeiten erzeugen
3. Szenengrenzen, Untertitel und semantische Animationen an derselben Zeitbasis ausrichten
4. wichtige Aktionen nicht vor ihrem gesprochenen Ausdruck zeigen
5. Ergebnis-Holds von mindestens einer Sekunde sichern

## Qualität

- maximal zwei starke Bewegungen gleichzeitig
- maximal vier Bedeutungsbeats pro Szene
- normale Satzuntertitel mit maximal zwei Zeilen
- keine kleinen UI-Details als Kerninformation
- keine leeren oder unfertig wirkenden Szenen
- keine wiederholte Vollchoreografie

## Prüfung

1. TypeScript
2. fokussierte Tests
3. Smoke-Frames
4. Checkpoint-Frames
5. Kontaktbogen
6. Cover
7. vollständiges MP4
8. Ansicht in normaler Geschwindigkeit
9. Smartphone-Prüfung
10. technische Artefaktprüfung

Keine Prüfung oder Freigabe behaupten, die nicht wirklich erfolgt ist. Nicht mergen und keinen Pull Request als bereit markieren.