---
name: ki-reel-orchestrator
description: Orchestrate an existing KI-channel reel across Phase 3 using the repository's story, audio, browser-QA, GitHub and release-verification capabilities without replacing user audio or rebuilding approved Phase 1.
---

# KI Reel Orchestrator

## Before doing anything

Read:

1. `REPO-STATE.md`
2. `GEMINI.md`
3. `.agents/agents.md`
4. the target reel's `PHASE-STATUS.md`
5. the target reel's `reel.json`

Then load all relevant skills from `.agents/skills/`.

For storytelling-enabled reels, always load `remotion-storytelling`. Use official Remotion skills that match the task after they have been synced through `scripts/sync-remotion-agent-skills.mjs`.

## Capability routing

### Story / Remotion source

Use the **Remotion Story Engineer** role. Preserve approved content and use the shared StoryMotion/StoryMedia components before inventing one-off animation code.

### Browser / visual verification

Use **Chrome DevTools MCP** when available. Inspect the actual local Remotion Studio/preview, console and rendered states. Source inspection alone is not a visual PASS.

### GitHub remote state

Use **GitHub MCP** when available for PR, issue, branch and repository context. Local git/source remains authoritative for working-tree changes; do not create competing edits through multiple write paths at once.

### Audio

Phase 2 belongs to the user. If the production `voiceover.mp3`/`.wav` is absent, stop. Never synthesize, fetch or replace it.

### Release

Use the **Release Verifier** role. All canonical gates, provenance, social mastering and exact 1x review must pass before final-ready claims.

## Preferred workflows

- `/finish-ki-reel <path>` — end-to-end Phase 3 completion.
- `/verify-ki-reel <path>` — strict verification without content rewriting.

## Failure policy

- Fix the first real failing layer, then rerun it.
- Never weaken validators to make output green.
- Never mark a command `PASS` because its source looks correct.
- If an MCP server is unavailable, continue with the repo's local tools when possible and report that MCP as unavailable rather than blocking unrelated work.
