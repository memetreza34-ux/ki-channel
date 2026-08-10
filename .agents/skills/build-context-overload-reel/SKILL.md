---
name: build-context-overload-reel
description: Performs Phase 3 for the approved reel "Warum mehr Kontext eine KI schlechter machen kann" by integrating the human voiceover into the existing Phase-1 implementation, verifying, visually reviewing and exporting it.
---

# Context Overload Reel — Phase 3

This skill is **not** a from-scratch builder. Phase 1 already exists.

## Read first

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/reels/AGENTS.md`
6. package `06-projektdateien/PHASE-STATUS.md`
7. package `06-projektdateien/AGENTS.md`
8. `06-projektdateien/reel.json`
9. script/captions/manifest/scene/animation/assembly/review files

Planning package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Existing source:

`ki/src/reels/antigravity-context-overload/`

Composition:

`KI-ContextOverload`

## Required Phase-3 order

1. Work from canonical `main` on a task branch unless the user explicitly specifies another branch.
2. Run `node scripts/check-ki-reel-folder-structure.mjs`.
3. Run `node scripts/run-antigravity-context-overload-preflight.mjs`.
4. Confirm existing Phase-1 source and Composition registration.
5. Locate `01-script-audio/voiceover.wav`, otherwise `voiceover.mp3`.
6. If neither exists, stop with `PHASE 2 AUDIO FEHLT`.
7. Measure real audio duration.
8. Integrate audio without moving the planning package.
9. Preserve approved script, scene order and five animation IDs.
10. Preserve spokenText → meaning → derive → sanitize → associate → render-props.
11. Align subtitle timing to real audio without dropping words.
12. Run structure check, focused tests and TypeScript.
13. Render opening, midpoint and readable end-hold for each scene.
14. Inspect all 15 smoke frames visually.
15. Fix clipping, overlap, internal goal text, text duplication, misleading values, weak motion and mobile readability.
16. Render full MP4 only after smoke review is clean.
17. Validate MP4 technically and watch it at normal speed/phone scale.
18. Update review checklist and phase status only for work actually completed.
19. Final structure check and honest report.

## Hard constraints

- do not rebuild the reel from zero
- do not fabricate audio
- do not rewrite the approved speaker text to fit timing
- do not silently replace animation IDs
- no external images, music or SFX for this reel unless the package is explicitly changed in Phase 1
- no invented capacities, percentages, token counts or other numeric facts
- internal `goal`/planner text never appears in the final reel
- caption, headline and animation labels must not redundantly repeat the same sentence
- never weaken validators to obtain green output
- never claim unexecuted checks passed
