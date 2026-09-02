---
name: reel-render-review-standard
description: Applies the KI-channel post-render visual quality standard: raised readable captions, full vertical-stage use, voice-synchronized reveals, varied motion grammar, strong brand recognition, real media, meaningful microdetails and balanced semantic SFX.
---

# Reel Render Review Standard

Use this skill when building a new reel after a prior render review, reviewing a real MP4, or when a reel feels too empty, repetitive, early-timed, weak on brand identity or too template-like.

## 1. Captions

Default portrait target:

- bottom around **330 px**;
- horizontal inset around **76 px**;
- max width around **928 px**;
- default text around **40 px** with strong contrast;
- max 2 visible lines;
- target max **6 words per displayed group**.

Do not shrink a long sentence to make it fit. Chunk preview cues. Final captions still come from forced-aligned user audio.

## 2. Use the full vertical stage

Use the continuous stage from chapter/headline down to the raised caption-safe zone. Avoid unexplained empty middle/lower areas. Large hero objects, UI, proof, logos and diagrams may occupy real space instead of living inside small cards.

## 3. Voice-synchronized reveals

The final user voice is timing authority.

- Phase-1 ratios are fallback only.
- After alignment, prefer semantic anchors from word timing.
- Major brands, names, dates, numbers and state changes should land with the spoken phrase, not substantially before it.
- SFX should follow the same semantic event.

## 4. Brand recognition review

For a branded/product reel, ask:

- can the primary brand/product be recognized without relying on captions?
- is it recognizable in the opening/cover?
- does it reappear later instead of vanishing after the hook?
- is at least one moment based on a genuine official logo/wordmark/product UI, or is there a documented reason why only typography is safe?
- are functional icons clearly separate from brand identity?

Never approve a rough improvised logo recreation just because it resembles the brand. Official asset/UI or a clean typographic name is better than an inaccurate fake mark.

## 5. Real media review

A real-media mix should make the reel feel connected to the actual product/story, not just decorate it.

Check whether the mastered MP4 contains, when planned:

- a brand/product identity moment;
- a genuine official proof crop/document;
- real product UI, image or video rather than only self-made source cards.

If motion itself is the claim, check whether a real product video/B-roll moment would materially improve trust and comprehension. Do not add generic stock as a quota filler.

## 6. Scene and visual-world variety

Do not review only frame-to-frame movement. Review whether the reel changes **visual worlds**.

A 60–75 s v3 reel should normally have at least four clearly distinct worlds/grammars and at least two mid-reel reframes/world breaks.

Examples:

- brand cover;
- real UI;
- spatial diagram;
- source/proof world;
- real image/video;
- code/developer world;
- timeline/data world;
- physical metaphor;
- payoff world.

Changing the text inside the same white card does not count as a new world.

## 7. Motion variety

Do not repeat card + spring + slide as default grammar.

Use meaningful types such as connector/path draw, object reaction, timeline/playhead, date/number impact, scan/focus, gate/lock, route branching, camera reframe, source proof, full-frame diagram and selective real-media insert.

## 8. Microdetails

Use dates, status, route counters, product roles and source metadata when they clarify the story. Important microdetails should remain phone-readable and appear progressively.

## 9. SFX density

Every sound requires a visible semantic trigger. Voice remains dominant. Remove redundant effects during final 1x listen.

## 10. Required real-render review

Never infer PASS from source code.

Base render checks:

- `CAPTIONS_HIGH_ENOUGH`
- `CAPTIONS_READABLE_AT_PHONE_SIZE`
- `VERTICAL_STAGE_UTILIZATION`
- `VOICE_TO_ANIMATION_SYNC`
- `NO_MAJOR_VISUAL_BEAT_EARLY`
- `MOTION_VARIETY`
- `WOW_MOMENTS_NOT_EFFECT_SPAM`
- `MICRODETAILS_HELP_COMPREHENSION`
- `SFX_DENSITY_BALANCED`
- `VOICE_PRIORITY_OVER_SFX`

Level-Up v3 additionally checks:

- `BRAND_RECOGNIZABLE_WITHOUT_CAPTION`
- `PRIMARY_BRAND_REAPPEARS`
- `REAL_BRAND_ASSET_USED_OR_EXCEPTION`
- `REAL_MEDIA_NOT_JUST_SOURCE_CARDS`
- `VISUAL_WORLD_VARIETY`
- `MID_REEL_REFRAMES`

A source rework is only implemented until a new render proves these states.
