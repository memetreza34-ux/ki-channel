# Auftrag für Codex

Arbeite ausschließlich auf dem aktuellen Branch. Verändere `main` nicht und merge nichts.

## Zuerst lesen

1. Root-`AGENTS.md`
2. `alles/AGENTS.md`
3. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
4. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
5. dieses Reel-Paket
6. `alles/ki/src/reels/why-ai-misunderstands-you/`

## Bestehender Vorbau

Die neun individuellen Szenen, die Reel-Composition, die statische Cover-Composition, Fallback-Untertitel, Vertragstests und Render-Skripte sind bereits vorbereitet. Erfinde das Reel nicht neu und ersetze die Choreografie nicht ohne belegten Fehler.

## Nach Einfügen des Voiceovers

1. Prüfe, dass `02-audio/` genau eine reale Datei enthält.
2. Führe die finale Standardprüfung aus.
3. Stage und normalisiere das Audio.
4. Erzeuge ein echtes Wort-Transcript.
5. Speichere die Wortzeiten unter `04-caption/word-timings.json` oder `timeline/final-transcript.json`.
6. Richte Untertitel, Szenengrenzen und alle semantischen Auslöser an derselben realen Zeitbasis aus.
7. Playback bleibt bei 1,00x.
8. Wichtige Animationen dürfen nicht vor dem gesprochenen Ausdruck beginnen.
9. Jede Szene benötigt mindestens eine Sekunde ruhigen Ergebnis-Hold.

## Prüfungen

Aus `alles/`:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_warum-ki-dich-missversteht \
--final

node scripts/build-why-ai-misunderstands.mjs \
../reels/2026-08-03_bis_2026-08-09/donnerstag/reel-01_warum-ki-dich-missversteht
```

Der Build muss TypeScript, fokussierte Tests, 36 Checkpoint-Frames, Kontaktbogen, Cover-PNG, vollständiges MP4 und technische Artefaktprüfung abdecken.

## Visuelle Prüfung

- jeden Checkpoint groß und auf Smartphone-Größe prüfen
- vollständiges MP4 bei normaler Geschwindigkeit ansehen
- keine zu schnellen Effektketten
- keine kleinen Kerninformationen
- keine leeren oder unfertigen Szenen
- maximal zwei starke Bewegungen gleichzeitig
- Untertitel maximal zwei Zeilen
- Endzustände mindestens eine Sekunde lesbar

Nur wirklich ausgeführte Prüfungen als bestanden markieren. Nutzerfreigabe niemals selbst setzen.
