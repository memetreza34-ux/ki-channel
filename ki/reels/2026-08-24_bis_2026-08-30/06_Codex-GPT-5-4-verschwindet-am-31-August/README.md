# Codex GPT-5.4 Sunset — Transfer-Test

Neues Reel von null, um den vollständigen Produktionsworkflow nach dem Apple-Messages-Test zu prüfen.

## Thema
Am 31. August 2026 werden GPT-5.4 und GPT-5.4 mini aus Codex entfernt, wenn Codex über den ChatGPT-Login genutzt wird. OpenAI empfiehlt GPT-5.6 Terra bzw. GPT-5.6 Luna. API- und API-Key-authentifizierte Codex-Sitzungen bleiben von dieser Änderung unberührt.

## Test

```bash
node ki/scripts/test-codex-gpt54-sunset.mjs
```

Der Test führt echtes lokales Forced Alignment, Pause-Kompression, Szenen-/Caption-Lock, automatische CC0-SFX-Auswahl, ein lizenzgefiltertes Wikimedia-Visual, Typecheck, Render und A/V-Gate aus.

Ergebnis ist ein **Test-MP4, nicht final**. Erst nach 1x-Review darf `MOTION-READABILITY-REVIEW.md` auf PASS gesetzt werden.
