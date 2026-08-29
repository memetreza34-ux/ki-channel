---
description: Perform evidence-based visual QA on a KI-channel reel using story-beat stills, Remotion Studio, Browser/Chrome DevTools and an independent visual auditor.
---

# /visual-qa-ki-reel <reel-package-dir>

Visual QA is based on rendered pixels, not source confidence.

## 1. Preflight

1. Read target `reel.json`, `story-beats.json`, source and current review file.
2. Run the structure/storytelling gates first.
3. Confirm required runtime/local assets exist for the state being reviewed. If the composition cannot render because Phase-2 user audio or local assets are missing, report `BLOCKED` rather than inventing replacements.

## 2. Render every narrative beat

Run:

```bash
node scripts/render-story-beat-stills.mjs <reel-package-dir> --scale=1
```

Use the generated `out/story-beat-stills/<reel-id>/manifest.json` as the review index.

Inspect every still and compare it with the corresponding `visualAction` and `role`.

## 3. Remotion Studio / browser inspection

When available:

1. start Studio without opening another browser automatically:
   `npx remotion studio ki/src/index.ts --no-open --port=3000`
2. keep it running as a background task;
3. use Chrome DevTools MCP or the Antigravity Browser Agent to open `http://127.0.0.1:3000`;
4. inspect browser console/errors and the actual composition;
5. scrub representative transitions and camera moves, not just static frames;
6. capture screenshots/browser recordings as Antigravity artifacts for concrete failures.

If Chrome DevTools MCP is unavailable, use the built-in Browser Agent or rendered still/video artifacts and report the unavailable capability honestly.

## 4. Independent audit

Invoke `ki-visual-qa-auditor` with the reel path and generated manifest/artifact locations.

It must grade:

- story flow;
- visual reaction per core claim;
- static-state duration;
- 1080x1920 readability;
- caption-safe geometry;
- motion settling/readable holds;
- transition/camera purpose;
- proof visual relevance;
- hierarchy/focus;
- final SFX-visible-event fit when a mastered MP4 exists.

## 5. Fix loop

For concrete FAIL findings:

1. pass timestamp/frame + issue to `ki-remotion-story-engineer`;
2. make one focused implementation pass;
3. rerender affected beat stills / scene smoke states;
4. re-run the independent audit.

Do not change the speaker text if production user audio already exists unless the user explicitly accepts returning to Phase 2.

## 6. Final visual evidence

A final visual PASS requires the exact mastered MP4 to be viewed at 1x and bound to its SHA256 in the review file. Story-beat stills and Studio QA are strong intermediate evidence but do not replace the final 1x review.
