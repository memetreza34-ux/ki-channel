# Codex operating instructions

## Mission

This repository produces premium German vertical AI explainer reels with Remotion. Work as a production engineer, not as an unconstrained creative writer. Planning files define the content; Codex turns the approved plan and supplied assets into deterministic code, tests, renders, and an honest report.

## Instruction order

1. Read this file.
2. Read `ki/reel-brain/PRODUCTION-BRAIN.md` before any reel production work.
3. Read the nearest nested `AGENTS.md` for the files you will edit.
4. Read only the reel package named in the task.
5. Read `docs/CODEX_REEL_WORKFLOW.md` when assembling a hybrid reel.
6. Use existing reel-specific code, components, and animation-library entries before inventing infrastructure.

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

For a named reel, treat the visible reel folder, its timeline contract, and the permanent production brain as authoritative. Typical files include:

- `reel.json`
- voiceover script
- scene plan
- image prompts
- animation plan
- subtitle cues
- asset manifest
- Codex task
- review checklist

Do not rewrite approved voiceover, scene order, image prompts, or semantic intent unless a contradiction makes implementation impossible. Document the contradiction before changing it. Frame boundaries may be adjusted after the final transcript only when required for clean synchronization, and every dependent contract must then be updated together.

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
- Validate all required files from the asset manifest before implementation or render.
- Respect declared crop mode, anchor point, safe area, layer role, and scene ownership.
- Do not bake long headings, subtitles, arrows, diagrams, or statistics into generated images; Remotion should render them.
- If an image needs independent object motion, use declared layered assets or masks. Do not pretend a flat image contains separable layers.

## Audio

- Voiceover is the primary audio track.
- Generate the source voice at 1.00x unless the reel contract explicitly says otherwise.
- The standard KI reel playback rate is 1.10x with natural pitch preserved.
- Final word synchronization must come from the real voiceover transcript, not estimates.
- Default SFX mode is off.
- Do not generate synthetic beeps, noise sweeps, music, or a sound for every word.
- Never claim voice synchronization is exact without the final audio file and word timestamps.

## Required implementation sequence

1. Validate branch and working tree.
2. Read the permanent production brain, reel package, and nearest `AGENTS.md` files.
3. Confirm reel-specific Remotion code already exists; prebuild missing approved code before asking the user for assets.
4. Confirm every required image and audio asset exists.
5. Stage assets into the Remotion public directory.
6. Transcribe final audio and replace estimated word cues.
7. Synchronize existing scene choreography with the final 1.10x timeline.
8. Register exactly one production composition without breaking existing previews.
9. Run typecheck and focused tests.
10. Render smoke frames.
11. Inspect every smoke frame visually.
12. Fix layout and choreography issues at their cause.
13. Render all checkpoints and the full MP4.
14. Watch the MP4 at normal speed and inspect it at phone size.
15. Run technical artifact validation.
16. Update only genuinely completed checklist items.

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
7. audio and transcript status
8. rendered artifact paths
9. technical validation result
10. remaining known issues
11. confirmation that `main` was not modified
12. pull request state, only when a PR is part of the task
