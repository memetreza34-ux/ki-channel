---
description: Verify an existing KI-channel reel without changing approved content; use real gates, browser inspection and final evidence.
---

# /verify-ki-reel <reel-package-dir>

1. Read `REPO-STATE.md`, `GEMINI.md`, the reel status and `reel.json`.
2. Load relevant repo skills; always use `remotion-storytelling` for storytelling-enabled reels.
3. Run `npm run antigravity:verify`.
4. Run `npm run ki:reel:structure-check`.
5. Run `node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>` when storytelling is enabled.
6. Run `npm run repo:verify` and `npm run motion:verify`.
7. Verify local audio exists before any production-render claim.
8. Use Chrome DevTools MCP / Antigravity Browser to inspect the local Remotion preview when available:
   - console errors;
   - clipping/overflow;
   - caption safe zone;
   - story progression;
   - static-state duration;
   - transition purpose;
   - real visual relevance.
9. If a mastered MP4 exists, verify its technical gates and review file against the exact SHA256 and duration.
10. Use GitHub MCP when available to compare the local task branch with the open PR/head and ensure the intended commits are actually present remotely.
11. Do not edit approved speaker text or create replacement audio while verifying.
12. Return a strict status table: `PASS`, `FAIL`, or `NOT RUN` for every check. Never infer a PASS from source inspection alone.
