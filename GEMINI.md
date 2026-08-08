# Antigravity workspace instructions

This repository is compatible with Google Antigravity IDE/CLI.

First read `AGENTS.md` for repository-wide production and Git safety rules. For content-matching, grounding, animation-library tests, or the first production render test, load and follow `.agents/skills/content-grounding-test/SKILL.md`.

## Default first-test goal

When asked to "test", "run the first test", "continue until we can test", or verify the content-matched animation system, execute this sequence from the repository root:

1. `node scripts/check-antigravity-content-test-contract.mjs`
2. `node scripts/check-masterplan-production-inputs.mjs`
3. `node scripts/check-first-content-grounding-test-contract.mjs`
4. `node scripts/run-first-content-grounding-test.mjs`
5. Inspect `out/first-content-grounding-test/cost-efficiency-budget-leak-meter-v1/test-summary.json`.
6. `node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1`
7. Inspect the corresponding latency `test-summary.json`.
8. If all are green, run `node scripts/run-content-release.mjs verify`.

If dependencies are missing, install the declared repository dependencies without changing the lockfile:

`npm install --workspaces=false --package-lock=false --no-audit --no-fund`

Do not bypass the canonical production pipeline, weaken assertions, inject demo values, modify `main`, merge PR #3, or claim unexecuted tests passed.

The first official exact-value assertions are:

- cost: `94 Cent -> 28 Cent`, `measurementExact = 1`, `cost-efficiency`
- latency: `780 ms -> 340 ms`, `measurementExact = 1`, `scale-performance`

Only after grounding tests and technical verify are green may a smoke render be started with:

`node scripts/run-content-release.mjs smoke`

Full release and merge remain separate explicit decisions.
