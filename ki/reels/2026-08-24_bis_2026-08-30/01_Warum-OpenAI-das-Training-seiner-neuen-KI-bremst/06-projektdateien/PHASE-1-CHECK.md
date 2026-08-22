# Phase-1 Check

## Statisch geprüft

- Wochenpfad entspricht `2026-08-24_bis_2026-08-30/NN_Titel`.
- Alle sechs nummerierten Produktionsordner sind durch Dateien vertreten.
- Voiceover-Skript und Copy-Fließtext vorhanden.
- 5 Szenen sind in `reel.json`, `contract.ts` und Subtitle-Cues mit derselben Gesamtdauer 1644 Frames angelegt.
- Source nutzt `REEL_CAPTION_SAFE` / `REEL_CAPTION_WRAPPER_STYLE`.
- Composition ist in `ki/src/Root.tsx` registriert.
- Keine externen Bildassets vorgesehen.
- Primärquelle und Nicht-Behauptungen dokumentiert.

## Nicht ausgeführt / nicht behauptet

- `npm test`
- TypeScript-Typecheck
- Remotion-Bundle
- Smoke-Render
- Final-Render
- Audio-Sync
- visuelle Endprüfung

Diese Checks gehören mit lokal verfügbarer Runtime bzw. in Phase 3 erneut ausgeführt.
