# Produktionsstatus — Was passiert, wenn du einer KI ein Foto zeigst?

**Produktionsvertrag:** V2.1 + Idea/Learning Gates

## Phase 0 — Idea Gate

**Status:** FERTIG

Fünf Kandidaten verglichen. Altes Embedding-Thema wegen Abstraktionsrisiko verworfen. Neuer Foto-Angle = GO.

## Phase 1 — ChatGPT

**Status:** FERTIG

Creative Brief, Source Ledger, finaler Sprechertext, 15 Visual Beats, Visual Strategy, Motion Choreography, Animation Plan, Captions, Plattform-Copy, Asset-Entscheidung und ausführbarer Remotion-Source vorbereitet.

## Phase 2 — Voiceover

**Status:** VOICEOVER ERZEUGT — LOKALE AUDIODATEI NOCH EINLEGEN

Am 29.09.2026 wurde aus `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` ein vollständiges deutsches Voiceover mit Stil `clear` erzeugt. Der Wortlaut wurde nicht verändert.

Da große Audio-Binaries laut `ki/public/ASSETS.md` lokal/gitignored bleiben, wird die MP3 nicht als GitHub-Binary committed.

Für Phase 3 lokal bereitstellen als:

- bevorzugt: `01-script-audio/voiceover.mp3`
- alternativ: `01-script-audio/voiceover.wav`

Die Datei muss exakt den freigegebenen Sprechertext enthalten. Metadaten der Erzeugung stehen in `01-script-audio/voiceover-generation.json`.

## Phase 3 — Codex / Antigravity

**Status:** BEREIT NACH LOKALEM AUDIO-IMPORT

Sobald `voiceover.mp3` oder `voiceover.wav` lokal vorhanden ist:

1. Audio-Dauer und Wortstarts aus dem echten Voiceover bestimmen.
2. Subtitle-Cues und Motion-Cues auf echte Wortstarts synchronisieren.
3. Hero-Choreography Foto → Raster → echte Tiles → Tokens gegen die Stimme prüfen.
4. Smoke Frames rendern.
5. Finales 1080×1920-MP4 mit Voiceover und Captions rendern.
6. Smartphone-/Feed-Review durchführen.
7. `creative-review.md` nur nach Sichtprüfung auf PASS setzen.

Kein finaler Release nur aufgrund technischer CI-Freigabe.
