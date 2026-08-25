# Skill: Voice-Locked Captions

## Zweck

Finale Untertitel und Szenen dürfen nicht aus Preview-/Plan-Timings entstehen.

## Zwei Pflichtdateien

```text
VOICEOVER-ZUM-KOPIEREN.txt
SCENE-VOICE-MAP.json
```

Der Sprechertext ist Text-Autorität. Das Scene-Map legt vor dem Alignment fest, welcher Satz zu welcher Szene gehört.

## Primärer Sync-Weg

Bei bekanntem Sprechertext:

```text
Runtime-PCM-WAV + bekannter Text + Scene-Map
→ lokales Forced Alignment
→ WORD-TIMINGS.json
→ finale Caption-Cues
→ automatische Szenengrenzen
→ VOICE_LOCKED
```

Ein Befehl:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Whisper ist nur Fallback/Diagnose für unbekanntes Audio.

## Harte Regeln

- kein fuzzy word matching
- Wortanzahl/-reihenfolge muss zum kanonischen Sprechertext passen
- Caption-Wörter müssen exakt aus `WORD-TIMINGS.json` stammen
- Caption-Text pro Szene muss exakt den gemappten Sprechertext rekonstruieren
- Szene 2+ startet am ersten tatsächlich gesprochenen Wort ihres ersten gemappten Satzes
- finale Duration folgt der Runtime-WAV

## Lokale Backends

- Apple Silicon: Qwen3 ForcedAligner über MLX
- sonst: deutscher CTC-Fallback

Beide ohne API-Minutenlimit. Modell-/Lizenzregeln stehen in `ki/gehirn/FORCED_ALIGNMENT.md`.

## Gates

```bash
node ki/scripts/validate-local-forced-alignment.mjs <reel-package-dir>
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Kein Final-Render bei fehlenden Wortzeiten, falscher Satz→Szene-Zuordnung, Preview-Timing oder hörbarem Caption-/Scene-Drift.
