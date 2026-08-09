# Warum mehr Kontext KI schlechter machen kann

Produktions-Reel des KI-Kanals mit klarer 3-Phasen-Übergabe.

## Aktuell

- **Phase 1:** Planung + Remotion-Code-Grundlage vorhanden
- **Phase 2:** jetzt nur Voiceover erzeugen
- **Phase 3:** Codex/Antigravity integriert Audio, prüft, rendert und exportiert

Öffne für deinen nächsten Schritt direkt:

`01-script-audio/voiceover.md`

Der genaue Status steht in:

`06-projektdateien/PHASE-STATUS.md`

## Produktionsstruktur

1. `01-script-audio/` — finaler Sprechertext + dein Voiceover in Phase 2
2. `02-bilder/` — Asset-Manifest; erster Pass ohne externe Bilder
3. `03-caption/` — Subtitle-Cues und spätere Social-Caption
4. `04-pdf/` — optionaler PDF-Bereich
5. `05-export/` — Smoke-Frames und finales MP4 aus Phase 3
6. `06-projektdateien/` — Reel-Manifest, Szenenplan, Animationen, Agent-Auftrag, Phasenstatus und Review

Planungsdateien bleiben ausschließlich hier. Der ausführbare Remotion-Code liegt separat unter:

`ki/src/reels/antigravity-context-overload/`

## Verbindlicher Ablauf

```text
PHASE 1 — ChatGPT
Skript + Planung + Animationen + Captions + Code-Grundlage
        ↓
PHASE 2 — DU
nur Voiceover erzeugen und in 01-script-audio ablegen
        ↓
PHASE 3 — Codex / Antigravity
Audio integrieren + Timing + Tests + Smoke Review + Final Render
```

Der globale Ablauf steht in `ki/gehirn/PRODUKTIONSABLAUF.md`.
