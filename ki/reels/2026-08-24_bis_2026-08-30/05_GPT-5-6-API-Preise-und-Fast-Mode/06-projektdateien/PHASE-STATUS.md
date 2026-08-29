# Produktionsstatus — GPT-5.6 API Preise + Fast Mode

## Phase 1 — Inhalt / Story
**Status:** IMPLEMENTIERT — AUF 60–75-SEKUNDEN-STANDARD ERWEITERT

- offizieller OpenAI-Faktenstand vom 30. Juli 2026
- finaler deutscher Sprechertext auf **159 Wörter** erweitert
- Ziel: **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit
- exaktes Satz→Szene-Mapping
- 5 unterschiedliche Hauptszenen mit mehreren Visual Beats
- semantische SFX-Events über die längere Timeline verteilt
- geranktes Wikimedia-Visual mit Auswahlpräferenzen
- offizieller OpenAI-Source-Proof
- Script-Budget: bevorzugt 150–175 Wörter, Hard-Limit 190
- Planning-Timeline: 2070 Frames / 69 Sekunden bei 30 fps; final bleibt das echte Nutzer-Voiceover maßgeblich

## Phase 2 — Voiceover
**Status:** WARTET AUF NUTZER-AUDIO

Der Nutzer erstellt das vollständige Voiceover selbst und legt es hier ab:

`01-script-audio/voiceover.mp3`

Verbindliche Regel:

- kein Voiceover durch ChatGPT
- kein Voiceover durch Codex
- kein Voiceover durch Antigravity
- kein automatischer Download aus einer Remote-URL
- keine Preview-Datei als Ersatz

Erst wenn die vom Nutzer erzeugte vollständige `voiceover.mp3` lokal vorhanden ist, darf Phase 3 starten.

## Phase 3 — Production-Path-Test inklusive Social-Master
**Status:** BLOCKIERT BIS NUTZER-AUDIO VORHANDEN IST

Danach testet der Reel unter anderem:

- 60–75-Sekunden-Laufzeitgate
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

### Lauf 1 — nach Einlegen der Nutzer-Audiodatei

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs
```

Wenn Alignment/Visual-Resolution getrackte JSON-Dateien aktualisieren, stoppt der Test absichtlich vor dem Production-Render mit:

`PREPARED_REQUIRES_COMMIT_BEFORE_PRODUCTION_RENDER`

Diese Dateien reviewen und committen.

### Lauf 2 — gelockter Production-Render

Nach dem Commit:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs --render-locked
```

Dieser Modus regeneriert die getrackten Timing-/Visual-Verträge nicht, prüft sie erneut und muss anschließend den echten `prepare-reel-render.mjs`-Provenance-Lock erreichen. Das Pre-Render-Gate blockiert das neue Reel, wenn die echte Voice-Locked-Dauer außerhalb **60–75 Sekunden** liegt.

Erwartete Ausgabe nach erfolgreichem Render-Lauf:

```text
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-mastered-test.mp4
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-contact-sheet.jpg
out/gpt56-api-transfer-test/TRANSFER-TEST-REPORT.json
```

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten Review dieses exakten gemasterten MP4 auf `PENDING`. Erst danach dürfen Finalizer und Export-Package-Gate laufen.
