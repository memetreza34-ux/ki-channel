# Codex-Auftrag – Warum weiß KI nicht, was heute passiert?

Arbeite ausschließlich auf `feature/reel-ki-weiss-nicht-was-heute-passiert`. Verändere `main` nicht und merge nichts.

## Zuerst lesen

1. Root-`AGENTS.md`
2. `alles/AGENTS.md`
3. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `alles/ki/reel-brain/ANTI-REPETITION-CONTRACT.md`
5. Animation-Director-, Icon-Designer-, Sync-Auditor- und Visual-QA-Regeln
6. reel-lokale `AGENTS.md`
7. `03-szenen/semantic-beats.json`
8. `05-review/anti-repetition-matrix.md`

## Vorbau

- 144 Wörter
- 16 kurze Sätze
- 8 Szenen
- immer nur der aktuelle Satz sichtbar
- aktives Wort violett
- 8 unterschiedliche semantische Icons
- 8 unterschiedliche Hauptanimationen
- keine Fortschrittslinie, Musik, SFX oder Szenenbilder

## Vorschau ohne finales Audio

```bash
cd alles
node scripts/preview-why-ai-does-not-know-today.mjs \
../reels/2026-08-03_bis_2026-08-09/sonntag/reel-01_warum-ki-nicht-weiss-was-heute-passiert
```

Die Vorschau ist stumm und verwendet nur das ausdrücklich markierte Platzhalter-Timing. Sie darf nicht als final veröffentlicht werden.

## Nach dem finalen Voiceover

1. Genau eine Audio- oder Mediendatei in `02-audio/` prüfen.
2. Audio auf WAV, Mono, 48 kHz normalisieren.
3. Echtes Wort-Transcript mit Start- und Endzeiten erzeugen.
4. Finale Timeline erzeugen:

```bash
node scripts/prepare-why-ai-does-not-know-today-final-sync.mjs \
../reels/2026-08-03_bis_2026-08-09/sonntag/reel-01_warum-ki-nicht-weiss-was-heute-passiert \
<Pfad-zum-Wort-Transcript.json>
```

5. Ausführen:

```bash
node scripts/build-why-ai-does-not-know-today.mjs \
../reels/2026-08-03_bis_2026-08-09/sonntag/reel-01_warum-ki-nicht-weiss-was-heute-passiert
```

## Pflichtprüfung

- v4-Standard besteht
- Anti-Wiederholungs-Validator besteht
- TypeScript und fokussierte Tests bestehen
- jeder Sprachtrigger liegt höchstens ±5 Frames von seiner Bewegung entfernt
- erster Satz bleibt bis zum zweiten Satz sichtbar
- zweiter Satz bleibt bis zum Szenenende sichtbar
- kein Wort ist während einer Pause violett
- alle Icons sind bei Smartphone-Größe lesbar
- alle Hauptvisuals sind groß und innerhalb von zwei Sekunden verständlich
- kein altes MP4 oder alter Kontaktbogen wird wiederverwendet
- finale Dauer endet 1,2 bis 2,2 Sekunden nach dem letzten Wort

Nur tatsächlich ausgeführte Prüfungen als bestanden markieren.
