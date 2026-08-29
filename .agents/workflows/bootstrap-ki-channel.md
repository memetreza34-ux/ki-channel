---
description: Bootstrap and verify all KI-channel Antigravity customizations, skills, hooks and focused MCP servers before a production session.
---

# /bootstrap-ki-channel

1. Read `REPO-STATE.md` and `GEMINI.md`.
2. Confirm Node 20, npm, Git and FFmpeg are available.
3. Install workspace dependencies if needed with:
   `npm install --package-lock=false --no-audit --no-fund`
4. Sync official Remotion Agent Skills:
   `npm run antigravity:skills`
5. Enumerate the repository's current Antigravity capability surface:
   `node scripts/list-antigravity-capabilities.mjs`
   Treat this inventory as the session capability map: use **every capability that materially helps the current task**, but do not invoke unrelated tools merely because they exist.
6. Run:
   `npm run antigravity:verify`
7. Inspect loaded Antigravity customizations:
   - workspace agents from `.agents/agents.md`;
   - every relevant skill returned by the capability scanner;
   - workflows from `.agents/workflows/`;
   - plugin `ki-channel-production` and its orchestrator skill/rules;
   - hooks via `/hooks` when using the Antigravity TUI;
   - MCP servers via `/mcp` or the MCP Servers panel.
8. Verify focused MCP availability:
   - `chrome-devtools`: start Antigravity's browser first so port 9222 is available;
   - `remotion-bits`: verify `find_remotion_bits` and `fetch_remotion_bit` are exposed;
   - `github`: if Docker is installed, complete the official browser OAuth flow on first start.
9. Route the current task through the available capabilities:
   - source/story work → `remotion-storytelling` + matching official Remotion skills;
   - missing reusable motion pattern → `remotion-bits-discovery` + Remotion Bits MCP;
   - actual browser/Remotion Studio QA → Chrome DevTools MCP;
   - remote PR/branch/issue context → GitHub MCP;
   - multi-domain work → roles from `.agents/agents.md`.
10. If GitHub MCP is unavailable because Docker is missing, do not block reel production. Use local Git and report GitHub MCP unavailable.
11. Do not enable unrelated database/payment/cloud MCPs for this repo unless the actual task requires them.
12. Return a capability table with `READY`, `UNAVAILABLE`, or `NOT CHECKED` for Agents, Skills, Workflows, Plugin, Hooks, Chrome DevTools MCP, Remotion Bits MCP and GitHub MCP, plus a short list titled `SELECTED FOR THIS TASK`.
