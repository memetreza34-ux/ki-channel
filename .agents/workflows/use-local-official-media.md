# /use-local-official-media <reel-package-dir>

Use this workflow when an exact official logo, wordmark, product UI screenshot or official product image is already available locally under the reel's `02-bilder/` folder.

## Steps

1. Read the reel's `BRAND-MOTION-PLAN.json`, `LEVEL-UP-PLAN.json` and `visual-assets.json`.
2. Confirm the asset is genuinely local under `02-bilder/`; do not fetch/download it in this workflow.
3. Confirm an official HTTPS provenance URL is known.
4. Add/update a `LOCAL_OFFICIAL_MEDIA` entry in `visual-assets.json` with:
   - `sourceFile`
   - `sourceUrl`
   - `sourceKind`
   - `assetRole`
   - `rightsStatus: OFFICIAL_SOURCE_REFERENCE`
   - meaningful `usageReviewNote`
5. Run:

```bash
node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>
node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>
```

6. Use only the resolved local `staticFile` path in Remotion.
7. Render/inspect the actual scene and verify the logo/UI is recognizable, correctly colored, not stretched, not covered by captions and not competing with too many details.
8. Keep manual brand/trademark/rights review explicit; provenance is not blanket legal permission.

## Never

- never invent/trace an approximate logo;
- never use a generic functional icon as the brand;
- never hotlink the official image at render time;
- never auto-download a press-kit asset through `LOCAL_OFFICIAL_MEDIA`;
- never mark visual PASS from the manifest alone.
