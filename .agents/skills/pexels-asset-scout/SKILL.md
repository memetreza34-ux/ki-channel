---
name: pexels-asset-scout
description: Safely discovers free Pexels portrait B-roll or photos for a specific KI-channel story beat without downloading media, modifying production manifests or introducing render-time remote assets.
---

# Pexels Asset Scout — KI-Channel

Use this skill only when a concrete story beat genuinely benefits from a real photo or B-roll clip. Native Remotion remains the base layer.

## Hard safety boundary

This skill is **discovery only**.

It may:
- search the official Pexels API;
- rank portrait-friendly candidates;
- retain creator/source/license metadata;
- write candidate JSON under `out/asset-scout/pexels/`.

It must not:
- download a candidate automatically;
- modify `visual-assets.json` or `visual-assets-resolved.json`;
- insert remote Pexels URLs into Remotion production source;
- exceed the reel's external-visual budget;
- treat a search result as production-approved.

## Local key

Use `PEXELS_API_KEY` from `.env.local` or the local environment. Never print or commit the key.

## Search

Prefer video for B-roll:

```bash
node scripts/scout-pexels-assets.mjs "data center server racks" --type=video --orientation=portrait --size=medium --locale=de-DE --top=6
```

For still photos:

```bash
node scripts/scout-pexels-assets.mjs "AI server hardware" --type=photo --orientation=portrait --locale=de-DE --top=6
```

## Selection policy

1. Search only for a defined `story-beats.json` need.
2. Prefer a visually specific candidate over generic stock filler.
3. Prefer portrait/native vertical footage when possible.
4. Keep `sourceUrl`, creator, creator URL and Pexels license metadata.
5. Return at most 1–3 recommended candidates to the orchestrator.
6. A later production-resolution step must download the explicitly selected candidate locally, validate file type/size, compute SHA256 and bind rights/provenance before Remotion may use it.

The existing local-only render policy remains authoritative.
