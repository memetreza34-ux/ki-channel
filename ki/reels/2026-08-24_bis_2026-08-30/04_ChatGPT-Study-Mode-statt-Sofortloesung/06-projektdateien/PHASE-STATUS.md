# Produktionsstatus — ChatGPT Study Mode

## Phase 1 — Planung + Source
**Status:** IN ARBEIT

Vorhanden:
- finaler Sprechertext
- echte Remote-Voiceover-Generation (`audio-source.json`)
- Preview-Captions mit ausdrücklicher Sperre für Final-Timing
- Szenen-/Animationsplan
- Plattform-Copy + Final-Caption
- Reel-Contract + Entertainment-Review

Phase 1 wird erst auf `IMPLEMENTIERT` gesetzt, wenn Remotion-Source + Root-Wiring + Contract-Test im Branch liegen.

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

## Final
**Status:** NICHT FINAL

Kein finaler MP4 ohne hörbares Audio. Nach Final-Render zwingend:
- `validate-final-video.mjs`
- komplette Hör-/Sichtprüfung
- `finalize-reel-export.mjs`
- `validate-reel-export-package.mjs`

Erst danach: `FINAL VIDEO READY — EXPORT PACKAGE READY`.
