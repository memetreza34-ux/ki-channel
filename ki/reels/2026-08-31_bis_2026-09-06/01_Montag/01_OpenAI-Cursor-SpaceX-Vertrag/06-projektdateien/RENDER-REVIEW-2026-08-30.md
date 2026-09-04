# Render Review — 2026-08-30

Reviewed artifact: `KI-OpenAICursorSpaceXContract.mp4`

- Resolution: 1080×1920
- FPS: 30
- Duration: 62.059 s
- SHA256: `b1f46fff9e29c09dd9259c208a828773cb715be5bf3dfd63d7c4e044d46c037b`
- Audio in this reviewed file: about -20.8 LUFS integrated, peak about -4.2 dBFS. This is not treated as final social-master evidence.

## User review — blockers

1. Captions are too low.
2. Captions are too small.
3. Too much unused vertical space between headline/visual content and captions.
4. Several visual events arrive before the corresponding spoken phrase.
5. The animation grammar feels too repetitive / card-like.
6. Too few memorable wow moments.
7. SFX density is too low, but should increase only for visible semantic events.
8. More small explanatory details are wanted: dates, states, functions, route numbers, source/status metadata.

## Rework contract

- Shared caption zone raised to bottom 330 px with 40 px default text, max width 928 px and 6-word grouping target.
- Reel visual stage expanded from headline down to the raised caption safe zone.
- Major animation starts are derived from caption `sentenceId + progress`, not only static scene ratios.
- Long preview captions are chunked so they remain readable before final word-level alignment.
- `story-beats.json` expanded to 35 beats with sentence-progress sync metadata and varied motion grammar.
- SFX expanded to 14 planned semantic events. They must be re-synced after forced alignment using `ki/scripts/sync-reel-sfx-to-captions.mjs` before CC0 resolution.
- New visual grammar includes cable draw/fracture, moving timeline playhead, scan beam, Astra packet collision/bounce, routing spine, indexed access routes, multi-gate pipeline and access pulse.
- Microdetails include `28 AUG 2026`, `12 NOV 2026`, PROPOSED/FINAL state, CONTINUE state, route 1/3–3/3, ownership/contract metadata and source proof cards.

## Required next render review

Do not mark PASS until a new exact render confirms:

- `CAPTIONS_HIGH_ENOUGH: PASS`
- `CAPTIONS_READABLE_AT_PHONE_SIZE: PASS`
- `VERTICAL_STAGE_UTILIZATION: PASS`
- `VOICE_TO_ANIMATION_SYNC: PASS`
- `MOTION_VARIETY: PASS`
- `WOW_MOMENTS_NOT_EFFECT_SPAM: PASS`
- `MICRODETAILS_HELP_COMPREHENSION: PASS`
- `SFX_DENSITY_BALANCED: PASS`
- `VOICE_PRIORITY_OVER_SFX: PASS`
- `NO_MAJOR_VISUAL_BEAT_EARLY: PASS`

Current status: **REWORK IMPLEMENTED IN SOURCE — NEW RENDER REQUIRED**.
