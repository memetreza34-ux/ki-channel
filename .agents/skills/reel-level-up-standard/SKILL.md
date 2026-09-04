---
name: reel-level-up-standard
description: Raises KI-channel reels from polished template explainers to authored documentary/social stories by enforcing cover-first hooks, strong brand recognition, real proof/media, word-locked timing, scene/world variety, overlap discipline, motion diversity, brand-color fidelity and open-ended story-driven animation.
---

# Reel Level-Up Standard

Use this skill for every new 60–75 s KI reel after the base storytelling contract is satisfied.

- 2026-09-01 through 2026-09-02 remain compatible with Level-Up v2.
- Reels publishing from 2026-09-03 use **Level-Up v3**.
- Reels publishing from **2026-09-05 use Level-Up v4** and additionally load `brand-motion-fidelity` plus `BRAND-MOTION-PLAN.json`.

The goal is not more effects. The goal is stronger authored identity, recognizable brands/products, real proof, more varied visual worlds, coherent color systems and tighter semantic timing.

## 1. Cover-first opening

The first second must contain a finished cover candidate.

Target:

- candidate between frame 0 and 30 at 30 fps;
- candidate + clean hold stays inside frame 0–30;
- at least 12 stable frames;
- large short headline;
- one obvious main subject/product/brand signal;
- no caption covering the candidate;
- no tiny detail required to understand it;
- branded story: brand must already be recognizable.

Do not make the first second only a half-built entrance animation.

## 2. Brand recognition is a story requirement

For a central named brand/product, the viewer should recognize what the story is about even if they briefly ignore the captions.

Preferred order:

1. local provenance-backed official logo/wordmark when permitted;
2. local real product/UI crop;
3. official source/docs crop with strong brand identity;
4. clear typographic brand lockup.

Never use a generic icon as if it were the real logo. Never invent an approximate logo when the official mark cannot be used.

For branded/current-news v3/v4 reels:

- plan at least two recognizable brand moments;
- normally place them in at least two distinct scenes;
- at least one should use an official logo/wordmark, real product UI, or another genuine brand/product asset;
- if only typography is safe/available, document `assetExceptionReason`.

For v4, if an exact official logo/wordmark/UI image already exists locally under `02-bilder/`, prefer the `LOCAL_OFFICIAL_MEDIA` path so it is validated, copied locally to render assets and SHA-bound instead of remaining only a plan.

## 3. Real proof + real media

For branded/current-news stories, normally plan at least three purposeful real/official moments across at least two scenes:

- one brand/product identity moment;
- one real official proof crop/document;
- one immersive real/product moment such as real UI, real image or short real video.

If three moments are not useful or rights-safe, document the exception. Do not add filler stock just to hit a quota.

If real motion itself is the claim, prefer real product video/B-roll. If unavailable, document `videoExceptionReason`.

All selected media must be local before render and retain provenance. Remote render media remains forbidden.

## 4. Word-locked semantic timing

After forced alignment, major visual and SFX payoffs should anchor to the exact spoken word/phrase whenever practical.

Examples:

- brand spoken → logo/wordmark/product moment lands;
- date spoken → date impact lands;
- model/tool spoken → matching UI/object appears;
- route/API term spoken → route activates.

Sentence-progress timing is fallback only.

## 5. Visual-beat density

For a normal 60–75 s Level-Up v3/v4 reel, target at least **20 concrete visual beats**.

A beat must create a meaningful new state, reframe, object, proof, route, media moment or focus shift. Text changing inside the same card is not automatically a new beat.

During active voiceover, target meaningful development about every 1.5–3.0 seconds. A practically unchanged main state above about 4 seconds is a review risk.

## 6. Visual-world variety

Level-Up v3/v4 reels should contain at least **four distinguishable visual worlds/grammars** where the topic permits it.

Examples:

- cover/brand lockup;
- real product UI;
- spatial diagram/environment;
- real proof/source world;
- real image/video;
- developer/code world;
- timeline/data world;
- physical metaphor;
- payoff world.

Plan at least **two mid-reel reframes/world breaks** so the middle does not feel visually flat even when it contains many small animations.

## 7. Motion grammar diversity

Use several meaningful motion families where relevant. Do not allow more than two consecutive major beats to use the same card + spring + slide grammar.

For v4, motion selection is **open-ended**. The current shared library is a toolbox, not a whitelist. New custom/procedural techniques may be created whenever they materially improve story clarity or impact and can pass determinism/performance/readability QA.

Possible techniques include but are not limited to spatial paths, object collisions, kinetic typography, camera/depth moves, timelines, routing/gates, real-source highlighting, 3D, Skia, SVG/path morphs, Lottie, Rive, particles, masks, UI simulation, maps, custom procedural scenes and future compatible techniques.

## 8. Brand-color fidelity — v4

`BRAND-MOTION-PLAN.json` defines a brand/reference palette before implementation.

- use official/reference colors where applicable;
- use neutral colors for readability;
- semantic colors for warnings, data, heatmaps, maps, success/failure and accessibility are allowed;
- intentional scene deviations need a story reason;
- accidental wrong-brand color substitutions are a review failure.

The goal is coherence, not forcing every scene to look monochrome.

## 9. Functional icons — v4

Functional icons are encouraged for API, cloud, security, database, map, weather, timeline, warning, route, input/output, cache and similar concepts.

They must remain visibly separate from brand identity and may never impersonate the company/product logo.

## 10. Overlap discipline

Every moment needs one obvious primary focus.

Default target:

- max 1 primary message/object;
- max 2 supporting details;
- progressive detail reveals instead of simultaneous clutter;
- captions never cover critical visuals;
- headline, logo, proof, dates and caption do not all compete in the same region.

Prefer: statement → visual reaction → proof → detail.

## 11. Use the full vertical stage

Treat 1080×1920 as one continuous stage from chapter/headline down to the raised caption-safe zone. Avoid unexplained empty middle zones and let important objects become large.

## 12. Microdetails

Important dates, states, route counters and source names should normally be at least 22–26 px and progressively revealed rather than dumped as fine print.

## 13. SFX follow semantic action

Increase SFX density only when visual event density increased. Useful triggers include connector completion, object landing, break, lock, route activation, proof focus and payoff. Voice stays dominant.

## 14. Capability evolution — v4

Before a major reel, inspect available skills/agents/MCPs/packages/local tools. Add a new capability when it materially improves quality or removes a repeated bottleneck.

Do not add redundant novelty tools. Prefer official/free/local-first when practical, pin compatibility-sensitive versions, and add a checker/workflow when integration is non-trivial.

## 15. Real-render review

Never infer PASS from source code.

All Level-Up reels review the existing cover, brand, proof, timing, density, overlap, motion, readability and SFX gates.

Level-Up v3 additionally requires:

- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION`
- `PRIMARY_BRAND_REAPPEARS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS`
- `VISUAL_WORLD_VARIETY`
- `MID_REEL_REFRAMES`

Level-Up v4 additionally requires:

- `BRAND_ASSET_VISIBLE_OR_JUSTIFIED`
- `BRAND_COLOR_COHERENCE`
- `FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS`
- `MOTION_NOT_TEMPLATE_LOCKED`
- `ANIMATION_TECHNIQUE_FITS_STORY`
- `NO_ACCIDENTAL_COLOR_DRIFT`
- `REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED`

A source implementation is only implemented. The exact mastered MP4 decides PASS.
