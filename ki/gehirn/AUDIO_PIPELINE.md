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
4. Runtime-Audio inklusive optionaler Pause-Kompression erzeugen:

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

Bedeutung:

- längere Stille ab ungefähr 150 ms wird komprimiert
- eine kleine Restpause bleibt erhalten, damit Wörter nicht unnatürlich zusammenkleben
- Start-Leadin wird stark verkürzt
- die Runtime-WAV wird danach auf unerwartet lange Silence-Gaps geprüft
- wenn mehr als 25 % der Gesamtdauer entfernt würden, bricht die Pipeline als Safety-Gate ab

Wichtig: **Forced Alignment läuft erst nach dieser Pause-Kompression.** Dadurch verwenden Stimme, Wortzeiten, Captions, Szenengrenzen und Composition-Dauer alle dieselbe bereits verdichtete Runtime-WAV.

Alte `VOICE_LOCKED`-Timings sind nach Aktivierung oder Änderung der Pause-Kompression ungültig und müssen neu erzeugt werden.

## Finale Timing-Autorität

Für normale KI-Reels ist der Sprechertext bereits exakt bekannt. Deshalb gilt:

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
Pause-komprimierte Runtime-PCM-WAV
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

Der Befehl erzeugt/verifiziert die Runtime-WAV, richtet den **bekannten** Sprechertext lokal auf diese bereits gepacte WAV aus, schreibt Wortzeiten, baut Caption-Cues und leitet die Szenengrenzen aus dem Satz→Szene-Mapping ab.

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

- `WORD-TIMINGS.json` stammt aus der exakten **pause-komprimierten** Runtime-WAV
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
- Word-Timings-SHA256
- Caption-JSON-SHA256
- SFX-Resolved-SHA256, wenn SFX aktiv sind
- Visual-Manifest- und Visual-Resolved-SHA256, wenn Visuals aktiv sind
- kanonischem Audio-SHA256
- Runtime-WAV-SHA256
- finaler Frame-Dauer

Der Finalizer akzeptiert keinen Render, dessen gelockte renderrelevante Inputs danach verändert wurden.

## Social-Audio-Master — nach dem Remotion-Render

Der Remotion-Roh-Render ist **noch nicht automatisch der veröffentlichungsfertige Audio-Master**. Der komplette Mix aus Voiceover + SFX wird nach dem Render auf eine einheitliche Social-Lautheit gebracht.

Kanonischer Zielwert:

- Integrated Loudness: **−16 LUFS**
- True Peak Ziel: **−1,5 dBTP**
- akzeptiertes Final-Gate: −17 bis −15 LUFS, True Peak höchstens −1,0 dBTP

Mastering:

```bash
node ki/scripts/master-reel-video.mjs <raw-render.mp4> <mastered-render.mp4>
```

Das Skript verwendet zweistufiges FFmpeg-`loudnorm`, kopiert den Videostream **ohne Neu-Encoding** und rendert nur die Audiospur als 48-kHz-AAC neu.

Danach Pflicht:

```bash
node ki/scripts/validate-social-audio-master.mjs <mastered-render.mp4>
node ki/scripts/validate-final-video.mjs <mastered-render.mp4>
```

Wichtig: **Der 1x-Review und der Finalizer müssen auf genau dem gemasterten MP4 stattfinden.** Nicht zuerst den Roh-Render freigeben und danach die Audiospur verändern. `MOTION-READABILITY-REVIEW.md` bindet sich an den exakten final überprüften MP4-Hash.

## Git-/Speicherregel

Große Binärmedien bleiben standardmäßig lokal/Artifact-Storage. In Git bleiben Source, Skript, `SCENE-VOICE-MAP.json`, `WORD-TIMINGS.json`, Provenance, Captions, Contracts, Reviews und Export-Manifest.

## Stummes oder zu leises Video verhindern

- Production-Compositions laden nur die lokale Runtime-WAV
- aktive Reel-Komponenten fail-closed bei fehlendem `voiceoverSrc`
- `validate-final-video.mjs` prüft Audio-Stream + grundlegende Lautstärke
- `validate-social-audio-master.mjs` prüft den finalen Social-Master auf LUFS/True Peak
- Finalizer läuft erst nach Scene-Voice-, Voice-Lock-, SFX-, Visual-, Motion-, Entertainment-, Social-Audio-, Provenance- und Audio-Gates

Ein Render ohne hörbares, synchrones und ausreichend gemastertes Audio ist kein Finalzustand.
