# Codex instructions for `ki/reels/`

## Minimal visible reel structure

Real reels keep only the files a human normally needs at the top level:

```text
ki/reels/<slug>/
├── 01_START-HIER.md
├── 02_VOICEOVER.md
├── 03_SZENEN.md
├── 04_BILDER/
│   ├── PROMPTS.md
│   └── generated PNG files
├── 05_AUDIO/
│   └── voiceover.wav
├── 06_CODEX.md
└── 99_INTERN/
    ├── reel.json
    ├── subtitle-cues.json
    ├── animation-plan.md
    ├── asset-manifest.json
    ├── review-checklist.md
    ├── CODEX-BRIEF.generated.md
    └── codex-package-report.json
```

Do not create additional planning folders or duplicate scene documents unless the user explicitly asks for them.

## Authority order

1. `99_INTERN/reel.json` — format, duration, scene order and frame ranges
2. `02_VOICEOVER.md` — approved narration
3. `03_SZENEN.md` — all scene content, visuals, choreography and transitions
4. `99_INTERN/animation-plan.md` — technical motion rules
5. `04_BILDER/PROMPTS.md` — design intent for supplied images
6. `99_INTERN/subtitle-cues.json` — approximate or final word timings
7. `99_INTERN/asset-manifest.json` — exact required asset paths
8. `06_CODEX.md` — implementation task
9. `99_INTERN/review-checklist.md` — actual verification only

Do not silently resolve contradictions. Report implementation-blocking conflicts.

## Before coding

Run:

```bash
npm run codex:reel:prepare -- <slug> --ready
```

Stop when required images or audio are missing. Never generate placeholders or use unrelated repository assets.

After validation, use this as the compact technical context:

```text
ki/reels/<slug>/99_INTERN/CODEX-BRIEF.generated.md
```

## Assembly behavior

- implement exactly the declared eight scenes and frame ranges
- preserve the approved voiceover
- use the supplied images and audio
- use `staticFile()` and centralized asset helpers
- animate image regions through masks, overlays, local focus or meaningful state changes
- never use only a generic image zoom
- render every spoken word but emphasize only important words
- keep `soundMode: "off"` unless explicitly changed later
- do not modify `main`

## Completion

A reel is not complete until current-source typecheck, focused tests, checkpoint renders, current MP4, technical artifact validation and manual visual review have genuinely passed. Old renders do not count after source changes.
