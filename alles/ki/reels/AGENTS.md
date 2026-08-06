# Codex instructions for internal reel templates

This directory contains internal templates for new KI reels.

Before changing a template, read:

1. `../reel-brain/PRODUCTION-BRAIN.md`
2. `../reel-brain/FUTURE-REEL-STANDARD.md`
3. `../reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
4. `../reel-brain/brain.json`

## Mandatory v2 defaults

Every new template must use `ki-animation-only-reel-v2`:

- 1080 × 1920 at 30 FPS
- approximately 58 to 70 seconds
- 125 to 145 words
- 8 to 9 scenes
- 100 percent Remotion animation
- no generated or stock scene images
- one separate static cover with one German sentence
- voiceover and playback at 1.00x
- no music or sound effects
- final composition duration derived from speech end
- one primary object and one dominant motion per scene
- maximum two supporting elements
- maximum two strong simultaneous motions
- one to three semantic beats per scene
- at least one second of result hold

## Timing

All initial frames are placeholders. Every final reel must create and use:

```text
timeline/final-sync.json
```

It must define:

- real speech start and end
- final scene boundaries
- semantic trigger frames
- full-sentence caption cues
- violet progress-line timing
- final composition duration

No fixed 60- or 65-second timeline may survive after final audio is available.

## Captions

Templates must use `ki/src/components/StableSentenceCaption.tsx`.

- complete sentence or meaning unit appears instantly
- no word-by-word reveal
- no individual word highlight
- maximum two lines
- 46 to 52 px, minimum 42 px
- bottom position 210 to 235 px
- exactly one violet progress line
- only the line moves
- real sentence timestamps from `final-sync.json`

## Visual simplicity

- one large primary visual
- no mini-dashboard
- no cluster of small cards
- no persistent scene-number badge
- no repeated kicker on every scene
- no emoji as primary explanation
- maximum three meaning beats
- motion begins on or immediately after the spoken phrase

## Prohibited legacy defaults

Do not copy:

- v1 fixed scene durations
- 1.10x playback
- generated scene images
- word-by-word captions
- `visibleCount`
- estimated local caption frames in final builds
- long silence used to reach a planned duration

Historical packages may remain unchanged for reproducibility.

## Completion

A new reel is not complete until final audio, real transcript, valid `final-sync.json`, strict sync validation, current-source typecheck, focused tests, current renders, contact-sheet review, normal-speed phone-size MP4 review and user approval have genuinely passed.
