# Codex assembly task

Read all applicable `AGENTS.md` files, then read `CODEX-BRIEF.generated.md` in this reel package.

## Scope

Implement the approved hybrid reel exactly as specified.

- Work only on the current branch.
- Do not modify `main`.
- Do not redesign the approved voiceover, scene order, assets, or animation plan.
- Do not create placeholder assets.
- Stop and report when a required asset is missing or contradictory.
- Create reel code under `ki/src/reels/<slug>/`.
- Register exactly one production composition.
- Reuse low-level primitives, not complete unrelated scene compositions.
- Keep `soundMode: "off"` unless this package explicitly requests an SFX A/B variant.

## Required sequence

```bash
git status
git branch --show-current
git log -5 --oneline
npm run codex:reel:prepare -- <slug> --ready
```

Then:

1. implement the composition
2. add focused contract tests
3. run TypeScript and focused tests
4. render smoke frames
5. visually inspect every smoke frame
6. fix problems at their source
7. render all checkpoints and the full MP4
8. watch the MP4 at normal speed and phone size
9. run technical artifact validation
10. update only genuinely completed checklist items

## Required final report

Report exactly:

1. branch and final commit SHA
2. files changed
3. commands run and exact results
4. assets found and assets missing
5. scene-by-scene implementation summary
6. visual problems found and fixes made
7. audio status
8. paths to smoke frames, checkpoint frames, MP4, and release report
9. technical validation result
10. remaining known issues
11. confirmation that `main` was not modified
12. PR state only when a PR is part of the task

Do not say “finished” unless the current MP4 was actually rendered and watched.
