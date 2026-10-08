# Claude Opus 5.5 Motion Graphics Benchmark

## Why
Existing Longform 16:9 contact sheet rendered and technical CI passed, but visually underused the frame with tiny diagrams, shallow transformation and static holds. Do not repeat that mistake.

## Workflow
**Claude Code + Opus 5.5** handles art direction, Remotion source, visual critique and revision. **Remotion** is the video engine. No Antigravity in the default YouTube production workflow.

The purpose of this repo test is NOT to prove a particular model produced something. The included demo source is a **baseline**; any future improvement must document actual Claude invocation and compare identical rendered sections before/after.

## 15-second pilot: 'Vom Prompt zum Agenten'
- 1920 × 1080, 30 fps, 450 frames, silent visual benchmark (no fake voiceover)
- 0–3.75 s: enormous readable prompt window; semantic first action
- 3.75–7.5 s: prompt is broken into moving parts and reorganized into an agent core
- 7.5–11.25 s: core hands off to a growing software interface
- 11.25–15 s: built interface resolves into validation/payoff with deliberate dark reset

**This is a visual metaphor**, not a screenshot or a factual claim about specific AI technology.

## Deliverables and commands
- `npm run claude:motion:proof:review` renders 16:9 contact sheet and metrics
- `npm run claude:motion:proof:video` renders actual silent MP4
- `npm run claude:motion:proof:check` tests proof contract and TypeScript
- Composition: `KI-Claude-Motion-Proof-15s`

Run both artifact builds in CI as well. Compare the actual video with the three user-provided YouTube examples **only if their visible video frames can be accessed**, and name what is better/worse by shot. Never assert equal production quality from test passing.

## Gate
No merge solely from green CI: after rendered preview, every shot should have meaningful change, eye-leading focal object, large content occupying intentional space, clearly distinct visual stage, and legitimate end payoff.

If the user's standard is unmet, note exact frames and create another pass rather than merging or declaring final.
