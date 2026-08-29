---
description: Finish an existing KI-channel reel from user-provided audio through sync, render, mastered review and export without rebuilding Phase 1.
---

# /finish-ki-reel <reel-package-dir>

Use the existing reel package and source. Never rebuild the reel from zero.

1. Read `REPO-STATE.md`, `GEMINI.md`, `ki/reels/AGENTS.md`, `ki/src/reels/AGENTS.md` and the reel's `06-projektdateien/PHASE-STATUS.md` + `reel.json`.
2. Load all relevant skills, especially `remotion-storytelling`; use content-grounding or reel-specific skills only when applicable.
3. Run `npm run antigravity:verify` if available.
4. Confirm the current working branch matches the task. Do not silently switch to `main` when `REPO-STATE.md` names an active stabilization branch.
5. Locate the exact user-created `01-script-audio/voiceover.mp3` or `.wav`. If missing, stop with `PHASE 2 — WARTET AUF NUTZER-AUDIO`.
6. Run the canonical local alignment path and regenerate only derived timing files that Phase 3 is allowed to update.
7. Validate script/duration, forced alignment, scene/voice mapping, captions, story beats, SFX and visual contracts.
8. Adjust visual-beat timing to the real voice. Preserve wording and scene meaning. No random effect additions.
9. Use Chrome DevTools MCP / Antigravity Browser when available to inspect Remotion Studio or local preview, console errors, layout, responsive/mobile readability and visual smoke frames.
10. Run `npm run repo:verify` and `npm run motion:verify`.
11. Commit tracked timing/source/contract changes before production render so provenance can lock a clean tree.
12. Run the reel's canonical prep command and then the render-locked production path.
13. Produce raw Remotion render, then the social audio master. Validate A/V and loudness.
14. Watch and listen to the exact mastered MP4 at 1x. Check caption sync, story flow, visual reactions, transition purpose, camera motion, SFX, voice priority, proof visuals and static-state violations.
15. Fill `MOTION-READABILITY-REVIEW.md` only from the exact reviewed MP4 and bind its SHA256 + duration.
16. Run finalizer and export-package gate.
17. Report exact commands run, failures fixed, render path, SHA256, review status and whether any retiming was used.

Never claim `FINAL VIDEO READY` until every required real gate and 1x review passed.
