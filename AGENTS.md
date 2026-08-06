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
5. `alles/ki/reel-brain/brain.json`
6. `alles/ki/reel-brain/VALIDATION.md`
7. die nächste reel-lokale `AGENTS.md`

Neue Reel-Projekte werden nur unter `reels/<woche>/<wochentag>/<reel-thema>/` angelegt. Technische Befehle werden aus `alles/` ausgeführt.

## Standard für alle neu erstellten Reels

- `standardId: ki-animation-only-reel-v2`
- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- genau ein statisches Cover mit einem Satz
- Stimme und Wiedergabe bei 1,00x
- keine Musik und keine Soundeffekte
- ein Hauptobjekt, eine Hauptbewegung und ein Ergebnis pro Szene
- ein bis drei Bedeutungsbeats pro Szene
- maximal zwei starke Bewegungen gleichzeitig
- Untertitel erscheinen als vollständiger Satz sofort
- keine Wort-für-Wort-Einblendung
- genau eine violette Fortschrittslinie synchron zur echten Satzdauer
- Untertitel-Unterkante zwischen 210 und 235 px

## Audio-first ist verpflichtend

Vor der finalen Audiodatei sind alle Frames nur Platzhalter. Nach dem Audio muss Codex:

```text
Audio transkribieren
→ timeline/final-sync.json erzeugen
→ Szenengrenzen aus Satz- und Sinnpausen ableiten
→ Animationstrigger aus echten Wortzeiten ableiten
→ Untertitel und violette Linie aus echten Satzzeiten ableiten
→ Composition-Dauer auf Sprachende + 1,2 bis 2,2 Sekunden setzen
```

Ein Audio darf niemals nur in eine vorher festgelegte 60- oder 65-Sekunden-Timeline gelegt werden.

Finale Toleranzen:

- Bedeutungs-Trigger maximal ±5 Frames
- Szenenwechsel maximal ±6 Frames von der Sinnpause
- erster Untertitel spätestens 3 Frames nach Sprachbeginn
- Schluss-Hold 1,2 bis 2,2 Sekunden
- keine Fallback-Zeitquelle im finalen Render

## Prüfung

```bash
cd alles
node scripts/validate-future-reel-standard.mjs ../reels/<woche>/<wochentag>/<reel-thema>
node scripts/validate-future-reel-standard.mjs ../reels/<woche>/<wochentag>/<reel-thema> --final
```

Historische Reels mit `ki-animation-only-reel-v1` dürfen bestehen bleiben, sind aber keine Vorlage. `main` nicht verändern, nichts ohne ausdrückliche Freigabe mergen und keinen Pull Request als bereit markieren.
