---
description: Story-first decision framework for KI-channel YouTube LONGFORM_V1. Chooses the strongest visual medium per beat without a fixed animation whitelist and prevents placeholder, repetitive-card and fake-evidence production.
---

# Open-Ended Motion Production — Longform

Use this workflow for `ki/youtube-longform/**` together with `longform-full-cycle.md`.

## Core rule

`OPEN_ENDED_STORY_DRIVEN` means the story chooses the technique. Do not start from a preferred effect, library or template and force the script into it.

For every spoken beat, first answer:

1. What must the viewer understand, feel, compare or verify here?
2. Is the beat explanatory, evidentiary, contextual, transitional or payoff?
3. Which visual medium communicates that job most directly?
4. Does the chosen medium add information, or only decoration?

## Visual-medium decision order

Choose from the following according to the beat. This is a decision framework, not a whitelist.

### 1. Official source / proof

Use when the spoken claim depends on a real company statement, benchmark, system card, product UI, document or public source.

Preferred treatment:

- exact local screenshot/figure/crop from the cited source;
- readable framing and zoom;
- highlight only the relevant phrase/number;
- source label and context where useful;
- subtle camera/focus motion, not distracting effects.

Never recreate or generate a fake webpage/dashboard and present it as proof.

### 2. Real B-roll / real image

Use when real-world context itself adds value: workplace, server room, devices, infrastructure, people using computers, physical technology or environments.

Rules:

- footage must semantically match the narration;
- generic stock footage must never imply the depicted person/company is actually using the named product;
- prefer short purposeful clips over filler;
- combine with callouts, crop, masks, depth or explanatory overlays when that improves comprehension.

### 3. Native UI / diagram / chart / typography

Use when the concept is abstract, relational or process-driven and real footage would add little information.

Examples:

- permission flows;
- agent/tool chains;
- before/after comparisons;
- benchmark comparisons;
- architecture diagrams;
- timelines;
- risk/control relationships;
- process maps;
- concise kinetic typography.

Use Recharts, RoughJS, SVG/paths, React/CSS, Canvas or custom procedural components as appropriate.

### 4. Spatial / 3D / Skia / advanced motion

Use only when spatial structure, depth, hierarchy, transformation or a physical metaphor materially improves understanding.

Available approaches include Three.js/R3F, Skia, Canvas, particles, masks, shaders/effect-like systems, camera moves, parallax, Rive, Lottie, GSAP and future compatible techniques.

Do not use advanced motion merely to prove the stack can do it.

### 5. Generated non-evidentiary visual

Allowed only as an illustration/metaphor when the asset is explicitly non-evidentiary and `provesRealWorldClaim=false`.

It may never impersonate:

- a real product UI;
- a company webpage;
- a benchmark result;
- a real event photo;
- a real source document.

## Beat planning

After final voice alignment, create beat boundaries from actual spoken meaning, not equal chapter lengths.

Each beat should record at least:

- spoken phrase / timing;
- narrative job;
- primary visual medium;
- source/asset IDs when external media is used;
- motion purpose;
- transition/reframe intent;
- expected final visual state.

Do not allocate fixed values such as `1000 frames per chapter`.

## Longform rhythm

Longform is not a 60-second Reel stretched wider.

- Cold open: high clarity and visual progression immediately.
- Explanation: state evolves as the idea evolves.
- Proof: slower, readable and deliberate.
- Real B-roll: short, purposeful rhythm change.
- Counterpoint/risk: change visual grammar when useful.
- Chapter transition: meaningful reframe/world shift, not only a title card.
- Payoff: simplify and give the conclusion room.

Hard quality expectations:

- no practically unchanged primary state for 15+ seconds;
- any intentional 8+ second static state requires a clear reason and visual review;
- avoid more than two consecutive major beats with materially identical composition grammar when the story supports variation;
- a text replacement inside the same card does not automatically count as a new visual state.

## Motion-purpose test

Every significant animation should do at least one of:

- explain;
- focus attention;
- compare;
- reveal evidence;
- show cause/effect;
- establish spatial/temporal context;
- transition between visual worlds;
- create a deliberate payoff.

If it does none of these, remove it.

## Asset rules

Before an external image/video enters TSX:

`DISCOVERED -> MATERIALIZED_PENDING_REVIEW -> APPROVED`

Only the exact `APPROVED` local file/SHA from `MEDIA-PLAN.json` may be used by the production composition.

Missing required media is a blocker. Never substitute:

- `Visual`;
- `B-Roll here`;
- `Image here`;
- generic empty cards;
- fabricated source UI.

## Implementation handoff

`ki-longform-remotion-engineer` is the single write-capable visual implementation agent for the active Longform working tree.

Before writing TSX it must read:

- this workflow;
- actual alignment/timing data;
- `VISUAL-STORY-PLAN.md`;
- `MEDIA-PLAN.json`;
- `CLAIMS.json`;
- `CHAPTERS.json`.

After implementation, source validity is not a visual PASS. Run the canonical render-readiness gate, canonical master render, master QA, contact-sheet review and complete 1x review.
