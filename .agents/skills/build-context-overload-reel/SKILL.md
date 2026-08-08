---
name: build-context-overload-reel
description: Builds and verifies the first Antigravity production reel "Warum mehr Kontext eine KI schlechter machen kann" from the approved five-scene package.
---

# Build Context Overload Reel

Use this skill when the user asks Antigravity to build, render, test, finish, or continue the first production reel.

## Package

`ki/src/reels/antigravity-context-overload/`

Read the nested `AGENTS.md` and `CODEX_ASSEMBLY_TASK.md` before editing.

## Required order

1. Confirm branch is not `main` and inspect `git status --short`.
2. Run `node scripts/run-antigravity-content-test.mjs`.
3. Run `node scripts/check-antigravity-context-overload-reel.mjs`.
4. Implement one 1080x1920, 30 FPS, 900-frame Remotion composition from the package.
5. Use exactly the five animation IDs in `reel.json` and the canonical spokenText-grounding pipeline.
6. Add focused package/composition tests.
7. Run focused tests and TypeScript checking.
8. Render 15 smoke frames: start, midpoint, end for each scene.
9. Inspect all 15 frames visually; fix real layout/motion issues.
10. Render the full MP4 and run technical validation.
11. Watch the MP4 at normal speed and phone-size scale.
12. Update `review-checklist.md` only for checks actually completed.

## Fixed content

Do not casually rewrite the approved voiceover or reorder scenes. Do not inject demo values. No external images, music, or SFX are required for the first pass.

The five mechanisms are:

1. context window overload
2. relationship weighting
3. relevant-source retrieval
4. information filtering/compression
5. answer generation

## Failure handling

If a command fails, stop at the first real failure, classify it as environment or source, fix the source cause when appropriate, rerun the narrow command, then rerun the full required sequence. Never weaken assertions just to get green.

Do not merge PR #3 or modify `main`.
