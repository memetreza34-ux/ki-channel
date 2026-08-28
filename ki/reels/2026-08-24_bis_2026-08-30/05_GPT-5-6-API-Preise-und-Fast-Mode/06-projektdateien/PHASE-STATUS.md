# Produktionsstatus — GPT-5.6 API Preise + Fast Mode

## Phase 1 — Inhalt / Story
**Status:** IMPLEMENTIERT

- offizieller OpenAI-Faktenstand vom 30. Juli 2026
- finaler deutscher Sprechertext
- exaktes Satz→Szene-Mapping
- 5 unterschiedliche Szenen
- 9 semantische SFX-Events
- neues geranktes Wikimedia-Visual mit Auswahlpräferenzen
- offizieller OpenAI-Source-Proof
- Script-Budget: 73 Wörter und damit im bevorzugten 55–75-Wörter-Bereich

## Phase 2 — Voiceover
**Status:** ERZEUGT — LOKALER DOWNLOAD AUSSTEHEND

Voice: `clear`
Context: `4a7eee04ddbd4158b51c32644c31997e`

Die Binärdatei bleibt lokal/ignored und wird bei Bedarf durch den Test aus `audio-source.json` heruntergeladen.

## Phase 3 — Production-Path-Test inklusive Social-Master
**Status:** JETZT LOKAL AUSFÜHREN

Dieser Reel ist der abschließende Transfer-Test für:

- Phase-1 Script-Budget
- Pause-Kompression
- exaktes lokales Forced Alignment
- Scene/Voice- und Caption-Lock
- deterministische CC0-SFX
- deterministisches Ranking mehrerer Wikimedia-Kandidaten
- Public-Domain/CC0-Präferenz
- Smart-Crop eines echten technischen Bildes
- Source-Isolation
- globalen Production-Contract-Audit
- TypeScript + fokussierten Reel-Test
- sauberen Git-/Render-Provenance-Lock
- Remotion-Roh-Render
- Social-Audio-Master auf ungefähr -16 LUFS
- 1x-Review ausschließlich auf dem gemasterten MP4

### Lauf 1 — Artefakte erzeugen

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs
```

Wenn Alignment/Visual-Resolution getrackte JSON-Dateien aktualisieren, stoppt der Test absichtlich **vor** dem Production-Render mit:

`PREPARED_REQUIRES_COMMIT_BEFORE_PRODUCTION_RENDER`

Diese Dateien reviewen und committen. Das ist kein Fehler, sondern notwendig, weil `prepare-reel-render.mjs` einen sauberen Worktree verlangt.

### Lauf 2 — gelockter Production-Render

Nach dem Commit:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs --render-locked
```

Dieser Modus regeneriert die getrackten Timing-/Visual-Verträge nicht, prüft sie erneut und muss anschließend den echten `prepare-reel-render.mjs`-Provenance-Lock erreichen.

Erwartete Ausgabe nach erfolgreichem Render-Lauf:

```text
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-mastered-test.mp4
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-contact-sheet.jpg
out/gpt56-api-transfer-test/TRANSFER-TEST-REPORT.json
```

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten Review dieses **exakten gemasterten MP4** auf `PENDING`. Erst danach dürfen Finalizer und Export-Package-Gate laufen.
