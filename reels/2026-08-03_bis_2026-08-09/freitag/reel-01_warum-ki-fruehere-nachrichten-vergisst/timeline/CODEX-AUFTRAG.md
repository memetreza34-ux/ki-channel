# Auftrag für Codex

Arbeite ausschließlich auf `feature/reel-kontextfenster-vergisst`. Verändere `main` nicht und merge nichts.

## Zuerst lesen

1. Root-`AGENTS.md`
2. `alles/AGENTS.md`
3. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
4. `alles/ki/reel-brain/FUTURE-REEL-STANDARD.md`
5. `alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
6. dieses Reel-Paket
7. `alles/ki/src/reels/why-ai-forgets-earlier-messages/`

## Bestehender Vorbau

- 143-Wörter-Script
- acht Szenen
- vollständige semantische Beat-Map
- acht programmierte Remotion-Szenen
- zentrale stabile Satzuntertitel-Komponente
- statische Cover-Composition
- v2-Timeline-Vertrag
- Render- und Prüfpipeline

Die aktuelle `timeline/final-sync.json` ist nur ein markierter Planplatzhalter. Sie darf nicht als echter Sync ausgegeben werden.

## Nach Einfügen des Voiceovers

1. Prüfe, dass `02-audio/` genau eine nicht leere Mediendatei enthält.
2. Normalisiere sie als WAV 48 kHz Mono.
3. Transkribiere echte Wort- und Satzzeiten.
4. Ermittle Sprachbeginn, Sprachende und Sinnpausen.
5. Erzeuge `timeline/final-sync.json` vollständig neu mit `status: final-transcript-aligned`.
6. Berechne finale Composition-Dauer als Sprachende plus 1,2 bis 2,2 Sekunden Hold.
7. Leite alle Szenengrenzen aus Satz- oder Sinnpausen ab.
8. Aktualisiere Beat-Trigger auf höchstens ±5 Frames zum gesprochenen Sinnabschnitt.
9. Aktualisiere Untertitel: kompletter Satz sofort, Unterkante 220 px, nur violette Linie bewegt sich.
10. Entferne jede aktive Platzhalter- oder Fallback-Zeitquelle aus dem finalen Build.

## Pflichtprüfungen

```bash
cd alles

node scripts/validate-future-reel-standard.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst \
--final

node scripts/build-why-ai-forgets-earlier-messages.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst
```

## Visuelle Prüfung

- Hauptvisual groß und zentral
- keine Mini-Dashboards
- maximal eine dominante Bewegung
- keine Animation vor dem zugehörigen gesprochenen Inhalt
- Ergebnis mindestens eine Sekunde ruhig
- Untertitel zwischen 210 und 235 px
- kein Wort-für-Wort-Reveal
- nur eine violette Fortschrittslinie
- vollständiges MP4 normal und in Smartphone-Größe ansehen

Nur wirklich ausgeführte Prüfungen als bestanden markieren. Nutzerfreigabe niemals selbst setzen.