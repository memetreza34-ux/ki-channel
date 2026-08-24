# Produktionsstatus — ChatGPT Study Mode

## Phase 1 — Inhalt + Source

**Status:** IMPLEMENTIERT

Vorhanden:

- finaler Sprechertext
- erzeugte Voiceover-Provenance (`audio-source.json`)
- Preview-Captions mit klarer Sperre für Final-Timing
- Szenen-/Animationsplan
- Plattform-Copy + Final-Caption
- Reel-Contract + Entertainment-Review
- eigener Source `ki/src/reels/chatgpt-study-mode/`
- Composition `KI-ChatGPTStudyMode`
- Contract-Test
- Fullscreen-Layout, Header `top:112`, Shared-Caption `bottom:250`

## Audio

**Status:** REMOTE ERZEUGT — LOKALER MASTER + VOICE-LOCK FEHLEN

Kanonischer Zielpfad:

`01-script-audio/voiceover.mp3`

Pflicht:

1. echtes Audio herunterladen/ablegen
2. `ffprobe`
3. Whisper/Voice-Lock
4. `reel.json` Szenengrenzen + `finalDurationInFrames` auf echte Audio-/Bedeutungsgrenzen schreiben
5. `subtitle-cues.json` auf VOICE_LOCKED + echte Wortframes
6. `node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>`

Remote-URL ist nur Provenance und darf nicht direkt gerendert werden.

## Echte Render-Beobachtung

**Status:** REVIEWED — NICHT FREIGEGEBEN

Der bereitgestellte Render war ca. 40.19 s lang und beweist, dass der alte 1950-Frame-Plan nicht der echte Final-Timing-Stand ist.

Visuelles Review:

- insgesamt deutlich besser als frühere Reels
- mehrere Beats in Szene 2/3/4 zu schnell
- Szene 4 als dunkler Fullscreen-Stilbruch unerwünscht
- Schluss-Hold zu kurz

Details: `MOTION-READABILITY-REVIEW.md` → aktuell `FAIL`.

## Final

**Status:** BLOCKED UNTIL AUDIO LOCK + MOTION PASS + RERENDER

Vor Final zwingend:

- lokaler Audio-Master
- Whisper/Voice-Lock PASS
- Szenen-/Dauer-Writeback PASS
- `prepare-reel-audio.mjs`
- TypeScript/fokussierte Tests
- neuer Render aus aktuellem Source
- `MOTION-READABILITY-REVIEW.md` PASS
- `finalize-reel-export.mjs`
- `validate-reel-export-package.mjs`
- exportierten MP4 ansehen und anhören

Erst danach: `FINAL VIDEO READY — EXPORT PACKAGE READY`.
