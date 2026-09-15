# Skill: Voice-Locked Captions

## Zweck

Verhindert, dass geschätzte Preview-Timings als finale Caption-, Wort-, Szenen- oder Composition-Timings verwendet werden.

## Zwei Skript-Wahrheiten

Pflicht:

```text
01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt
01-script-audio/SCENE-VOICE-MAP.json
```

Die erste Datei ist die Text-Autorität. Die zweite legt **vor dem Alignment** fest, welcher exakte Satz zu welcher Szene gehört.

## Finale Timing-Autorität

Für normale KI-Reels ist der Sprechertext bereits bekannt. Deshalb gilt:

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
Runtime-PCM-WAV
        ↓
lokales Forced Alignment
        ↓
WORD-TIMINGS.json
        ↓
Caption-Cues
        ↓
automatische Szenengrenzen
```

Kanonische Details: `ki/gehirn/FORCED_ALIGNMENT.md`.

## Standardablauf

1. Runtime-WAV erzeugen:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

2. bekannten Text lokal auf genau diese WAV ausrichten:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Der zweite Befehl erzeugt automatisch:

- `WORD-TIMINGS.json`
- echte `words[]` in `subtitle-cues.json`
- Caption-Gruppen aus den Wortzeiten
- Satz→Szene-Zuordnung aus `SCENE-VOICE-MAP.json`
- finale Szenenstarts/-enden
- `format.finalDurationInFrames`
- `VOICE_LOCKED`

Whisper bleibt Diagnose/Fallback für unbekanntes Audio. Wenn der exakte Sprechertext vorliegt, ist Forced Alignment die primäre Timing-Methode.

## Harte Regeln

- kein fuzzy word matching
- Wortanzahl und Wortreihenfolge müssen exakt zum kanonischen Sprechertext passen
- Caption-Text pro Szene muss exakt den gemappten Sprechertext dieser Szene rekonstruieren
- Szene 1 startet bei Frame 0
- Szene 2+ startet am ersten tatsächlich gesprochenen Wort ihres ersten gemappten Satzes
- eine Szene endet nicht vor ihrem letzten gemappten Wort
- finale Duration folgt der Runtime-WAV

## Lokale Backends

Standardauswahl:

- Apple Silicon: `mlx-qwen3`
- sonst: `ctc-german`

Beide laufen lokal ohne API-Limit. Modell-/Lizenzregeln stehen in `FORCED_ALIGNMENT.md`.

## Caption-Gruppen

- typischerweise 3–5 Wörter
- maximal 2 Zeilen
- natürliche Phrasen-/Satzgrenzen bevorzugen
- Start/Ende ausschließlich aus echten Wortzeiten
- Layout ausschließlich aus `captionSafe.ts` / `CAPTION_SAFE_POSITION.md`

## Finale Validierung

```bash
node ki/scripts/validate-scene-voice-map.mjs <reel-package-dir>
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

Kein Final-Render bei fehlender Runtime-WAV, fehlenden Wortzeiten, Planning-/Preview-Timings, falscher Satz→Szene-Zuordnung oder hörbarem Caption-/Scene-Drift.
