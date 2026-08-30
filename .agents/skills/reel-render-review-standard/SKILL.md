---
name: reel-render-review-standard
description: Applies the KI-channel post-render visual quality standard learned from the 2026-08-30 OpenAI-Cursor render review: raised readable captions, full vertical-stage use, voice-synchronized reveals, varied motion grammar, meaningful microdetails and balanced semantic SFX.
---

# Reel Render Review Standard

Use this skill when building a new reel after a prior render review, when reviewing a real MP4, or when a reel feels too empty, repetitive, early-timed or weak on impact.

## 1. Captions

Default portrait target:

- bottom around **330 px**;
- horizontal inset around **76 px**;
- max width around **928 px**;
- default text around **40 px** with strong contrast;
- max 2 visible lines;
- target max **6 words per displayed group**.

Do not shrink a whole long sentence to make it fit. Chunk long preview cues. Final captions still come from forced-aligned user audio.

## 2. Use the full vertical stage

The composition is not only the top half of 1080×1920.

Use the continuous visual stage from the chapter/headline region down to the raised caption-safe zone. Avoid large empty middle/lower areas unless silence/emptiness has deliberate story meaning.

Spread supporting details vertically: timeline, route, state, proof, date, source and consequence can occupy different levels rather than clustering every card around y=400–800.

## 3. Voice-synchronized reveals

The final user voice is the timing authority.

- Phase-1 ratios are fallback only.
- After alignment, prefer semantic anchors from caption/word timing.
- `sentenceId + progress` is an acceptable robust anchor when exact word mapping is not needed.
- Numbers, dates, names, route labels and key states should land when the phrase is spoken, not substantially before it.
- A few frames of anticipation are allowed; the information payoff must be synchronized.

For sentence-synchronized SFX events, run:

```bash
node ki/scripts/sync-reel-sfx-to-captions.mjs <reel-package-dir>
```

after final forced alignment and before `resolve-reel-sfx.mjs`.

## 4. Motion variety

Do not repeat the same card + spring + direction as the default grammar.

Select from meaningful motion types:

- connector/path draw;
- cable split/fracture;
- object collision/bounce;
- timeline/playhead motion;
- date/number impact;
- scan/focus sweep;
- gate/lock state change;
- route branching;
- progress/access pulse;
- camera push/reframe;
- source proof reveal;
- selective transition/cut flash.

The reel should feel coherent, but consecutive beats should not look like the same component with different text.

## 5. Microdetails

Add small details when they clarify the story:

- exact dates;
- `PROPOSED`, `FINAL`, `PENDING`, `CONTINUE` states;
- API/model/tool roles;
- route counters (`1/3`, `2/3`, `3/3`);
- source + date metadata;
- ownership/contract state;
- function labels.

Microdetails should make the frame feel authored, not crowded.

## 6. SFX density

More SFX are useful only when there are more visible semantic events.

- every sound requires a visible trigger;
- keep voice clearly dominant;
- use different role families for different event types;
- do not add a sound under every text entrance;
- for an energetic 60–75 s reel, roughly one meaningful effect every 4–7 s can be a useful review heuristic, never a quota;
- remove redundant effects during the final 1x listen.

## 7. Required real-render review

Never infer PASS from source code.

On the exact mastered MP4 check:

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

A source rework is only **implemented** until a new render proves these states.
