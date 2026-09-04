---
description: Search the free official Pixabay API for a small cached set of B-roll/photo candidates for one specific KI-channel story beat without downloading or changing production source.
---

# /scout-pixabay-assets <query>

Use `.agents/skills/pixabay-asset-scout/SKILL.md`.

1. Read the target reel's `story-beats.json` and identify the exact beat/purpose first.
2. If native Remotion communicates the beat better, do not use stock media.
3. Confirm local `PIXABAY_API_KEY` is available. Never ask to commit it.
4. Run a focused search, normally:

```bash
node scripts/scout-pixabay-assets.mjs "<specific English search query>" --type=video --orientation=portrait --lang=en --top=6
```

5. The scout must reuse its 24-hour cache for identical requests instead of repeatedly querying Pixabay.
6. Inspect the generated JSON under `out/asset-scout/pixabay/`.
7. Recommend at most 1–3 candidates with:
   - Pixabay source URL;
   - creator + creator profile;
   - dimensions/duration;
   - why it supports the exact story beat.
8. Do **not** download anything and do not write any candidate into production manifests in this workflow.
9. Report `DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED` until a separate controlled local-resolution step passes rights/SHA/file validation.

Pixabay is a discovery fallback/alternative, not permission to fill a reel with generic stock footage. The current guideline of normally 1–2 strong external visual moments remains unchanged.
