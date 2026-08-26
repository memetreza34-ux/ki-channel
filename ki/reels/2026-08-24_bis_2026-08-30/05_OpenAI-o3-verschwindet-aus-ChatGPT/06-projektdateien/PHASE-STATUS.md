# Produktionsstatus — OpenAI o3 verschwindet heute aus ChatGPT

## Phase 1 — Inhalt + Source
**Status:** IMPLEMENTIERT

Vorhanden:
- offizieller OpenAI-Faktenstand
- finaler Sprechertext
- `SCENE-VOICE-MAP.json`
- echtes generiertes Voiceover als Remote-Provenance
- eigener Remotion-Source + Composition
- Plattform-Copy
- Motion-/Entertainment-Review-Struktur

## Phase 2 — Audio/Pacing
**Status:** PAUSE-COMPRESSION AKTIV — REALIGNMENT ERFORDERLICH

Die bisherige ~39,5-s-Timeline ist **nicht mehr final**, weil das neue Pacing längere Leerlaufstellen vor dem Timing-Lock entfernt.

Kanonische Reihenfolge:

```bash
node ki/scripts/align-reel-local.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_OpenAI-o3-verschwindet-aus-ChatGPT
```

`prepare-reel-audio.mjs` komprimiert dabei automatisch längere Stille:

- Erkennung ab ca. 150 ms
- Restpause ca. 50 ms
- Start-Leadin ca. 30 ms
- harter Safety-Abbruch, falls >25 % der Gesamtdauer entfernt würden
- Runtime-WAV wird anschließend auf unerwartet lange Silence-Gaps geprüft

**Wichtig:** Erst danach läuft Forced Alignment auf genau dieser verdichteten Runtime-WAV. Dadurch kommen `WORD-TIMINGS.json`, Untertitel, Szenengrenzen und Composition-Dauer alle aus derselben schnelleren Tonspur.

## Phase 3 — Render
**Status:** BLOCKIERT BIS NEUES PACING + FORCED ALIGNMENT BESTANDEN

Pflicht danach:
1. Pause-Kompression + Runtime-WAV erzeugen
2. lokales Forced Alignment neu ausführen
3. neue `WORD-TIMINGS.json` + Caption-Cues + Szenengrenzen erzeugen
4. Alignment-/Scene-Voice-/Voice-Lock-Gates bestehen
5. gelockte JSON-Dateien committen
6. `prepare-reel-render.mjs`
7. Typecheck/Test/Bundle
8. Render
9. 1x Motion-/Audio-/Caption-Sync-Review
10. Finalizer + Export-Package-Gate

Kein `FINAL VIDEO READY`, bevor der neue Render tatsächlich mit der pause-komprimierten Runtime-WAV erstellt und geprüft wurde.
