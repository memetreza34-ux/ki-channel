# Codex-first hybrid reel workflow

## Goal

Codex should spend context on implementation, testing and visual correction—not on rediscovering the reel concept. Every reel therefore arrives as a structured production contract.

## Reel structure

```text
ki/reels/<slug>/
├── README.md
├── reel.json
├── script/
│   ├── voiceover.md
│   └── subtitle-cues.json
├── scenes/
│   ├── README.md
│   └── scene-XX.md
├── visuals/
│   ├── image-prompts.md
│   └── animation-plan.md
├── assets/
│   ├── asset-manifest.json
│   ├── README.md
│   ├── images/
│   └── audio/
└── codex/
    ├── CODEX_ASSEMBLY_TASK.md
    ├── CODEX-BRIEF.generated.md
    ├── codex-package-report.json
    └── review-checklist.md
```

This separates narration, scene planning, visual design, assets and Codex execution.

## Responsibilities

### Creative planning before Codex

- topic, hook and final voiceover
- scene order and exact frame ranges
- one scene file per scene
- image or Remotion decision per scene
- image prompts and exact asset paths
- important-word reactions and transitions
- subtitle cues or transcript timestamps
- review gates

### Asset step

Place generated images and final voiceover at the paths declared by:

```text
assets/asset-manifest.json
```

### Codex step

- validate package and assets
- read the generated compact brief
- implement the Remotion composition
- add focused tests
- run typecheck and tests
- render and visually inspect checkpoints
- fix layout and choreography issues
- render and watch the current MP4
- run technical artifact validation
- update only genuinely completed review items

## Prepare for Codex

Planning validation:

```bash
npm run codex:reel:prepare -- <slug>
```

Strict readiness validation after assets are present:

```bash
npm run codex:reel:prepare -- <slug> --ready
```

The command writes:

```text
ki/reels/<slug>/codex/CODEX-BRIEF.generated.md
ki/reels/<slug>/codex/codex-package-report.json
```

## Short Codex task

```text
Read all applicable AGENTS.md files.
Implement the reel package at ki/reels/<slug>/.
Use codex/CODEX-BRIEF.generated.md as primary context.
Work only on the current branch and do not redesign approved content.
Run required tests and renders, inspect outputs visually, fix issues,
and report exact results honestly.
```

## Token-saving design

The generated brief contains:

- format and scene timing
- final narration
- every individual scene file
- asset inventory
- image prompts
- global animation rules
- subtitle cues
- Codex execution scope
- review checklist

Codex should not repeatedly load unrelated repository history or other reels.

## Image strategy

Use generated images for complex editorial objects or environments. Use Remotion for headings, subtitles, arrows, labels, charts, counters, UI focus, masks, reveals, semantic transitions and important-word reactions.

A flat image never receives only a generic zoom. Every image scene needs a meaningful state change or explanatory overlay.

## Audio standard

- final voiceover first
- SFX off by default
- no generated beeps or noise sweeps
- no sound for every word
- SFX only through an explicit later request and A/B comparison

## Definition of done

A reel is complete only when:

- readiness validation passes with real assets
- TypeScript passes
- focused tests pass
- all declared checkpoints render and are inspected
- current MP4 renders and is watched at normal speed
- mobile readability is checked
- technical artifact validation passes
- remaining issues are documented
