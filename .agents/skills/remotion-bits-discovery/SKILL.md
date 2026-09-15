---
name: remotion-bits-discovery
description: Discover and inspect reusable Remotion animation components through the Remotion Bits MCP/CLI when a KI-channel reel needs a motion pattern that is not already covered by the shared StoryMotion system.
---

# Remotion Bits Discovery

Use this skill only when the existing shared components under `ki/src/reels/StoryMotion.tsx`, `StoryMediaLayers.tsx`, `ReelVisualMotion.tsx` and the official Remotion skills do not already solve the visual need cleanly.

## Preferred tool path

If the `remotion-bits` MCP server is available, use:

- `find_remotion_bits` to search by visual goal;
- `fetch_remotion_bit` to inspect the selected source before adopting it.

Fallback CLI:

```bash
npx -y remotion-bits find "<visual goal>"
npx -y remotion-bits fetch <bit-id> --json
```

## Rules

- Search by **visual purpose**, not vague style words. Examples: `camera presentation`, `animated counter`, `3d cards`, `word reveal`, `particle payoff`.
- Do not import a bit just because it looks flashy.
- Inspect source, dependencies, determinism and mobile readability before adopting it.
- Prefer copying/adapting a small deterministic pattern into the repo over adding a new permanent runtime dependency when that keeps the production path simpler.
- Any adopted bit must obey local media, rights, caption-safe, 30-fps determinism, Story Beat and 1x-review rules.
- No `Math.random()` in deterministic render source.
- No remote media introduced by a fetched bit.
- Do not let a fetched animation override approved spoken meaning or scene order.
- If a bit duplicates an existing shared component, use the existing shared component instead.

## Good use cases

- a genuinely new text entrance;
- a reusable counter/impact-number variant;
- a structured 3D camera motif;
- a particle or gradient payoff that has semantic purpose;
- a transition pattern not already covered by the shared stack.

## Bad use cases

- adding random movement to an otherwise static scene;
- replacing clear native UI with decorative animation;
- stacking multiple third-party effects in one beat;
- using remote assets or unknown runtime dependencies merely for novelty.
