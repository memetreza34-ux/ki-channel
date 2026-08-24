# Kanonische Audio-Pipeline — KI-Reels

Diese Datei ist die **eine Audio-Wahrheit** für Short-Form-Reels.

## Grundsatz

Ein Reel darf Voiceover auf zwei reale Arten erhalten:

1. **direkt mit einem tatsächlich verfügbaren Voice-/TTS-Tool erzeugt**, oder
2. **vom Nutzer/Menschen bereitgestellt**.

Beides ist zulässig. Nicht zulässig ist, Audio nur zu behaupten, eine URL zu erfinden oder einen stummen Render als fertig zu behandeln.

## Kanonische Dateien

Im Reel-Paket:

```text
01-script-audio/
├── voiceover.md
├── VOICEOVER-ZUM-KOPIEREN.txt
├── voiceover.mp3 oder voiceover.wav   # lokaler Audio-Master, nicht zwingend Git-tracked
└── audio-source.json                  # Provenance, wenn Tool/Remote-Erzeugung genutzt wurde
```

`audio-source.json` dokumentiert Herkunft/Provider/ID. Es ist **keine Renderquelle**.

## Keine Render-Time-Netzwerkquelle

Remotion rendert niemals direkt von einer TTS-/CDN-/Remote-URL.

Nach einer Tool-Erzeugung gilt diese Reihenfolge:

1. Audio tatsächlich herunterladen.
2. am kanonischen `reel.json -> audio.targetFile` ablegen.
3. lokal mit `ffprobe` prüfen.
4. **Runtime-Audio vorbereiten:**

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

5. Whisper/Voice-Lock gegen **genau die vorbereitete Runtime-WAV** ausführen.
6. finale Szenengrenzen, Caption-Wortzeiten und `finalDurationInFrames` auf diese WAV legen.
7. erst danach `prepare-reel-render.mjs` als finalen Pre-Render-Gate ausführen.

Das Audio-Script erzeugt lokal:

```text
public/runtime-audio/<compositionId>.wav
```

Die Runtime-Datei ist immer **48 kHz Stereo PCM s16le WAV**. Es wird bewusst **kein zweites MP3-Encoding** verwendet. Dadurch entstehen weder zusätzliche verlustbehaftete Artefakte noch MP3-Encoder-Delay, der Wort-/Caption-Timing verschieben könnte.

Komprimierte Eingangsdaten wie MP3 dürfen durch Container-/Encoder-Padding geringfügig eine andere gemeldete Dauer haben. Deshalb ist für **finale Wort- und Frame-Synchronität die dekodierte Runtime-WAV maßgeblich**, nicht die MP3-Containerdauer.

Dieser Ordner ist regenerierbare Runtime-Arbeitsware und bleibt per `.gitignore` außerhalb von Git.

`ki/src/Root.tsx` referenziert nur diese deterministische Runtime-URL. Dadurch gibt es keine kaputten statischen Audio-Imports und keine versteckten Netzwerkdownloads während des Renders.

## Timing-Autorität

Der lokale Audio-Master ist die Inhaltsquelle. Die daraus deterministisch erzeugte **Runtime-PCM-WAV ist die finale Timing- und Render-Autorität**.

Danach zwingend:

- Runtime-WAV-Dauer messen
- Whisper/Wort-Timestamps gegen Runtime-WAV
- `subtitle-cues.json` auf `VOICE_LOCKED...` setzen
- Szenengrenzen und Composition-Dauer auf reale Audio-/Bedeutungsgrenzen schreiben
- `validate-voice-locked-captions.mjs` bestehen
- `prepare-reel-render.mjs` ausführen; dieser Schritt bindet den Render an Git-Commit, Source-Tree, Render-Contract, Caption, Master-Audio und Runtime-WAV

Remote-Generation, Preview-Audio, MP3-Containerdauer oder geschätzte Cue-Zeiten sind niemals finale Timing-Autorität.

## Render-Provenance

`prepare-reel-render.mjs` erzeugt lokal einen `RENDER_LOCKED`-Datensatz für die Composition. Er enthält mindestens:

- Git-Commit des Render-Source-Stands
- Source-Tree-SHA256
- Render-Contract-SHA256
- Caption-JSON-SHA256
- kanonischen Audio-SHA256
- Runtime-WAV-SHA256
- finale Frame-Dauer

`finalize-reel-export.mjs` akzeptiert keinen Render, dessen gelockte Inputs danach in renderrelevanter Weise verändert wurden. Reine Post-Render-Exportmetadaten wie der nach Sichtprüfung gewählte Cover-Zeitpunkt dürfen separat ergänzt werden.

## Git-/Speicherregel

Große Binärmedien (`mp3`, `wav`, `mp4`, `png`) bleiben standardmäßig lokal/Artifact-Storage und sind durch `.gitignore` ausgeschlossen, solange Git LFS nicht ausdrücklich eingerichtet ist.

In Git müssen immer bleiben:

- Skript
- Provenance/`audio-source.json`
- Timing-/Whisper-JSON
- Reel-Contract
- Export-Manifest/Metadaten
- Source-Code und Review-Dokumentation

Keine Regel darf gleichzeitig verlangen, ignorierte Binärdateien normal in Git zu committen.

## Stummes Video verhindern

- aktive Production-Compositions bekommen ihre Audio-URL aus `public/runtime-audio/`
- neue Reel-Komponenten dürfen bei fehlendem/leerem `voiceoverSrc` hart fehlschlagen
- `validate-final-video.mjs` prüft Audio-Stream + Lautstärke
- `finalize-reel-export.mjs` läuft erst nach Voice-Lock-, Motion-, Entertainment-, Provenance- und Audio-Gates

Ein Render ohne hörbares Audio ist **Arbeitsfehler**, kein Preview-Endzustand und niemals ein Final-Export.
