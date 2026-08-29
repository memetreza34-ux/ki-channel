---
name: ki-reel-orchestrator
description: Orchestrate an existing KI-channel reel across Phase 3 using every relevant repository capability for story, audio, browser-QA, reusable-motion discovery, GitHub and release verification without replacing user audio or rebuilding approved Phase 1.
---

# KI Reel Orchestrator

## Before doing anything

Read:

1. `REPO-STATE.md`
2. `GEMINI.md`
3. `.agents/agents.md`
4. the target reel's `PHASE-STATUS.md`
5. the target reel's `reel.json`

Then run:

`node scripts/list-antigravity-capabilities.mjs`

Use the resulting inventory as the current capability map. **Select every skill, workflow, plugin capability, hook-aware guard and MCP that materially improves this task.** Do not invoke unrelated capabilities merely to maximize tool count.

Then load all relevant skills from `.agents/skills/`.

For storytelling-enabled reels, always load `remotion-storytelling`. Use official Remotion skills that match the task after they have been synced through `scripts/sync-remotion-agent-skills.mjs`.

## Capability routing

### Story / Remotion source

Use the **Remotion Story Engineer** role. Preserve approved content and use the shared StoryMotion/StoryMedia components before inventing one-off animation code.

Also load all synced official Remotion skills that directly match the current work, for example markup, multimedia, captions, render, studio or upgrade guidance as applicable.

If a visual need is genuinely not covered by the shared stack, load `remotion-bits-discovery` and use the **Remotion Bits MCP** to search/fetch a small reusable pattern. Inspect it before adoption and keep local production rules authoritative.

### Browser / visual verification

Use **Chrome DevTools MCP** whenever real browser/Remotion Studio inspection can improve correctness. Inspect the actual local preview, console and rendered states. Source inspection alone is not a visual PASS.

### GitHub remote state

Use **GitHub MCP** when remote PR, issue, branch or repository state is relevant. Local git/source remains authoritative for working-tree changes; do not create competing edits through multiple write paths at once.

### Audio

Phase 2 belongs to the user. If the production `voiceover.mp3`/`.wav` is absent, stop. Never synthesize, fetch or replace it.

### Release

Use the **Release Verifier** role. All canonical gates, provenance, social mastering and exact 1x review must pass before final-ready claims.

## Preferred workflows

- `/bootstrap-ki-channel` — discover/verify the full Antigravity capability surface.
- `/finish-ki-reel <path>` — end-to-end Phase 3 completion.
- `/verify-ki-reel <path>` — strict verification without content rewriting.

## Failure policy

- Fix the first real failing layer, then rerun it.
- Never weaken validators to make output green.
- Never mark a command `PASS` because its source looks correct.
- If an MCP server is unavailable, continue with the repo's local tools when possible and report that MCP as unavailable rather than blocking unrelated work.
- Report which capabilities were selected for the task and which relevant capability was unavailable.
