# KI Channel — Claude Code entry point

**Production agent:** Claude Code using Claude **Opus 5.5** when available to the operator. Do not silently substitute a different model. The repo does not itself execute Claude or install an Anthropic subscription.

## Read order (do not skip)
1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/youtube-longform/AGENTS.md` for YouTube work
6. `ki/gehirn/YOUTUBE_VISUAL_LANGUAGE.md`
7. `ki/gehirn/APPROVED_KI_VISUALS.md`
8. `ki/gehirn/FAKTENQUELLEN.md` for claims and source use

## Scope
German faceless educational/analytical YouTube about AI. **Longform is primary.** All shots are authored, animated, composited, reviewed, and rendered with **Remotion**. Source screenshots may be composited into Remotion when the real product is evidence. No Antigravity handoff for new YouTube production. Do not change historical files purely to remove its name.

## Claude Code production loop
1. Run `/motion-director`: promise, 4-shot storyboard, start/mid/end per shot, camera, hierarchy, reference, duration, source-truth risk. For normal longform plan microbeats throughout each chapter.
2. Build in React/TypeScript/SVG/CSS using official Remotion plugin/best practices. Use `ki/src/motion/easing.ts` and `choreography.ts`; no random frame state or runtime network fetches.
3. Render preview frames and a **video**, not merely compile TypeScript.
4. Run `/creative-critic` on real rendered frames/video. Address the top weaknesses. No self-scored creative PASS without actual image review.
5. Iterate. Reject empty hero, tiny detail, static diagram, unmotivated glow, a sequence of cards, or a shot changed only by text.
6. Document technical tests, real render location, and unresolved creative risks independently. Never claim Claude or the Remotion plugin ran if they did not.

## Operator setup
Claude Code and its subscription/authentication must be set up separately. In Claude Code:

```text
/plugin marketplace add remotion-dev/claude-code-plugin
/plugin install remotion@remotion
/model
```

Choose Opus 5.5 in the model picker. Plugin commands may also be run by the current Claude CLI; confirm with official docs if they change.

## Current proof
- Composition: `KI-Claude-Motion-Proof-15s`
- Native Remotion source: `ki/src/longform/ai-app-workflow/motionProof/MotionProof.tsx`
- Tests/preview: `npm run claude:motion:proof:review`
- Quality benchmark: `ki/gehirn/CLAUDE_MOTION_BENCHMARK.md`

The proof is a **starter baseline** coded in this repo, *not* evidence that Claude Opus 5.5 generated or refined the animation. The user will run Claude Code against it and compare actual renders.

## Guardrails
- Keep one source of truth for the script and timeline.
- Preserve existing repo tests and requirements.
- Before merging: TypeScript, repository verification, visual contact sheet, video render and human creative approval.
- Changes on a PR branch do not automatically become `main`.
