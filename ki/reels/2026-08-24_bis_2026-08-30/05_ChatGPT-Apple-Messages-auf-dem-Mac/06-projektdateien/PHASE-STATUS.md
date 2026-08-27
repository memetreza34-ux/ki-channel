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
**Status:** IMPLEMENTIERT — REVIEW-POLISH EINGEBAUT — RETEST JETZT

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

### 3E Review-Polish nach erstem Step-3-Test
Aus dem ersten echten Step-3-MP4 wurden genau zwei Korrekturen übernommen:
- `FocusHalo` ist jetzt dünner, transparenter, mit kleinerem Scale-Punch und deutlich schwächerem Glow.
- `SourceProofCard` ist etwa 18 % größer, mit größeren Schriften und 620 px Mindestbreite für bessere mobile Lesbarkeit.

Es wurden bewusst keine weiteren neuen Effekte hinzugefügt.

Für dieses Apple-Messages-Reel bleiben die 5 Visuals bewusst Native UI + offizielle Source-Card, weil ein beliebiges Stock-/Fremdbild die Erklärung nicht verbessert. Der neue Resolver ist trotzdem Teil des Testlaufs und ist für kommende Reels bereit.

## JETZT RETESTEN — gleicher Befehl

Ab hier keine weiteren Features hinzufügen, bevor das neue MP4 geprüft wurde:

```bash
node ki/scripts/test-apple-messages-step3.mjs
```

Ausgabe:

```text
out/step3-apple-messages-test/KI-AppleMessagesChatGPT-step3-test.mp4
out/step3-apple-messages-test/KI-AppleMessagesChatGPT-step3-contact-sheet.jpg
out/step3-apple-messages-test/STEP3-TEST-REPORT.json
```

## Review-Regel

`MOTION-READABILITY-REVIEW.md` bleibt bis zum echten neuen Review auf `PENDING`.

Beim zweiten Step-3-Test besonders prüfen:
- Fokus-Halos wirken unterstützend statt wie Editor-Rahmen
- OpenAI-Source-Proof ist auf Smartphone-Größe klar lesbar
- Pacing / Caption-Sync bleiben unverändert gut
- SFX-Timing und Lautstärke bleiben passend
- Zooms bleiben subtil
- keine neue visuelle Überladung

Wenn dieser Retest passt, ist Schritt 3 für diesen Referenzstand abgeschlossen. Danach kommt das erste komplett neue Reel von null als Übertragbarkeitstest.
