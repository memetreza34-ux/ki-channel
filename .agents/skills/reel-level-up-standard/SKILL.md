---
name: reel-level-up-standard
description: Raises KI-channel reels from polished template explainers to authored documentary/social stories by enforcing cover-first hooks, strong brand recognition, real proof/media, word-locked timing, scene/world variety, overlap discipline, motion diversity and readable mobile layouts.
---

# Reel Level-Up Standard

Use this skill for every new 60–75 s KI reel after the base storytelling contract is satisfied.

- 2026-09-01 through 2026-09-02 remain compatible with Level-Up v2.
- Reels publishing from 2026-09-03 use **Level-Up v3**.

The goal is not more effects. The goal is stronger authored identity, recognizable brands/products, real proof, more varied visual worlds and tighter semantic timing.

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

Never:

- use a generic icon as if it were the real logo;
- invent an approximate logo when the official mark cannot be used;
- mention the brand only in voice while the visuals stay generic.

For branded/current-news v3 reels:

- plan at least two recognizable brand moments;
- normally place them in at least two distinct scenes;
- at least one should use an official logo/wordmark, real product UI, or another genuine brand/product asset;
- if only typography is safe/available, document `assetExceptionReason`.

## 3. Real proof + real media v3

For branded/current-news v3 stories, normally plan at least three purposeful real/official moments across at least two scenes:

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

For a normal 60–75 s Level-Up v3 reel, target at least **20 concrete visual beats**.

A beat must create a meaningful new state, reframe, object, proof, route, media moment or focus shift. Text changing inside the same card is not automatically a new beat.

During active voiceover, target meaningful development about every 1.5–3.0 seconds. A practically unchanged main state above about 4 seconds is a review risk.

## 6. Visual-world variety

Level-Up v3 reels should contain at least **four distinguishable visual worlds/grammars** where the topic permits it.

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

Do not count the same white-card layout with different text as a different world.

Plan at least **two mid-reel reframes/world breaks** so the middle does not feel visually flat even when it contains many small animations.

## 7. Motion grammar diversity

Use at least five meaningful motion families where relevant:

- spatial path/connector;
- object transform/collision/physical reaction;
- kinetic number/date/text impact;
- camera push/reframe/depth;
- timeline/progress/playhead;
- routing/branching/gate state;
- real-source crop/highlight;
- 3D/Skia/Lottie/Rive hero;
- real media insert;
- full-frame environmental/diagram scene.

Do not allow more than two consecutive major beats to use the same card + spring + slide grammar.

## 8. Overlap discipline

Every moment needs one obvious primary focus.

Default target:

- max 1 primary message/object;
- max 2 supporting details;
- progressive detail reveals instead of simultaneous clutter;
- captions never cover critical visuals;
- headline, logo, proof, dates and caption do not all compete in the same region.

Prefer: statement → visual reaction → proof → detail.

## 9. Use the full vertical stage

Treat 1080×1920 as one continuous stage from chapter/headline down to the raised caption-safe zone. Avoid unexplained empty middle zones and let important objects become large.

## 10. Microdetails

Important dates, states, route counters and source names should normally be at least 22–26 px and progressively revealed rather than dumped as fine print.

## 11. SFX follow semantic action

Increase SFX density only when visual event density increased. Useful triggers include connector completion, object landing, break, lock, route activation, proof focus and payoff. Voice stays dominant.

## 12. Real-render review

Never infer PASS from source code.

All Level-Up reels review:

- `COVER_FRAME_READY`
- `COVER_FRAME_CLEAN`
- `BRAND_FIDELITY`
- `REAL_PROOF_MOMENT`
- `REAL_MEDIA_MIX`
- `NO_FAKE_BRAND_ICON`
- `WORD_LOCKED_MAJOR_REVEALS`
- `SCENE_DENSITY`
- `NO_VISUAL_OVERLAP`
- `MOTION_GRAMMAR_DIVERSITY`
- `NO_CARD_DECK_FEEL`
- `FULL_VERTICAL_STAGE_USE`
- `MICRODETAILS_PHONE_READABLE`
- `SFX_SEMANTIC_DENSITY`
- `VOICE_PRIORITY_OVER_SFX`

Level-Up v3 additionally requires:

- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION`
- `PRIMARY_BRAND_REAPPEARS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS`
- `VISUAL_WORLD_VARIETY`
- `MID_REEL_REFRAMES`

A source implementation is only implemented. The exact mastered MP4 decides PASS.
