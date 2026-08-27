# Produktionsstatus — ChatGPT + Apple Messages

## Phase 1 — Inhalt / Story
**Status:** IMPLEMENTIERT

Vorhanden:
- offizieller OpenAI-Faktenstand vom 20. August 2026
- finaler Sprechertext
- exaktes `SCENE-VOICE-MAP.json`
- 5 klar unterschiedliche Szenen

## Phase 2 — Pacing / Sync / SFX
**Status:** TIMING VOICE_LOCKED — SFX-VERTRAG VORHANDEN

Aktueller gelockter Stand in `reel.json`:
- 902 Frames bei 30 fps
- pause-komprimierte Runtime-WAV als Timing-Autorität
- finale Szenengrenzen aus Forced Alignment
- Captions `VOICE_LOCKED_SCENE_MAPPED`
- semantische SFX-Events vorhanden

Vor einem neuen Production-Render muss die lokale CC0-SFX-Auflösung/Gate weiterhin zum aktuellen Checkout passen.

## Phase 3 — Visual-Upgrade
**Status:** IMPLEMENTIERT — NEUER RENDER/REVIEW ERFORDERLICH

### 3A Visual Assets
- `visual-assets.json` eingeführt
- Native-First-Policy
- offizielle OpenAI-Source-Proof-Karte in Szene 5
- GitHub/Open-Source-/Direct-Asset-Pfade nur mit dokumentiertem Rechte-Status
- Google-Suchergebnis gilt niemals als Lizenznachweis
- keine Remote-Media-URL im Remotion-Renderpfad

### 3B Zoom / Focus
- `CameraPush`
- `FocusHalo`
- kontrollierte Fokuswechsel innerhalb der Szenen
- leichte Parallax-Bewegung

### 3C Motion Accents
- `ScanSweep` in der Suchszene
- subtile Hintergrundtiefe
- Source-Proof-Card
- Visual-Manifest wird im Pre-Render-Gate validiert und per SHA256 im Render-Lock gebunden

## Nächster Test

Jetzt **kein weiteres Feature hinzufügen**.

Pflicht:
1. lokalen SFX-Plan gegen aktuelle Library auflösen/validieren
2. Visual-Asset-Gate ausführen
3. `prepare-reel-render.mjs`
4. Typecheck/Test/Bundle
5. neues `KI-AppleMessagesChatGPT.mp4` rendern
6. genau dieses MP4 bei 1x prüfen auf:
   - Pacing
   - Caption-Sync
   - SFX-Timing/Lautstärke
   - Zoom-Stärke
   - Fokus-Halos
   - visuelle Überladung
   - Source-Proof-Lesbarkeit
7. erst nach diesem Review entscheiden, welche Step-3-Komponenten global in PR #28 übernommen werden

Das bisherige hochgeladene MP4 ist **Pre-Step-3** und darf nicht als Review für die neuen Visuals gelten.
