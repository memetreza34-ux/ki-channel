# Codex context index

Use this file to locate the minimum context needed for a task. Do not load every file listed here automatically.

## Real reel assembly

Read in order:

1. `/AGENTS.md`
2. `/ki/AGENTS.md`
3. `/ki/reels/AGENTS.md`
4. `/docs/CODEX_REEL_WORKFLOW.md`
5. `/ki/reels/<slug>/CODEX-BRIEF.generated.md`

Implement under:

```text
ki/src/reels/<slug>/
```

## Package preparation

```bash
node scripts/prepare-codex-reel.mjs <slug>
node scripts/prepare-codex-reel.mjs <slug> --ready
```

Outputs:

```text
ki/reels/<slug>/CODEX-BRIEF.generated.md
ki/reels/<slug>/codex-package-report.json
```

## Shared motion infrastructure

- `ki/src/motion-system/`: deterministic shared primitives and production APIs
- `ki/src/animation-library/`: visual-family catalog, planners, prototypes, micro-motion grammar
- `ki/animation-library/EVERYTHING-ANIMATED-SYSTEM.md`: overall animation philosophy
- `ki/animation-library/MICRO-MOTION-RUNTIME.md`: semantic word-level motion runtime

Read only the specific registry, primitive, or prototype referenced by the reel plan.

## Real reference reel

Planning:

```text
ki/reels/2026-08-04-warum-ki-text-anders-liest/
```

Code:

```text
ki/src/reels/why-ai-reads-differently/
```

This is a reference for architecture and review discipline, not a template to copy scene-for-scene.

## Quality principles

- supplied planning is authoritative
- supplied assets are mandatory when declared required
- no generic image zoom
- one dominant explanatory motion per sentence
- maximum three strong motions at once
- every spoken word subtitled
- only important words strongly animated
- voiceover first, SFX off by default
- hard cuts unless semantic continuation is real
- no success claims without actual current-source tests and renders

## Final status

Always distinguish:

```text
implemented
technically tested
rendered
visually reviewed
approved
```

These are separate states and must never be collapsed into one claim.
