# KI-Channel

## Hauptordner

- `reels` – aktive Reel-Projekte
- `youtube` – spätere Longform-Projekte
- `alles` – Technik, Code, Regeln, Skripte und Archiv

Reel-Struktur:

```text
Woche → Wochentag → Reel-Thema
```

## Standard für neue Reels

Neue Reels verwenden `ki-animation-only-reel-v2`:

- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- ein statisches Cover mit einem Satz
- Voiceover und Wiedergabe bei 1,00x
- ein Hauptobjekt und eine Hauptbewegung pro Szene
- maximal drei Bedeutungsbeats pro Szene
- vollständige Satzuntertitel erscheinen sofort
- genau eine violette Linie läuft synchron zur echten Satzdauer
- Untertitel-Unterkante 210 bis 235 px

## Audio-first

Die anfänglichen Frames sind nur Planungsplatzhalter. Nach dem finalen Voiceover wird die komplette Timeline neu aus der Sprache erzeugt:

```text
Audio
→ Transcript
→ timeline/final-sync.json
→ Szenengrenzen
→ Animationstrigger
→ Untertitel
→ finale Videolänge
```

Der finale Render endet 1,2 bis 2,2 Sekunden nach dem letzten gesprochenen Wort. Fallback-Timing ist im finalen Build verboten.

## Neues Reel

Aus `alles/`:

```bash
node scripts/create-future-reel.mjs \
<woche> <wochentag> <slug> \
--title "Titel" \
--hook "Direkter Hook" \
--scenes 8 \
--seconds 64
```

Planung prüfen:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

Final prüfen:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema> \
--final
```

Verbindliche Regeln:

```text
alles/ki/reel-brain/PRODUCTION-BRAIN.md
alles/ki/reel-brain/FUTURE-REEL-STANDARD.md
alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md
alles/ki/reel-brain/brain.json
```
