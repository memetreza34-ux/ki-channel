# Phase 3 Task — Semantic Embeddings Reel

Arbeite ausschließlich mit dem finalen Phase-2-Voiceover dieses Reel-Pakets.

## Stop-Regel

Fehlt `01-script-audio/voiceover.wav` und `voiceover.mp3`, exakt stoppen mit:

`PHASE 2 AUDIO FEHLT`

Kein Fake-Audio und keine geschätzte finale Synchronität.

## Ablauf

1. echtes Audio prüfen und Dauer bestimmen.
2. `node scripts/sync-reel-word-timings.mjs --dir "ki/reels/2026-09-21_bis_2026-09-27/01_Wie-KI-aehnliche-Texte-findet-ohne-Woerter-zu-vergleichen"` ausführen.
3. Nur bei vollständigem Script-/Whisper-Match fortfahren.
4. `reel.json`-Szenengrenzen an echte Sprecherabschnitte anpassen.
5. B1–B12 so retimen, dass Sprecherbedeutung, sichtbarer Zustandswechsel und Caption-Fokus zusammenfallen.
6. Überschrift und Icon wechseln nur am Szenenwechsel.
7. Caption: aktuelles Wort lila, restliche Wörter dunkel; keine Hintergrundkarte.
8. „2D-Vereinfachung“ in Szene 3 sichtbar halten.
9. keine echten Embedding-Zahlen erfinden.
10. `node scripts/run-remotion-readiness.mjs` ausführen.
11. Opening, Hero B7, Ranking B10 und Schluss B12 als Smoke-Frames rendern und ansehen.
12. finalen 1080×1920-H264-MP4 rendern und normal + smartphone-groß prüfen.
13. `creative-review.md` und `PHASE-STATUS.md` nur für tatsächlich erledigte Schritte aktualisieren.
