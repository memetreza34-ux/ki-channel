# Content-grounding production test rule

When the task involves content matching, animation selection, runtime grounding, reel production, first tests, smoke renders or release verification:

- Use `.agents/skills/content-grounding-test/SKILL.md`; for the first real reel also use `.agents/skills/build-context-overload-reel/SKILL.md`.
- Preserve the canonical content path: `spokenText -> meaning -> derive -> sanitize -> associate -> render props -> Remotion`.
- Preserve the canonical folder path: `ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/` with permanent `01-script-audio` through `06-projektdateien` folders.
- Run `node scripts/check-ki-reel-folder-structure.mjs` before and after reel/package edits.
- Create new reel packages only with `node scripts/new-ki-reel.mjs "Titel"`.
- Never create a reel project directly under `ki/`.
- Never put planning packages or planning documents in `ki/src/reels/`; that path is executable source only.
- Treat `ki/src/animation-library/masterplan-content-fixtures.json` as production speaker-text input only.
- Never inject direct demo `labels` or `values` from `content-render-fixtures.json` into production.
- Default first-test command: `node scripts/run-antigravity-content-test.mjs`.
- If that command fails, inspect `out/antigravity-content-test/summary.json` and rerun the first failing underlying step directly.
- Required grounding sequence remains:
  1. `node scripts/check-ki-reel-folder-structure.mjs`
  2. `node scripts/check-masterplan-production-inputs.mjs`
  3. `node scripts/check-first-content-grounding-test-contract.mjs`
  4. `node scripts/run-first-content-grounding-test.mjs`
  5. `node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1`
  6. `node scripts/run-content-release.mjs verify`
- Never claim a command passed unless it was actually executed successfully.
- Never weaken structure or grounding validators merely to get green.
- Do not merge PR #3 or modify `main` as part of testing.
