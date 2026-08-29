---
description: Evaluate and use an already-local Rive .riv asset for a KI-channel story beat without making Rive export a production dependency or allowing remote media.
---

# /use-rive-local-motion <reel-package-dir> <beat-id> <local-riv-path>

Use `.agents/skills/rive-local-motion/SKILL.md`.

1. Read the target reel's `story-beats.json` and confirm the exact narrative purpose.
2. Check whether shared Remotion/Lottie/Shapes can express the beat equally well. Prefer the free native stack if yes.
3. Require an existing local `.riv` file. If it does not exist, stop with `RIVE_LOCAL_ASSET_REQUIRED` and do not make the production pipeline depend on a paid export.
4. Confirm the asset is user-owned/licensed for the intended use. Do not infer rights from a filename or remote page.
5. Never use a hosted/embed/HTTP URL in production.
6. Use `StoryRiveLayer` from `ki/src/reels/StoryMediaLayers.tsx` with a local `staticFile(...)` path only.
7. Render the affected Story Beat and inspect it in Remotion Studio/browser QA.
8. Run type checks and the normal story/visual gates.
9. Keep Rive optional: if runtime/render compatibility fails, fall back to a native Remotion/Lottie/Shapes implementation rather than weakening gates.

Status vocabulary:

- `RIVE_EXPERIMENT_ONLY` — designed in Free Rive, no local export available;
- `RIVE_LOCAL_ASSET_AVAILABLE` — local file exists, rights still must be verified;
- `RIVE_PRODUCTION_CANDIDATE` — local file + rights + render evidence available;
- `RIVE_PRODUCTION_APPROVED` — only after the normal provenance and final visual/release gates pass.
