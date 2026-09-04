---
description: Safely scout free B-roll/photo candidates from Pexels first and Pixabay as a second source or fallback for one specific KI-channel story beat, without downloading or changing production source.
---

# /scout-free-assets <query>

Use the repository skills:

- `.agents/skills/pexels-asset-scout/SKILL.md`
- `.agents/skills/pixabay-asset-scout/SKILL.md`

## Purpose

Find at most a few strong real-visual candidates for one already-defined story beat. This workflow is discovery-only and must not change production manifests or Remotion source.

## Order

1. Read the target `story-beats.json` and confirm the exact narrative purpose.
2. Ask whether native Remotion already communicates the beat better. If yes, stop and use native motion.
3. If `PEXELS_API_KEY` is available, scout Pexels first, normally for portrait video.
4. If Pexels has no strong candidate, or a second source materially improves the choice, use Pixabay.
5. Respect Pixabay's mandatory 24-hour API cache; never bypass it to get fresher duplicate results.
6. Compare only the top few candidates on:
   - narrative relevance;
   - portrait/crop suitability;
   - resolution;
   - duration for B-roll;
   - generic-stock risk;
   - creator/source metadata completeness.
7. Return at most 1–3 finalists across both providers.
8. Mark every result `DISCOVERY_ONLY_NOT_PRODUCTION_APPROVED`.

## Hard boundary

Do not:

- download the media;
- edit `visual-assets.json` or `visual-assets-resolved.json`;
- insert Pexels/Pixabay remote URLs into Remotion;
- exceed the normal 1–2 strong external visual moments per reel;
- mass-query or mass-download either provider.

A later controlled production-resolution workflow must explicitly select a candidate, re-resolve it, download locally, validate media, record creator/source/license metadata, compute SHA256 and only then expose the local file to Remotion.
