# Antigravity Local Setup — KI-Channel

This file documents the local capabilities that cannot be activated merely by committing source files to GitHub.

## 1. Open the correct workspace/branch

Use the repository root as the Antigravity workspace and continue the active branch from `REPO-STATE.md`.

After ChatGPT/Codex changed the remote branch, use:

`/sync-chatgpt-handoff`

Never silently return to `main` while stabilization work is active.

## 2. Baseline runtime

Required for the current repository:

- Node 20 (`>=20 <21`)
- npm
- Git
- FFmpeg / ffprobe
- Chrome/Chromium for browser QA
- Docker only if the GitHub MCP is used through the configured container

Then:

```bash
npm install --package-lock=false --no-audit --no-fund
npm run antigravity:skills
npm run antigravity:capabilities
npm run antigravity:verify
```

## 3. Antigravity UI checks

In Antigravity inspect:

- `/agents` — verify the KI-channel custom agents are visible;
- `/hooks` — verify session, safety, post-edit and stop hooks are enabled;
- `/mcp` / MCP Servers panel — verify Chrome DevTools, Remotion Bits and GitHub MCP status;
- `/tasks` — inspect long-running background commands;
- Subagent panel — inspect/wake/approve agent work as needed.

Use `/bootstrap-ki-channel` at the start of a serious production session.

## 4. Sandbox and permissions

Keep terminal sandboxing enabled for agent-run commands where available.

Do **not** use `--dangerously-skip-permissions` for KI-channel production. The repository PreToolUse safety gate intentionally requires review for destructive, branch-changing or unknown commands and denies agent-created/downloaded production voiceover.

Headless audits use `--sandbox` and rely on normal Antigravity permissions. Authenticate once in an interactive `agy` session before using headless mode.

## 5. Focused MCPs

### Chrome DevTools MCP

Use for real Remotion Studio/browser inspection, console errors, screenshots, layout and performance/visual checks. If the configured browser endpoint is not available, use Antigravity's built-in Browser Agent or rendered artifacts and report the MCP as unavailable.

### Remotion Bits MCP

Use only when the shared StoryMotion/StoryMedia stack and official Remotion APIs do not cover a concrete narrative motion need. Search/fetch the source, inspect it and adapt only the small useful pattern.

### GitHub MCP

Use for remote branch/PR/issue context. Local Git remains the working-tree authority. If Docker/OAuth is unavailable, local Git must continue to work; GitHub MCP is an enhancement, not a release bypass.

### Lottie Creator MCP — optional and disabled by default

The workspace also contains a pinned optional server:

`@lottiefiles/creator-mcp@0.2.1`

It is intentionally configured with `disabled: true`. Enable it in `/mcp` only when `/create-lottie-motion` is being used for a specific story beat.

Local use:

1. open `https://creator.lottiefiles.com/`;
2. sign in with a LottieFiles account;
3. enable Creator MCP inside the Creator tab;
4. enable `lottiefiles-creator` in Antigravity;
5. author the small animation;
6. export `.json` or `.lottie` locally;
7. disable the MCP again.

Never use a remote LottieFiles URL in Remotion production source. Exported assets require local compatibility/render review before production use. A Creator/MCP outage is never a reel-production blocker because native Remotion remains the fallback.

## 6. Free external visual discovery

Pexels and Pixabay scouts are discovery-only helpers. Real API keys live only in `.env.local`:

```text
PEXELS_API_KEY=...
PIXABAY_API_KEY=...
```

Use `/scout-free-assets <query>` for a defined story beat. These scouts never download or wire assets into Remotion automatically.

## 7. Google Build-with-Google bundle

For extra current React/Web implementation guidance, optionally enable:

`Settings > Customizations > Build with Google Plugins > Modern Web Guidance`

This is useful for web/React performance, security and implementation quality. It does not override Remotion or KI-channel production rules and is not required to render a reel.

## 8. Teamwork

For a normal 60–75 second reel, the repository's custom subagents are normally more focused.

For a genuinely large multi-day/system-wide change — for example upgrading the entire Remotion stack, rebuilding the animation library or migrating many coupled subsystems — `/teamwork-preview` can be used if it is available on the current Antigravity plan.

Do not use Teamwork merely to edit one reel; extra agents are useful only when the task decomposes into independent workstreams with clear verification criteria.

## 9. Highest-quality reel commands

After bootstrap:

```text
/parallel-audit-ki-reel <reel-package-dir>
/maximize-ki-reel <reel-package-dir>
/scout-free-assets <query>
/create-lottie-motion <reel-package-dir> <beat-id>
/visual-qa-ki-reel <reel-package-dir>
/finish-ki-reel <reel-package-dir>
/verify-ki-reel <reel-package-dir>
```

Use only what matches the current phase.

## 10. Story-beat pixel audit

```bash
npm run antigravity:story-stills -- <reel-package-dir> --scale=1
```

This renders every planned narrative beat to `out/story-beat-stills/<reel-id>/` with a manifest for independent visual QA.

## 11. Headless structured audits

Examples:

```bash
npm run antigravity:audit -- <reel-package-dir> --mode=facts
npm run antigravity:audit -- <reel-package-dir> --mode=motion
npm run antigravity:audit -- <reel-package-dir> --mode=dependencies
npm run antigravity:audit -- <reel-package-dir> --mode=release
```

Outputs are written under `out/antigravity-audits/` as the raw Antigravity envelope plus schema-validated structured audit JSON.

A headless audit is an independent second opinion; it never replaces required deterministic repository gates or the final human/visual 1x review.

## 12. Remotion upgrades

Use `/audit-remotion-upgrade` first. Keep upgrade work on a separate branch/worktree and only after the current stabilization baseline has real runtime evidence.
