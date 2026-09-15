---
name: video-asset-prep
description: Safely prepares already-local, provenance-backed short video/B-roll clips for 9:16 Remotion use with FFmpeg while preserving source files and keeping production approval separate.
---

# Video Asset Prep

Use this skill only after a clip is already local and its provenance/rights are known or the user explicitly provided it.

## Purpose

Create a clean local derivative for a concrete reel beat:

- trim to a short useful segment;
- convert to 1080×1920 (or another explicit target);
- normalize to 30 fps by default;
- H.264 + yuv420p + faststart;
- remove audio by default for B-roll;
- strip embedded metadata;
- preserve source + output SHA256;
- keep the result outside production/public until visual review.

## Command

```bash
node scripts/prepare-local-video-asset.mjs <local-video> \
  --provenance=<manifest-or-source-file> \
  --start=0 \
  --duration=6 \
  --width=1080 \
  --height=1920 \
  --fps=30 \
  --fit=cover \
  --audio=remove
```

For a user-supplied clip, `--provenance=USER_PROVIDED` is allowed.

## Hard rules

- No HTTP/remote input.
- Never download media here.
- Never overwrite the source.
- Output only under `out/asset-prep/video/`.
- No production manifest edit.
- Upscaling is refused by default; use a better source first.
- Output duration is capped at 15 seconds because this layer is for short reel moments, not longform transcoding.
- Audio is removed by default; keep it only when the source audio itself is intentionally needed and separately reviewed.
- Result status remains `PREPARED_NOT_PRODUCTION_APPROVED`.
- The exact prepared clip must be watched for crop, timing, looping/ending, quality and relevance before production use.

## When to prefer video

Prefer a real short clip over a static image when motion is itself the evidence or explanation, for example:

- a product UI interaction;
- a model/video generation result;
- a robot/device/action;
- a before/after motion comparison;
- an official demo moment.

Do not add generic B-roll just to make the reel busier.
