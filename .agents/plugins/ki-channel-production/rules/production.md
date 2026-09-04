# KI-Channel Production Rule

For every KI-channel task:

- Read `REPO-STATE.md` and `GEMINI.md` first.
- Use `.agents/agents.md` to delegate mentally or through Antigravity subagents when the task spans story engineering, audio sync, browser QA and release verification.
- Load the matching workspace skills from `.agents/skills/`; for storytelling-enabled reels, `remotion-storytelling` is mandatory.
- Use `/finish-ki-reel` for Phase 3 completion and `/verify-ki-reel` for strict verification when those workflows match the request.
- Prefer Chrome DevTools MCP for real browser/Remotion-Studio inspection and GitHub MCP for remote PR/repository context when available.
- Never replace missing user production audio with TTS, downloaded audio or a preview.
- Never bypass a validator, provenance lock, rights check, social-audio master or final 1x review to get green output.
- Do not add irrelevant MCP servers or plugins merely because they exist. Keep enabled tools focused on this repository to reduce tool-selection noise.
- Keep all render-time media local. No remote Lottie, Rive, image, audio or video URL is allowed in production render source.
- Never claim a check, render or visual review passed unless it actually executed successfully.
