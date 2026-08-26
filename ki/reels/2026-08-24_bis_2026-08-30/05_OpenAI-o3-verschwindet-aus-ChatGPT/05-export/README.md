# 05 — Final Export

Vor Production-Render:

```bash
node ki/scripts/align-reel-local.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_OpenAI-o3-verschwindet-aus-ChatGPT

node ki/scripts/prepare-reel-render.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_OpenAI-o3-verschwindet-aus-ChatGPT
```

Nach finalem MP4 + echtem 1x-Review:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

Kein Export mit Preview-Timings.
