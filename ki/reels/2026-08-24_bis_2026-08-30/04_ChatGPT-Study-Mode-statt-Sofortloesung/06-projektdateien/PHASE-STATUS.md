# Produktionsstatus — ChatGPT Study Mode

## Phase 1 — Inhalt + Source

**Status:** IMPLEMENTIERT / LEGACY-SCRIPT-AUSNAHME DOKUMENTIERT

Vorhanden:

- finaler bestehender Sprechertext (106 Wörter)
- Script-Budget-Ausnahme in `reel.json` dokumentiert; **kein Vorbild für neue Reels**
- exaktes `SCENE-VOICE-MAP.json`
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

**Status:** REMOTE ERZEUGT — LOKALER MASTER + FORCED-ALIGNMENT-/VOICE-LOCK FEHLEN

Kanonischer Zielpfad:

`01-script-audio/voiceover.mp3`

Pflicht:

1. echtes Audio lokal herunterladen/ablegen
2. `node ki/scripts/align-reel-local.mjs <reel-package-dir>`
3. dabei Pause-Kompression + lokales exaktes Forced Alignment gegen `VOICEOVER-ZUM-KOPIEREN.txt`
4. `WORD-TIMINGS.json` erzeugen
5. Szenengrenzen + `finalDurationInFrames` aus den echten Wortankern schreiben
6. `subtitle-cues.json` und `SCENE-VOICE-MAP.json` auf VOICE_LOCKED bringen
7. generierte getrackte Timing-Dateien reviewen und committen
8. `prepare-reel-render.mjs` auf sauberem Worktree ausführen

Remote-URL ist nur Provenance und darf nicht direkt gerendert werden. Freies Whisper-Transkribieren ist für diesen bekannten Sprechertext **nicht** mehr der kanonische Timing-Pfad.

## Echte Render-Beobachtung

**Status:** REVIEWED — NICHT FREIGEGEBEN

Der bereitgestellte alte Render war ca. 40.19 s lang und beweist, dass der alte 1950-Frame-Plan nicht der echte Final-Timing-Stand ist.

Review-Fails:

- mehrere Beats in Szene 2/3/4 zu schnell
- Szene 4 als dunkler Fullscreen-Stilbruch unerwünscht
- Schluss-Hold zu kurz
- alter Render erfüllt den neuen Caption-/Kamera-/Audio-Mix-Review-Vertrag nicht

Details: `MOTION-READABILITY-REVIEW.md` → aktuell `FAIL`.

## Final

**Status:** BLOCKED UNTIL LOCAL ALIGNMENT + MOTION PASS + SOCIAL-MASTER + RERENDER

Vor Final zwingend:

- lokaler Audio-Master
- lokales Forced Alignment + Scene/Caption Voice-Lock PASS
- Szenen-/Dauer-Writeback PASS
- Script-Budget-Gate mit dokumentierter Legacy-Ausnahme PASS
- vollständige Repo-/Motion-/Remotion-Gates
- neuer Roh-Render aus aktuellem Source
- Social-Audio-Master ungefähr -16 LUFS
- **genau den gemasterten MP4** bei 1x ansehen und anhören
- Caption-Sync, Kamera/Zoom, Audio-Mix im `MOTION-READABILITY-REVIEW.md` explizit PASS
- `finalize-reel-export.mjs`
- `validate-reel-export-package.mjs`
- exportierten MP4 erneut ansehen und anhören

Erst danach: `FINAL VIDEO READY — EXPORT PACKAGE READY`.
