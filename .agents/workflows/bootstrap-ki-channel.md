---
description: Bootstrap and verify the full relevant KI-channel Antigravity capability stack before a production session.
---

# /bootstrap-ki-channel

1. Read `REPO-STATE.md`, `GEMINI.md`, `.agents/agents.md` and `.agents/ANTIGRAVITY-LOCAL-SETUP.md`.
2. Confirm the current Git branch. Continue the active branch named by `REPO-STATE.md` or the user; do not silently switch to `main`.
3. Confirm Node 20, npm, Git, FFmpeg and ffprobe are available.
4. Install workspace dependencies if needed with:
   `npm install --package-lock=false --no-audit --no-fund`
5. Sync official Remotion Agent Skills:
   `npm run antigravity:skills`
   If network/package sync is unavailable, report it honestly and continue with already versioned repo skills where possible.
6. Enumerate the repository capability surface:
   `npm run antigravity:capabilities`
   Treat this inventory as the session capability map: use **every capability that materially helps the current task**, but do not invoke unrelated tools merely because they exist.
7. Run:
   `npm run antigravity:verify`
8. Inspect actual Antigravity customizations:
   - `/agents`: verify the real custom agents under `.agents/agents/<name>/agent.md` are discoverable;
   - every relevant skill returned by the capability scanner;
   - workflows from `.agents/workflows/`;
   - plugin `ki-channel-production` and its orchestrator skill/rules;
   - `/hooks`: verify session-context, safety-gate, post-edit and stop-guard hooks;
   - `/mcp` or MCP Servers panel: inspect focused MCP status;
   - `/tasks`: confirm no stale background command from an earlier run is still active.
9. Verify focused MCP availability:
   - `chrome-devtools`: use for Remotion Studio/browser QA when its browser endpoint is reachable;
   - `remotion-bits`: verify motion search/fetch tools are exposed;
   - `github`: if Docker is installed, complete the official browser OAuth flow on first start.
10. Confirm platform-native capabilities where available:
    - built-in `research`, `browser` and `self` subagents;
    - parallel/background subagents;
    - terminal sandbox;
    - headless `agy` CLI for structured audits;
    - browser screenshots/recordings/artifacts.
11. Optional capabilities:
    - `Modern Web Guidance` from `Settings > Customizations > Build with Google Plugins` for current React/Web guidance;
    - `/teamwork-preview` only for genuinely large multi-workstream system changes and only if available on the current Antigravity plan.
12. Route the current task:
    - fresh remote ChatGPT/Codex changes → `/sync-chatgpt-handoff`;
    - uncertain reel quality → `/parallel-audit-ki-reel <path>`;
    - maximum-quality reel pass → `/maximize-ki-reel <path>`;
    - source/story work → `ki-remotion-story-engineer` + `remotion-storytelling` + matching official Remotion skills;
    - missing reusable motion pattern → `ki-motion-researcher` / `remotion-bits-discovery` + Remotion Bits MCP;
    - actual browser/Studio QA → `/visual-qa-ki-reel <path>` + Browser/Chrome DevTools;
    - Phase 3 user-audio sync → `ki-audio-sync-engineer`;
    - strict independent final verification → `ki-release-verifier` / `/verify-ki-reel`;
    - dependency/version question → `ki-dependency-auditor` / `/audit-remotion-upgrade`.
13. If GitHub MCP is unavailable because Docker/OAuth is missing, do not block reel production. Use local Git and report GitHub MCP unavailable.
14. Do not enable unrelated database/payment/cloud/mobile MCPs for this repo unless the actual task requires them.
15. Return a capability table with `READY`, `UNAVAILABLE`, `OPTIONAL`, or `NOT CHECKED` for:
    - Custom Agents
    - Skills
    - Workflows
    - Plugin
    - Hooks
    - Built-in Research/Browser/Self
    - Chrome DevTools MCP
    - Remotion Bits MCP
    - GitHub MCP
    - Headless AGY Audit
    - Terminal Sandbox
    - Modern Web Guidance
    - Teamwork

End with a short list titled `SELECTED FOR THIS TASK`.
