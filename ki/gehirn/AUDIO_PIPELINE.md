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

## Runtime-Audio + Pause-Kompression

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
public/runtime-audio/<compositionId>.pacing.json
```

Die WAV ist immer **48 kHz Stereo PCM s16le** und exakt die Audiospur, die Remotion später rendert.

Wenn `reel.json -> audio.pauseCompression.enabled` aktiv ist, werden längere Sprachlücken bereits **vor dem Forced Alignment** komprimiert. Kanonischer Reel-Startwert:

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

Das bedeutet: längere Stille wird stark verkürzt, eine kleine natürliche Restpause bleibt bestehen. Wenn die Kompression mehr als 25 % der Gesamtdauer entfernen würde, schlägt die Pipeline als Safety-Gate fehl. Zusätzlich wird die resultierende Runtime-WAV auf unerwartet lange Silence-Gaps geprüft.

**Wichtig:** Nach Aktivierung oder Änderung dieser Pacing-Regeln sind alte `VOICE_LOCKED`-Timings ungültig.

## Finale Timing-Autorität

```text
VOICEOVER-ZUM-KOPIEREN.txt
+
SCENE-VOICE-MAP.json
+
pause-komprimierte Runtime-PCM-WAV
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

Der Befehl erzeugt/verifiziert zuerst die bereits verdichtete Runtime-WAV und richtet danach den **bekannten** Sprechertext lokal exakt auf diese WAV aus. Damit kommen Stimme, Wortzeiten, Untertitel, Szenenstarts und finale Composition-Dauer aus derselben Tonspur.

Whisper bleibt für unbekanntes Audio oder Diagnose zulässig, ist aber nicht die primäre Timing-Autorität, wenn der exakte Sprechertext bereits vorliegt.

## Voice-/Scene-Lock

Nach lokalem Alignment müssen gelten:

- `WORD-TIMINGS.json` stammt aus der exakten pause-komprimierten Runtime-WAV
- kein fuzzy word matching
- Wortreihenfolge entspricht exakt `VOICEOVER-ZUM-KOPIEREN.txt`
- jeder Satz ist über `SCENE-VOICE-MAP.json` genau einer Szene zugeordnet
- `subtitle-cues.json` enthält echte Wortframes
- Szenenstarts werden aus dem ersten tatsächlich gesprochenen Wort ihrer gemappten Szene abgeleitet
- `reel.json.format.finalDurationInFrames` folgt der Runtime-WAV

Danach erst committen und `prepare-reel-render.mjs` ausführen.

Ein Render ohne hörbares, synchrones und korrekt gepactes Audio ist kein Finalzustand.
