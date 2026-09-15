---
description: End-to-end Antigravity workflow for KI-channel YouTube longform. Use for new longform production, exact voice/visual synchronization, media sourcing/materialization, Remotion implementation and canonical review render. Fail closed when a required capability, asset, voice lock, alignment consensus, choreography or gate is missing.
---

# Longform Full Cycle

This is the canonical Antigravity workflow for `ki/youtube-longform/**` packages using `LONGFORM_V1`.

## Non-negotiable ownership

- Phase 1: agent owns research, claims, script, story, exact `VOICEOVER.txt`, `CHAPTER-VOICE-MAP.json`, semantic `CHOREOGRAPHY-PLAN.json`, concrete media discovery, source/license precheck, visual-world plan, thumbnail plan and implementation preparation.
- Phase 2: user only provides the final production voiceover.
- Phase 3: agent owns forced alignment, independent alignment consensus, exact speech→visual choreography, media materialization, final rights/provenance binding, Remotion implementation, SFX, render, QA, subtitles, thumbnail and upload package.
- Never ask the user to find/download B-roll or images as a normal production step.

## 0. Runtime + capability preflight

Longform production is pinned to Node 20 by the repository engine. The host machine may use another Node version, but production scripts must run through the portable wrapper:

```bash
node scripts/with-longform-node20.mjs scripts/check-antigravity-longform-capabilities.mjs
```

The wrapper uses the existing Node 20 directly when available; otherwise it may execute the target with `npx node@20` without globally replacing the host Node installation.

If the capability check exits non-zero, stop. Do not create a substitute prototype and do not claim that Longform production is available.

If it returns `READY_WITH_WARNINGS`, decide whether each warning affects the current video:

- Chrome DevTools offline -> run `node scripts/ensure-chrome-devtools.mjs` before official-browser-proof work, then recheck.
- Pexels/Pixabay key missing -> those optional scouts are unavailable; key-free Wikimedia image/video discovery remains available.
- Native image generation unavailable -> use sourced real media and native Remotion/Skia/Three illustration. Never fake evidence.

Then read:

- `REPO-STATE.md`
- `ki/youtube-longform/AGENTS.md`
- `ki/youtube-longform/LONGFORM-V1.md`
- `ki/youtube-longform/LONGFORM-SYNC.md`
- `ki/youtube-longform/RENDER-GATES.md`
- `.agents/workflows/open-ended-motion-production.md`
- `.agents/skills/longform-media-production/SKILL.md`
- target package `CLAIMS.json`, `CHAPTERS.json`, `CHAPTER-VOICE-MAP.json`, `CHOREOGRAPHY-PLAN.json`, `MEDIA-PLAN.json`, `VISUAL-STORY-PLAN.md` when present

## 1. Phase 1 — research, story, exact spoken text and concrete media discovery

1. Research current claims with primary sources first.
2. Build the final German script without padding to an arbitrary duration.
3. Put the exact words that will be spoken, without Markdown, into `01-script-audio/VOICEOVER.txt`.
4. Segment exactly that same text into `01-script-audio/CHAPTER-VOICE-MAP.json`. Concatenating every `sentence.text` in chapter order must reconstruct `VOICEOVER.txt` after whitespace normalization.
5. Build `CHAPTERS.json` in the same chapter order.
6. Build `CHOREOGRAPHY-PLAN.json` before the user records audio. Plan semantic meaning/state changes, not an effect for every word. Each beat must identify its chapter, sentence, exact speech start/end anchors and its explicit visual start/end behavior. Long holds are allowed.
7. Set `CHOREOGRAPHY-PLAN.json.status` to `READY_FOR_ALIGNMENT` or `PLANNED_REQUIRES_AUDIO_ALIGNMENT` only when the plan is complete enough to resolve against real speech.
8. Build chapter/story progression and visual worlds.
9. Use `.agents/workflows/open-ended-motion-production.md` to choose the strongest visual medium for every beat before choosing an effect.
10. For every beat decide the strongest medium, not the easiest medium:
   - native Remotion/UI/diagram/chart/typography;
   - exact official source proof;
   - real image;
   - real B-roll;
   - 3D/Skia/SVG/Lottie/Rive/Canvas/Three when explanatory;
   - generated non-evidentiary metaphor only when it is not pretending to prove a real claim.
11. Search concrete real-media candidates when useful:
   - Wikimedia Commons images via `scripts/scout-wikimedia-commons-assets.mjs`;
   - Wikimedia Commons WebM video via `scripts/scout-wikimedia-commons-video-assets.mjs` as the key-free real-B-roll baseline;
   - Pexels / Pixabay for broader generic B-roll/photos when their local API keys are configured;
   - official product/company pages for exact source proof;
   - Polyhaven only for suitable CC0 3D/HDRI/texture needs.
12. Store concrete source candidates and metadata in `MEDIA-PLAN.json`. Abstract entries such as `find server B-roll later` are not Phase-1-complete when a concrete source can already be found.
13. Discovery is not production approval. Never hotlink candidate URLs in Remotion.

If final voiceover is not present after Phase 1, stop exactly with:

`PHASE 2 AUDIO FEHLT`

## 2. Phase 3A — exact voice lock + independent consensus + choreography

After `voiceover.wav` or `voiceover.mp3` exists, do **not** manually guess chapter times or visual offsets. Run the canonical sync pipeline:

```bash
node scripts/with-longform-node20.mjs scripts/sync-ki-longform.mjs <package> --backend=mlx-qwen3
```

It must complete all five stages:

1. primary known-transcript forced alignment against the exact final user voiceover;
2. independent `ctc-german` alignment consensus;
3. compile every planned speech interval into an explicit visual `ENTER → HOLD → EXIT` interval plus optional SFX timing;
4. write `06-projektdateien/TIMELINE-AUDIT.md`;
5. pass the hard choreography validator.

Expected authority artifacts after success:

```text
01-script-audio/WORD-TIMINGS.json
01-script-audio/SPEECH-CUES.json
06-projektdateien/ALIGNMENT-QUALITY.json
06-projektdateien/CHOREOGRAPHY-RESOLVED.json
06-projektdateien/LONGFORM-TIMING-STATUS.json
06-projektdateien/TIMELINE-AUDIT.md
05-export/subtitles.srt
05-export/subtitles.vtt
05-export/transcript.txt
```

Rules:

- real user voiceover is the clock authority;
- chapters are voice-locked from real word timings;
- no equal/fixed chapter durations;
- no final visual timing from percentages of total duration;
- no final visual timing from one unbounded point trigger;
- long `HOLD` intervals are normal for Longform;
- if a phrase, window or cross-aligner consensus is ambiguous, stop and fix the plan/text/audio relationship instead of weakening the validator;
- review `TIMELINE-AUDIT.md` before implementation so spoken phrase ↔ visual ENTER/HOLD/EXIT ↔ SFX is human-readable.

## 3. Phase 3B — materialize every required external medium

All production Node scripts run through the Node-20 wrapper, which also restores conventional Homebrew/media binary paths for child processes.

For scout-backed media:

```bash
node scripts/with-longform-node20.mjs scripts/materialize-longform-media.mjs <package> \
  --asset-id=<MEDIA-PLAN assetId> \
  --scout=<out/asset-scout/...json> \
  --candidate-id=<candidate id>
```

For an exact official/browser-captured/local file:

```bash
node scripts/with-longform-node20.mjs scripts/materialize-longform-media.mjs <package> \
  --asset-id=<MEDIA-PLAN assetId> \
  --local-input=<local image/video>
```

This step only materializes/prepares and SHA-binds the exact file. It must leave the item `MATERIALIZED_PENDING_REVIEW`.

Then inspect the exact materialized file. For video, inspect the chosen trim, motion and crop; for images inspect crop/readability; for official evidence confirm that the pixels are genuinely from the cited source and not a generated mockup.

After source/rights and visual review, explicitly approve:

```bash
node scripts/with-longform-node20.mjs scripts/approve-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --rights-note="<specific review evidence>" \
  --visual-note="<specific visual/crop/timing review>"
```

No generic `looks fine` notes. The exact file SHA is the unit being approved.

### Official source proof

- Prefer exact page/screenshot/figure from the official source when it proves a claim.
- The configured Antigravity plugin is `.agents/plugins/ki-channel-production/mcp_config.json` and declares `chrome-devtools`.
- Before claiming browser proof, ensure the endpoint exists:

```bash
node scripts/ensure-chrome-devtools.mjs
```

- The helper launches an isolated Chrome/Chromium profile on `127.0.0.1:9222` when a supported local browser exists; it never uses the user's normal profile.
- Browser/Chrome DevTools artifacts may then capture the exact source locally.
- The captured file must go through materialization + exact-SHA approval.
- Never invent an OpenAI/product website, dashboard, benchmark or UI and present it as evidence.

## 4. Phase 3C — build the real Remotion source from resolved choreography

Use `ki-longform-remotion-engineer` as the single writer on the active working tree.

Required timing behavior:

- import/bind the exact package `06-projektdateien/CHOREOGRAPHY-RESOLVED.json`;
- import `createLongformChoreographyTiming` from `ki/src/longform/choreographyTiming.ts`;
- use `timing.local(chapterId, beatId)` / resolved beat windows for semantic visual lifecycles;
- use resolved visual `startFrame → enterEndFrame → hold → exitStartFrame → endFrame` instead of inventing a new hidden timing system;
- SFX use resolved choreography frames;
- a complex animation may have internal deterministic motion inside its resolved interval, but it may not move the semantic start/end away from the resolved authority.

Required source behavior:

- source must live under `ki/src/longform/<sourceSlug>/` and contain real `.tsx` implementation;
- composition must be registered in `ki/src/Root.tsx`;
- use only local materialized media (`staticFile` / local pipeline);
- no TODO/TBD/placeholder visual states;
- no fallback card may silently replace a required image/B-roll/proof asset;
- `OPEN_ENDED_STORY_DRIVEN`: use any existing deterministic technique that improves the story;
- existing capabilities include Remotion transforms/transitions/effects, SVG/paths, Skia, Three/R3F, Lottie, Rive, GSAP, RoughJS, Recharts and custom procedural React/Canvas systems;
- use Remotion Bits only as inspected/adapted source when the existing stack has a real gap;
- no effect spam: every motion must explain, focus, compare, prove, transition or pay off.

### Longform pacing target

- cold open: high information/motion density;
- explanation: visible state development as meaning changes;
- source/proof: calmer, readable, purposeful camera/focus motion;
- chapter changes: distinct reframe/world change;
- real B-roll: short and semantically matched, not filler;
- no practically unchanged main state for 15+ seconds;
- if an 8+ second static hold is intentional, it must be explicitly reviewed.

## 5. Pre-render must pass

Run the combined sync + existing render readiness gate:

```bash
node scripts/with-longform-node20.mjs scripts/check-ki-longform-sync-readiness.mjs <package>
```

This verifies both the exact choreography contract and all existing Longform render-readiness requirements. If it fails, stop and fix the actual blocker. Never bypass it with direct `npx remotion render`.

## 6. Only canonical production render

```bash
node scripts/with-longform-node20.mjs scripts/render-ki-longform-master.mjs <package>
```

The canonical renderer itself runs the combined sync-readiness gate before creating the render lock, so an unsynced or incorrectly wired source cannot become a production review candidate through the normal path.

A direct Remotion render is a prototype only and must never be handed to the user as `video.review.mp4`, production master or final video.

The canonical path owns timing authority, render lock, CRF quality, audio mastering, master QA and contact-sheet generation.

## 7. Review and release

- inspect generated contact sheets;
- inspect suspicious freeze/static warnings;
- watch the complete mastered video 1x without skipping;
- verify the final video against `TIMELINE-AUDIT.md` at representative and high-risk transitions;
- verify source proof, real-media semantics, text collisions, pacing, audio, tail and ending;
- build thumbnail A/B/C and select only after review;
- verify SRT/VTT/transcript/sources/upload metadata;
- only set release `READY` after the repository release gate passes.

## Fail-closed rules

Never do any of the following to "finish" a task:

- fabricate equal chapter timings;
- estimate final voice/visual timing from total-duration percentages;
- replace an explicit ENTER/HOLD/EXIT interval with one unbounded trigger frame;
- skip independent alignment consensus;
- weaken a failed choreography window merely to make the validator green;
- substitute missing media with a generic placeholder;
- generate fake evidence UI;
- mark an unreviewed asset `APPROVED`;
- use a scout URL directly in render source;
- call a prototype render a production master;
- claim B-roll/image/effect/timing capability merely because a library or script exists without real execution evidence.
