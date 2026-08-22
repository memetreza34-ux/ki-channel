# PHASE STATUS

## Aktueller Status

**PHASE 1 — IMPLEMENTIERT / PHASE 2 AUDIO FEHLT**

Geplanter Veröffentlichungstag: **Dienstag, 25.08.2026**.

## Phase 1 vorhanden

- finaler deutscher Sprechertext
- Copy-Fließtext
- aktuelle OpenAI-Primärquellen
- 5 Szenen / 1590 Planframes @ 30 FPS
- High-Energy Scene Plan
- Meaning-first Animation Plan
- Phase-1 Subtitle-Cues
- Plattform-Copy
- keine externen Bilder erforderlich
- Remotion-Code-Grundlage unter `ki/src/reels/chatgpt-ads-germany/`
- Composition `KI-ChatGPTAdsGermany`
- fokussierter Contract-Test

## Phase 2

Mensch erzeugt ausschließlich das Voiceover aus `VOICEOVER-ZUM-KOPIEREN.txt` und legt `voiceover.wav` oder `voiceover.mp3` ab.

## Phase 3 — zwingend

1. `align-voiceover-whisper.mjs` auf echtes Audio ausführen.
2. Word-/Phrase-Timestamps übernehmen.
3. Composition-Dauer und Szenengrenzen auf Audio neu ausrichten.
4. Visual-Trigger auf dieselben Audio-Anker setzen.
5. `validate-voice-locked-captions.mjs` ausführen.
6. Smoke- und Final-Render neu prüfen.

Kein proportional geschätztes Wort-Timing darf Publishing-Freigabe erhalten.

## Nicht behauptet

Noch nicht als bestanden behauptet: TypeScript, Vitest, Remotion-Bundle, Whisper-Ausrichtung, Smoke-Render, Final-Render oder finale audiovisuelle Freigabe.
