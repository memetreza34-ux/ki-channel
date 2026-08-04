# Codex instructions for `ki/`

## Scope

These instructions apply to all files below `ki/` and extend the repository-level `AGENTS.md`.

## Architecture map

- `ki/reels/`: approved reel production packages and asset contracts
- `ki/src/reels/`: reel-specific Remotion implementations
- `ki/src/motion-system/`: shared deterministic motion infrastructure
- `ki/src/animation-library/`: reusable visual families, planners, prototypes, and micro-motion grammar
- `ki/animation-library/`: documentation and production rules

## Implementation choice

For a real reel, prefer this order:

1. reel-specific composition matching its approved plan
2. reusable low-level primitives from the motion system
3. an animation-library mechanism adapted to the sentence
4. a new reel-specific mechanism when none is semantically suitable

Never replace an approved reel-specific scene with a generic preview stage merely because it is faster.

## Source organization

Create reel code under:

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

Use one scene component per major scene. Keep data and timing out of JSX when practical.

## Visual standard

- white or near-white editorial background
- dark, high-contrast typography
- violet primary accent
- simplified premium 3D/editorial imagery when assets are supplied
- no childish, neon-futuristic, photorealistic, or overloaded default styling
- no more than 1–3 short labels inside the main visual
- long text, subtitles, arrows, charts, and measurements belong in Remotion

## Image treatment

When using a flat image, animate only transformations the asset can honestly support:

- crop and reveal
- masked region focus
- depth through declared foreground/background layers
- subtle camera movement tied to narration
- light or color emphasis
- overlays, connectors, charts, counters, and labels

Do not fake independent object motion when no separate layer or mask exists.

## Subtitles

- Every spoken word must be represented.
- Use final audio timestamps when available.
- Otherwise use explicit manual cue frames from `subtitle-cues.json`.
- Show only already-spoken words in the active subtitle window.
- Keep the window compact, normally 7–10 words.
- Strongly animate only semantic keywords such as actions, transformations, quantities, comparisons, risks, negations, tools, sources, and results.

## Testing

At minimum add focused tests for:

- composition dimensions, FPS, and duration
- scene ranges are continuous and complete
- all scene IDs and full animation IDs are unique
- subtitle cues are sorted and within bounds
- all required assets resolve
- final frame belongs to the final scene
- no duplicate consecutive layout or motion signature

Do not mark visual review complete from tests alone.
