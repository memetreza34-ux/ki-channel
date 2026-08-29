---
description: Search Poly Haven's free CC0 public API for a small set of 3D model, HDRI or texture candidates for one concrete KI-channel story beat without downloading or changing production source.
---

# /scout-polyhaven-3d <query>

Use `.agents/skills/polyhaven-3d-asset-scout/SKILL.md`.

1. Read the target reel's `story-beats.json` and identify the exact visual job first.
2. Decide whether native Remotion/Three can express the idea equally well. If yes, prefer native motion.
3. Search the official Poly Haven API, normally:

```bash
node scripts/scout-polyhaven-assets.mjs "<specific English query>" --type=model --top=6
```

4. For atmosphere/background use `--type=hdri`; for surfaces use `--type=texture`.
5. Inspect the JSON under `out/asset-scout/polyhaven/`.
6. Recommend at most 1–3 candidates with:
   - asset id/name;
   - Poly Haven source URL;
   - authors;
   - model complexity/resolution when available;
   - why the asset improves that exact story beat.
7. Do **not** download anything in this workflow.
8. Do not write remote Poly Haven URLs into Remotion source.
9. Report `DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED` until a separate local resolver performs file selection, download, integrity checks, SHA256 and visual QA.

Poly Haven is optional/best-effort. API downtime must never block normal native Remotion production.
