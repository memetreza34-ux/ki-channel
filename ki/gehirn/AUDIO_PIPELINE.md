# Kanonische Audio-Pipeline — KI-Reels

Diese Datei ist die Audio-Wahrheit für Short-Form-Reels.

## Grundsatz

Voiceover darf real per verfügbarem Voice-/TTS-Tool oder durch Nutzer/Mensch entstehen. Remotion rendert niemals direkt von einer Remote-TTS-URL.

## Dateien

```text
01-script-audio/
├── VOICEOVER-ZUM-KOPIEREN.txt
├── SCENE-VOICE-MAP.json
├── WORD-TIMINGS.json             # erst nach lokalem Forced Alignment
├── voiceover.mp3 oder voiceover.wav
└── audio-source.json
```

## Runtime-Audio

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

erzeugt exakt:

```text
public/runtime-audio/<compositionId>.wav
```

48 kHz Stereo PCM s16le WAV. Diese dekodierte Datei ist Audio- und Timing-Autorität für den Render.

## Finaler Sync bei bekanntem Sprechertext

Whisper ist nicht mehr der Standard. Der Sprechertext ist bereits bekannt, deshalb wird er lokal auf die echte Runtime-WAV ausgerichtet:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Pipeline:

```text
VOICEOVER-ZUM-KOPIEREN.txt
+ SCENE-VOICE-MAP.json
+ Runtime-WAV
→ LOCAL FORCED ALIGNMENT
→ WORD-TIMINGS.json
→ Caption-Cues
→ automatische Szenengrenzen
→ VOICE_LOCKED
```

Kanonische Details: `ki/gehirn/FORCED_ALIGNMENT.md`.

## Kosten / Limits

- lokal
- kein API-Key
- kein Abo
- keine Minuten-/Zeichenquote
- Modelle werden einmal heruntergeladen und danach lokal wiederverwendet

Apple Silicon nutzt bevorzugt Qwen3 ForcedAligner über MLX. Andere Systeme verwenden den deutschen CTC-Fallback. Die Produktionskonfiguration nutzt nur die dokumentierten Apache-2.0-Modellpfade; das nicht-kommerzielle Default-MMS-Modell des CTC-Projekts ist ausgeschlossen.

## Hard Gates

Vor Production-Render müssen bestehen:

```bash
node ki/scripts/validate-local-forced-alignment.mjs <reel-package-dir>
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Kein fuzzy word matching. Wenn der Aligner nicht exakt zum kanonischen Sprechertext passt, wird abgebrochen statt falsche Timings zu akzeptieren.

`prepare-reel-render.mjs` bindet `WORD-TIMINGS.json`, `SCENE-VOICE-MAP.json`, Caption-JSON, Source, Audio und Runtime-WAV per SHA256 an den Render.

Ein stummer oder hörbar asynchroner Render ist kein Finalzustand.
