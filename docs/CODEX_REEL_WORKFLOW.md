# Codex-first hybrid reel workflow

## Goal

Codex should spend its context on implementation, testing, and visual correction—not on rediscovering the reel concept. Each reel therefore arrives as a complete production contract with fixed narration, assets, scene timing, motion intent, and review gates.

Codex is guided by repository and nested `AGENTS.md` files. The generated `CODEX-BRIEF.generated.md` condenses the named reel package into one implementation document.

## Responsibilities

### Creative planning, completed before Codex

- topic and target audience
- hook and final voiceover
- scene order and exact frame ranges
- decision per scene: image, layered image, UI reconstruction, chart, or Remotion-only animation
- image prompts and required generated assets
- important-word animation plan
- subtitle cues or transcript timestamps
- transitions and image treatment
- asset filenames and roles
- visual and technical checklist

### User asset step

Place final generated assets in the exact paths declared by `asset-manifest.json`, including the final voiceover file.

### Codex step

- validate the package and assets
- implement the declared Remotion composition
- use supplied assets without creative redesign
- add focused tests
- run typecheck and tests
- render smoke frames and inspect them
- fix layout and choreography
- render all checkpoints and the MP4
- inspect at phone size and normal speed
- run technical artifact validation
- update only completed checklist items

## Create a package

Copy:

```text
ki/reels/_codex-hybrid-template/
```

Rename it to a dated slug, for example:

```text
ki/reels/2026-08-04-ai-agenten-einfach-erklaert/
```

Fill every planning file before adding final assets.

## Prepare for Codex

Planning validation, without requiring final assets:

```bash
node scripts/prepare-codex-reel.mjs 2026-08-04-ai-agenten-einfach-erklaert
```

Strict readiness validation after images and audio are present:

```bash
node scripts/prepare-codex-reel.mjs 2026-08-04-ai-agenten-einfach-erklaert --ready
```

The command writes:

```text
ki/reels/<slug>/CODEX-BRIEF.generated.md
ki/reels/<slug>/codex-package-report.json
```

Give Codex this task:

```text
Read the repository AGENTS.md files and implement the reel package at
ki/reels/<slug>/ using its CODEX-BRIEF.generated.md.
Work only on the current branch. Do not redesign approved content.
Run the package's required tests and renders, visually inspect outputs,
fix issues, and report honestly using the required final format.
```

## Token-saving design

The generated brief contains:

- immutable format and scene timing
- voiceover
- asset inventory
- image prompts for context
- animation instructions
- subtitle cues
- implementation scope
- review gates

Codex should not repeatedly load the same source documents. It opens originals only when the generated brief points to a contradiction.

## Image strategy

Use a generated image when it provides a complex editorial environment or object that would be inefficient to construct in SVG/CSS. Use Remotion for:

- headlines and subtitles
- arrows, labels, and callouts
- charts and counters
- UI focus and cursor actions
- masks and reveals
- parallax between declared layers
- semantic transitions
- important-word reactions

A flat image never receives only a generic zoom. Every image scene needs at least one meaningful state change or explanatory overlay.

## Audio standard

- final voiceover first
- SFX off by default
- no generated beeps or noise sweeps
- optional SFX only for a small number of visible major actions
- final SFX version must be A/B compared against the voiceover-only version

## Definition of done

A reel is complete only when all current-source checks are real:

- package readiness passes
- TypeScript passes
- focused tests pass
- smoke frames rendered and visually inspected
- full checkpoint set rendered
- MP4 rendered and watched at normal speed
- mobile readability checked
- technical artifact report passes
- remaining issues are documented
