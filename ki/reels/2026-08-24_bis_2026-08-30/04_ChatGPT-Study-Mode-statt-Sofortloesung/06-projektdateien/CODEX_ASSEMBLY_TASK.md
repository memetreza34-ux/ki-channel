# CODEX / ANTIGRAVITY ASSEMBLY TASK — KI-ChatGPTStudyMode

## Ziel
Dieses Reel vollständig bis zum echten Export-Paket fertigstellen. Nicht nach Preview, Smoke oder stummem Render stoppen.

## 1. Audio zuerst lokal verfügbar machen

```bash
REEL='ki/reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung'
node ki/scripts/fetch-generated-voiceover.mjs \
  "$REEL/01-script-audio/audio-source.json" \
  "$REEL/01-script-audio/voiceover.mp3"
ffprobe -v error -show_streams -show_format "$REEL/01-script-audio/voiceover.mp3"
```

Wenn Download oder Audio-Prüfung fehlschlägt: STOP. Kein stummer Render.

## 2. Voice-Lock
- `voiceover.mp3` ist ab jetzt Zeit-Autorität.
- Whisper gegen genau diese Datei ausführen.
- `subtitle-cues.json` mit echten Wortframes aktualisieren.
- keine proportionale Wortverteilung als final.
- natürliche Pausen dürfen kein falsches aktives Wort zeigen.
- Szenengrenzen und Composition-Dauer an die tatsächliche Audiodauer anpassen.

Danach:
```bash
node ki/scripts/validate-voice-locked-captions.mjs "$REEL"
```

## 3. Source
Composition: `KI-ChatGPTStudyMode`
Source: `ki/src/reels/chatgpt-study-mode/`

Verbindlicher Stil:
- Product/UI-first
- Fullscreen-Hintergrund pro Szene
- kein separater weißer Footer
- Header ca. top 112
- Captions ca. bottom 250
- Captions max. 2 Zeilen, als transparente Glass-/Blur-Overlay-Fläche
- große UI statt kleiner Card-Insel
- jede Szene Setup → Aktion → Konsequenz → Payoff
- 0.6–1.5 s semantische Micro-Beats anstreben
- keine alte NOVA-/Werbeclip-/Creative-Brief-UI wiederverwenden

## 4. Semantic Visual Audit
Jedes sichtbare Label/Objekt muss zu einer konkreten Sprecherphrase passen. Off-topic Reuse = Fail.

## 5. Tests + Preview
- TypeScript / fokussierte Tests
- Composition auflösen
- Hook + fünf Hero-Frames rendern
- Contact Sheet prüfen
- Layout prüfen: Header nicht zu hoch, Caption nicht zu hoch, Hintergrund durchgehend, keine 2-Hintergrund-Trennung
- Entertainment Post-Render mindestens 8/10

## 6. Final render
Final nur mit eingebundenem `voiceover.mp3`.

Nach Render zwingend:
```bash
node ki/scripts/validate-final-video.mjs <final-video.mp4>
```

Finales MP4 vollständig ansehen UND anhören. Caption/Voice/Visual-Beat synchron prüfen.

## 7. Automatischer Export
```bash
node ki/scripts/finalize-reel-export.mjs "$REEL" <final-video.mp4>
node ki/scripts/validate-reel-export-package.mjs "$REEL"
```

`05-export/` muss danach MP4 + Cover + Caption + Manifest enthalten.

## Stop-Regel
Erst bei vollständig bestandenem Paket den Status setzen:
`FINAL VIDEO READY — EXPORT PACKAGE READY`

Vorher nicht aufhören und dem Nutzer kein stummes/unfertiges Video als final zeigen.
