---
description: Find a small set of license-screened Wikimedia Commons candidates for one real documentary/proof beat without downloading or modifying production manifests.
---

# /scout-wikimedia-proof-visuals <query>

Use `.agents/skills/wikimedia-proof-visual-scout/SKILL.md`.

1. Read the target reel's `story-beats.json` and identify the exact proof/documentary purpose first.
2. If an official company/product source card proves the spoken claim better, use that instead.
3. Run a focused Commons search, normally:

```bash
node scripts/scout-wikimedia-commons-assets.mjs "<specific English query>" --orientation=auto --top=6
```

4. Inspect `out/asset-scout/wikimedia-commons/*.json`.
5. Recommend at most 1–3 candidates with:
   - exact Commons file title/page;
   - dimensions;
   - author/credit;
   - rights status and license URL;
   - required attribution;
   - why it supports the exact story beat.
6. Prefer `CC0-1.0` or `PUBLIC_DOMAIN`; use `CC-BY-4.0` only with complete attribution metadata.
7. Explicitly flag people/trademark/privacy/personality-rights issues for manual review where relevant.
8. Do **not** download anything and do not modify `visual-assets.json` in this workflow.
9. Keep status `DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED`.
10. After explicit selection, make the production query specific to the chosen file/title and let the existing `ki/scripts/resolve-reel-visual-assets.mjs` perform the normal license-filtered local download + SHA256 lock.

Never use a Commons preview/original URL directly in Remotion.
