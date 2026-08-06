# Codex-Auftrag – Unterschiedliche Antworten v4

Arbeite ausschließlich auf `feature/reel-gleiche-frage-andere-antwort`. Verändere `main` nicht und merge nichts.

## Produktionsziel

- ein aktueller Untertitelsatz
- vollständiger Satz sofort sichtbar
- aktives Wort violett
- keine Fortschrittslinie oder große Untertitelbox
- Untertitel bei 320 px
- passendes animiertes Vektor-Icon je Überschrift
- acht große, unterschiedliche Ursache-Wirkung-Animationen

## Nach dem finalen Voiceover

1. Genau eine Audiodatei in `02-audio/` prüfen.
2. Audio bei 1,00x normalisieren.
3. echtes Wort-Transcript erzeugen.
4. ausführen:

```bash
node scripts/prepare-why-ai-answers-differently-final-sync.mjs \
../reels/2026-08-03_bis_2026-08-09/samstag/reel-01_warum-ki-unterschiedlich-antwortet \
<Pfad-zum-Transcript.json>
```

5. `final-sync.json` und alle Schlüsselwort-Trigger prüfen.
6. ausführen:

```bash
node scripts/validate-reel-v4.mjs \
../reels/2026-08-03_bis_2026-08-09/samstag/reel-01_warum-ki-unterschiedlich-antwortet \
--final
```

7. TypeScript und fokussierte Tests ausführen.
8. Smoke-Frames mit Animation Director und Icon-Prüfung ansehen.
9. alle Checkpoints, Kontaktbogen, Cover und MP4 neu rendern.
10. MP4 normal und in Smartphone-Größe ansehen.
11. nur tatsächlich bestandene Prüfungen dokumentieren.

## Gesamtbuild

```bash
node scripts/build-why-ai-answers-differently.mjs \
../reels/2026-08-03_bis_2026-08-09/samstag/reel-01_warum-ki-unterschiedlich-antwortet
```
