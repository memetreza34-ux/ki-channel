# Produktionsstatus — Warum unklare Prompts die KI raten lassen

**Produktionsvertrag:** V2 — erstes reales End-to-End-Testreel

## Phase 1 — ChatGPT

**Status:** FERTIG

Vorhanden und autoritativ:
- V2-Produktionsvertrag
- Creative Brief
- Source Ledger mit geprüften Prompting-Claims
- 142-Wörter-Sprechertext + wortgleiche Copy-Datei
- fünf Szenen / zwölf bedeutungstragende Visual Beats
- Visual Strategy: alle Beats `REMOTION_NATIVE` + `NEW_BUILD`
- Animation-Plan und `reel.json`
- Subtitle-Basiscues
- keine externen Bilder/Captures erforderlich
- ausführbarer Source unter `ki/src/reels/ambiguous-prompts/`
- Composition `KI-AmbiguousPrompts`
- Creative Review als offenes Phase-3-Gate

Nicht als bereits erledigt behauptet: aktueller Branch-CI/Readiness-Lauf, echtes Audio, Exact Word Sync, Smoke-Review, finaler Render oder Creative-QA-PASS.

## Phase 2 — Mensch

**Status:** NÄCHSTER SCHRITT — NUR AUDIO

`01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` wortgetreu vertonen und bevorzugt als `voiceover.wav`, alternativ als `voiceover.mp3`, direkt in `01-script-audio/` ablegen.

Für dieses Reel sind laut `02-bilder/asset-manifest.json` keine externen Bilder, Videos oder Captures erforderlich.

## Phase 3 — Codex / Antigravity

**Status:** WARTET AUF PHASE-2-AUDIO

Verbindliche Reihenfolge nach Eingang des echten Voiceovers:

1. finales Audio als reale Timing-Autorität prüfen
2. `node scripts/sync-reel-word-timings.mjs --dir "ki/reels/2026-08-10_bis_2026-08-16/02_Warum-unklare-Prompts-die-KI-raten-lassen"` ausführen
3. Exact Word Sync muss Wort für Wort zum freigegebenen Script passen; keine lineare Schätzung als Final-Timing
4. Szenen-/Beat-Grenzen und Holds an das echte Audio anpassen, ohne die zwölf Beat-Bedeutungen neu zu erfinden
5. TypeScript, fokussierte Tests, Struktur- und Remotion-Readiness tatsächlich ausführen
6. Opening/Mid/End plus relevante Beat-Wechsel als Smoke-Frames rendern und ansehen
7. finales MP4 rendern und normal + smartphone-groß ansehen/anhören
8. `creative-review.md` erst nach echter Prüfung auf PASS oder FAIL setzen

Fehlt das Audio, bleibt die korrekte Blockermeldung: `PHASE 2 AUDIO FEHLT`.
