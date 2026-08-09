---
name: build-context-overload-reel
description: Builds and verifies the first Antigravity production reel "Warum mehr Kontext eine KI schlechter machen kann" from the approved five-scene package.
---

# Build Context Overload Reel

Use this skill when the user asks Antigravity to build, render, test, finish, or continue the first production reel.

## Planning package

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

The planning package must remain there permanently. Read:

- `README.md`
- `01-script-audio/voiceover.md`
- `02-bilder/asset-manifest.json`
- `03-caption/subtitle-cues.json`
- `06-projektdateien/AGENTS.md`
- `06-projektdateien/reel.json`
- `06-projektdateien/scene-plan.md`
- `06-projektdateien/animation-plan.md`
- `06-projektdateien/CODEX_ASSEMBLY_TASK.md`
- `06-projektdateien/review-checklist.md`

Executable implementation, once allowed, is separate:

`ki/src/reels/antigravity-context-overload/`

Never move planning files into the executable source folder.

## Required order

1. Confirm branch is not `main` and inspect `git status --short`.
2. Run `node scripts/check-ki-reel-folder-structure.mjs`.
3. Run `node scripts/run-antigravity-content-test.mjs`.
4. Run `node scripts/check-antigravity-context-overload-reel.mjs`.
5. Only if all preflight checks pass, create/update executable code under `ki/src/reels/antigravity-context-overload/`.
6. Implement one 1080x1920, 30 FPS, 900-frame Remotion composition from the approved package.
7. Use exactly the five animation IDs in `06-projektdateien/reel.json` and the canonical spokenText-grounding pipeline.
8. Add focused package/composition tests.
9. Run `node scripts/check-ki-reel-folder-structure.mjs` again, then focused tests and TypeScript checking.
10. Render 15 smoke frames: start, midpoint and end for each scene.
11. Inspect all 15 frames visually and fix real layout/motion issues.
12. Render the full MP4 and run technical validation.
13. Watch the MP4 at normal speed and phone-size scale.
14. Update `06-projektdateien/review-checklist.md` only for checks actually completed.
15. Run the structure validator once more before reporting completion.

## Fixed content

Do not casually rewrite the approved voiceover or reorder scenes. Do not inject demo values. No external images, music or SFX are required for the first pass.

The five mechanisms are:

1. context window overload
2. relationship weighting
3. relevant-source retrieval
4. information filtering/compression
5. answer generation

## Structure safety

Never create a reel folder directly under `ki/`. Never flatten a weekly reel into `ki/reels/<slug>`. Never delete or rename `01-script-audio` through `06-projektdateien`. New reels are created only with `node scripts/new-ki-reel.mjs "Titel"`.

## Failure handling

If a command fails, stop at the first real failure, classify it as environment or source, fix the source cause when appropriate, rerun the narrow command, then rerun the required sequence. Never weaken assertions or structure rules just to get green.

Do not merge PR #3 or modify `main`.
