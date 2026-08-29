---
name: ki-reel-orchestrator
description: Route KI-channel reel work through every relevant real Antigravity custom agent, repo skill, focused MCP, browser/visual QA capability and fail-closed release gate without replacing user audio or rebuilding approved Phase 1.
---

# KI Reel Orchestrator

## Before doing anything

Read:

1. `REPO-STATE.md`
2. `GEMINI.md`
3. `.agents/agents.md`
4. target reel `PHASE-STATUS.md`
5. target reel `reel.json`

Then run:

`npm run antigravity:capabilities`

Use the inventory as the current capability map. Select **every capability that materially improves the task**, not every capability merely to increase tool count.

For storytelling-enabled reels always load `remotion-storytelling`. Use synced official Remotion skills that directly match the work.

## Real agent routing

### Orchestration

Use `ki-production-orchestrator` for long multi-domain reel work.

### Fact/source verification

Use `ki-fact-researcher` read-only, especially for current prices, release dates, product changes and proof-source claims.

### Retention/story audit

Use `ki-retention-story-auditor` read-only before a major rewrite/visual pass. It checks hook, progression, proof, consequence, payoff, beat density and repeated visual grammar without silently changing approved text.

### Motion research

Use `ki-motion-researcher` read-only before inventing new one-off motion systems. If the shared stack is insufficient, load `remotion-bits-discovery` and use Remotion Bits MCP for small reusable candidates.

### Story implementation

Use `ki-remotion-story-engineer` as the only write-capable story/visual agent in the current working tree. Preserve approved content and shared StoryMotion/StoryMedia primitives.

### Audio

Use `ki-audio-sync-engineer` only after the complete user-created production `voiceover.mp3`/`.wav` exists.

If absent, stop with:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Never synthesize, remotely fetch or replace production speech.

### Visual QA

Use Chrome DevTools MCP / built-in Browser Agent for real Remotion Studio/browser evidence, then use `ki-visual-qa-auditor` independently. Source inspection alone is not visual PASS.

Story-beat stills and pixel-delta diagnostics are intermediate evidence:

- `npm run antigravity:story-stills -- <path> --scale=1`
- `node scripts/analyze-story-beat-visual-deltas.mjs <manifest.json>`

### Dependency compatibility

Use `ki-dependency-auditor` for Remotion/React/Skia/Three/Rive/Lottie version/API questions. Do not casually upgrade the active stabilization branch.

### Release

Use `ki-release-verifier` independently. All deterministic gates, provenance, social mastering and exact 1x review must have real evidence before final-ready claims.

## Focused MCP routing

- **Chrome DevTools MCP**: browser/Studio console, screenshots, layout and real visual states.
- **Remotion Bits MCP**: search/fetch reusable motion patterns only when needed.
- **GitHub MCP**: remote PR/issue/branch context; local Git remains working-tree authority.

If an MCP is unavailable, continue through local tools where possible and report the capability as unavailable.

## Preferred workflows

- `/sync-chatgpt-handoff` — after new remote ChatGPT/Codex branch changes.
- `/bootstrap-ki-channel` — discover/verify the capability surface.
- `/parallel-audit-ki-reel <path>` — parallel fact + retention + motion + dependency + existing-artifact audit.
- `/maximize-ki-reel <path>` — highest-quality end-to-end orchestration.
- `/visual-qa-ki-reel <path>` — evidence-based pixel/browser QA.
- `/finish-ki-reel <path>` — Phase 3 completion.
- `/verify-ki-reel <path>` — strict independent verification.
- `/audit-remotion-upgrade` — read-only upgrade assessment.

## Headless second-opinion audits

Use `npm run antigravity:audit -- <path> --mode=<facts|motion|dependencies|release>` when a machine-readable independent audit improves confidence. These runs use sandbox mode and must never use a permission bypass.

## Parallelism

Parallelize independent read-only research/audits. Maintain exactly one writer per working tree. Use isolated branches/worktrees for competing write-heavy experiments.

## Failure policy

- Fix the first real failing layer, then rerun it.
- Never weaken validators to make output green.
- Never mark a command, render, visual review or release `PASS` because its source looks correct.
- Collect background tasks/subagents before stopping.
- Report which capabilities were actually used, which were unavailable and what remains user-owned.
