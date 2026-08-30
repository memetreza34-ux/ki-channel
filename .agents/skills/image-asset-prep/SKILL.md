---
name: image-asset-prep
description: Safely prepares an already-local, provenance-backed JPEG/PNG/WebP with Sharp for KI-channel use without overwriting the source or modifying production manifests.
---

# Image Asset Prep — KI-Channel

Use this skill only after an image is already local and its source/provenance is known. Discovery belongs to the Wikimedia/Pexels/Pixabay scouts; this skill does not search the web and does not download anything.

## Hard boundary

This is a **prep-only** step.

It may:
- auto-orient an already-local JPEG/PNG/WebP;
- convert to sRGB;
- create a controlled 9:16 or other requested crop/contain variant;
- use Sharp attention/entropy positioning when useful;
- strip EXIF/XMP/IPTC metadata from the prepared derivative;
- write source/output SHA256 and transformation details to a manifest under `out/asset-prep/images/`.

It must not:
- overwrite the source image;
- access remote URLs;
- download stock/proof media;
- change `visual-assets.json` or `visual-assets-resolved.json`;
- write directly to `public/`;
- claim that image transformation changes or grants usage rights;
- mark a prepared crop as production-approved without visual review.

## Provenance requirement

Every run requires:

```text
--provenance=<existing provenance/manifest file>
```

or, only for an image supplied directly by the user:

```text
--provenance=USER_PROVIDED
```

The prep manifest keeps that reference. Removing embedded metadata from the derivative never removes the obligation to preserve external license/creator/source records.

## Default social crop

```bash
node scripts/prepare-local-image-asset.mjs \
  path/to/local-image.jpg \
  --provenance=path/to/provenance.json \
  --width=1080 \
  --height=1920 \
  --fit=cover \
  --position=attention \
  --format=webp \
  --quality=88
```

Upscaling is refused by default. Prefer a higher-resolution source. `--allow-upscale` is a reviewed exception, not a default.

## Crop policy

- `attention`: useful first candidate for people/objects/high-salience content;
- `entropy`: useful for information-dense textures/scenes;
- `centre` or directional positions: use when the intended subject placement is already known;
- `contain`: use where cropping would destroy proof/document context.

Automated crop choice is never a visual PASS. Inspect the actual prepared output at the intended Remotion placement before approval.

## Production handoff

Prepared status remains:

`PREPARED_NOT_PRODUCTION_APPROVED`

Before production use:

1. verify the provenance/rights record still matches the source asset;
2. compare source vs prepared crop visually;
3. check no face/object/text/proof detail was accidentally cut off;
4. render the relevant Remotion beat;
5. bind the chosen local derivative explicitly through the normal asset/provenance contract;
6. keep the prepared SHA256 as the exact binary identity.
