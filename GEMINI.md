# Antigravity workspace instructions

This repository is compatible with Google Antigravity IDE/CLI.

First read `AGENTS.md` and `ki/AGENTS.md`. For reel work also read `ki/reels/AGENTS.md`.

## Permanent reel-folder contract

Every production reel package lives only at:

`ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/`

with the permanent folders:

- `01-script-audio/`
- `02-bilder/`
- `03-caption/`
- `04-pdf/`
- `05-export/`
- `06-projektdateien/`

Before and after reel/package changes run:

`node scripts/check-ki-reel-folder-structure.mjs`

Create new reels only with:

`node scripts/new-ki-reel.mjs "Reel Titel"`

Never create `ki/<reel-name>/`. Never place planning files in `ki/src/reels/`. `ki/src/reels/<slug>/` is only for executable TS/TSX source after implementation starts.

## First production reel

When asked to build, render, finish, or continue the first real reel, use:

`.agents/skills/build-context-overload-reel/SKILL.md`

Approved planning package:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Topic: `Warum mehr Kontext eine KI schlechter machen kann`.

Its files are distributed by production area:

- voiceover: `01-script-audio/voiceover.md`
- asset manifest: `02-bilder/asset-manifest.json`
- subtitle cues: `03-caption/subtitle-cues.json`
- reel/scene/animation/assembly/review: `06-projektdateien/`

Before implementation run:

`node scripts/run-antigravity-context-overload-preflight.mjs`

Only after preflight succeeds may executable implementation be created separately under:

`ki/src/reels/antigravity-context-overload/`

Do not move the planning package there.

## Fastest first grounding-test path

For the complete first grounding sequence, run from repository root:

`node scripts/run-antigravity-content-test.mjs`

It validates the Antigravity test contract, the 22 production inputs, the exact cost grounding case and the exact latency grounding case, then writes:

`out/antigravity-content-test/summary.json`

## Expanded grounding sequence

1. `node scripts/check-ki-reel-folder-structure.mjs`
2. `node scripts/check-antigravity-content-test-contract.mjs`
3. `node scripts/check-masterplan-production-inputs.mjs`
4. `node scripts/check-first-content-grounding-test-contract.mjs`
5. `node scripts/run-first-content-grounding-test.mjs`
6. Inspect the cost `test-summary.json`.
7. `node scripts/run-first-content-grounding-test.mjs scale-performance-latency-tunnel-race-v1`
8. Inspect the latency `test-summary.json`.
9. If all are green, run `node scripts/run-content-release.mjs verify`.

If declared dependencies are missing, install them without modifying the lockfile:

`npm install --workspaces=false --package-lock=false --no-audit --no-fund`

Do not bypass canonical production paths, weaken assertions, inject demo values, modify `main`, merge PR #3, or claim unexecuted tests passed.

The first exact-value assertions remain:

- cost: `94 Cent -> 28 Cent`, `measurementExact = 1`, `cost-efficiency`
- latency: `780 ms -> 340 ms`, `measurementExact = 1`, `scale-performance`

Only after grounding tests and technical verify are green may a smoke render start with:

`node scripts/run-content-release.mjs smoke`

Full release and merge remain separate explicit decisions.
