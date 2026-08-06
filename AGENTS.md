# KI-Channel – Arbeitsregeln

Die sichtbare Hauptstruktur ist absichtlich einfach:

- `reels/` für Reel-Projekte
- `youtube/` für spätere YouTube-Projekte
- `alles/` für den gesamten technischen Unterbau

Vor jeder technischen Reel-Arbeit zuerst lesen:

1. `alles/AGENTS.md`
2. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
3. bei jedem neuen Reel `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `alles/ki/reel-brain/brain.json`
5. `alles/ki/reel-brain/VALIDATION.md`
6. die nächste reel-lokale `AGENTS.md`

Neue Reel-Projekte werden ausschließlich unter `reels/<woche>/<wochentag>/<reel-thema>/` angelegt. Technische Befehle werden aus `alles/` ausgeführt.

Für alle neu erstellten Reels gilt standardmäßig:

- 60 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 100 Prozent Remotion-Animation im Reel
- keine generierten Szenenbilder
- genau ein separates statisches Cover mit einem Satz
- Stimme und Wiedergabe bei 1,00x
- höchstens 1,05x nach ausdrücklicher Freigabe
- maximal zwei starke Bewegungen gleichzeitig
- mindestens eine Sekunde Ergebnis-Hold
- normale Satzuntertitel statt hektischer Wortblöcke

Vor dem Coding und erneut vor der finalen Freigabe muss der neue Reel-Standard geprüft werden:

```bash
cd alles
node scripts/validate-future-reel-standard.mjs ../reels/<woche>/<wochentag>/<reel-thema>
node scripts/validate-future-reel-standard.mjs ../reels/<woche>/<wochentag>/<reel-thema> --final
```

Historische Reels dürfen ältere Werte besitzen. Diese Werte nicht in neue Reels kopieren.

Keine zusätzlichen Kanalordner am Repository-Root anlegen. FinanzNeo gehört nicht in dieses Repository. Keine Pull Requests mergen oder als bereit markieren, ohne ausdrückliche Freigabe.
