# Audio Generation / Provenance

**Status:** REFERENZ-AUDIO AUS DEM HOCHGELADENEN RENDER EXTRAHIERT — NOCH NICHT ALS BINÄRDATEI IM REPO

## Tatsächlich verifiziert

Aus dem vom Nutzer hochgeladenen `KI-ChatGPTForTeens.mp4` wurde die vorhandene deutsche Sprachspur lokal extrahiert.

Gemessen:

- hochgeladener Render: ca. 54.827 s
- extrahierte MP3-Referenz: ca. 54.857 s
- Sprache: Deutsch
- der Sprechertext entspricht dem Teen-Reel
- Audio ist hörbar und technisch vorhanden

Lokale Arbeitsdatei dieser Sitzung:

`/mnt/data/teen_rebuild/voiceover.mp3`

## Nicht behaupten

Nicht mehr behaupten, dass ChatGPT bereits selbst eine kanonische `voiceover.mp3` erzeugt und im Repository gespeichert hat.

Der GitHub-Connector dieser Sitzung kann UTF-8-Dateien ändern, aber die lokale MP3 nicht als normale Binärdatei über den Contents-Write hochladen. Deshalb ist der Zielpfad im Repository derzeit noch nicht physisch vorhanden.

## Zielpfad

`01-script-audio/voiceover.mp3`

Sobald genau diese verifizierte Sprachspur dort liegt:

1. echte Dauer erneut mit `ffprobe` messen
2. `align-voiceover-whisper.mjs` gegen genau diese Datei ausführen
3. `subtitle-cues.json` / Wortframes aktualisieren
4. Szenengrenzen und Visual Trigger an dieselbe Audio-Timeline anpassen
5. `validate-voice-locked-captions.mjs` ausführen
6. erst danach final rendern

Die bisherigen Worttimings sind bis dahin Referenzwerte und keine finale Voice-Lock-Freigabe.
