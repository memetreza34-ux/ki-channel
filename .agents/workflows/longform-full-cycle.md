---
description: End-to-end Antigravity workflow for KI-channel YouTube longform. Use for new longform production, media sourcing/materialization, Remotion implementation and canonical review render. Fail closed when a required capability, asset, voice lock or gate is missing.
---

# Longform Full Cycle

This is the canonical Antigravity workflow for `ki/youtube-longform/**` packages using `LONGFORM_V1`.

## Non-negotiable ownership

- Phase 1: agent owns research, claims, script, story, concrete media discovery, source/license precheck, visual-world plan, thumbnail plan and implementation preparation.
- Phase 2: user only provides the final production voiceover.
- Phase 3: agent owns forced alignment, exact timing, media materialization, final rights/provenance binding, Remotion implementation, SFX, render, QA, subtitles, thumbnail and upload package.
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
- `ki/youtube-longform/RENDER-GATES.md`
- `.agents/workflows/open-ended-motion-production.md`
- `.agents/skills/longform-media-production/SKILL.md`
- target package `CLAIMS.json`, `CHAPTERS.json`, `MEDIA-PLAN.json`, `VISUAL-STORY-PLAN.md`

## 1. Phase 1 — research, story and concrete media discovery

1. Research current claims with primary sources first.
2. Build the final German script without padding to an arbitrary duration.
3. Build chapter/story progression and visual worlds.
4. Use `.agents/workflows/open-ended-motion-production.md` to choose the strongest visual medium for every beat before choosing an effect.
5. For every beat decide the strongest medium, not the easiest medium:
   - native Remotion/UI/diagram/chart/typography;
   - exact official source proof;
   - real image;
   - real B-roll;
   - 3D/Skia/SVG/Lottie/Rive/Canvas/Three when explanatory;
   - generated non-evidentiary metaphor only when it is not pretending to prove a real claim.
6. Search concrete real-media candidates when useful:
   - Wikimedia Commons images via `scripts/scout-wikimedia-commons-assets.mjs`;
   - Wikimedia Commons WebM video via `scripts/scout-wikimedia-commons-video-assets.mjs` as the key-free real-B-roll baseline;
   - Pexels / Pixabay for broader generic B-roll/photos when their local API keys are configured;
   - official product/company pages for exact source proof;
   - Polyhaven only for suitable CC0 3D/HDRI/texture needs.
7. Store concrete source candidates and metadata in `MEDIA-PLAN.json`. Abstract entries such as `find server B-roll later` are not Phase-1-complete when a concrete source can already be found.
8. Discovery is not production approval. Never hotlink candidate URLs in Remotion.

If final voiceover is not present after Phase 1, stop exactly with:

`PHASE 2 AUDIO FEHLT`

## 2. Phase 3A — voice lock first

After `voiceover.wav` or `voiceover.mp3` exists:

1. measure the real audio;
2. run forced alignment / actual speech timing;
3. update chapters to real start/end times and status `VOICE_LOCKED`;
4. derive visual beats from the spoken words/phrases;
5. never allocate fixed equal chapter durations such as 1000 frames per chapter.

A composition duration must derive from the final voice timeline, never from placeholder chapter constants.

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

## 4. Phase 3C — build the real Remotion source

Use `ki-longform-remotion-engineer` as the single writer on the active working tree.

Required behavior:

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

```bash
node scripts/with-longform-node20.mjs scripts/check-ki-longform-render-readiness.mjs <package>
```

If this fails, stop and fix the actual blocker. Never bypass it with direct `npx remotion render`.

## 6. Only canonical production render

```bash
node scripts/with-longform-node20.mjs scripts/render-ki-longform-master.mjs <package>
```

A direct Remotion render is a prototype only and must never be handed to the user as `video.review.mp4`, production master or final video.

The canonical path owns render lock, CRF quality, audio mastering, master QA and contact-sheet generation.

## 7. Review and release

- inspect generated contact sheets;
- inspect suspicious freeze/static warnings;
- watch the complete mastered video 1x without skipping;
- verify source proof, real-media semantics, text collisions, pacing, audio, tail and ending;
- build thumbnail A/B/C and select only after review;
- build SRT/VTT/transcript/sources/upload metadata;
- only set release `READY` after the repository release gate passes.

## Fail-closed rules

Never do any of the following to "finish" a task:

- fabricate equal chapter timings;
- substitute missing media with a generic placeholder;
- generate fake evidence UI;
- mark an unreviewed asset `APPROVED`;
- use a scout URL directly in render source;
- call a prototype render a production master;
- claim B-roll/image/effect capability merely because a library exists without real execution evidence.
