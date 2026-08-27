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
- 9 semantische SFX-Events vorhanden

## Phase 3 — Visual-Upgrade
**Status:** IMPLEMENTIERT — STEP-3-TEST AUSSTEHEND

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
- Visual-Manifest wird im Production-Pfad validiert und per SHA256 gebunden

## Step-3-Test — ein Befehl

Ab jetzt für diesen Vergleich ausschließlich:

```bash
node ki/scripts/test-apple-messages-step3.mjs
```

Der Test erledigt automatisch:
1. fehlendes generiertes Voiceover lokal herunterladen
2. pause-komprimierte Runtime-WAV reproduzieren
3. committed Forced-Alignment-/Scene-Voice-/Caption-Lock prüfen
4. lokale CC0-SFX-Bibliothek herstellen/validieren
5. alle 9 SFX deterministisch neu auflösen und prüfen
6. Step-3-Visual-/Rechte-Gate prüfen
7. Source-Isolation prüfen
8. TypeScript-Motion-Typecheck
9. Apple-Messages-Contract-Test
10. neues Step-3-MP4 rendern
11. technischen Audio/Video-Gate ausführen
12. Contact-Sheet + `STEP3-TEST-REPORT.json` erzeugen

Ausgabe:

```text
out/step3-apple-messages-test/KI-AppleMessagesChatGPT-step3-test.mp4
out/step3-apple-messages-test/KI-AppleMessagesChatGPT-step3-contact-sheet.jpg
out/step3-apple-messages-test/STEP3-TEST-REPORT.json
```

## Review-Regel

Das Test-MP4 ist **nicht final**. `MOTION-READABILITY-REVIEW.md` wurde bewusst wieder auf `PENDING` gesetzt, weil der alte PASS zum Pre-Step-3-Video gehörte.

Das neue MP4 muss danach bei 1x geprüft werden auf:
- Pacing
- Caption-Sync
- SFX-Timing
- SFX-Lautstärke
- Zoom-Stärke
- Fokus-Halos
- visuelle Überladung
- Source-Proof-Lesbarkeit

Erst nach diesem Review entscheiden wir, welche Step-3-Komponenten global in PR #28 übernommen werden.

## CI-Hinweis

Der vorhandene GitHub-Actions-Workflow ist im Repo selbst aktuell als wegen Actions-Billing/Spending blockiert dokumentiert. Deshalb ist dieser Step-3-Vergleich bewusst als lokaler Ein-Kommando-Test gebaut.
