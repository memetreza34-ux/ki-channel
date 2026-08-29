# Produktionsstatus — GPT-5.6 API Preise + Fast Mode

## Phase 1 — Inhalt / Story
**Status:** STORY-REDESIGN IMPLEMENTIERT — RUNTIME-PRÜFUNG NOCH OFFEN

- offizieller OpenAI-Faktenstand vom 30. Juli 2026
- finaler deutscher Sprechertext mit **159 Wörtern**
- Ziel: **60–75 Sekunden** tatsächliche Voice-Locked-Laufzeit
- exaktes Satz→Szene-Mapping
- 5 Hauptkapitel, aber nicht mehr nur 5 statische Visual States
- `story-beats.json` mit **18 konkreten Visual Beats**
- Story-Arc: Hook → Änderung/Problem → Proof → Konsequenz → Payoff
- neue Story-Motion-Schicht mit `StoryBeat`, `StoryCamera`, `ImpactNumber`, `StoryTexture`, `StoryCutFlash`
- echte `@remotion/transitions`-Sequenz für `priority → routing → Fast Mode`
- 3D-Hero über `@remotion/three`
- Skia-Procedural-Backdrop; Lottie/Rive als lokale, wiederverwendbare Story-Layer integriert
- `@remotion/effects` für dezente Story-Textur; kein Effekt-Spam
- semantische SFX-Events bleiben im lokalen CC0-Produktionssystem
- geranktes Wikimedia-Visual für den realen Data-Center-Proof
- offizieller OpenAI-Source-Proof
- Script-Budget: bevorzugt 150–175 Wörter, Hard-Limit 190
- Planning-Timeline: 2070 Frames / 69 Sekunden bei 30 fps; final bleibt das echte Nutzer-Voiceover maßgeblich

**Wichtig:** Die neue Story-Source ist im Repo implementiert, aber TypeScript/Remotion-Render wurden in dieser GitHub-Quellumgebung noch nicht ausgeführt. Phase 1 darf deshalb erst nach lokalem Install/Verify als technisch PASS bezeichnet werden.

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

- Storytelling-Motion-Gate: mindestens 15 Beats, vollständiger Story-Arc, mindestens zwei visuelle Änderungen je Szene
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
- Remotion Story-Stack: Effects, Transitions, Three, Skia sowie lokale Lottie/Rive-Fähigkeit
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

Dieser Modus regeneriert die getrackten Timing-/Visual-Verträge nicht, prüft sie erneut und muss anschließend den echten `prepare-reel-render.mjs`-Provenance-Lock erreichen. Das Pre-Render-Gate blockiert das neue Reel, wenn die Story-Struktur nicht mehr stimmt oder die echte Voice-Locked-Dauer außerhalb **60–75 Sekunden** liegt.

Erwartete Ausgabe nach erfolgreichem Render-Lauf:

```text
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-mastered-test.mp4
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-contact-sheet.jpg
out/gpt56-api-transfer-test/TRANSFER-TEST-REPORT.json
```

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten Review dieses exakten gemasterten MP4 auf `PENDING`. Beim Review zusätzlich prüfen: Storyfluss, visuelle Beat-Dichte, motivierte Kamera/Transitions und keine langen statischen Präsentationszustände. Erst danach dürfen Finalizer und Export-Package-Gate laufen.
