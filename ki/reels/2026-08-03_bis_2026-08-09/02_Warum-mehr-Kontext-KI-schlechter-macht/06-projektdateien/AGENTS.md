# Antigravity Context Overload reel instructions

This is the technical planning area of the approved reel package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

The package must remain in this weekly location permanently.

## Authority order

1. repository `AGENTS.md`
2. `ki/AGENTS.md`
3. `ki/reels/AGENTS.md`
4. repository `GEMINI.md`
5. this file
6. `reel.json`
7. `../01-script-audio/voiceover.md`
8. `scene-plan.md`
9. `animation-plan.md`
10. `../03-caption/subtitle-cues.json`
11. `../02-bilder/asset-manifest.json`
12. `CODEX_ASSEMBLY_TASK.md`
13. `review-checklist.md`

## Structure lock

Before and after package/source edits run:

`node scripts/check-ki-reel-folder-structure.mjs`

Never move this package to `ki/src/reels/`. Never flatten it. Never delete or rename the package's `01-script-audio` through `06-projektdateien` folders.

Executable implementation may be created separately only after preflight at:

`ki/src/reels/antigravity-context-overload/`

That source directory must contain executable code/tests only, not copies of these planning documents.

## Fixed creative decisions

- Topic: why too much context can make an AI answer worse.
- Five scenes, 180 frames each, total 900 frames.
- German voiceover text and scene order are approved and must not be rewritten casually.
- Use exactly the five animation IDs in `reel.json` for the first implementation.
- No external images, music or SFX in the first pass.
- Do not introduce exact numeric claims that are not spoken.

## Implementation priority

Make the meaning visible. Do not replace selected content-aware mechanisms with generic cards, decorative particles or arbitrary camera movement.

Every scene must show a readable start state, one dominant semantic change and a readable result state. Keep subtitles in a separate safe zone and preserve phone-size readability.

## Required first command

Before editing executable source:

`node scripts/run-antigravity-context-overload-preflight.mjs`

If that fails, fix folder structure or grounding before building this reel.

Do not merge PR #3 or modify `main`.
