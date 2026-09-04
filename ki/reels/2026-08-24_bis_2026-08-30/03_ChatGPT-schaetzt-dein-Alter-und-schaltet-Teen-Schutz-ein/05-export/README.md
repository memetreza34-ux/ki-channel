# 05 — Final Export

Dieser Ordner ist der **kanonische Endpunkt** des Teen-Reels. Ein MP4 außerhalb dieses Ordners ist nur Arbeitsware/Preview.

## Pflichtpaket

Nach erfolgreicher Finalisierung müssen hier liegen:

```text
KI-ChatGPTForTeens.mp4
KI-ChatGPTForTeens-cover.png
KI-ChatGPTForTeens-caption.txt
KI-ChatGPTForTeens-export-manifest.json
```

## Harte Reihenfolge

1. aktuellen finalen MP4 mit eingebettetem Voiceover rendern
2. `node ki/scripts/validate-final-video.mjs <rendered-video.mp4>`
3. wenn Audio fehlt/stumm ist: **STOP — kein finaler Export**
4. Hero-/Cover-Frame prüfen; aktuell ist `reel.json.export.coverTimeSeconds = 6.0` als Szene-1-Hero gesetzt und nach dem neuen Layout-Render erneut visuell zu bestätigen
5. `03-caption/FINAL-CAPTION.txt` prüfen
6. Paket automatisch erzeugen:

```bash
node ki/scripts/finalize-reel-export.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein \
  <rendered-video.mp4>
```

7. Paket validieren:

```bash
node ki/scripts/validate-reel-export-package.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/03_ChatGPT-schaetzt-dein-Alter-und-schaltet-Teen-Schutz-ein
```

8. **den exportierten** `KI-ChatGPTForTeens.mp4` vollständig ansehen und anhören
9. Cover + Caption prüfen
10. erst dann `FINAL VIDEO READY — EXPORT PACKAGE READY`

Ein stummer, teilgerenderter oder außerhalb von `05-export/` liegender Clip ist keine finale Abgabe.
