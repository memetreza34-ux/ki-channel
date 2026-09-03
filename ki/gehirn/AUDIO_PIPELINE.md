# Kanonische Audio-Pipeline — KI-Reels

Diese Datei ist die **eine Audio-Wahrheit** für Short-Form-Reels.

## Grundsatz

Das Produktions-Voiceover wird **ausschließlich vom Nutzer** erstellt und manuell in den Reel-Ordner gelegt.

Nicht erlaubt:

- Voiceover-Erzeugung durch ChatGPT, Codex, Antigravity oder andere Agenten
- Aufruf eines TTS-/Voice-Tools durch Agenten für das Produktionsaudio
- automatischer Download einer Voiceover-Datei aus einer Remote-URL
- Preview-Audio als Ersatz für das vollständige Voiceover
- automatisches Ersetzen einer fehlenden Nutzerdatei

Fehlt das lokale Nutzer-Audio, stoppt die Pipeline in Phase 2.

## Kanonische Dateien

```text
01-script-audio/
├── voiceover.md
├── VOICEOVER-ZUM-KOPIEREN.txt
├── SCENE-VOICE-MAP.json
├── WORD-TIMINGS.json             # erst nach echtem Forced Alignment
├── voiceover.mp3 oder voiceover.wav
└── audio-source.json
```

`audio-source.json` dokumentiert nur, dass das Audio vom Nutzer bereitgestellt wird. Es enthält keine notwendige Remote-Renderquelle.

## Nutzer-Audio ist Pflicht

Der Nutzer legt die vollständige Datei unter `reel.json -> audio.targetFile` ab, normalerweise:

```text
01-script-audio/voiceover.mp3
```

Erst wenn diese Datei existiert, darf die Pipeline fortfahren.

Danach:

1. lokale Datei mit `ffprobe` prüfen
2. Runtime-Audio inklusive Pacing erzeugen

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Das Ergebnis ist:

```text
public/runtime-audio/<compositionId>.wav
public/runtime-audio/<compositionId>.pacing.json
```

Die WAV ist immer **48 kHz Stereo PCM s16le** und exakt die Audiospur, die Remotion später rendert. MP3-Container-/Encoder-Padding ist deshalb keine Timing-Autorität.

## Level-Up-v3 Sprachtempo — 1,10×

Für neue Reels ab **03.09.2026** gilt standardmäßig:

```json
{
  "speechTempo": 1.10,
  "tempoPolicy": "PITCH_PRESERVING_FFMPEG_ATEMPO_BEFORE_FORCED_ALIGNMENT"
}
```

Das bedeutet:

```text
Nutzer-Voiceover
→ lange Pausen kompakter machen
→ ffmpeg atempo=1.10 mit Pitch-Erhalt
→ Runtime-WAV
→ erst danach Forced Alignment
→ neue Word-Timings
→ Captions / Szenen / Reveals / SFX folgen dem schnelleren Audio
```

**Nicht erlaubt:** fertiges MP4 nachträglich pauschal auf 1,10× beschleunigen. Das würde Animation, Caption- und SFX-Synchronität umgehen. Die 1,10×-Änderung gehört in die Runtime-Audio-Stufe vor dem Alignment.

`reel.json -> audio.speechTempo` kann einen Reel-spezifischen Wert definieren. Ohne expliziten Wert gilt ab 03.09.2026 automatisch `1.10`; ältere Reels bleiben standardmäßig `1.00`, solange sie nicht bewusst migriert werden.

## Pause-Kompression — lange KI-Pausen entfernen, natürliche Pausen behalten

Ab Level-Up v3 ist die Pause-Kompression standardmäßig aktiv, sofern ein Reel sie nicht bewusst überschreibt.

Kanonischer v3-Startwert:

```json
{
  "enabled": true,
  "thresholdDb": -35,
  "triggerSeconds": 0.32,
  "keepSeconds": 0.22,
  "startKeepSeconds": 0.03,
  "maxAllowedSilenceSeconds": 0.30,
  "maxReductionRatio": 0.25
}
```

Ziel:

- kurze natürliche Sprachpausen bleiben erhalten;
- längere typische KI-Pausen werden auf einen kompakten Rhythmus reduziert;
- nach dem anschließenden `1.10×`-Tempo liegen die behaltenen Pausen typischerweise noch etwas kürzer;
- keine harte Dauerbeschleunigung des gesamten fertigen Videos.

Das Script validiert nach der Runtime-Erstellung erneut, dass keine unerwartet langen Silence-Gaps übrig bleiben und dass nicht zu viel Audiomaterial entfernt wurde.

**Forced Alignment läuft immer erst nach Pause-Kompression und Tempoanpassung.** Dadurch verwenden Stimme, Wortzeiten, Captions, Szenengrenzen, Reveals, SFX und Composition-Dauer dieselbe Runtime-WAV.

## Finale Timing-Autorität

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
NUTZER-VOICEOVER
        ↓
Pause-Kompression
        ↓
1,10× Pitch-preserving Tempo (v3 Default)
        ↓
Runtime-PCM-WAV
        ↓
LOCAL FORCED ALIGNMENT
        ↓
WORD-TIMINGS.json
        ↓
Captions + Szenen + Reveals + SFX + finale Duration
```

Ein-Kommando-Alignment:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Der Befehl richtet den bekannten Sprechertext lokal auf die Runtime-WAV aus, schreibt Wortzeiten, baut Caption-Cues und leitet Szenengrenzen aus dem Satz→Szene-Mapping ab.

Whisper bleibt für unbekanntes Audio oder Diagnose zulässig, ist aber nicht die primäre finale Timing-Autorität, wenn der exakte Sprechertext bereits vorliegt.

## Voice-/Scene-Lock

Nach lokalem Alignment müssen gelten:

- `WORD-TIMINGS.json` stammt aus der exakten Runtime-WAV
- kein fuzzy word matching
- Wortreihenfolge entspricht exakt `VOICEOVER-ZUM-KOPIEREN.txt`
- jeder Satz ist über `SCENE-VOICE-MAP.json` genau einer Szene zugeordnet
- `subtitle-cues.json` enthält echte Wortframes
- Szenenstarts werden aus dem ersten tatsächlich gesprochenen Wort ihrer gemappten Szene abgeleitet
- `reel.json.format.finalDurationInFrames` folgt der Runtime-WAV
- Scene-Voice- und Voice-Lock-Gates bestehen

Danach erst committen und:

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

## Render-Provenance

`prepare-reel-render.mjs` bindet Git-Commit, Source, Timing, Captions, SFX, Visuals, kanonisches Nutzer-Audio, Runtime-WAV und finale Dauer per SHA256.

`public/runtime-audio/<compositionId>.pacing.json` protokolliert zusätzlich:

- angewendetes `speechTempo`
- ob der Tempo-Default automatisch kam
- Pause-Kompressionsparameter
- Quelldauer
- reine Tempo-Baseline
- Runtime-Dauer
- Pause-Reduktion
- gesamte Verkürzung gegenüber dem Nutzer-Master

## Social-Audio-Master

Der Remotion-Roh-Render ist noch nicht automatisch der veröffentlichungsfertige Audio-Master. Der komplette Mix aus Nutzer-Voiceover + SFX wird nach dem Render gemastert.

Ziel:

- Integrated Loudness: **−16 LUFS**
- True Peak Ziel: **−1,5 dBTP**

```bash
node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>
node ki/scripts/validate-social-audio-master.mjs <mastered-render.mp4>
node ki/scripts/validate-final-video.mjs <mastered-render.mp4>
```

Der 1x-Review und der Finalizer müssen auf genau dem gemasterten MP4 stattfinden.

## Git-/Speicherregel

Das vom Nutzer bereitgestellte MP3/WAV bleibt lokal/ignored. In Git bleiben Skript, Scene-Voice-Map, Word-Timings, Provenance, Captions, Contracts, Reviews und Export-Manifest.

## Stummes oder zu leises Video verhindern

- Production-Compositions laden nur die lokale Runtime-WAV
- aktive Reel-Komponenten fail-closed bei fehlendem `voiceoverSrc`
- `validate-final-video.mjs` prüft Audio-Stream + grundlegende Lautstärke
- `validate-social-audio-master.mjs` prüft den finalen Social-Master
- Finalizer läuft erst nach allen Audio-/Timing-/Motion-/Provenance-Gates

Ein Render ohne hörbares, synchrones und ausreichend gemastertes **Nutzer-Voiceover** ist kein Finalzustand.
