---
description: Prepare an already-local, provenance-backed short video clip for a concrete 9:16 reel beat without downloading media or modifying production manifests.
---

# /prepare-local-video-asset <local-video>

Use only after the clip is already local and its provenance is documented.

## Steps

1. Confirm the target beat and why a real video is better than native motion or a still.
2. Confirm provenance/rights or use `USER_PROVIDED` only for a clip the user supplied.
3. Choose the smallest useful segment, normally 2–8 seconds.
4. Run:

```bash
node scripts/prepare-local-video-asset.mjs <local-video> \
  --provenance=<manifest-or-source-file> \
  --start=<seconds> \
  --duration=<seconds> \
  --width=1080 \
  --height=1920 \
  --fps=30 \
  --fit=cover \
  --audio=remove
```

5. Inspect the exact prepared MP4 at 1x:
   - crop/focus;
   - quality;
   - start/end timing;
   - whether the important action is visible;
   - whether it competes with captions;
   - whether it actually strengthens the claim.
6. Keep status `PREPARED_NOT_PRODUCTION_APPROVED` until the reel's normal local visual/provenance path explicitly adopts the clip.

## Do not

- do not pass a URL;
- do not use this workflow as a downloader;
- do not upscale weak footage by default;
- do not keep source audio unless it is intentional;
- do not copy the derivative directly into `public/` before the normal production approval/provenance step;
- do not modify `visual-assets.json` automatically.
