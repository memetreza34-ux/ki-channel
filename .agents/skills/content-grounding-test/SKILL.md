---
name: content-grounding-test
description: Runs and debugs the first production content-grounding tests for the KI Channel Remotion animation system. Use when asked to test content matching, grounding, production fixtures, exact values, or prepare the first smoke render.
---

# Content Grounding Test

Use this skill from the repository root.

## Goal

Verify that a real production `spokenText` reaches the correct Remotion composition through the canonical content-grounding path without injected demo values:

`spokenText -> SceneMeaningContract -> derive -> sanitize -> associate -> render props -> render plan`

Production inputs are in `ki/src/animation-library/masterplan-content-fixtures.json` and must remain speaker-text-only.

## Safety

- Read `AGENTS.md` first and follow its Git rules.
- Never work on `main`.
- Do not merge or mark PR #3 ready.
- Run `git status --short` and `git branch --show-current` before source edits.
- Do not weaken tests, skip assertions, insert fake values, or copy direct demo values from `content-render-fixtures.json` into production fixtures.
- Never claim a test or render passed unless the command actually exited successfully and its expected artifact was inspected.

## Fast path

Run the complete first-test sequence with one command:

`node scripts/run-antigravity-content-test.mjs`

Then inspect:

`out/antigravity-content-test/summary.json`

Do not continue if the summary status is not `passed`.

## Environment preparation

1. Confirm Node is available with `node --version`.
2. Run the Antigravity workspace self-check:
   `node scripts/check-antigravity-content-test-contract.mjs`
3. If declared local packages are missing, install dependencies without modifying the lockfile:
   `npm install --workspaces=false --package-lock=false --no-audit --no-fund`
4. Do not use `npx -y` to fetch arbitrary newer versions for release verification.

## Underlying sequence for debugging

### Test 0 — production input boundary

Run:

`node scripts/check-masterplan-production-inputs.mjs`

Expected result includes a successful 22/22 production-ID check. If it fails, fix the actual fixture/config mismatch before continuing.

### Test 0B — first-test contract

Run:

`node scripts/check-first-content-grounding-test-contract.mjs`

### Test 1 — official first grounding test

Run:

`node scripts/run-first-content-grounding-test.mjs`

The default test is `cost-efficiency-budget-leak-meter-v1` and must prove:

- `cost-efficiency` is in the preferred visual families
- `measurementExact = 1`
- `initialCost = 94`
- `optimizedCost = 28`
- at least one prototype-specific runtime key exists
- normalized render props equal the grounded props
- the generated render request uses `mode = plan`
- the composition ID matches `prototype-render-config.json`

Inspect:

`out/first-content-grounding-test/cost-efficiency-budget-leak-meter-v1/test-summary.json`

### Test 1B — latency grounding

Run:

`node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1`

Required exact result:

- `scale-performance` meaning
- `measurementExact = 1`
- `slowLatency = 780`
- `fastLatency = 340`

Inspect its `test-summary.json` under `out/first-content-grounding-test/`.

## Debugging protocol

When the one-command runner fails:

1. Read `out/antigravity-content-test/summary.json`.
2. Capture the first real exception/assertion and its command.
3. Classify as environment/dependency or source regression.
4. If source-related, inspect the relevant stage in order: meaning, deriver, sanitizer, association, payload, render-plan.
5. Fix the source cause rather than the test expectation unless the expectation is objectively wrong.
6. Rerun the narrow failing command.
7. Rerun `node scripts/run-antigravity-content-test.mjs` from the start.
8. Report the exact successful/failed commands and artifact paths.

## After both grounding tests pass

Run technical verification:

`node scripts/run-content-release.mjs verify`

Then, and only then, start the first visual smoke:

`node scripts/run-content-release.mjs smoke`

Do not run the full release until smoke artifacts have been reviewed.
