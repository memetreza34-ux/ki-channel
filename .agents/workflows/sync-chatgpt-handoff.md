---
description: Synchronize the active KI-channel Git branch after ChatGPT/Codex phase-1 repository changes and continue locally in Antigravity without rebuilding or reverting the approved work.
---

# /sync-chatgpt-handoff

Use this whenever ChatGPT/Codex has just changed the remote KI-channel branch and Antigravity is about to continue locally.

## 1. Protect local work first

1. Run `git status --short --branch`.
2. If there are unexpected local tracked changes, do not pull over them. Report them and preserve them.
3. Never discard user/local media such as `voiceover.mp3`, images or rendered artifacts merely because they are gitignored.

## 2. Synchronize the intended branch

1. Read `REPO-STATE.md` if already available locally.
2. Confirm the active stabilization/task branch named by the user/repository.
3. Run `git fetch --all --prune`.
4. Check local branch vs `origin/<active-branch>`.
5. If safe, use a fast-forward pull. Do not silently checkout `main`.
6. Show the latest remote commit summary and changed files relevant to the current task.

## 3. Re-read authority after pull

Read again:

- `REPO-STATE.md`;
- `GEMINI.md`;
- target reel `PHASE-STATUS.md`;
- target `reel.json`;
- script / `SCENE-VOICE-MAP.json` / `story-beats.json`;
- current Remotion source.

Treat the newly pulled branch state as the Phase-1 implementation to continue from. Do not reconstruct it from old chat memory.

## 4. Validate the handoff

Run:

```bash
npm run antigravity:capabilities
npm run antigravity:verify
npm run ki:reel:structure-check
```

For a storytelling reel also run its storytelling gate.

## 5. Audio boundary

Gitignored/local user media is intentionally not expected to come from GitHub.

If `01-script-audio/voiceover.mp3` or `.wav` is absent locally, report:

`PHASE 2 — WARTET AUF NUTZER-AUDIO`

Do not search Downloads/Desktop, remote TTS providers or preview URLs unless the user explicitly asks you to locate a file they created. Never generate/download replacement production speech.

## 6. Continue

After a valid handoff:

- use `/maximize-ki-reel <path>` for maximum-quality continuation;
- use `/finish-ki-reel <path>` when Phase 1 is approved and user audio exists;
- use `/verify-ki-reel <path>` for strict verification only.
