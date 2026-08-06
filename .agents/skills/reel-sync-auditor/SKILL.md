---
name: reel-sync-auditor
description: Build and validate the single audio-first timing source for scenes, two-sentence captions and semantic Remotion triggers.
---

# Reel Sync Auditor

Use after the final voiceover is present and before any final render.

Require exactly one audio file, a word-level transcript, `timeline/final-sync.json`, the reel package and the semantic beat map.

Validate exactly two fully visible sentences per scene, active spoken word violet, all other words stable white, no progress line, no word reveal or size change, bottom position 245 to 285 px, sequential word intervals, scene boundaries within six frames, semantic triggers within five frames and final duration equal to speech end plus 1.2 to 2.2 seconds.

Write `05-review/sync-audit.json`. A failed blocker stops rendering.
