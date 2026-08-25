# Lokales Forced Alignment — kanonischer Sync-Standard

Diese Datei ist die kanonische Regel für **Stimme ↔ Untertitel ↔ Szene**.

## Ziel

Der Sprechertext ist vor dem Audio bekannt. Finale Timings werden deshalb nicht mehr frei transkribiert, sondern lokal gegen den bekannten Text ausgerichtet.

```text
VOICEOVER-ZUM-KOPIEREN.txt
+ SCENE-VOICE-MAP.json
+ exakte Runtime-PCM-WAV
→ lokales Forced Alignment
→ WORD-TIMINGS.json
→ subtitle-cues.json
→ automatische Szenengrenzen
→ VOICE_LOCKED
```

## Kosten / Limits

- lokal
- kein Abo
- kein API-Key
- keine Minuten-/Zeichenquote
- nach erstem Model-Download beliebig oft nutzbar

## Backend

Apple Silicon bevorzugt:

- `mlx-audio==0.5.0`
- `mlx-community/Qwen3-ForcedAligner-0.6B-8bit`
- Modell: Apache-2.0

Andere Systeme:

- `MahmoudAshraf97/ctc-forced-aligner` gepinnt auf Commit `11855d1de76af2b490dd2e8e2db2661805ae90a0`
- Modell `facebook/wav2vec2-large-xlsr-53-german`
- Modell: Apache-2.0

Das Default-MMS-Modell des CTC-Projekts wird wegen seiner CC-BY-NC-Gewichte nicht als Produktionsmodell für monetarisierte Reels verwendet.

## Einmalige Installation

```bash
node ki/scripts/setup-local-forced-aligner.mjs
```

## Reel synchronisieren

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Der Befehl erzeugt Runtime-WAV, `WORD-TIMINGS.json`, finale Caption-Cues und VOICE_LOCKED-Szenengrenzen. Es gibt kein fuzzy guessing: Wortanzahl und Wortreihenfolge müssen zum kanonischen Sprechertext passen, sonst schlägt der Vorgang fehl.

Whisper bleibt Fallback/Diagnose für unbekanntes Audio, ist aber nicht die primäre Timing-Autorität bei bekanntem Sprechertext.
