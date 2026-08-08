# Antigravity Assembly Task — Context Overload Reel

Build the first real five-scene production reel from this package.

## Read first

1. Repository root `AGENTS.md`
2. Repository root `GEMINI.md`
3. This reel package's `AGENTS.md`
4. `reel.json`
5. `voiceover.md`
6. `scene-plan.md`
7. `animation-plan.md`
8. `subtitle-cues.json`
9. `asset-manifest.json`
10. `review-checklist.md`

## Goal

Create one deterministic Remotion composition for `antigravity-context-overload` using the five already production-ready content-aware animation mechanisms defined in `reel.json`.

Do not redesign the project architecture. Reuse the existing production runtime-grounding chain and prototype components.

## Required implementation

- Create the reel-specific source under this directory without changing the approved spoken text or scene order.
- Register exactly one production composition for this reel without breaking existing library previews.
- Composition format: 1080 × 1920, 30 FPS, 900 frames.
- Five scenes, exactly 180 frames each, with continuous frame ranges and no gaps.
- Use the animation IDs declared in `reel.json`; do not substitute shell-only or concept variants.
- Ground each scene from its `spokenText` through the canonical meaning → derive → sanitize → associate → render-props path.
- Do not inject direct `labels` or `values` from demo fixtures.
- Render subtitles from `subtitle-cues.json` in a dedicated safe zone.
- No music and no SFX for the first pass.
- No external image assets are required.

## Required tests

Add focused contract tests proving:

- format is 1080 × 1920 at 30 FPS
- duration is exactly 900 frames
- exactly five unique scene IDs exist
- scene frame ranges are continuous and non-overlapping
- every selected animation ID is production-ready
- every subtitle cue stays inside its scene
- concatenated subtitle text covers the approved spoken text per scene
- no animation ID is reused in the reel
- no direct demo fixture values are imported into the reel

## Required execution order

Before implementation:

`node scripts/run-antigravity-content-test.mjs`

Then implement the reel.

After implementation:

1. run the reel package validator
2. run focused reel tests
3. run TypeScript checking for the relevant Remotion/reel source
4. render smoke frames at the beginning, midpoint, and end of every scene
5. inspect all smoke frames visually
6. fix any overflow, overlap, empty opening state, misleading value, or unclear motion
7. render the full 900-frame MP4
8. validate the MP4 technically
9. update `review-checklist.md` only for items actually verified

## Stop conditions

Do not claim completion if:

- any test is failing
- any scene uses an ungrounded numeric fact
- subtitles overlap the main explanation
- any full animation is repeated
- an opening or final state is unreadable
- the full MP4 has not actually been rendered and inspected

Do not merge PR #3 or modify `main` as part of this task.
