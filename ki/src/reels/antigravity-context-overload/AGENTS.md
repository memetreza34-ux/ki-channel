# Antigravity Context Overload reel instructions

This directory is an approved reel package for the first Antigravity production reel.

## Authority order

1. repository root `AGENTS.md`
2. repository root `GEMINI.md`
3. this file
4. `reel.json`
5. `voiceover.md`
6. `scene-plan.md`
7. `animation-plan.md`
8. `subtitle-cues.json`
9. `asset-manifest.json`
10. `CODEX_ASSEMBLY_TASK.md`
11. `review-checklist.md`

## Fixed creative decisions

- Topic: why too much context can make an AI answer worse.
- Five scenes, 180 frames each, total 900 frames.
- German voiceover text and scene order are approved and must not be rewritten casually.
- Use exactly the five animation IDs in `reel.json` for the first implementation.
- No external images, music, or SFX in the first pass.
- Do not introduce exact numeric claims that are not spoken.

## Implementation priority

Make the meaning visible. Do not replace the selected content-aware mechanisms with generic cards, decorative particles, or camera movement.

Every scene must show:

1. a readable start state
2. one dominant semantic change
3. a readable result state

Keep subtitles in a separate safe zone and preserve phone-size readability.

## Required first command

Before editing source code, run:

`node scripts/run-antigravity-content-test.mjs`

If that fails, diagnose the grounding system before building this reel.

Do not merge PR #3 or modify `main`.
