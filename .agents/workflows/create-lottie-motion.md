---
description: Safely create one focused reusable Lottie motion asset for a defined KI-channel story beat through the optional Lottie Creator MCP, then return to the normal local Remotion review path.
---

# /create-lottie-motion <reel-package-dir> <beat-id>

Use `.agents/skills/lottie-creator-motion/SKILL.md`.

1. Read the target reel's `story-beats.json`, visual plan and Remotion source.
2. Confirm this beat genuinely benefits from Lottie instead of shared/native Remotion.
3. In Antigravity MCP settings, enable `lottiefiles-creator` only for this authoring session.
4. Open Lottie Creator in the browser and enable Creator MCP there.
5. Create or edit exactly the small motion asset needed for the specified beat.
6. Inspect layers, keyframes, easing, scene size, hidden layers and loop behavior before export.
7. Export a local `.json` or `.lottie` file. Do not use a remote CDN URL.
8. Place the exported file under the target reel's `02-bilder/lottie/` (or another explicitly documented local reel asset path).
9. Do **not** automatically wire the asset into production source. First run the local compatibility/render review with the pinned Remotion/Lottie stack.
10. Once the local render is verified, the single story writer may reference the local asset from Remotion.
11. Disable `lottiefiles-creator` again when the authoring task is finished.

Report one of:

- `LOTTIE_AUTHORED_LOCAL_REVIEW_REQUIRED`
- `NATIVE_REMOTION_PREFERRED`
- `LOTTIE_CREATOR_UNAVAILABLE`

Never call a Creator/MCP failure a reel-production blocker; this capability is optional.
