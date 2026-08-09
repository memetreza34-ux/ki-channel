# Codex-first hybrid reel workflow

## Goal

Codex should spend its context on implementation, testing and visual correction—not on rediscovering the reel concept. Every real reel therefore lives as a durable weekly production package with fixed narration, assets, scene timing, motion intent and review gates.

The package is planning authority. Executable Remotion source remains separate.

## Permanent package layout

Every production reel lives at:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Create new packages only with:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Do not copy the old flat `_codex-hybrid-template` into `ki/reels/<slug>/`. That layout is legacy reference material and is not a valid production package.

## File responsibilities

### `01-script-audio/`

- approved voiceover text
- final voiceover audio when available
- transcript / audio timing data

### `02-bilder/`

- asset manifest
- image prompts when images are actually needed
- generated images, layers and masks

### `03-caption/`

- subtitle cues or final word timestamps
- social caption when applicable

### `04-pdf/`

- optional PDF source/final artifacts

### `05-export/`

- smoke frames
- review renders
- final export artifacts

### `06-projektdateien/`

- `reel.json`
- scene plan
- animation / motion plan
- Codex assembly task
- review checklist
- generated Codex package report / brief

## Responsibilities

### Creative planning, completed before Codex

- topic and target audience
- hook and final voiceover
- scene order and exact frame ranges
- decision per scene: image, layered image, UI reconstruction, chart or Remotion-only animation
- image prompts and required generated assets when applicable
- important-word animation plan
- subtitle cues or transcript timestamps
- transitions and image treatment
- asset filenames and roles
- visual and technical checklist

### User asset step

Place final generated assets in the paths declared by `02-bilder/asset-manifest.json`, including final voiceover when the manifest declares it.

### Codex step

- validate repository/package structure
- validate the named planning package and assets
- implement the declared Remotion composition under `ki/src/reels/<reel-slug>/`
- never move planning documents into source code
- use supplied assets without silent substitution
- add focused tests
- run typecheck and tests
- render smoke frames and inspect them
- fix layout and choreography at the cause
- render all required checkpoints and the MP4
- inspect at phone size and normal speed
- run technical artifact validation
- update only genuinely completed checklist items

## Prepare for Codex

Example production package:

```text
ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/
```

Planning validation:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht
```

Strict readiness validation after required assets are present:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht \
  --ready
```

The command writes:

```text
ki/reels/<week>/<NN_Reel-Titel>/06-projektdateien/CODEX-BRIEF.generated.md
ki/reels/<week>/<NN_Reel-Titel>/06-projektdateien/codex-package-report.json
```

The executable source target is derived from `06-projektdateien/reel.json`, for example:

```text
ki/src/reels/antigravity-context-overload/
```

## Codex task contract

For a named package, the implementation instruction should be equivalent to:

```text
Read AGENTS.md, ki/AGENTS.md, ki/reels/AGENTS.md and the nearest package AGENTS.md.
Use the approved package under ki/reels/<week>/<NN_Reel-Titel>/ as planning authority.
Implement executable code separately under ki/src/reels/<reel-slug>/.
Do not redesign approved content or move planning files.
Run current package tests and renders, visually inspect outputs, fix issues and report only checks actually performed.
```

## Token-saving design

The generated brief may contain:

- immutable format and scene timing
- voiceover
- asset inventory
- optional image prompt context
- animation instructions
- subtitle cues
- implementation scope
- review gates

Codex should not repeatedly load the same source documents. Open originals only when a contradiction or missing detail requires it.

## Image strategy

Use a generated image when it provides a complex editorial environment or object that would be inefficient to construct in SVG/CSS. Use Remotion for:

- headlines and subtitles
- arrows, labels and callouts
- charts and counters
- UI focus and cursor actions
- masks and reveals
- parallax between declared layers
- semantic transitions
- important-word reactions

A flat image never receives only a generic zoom. Every image scene needs a narration-linked state change, focus operation or explanatory overlay.

## Audio standard

- final voiceover first
- SFX off by default
- no synthetic beeps/noise for every action
- optional SFX only for a small number of visible major actions
- do not claim exact voice synchronization without final audio/timestamps

## Definition of done

A reel is complete only when all relevant current-source checks have actually succeeded:

- repository/package structure passes
- package readiness passes when required assets are expected
- TypeScript passes
- focused tests pass
- smoke frames are rendered and visually inspected
- required checkpoint set is rendered
- MP4 is rendered and watched at normal speed
- mobile readability is checked
- technical artifact report passes
- remaining issues are documented

A technically valid MP4 is not automatically visually approved.
