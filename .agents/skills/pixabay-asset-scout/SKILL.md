---
name: pixabay-asset-scout
description: Safely discovers free Pixabay video or photo candidates for a specific KI-channel story beat with mandatory 24-hour API caching, without downloading media or modifying production manifests.
---

# Pixabay Asset Scout — KI-Channel

Use this skill only when a concrete story beat genuinely benefits from a real photo or B-roll clip and Pexels/native Remotion is insufficient or a second source improves candidate quality.

## Hard safety boundary

This skill is **discovery only**.

It may:
- search the official Pixabay API;
- cache identical API requests for 24 hours;
- rank portrait-friendly candidates locally;
- retain creator/source/license metadata;
- write candidate JSON under `out/asset-scout/pixabay/`.

It must not:
- mass-query or mass-download Pixabay;
- download a candidate automatically;
- modify `visual-assets.json` or `visual-assets-resolved.json`;
- hotlink Pixabay images/videos in Remotion production source;
- exceed the reel's external-visual budget;
- treat a search result as production-approved.

## Local key

Use `PIXABAY_API_KEY` from `.env.local` or the local environment. Never print or commit the key.

## Search

B-roll discovery:

```bash
node scripts/scout-pixabay-assets.mjs "data center server racks" --type=video --orientation=portrait --lang=en --top=6
```

Still-photo discovery:

```bash
node scripts/scout-pixabay-assets.mjs "AI server hardware" --type=photo --orientation=portrait --lang=en --top=6
```

## Selection policy

1. Search only for a defined `story-beats.json` need.
2. Native Remotion remains preferred when it communicates the point better.
3. Prefer visually specific candidates over generic stock filler.
4. Prefer native vertical media; video orientation is locally ranked because Pixabay's video search has no orientation parameter.
5. Keep `sourceUrl`, creator, creator profile, tags and Pixabay license metadata.
6. Return at most 1–3 recommended candidates to the orchestrator.
7. A later controlled production-resolution step must re-resolve the explicitly selected asset, download it locally, validate file type/size, compute SHA256 and bind rights/provenance before Remotion may use it.

## Provider rules

Pixabay requires API responses to be cached for 24 hours and forbids systematic mass downloads. Permanent image hotlinking is not allowed. The repository scout therefore caches requests and never inserts remote Pixabay URLs into production render source.
