# Codex instructions for `ki/`

## Scope

These instructions apply to all files below `ki/` and extend the repository-level `AGENTS.md`.

## Architecture map

- `ki/reels/`: approved reel production packages, grouped by week and fixed production folders
- `ki/src/reels/`: reel-specific **executable Remotion source only**
- `ki/src/motion-system/`: shared deterministic motion infrastructure
- `ki/src/animation-library/`: reusable visual families, planners, prototypes and micro-motion grammar
- `ki/animation-library/`: documentation and production rules
- `ki/brand/`, `ki/bausteine/`, `ki/gehirn/`, `ki/agents/`, `ki/public/`: persistent channel infrastructure, never reel project folders

## Repository structure lock

The canonical planning/package location for every real reel is permanently:

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

Never create a reel project directly under `ki/`. Never create a flat production reel directly under `ki/reels/`. Never place a planning package under `ki/src/reels/`.

New reel packages MUST be created with:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Before and after any reel-structure change MUST run:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

Do not remove, rename or flatten the six numbered production folders. Do not weaken the structure validator.

## Planning versus executable source

Planning/package files stay permanently under the weekly reel package. Examples:

- script/voiceover/audio -> `01-script-audio/`
- images/prompts/assets -> `02-bilder/`
- captions/subtitle cues -> `03-caption/`
- PDFs -> `04-pdf/`
- renders/exports -> `05-export/`
- brief, reel manifest, scene plan, animation plan, implementation task and review -> `06-projektdateien/`

Executable reel code is separate and only created when implementation starts:

```text
ki/src/reels/<slug>/
├── index.ts
├── contract.ts
├── ReelComposition.tsx
├── assets.ts
├── style.ts
├── components/
├── scenes/
└── __tests__/
```

`ki/src/reels/<slug>/` must not contain `reel.json`, `voiceover.md`, `scene-plan.md`, `animation-plan.md`, `subtitle-cues.json`, `asset-manifest.json`, `CODEX_ASSEMBLY_TASK.md`, `review-checklist.md` or research briefs.

## Implementation choice

For a real reel, prefer this order:

1. reel-specific composition matching its approved plan
2. reusable low-level primitives from the motion system
3. an animation-library mechanism adapted to the sentence
4. a new reel-specific mechanism when none is semantically suitable

Never replace an approved reel-specific scene with a generic preview stage merely because it is faster.

## Visual standard

- white or near-white editorial background
- dark, high-contrast typography
- violet primary accent
- simplified premium 3D/editorial imagery when assets are supplied
- no childish, neon-futuristic, photorealistic, or overloaded default styling
- no more than 1–3 short labels inside the main visual
- long text, subtitles, arrows, charts and measurements belong in Remotion

## Image treatment

When using a flat image, animate only transformations the asset can honestly support: crop/reveal, masked focus, declared depth layers, narration-tied camera movement, light/color emphasis, overlays, connectors, charts, counters and labels. Do not fake independent object motion when no separate layer or mask exists.

## Subtitles

- Every spoken word must be represented.
- Use final audio timestamps when available; otherwise explicit manual cue frames.
- Show only already-spoken words in the active subtitle window.
- Keep the window compact, normally 7–10 words.
- Strongly animate only semantic keywords.

## Testing

At minimum add focused tests for composition dimensions/FPS/duration, continuous scene ranges, unique scene/animation IDs, subtitle bounds, required assets, final scene ownership and animation/layout uniqueness.

Structure validation is a prerequisite, not an optional lint step. Do not mark visual review complete from tests alone.
