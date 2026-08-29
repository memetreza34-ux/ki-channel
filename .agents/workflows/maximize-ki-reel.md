---
description: Use the full relevant Antigravity capability stack to improve an existing KI-channel reel from parallel fact/retention/motion analysis through story implementation, user-audio gate, sync, pixel/browser QA and independent release verification.
---

# /maximize-ki-reel <reel-package-dir>

This is the highest-level KI-channel workflow. Use it when the user wants the strongest possible reel, not merely a quick fix.

## 1. Bootstrap

1. Call `/bootstrap-ki-channel`.
2. Read `REPO-STATE.md`, `GEMINI.md`, `.agents/agents.md`, the target `PHASE-STATUS.md`, `reel.json`, `story-beats.json`, script and current Remotion source.
3. Confirm the active branch and current production phase.
4. Never silently switch to `main`.

## 2. Parallel read-only intelligence pass

Invoke independent subagents concurrently with workspace `inherit`:

- `ki-fact-researcher`: verify current claims, dates, prices and proof-source candidates.
- `ki-retention-story-auditor`: identify weak hook/progression/proof/consequence/payoff, repetition and likely drop-off stretches.
- `ki-motion-researcher`: audit every major spoken beat and find stronger shared/Remotion/Remotion-Bits motion options where useful.
- `ki-dependency-auditor`: check local version/peer/API compatibility when the reel uses Effects, Three, Skia, Rive, Lottie or other sensitive packages.

If a previous render/master or story-beat still set exists, also invoke:

- `ki-visual-qa-auditor`: audit the existing real artifacts and identify concrete static/visual/story problems.

Do not let these read-only agents edit files.

## 3. Synthesis before writing

The orchestrator combines the reports into one prioritized change list:

1. factual blockers;
2. retention/story/pacing blockers;
3. readability/visual blockers;
4. technical compatibility blockers;
5. optional polish.

If the user has already supplied production audio, **do not silently rewrite the speaker text**. A required wording change invalidates the current audio and returns the reel to Phase 2 after the text is approved.

## 4. One implementation writer

Invoke `ki-remotion-story-engineer` as the only writer on the current working tree.

It may:

- reuse shared StoryMotion/StoryMedia primitives;
- use relevant official Remotion skills;
- use `remotion-bits-discovery` and Remotion Bits MCP for a genuinely missing pattern;
- strengthen camera/reframe, transitions, physical motion, proof visuals and visual reactions;
- run focused story/type checks.

Do not spawn a second writer against the same files. Competing design experiments must use isolated Git worktrees/branches.

## 5. Phase-2 hard gate

Look for the complete user-created `01-script-audio/voiceover.mp3` or `.wav`.

If missing:

1. run Phase-1 structure/story gates;
2. ensure the copyable voiceover text is final;
3. report `PHASE 2 — WARTET AUF NUTZER-AUDIO`;
4. stop. Never create, synthesize or download the voiceover.

## 6. Phase-3 audio lock

If user audio exists, invoke `ki-audio-sync-engineer`.

It performs runtime WAV preparation, pause handling, forced alignment, word timings, caption/scene lock, beat retiming and semantic SFX alignment using the actual final audio.

## 7. Real visual QA

1. Run `/visual-qa-ki-reel <reel-package-dir>`.
2. Render all narrative story-beat stills.
3. Generate the pixel-delta diagnostic and manually inspect every `SUSPICIOUS_STATIC` pair.
4. Use Chrome DevTools MCP and Antigravity Browser when available to inspect Remotion Studio/local preview, console, layout and real visual states.
5. Invoke `ki-visual-qa-auditor` on the resulting artifacts.
6. Fix concrete FAIL findings through `ki-remotion-story-engineer`, then re-render/re-review.

Never turn source inspection or a high pixel-delta score into `VISUAL PASS`.

## 8. Production render and independent release verification

After tracked timing/source/contracts are committed and provenance can lock a clean state:

1. run canonical prepare/render-locked path;
2. render raw MP4;
3. create Social Master;
4. validate A/V/loudness;
5. watch/listen to exact mastered MP4 at 1x;
6. bind review to exact SHA256;
7. invoke `ki-release-verifier` independently.

## 9. Optional machine-readable second opinion

When it adds confidence, use headless audits:

```bash
npm run antigravity:audit -- <reel-package-dir> --mode=facts
npm run antigravity:audit -- <reel-package-dir> --mode=motion
npm run antigravity:audit -- <reel-package-dir> --mode=dependencies
npm run antigravity:audit -- <reel-package-dir> --mode=release
```

These do not replace deterministic gates or visual review.

## 10. Final report

Return:

- agents/subagents actually used;
- skills/MCPs actually used;
- changes made;
- exact commands run;
- gates with `PASS` / `FAIL` / `NOT RUN` / `BLOCKED`;
- mastered MP4 path + SHA256 when it exists;
- remaining user action.

Do not mark the reel final until the independent verifier and required 1x review have real evidence.
