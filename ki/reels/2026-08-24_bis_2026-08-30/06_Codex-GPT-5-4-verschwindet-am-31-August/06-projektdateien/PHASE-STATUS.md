# Produktionsstatus — Codex GPT-5.4 Sunset

## Phase 1 — Inhalt / Story
**Status:** IMPLEMENTIERT

- offizieller OpenAI-Faktenstand: 31. Juli 2026 Release Notes
- Veröffentlichung/Testdatum: 28. August 2026
- finaler deutscher Sprechertext
- exaktes Satz→Szene-Mapping
- 5 unterschiedliche Szenen
- 9 semantische SFX-Events
- echtes externes Visual-Testasset: Public-Domain-NASA-Serverfarm über Wikimedia Commons

## Phase 2 — Voiceover
**Status:** ERZEUGT — LOKALER DOWNLOAD AUSSTEHEND

Voice: `clear`
Context: `9ed316348bc3472f977f0970f4045e17`

## Phase 3 — Vollständiger Systemtest
**Status:** JETZT TESTEN

Dieser Reel ist absichtlich der erste komplette Transfer-Test nach Apple Messages. Er soll beweisen, dass der Workflow auch bei einem komplett neuen Thema von null funktioniert.

### Ein Befehl

```bash
node ki/scripts/test-codex-gpt54-sunset.mjs
```

Der Test erledigt:
1. exaktes erzeugtes Voiceover herunterladen
2. Pause-Kompression
3. echten lokalen Forced-Alignment-Lauf
4. finale Szenengrenzen + Captions erzeugen
5. 9 CC0-SFX deterministisch auflösen
6. Public-Domain-NASA-Serverbild über Wikimedia lizenzgefiltert lokal laden
7. lokale Visual-Datei + Rechte + SHA256 prüfen
8. Source-Isolation
9. TypeScript-Typecheck + Reel-Contract-Test
10. 1080x1920 MP4 rendern
11. technisches A/V-Gate
12. Contact Sheet + Transfer-Testreport erzeugen

### Ausgabe

```text
out/codex-gpt54-transfer-test/KI-CodexGPT54Sunset-test.mp4
out/codex-gpt54-transfer-test/KI-CodexGPT54Sunset-contact-sheet.jpg
out/codex-gpt54-transfer-test/TRANSFER-TEST-REPORT.json
```

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten 1x-Review auf `PENDING`. Kein Final-Status vorher.
