---
name: remotion-storytelling
description: Builds and reviews KI-channel Remotion reels as narrative social explainers with dense meaningful visual beats, transitions, camera motion, real proof visuals and event-linked SFX while preserving the repository's three-phase production contract.
---

# Remotion Storytelling — KI-Kanal

Use this skill for every new KI-channel Reel and whenever an existing Reel is criticized as too static, presentation-like or visually repetitive.

## Read first

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/gehirn/STORYTELLING_MOTION.md`
6. `ki/reels/AGENTS.md`
7. the named Reel's `06-projektdateien/reel.json`
8. `06-projektdateien/story-beats.json`

When the local environment supports installing agent skills, prefer the official current Remotion skills as an additional API reference:

`npx -y skills@latest add remotion-dev/skills -g -y`

or:

`npx remotion skills add`

Repository rules override generic Remotion examples.

## Narrative contract

For a normal 60–75 second Reel:

- plan at least 15 meaningful visual beats;
- do not leave active voiceover over a practically unchanged visual for more than 4.5 seconds without a documented readability reason;
- every core spoken claim must trigger a visible reaction;
- each scene must have at least two visible state changes;
- build a clear arc using `HOOK`, `PROBLEM`, `PROOF`, `CHANGE`, `CONSEQUENCE`, `PAYOFF`;
- always include `HOOK`, `PROOF`, `CONSEQUENCE` and `PAYOFF` somewhere in the full Reel;
- favor 70–80% native Remotion motion and 20–30% real/source visuals, usually 1–2 strong external moments;
- transitions, zooms and effects must have explanatory or narrative purpose.

## Preferred building blocks

Use `ki/src/reels/StoryMotion.tsx` before creating one-off animation logic:

- `StoryBeat`
- `StoryCamera`
- `ImpactNumber`
- `StoryProgressRail`
- `StoryCutFlash`
- `StoryChapterLabel`
- `StoryTexture`

Use `ki/src/reels/StoryMediaLayers.tsx` only when the subject benefits:

- `StoryThreeHero` for a strong conceptual/technical hero moment;
- `StoryLottieLayer` for local reusable micro-motion;
- `StoryRiveLayer` for local interactive-style vector motion;
- `StorySkiaBackdrop` for organic procedural movement.

Use real `@remotion/transitions` presentations for scene/subscene changes when appropriate. Keep transition variety controlled; do not turn every cut into a different effect.

## Media and SFX rules

- No render-time remote media.
- Lottie/Rive/assets must be local before production render.
- Existing local CC0 SFX pipeline stays authoritative for production.
- `@remotion/sfx` may be used as a development/reference capability, but never silently bypass the CC0 lock or provenance rules.
- Every audible SFX must correspond to a visible event.
- Voiceover stays louder and clearer than effects.

## Three-phase rule

### Phase 1

Create script/source/scene mapping, story beats, SFX events, visual plan and executable Remotion source. Run the structure and storytelling gates before claiming the Reel is ready for user audio.

### Phase 2

The user alone creates the production voiceover and manually places it in `01-script-audio/`. Never generate, synthesize, fetch or replace it.

### Phase 3

Forced-align the user's local audio, voice-lock scenes/captions, adjust beat timing to real speech, resolve local visuals/SFX, run all gates, render, master audio, and review the exact mastered MP4 at 1x.

## Required checks

Before production render:

`node ki/scripts/validate-storytelling-motion.mjs <reel-package-dir>`

Then the normal production path including `prepare-reel-render.mjs`, which must also invoke the storytelling gate.

Never claim a render, visual review, Storytelling PASS or final export was completed unless it actually ran.
