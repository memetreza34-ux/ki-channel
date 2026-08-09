# Context Overload reel instructions

This is the technical planning area of the approved reel package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

The package must remain in this weekly location permanently.

## Authority order

1. repository `AGENTS.md`
2. `ki/AGENTS.md`
3. `ki/reels/AGENTS.md`
4. repository `GEMINI.md`
5. `ki/gehirn/PRODUKTIONSABLAUF.md`
6. this file
7. `PHASE-STATUS.md`
8. `reel.json`
9. `../01-script-audio/voiceover.md`
10. `scene-plan.md`
11. `animation-plan.md`
12. `../03-caption/subtitle-cues.json`
13. `../02-bilder/asset-manifest.json`
14. `CODEX_ASSEMBLY_TASK.md`
15. `review-checklist.md`

## Current ownership

- **Phase 1:** planning and executable Remotion foundation are present under `ki/src/reels/antigravity-context-overload/`.
- **Phase 2:** the human only creates the real voiceover from `../01-script-audio/voiceover.md` and places `voiceover.wav` or `voiceover.mp3` in that folder.
- **Phase 3:** Codex/Antigravity integrates the real audio, verifies timing/source/tests, smoke-reviews and final-renders.

Do not force the human to finish code or technical planning during Phase 2. Do not let Phase 3 discard the approved Phase-1 source and rebuild from scratch without a real defect.

## Structure lock

Before and after package/source edits run:

`node scripts/check-ki-reel-folder-structure.mjs`

Never move this package to `ki/src/reels/`. Never flatten it. Never delete or rename the package's `01-script-audio` through `06-projektdateien` folders.

Executable implementation lives separately at:

`ki/src/reels/antigravity-context-overload/`

That source directory contains executable code/tests only, not copies of these planning documents.

## Fixed creative decisions

- Topic: why too much context can make an AI answer worse.
- Five scenes, 180 frames each, total 900 frames as the Phase-1 baseline.
- German voiceover text and scene order are approved and must not be rewritten casually.
- Use exactly the five animation IDs in `reel.json` for the first implementation.
- No external images, music or SFX in the first pass.
- Do not introduce exact numeric claims that are not spoken.

## Implementation priority

Make the meaning visible. Do not replace selected content-aware mechanisms with generic cards, decorative particles or arbitrary camera movement.

Every scene must show a readable start state, one dominant semantic change and a readable result state. Keep subtitles in a separate safe zone and preserve phone-size readability.

## Phase-3 first commands

After the human has added the real Phase-2 voiceover, Codex/Antigravity starts with:

1. `node scripts/check-ki-reel-folder-structure.mjs`
2. `node scripts/run-antigravity-context-overload-preflight.mjs`

If preflight fails, fix the first actual structure, grounding, package or Phase-1-source failure before render work.

If no `voiceover.wav` or `voiceover.mp3` exists in `01-script-audio/`, Phase 3 must stop with `PHASE 2 AUDIO FEHLT` instead of fabricating audio.

Do not merge PR #3 or modify `main`.
