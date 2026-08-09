# Agent instructions for `ki/reels/`

## Structure is a hard contract

Every production reel package MUST live at:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
```

Every reel package MUST permanently contain:

```text
README.md
01-script-audio/
02-bilder/
03-caption/
04-pdf/
05-export/
06-projektdateien/
```

This mirrors the durable production convention used by FinanzNeo. Do not flatten, rename, relocate, or delete these six production areas.

## Never create these layouts

```text
ki/<reel-name>/
ki/reels/<reel-name>/
ki/src/reels/<planning-package>/
```

`ki/src/reels/<slug>/` is source-code-only. It may contain TS/TSX, contracts, helpers and tests after implementation begins, but never `reel.json`, voiceover, scene plans, captions, asset manifests or review documents.

## Creating a reel

Do not invent a path manually. Run:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

The generator creates the correct Monday–Sunday folder, next `NN_` index and all six permanent directories.

## Mandatory validation

Before changing reel package structure and again before finishing the task, run:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

If it fails, fix the folder structure before content, tests, renders or release work continues. Never weaken or bypass this validator to make a task green.

## File ownership by production area

- `01-script-audio/`: script, voiceover text/audio, transcript, audio plan
- `02-bilder/`: image prompts, images, layers, masks, asset manifest
- `03-caption/`: subtitle cues/timestamps and social caption
- `04-pdf/`: optional PDF source/final artifacts
- `05-export/`: smoke frames and final export artifacts
- `06-projektdateien/`: brief, `reel.json`, scene/motion/animation plans, implementation task and review checklist

## Production package authority

When present:

- `06-projektdateien/reel.json` controls format, duration, composition ID, scene order and frame ranges.
- `01-script-audio/voiceover.md` or the declared script controls narration wording.
- `06-projektdateien/scene-plan.md` controls explanation and visual hierarchy.
- `06-projektdateien/animation-plan.md` or remotion plan controls choreography.
- `03-caption/subtitle-cues.json` controls subtitle timing until final transcript timestamps replace it.
- `02-bilder/asset-manifest.json` controls exact asset requirements.
- `06-projektdateien/CODEX_ASSEMBLY_TASK.md`/equivalent controls implementation scope.
- `06-projektdateien/review-checklist.md` records only actually completed verification.

Do not silently resolve contradictions by moving files to an easier location.

## Assembly

Executable Remotion implementation belongs separately at:

```text
ki/src/reels/<slug>/
├── index.ts
├── contract.ts
├── ReelComposition.tsx
├── components/
├── scenes/
└── __tests__/
```

The production package stays in `ki/reels/<week>/<NN_reel>/`; implementation never replaces or relocates it.

## Completion

A reel is not complete until structure validation, focused tests, typecheck, smoke frames, technical artifact checks and manual visual review have actually succeeded. Old renders are invalid after relevant source changes.
