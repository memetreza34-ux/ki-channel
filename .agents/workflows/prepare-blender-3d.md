---
description: Safely preprocess one already-local static GLB/GLTF with official Blender headlessly and offline before optional Remotion/Three use, without touching the source or production manifests.
---

# /prepare-blender-3d <local-glb-or-gltf>

Use `.agents/skills/blender-asset-prep/SKILL.md`.

1. Confirm the asset is already local and has approved source/license/provenance metadata.
2. Do not use this workflow to fetch models from the internet.
3. Refuse `.blend`, FBX, OBJ or other formats in the automatic path; keep the automated contract limited to GLB/GLTF.
4. Run:

```bash
node scripts/prepare-blender-3d-asset.mjs <local-asset.glb> --target-faces=80000
```

5. Blender must run with `--background`, `--offline-mode` and `--disable-autoexec`.
6. If the asset contains armatures, animation or shape keys, stop and report `MANUAL_3D_OPTIMIZATION_REQUIRED`.
7. Inspect `out/asset-prep/blender/.../manifest.json` and compare the optimized GLB with the source visually.
8. Render a representative Remotion story-beat still/preview using the candidate before production approval.
9. Keep status `PREPARED_NOT_PRODUCTION_APPROVED` until explicit visual QA and the normal local asset/provenance resolver bind it by SHA256.

Never overwrite the source asset and never write directly into the reel's production manifest from this workflow.
