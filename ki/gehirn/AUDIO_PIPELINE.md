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

Nach einer Tool-Erzeugung:

1. Audio tatsächlich herunterladen.
2. am kanonischen `reel.json -> audio.targetFile` ablegen.
3. lokal mit `ffprobe` prüfen.
4. Whisper/Voice-Lock gegen **genau diese Datei** ausführen.
5. vor Render:

```bash
node ki/scripts/prepare-reel-audio.mjs <reel-package-dir>
```

Das Script erzeugt lokal:

```text
public/runtime-audio/<compositionId>.mp3
```

Dieser Ordner ist regenerierbare Runtime-Arbeitsware und bleibt per `.gitignore` außerhalb von Git.

`ki/src/Root.tsx` referenziert nur diese deterministische Runtime-URL. Dadurch gibt es keine kaputten statischen Audio-Imports und keine versteckten Netzwerkdownloads während des Renders.

## Timing-Autorität

Erst die **lokal vorhandene kanonische Audiodatei** ist Timing-Autorität.

Danach zwingend:

- echte Dauer messen
- Whisper/Wort-Timestamps
- `subtitle-cues.json` auf `VOICE_LOCKED...` setzen
- Szenengrenzen und Composition-Dauer auf reale Audio-/Bedeutungsgrenzen schreiben
- `validate-voice-locked-captions.mjs` bestehen

Remote-Generation, Preview-Audio oder geschätzte Cue-Zeiten sind niemals finale Timing-Autorität.

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
- `finalize-reel-export.mjs` läuft erst nach Voice-Lock-, Motion-, Entertainment- und Audio-Gates

Ein Render ohne hörbares Audio ist **Arbeitsfehler**, kein Preview-Endzustand und niemals ein Final-Export.
