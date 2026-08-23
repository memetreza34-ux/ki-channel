# CODEX ASSEMBLY TASK — KI-ChatGPTForTeens

## Status

**NEUER ISOLIERTER SOURCE + LAYOUT-REVISION IMPLEMENTIERT — AUDIO/RENDER/EXPORT NOCH ZU FINALISIEREN**

Der alte semantisch falsche Render bleibt verworfen. Für den nächsten Lauf gilt ausschließlich der neue Source unter `ki/src/reels/chatgpt-for-teens/`.

## Ziel

Das Teen-Reel mit dem aktuellen Fullscreen-Layout, echtem Voiceover und korrektem Voice-Lock finalisieren. Danach **nicht bei `render complete` stoppen**, sondern automatisch das komplette Publish-Paket in `05-export/` erzeugen.

## Harte Verbote

Nicht wiederverwenden oder sichtbar übernehmen:

- `NOVA`
- `Mach daraus Werbung`
- `PRODUKT`
- `ZIELGRUPPE`
- `STIMMUNG`
- `CREATIVE BRIEF`
- `Produkt bleibt konsistent`
- `KEYFRAME → MOTION`
- `WERBECLIP-CHECK`
- generische `WORKFLOW`-/Werbeclip-Prüfkarten

## Pflichtlektüre

- `ki/skills/entertainment-first-reels/SKILL.md`
- `ki/skills/high-energy-remotion-reels/SKILL.md`
- `ki/skills/voice-locked-captions/SKILL.md`
- `ki/skills/final-video-delivery/SKILL.md`
- `ki/skills/final-export-package/SKILL.md`
- `06-projektdateien/ENTERTAINMENT-REVIEW.md`
- `06-projektdateien/POST-RENDER-DIAGNOSIS.md`

## Aktueller Visual-Stand

- Fullscreen-Hintergrund in jeder Szene
- kein weißer separater Footer
- Header tiefer gesetzt
- Captions tiefer als Overlay gesetzt
- Teen-spezifische Chat-/Account-/Study-/Safety-/Parent-Control-UI
- breite Farbpalette statt nur Lila

## Semantic Visual Gate

Vor jedem Render für **jedes sichtbare Element** fragen:

1. Welche Sprecherphrase erklärt dieses Element?
2. Würde ein Zuschauer ohne Caption verstehen, warum es hier ist?
3. Stammt Text/Mechanik aus genau diesem Teen-Reel?

Nicht zuordenbare Fremdelemente blockieren den Render.

## Verbindliche Finalisierungs-Reihenfolge

1. echte Audio-Datei unter `01-script-audio/voiceover.mp3` verifizieren
2. Audio-Dauer messen
3. Whisper/Voice-Lock gegen genau diese Datei neu erzeugen/validieren
4. Composition-Dauer und Szenen/Visual-Beats an reales Audio binden
5. Source-Isolation-Validator ausführen
6. TypeScript + fokussierte Tests
7. Smoke-Frames an Hook, jedem Hero-Moment und Schluss
8. Contact Sheet erzeugen
9. Contact Sheet auf Layout, Fremdlabels und Hero-Momente prüfen
10. Cover-Hero prüfen; `reel.json.export.coverTimeSeconds` ist aktuell auf `6.0` gesetzt und muss gegen den neuen Layout-Render bestätigt/ggf. angepasst werden
11. Entertainment-Score erneut bewerten; mindestens 8/10, keine 0-Kategorie
12. finalen MP4 **mit eingebettetem hörbarem Voiceover** rendern
13. `node ki/scripts/validate-final-video.mjs <rendered-video.mp4>`
14. bei fehlendem/stummem Audio: **STOP, korrigieren, neu rendern** — niemals final exportieren
15. `03-caption/FINAL-CAPTION.txt` publish-ready prüfen
16. vollständiges Final-Paket automatisch erzeugen:

```bash
node ki/scripts/finalize-reel-export.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein \
  <rendered-video.mp4>
```

17. Export-Paket validieren:

```bash
node ki/scripts/validate-reel-export-package.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein
```

18. **den exportierten** `05-export/KI-ChatGPTForTeens.mp4` vollständig in normaler Geschwindigkeit ansehen und anhören
19. `05-export/KI-ChatGPTForTeens-cover.png` visuell prüfen
20. `05-export/KI-ChatGPTForTeens-caption.txt` prüfen
21. erst danach `FINAL VIDEO READY — EXPORT PACKAGE READY`

## Erwarteter Endzustand

```text
05-export/
├── KI-ChatGPTForTeens.mp4
├── KI-ChatGPTForTeens-cover.png
├── KI-ChatGPTForTeens-caption.txt
└── KI-ChatGPTForTeens-export-manifest.json
```

Ein Preview-, Smoke- oder Final-Render außerhalb dieses Pakets ist keine fertige Abgabe.
