---
name: lottie-creator-motion
description: Use the optional pinned LottieFiles Creator MCP to design a small reusable motion asset for a specific KI-channel story beat without bypassing local-asset, review or production gates.
---

# Lottie Creator Motion — KI-Channel

Use this skill only when a concrete story beat benefits from a reusable vector/micro-motion asset that would be wasteful to rebuild as one-off Remotion code.

## Safety mode

The `lottiefiles-creator` MCP is intentionally configured with `disabled: true` by default.

Enable it only for the current motion-authoring task, then disable it again when finished. A missing/closed Lottie Creator browser tab must never block normal reel production.

## Preconditions

1. Read the target `story-beats.json` and identify the exact narrative purpose.
2. Check shared `StoryMotion` / `StoryMediaLayers` first.
3. If native Remotion is simpler, clearer or more deterministic, use native Remotion instead.
4. Open `https://creator.lottiefiles.com/` in a desktop browser and enable Creator MCP inside Creator.
5. Never place credentials, cookies or session data in the repository.

## Good uses

- price-drop micro animation;
- progress/routing animation;
- loading/processing loop;
- small technical icon sequence;
- reusable reveal/indicator;
- simple vector metaphor that needs editable keyframes.

Avoid using Lottie for full-screen text-heavy scenes, captions, long UI panels or effects already covered by shared Remotion components.

## Authoring rules

- Keep the asset short and loop-safe when looping is intended.
- Prefer simple vector layers, limited effects and deterministic keyframes.
- Avoid embedded raster assets unless explicitly necessary.
- Keep text out of the Lottie where practical; render important copy in Remotion for readability and easy localization.
- Match the KI-channel clean/premium visual system instead of using generic template aesthetics.
- Ask the MCP to inspect layer names, timing, easing and hidden/unused layers before export.

## Production boundary

Creator output is **not automatically production-approved**.

After export:

1. save the exported `.json` or `.lottie` locally under the target reel's `02-bilder/lottie/` or another explicit local asset path;
2. record source as `LOTTIE_CREATOR_USER_WORKSPACE` and the creation/review date in the reel's visual plan/provenance;
3. validate the file can load locally with the pinned Remotion/Lottie stack;
4. inspect the rendered result in Remotion Studio and story-beat stills;
5. only then reference the local file from production source.

Never use a remote LottieFiles CDN/URL at render time.

## Free-plan awareness

Lottie Creator is usable on the free plan, but free users currently have a limited number of animation exports. Do not waste exports on tiny variants that Remotion can generate more cheaply.
