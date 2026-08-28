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

## Phase 2 — Voiceover
**Status:** ERZEUGT — LOKALER DOWNLOAD AUSSTEHEND

Voice: `clear`
Context: `4a7eee04ddbd4158b51c32644c31997e`

## Phase 3 — vollständiger Transfer-Test inklusive Social-Master
**Status:** JETZT LOKAL TESTEN

Dieser Reel ist der erste Test nach der Globalisierung von Step 1–3 und prüft zusätzlich:

- deterministisches Ranking mehrerer Wikimedia-Kandidaten
- Public-Domain/CC0-Präferenz
- Smart-Crop eines echten technischen Bildes
- Social-Audio-Master auf ungefähr -16 LUFS
- 1x-Review ausschließlich auf dem gemasterten MP4

Ein-Kommando-Test:

```bash
node ki/scripts/test-gpt56-api-prices-fastmode.mjs
```

Erwartete Ausgabe:

```text
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-mastered-test.mp4
out/gpt56-api-transfer-test/KI-GPT56APIPricesFastMode-contact-sheet.jpg
out/gpt56-api-transfer-test/TRANSFER-TEST-REPORT.json
```

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten Review dieses gemasterten MP4 auf `PENDING`.
