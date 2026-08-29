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
2. Runtime-Audio inklusive optionaler Pause-Kompression erzeugen

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Das Ergebnis ist:

```text
public/runtime-audio/<compositionId>.wav
public/runtime-audio/<compositionId>.pacing.json
```

Die WAV ist immer **48 kHz Stereo PCM s16le** und exakt die Audiospur, die Remotion später rendert. MP3-Container-/Encoder-Padding ist deshalb keine Timing-Autorität.

## Pause-Kompression — kein Leerlauf zwischen Beats

Für Reels kann in `reel.json -> audio.pauseCompression` ein dichteres Sprach-Pacing aktiviert werden.

Kanonischer Startwert:

```json
{
  "enabled": true,
  "thresholdDb": -35,
  "triggerSeconds": 0.15,
  "keepSeconds": 0.05,
  "startKeepSeconds": 0.03,
  "maxAllowedSilenceSeconds": 0.25,
  "maxReductionRatio": 0.25
}
```

Wichtig: **Forced Alignment läuft erst nach dieser Pause-Kompression.** Dadurch verwenden Stimme, Wortzeiten, Captions, Szenengrenzen und Composition-Dauer dieselbe Runtime-WAV.

## Finale Timing-Autorität

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
NUTZER-VOICEOVER
        ↓
Runtime-PCM-WAV
        ↓
LOCAL FORCED ALIGNMENT
        ↓
WORD-TIMINGS.json
        ↓
Captions + Szenen + finale Duration
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
