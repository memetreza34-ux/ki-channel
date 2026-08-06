# KI-Channel

## Die drei Hauptordner

- `reels` – alle aktiven Reel-Projekte
- `youtube` – spätere längere YouTube-Projekte
- `alles` – Technik, Code, Regeln, Skripte und Archiv

Reel-Struktur:

```text
Woche → Wochentag → Reel-Thema
```

## Standard für neue Reels

Neue Reels werden vollständig mit Remotion animiert:

- 60 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- keine generierten Szenenbilder
- ein separates statisches Cover mit einem Satz
- Voiceover und Wiedergabe bei 1,00x
- maximal zwei starke Bewegungen gleichzeitig
- mindestens eine Sekunde Ergebnis-Hold
- normale Satzuntertitel

Technische Befehle werden aus `alles/` ausgeführt.

Neues Reel anlegen:

```bash
node scripts/create-future-reel.mjs \
<woche> <wochentag> <slug> \
--title "Titel" \
--hook "Direkter Hook" \
--scenes 8 \
--seconds 65
```

Standard prüfen:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

Verbindliche Regeln:

```text
alles/ki/reel-brain/PRODUCTION-BRAIN.md
alles/ki/reel-brain/FUTURE-REEL-STANDARD.md
alles/ki/reel-brain/brain.json
```
