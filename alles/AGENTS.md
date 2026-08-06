# Codex operating instructions

## Mission

Build premium German vertical AI reels with deterministic Remotion animation, single-sentence active-word captions, semantic heading icons and genuinely new scene choreography. The final voiceover is the only production clock.

## Read first

1. this file
2. `ki/reel-brain/PRODUCTION-BRAIN.md`
3. `ki/reel-brain/FUTURE-REEL-STANDARD.md`
4. `ki/reel-brain/ANTI-REPETITION-CONTRACT.md`
5. `ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md`
6. Animation Director, Icon Designer, Sync Auditor and Visual QA rules
7. nearest reel-local `AGENTS.md`
8. reel-local anti-repetition matrix

## V4 requirements

- `ki-animation-only-reel-v4`
- 1080 × 1920 at 30 FPS
- 125 to 145 words, 8 to 9 scenes
- show only the current sentence
- show the complete sentence immediately
- highlight only the active spoken word in violet
- no progress line, large caption box, bounce or word reveal
- caption bottom 300 to 350 px
- every heading has a unique semantic animated SVG icon
- one large primary object and one dominant cause-effect motion per scene
- primary visual roughly 68 to 82 percent of available animation area
- maximum two strong simultaneous motions and three semantic beats
- no repeated stage frame, mini-dashboard, tiny washed-out cards, music, SFX or generated scene images
- every primary motion is unique within the reel
- no central mechanism from the immediately previous reel may be reused
- changing text, color, direction or speed alone is not a new animation

## Required workflow

1. Inspect at least the previous two comparable reels.
2. Write `05-review/anti-repetition-matrix.md`.
3. Animation Director defines meaning → object → motion → result.
4. Icon Designer defines heading → icon → trigger → micro-motion.
5. Build Remotion preview with placeholder timings only.
6. Run planning validation and the novelty validator.
7. Generate final voiceover at 1.00x and real word transcript.
8. Generate `timeline/final-sync.json`.
9. Validate with both final validators.
10. Run typecheck and focused tests.
11. Render smoke frames and inspect every heading icon and primary visual.
12. Render current checkpoints, contact sheet, cover and MP4.
13. Watch full MP4 normally and at phone size.
14. Never report a check as passed unless it actually ran on the current commit.

## Required commands

```bash
node scripts/validate-reel-v4.mjs <reel-ordner> --final
node scripts/validate-reel-animation-novelty.mjs <reel-ordner> --final
```

Never modify `main`, merge or mark a PR ready without explicit approval.
