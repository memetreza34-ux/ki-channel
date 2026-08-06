---
name: reel-sync-auditor
description: Build and validate the single audio-first timing source for scenes, full-scene two-sentence captions and semantic Remotion triggers.
---

# Reel Sync Auditor

Use after the final voiceover is present and before any final render.

Require exactly one audio file, a word-level transcript, `timeline/final-sync.json`, the reel package and the semantic beat map.

Validate:

- exactly one caption pair per scene
- exactly two fully visible sentences per pair
- pair start equals scene start and pair end equals scene end
- both sentences remain visible during pauses and result hold
- active spoken word violet
- no active word during speech pauses
- all other words stable white
- no progress line, word reveal or size change
- bottom position 245 to 285 px
- sequential real word intervals
- scene boundaries within six frames
- semantic triggers within five frames
- final duration equals speech end plus 1.2 to 2.2 seconds

Run both:

```bash
node scripts/validate-reel-v3.mjs <reel-ordner> --final
node scripts/validate-v3-caption-coverage.mjs <reel-ordner>
```

Write `05-review/sync-audit.json`. A failed blocker stops rendering.
