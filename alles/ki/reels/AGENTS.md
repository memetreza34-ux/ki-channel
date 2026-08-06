# Codex instructions for internal reel templates

This directory contains internal planning templates and must follow the permanent reel brain.

Before creating or changing a new reel template, read:

1. `../reel-brain/PRODUCTION-BRAIN.md`
2. `../reel-brain/FUTURE-REEL-STANDARD.md`
3. `../reel-brain/brain.json`

## New reel defaults

Every newly created reel template must use:

- 1080 × 1920 at 30 FPS
- 60 to 70 seconds
- 125 to 145 spoken words
- 8 to 9 scenes
- normally 6 to 8 seconds per scene
- 100 percent Remotion animation inside the reel
- no generated scene images
- no stock scene images
- one separate static cover image with one short German sentence
- source and playback at 1.00x
- at most 1.05x only after explicit approval based on a listening check
- voiceover only; no music or sound effects
- one dominant explanatory motion per scene
- at most two strong simultaneous motions
- at most four semantic beats per scene
- at least one second of readable result hold

## Required planning information

A future template must include:

- direct hook
- final voiceover
- scene order and scene purpose
- semantic beat map for every scene
- exact cover sentence and cover motif
- deterministic Remotion implementation contract
- final transcript synchronization contract
- sentence-based subtitle rules
- checkpoints and review gates
- Codex execution task

Each semantic beat uses:

```text
important expression -> visual reaction -> transcript trigger -> result state
```

Important meaning may not exist only in the voiceover. Filler words receive caption timing only.

## Captions

- Use normal sentence-based subtitles.
- Do not use rapid two-to-four-word chunks.
- Maximum two lines.
- Default about 50 px and never below 40 px.
- White with dark outline or strong shadow.
- No large subtitle box.
- Show only already spoken words.
- Do not bounce the whole sentence.
- Use real transcript timing before final approval.

## Prohibited legacy defaults

Do not copy these historical values into a new reel:

- 30 to 40 second target duration
- 1.10x default playback
- required generated scene images
- hybrid image scenes as the normal strategy
- maximum three strong simultaneous motions
- captions based only on estimated local frame positions

Historical reel packages may remain unchanged for reproducibility.

## Completion

A new reel is not complete until current-source typecheck, focused tests, real transcript alignment, current checkpoint renders, contact-sheet review, current cover, current MP4, technical artifact validation and normal-speed phone-size visual review have genuinely passed.
