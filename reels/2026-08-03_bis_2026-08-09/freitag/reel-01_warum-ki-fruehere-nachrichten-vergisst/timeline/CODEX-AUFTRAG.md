# Auftrag für Codex – Kontextfenster-Reel v3

Arbeite ausschließlich auf `feature/reel-kontextfenster-vergisst`. Verändere `main` nicht und merge nichts.

## Zuerst lesen

1. Root-`AGENTS.md`
2. `alles/AGENTS.md`
3. v3-Zukunftsstandard und Audio-first-Vertrag
4. Animation-Director-, Sync-Auditor- und Visual-QA-Skills
5. dieses Reel-Paket
6. `alles/ki/src/reels/why-ai-forgets-earlier-messages/`

## Neuer Vorbau

- 128 Wörter
- acht Szenen
- genau zwei kurze Sätze pro Szene
- vollständig neu choreografierte Remotion-Szenen
- größere Hauptobjekte und kräftigerer Kontrast
- `DualSentenceKaraokeCaption`
- keine Fortschrittslinie
- Untertitel-Unterkante 260 px

## Nach dem neuen Voiceover

1. Prüfe genau eine Audiodatei in `02-audio/`.
2. Normalisiere das Audio.
3. Erzeuge ein echtes Wort-Transcript.
4. Führe aus:

```bash
node scripts/prepare-why-ai-forgets-final-sync.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst \
<Pfad-zum-Wort-Transcript.json>
```

5. Prüfe, dass jedes Caption-Paar exakt zwei Sätze und jedes Wort echte Frames besitzt.
6. Prüfe, dass das violette Wort exakt der Stimme folgt.
7. Prüfe semantische Trigger innerhalb ±5 Frames.
8. Führe den v3-Validator aus.
9. Führe TypeScript und fokussierte Tests aus.
10. Rendere Smoke-Frames und prüfe sie mit dem Animation Director.
11. Rendere alle Checkpoints, Kontaktbogen, Cover und MP4.
12. Sieh das MP4 normal und in Smartphone-Größe an.
13. Erzeuge den Visual-QA-Bericht.

## Gesamtbuild

```bash
node scripts/build-why-ai-forgets-earlier-messages.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst
```

## Blocker

- alte Audiodatei passt nicht zum neuen 128-Wörter-Script
- `final-sync.json` bleibt Platzhalter
- Fortschrittslinie ist sichtbar
- weniger oder mehr als zwei Untertitelsätze
- falsches violettes Wort
- kleine oder blasse Hauptvisuals
- wiederholte schwache Kartenbewegung
- TypeScript, Tests, Render oder visuelle Prüfung fehlen

Nur tatsächlich ausgeführte Prüfungen als bestanden markieren.
