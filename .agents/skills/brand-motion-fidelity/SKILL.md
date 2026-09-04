---
name: brand-motion-fidelity
description: Enforces real brand identity, official/local brand assets, coherent brand-aware color systems, correct functional-icon usage, open-ended story-driven animation choices and continuous capability evolution for Level-Up v4 reels.
---

# Brand Motion Fidelity

Use this skill for new KI-channel reels publishing from 2026-09-05 onward.

## Goal

The reel must feel authored for the specific brand/topic instead of like a reusable template with swapped text.

## 1. Brand identity must be visible

For a named company/product/model, prefer in this order:

1. provenance-backed official logo or wordmark;
2. real official product UI / official screenshot;
3. official source/document crop with recognizable identity;
4. clean typographic brand lockup.

Never use a generic functional icon as a brand logo. Never approximate/redraw a logo if the exact mark is not safely available.

A branded reel should normally show the primary brand in the cover and again later in a materially different context.

## 2. Local official-media path

If an official logo/wordmark/UI image is available locally, register it as `LOCAL_OFFICIAL_MEDIA` in `visual-assets.json`.

Required fields:

- `sourceFile` under the reel's `02-bilder/` folder;
- official `sourceUrl`;
- `sourceKind` such as `PRESS_KIT`, `OFFICIAL_WEBSITE`, `OFFICIAL_PRODUCT_UI` or `USER_PROVIDED_OFFICIAL_EXPORT`;
- `assetRole` such as `LOGO`, `WORDMARK`, `PRODUCT_UI`, `SCREENSHOT` or `PRODUCT_IMAGE`;
- `rightsStatus: OFFICIAL_SOURCE_REFERENCE`;
- meaningful `usageReviewNote`.

Resolution copies the already-local file into `public/reel-assets/<compositionId>/`, computes SHA256 and keeps a manual rights/trademark review flag. It never downloads the official asset automatically.

## 3. Brand-aware color system

Before implementation, define a palette in `BRAND-MOTION-PLAN.json`.

At minimum:

- official/reference source for the palette;
- primary brand colors;
- supporting/neutral colors;
- semantic exception colors for warnings, success, data heatmaps, maps or accessibility;
- scene palette notes where the visual world intentionally departs from the brand palette.

Do not force every pixel into brand colors. The rule is coherence, not monochrome branding.

Fail the review when a scene looks accidentally off-brand, when two brand colors are confused, or when a functional state color is used as though it were a brand color.

## 4. Functional icons are encouraged

Use icons for functions and concepts such as:

- API / code;
- security / lock / shield;
- cloud / database;
- weather / satellite / rain / snow;
- timeline / clock;
- map / location;
- input / output / cache;
- travel / agriculture / energy;
- warning / success / route / search.

Functional icons must remain visually separate from brand identity.

## 5. Animation has no fixed technique ceiling

Animation policy is `OPEN_ENDED_STORY_DRIVEN`.

There is no fixed whitelist of allowed animation types. Any technique may be used when it improves the story and survives readability, determinism, performance and visual-QA gates.

Possible techniques include, but are not limited to:

- 2D transforms / kinetic typography;
- SVG/path morphs;
- procedural diagrams;
- camera moves / depth / parallax;
- Three.js / 3D;
- Skia effects;
- Lottie / Rive;
- masks / reveals / wipes / liquid or particle systems;
- maps / network routing / timelines;
- simulated UI interactions;
- real-image / real-video compositing;
- motion blur / glow / scan / depth-of-field-like treatment;
- physical metaphors / collisions / gates / orbit / split worlds;
- custom shaders or newly added techniques when compatible with the stack.

Do not reject an animation merely because it is not already present in the shared library. Build or research a new technique when it materially improves the beat.

## 6. No effect spam

Open-ended motion does not mean every technique should appear in every reel.

Select motion by semantic purpose:

- explain;
- focus;
- compare;
- prove;
- transition;
- create payoff;
- establish place/system/scale.

If an effect adds no meaning, remove it.

## 7. Capability evolution

Before a major reel, inspect current repository capabilities. If a new skill, agent, MCP, Remotion package, browser capability or local tool would materially improve quality or remove a repeated bottleneck, research it and integrate it safely.

Rules:

- new capability must add a real ability, not duplicate an existing weaker/stronger tool;
- prefer official/free/local-first when practical;
- optional capabilities must not become release dependencies without proof;
- pin versions when compatibility matters;
- add a checker/workflow when integration is non-trivial;
- do not install random tools just to increase the tool count.

## 8. Required v4 review questions

The exact mastered MP4 should answer PASS/FAIL for:

- `BRAND_ASSET_VISIBLE_OR_JUSTIFIED`
- `BRAND_COLOR_COHERENCE`
- `FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS`
- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION`
- `MOTION_NOT_TEMPLATE_LOCKED`
- `ANIMATION_TECHNIQUE_FITS_STORY`
- `NO_ACCIDENTAL_COLOR_DRIFT`
- `REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED`

Source code alone cannot prove these.