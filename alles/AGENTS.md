# Codex operating instructions

## Mission

This repository produces premium German vertical AI explainer reels with deterministic Remotion animation. Work as a production engineer. Approved content defines the meaning; the real final voiceover defines every final timestamp.

## Instruction order

1. Read this file.
2. Read `ki/reel-brain/PRODUCTION-BRAIN.md`.
3. Read `ki/reel-brain/FUTURE-REEL-STANDARD.md`.
4. Read `ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`.
5. Read `ki/reel-brain/brain.json`.
6. Read the nearest nested `AGENTS.md` and the named reel package.

## Git safety

- Never modify `main`.
- Work only on the named branch.
- Do not create, merge, close or mark a pull request ready unless explicitly requested.
- Do not rewrite unrelated files.
- Report the final branch and commit SHA.

## Truthfulness

- Never claim transcript alignment, tests, typecheck, screenshots, renders, audio checks or visual review succeeded unless they actually ran.
- Estimated timing is not final synchronization.
- A valid MP4 container is not a visually approved reel.
- Never hide failures with disabled tests, fake reports, `any` or weakened validators.

## Standard for every newly created reel

New reels use `standardId: ki-animation-only-reel-v2`:

- 1080 × 1920 at 30 FPS
- approximately 58 to 70 seconds
- 125 to 145 words
- 8 to 9 scenes
- 100 percent Remotion animation
- no generated scene images
- one static cover with one sentence
- voiceover and playback at 1.00x
- no music or sound effects
- final duration derived from real speech end
- one primary object, one dominant motion and one stable result per scene
- one to three semantic beats per scene
- full-sentence captions shown instantly
- one violet progress line synchronized to the real sentence duration
- caption bottom position between 210 and 235 px

Historical `ki-animation-only-reel-v1` projects may remain unchanged but are not templates for future work.

## Audio-first finalization

Before final audio, scene frames are placeholders only. After final audio arrives, Codex must:

1. normalize the audio
2. generate real word and sentence timestamps
3. detect speech start, speech end and meaningful pauses
4. create `timeline/final-sync.json`
5. derive final scene boundaries from sentence or meaning pauses
6. derive final composition duration from speech end plus 1.2 to 2.2 seconds
7. replace every estimated caption, scene and animation timestamp
8. ensure production code uses only `final-sync.json`
9. regenerate checkpoints from the final scene boundaries

Never place audio into a fixed 60- or 65-second timeline and call it synchronized.

## Synchronization tolerances

- semantic animation trigger: maximum ±5 frames from the spoken phrase
- scene boundary: maximum ±6 frames from the intended sentence or meaning pause
- first caption: visible no later than 3 frames after speech starts
- outro hold: 1.2 to 2.2 seconds after the last spoken word
- no active fallback timing in a final render

## Choreography

Each scene must be understandable as:

```text
one primary object
→ one spoken meaning phrase
→ one dominant explanatory motion
→ one stable result
```

Rules:

- maximum two strong simultaneous motions
- maximum three semantic beats per scene
- maximum two small supporting elements
- no rapid effect chains
- no decorative constant motion
- no scene-number badge or kicker repeated on every scene
- no mini-dashboard as the main explanation
- no emoji as the main explanation
- no tiny labels, thin-line diagrams or clusters of small cards carrying the key message
- primary visual should use roughly 55 to 72 percent of the animation area
- prefer one recurring visual object across scenes when the topic supports it
- important motion begins on or immediately after the matching spoken phrase

## Captions

Final captions must:

- show the complete current sentence or meaning unit immediately
- remain visually stable for the full cue
- use maximum two lines
- use 46 to 52 px and never below 42 px
- sit 210 to 235 px above the bottom edge
- use white text with a dark outline or strong shadow
- not use a large background box
- not reveal words one by one
- not highlight individual words
- not bounce, scale or move the sentence

The only moving caption element is a single 6-to-10-pixel violet line beneath the text. It progresses from 0 to 100 percent using the real sentence start and end times.

Forbidden final-caption implementations include `visibleCount`, word-by-word reveal, karaoke highlighting and estimated local frames.

## Remotion rules

- Use deterministic frame-based helpers only.
- No `Math.random()`, timers, CSS transitions, network calls or render-time downloads.
- Every composition must seek correctly to any frame.
- Hard cuts are the default.
- Production components import or receive final sync data.
- Fallback timing may exist for previews only and must be impossible to use in the final build.

## Required execution sequence

1. Validate branch and working tree.
2. Read global and reel-local contracts.
3. Check script and semantic plan.
4. Confirm simple Remotion prebuild exists.
5. Validate final audio.
6. Transcribe words and sentences.
7. Create and validate `timeline/final-sync.json`.
8. Switch production code from placeholders to final sync data.
9. Run synchronization validation.
10. Run typecheck and focused tests.
11. Render smoke frames from the final timeline.
12. Inspect full size and phone size.
13. Fix timing and visual simplicity at the source.
14. Render all current checkpoints, cover and MP4.
15. Inspect contact sheet.
16. Watch the complete MP4 at normal speed and phone size.
17. Run technical artifact validation.
18. Update only genuinely completed review items.

## Release blockers

Do not approve when any of these are present:

- missing or invalid `final-sync.json`
- fallback timing active in production
- scene timing fixed independently of the real voiceover
- more than 2.2 seconds of silence after speech end
- semantic trigger offset above 5 frames
- scene boundary offset above 6 frames
- word-by-word subtitle reveal
- captions below the allowed safe zone
- more than three meaning beats in one scene
- multiple small cards replacing one clear main visual
- important motion before the spoken phrase
- unclear, decorative or topic-only animation
- incomplete final frame
- unreadable phone-size text
- stale checkpoints after a code or sync change

## Final report

Report:

1. branch and commit SHA
2. final audio duration, speech start and speech end
3. final composition duration and outro hold
4. largest trigger and scene-boundary offsets
5. final caption mode and bottom position
6. active timing source
7. files changed
8. commands run and exact results
9. rendered artifact paths
10. visual problems found and fixes applied
11. remaining known issues
12. confirmation that `main` was not modified
