# Codex operating instructions

## Mission

This repository produces premium German vertical AI explainer reels with deterministic Remotion animation. Work as a production engineer, not as an unconstrained creative writer. Planning files define the approved content; Codex synchronizes the prebuilt code to the real voiceover, tests it, renders it, inspects it and reports honestly.

## Instruction order

1. Read this file.
2. Read `ki/reel-brain/PRODUCTION-BRAIN.md`.
3. Read `ki/reel-brain/FUTURE-REEL-STANDARD.md` for every newly created reel.
4. Read `ki/reel-brain/brain.json` for machine-readable defaults.
5. Read the nearest nested `AGENTS.md` for the files you will edit.
6. Read only the named reel package and its reel-local task.
7. Use existing low-level components and animation primitives before inventing infrastructure.

Do not repeatedly reread the whole repository. Build a compact index of the relevant files, commands, media and blockers.

## Git safety

- Never modify `main`.
- Work only on the branch named by the user or task.
- Do not create, merge, close or mark a pull request ready unless explicitly requested.
- Do not rewrite unrelated files.
- Keep commits focused and descriptive.
- Before editing, run `git status`, `git branch --show-current` and `git log -5 --oneline`.
- Report the current branch and final commit SHA.

## Truthfulness

- Never claim tests, typecheck, transcript alignment, screenshots, audio checks, renders or visual review succeeded unless they actually ran and were inspected.
- A generated file is not a verified file.
- A technically valid MP4 is not visually approved.
- Estimated cues are not final transcript timing.
- When blocked, report the exact command, error, affected file and next action.
- Do not hide failures with `any`, `@ts-ignore`, disabled tests, fake reports or weakened validators.

## New reel production defaults

Every newly created reel defaults to:

- 1080 × 1920, 30 FPS
- 60 to 70 seconds
- 125 to 145 spoken words
- 8 to 9 scenes
- normally 6 to 8 seconds per scene
- 100 percent Remotion animation inside the reel
- no generated scene images and no stock scene images
- one separate static cover image with one clear German sentence
- source voice and playback at 1.00x
- at most 1.05x only after explicit approval based on a real listening check
- no music and no sound effects
- one dominant explanatory motion per scene
- at most two strong simultaneous motions
- at least one second of readable result hold

Historical reels may use older contracts. Never copy their shorter duration, 1.10x playback or hybrid image strategy into a new reel.

## Reel production contract

For a named reel, treat the visible reel folder, its timeline contract and the permanent production brain as authoritative. Do not rewrite approved voiceover, scene order or semantic intent unless an implementation-blocking contradiction exists. Document the contradiction before changing it.

Before coding a new reel, confirm that every scene has a semantic beat map:

```text
important expression -> visual reaction -> transcript trigger -> result state
```

Every important meaning beat must be visible. Filler words receive caption timing only.

## Remotion rules

- Use `useCurrentFrame()`, `interpolate()`, `spring()`, `Sequence` and deterministic helpers.
- No `Math.random()` during rendering.
- No real-time timers, CSS transitions, network calls, external APIs or render-time downloads.
- Use `staticFile()` only for declared local assets such as audio and the separate cover visual.
- Every composition must render correctly when seeking directly to any frame.
- Keep all event times within their scene duration.
- Preserve readable opening and result holds.
- Hard cuts are the default.
- Use a transition only when an object, shape, direction or state continues meaningfully.
- Do not repeat a full scene choreography within one reel.
- Adjacent scenes must not reuse the same layout and motion signature.

## Animation pacing

Each normal scene should contain:

1. a clear opening state
2. a concept or cause entering
3. one dominant explanatory action
4. a visible consequence
5. a stable result hold of at least one second

Rules:

- Maximum two strong simultaneous motions.
- Maximum four clearly distinguishable semantic beats per scene.
- No rapid chains of unrelated effects.
- No continuous pulse, random wobble, particle carpet or unnecessary camera motion.
- Do not keep elements moving merely to avoid stillness.
- Important actions begin on or immediately after the matching spoken expression, not before it.
- Scene boundaries, captions and semantic actions must use the same final transcript timeline.

## Layout and readability

- Main visual must be large and central.
- Empty space must support focus and must not make the scene look unfinished.
- Avoid tiny dashboards, thin lines and small labels as core information.
- Headline, main visual and subtitles must use separate safe zones.
- Core information must remain readable on a phone.
- The result state must communicate the point without audio.

## Captions

- Use normal sentence-based subtitles, not rapid two-to-four-word chunks.
- Maximum two lines.
- Default about 50 px; never below 40 px for long sentences.
- White text with dark outline or strong shadow.
- No large subtitle box.
- Show only words that have already been spoken.
- A current important word may receive subtle emphasis.
- Do not bounce or spring the whole sentence.
- Final timing must come from the real word transcript.

## Cover

- The cover is a separate static image, not an animated reel scene.
- It contains one main motif and exactly one short German sentence.
- Do not add secondary labels, subtitles or multiple messages.
- Do not rely on an image generator for readable text; typeset the exact sentence deterministically.
- The final cover must be reviewed at phone size.

## Audio

- Voiceover is the only audio track by default.
- Generate and play the source at 1.00x.
- Do not use 1.10x as a default.
- A playback rate above 1.00x requires a real listening check and explicit approval; never exceed 1.05x without a new user decision.
- Preserve natural pitch.
- Do not add music, beeps, noise sweeps or sounds for individual words.
- Never claim exact synchronization without the final audio file and real word timestamps.

## Required implementation sequence

1. Validate branch and working tree.
2. Read the permanent production brain, future standard and reel-local instructions.
3. Check script word count, planned duration, scene count and semantic coverage.
4. Confirm all approved Remotion scene code exists before asking for user media.
5. Confirm the final audio and cover input exist when required.
6. Transcribe the final audio.
7. Use one timestamp source for captions, scene boundaries and semantic actions.
8. Register exactly one production composition without breaking previews.
9. Run typecheck and focused tests.
10. Render smoke frames.
11. Inspect smoke frames at full and phone size.
12. Fix pacing, layout and synchronization at their cause.
13. Render all checkpoints, cover and full MP4.
14. Create and inspect the contact sheet.
15. Watch the full MP4 at normal speed and phone size.
16. Run technical artifact validation.
17. Update only genuinely completed review items.

## Visual review blockers

Do not approve a scene or reel when any of these are present:

- clipped or unreadable text
- headline, animation or subtitles overlapping
- empty or unfinished opening state
- unfinished final frame
- less than one second of readable result hold
- more than two competing strong motions
- important narration without a matching visual reaction
- important action appearing before the spoken trigger
- rapid effect chains that cannot be read
- repeated full layout or choreography
- tiny UI details carrying the main message
- low contrast at phone size
- transition covering an important expression
- fake or misleading data presentation
- generated scene images in a newly created reel
- cover containing more than one sentence or more than one message

## Final response format

Report:

1. branch and commit SHA
2. files changed
3. commands run and exact results
4. media found and media missing
5. script duration and word-count status
6. semantic coverage status
7. implementation summary per scene
8. pacing or visual issues found and fixes applied
9. audio and transcript status
10. rendered artifact paths
11. technical validation result
12. remaining known issues
13. confirmation that `main` was not modified
14. pull request state only when a PR is part of the task
