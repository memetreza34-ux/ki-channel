# Codex instructions for `ki/reels/`

## Production package is the contract

Every real hybrid reel uses this structure:

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

Read only the named reel package. Do not scan every historical reel unless comparison is explicitly requested.

## Authority order

1. `reel.json` — format, duration, composition ID, scene order, frame ranges, file map
2. `script/voiceover.md` — approved narration
3. `scenes/scene-XX.md` — scene-specific explanation, image, choreography, important words, transition
4. `visuals/animation-plan.md` — global motion, layering, color and transition rules
5. `visuals/image-prompts.md` — intended design of supplied images
6. `script/subtitle-cues.json` — approximate or final word timing
7. `assets/asset-manifest.json` — exact paths, ownership, crop, anchors, roles and requirements
8. `codex/CODEX_ASSEMBLY_TASK.md` — implementation sequence and commands
9. `codex/review-checklist.md` — actual verification only

Do not silently resolve contradictions. Report them and stop when they affect implementation.

## Asset readiness

Before coding, run:

```bash
npm run codex:reel:prepare -- <slug> --ready
```

Stop when required assets are missing, unreadable, duplicated or outside the reel package. Never create placeholders or substitute unrelated repository images.

## Token-efficient work

After successful validation, read:

```text
ki/reels/<slug>/codex/CODEX-BRIEF.generated.md
```

Use it as primary context. Open original files only to resolve a specific ambiguity.

## Assembly behavior

- implement exactly the declared scenes and frame ranges
- use supplied images and audio without redesigning approved content
- reuse low-level primitives, not a complete unrelated reel
- respect image treatment: flat, masked, cutout or Remotion-only
- use `staticFile()` and centralized asset helpers
- never bake subtitles or headings into images
- default to `soundMode: "off"`
- do not change the approved voiceover to make implementation easier

## Completion

A reel is not complete until current-source typecheck, focused tests, checkpoint renders, current MP4, technical validation and manual visual review have genuinely been completed. Old renders are invalid after source changes.
