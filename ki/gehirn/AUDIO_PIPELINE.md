# Kanonische Audio-Pipeline — KI-Reels

Diese Datei ist die **eine Audio-Wahrheit** für Short-Form-Reels.

## Grundsatz

Ein Reel darf Voiceover real per verfügbarem Voice-/TTS-Tool oder durch Nutzer/Mensch erhalten. Nicht zulässig ist, Audio nur zu behaupten, eine URL zu erfinden oder einen stummen Render als fertig zu behandeln.

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

`audio-source.json` dokumentiert Provenance. Es ist **keine Renderquelle**.

## Keine Render-Time-Netzwerkquelle

Remotion rendert niemals direkt von einer TTS-/CDN-/Remote-URL.

Nach einer Tool-Erzeugung:

1. Audio tatsächlich herunterladen.
2. unter `reel.json -> audio.targetFile` ablegen.
3. lokal mit `ffprobe` prüfen.
4. Runtime-Audio erzeugen:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Das Ergebnis ist:

```text
public/runtime-audio/<compositionId>.wav
```

Diese Datei ist immer **48 kHz Stereo PCM s16le WAV** und exakt die Audiospur, die Remotion später rendert. MP3-Container-/Encoder-Padding ist deshalb keine Timing-Autorität.

## Finale Timing-Autorität

Für normale KI-Reels ist der Sprechertext bereits exakt bekannt. Deshalb gilt ab jetzt:

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
Runtime-PCM-WAV
        ↓
LOCAL FORCED ALIGNMENT
        ↓
WORD-TIMINGS.json
        ↓
Captions + Szenen + finale Duration
```

Kanonische Details: `ki/gehirn/FORCED_ALIGNMENT.md`.

Ein-Kommando-Alignment:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Der Befehl erzeugt/verifiziert die Runtime-WAV, richtet den **bekannten** Sprechertext lokal auf diese WAV aus, schreibt Wortzeiten, baut Caption-Cues und leitet die Szenengrenzen aus dem Satz→Szene-Mapping ab.

Whisper bleibt für unbekanntes Audio oder Diagnose zulässig, ist aber **nicht mehr die primäre finale Timing-Autorität**, wenn der exakte Sprechertext bereits vorliegt.

## Kosten / Limits

Die kanonische Alignment-Lösung ist lokal und kostenlos:

- kein Abo
- kein API-Key
- keine Minuten-/Zeichenquote
- Modelle werden einmal lokal geladen und danach beliebig oft verwendet

Auf Apple Silicon wird bevorzugt `mlx-qwen3` verwendet. Auf anderen Systemen `ctc-german`.

Für monetarisierte Reels werden nur die im Forced-Alignment-Vertrag dokumentierten kommerziell nutzbaren Modellpfade verwendet. Das standardmäßige MMS-Modell des CTC-Projekts wird wegen seiner CC-BY-NC-Gewichte ausdrücklich **nicht** als Produktionsmodell verwendet.

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

`prepare-reel-render.mjs` erzeugt lokal einen `RENDER_LOCKED`-Datensatz mit mindestens:

- Git-Commit
- Source-Tree-SHA256
- Render-Contract-SHA256
- Scene-Voice-Map-SHA256
- Caption-JSON-SHA256
- kanonischem Audio-SHA256
- Runtime-WAV-SHA256
- finaler Frame-Dauer

Der Finalizer akzeptiert keinen Render, dessen gelockte renderrelevante Inputs danach verändert wurden.

## Git-/Speicherregel

Große Binärmedien bleiben standardmäßig lokal/Artifact-Storage. In Git bleiben Source, Skript, `SCENE-VOICE-MAP.json`, `WORD-TIMINGS.json`, Provenance, Captions, Contracts, Reviews und Export-Manifest.

## Stummes Video verhindern

- Production-Compositions laden nur die lokale Runtime-WAV
- aktive Reel-Komponenten fail-closed bei fehlendem `voiceoverSrc`
- `validate-final-video.mjs` prüft Audio-Stream + Lautstärke
- Finalizer läuft erst nach Scene-Voice-, Voice-Lock-, Motion-, Entertainment-, Provenance- und Audio-Gates

Ein Render ohne hörbares, synchrones Audio ist kein Finalzustand.
