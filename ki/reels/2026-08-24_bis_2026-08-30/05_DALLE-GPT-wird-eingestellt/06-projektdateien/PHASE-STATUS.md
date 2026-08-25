# Produktionsstatus — DALL·E-GPT wird eingestellt

## Phase 1
**Status:** IMPLEMENTIERT

Vorhanden:
- offizieller OpenAI-Faktenstand
- finaler Sprechertext in `VOICEOVER-ZUM-KOPIEREN.txt`
- explizites Satz→Szene-Mapping in `SCENE-VOICE-MAP.json`
- echtes generiertes Voiceover als Remote-Provenance
- Preview-Captions
- 5-Szenen-Plan
- Light-First-Motion-Plan
- Plattform-Copy + Final-Caption
- eigener Remotion-Source `ki/src/reels/dalle-gpt-ends/`
- Composition `KI-DalleGptEnds` in `Root.tsx`
- Source-Isolation
- Motion-/Entertainment-Review-Struktur

### Scene-Voice-Map
Der Agent muss die Szenenzuordnung **nicht mehr aus dem Audio erraten**.

Festgelegt:
- S01 → scene1
- S02 + S03 → scene2
- S04 → scene3
- S05 + S06 → scene4
- S07 + S08 → scene5

Caption-Blöcke dürfen diese Sätze in kleinere Blöcke teilen. Alle Caption-Texte einer Szene zusammen müssen aber exakt ihren gemappten Sprechertext ergeben.

## Phase 2 Audio
**Status:** GENERIERT — LOKALER DOWNLOAD ERFORDERLICH

```bash
node ki/scripts/fetch-generated-voiceover.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/01-script-audio/audio-source.json \
  ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/01-script-audio/voiceover.mp3
```

Danach Runtime-PCM-WAV vorbereiten und Worttimings auf **genau diese Runtime-WAV** locken.

## Phase 3
**Status:** AUSSTEHEND

Pflicht:
1. Runtime-WAV erzeugen
2. Wort-Timestamps / Alignment aus der Runtime-WAV
3. gemappte Sätze anhand ihrer echten Wortzeiten lokalisieren
4. `subtitle-cues.json` auf VOICE_LOCKED setzen
5. `validate-scene-voice-map.mjs` bestehen
6. Szenenstarts an das erste gemappte gesprochene Wort der jeweiligen Szene setzen
7. `reel.json.finalDurationInFrames` + Szenen auf echte Stimme locken
8. `prepare-reel-render.mjs`
9. Typecheck/Test/Bundle
10. Render
11. 1x Motion-/Audio-/Caption-Sync-Review
12. Finalizer + Export-Package-Gate

Kein `FINAL VIDEO READY`, bevor diese Schritte tatsächlich bestanden sind.
