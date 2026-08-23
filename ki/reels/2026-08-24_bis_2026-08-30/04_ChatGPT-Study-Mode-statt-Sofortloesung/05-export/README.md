# 05 — Export

Finales Paket muss enthalten:

- `KI-ChatGPTStudyMode.mp4`
- `KI-ChatGPTStudyMode-cover.png`
- `KI-ChatGPTStudyMode-caption.txt`
- `KI-ChatGPTStudyMode-export-manifest.json`

Finalisierung:

```bash
node ki/scripts/finalize-reel-export.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung \
  <rendered-video.mp4>

node ki/scripts/validate-reel-export-package.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/04_ChatGPT-Study-Mode-statt-Sofortloesung
```

Der Finalizer darf nur nach bestandenem Audio-Gate laufen. Ein stummes MP4 erzeugt kein finales Export-Paket.
