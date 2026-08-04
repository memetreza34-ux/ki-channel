# Codex instructions for `ki/reels/`

## Production package is the contract

Each real hybrid reel should contain:

```text
ki/reels/<slug>/
├── README.md
├── reel.json
├── voiceover.md
├── scene-plan.md
├── image-prompts.md
├── animation-plan.md
├── subtitle-cues.json
├── asset-manifest.json
├── CODEX_ASSEMBLY_TASK.md
├── review-checklist.md
└── assets/
    ├── images/
    ├── layers/
    ├── masks/
    └── audio/
```

Read the named package only. Do not scan every historical reel unless the task explicitly asks for comparison.

## Authority

- `reel.json` controls format, duration, composition ID, scene order, and frame ranges.
- `voiceover.md` controls narration wording.
- `scene-plan.md` controls the intended explanation and visual hierarchy.
- `image-prompts.md` documents how supplied generated images were designed.
- `animation-plan.md` controls choreography, important-word reactions, and transitions.
- `subtitle-cues.json` controls subtitle timing until final transcript timestamps replace it.
- `asset-manifest.json` controls exact file paths, asset ownership, crop, anchor, role, and whether an asset is required.
- `CODEX_ASSEMBLY_TASK.md` controls implementation scope and commands.
- `review-checklist.md` records actual verification only.

Do not silently resolve conflicts by choosing whichever file is easiest. Report the conflict and use this precedence order.

## Asset readiness

Before coding, run:

```bash
npm run codex:reel:prepare -- <slug> --ready
```

Stop when required assets are missing, unreadable, duplicated, or declared outside the reel package. Do not make placeholder images and do not use unrelated repository images.

## Token-efficient work

After validation, read the generated file:

```text
ki/reels/<slug>/CODEX-BRIEF.generated.md
```

Use it as the primary task context. Open the original files only when a section is ambiguous. This avoids repeatedly loading the complete package.

## Assembly behavior

- Implement exactly the declared scenes and frame ranges.
- Use the supplied images and audio; do not redesign the reel.
- Adapt existing primitives without copying a complete unrelated scene.
- Follow the declared image treatment: flat, layered, masked, cutout, or Remotion-only.
- Use `staticFile()` and central asset helpers.
- Do not bake subtitles or headings into images.
- Default to `soundMode: "off"` unless the package explicitly requests an A/B SFX variant.

## Completion

A reel is not complete until current-source tests, smoke frames, all checkpoints, MP4, technical artifact validation, and manual visual review have been performed. Old renders are invalid after source changes.
