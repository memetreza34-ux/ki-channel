---
description: Prepare one already-local, provenance-backed image with Sharp into a reviewable 9:16 or other local derivative without touching production manifests.
---

# /prepare-local-image-asset <local-image>

Use `.agents/skills/image-asset-prep/SKILL.md`.

1. Confirm the image is already local and came from an approved/known source path.
2. Identify the provenance reference before transforming it. Use an existing manifest/provenance file where possible; use `USER_PROVIDED` only for an image directly supplied by the user.
3. Do not use this workflow to search or download images.
4. Prefer a sufficiently large source. Do not upscale by default.
5. For a full-frame 9:16 candidate run, for example:

```bash
node scripts/prepare-local-image-asset.mjs \
  <local-image> \
  --provenance=<provenance-file> \
  --width=1080 \
  --height=1920 \
  --fit=cover \
  --position=attention \
  --format=webp \
  --quality=88
```

6. Inspect the generated `out/asset-prep/images/.../manifest.json`.
7. Open and visually compare the prepared image with the source. Check subject framing, faces, text, logos, proof details and accidental crop loss.
8. If `attention` is wrong, create a second candidate with `entropy`, `centre` or an intentional directional position. Do not keep generating variants without a concrete framing reason.
9. Keep status `PREPARED_NOT_PRODUCTION_APPROVED` until the exact candidate passes visual review and the normal production asset/provenance step explicitly binds it.
10. Do not write the derivative directly into Remotion source, `public/`, `visual-assets.json` or `visual-assets-resolved.json` from this workflow.

If the source is too small, report the resolution problem and prefer a better source instead of silently using `--allow-upscale`.
