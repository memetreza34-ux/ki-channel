# Content-grounding production test rule

When the task involves content matching, animation selection, runtime grounding, production fixtures, first tests, smoke renders, or release verification:

- Use the workspace skill `.agents/skills/content-grounding-test/SKILL.md`.
- Preserve the canonical path: `spokenText -> meaning -> derive -> sanitize -> associate -> render props -> Remotion`.
- Treat `ki/src/animation-library/masterplan-content-fixtures.json` as production speaker-text input only.
- Never inject direct demo `labels` or `values` from `content-render-fixtures.json` into production.
- Default first-test command: `node scripts/run-antigravity-content-test.mjs`.
- If that command fails, inspect `out/antigravity-content-test/summary.json` and rerun the first failing underlying step directly.
- The underlying required sequence remains:
  1. `node scripts/check-masterplan-production-inputs.mjs`
  2. `node scripts/check-first-content-grounding-test-contract.mjs`
  3. `node scripts/run-first-content-grounding-test.mjs`
  4. `node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1`
  5. `node scripts/run-content-release.mjs verify`
- Never claim a command passed unless it was actually executed successfully.
- Do not merge PR #3 or modify `main` as part of testing.
