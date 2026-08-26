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
- automatischer Remotion-SFX-Track

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

Erst danach läuft Forced Alignment auf genau dieser verdichteten Runtime-WAV. Dadurch kommen `WORD-TIMINGS.json`, Untertitel, Szenengrenzen und Composition-Dauer alle aus derselben schnelleren Tonspur.

## Phase 2b — SFX
**Status:** AUTOMATIK IMPLEMENTIERT — LOKALE AUFLÖSUNG NACH VOICE-/SCENE-LOCK

Vorhanden:
- ~410 allowlistete Kenney-Sounds aus 5 CC0-Packs
- `sfx-events.json` mit visuellen Event-Ankern
- `resolve-reel-sfx.mjs` für deterministische Auswahl
- `validate-reel-sfx-plan.mjs` für Lizenz/Timing/Volume
- `sfx-resolved.json` als fail-closed Rendervertrag
- `ReelSfxTrack.tsx` für die Remotion-Audiospur

Der bestehende `align-reel-local.mjs` löst die Sounds **automatisch nach dem neuen Szenen-Timing** auf. Dadurch bleiben Stempel, Klicks, API-Haken usw. auch nach Pause-Kompression exakt an ihren visuellen Frames.

Es werden ausschließlich `CC0-1.0`-Sounds automatisch zugelassen. Die Voiceover-Spur hat Priorität; SFX sind je nach Rolle hart auf max. 0.10–0.20 begrenzt.

## Phase 3 — Render
**Status:** BLOCKIERT BIS NEUES PACING + FORCED ALIGNMENT + SFX-AUFLÖSUNG BESTANDEN

Pflicht danach:
1. Pause-Kompression + Runtime-WAV erzeugen
2. lokales Forced Alignment neu ausführen
3. neue `WORD-TIMINGS.json` + Caption-Cues + Szenengrenzen erzeugen
4. SFX automatisch aus der lokalen CC0-Bibliothek auswählen und auf finale Szenenframes legen
5. Alignment-/Scene-Voice-/Voice-Lock-/SFX-Gates bestehen
6. gelockte JSON-Dateien committen
7. `prepare-reel-render.mjs`
8. Typecheck/Test/Bundle
9. Render
10. 1x Motion-/Audio-/Caption-/SFX-Review
11. Finalizer + Export-Package-Gate

Kein `FINAL VIDEO READY`, bevor der neue Render tatsächlich mit pause-komprimierter Runtime-WAV und dem aufgelösten CC0-SFX-Plan erstellt und geprüft wurde.
