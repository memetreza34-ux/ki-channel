# Produktionsstatus — DALL·E-GPT wird eingestellt

## Phase 1
**Status:** IMPLEMENTIERT

Vorhanden:
- offizieller Faktenstand
- finaler Sprechertext in `VOICEOVER-ZUM-KOPIEREN.txt`
- Satz→Szene-Mapping in `SCENE-VOICE-MAP.json`
- echtes generiertes Voiceover als Provenance
- 5-Szenen-Plan
- Light-First-Motion-Plan
- Plattform-Copy + Final-Caption
- Remotion-Source `ki/src/reels/dalle-gpt-ends/`
- Composition `KI-DalleGptEnds`

### Feste Satz→Szene-Zuordnung
- S01 → scene1
- S02 + S03 → scene2
- S04 → scene3
- S05 + S06 → scene4
- S07 + S08 → scene5

Diese Zuordnung wird nicht mehr aus dem Audio erraten.

## Phase 2 — Audio
**Status:** GENERIERT — LOKALER MASTER ERFORDERLICH

Falls `voiceover.mp3` lokal noch fehlt:

```bash
node ki/scripts/fetch-generated-voiceover.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/01-script-audio/audio-source.json \
  ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt/01-script-audio/voiceover.mp3
```

## Phase 3 — neuer Sync-Standard
**Status:** LOKALES FORCED ALIGNMENT AUSSTEHEND

Die alten 1282-Frame-Timings wurden nach dem Sync-Review ausdrücklich als **Legacy/Preview** zurückgestuft. Sie sind keine Production-Autorität mehr.

Sobald der lokale Audio-Master existiert, nur noch:

```bash
node ki/scripts/align-reel-local.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_DALLE-GPT-wird-eingestellt
```

Der Befehl macht automatisch:
1. exakte Runtime-PCM-WAV erzeugen
2. bekannten Sprechertext lokal auf diese WAV ausrichten
3. `WORD-TIMINGS.json` mit echten Wortzeiten erzeugen
4. Caption-Cues aus diesen Wortzeiten neu bauen
5. Caption-Wörter den bereits festgelegten Sätzen/Szenen zuordnen
6. Szenenstarts aus dem ersten tatsächlich gesprochenen Wort jeder Szene ableiten
7. finale Dauer aus der Runtime-WAV setzen
8. Scene-Voice- und Voice-Lock-Gates ausführen

Backend automatisch:
- Apple Silicon → Qwen3 ForcedAligner via MLX
- sonst → deutscher CTC-Aligner

Beide laufen lokal ohne API-Minutenlimit. Kein fuzzy word matching: Wenn Text/Wortreihenfolge nicht exakt passt, wird abgebrochen statt falsche Timings zu akzeptieren.

Danach:
1. erzeugte `WORD-TIMINGS.json`, `subtitle-cues.json`, `reel.json` und `SCENE-VOICE-MAP.json` prüfen
2. diese gelockten JSON-Dateien committen
3. `prepare-reel-render.mjs`
4. Typecheck/Test/Bundle
5. Render
6. 1x Motion-/Audio-/Caption-Sync-Review
7. Finalizer + Export-Package-Gate

Kein `FINAL VIDEO READY`, bevor diese Schritte tatsächlich bestanden sind.
