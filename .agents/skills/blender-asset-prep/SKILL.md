---
name: blender-asset-prep
description: Safely prepares already-local static GLB/GLTF assets with official Blender in headless offline mode for KI-channel Remotion/Three use, without modifying source assets or production manifests.
---

# Blender Asset Prep — KI-Channel

Use this skill only after a 3D asset has already been explicitly selected and downloaded locally through an approved source/provenance path.

## Why this exists

Blender is a free/open-source local preprocessing tool, not a runtime dependency of the final reel. It can reduce unnecessarily heavy static 3D geometry before `@remotion/three` loads the asset.

## Hard safety contract

- No community Blender MCP is required.
- Run official Blender locally in `--background` mode.
- Force `--offline-mode`.
- Force `--disable-autoexec` so embedded startup scripts/drivers are not trusted automatically.
- Source `.glb`/`.gltf` is read-only from this workflow and must never be overwritten.
- Output goes only under `out/asset-prep/blender/`.
- Do not edit `visual-assets.json`, `visual-assets-resolved.json` or Remotion source here.
- Automatically refuse rigs, animation and shape keys. Those require manual reviewed optimization because decimation can damage them.
- Every prepared output receives source/output SHA256 metadata and remains `PREPARED_NOT_PRODUCTION_APPROVED` until visual review.

## Run

```bash
npm run antigravity:blender-prep -- path/to/local-asset.glb --target-faces=80000
```

Optional Blender binary override:

```bash
BLENDER_BIN=/Applications/Blender.app/Contents/MacOS/Blender npm run antigravity:blender-prep -- path/to/local-asset.glb
```

## Selection policy

Prefer native Three primitives when they communicate the story equally well. Use Blender preparation only for a selected local model whose geometry is unnecessarily expensive for a short hero/proof shot.

After preparation:

1. compare source and optimized asset visually;
2. inspect materials/textures and silhouette;
3. render the intended Remotion story beat;
4. only after visual QA may a separate explicit production-resolution step copy/bind the optimized local GLB into the reel asset contract.

Blender availability is optional. If it is not installed, production continues with native Remotion/Three or the already-approved original local asset.
