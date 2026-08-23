# Produktionsstatus — ChatGPT Study Mode

## Phase 1 — Planung + Source
**Status:** IMPLEMENTIERT — AUDIO-LOCK UND RENDER NOCH AUSSTEHEND

Vorhanden:
- finaler Sprechertext
- echte Remote-Voiceover-Generation (`audio-source.json`)
- Preview-Captions mit ausdrücklicher Sperre für Final-Timing
- Szenen-/Animationsplan
- Plattform-Copy + Final-Caption
- Reel-Contract + Entertainment-Review
- eigener ausführbarer Source unter `ki/src/reels/chatgpt-study-mode/`
- fünf neue Study-Mode-spezifische Visuals
- Composition `KI-ChatGPTStudyMode` in `ki/src/Root.tsx` registriert
- Contract-Test angelegt
- Fullscreen-Hintergründe, Header `top:112`, Caption `bottom:250`, kein Footer-Split

Nicht als bestanden behauptet, bis tatsächlich ausgeführt:
- TypeScript/Tests
- Remotion-Bundle/Smoke-Render
- Post-Render-Entertainment-Review

## Audio
**Status:** ERZEUGT REMOTE — DOWNLOAD INS REPO ERFORDERLICH

Zielpfad:
`01-script-audio/voiceover.mp3`

Pflicht:
1. `fetch-generated-voiceover.mjs` ausführen
2. Audio mit ffprobe messen
3. Whisper/Voice-Lock gegen genau diese Datei ausführen
4. `subtitle-cues.json` mit echten Wortframes ersetzen
5. Szenengrenzen und Composition-Dauer auf Audio anpassen
6. finale Composition mit genau diesem Voiceover rendern

## Final
**Status:** NICHT FINAL

Kein finaler MP4 ohne hörbares Audio. Nach Final-Render zwingend:
- `validate-final-video.mjs`
- komplette Hör-/Sichtprüfung
- `finalize-reel-export.mjs`
- `validate-reel-export-package.mjs`

`05-export/` muss enthalten:
- `KI-ChatGPTStudyMode.mp4`
- `KI-ChatGPTStudyMode-cover.png`
- `KI-ChatGPTStudyMode-caption.txt`
- `KI-ChatGPTStudyMode-export-manifest.json`

Erst danach: `FINAL VIDEO READY — EXPORT PACKAGE READY`.
