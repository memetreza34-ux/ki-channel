---
description: Audit whether the pinned Remotion/React/Skia/Three/Rive/Lottie stack and official Remotion Agent Skills should be upgraded, without changing dependencies or destabilizing the current production branch.
---

# /audit-remotion-upgrade

This workflow is **read-only**. Do not upgrade the current stabilization branch as part of the audit.

1. Read `REPO-STATE.md`, root `package.json`, `ki/package.json`, `remotion.config.ts` and `ki/src/index.ts`.
2. Confirm the current active branch and whether the canonical test reel has already passed real runtime/render verification.
3. Invoke `ki-dependency-auditor`.
4. Load the synced official Remotion upgrade/docs skills when available.
5. Check current official Remotion release/docs and peer compatibility for:
   - Remotion core/CLI and every `@remotion/*` package;
   - React / React DOM;
   - `@shopify/react-native-skia`;
   - Three / React Three Fiber;
   - Rive;
   - Lottie;
   - Node engine requirements.
6. Compare the repository pin to the latest compatible stack, but distinguish newer from actually beneficial.
7. Identify breaking/API/config changes and the regression surface: TypeScript, Skia initialization, Three/WebGL, Studio, bundle, render, captions, effects and story components.
8. Return one recommendation:
   - `STAY_PINNED`;
   - `UPGRADE_AFTER_PR28`;
   - `UPGRADE_REQUIRED_BEFORE_NEXT_REEL`;
   - `BLOCKED_NEEDS_RUNTIME_DATA`.
9. If an upgrade is recommended, propose a separate branch/worktree and exact test plan. Do not edit package files in this workflow.

Current stabilization/runtime proof has priority over chasing the newest version.
