# Produktionsstatus — ChatGPT + Apple Messages

## Phase 1 — Inhalt / Story
**Status:** IMPLEMENTIERT

Vorhanden:
- offizieller OpenAI-Faktenstand vom 20. August 2026
- finaler Sprechertext
- exaktes `SCENE-VOICE-MAP.json`
- 5 klar unterschiedliche Szenen

## Phase 2 — Pacing / Sync / SFX
**Status:** TIMING VOICE_LOCKED — SFX AUFGELÖST

Aktueller gelockter Stand:
- 902 Frames bei 30 fps
- pause-komprimierte Runtime-WAV als Timing-Autorität
- finale Szenengrenzen aus Forced Alignment
- Captions `VOICE_LOCKED_SCENE_MAPPED`
- 9 semantische SFX-Events
- deterministische CC0-SFX-Auflösung

## Phase 3 — Visual-Upgrade
**Status:** IMPLEMENTIERT — JETZT TESTEN

### 3A Visual Assets
- `visual-assets.json`
- Native-First-Policy
- offizielle OpenAI-Source-Proof-Karte
- keine Remote-Media-URL im Remotion-Renderpfad

### 3B Zoom / Focus
- `CameraPush`
- `FocusHalo`
- kontrollierte Fokuswechsel
- leichte Parallax-Bewegung

### 3C Motion Accents
- `ScanSweep`
- subtile Hintergrundtiefe
- Source-Proof-Card

### 3D Automatische externe Visuals
- `visual-asset-sources.json` mit kuratierten Providern
- Wikimedia Commons ohne API-Key mit automatischer Lizenzfilterung
- GitHub Raw nur mit gepinntem 40-Zeichen-Commit + Lizenzquelle
- `resolve-reel-visual-assets.mjs` lädt akzeptierte Bilder vor dem Render lokal
- akzeptierte Remote-Bilder: JPEG, PNG, WebP
- lokale Dateien unter `public/reel-assets/<compositionId>/...`
- `visual-assets-resolved.json` als aufgelöster Visual-Vertrag
- lokale Bilddatei wird im Gate gegen SHA256 geprüft
- CC-BY-4.0 benötigt Attribution
- Google-Bildersuche gilt ausdrücklich nicht als Lizenznachweis
- `ReelExternalVisual.tsx` rendert nur lokale Dateien und bietet Smart-Crop, Fokuspunkt, Zoom und Pan

Für dieses Apple-Messages-Reel bleiben die 5 Visuals bewusst Native UI + offizielle Source-Card, weil ein beliebiges Stock-/Fremdbild die Erklärung nicht verbessert. Der neue Resolver ist trotzdem Teil des Testlaufs und ist für kommende Reels bereit.

## JETZT TESTEN — ein Befehl

Ab hier keine weiteren Features hinzufügen, bevor das neue MP4 geprüft wurde:

```bash
node ki/scripts/test-apple-messages-step3.mjs
```

Der Test erledigt automatisch:
1. Voiceover/Runtime-Audio herstellen
2. Pause-Kompression prüfen
3. Forced-Alignment-/Scene-Voice-/Caption-Lock prüfen
4. CC0-SFX-Bibliothek + 9 SFX prüfen
5. Visuals lokal auflösen
6. Lizenz-/Local-File-/SHA256-Visual-Gate prüfen
7. Source-Isolation prüfen
8. TypeScript-Typecheck
9. Apple-Messages-Contract-Test
10. Step-3-MP4 rendern
11. technischen A/V-Gate ausführen
12. Contact-Sheet + Testbericht erzeugen

Ausgabe:

```text
out/step3-apple-messages-test/KI-AppleMessagesChatGPT-step3-test.mp4
out/step3-apple-messages-test/KI-AppleMessagesChatGPT-step3-contact-sheet.jpg
out/step3-apple-messages-test/STEP3-TEST-REPORT.json
```

## Review-Regel

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten neuen Review auf `PENDING`.

Das neue MP4 bei 1x prüfen auf:
- Pacing / unnötige Pausen
- Caption-Sync
- SFX-Timing und Lautstärke
- Zoom-Stärke
- Fokus-Halos
- visuelle Überladung
- Source-Proof-Lesbarkeit

Erst danach übernehmen wir die bestandenen Step-3-Komponenten global in PR #28 oder korrigieren sie zuerst.

## CI-Hinweis

Der vorhandene GitHub-Actions-Workflow ist im Repo aktuell als wegen Actions-Billing/Spending blockiert dokumentiert. Deshalb ist der Vergleich als lokaler Ein-Kommando-Test gebaut.
