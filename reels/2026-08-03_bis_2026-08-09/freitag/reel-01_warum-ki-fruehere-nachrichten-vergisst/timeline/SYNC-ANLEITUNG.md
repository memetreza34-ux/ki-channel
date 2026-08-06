# Audio-first-Sync ausführen

## 1. Audio einfügen

Genau eine finale Datei direkt in `02-audio/` ablegen.

## 2. Audio normalisieren

Aus `alles/`:

```bash
node scripts/stage-why-ai-forgets-audio.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst
```

## 3. Wort-Transcript erzeugen

Das Transcript muss mindestens diese Struktur besitzen:

```json
{
  "duration": 60.1,
  "words": [
    {"word":"Warum","start":0.28,"end":0.61}
  ]
}
```

## 4. Finale Timeline erzeugen

```bash
node scripts/prepare-why-ai-forgets-final-sync.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst \
<Pfad-zum-Transcript.json>
```

Das Skript ersetzt den Planplatzhalter durch eine echte `final-transcript-aligned`-Timeline. Es berechnet:

- vollständige Satzuntertitel
- Szenengrenzen aus Sinnpausen
- Animationstrigger
- Ergebnis-Holds
- Composition-Dauer
- 1,8 Sekunden Schluss-Hold

## 5. Final prüfen und bauen

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst \
--final

node scripts/build-why-ai-forgets-earlier-messages.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst
```

Ein finaler Video-Render ist blockiert, solange `final-sync.json` noch `planned-placeholder` enthält.