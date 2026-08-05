# Codex operating instructions

## Mission

This repository produces premium German vertical AI explainer reels with Remotion. Work as a production engineer, not as an unconstrained creative writer. Planning files define the content; Codex turns the approved plan and supplied assets into deterministic code, tests, renders, and an honest report.

## Instruction order

1. Read this file.
2. Read the nearest nested `AGENTS.md` for the files you will edit.
3. Read only the reel package named in the task.
4. Read `docs/CODEX_REEL_WORKFLOW.md` when assembling a hybrid reel.
5. Use existing components and animation-library entries before inventing infrastructure.

Do not repeatedly reread the whole repository. Build a short working index of relevant files, commands, assets, and unresolved blockers.

## Git safety

- Never modify `main`.
- Work only on the branch named by the user or task.
- Do not create, merge, close, or mark a pull request ready unless explicitly requested.
- Do not rewrite unrelated files.
- Keep commits focused and descriptive.
- Before editing, run `git status`, `git branch --show-current`, and `git log -5 --oneline`.
- Report the current branch and final commit SHA.

## Truthfulness

- Never claim tests, typecheck, screenshots, audio checks, renders, or visual review succeeded unless you actually ran and inspected them.
- A generated file is not a verified file.
- A technically valid MP4 is not visually approved.
- When blocked, include the exact failing command, relevant error, affected file, and next action.
- Do not hide failures with `any`, `@ts-ignore`, disabled tests, placeholder assets, fake reports, or weakened validators.

## Reel production contract

For a named reel, treat these files as authoritative when present:

- `reel.json`
- `voiceover.md`
- `scene-plan.md`
- `image-prompts.md`
- `animation-plan.md`
- `subtitle-cues.json`
- `asset-manifest.json`
- `CODEX_ASSEMBLY_TASK.md`
- `review-checklist.md`

Do not rewrite approved voiceover, scene order, image prompts, or semantic timing unless a contradiction makes implementation impossible. Document the contradiction before changing it.

## Remotion rules

- Use `useCurrentFrame()`, `interpolate()`, `spring()`, `Sequence`, and deterministic helpers.
- No `Math.random()` during rendering.
- No real-time timers, CSS transitions, network calls, external APIs, or render-time downloads.
- Use `staticFile()` for repository assets.
- Every composition must render correctly when seeking directly to any frame.
- Keep all event times within their scene duration.
- Default reel format is 1080 × 1920, 30 FPS.
- Preserve readable opening and result holds.
- Hard cuts are the default. Use a transition only when an object, shape, direction, or state can continue meaningfully.

## Hybrid image and animation quality

- A supplied image must not be presented with only a generic slow zoom.
- Animate meaningful regions using masks, parallax, depth separation, object cutouts, light changes, connectors, callouts, charts, counters, or state changes.
- One dominant explanatory motion per sentence.
- Maximum three strong simultaneous motions per scene.
- Every spoken word appears in subtitles, but only important words receive strong emphasis.
- Keep headline, main visual, annotations, and subtitles in separate safe zones.
- Avoid repeated center cards, repeated fade-and-scale entrances, decorative particles, continuous glow, and unnecessary camera movement.
- Reuse low-level primitives, not complete scene compositions.
- Do not use the same full animation twice in one reel.

## Images and assets

- Never invent a missing asset or silently substitute an unrelated image.
- Validate all required files from `asset-manifest.json` before implementation.
- Respect declared crop mode, anchor point, safe area, layer role, and scene ownership.
- Do not bake long headings, subtitles, arrows, diagrams, or statistics into generated images; Remotion should render them.
- If an image needs independent object motion, use the declared layered assets or masks. Do not pretend a flat image contains separable layers.

## Audio

- Voiceover is the primary audio track.
- Default SFX mode is off.
- Do not generate synthetic beeps, noise sweeps, or a sound for every word.
- Add SFX only when explicitly requested in the reel package and only for a visible major action.
- Keep the final version without SFX unless an A/B comparison clearly improves it.
- Never claim voice synchronization is exact without the final audio file or word timestamps.

## Required implementation sequence

1. Validate branch and working tree.
2. Read the reel package and nearest `AGENTS.md` files.
3. Run the Codex reel package validator.
4. Confirm every required image and audio asset exists.
5. Create the reel-specific Remotion source under `ki/src/reels/<slug>/`.
6. Register exactly one production composition without breaking existing previews.
7. Add contract tests for format, duration, unique scene IDs, continuous frame ranges, asset paths, cue bounds, and animation uniqueness.
8. Run typecheck and focused tests.
9. Render smoke frames.
10. Inspect every smoke frame visually.
11. Fix layout and choreography issues at their cause.
12. Render all checkpoints and the full MP4.
13. Watch the MP4 at normal speed and inspect it at phone size.
14. Run technical artifact validation.
15. Update only genuinely completed checklist items.

## Visual review gates

Do not approve a scene when any of these are present:

- clipped or unreadable text
- headline, animation, or subtitles overlapping
- empty opening state
- unfinished final frame
- static image with generic zoom only
- more than three competing strong motions
- unclear relationship between narration and movement
- repeated layout or complete animation
- low contrast on phone size
- transition covering an important word
- fake or misleading data presentation

## Final response format

Report:

1. branch and commit SHA
2. files changed
3. commands run and exact results
4. assets found and assets missing
5. implementation summary per scene
6. visual issues found and fixes applied
7. audio status
8. rendered artifact paths
9. technical validation result
10. remaining known issues
11. confirmation that `main` was not modified
12. pull request state, only when a PR is part of the task
