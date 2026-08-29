---
name: polyhaven-3d-asset-scout
description: Safely discovers free CC0 Poly Haven 3D models, HDRIs or textures for a specific KI-channel story beat without downloading assets or changing Remotion production source.
---

# Poly Haven 3D Asset Scout — KI-Channel

Use this skill only when a specific story beat genuinely benefits from a real 3D model, HDRI or texture. Native Remotion/Three primitives remain the default.

## Hard boundary

This skill is discovery-only.

It may:
- query the official Poly Haven public API;
- search models, HDRIs and textures;
- rank candidates by semantic relevance and practical complexity;
- keep Poly Haven asset id, authors, source URL and CC0 metadata;
- write candidate JSON below `out/asset-scout/polyhaven/`.

It must not:
- download any asset automatically;
- add remote model/HDRI/texture URLs to Remotion;
- modify production manifests;
- make Poly Haven API availability a release dependency;
- claim a candidate is production-approved.

## Search

For a 3D model:

```bash
npm run antigravity:polyhaven -- "server rack" --type=model --top=6
```

For an HDRI:

```bash
npm run antigravity:polyhaven -- "dark studio industrial" --type=hdri --top=6
```

For a texture:

```bash
npm run antigravity:polyhaven -- "brushed metal" --type=texture --top=6
```

## Selection policy

1. Start from a concrete `story-beats.json` need.
2. Prefer a simple native Three/Remotion construction if it communicates the idea equally well.
3. Use a Poly Haven asset only when it materially improves depth, realism, atmosphere or proof.
4. Prefer practical model complexity; very heavy models must be justified.
5. Keep `id`, `sourceUrl`, authors and CC0 license metadata.
6. Return at most 1–3 finalists.
7. A later controlled resolver must explicitly select the asset, fetch its file manifest, choose a compatible local format/resolution, download locally, verify the provider hash where available, compute SHA256, and only then expose it to Remotion.

Poly Haven API is optional/best-effort. If unavailable, continue with native Remotion/Three or other already-approved local assets.
