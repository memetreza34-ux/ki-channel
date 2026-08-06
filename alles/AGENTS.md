# Codex operating instructions

## Mission

Build premium German vertical AI reels with deterministic Remotion animation, single-sentence active-word captions and semantic heading icons. The final voiceover is the only production clock.

## V4 requirements

- `ki-animation-only-reel-v4`
- 1080 × 1920 at 30 FPS
- 125 to 145 words, 8 to 9 scenes
- show only the current sentence
- show the complete sentence immediately
- highlight only the active spoken word in violet
- no progress line, large caption box, bounce or word reveal
- caption bottom 300 to 350 px
- every heading has a semantic animated SVG icon
- one large primary object and one dominant cause-effect motion per scene
- primary visual roughly 68 to 82 percent of available animation area
- maximum two strong simultaneous motions and three semantic beats
- no repeated stage frame, mini-dashboard, tiny washed-out cards, music, SFX or generated scene images

## Required workflow

1. Animation Director defines meaning → object → motion → result.
2. Icon Designer defines heading → icon → trigger → micro-motion.
3. Build Remotion preview with placeholder timings only.
4. Generate final voiceover at 1.00x and real word transcript.
5. Generate `timeline/final-sync.json`.
6. Validate with `validate-reel-v4.mjs --final`.
7. Run typecheck and focused tests.
8. Render smoke frames and inspect every heading icon and primary visual.
9. Render current checkpoints, contact sheet, cover and MP4.
10. Watch full MP4 normally and at phone size.
11. Never report a check as passed unless it actually ran on the current commit.

Never modify `main`, merge or mark a PR ready without explicit approval.
