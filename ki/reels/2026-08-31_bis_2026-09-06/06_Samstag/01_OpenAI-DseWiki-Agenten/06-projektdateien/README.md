# 06 — Projektdateien

Kanonische Phase-1-Verträge für Story, Level-Up v4, Brand/Motion, SFX, Visuals und Review.

Ausführbarer Source: `ki/src/reels/openai-dsewiki-agents/`.

Timing ist bis zum Nutzer-Audio ausschließlich Planung. `WORD-TIMINGS.json` wird erst in Phase 3 zur Autorität.

## Review-Regel

Der erste Test-Render wurde analysiert und anschließend durch Source-Änderungen superseded. Deshalb bleiben alle finalen Review-Gates `PENDING`, bis ein neuer gemasterter Review-Master erzeugt und exakt bei 1x geprüft wurde.

Kanonischer Review-Render:

```bash
node ki/scripts/render-social-reel.mjs ki/reels/2026-08-31_bis_2026-09-06/06_Samstag/01_OpenAI-DseWiki-Agenten
```

Dieser Pfad rendert H.264/CRF18, mastert Audio auf das Social-Ziel, validiert den Container und erzeugt einen SHA256-gebundenen Render-Report. Ein beliebiger Roh-Render ist kein Freigabenachweis.
