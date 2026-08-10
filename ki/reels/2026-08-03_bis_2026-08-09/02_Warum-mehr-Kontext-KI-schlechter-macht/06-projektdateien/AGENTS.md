# Context Overload Reel — Agent Contract

Package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Source:

`ki/src/reels/antigravity-context-overload/`

## Read order

1. `REPO-STATE.md`
2. root `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/reels/AGENTS.md`
6. this package `PHASE-STATUS.md`
7. this file
8. `reel.json`, script, scene/animation, captions, manifest, assembly task, checklist

## Current phase model

Phase 1 owns the existing plan and executable source. Phase 2 is only the human voiceover. Phase 3 integrates audio and verifies/renders.

Do not interpret missing audio as permission to rebuild source. If Phase 3 is requested and no `voiceover.wav`/`voiceover.mp3` exists, stop with `PHASE 2 AUDIO FEHLT`.

## Fixed creative contract

- topic: why more context can make an AI answer worse
- five scenes
- approved speaker text remains authoritative
- five approved production-ready animation IDs from `reel.json`
- no external images in this pass
- no music/SFX
- no invented numeric capacities/weights/counts
- headline, animation labels and caption must not redundantly copy one another
- internal `goal` values are never viewer-facing text

## Structure

Never move or flatten the weekly package. Planning stays here; executable code stays in `ki/src/reels/antigravity-context-overload/`.

Before/after relevant work run the structure validator. Phase-3 execution follows `CODEX_ASSEMBLY_TASK.md` and `.agents/skills/build-context-overload-reel/SKILL.md`.
