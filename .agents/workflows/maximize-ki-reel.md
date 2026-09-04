---
description: Use the full relevant Antigravity capability stack to improve an existing KI-channel reel from parallel fact/retention/motion/brand analysis through cover/brand/proof/color planning, open-ended story implementation, user-audio gate, sync, pixel/browser QA and independent release verification.
---

# /maximize-ki-reel <reel-package-dir>

This is the highest-level KI-channel workflow. Use it when the user wants the strongest possible reel, not merely a quick fix.

## 1. Bootstrap

1. Call `/bootstrap-ki-channel`.
2. Read `REPO-STATE.md`, `GEMINI.md`, `.agents/agents.md`, target `PHASE-STATUS.md`, `reel.json`, `story-beats.json`, `LEVEL-UP-PLAN.json`, `BRAND-MOTION-PLAN.json` when present, script and current Remotion source.
3. Confirm active branch and production phase.
4. Never silently switch to `main`.

## 2. Parallel read-only intelligence pass

Invoke concurrently:

- `ki-fact-researcher`: current facts, dates, prices, primary proof.
- `ki-retention-story-auditor`: hook, progression, proof, consequence, payoff, repetition/drop-off.
- `ki-motion-researcher`: stronger shared/Remotion/Remotion-Bits motion options for concrete beats.
- `ki-brand-motion-director`: exact brand/wordmark/UI candidates, official source URLs, palette reference, functional icons, repeated motion grammar and missing capability opportunities.
- `ki-dependency-auditor`: version/peer/API compatibility when sensitive packages are used.

If a previous render/master/still set exists, also invoke `ki-visual-qa-auditor`.

For branded/current-news reels explicitly audit:

- finished first-second cover candidate;
- central brand recognition and no fake-logo generic icons;
- primary brand recognizable without captions and reappearing later;
- genuine official/local logo/wordmark/product UI or documented exception;
- official proof moment;
- at least three purposeful real/official moments when v3/v4 requires them;
- real video when motion itself is the claim;
- word-lock plans for important names/numbers/dates/statuses;
- meaningful development roughly every 1.5–3.0 s;
- at least 20 concrete visual beats for normal v3/v4 reels;
- at least four visual worlds and two mid-reel reframes;
- one primary focus at a time and no caption/critical-visual overlap;
- several distinct motion families and at least one spatial/full-frame scene when appropriate;
- phone-readable captions/microdetails.

For **v4** additionally audit:

- `BRAND-MOTION-PLAN.json` completeness;
- official/reference brand palette and scene color notes;
- accidental brand-color drift;
- functional icons separated from brand identity;
- whether animation feels limited by the existing template/library;
- whether a new custom/procedural technique would materially improve a beat;
- whether a new skill/agent/MCP/package/local tool would solve a real capability gap without redundancy.

Do not let read-only agents edit files.

## 3. Synthesis before writing

Prioritize:

1. factual blockers;
2. hook/cover/retention blockers;
3. brand/logo/UI/proof blockers;
4. v4 color-coherence blockers;
5. visual-world/mid-reel repetition blockers;
6. voice-sync/scene-density/overlap/readability blockers;
7. technical/capability blockers;
8. optional polish.

If production audio already exists, do not silently rewrite speaker text. A required wording change invalidates the current audio and returns the reel to Phase 2 after text approval.

## 4. One implementation writer

Invoke `ki-remotion-story-engineer` as the only writer on the current working tree.

It may:

- reuse shared primitives when useful;
- use `reel-level-up-standard`, `brand-motion-fidelity` and `reel-render-review-standard`;
- build a finished first-second cover;
- use exact local official brand/UI assets through `LOCAL_OFFICIAL_MEDIA` when available;
- use clean typography rather than fake logos when not available;
- preserve coherent brand/reference colors while allowing intentional semantic colors;
- use functional icons for concepts without impersonating brands;
- implement at least the planned visual worlds/reframes/beats;
- create **any story-useful animation technique**, even if not already in the shared library, provided it remains deterministic, performant, readable and reviewable;
- research/build a new motion technique when the current library would force another repetitive card/spring/slide solution;
- use real image/video/proof media where it materially strengthens trust or explanation;
- run focused story/type/level-up/v4 checks.

Open-ended motion is not effect spam. Every technique must explain, focus, compare, prove, transition or pay off.

Do not spawn a second writer against the same files. Competing experiments need isolated worktrees/branches.

## 5. Phase-2 hard gate

If complete user-created `01-script-audio/voiceover.mp3` / `.wav` is missing:

1. run Phase-1 structure/story gates;
2. run `node ki/scripts/validate-reel-level-up.mjs <reel-package-dir>`;
3. for v4 run `node ki/scripts/validate-reel-brand-motion-v4.mjs <reel-package-dir>`;
4. ensure cover/brand/palette/proof/real-media/visual-world plans and copyable voiceover are final;
5. report `PHASE 2 — WARTET AUF NUTZER-AUDIO`;
6. stop. Never create, synthesize or download the voiceover.

## 6. Phase-3 audio lock

If user audio exists, invoke `ki-audio-sync-engineer`.

It performs runtime WAV preparation, pause handling, pitch-preserving tempo, forced alignment, word timings, caption/scene lock, beat retiming and semantic SFX alignment using the actual final audio.

Major reveals must then be checked against real `WORD-TIMINGS.json`.

## 7. Real visual QA

1. Run `/visual-qa-ki-reel <reel-package-dir>`.
2. Render narrative story-beat stills.
3. Generate pixel-delta diagnostic and inspect every `SUSPICIOUS_STATIC` pair.
4. Use Chrome DevTools MCP / Browser Agent when available.
5. Invoke `ki-visual-qa-auditor`.
6. Review all base Level-Up labels.
7. For v3+ review brand recognition/reappearance, real brand asset, real media, visual worlds and mid-reel reframes.
8. For **v4** additionally review:
   - `BRAND_ASSET_VISIBLE_OR_JUSTIFIED`
   - `BRAND_COLOR_COHERENCE`
   - `FUNCTIONAL_ICONS_ARE_NOT_FAKE_LOGOS`
   - `MOTION_NOT_TEMPLATE_LOCKED`
   - `ANIMATION_TECHNIQUE_FITS_STORY`
   - `NO_ACCIDENTAL_COLOR_DRIFT`
   - `REAL_MEDIA_MATERIALIZED_OR_JUSTIFIED`
9. Fix concrete FAIL findings via the Story Engineer and re-render/re-review.

Never turn source inspection or a high pixel-delta score into `VISUAL PASS`.

## 8. Production render and independent release verification

After tracked timing/source/contracts are committed:

1. resolve/validate SFX and visual assets;
2. v4 official local assets must be materialized through the visual resolver before render;
3. run canonical prepare/render-lock path (includes v4 brand/motion gate and hashes `BRAND-MOTION-PLAN.json`);
4. render raw MP4;
5. create Social Master;
6. validate A/V/loudness;
7. watch/listen to exact mastered MP4 at 1x;
8. capture configured cover frame;
9. bind review to exact SHA256;
10. invoke `ki-release-verifier` independently.

## 9. Capability evolution

If the Brand Motion Director or Motion Researcher identifies a real missing ability, research and integrate a new skill/agent/MCP/package/local tool only when it materially improves quality or removes a recurring bottleneck.

Prefer official/free/local-first, pin compatibility-sensitive versions, keep optional capabilities optional until proven, and avoid redundant novelty tools.

## 10. Final report

Return agents/subagents used, skills/MCPs used, changes, exact commands, gate states, mastered MP4 + SHA256 when it exists, cover frame/time and remaining user action.

Do not mark the reel final until independent verifier and required 1x review have real evidence.
