# Codex operating instructions

## Mission

Produce premium German vertical AI reels with deterministic Remotion animation. The real voiceover is the only final clock. Work as a production engineer together with the Animation Director, Sync Auditor and Visual QA Agent.

## Read first

1. this file
2. `ki/reel-brain/PRODUCTION-BRAIN.md`
3. `ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
5. `ki/reel-brain/REEL-ANIMATION-DIRECTOR.md`
6. `ki/reel-brain/REEL-VISUAL-QA-AGENT.md`
7. `.agents/skills/reel-animation-director/SKILL.md`
8. `.agents/skills/reel-sync-auditor/SKILL.md`
9. `.agents/skills/reel-visual-qa/SKILL.md`
10. nearest reel-local `AGENTS.md`

## Git safety

- never modify `main`
- work only on the named branch
- do not merge or mark a PR ready without explicit approval
- preserve unrelated files
- report final branch and commit SHA

## Truthfulness

Never claim transcript alignment, tests, typecheck, renders, phone review or visual approval unless they actually ran on the current commit.

## New reel standard

New reels use `ki-animation-only-reel-v3`:

- 1080 × 1920, 30 FPS
- 125 to 145 words
- 8 to 9 scenes
- exactly two short caption sentences per scene
- both sentences fully visible immediately
- active spoken word violet from real word timings
- no progress line, word reveal, bounce or size change
- caption bottom 245 to 285 px
- one large primary object per scene
- one dominant explanatory motion
- maximum two strong simultaneous motions
- maximum three semantic beats
- primary visual roughly 60 to 78 percent of the animation area
- no generated scene images, music or SFX

## Final synchronization

After final audio:

1. normalize audio
2. generate real word timestamps
3. create `timeline/final-sync.json`
4. create one caption pair per scene with exactly two sentences and word timings
5. derive scene boundaries from pauses
6. align semantic triggers within five frames
7. derive final duration from speech end plus 1.2 to 2.2 seconds
8. ensure production code uses only final sync data
9. regenerate checkpoints after every code or sync change

## Choreography review

Before implementation, the Animation Director must define per scene:

```text
spoken meaning → primary object → dominant motion → stable result
```

Reject mini-dashboards, repetitive card slides, weak contrast, small visuals and topic-only decoration.

## Required execution

1. planning validation with `validate-reel-v3.mjs`
2. final audio transcript and sync generation
3. final v3 validation
4. typecheck and focused tests
5. smoke frames
6. Animation Director review
7. all checkpoints and contact sheet
8. full MP4 at normal speed and phone size
9. Visual QA Agent report
10. technical artifact validation
11. user approval

## Release blockers

- missing or placeholder final sync
- fewer or more than two caption sentences
- wrong active word
- progress line present
- trigger offset above five frames
- scene boundary offset above six frames
- outro hold outside 1.2 to 2.2 seconds
- repeated weak card choreography
- tiny or washed-out primary visual
- stale render after changes
