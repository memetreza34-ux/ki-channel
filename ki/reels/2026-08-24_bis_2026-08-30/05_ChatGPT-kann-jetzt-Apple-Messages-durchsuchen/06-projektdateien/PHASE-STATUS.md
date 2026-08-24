# Produktionsstatus — ChatGPT + Apple Messages

## Phase 1
**Status: IMPLEMENTIERT — AUDIO-LOCK / RENDER AUSSTEHEND**

Vorhanden:
- belegtes aktuelles Thema aus offiziellen OpenAI Release Notes vom 20.08.2026
- finaler deutscher Sprechertext
- Voiceover real per AI Voice Generator erzeugt; Remote-Provenance vorhanden
- Phase-1-Preview-Captions mit vollständigem Sprechertext
- 5-Szenen-Plan + Animation-Plan
- 10/10 Entertainment-Planreview im Validator-Format
- Plattform-Copy + Final-Caption
- Source-Isolation-Contract
- eigener Remotion-Source unter `ki/src/reels/chatgpt-apple-messages/`
- Composition `KI-ChatGPTAppleMessages` in `ki/src/Root.tsx` registriert
- Light-First über alle fünf Visuals
- Shared Caption-Glass-Geometrie statt eigenem Footer
- Production-Komponente fail-closed bei fehlendem `voiceoverSrc`

Nicht als bestanden behauptet:
- vollständiger TypeScript-Typecheck
- Vitest
- Remotion-Bundle
- echter Smoke-/Production-Render
- Motion-Readability-Review des echten MP4

## Phase 2 — Audio
**Status: REMOTE GENERIERT — LOKALER MASTER FEHLT NOCH**

Ziel: `01-script-audio/voiceover.mp3` lokal ablegen. Danach erzeugt `prepare-reel-audio.mjs` die kanonische 48-kHz-PCM-Runtime-WAV.

## Phase 3
**Status: BLOCKIERT BIS RUNTIME-WAV + VOICE-LOCK**

Pflicht:
1. erzeugtes Audio lokal nach `01-script-audio/voiceover.mp3` herunterladen
2. `prepare-reel-audio.mjs`
3. echte Worttimings aus genau der Runtime-WAV erzeugen
4. `subtitle-cues.json` vollständig auf `VOICE_LOCKED` umstellen
5. finale Szenengrenzen + `finalDurationInFrames` in `reel.json` schreiben
6. `prepare-reel-render.mjs` und Render-Provenance-Lock bestehen
7. Production-Render
8. MP4 bei 1x ansehen und anhören
9. Motion-Review mit exakter MP4-SHA256 + Dauer auf PASS bringen
10. Finalizer + Export-Package-Validator

Kein Finalstatus vor diesen Schritten.
