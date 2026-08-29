---
description: Search the free official Pexels API for a small set of portrait B-roll/photo candidates for one specific KI-channel story beat without downloading or changing production source.
---

# /scout-pexels-assets <query>

Use `.agents/skills/pexels-asset-scout/SKILL.md`.

1. Read the target reel's `story-beats.json` and identify the exact beat/purpose first.
2. If a native Remotion visual explains the claim better, do not use stock media.
3. Confirm local `PEXELS_API_KEY` is available. Never ask to commit it.
4. Run a focused search, normally:

```bash
npm run antigravity:pexels -- "<specific English search query>" --type=video --orientation=portrait --size=medium --locale=de-DE --top=6
```

5. Inspect the generated JSON under `out/asset-scout/pexels/`.
6. Recommend at most 1–3 candidates with:
   - Pexels source URL;
   - creator;
   - dimensions/duration;
   - why it supports the exact story beat.
7. Do **not** download anything and do not write any candidate into production manifests in this workflow.
8. Report `DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED` until a separate controlled local-resolution step exists and passes rights/SHA/file validation.

The current reel limit of normally 1–2 strong external visual moments remains unchanged.
