# Codex assembly task — Warum KI halluziniert

Read every applicable `AGENTS.md`, then use this reel package and its generated `CODEX-BRIEF.generated.md` as the production contract.

## Branch

Work only on:

```text
feature/codex-reel-ai-halluzinationen
```

Never modify `main`. Do not create, merge, close, or mark a pull request ready unless explicitly requested later.

## First commands

```bash
git status
git branch --show-current
git log -5 --oneline
node scripts/prepare-codex-reel.mjs 2026-08-05-warum-ki-halluziniert --ready
```

Stop immediately when the readiness command reports a missing or invalid required asset. Do not create placeholder images, synthetic replacement images, silent audio, or unrelated substitutes.

## Approved scope

Implement exactly one production composition:

```text
Reel-WhyAIHallucinates
```

Create reel-specific code under:

```text
ki/src/reels/why-ai-hallucinates/
```

Recommended structure:

```text
ki/src/reels/why-ai-hallucinates/
├── contract.ts
├── assetHelpers.ts
├── subtitleCues.ts
├── ReelWhyAIHallucinates.tsx
├── remotion-entry.tsx
├── components/
├── scenes/
└── __tests__/
```

Do not rewrite the approved voiceover, scene order, headings, image prompts, frame ranges, animation IDs, layout families, or motion signatures.

## Asset rules

Use only assets declared in `asset-manifest.json`.

- resolve repository assets with `staticFile()`
- centralize paths in one typed helper
- preload all required images and audio
- never bake headlines or subtitles into images
- respect crop, anchor, safe-area, and treatment metadata
- treat scene 3 as a cutout asset when transparency is present
- do not pretend flat images contain independently movable objects
- use masks, regional focus, overlays, SVG, and Remotion geometry to create the declared movement

## Scene requirements

### Scene 1

Use the supplied confident-answer image. Draw the confidence ring and crack in Remotion. Carry exactly one glass fragment into scene 2.

### Scene 2

Build the candidate rail natively in Remotion. Percentages must equal 100 and be labeled as a simplified example. `WAHRHEIT` remains outside the probability rail and is blocked at the narration word `keine`.

### Scene 3

Use the supplied machine image. Animate the source gap, pattern pieces, press state, output card, and `PLAUSIBEL` result in Remotion.

### Scene 4

Use the supplied four-document image. Keep the camera stable. Animate only local focus frames, labels, date check, risk meter, and warning frame.

### Scene 5

Build a neutral chat UI, not a branded ChatGPT or Claude clone. Highlight vague phrases and show the empty detail questions `WER?`, `WELCHE?`, and `WANN?`.

### Scene 6

Build a neutral browser UI. Use only `.example` domains. Show 404, missing domain, and missing evidence as three distinct failure states.

### Scene 7

Build a mirrored answer comparison using the exact fictional example values from `scene-plan.md`. Keep both sides visible for comparison and show `3 WIDERSPRÜCHE`.

### Scene 8

Use the supplied verification-desk image. Build three gates and two answer cards in Remotion. Only the fully checked card becomes green. Hold `KI-ANTWORTEN PRÜFEN` and `SICHER ≠ WAHR` through the final frame.

## Subtitle and timing behavior

- render every spoken word
- show only words already spoken
- maximum nine visible words at once
- replace approximate cue times with final transcript timings from `voiceover.wav`
- keep cue changes within their declared scenes
- important words use the declared semantic colors and reactions
- subtitles remain independent from UI text

## Audio behavior

```text
soundMode = off
```

The final reel contains the supplied voiceover only. Do not add synthetic beeps, noise sweeps, music, word sounds, or transition sounds.

## Required tests

Add focused tests for:

- 1080 × 1920 at 30 FPS
- exactly 1080 frames
- exactly eight scenes
- continuous scene frame ranges
- unique scene IDs
- unique full animation IDs
- no adjacent repeated layout family
- no adjacent repeated motion signature
- all required asset paths centralized and declared
- all subtitle cues inside scene bounds
- word cues ordered
- every scene has a heading
- scene 2 percentages sum to 100
- scene 7 fictional comparison values are stable
- `soundMode` defaults to `off`
- final scene content remains present on frame 1079

Do not weaken existing validators or bypass failures with `any`, `@ts-ignore`, skipped tests, or placeholder reports.

## Render workflow

1. Typecheck and focused tests.
2. Render the 32 checkpoints from `reel.json`.
3. Inspect every checkpoint at full size and phone size.
4. Fix clipping, overlap, empty starts, unfinished results, and weak narration-motion links.
5. Render the complete MP4 with voiceover.
6. Watch the MP4 at normal speed.
7. Confirm that no scene has more than three competing strong motions.
8. Confirm that all image scenes use meaningful overlays or state changes, not generic zooms.
9. Run technical PNG and MP4 validation using the repository's existing artifact helpers.
10. Write a current-source release report.

Create reel-specific scripts or extend existing generic scripts only when needed. Keep changes focused on this reel and reusable low-level helpers.

## Completion rule

Do not say the reel is finished unless:

- readiness passed with real assets
- TypeScript passed
- focused tests passed
- all checkpoint images rendered and were inspected
- the current MP4 rendered
- the current MP4 was watched at normal speed
- mobile readability was checked
- technical artifact validation passed
- `review-checklist.md` contains only genuinely completed checks

## Required final report

Report exactly:

1. branch and final commit SHA
2. files changed
3. commands run with exact results
4. assets found and missing
5. scene-by-scene implementation summary
6. visual problems found and fixes made
7. audio and subtitle synchronization status
8. paths to checkpoint frames, MP4, and release report
9. technical validation result
10. remaining known issues
11. confirmation that `main` was not modified
12. PR state only when a PR was explicitly part of the task
