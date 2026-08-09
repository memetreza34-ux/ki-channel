# Antigravity Assembly Task — Context Overload Reel

Build the first real five-scene production reel from the canonical planning package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Do not move or flatten this package.

## Read first

1. Repository `AGENTS.md`
2. `ki/AGENTS.md`
3. `ki/reels/AGENTS.md`
4. Repository `GEMINI.md`
5. `06-projektdateien/AGENTS.md`
6. `06-projektdateien/reel.json`
7. `01-script-audio/voiceover.md`
8. `06-projektdateien/scene-plan.md`
9. `06-projektdateien/animation-plan.md`
10. `03-caption/subtitle-cues.json`
11. `02-bilder/asset-manifest.json`
12. `06-projektdateien/review-checklist.md`

## Goal

Create one deterministic Remotion composition for `antigravity-context-overload` using the five already production-ready content-aware animation mechanisms defined in `06-projektdateien/reel.json`.

The planning package remains under `ki/reels/<week>/<NN_reel>/`. The executable implementation is separate under:

`ki/src/reels/antigravity-context-overload/`

Do not copy planning documents into the source folder.

## Required implementation

- First run `node scripts/check-ki-reel-folder-structure.mjs`.
- Create reel-specific TS/TSX source only under `ki/src/reels/antigravity-context-overload/`.
- Register exactly one production composition without breaking existing library previews.
- Composition format: 1080 × 1920, 30 FPS, 900 frames.
- Five scenes, exactly 180 frames each, continuous and gap-free.
- Preserve approved spoken text and scene order.
- Use the animation IDs declared in `06-projektdateien/reel.json`; do not substitute shell-only/concept variants.
- Ground each scene from its `spokenText` through meaning → derive → sanitize → associate → render-props.
- Do not inject direct `labels` or `values` from demo fixtures.
- Render subtitles from `03-caption/subtitle-cues.json` in a dedicated safe zone.
- No music/SFX and no external image assets for the first pass.

## Required tests

Add focused contract tests proving format, exact 900-frame duration, five unique scene IDs, continuous non-overlapping scene ranges, production eligibility, subtitle bounds/coverage, animation uniqueness and demo-value isolation.

## Required execution order

Before implementation:

1. `node scripts/check-ki-reel-folder-structure.mjs`
2. `node scripts/run-antigravity-context-overload-preflight.mjs`

After implementation:

1. run `node scripts/check-ki-reel-folder-structure.mjs` again
2. run `node scripts/check-antigravity-context-overload-reel.mjs`
3. run focused reel tests
4. run TypeScript checking for relevant Remotion/reel source
5. render smoke frames at beginning, midpoint and end of every scene
6. inspect all 15 smoke frames visually
7. fix overflow, overlap, empty opening state, misleading values or unclear motion
8. render the full 900-frame MP4
9. validate the MP4 technically
10. update `06-projektdateien/review-checklist.md` only for items actually verified
11. run the folder-structure validator once more

## Stop conditions

Do not claim completion if structure validation fails, any test fails, any scene uses an ungrounded numeric fact, subtitles overlap the explanation, a full animation repeats, opening/final state is unreadable, or the full MP4 was not actually rendered and inspected.

Never create `ki/<reel-name>/`, never flatten the package into `ki/reels/<slug>/`, never relocate planning into `ki/src/reels/`, and never remove the permanent 01–06 folders.

Do not merge PR #3 or modify `main`.
