# Phase 3 Assembly Task — Context Overload Reel

This task starts **after Phase 1 is already implemented and after the human has supplied Phase-2 voiceover audio**.

Planning package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Existing executable source:

`ki/src/reels/antigravity-context-overload/`

Do not move or flatten either location.

## Read first

1. Repository `AGENTS.md`
2. `ki/AGENTS.md`
3. `ki/reels/AGENTS.md`
4. Repository `GEMINI.md`
5. `ki/gehirn/PRODUKTIONSABLAUF.md`
6. `06-projektdateien/AGENTS.md`
7. `06-projektdateien/PHASE-STATUS.md`
8. `06-projektdateien/reel.json`
9. `01-script-audio/voiceover.md`
10. `06-projektdateien/scene-plan.md`
11. `06-projektdateien/animation-plan.md`
12. `03-caption/subtitle-cues.json`
13. `02-bilder/asset-manifest.json`
14. `06-projektdateien/review-checklist.md`

## Phase ownership

### Phase 1 — already done before this task

Phase 1 owns:

- approved script
- planning package
- exact scene order and animation IDs
- subtitle baseline
- asset policy
- content-grounded Remotion source
- Composition registration
- focused source/contract checks

Do **not** rebuild this work from scratch.

### Phase 2 — human

The human creates exactly one real voiceover from `01-script-audio/voiceover.md` and places it in `01-script-audio/`, preferably as `voiceover.wav`, alternatively `voiceover.mp3`.

### Phase 3 — this task

Your job is to integrate the real audio, verify the existing Phase-1 implementation, adjust only what the real audio or actual failures require, visually review and export.

## Required Phase-3 execution order

1. Confirm branch is not `main`.
2. Run `node scripts/check-ki-reel-folder-structure.mjs`.
3. Run `node scripts/run-antigravity-context-overload-preflight.mjs`.
4. Verify Phase-1 source exists under `ki/src/reels/antigravity-context-overload/`.
5. Verify the `KI-ContextOverload` Composition remains registered in `ki/src/Root.tsx`.
6. Locate `01-script-audio/voiceover.wav` or `voiceover.mp3`.
7. If audio is absent, STOP with `PHASE 2 AUDIO FEHLT`. Never fabricate voiceover.
8. Measure real audio duration.
9. Integrate the audio in a Remotion-accessible location/configuration.
10. Preserve the approved five spoken texts, scene order and exact five animation IDs.
11. Keep every scene on the pipeline spokenText → meaning → derive → sanitize → associate → render-props.
12. Align subtitle timing to the actual voiceover while retaining complete word coverage.
13. If the audio does not fit the 900-frame contract naturally, do not silently time-stretch, truncate or rewrite speech. Report the mismatch and make only an explicit contract-safe change.
14. Run the folder validator again.
15. Run `node scripts/check-antigravity-context-overload-reel.mjs`.
16. Run the focused reel tests.
17. Run relevant TypeScript checking.
18. Render three smoke frames per scene: opening, midpoint and final readable hold.
19. Inspect all 15 smoke frames visually.
20. Fix actual overflow, overlap, empty opening state, misleading values, semantic mismatch or unreadable mobile text.
21. Render the full reel only after smoke review is clean.
22. Validate the MP4 technically and watch it at normal speed.
23. Update `review-checklist.md` and `PHASE-STATUS.md` only for work actually completed.
24. Run the folder validator once more.
25. Report exact commands, test state, measured audio duration, smoke paths, final MP4 path and any remaining blocker.

## Fixed production contract

- Composition: `KI-ContextOverload`
- Slug: `antigravity-context-overload`
- 1080 × 1920
- 30 FPS
- baseline duration: 900 frames
- five scenes
- baseline scene duration: 180 frames each
- no music
- no SFX
- no external image/video assets in the first production pass

Selected animation IDs:

1. `context-window-context-window-train-v1`
2. `relationship-network-dependency-bridge-builder-v1`
3. `retrieval-search-knowledge-magnet-v1`
4. `input-output-funnel-compression-output-v1`
5. `generation-answer-loom-v1`

## Stop conditions

Do not claim completion if audio is missing, structure validation fails, tests fail, a scene uses ungrounded numeric facts, subtitles lose spoken words, text overlaps the explanation, a selected animation is replaced without a proven reason, smoke frames were not actually inspected, or the final MP4 was not actually rendered and watched.

Never create `ki/<reel-name>/`, never flatten the package into `ki/reels/<slug>/`, never relocate planning into `ki/src/reels/`, and never remove permanent 01–06 folders.

Do not merge PR #3 or modify `main`.
