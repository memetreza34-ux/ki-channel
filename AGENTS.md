# KI-Channel – Arbeitsregeln

Die sichtbare Hauptstruktur bleibt:

- `reels/` für Reel-Projekte
- `youtube/` für spätere YouTube-Projekte
- `alles/` für den technischen Unterbau

Vor jeder Reel-Arbeit lesen:

1. `alles/AGENTS.md`
2. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
3. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
5. `alles/ki/reel-brain/REEL-ANIMATION-DIRECTOR.md`
6. `alles/ki/reel-brain/REEL-SYNC-AUDITOR.md`
7. `alles/ki/reel-brain/REEL-VISUAL-QA-AGENT.md`
8. `alles/ki/reel-brain/brain.json`
9. die nächste reel-lokale `AGENTS.md`

Zusätzlich für neue oder überarbeitete Reels verwenden:

```text
.agents/skills/reel-animation-director/SKILL.md
.agents/skills/reel-sync-auditor/SKILL.md
.agents/skills/reel-visual-qa/SKILL.md
```

## Standard für neue Reels

- `standardId: ki-animation-only-reel-v3`
- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- genau zwei kurze Sätze pro Szene
- das Satzpaar bleibt während der kompletten Szene sichtbar
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- Voiceover und Wiedergabe bei 1,00x
- keine Musik und keine Soundeffekte
- ein großes Hauptobjekt und eine dominante Bewegung pro Szene
- maximal drei Sinnbeats und zwei starke Bewegungen
- aktuelles gesprochenes Wort violett
- in Sprechpausen kein markiertes Wort
- keine Fortschrittslinie
- Untertitel-Unterkante 245 bis 285 px, Standard 260 px

## Audio-first

```text
Audio transkribieren
→ timeline/final-sync.json erzeugen
→ Wortzeiten für beide Untertitelsätze speichern
→ Satzpaar an vollständige Szenengrenzen binden
→ Szenengrenzen aus Pausen ableiten
→ Animations-Trigger aus echten Wortzeiten ableiten
→ finale Dauer aus Sprachende + 1,2 bis 2,2 Sekunden ableiten
```

Finale Toleranzen:

- Bedeutungs-Trigger maximal ±5 Frames
- Szenenwechsel maximal ±6 Frames
- erster Untertitel spätestens 3 Frames nach Sprachbeginn
- keine Fallback-Zeitquelle im finalen Render

## Prüfung

```bash
cd alles
node scripts/validate-reel-v3.mjs ../reels/<woche>/<wochentag>/<reel-thema>
node scripts/validate-reel-v3.mjs ../reels/<woche>/<wochentag>/<reel-thema> --final
node scripts/validate-v3-caption-coverage.mjs ../reels/<woche>/<wochentag>/<reel-thema>
```

`main` nicht verändern, nichts ohne ausdrückliche Freigabe mergen und keinen Pull Request als bereit markieren.
