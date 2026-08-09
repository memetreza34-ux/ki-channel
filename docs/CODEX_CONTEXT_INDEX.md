# Codex context index

Use this file to locate the minimum context needed for a task. Do not load every file listed here automatically.

## Real reel assembly

Read in order:

1. `/AGENTS.md`
2. `/ki/AGENTS.md`
3. `/ki/reels/AGENTS.md`
4. `/docs/CODEX_REEL_WORKFLOW.md`
5. the named weekly reel package under `/ki/reels/<week>/<NN_Reel-Titel>/`
6. when generated, `/ki/reels/<week>/<NN_Reel-Titel>/06-projektdateien/CODEX-BRIEF.generated.md`

Implement executable code separately under:

```text
ki/src/reels/<reel-slug>/
```

The reel slug comes from `06-projektdateien/reel.json`; it is not assumed to be identical to the human-readable weekly folder name.

## Package preparation

Use the canonical weekly package reference:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht
```

Strict asset readiness validation:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht \
  --ready
```

Validation without regenerating the brief:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht \
  --validate-only
```

Outputs:

```text
ki/reels/<week>/<NN_Reel-Titel>/06-projektdateien/CODEX-BRIEF.generated.md
ki/reels/<week>/<NN_Reel-Titel>/06-projektdateien/codex-package-report.json
```

The helper first runs the repository reel-structure validator. It must never be used to bypass the weekly 01–06 package contract.

## Shared motion infrastructure

- `ki/src/motion-system/`: deterministic shared primitives and production APIs
- `ki/src/animation-library/`: visual-family catalog, planners, prototypes and micro-motion grammar
- `ki/animation-library/`: animation-system documentation and production rules
- `core/brand-kit/`: shared visual primitives and UI components exposed as `@studio/core`

Read only the specific registry, primitive or prototype referenced by the reel plan.

## Current real production package

Planning:

```text
ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/
```

Executable source target:

```text
ki/src/reels/antigravity-context-overload/
```

Existing reference implementation source:

```text
ki/src/reels/why-ai-reads-differently/
```

Reference source is for architecture and review discipline, not a scene-for-scene template.

## Quality principles

- supplied planning is authoritative
- supplied assets are mandatory when declared required
- no generic image zoom as the only image treatment
- one dominant explanatory motion per sentence
- maximum three strong motions at once
- every spoken word subtitled
- only important words strongly animated
- voiceover first, SFX off by default
- hard cuts unless semantic continuation is real
- no fake or ungrounded measurements
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
