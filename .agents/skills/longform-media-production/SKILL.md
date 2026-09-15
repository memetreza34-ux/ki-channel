---
name: longform-media-production
description: Safely discover, materialize, review and bind real images, B-roll and official proof media for KI-channel YouTube longform. Bridges discovery scouts and browser captures to local SHA-bound MEDIA-PLAN assets before Remotion render.
---

# Longform Media Production

Use this skill for every `LONGFORM_V1` video that needs external images, real B-roll, official screenshots/figures, documentary imagery or local generated non-evidentiary media.

## Core distinction

There are four different states. Never collapse them:

1. `DISCOVERED` — a search/scout/browser result exists.
2. `MATERIALIZED_PENDING_REVIEW` — an exact file exists locally, is normalized and SHA-bound.
3. `APPROVED` — the exact SHA-bound file passed source/rights and visual/timing review.
4. `USED_IN_RENDER` — the approved local file is referenced by final Remotion source.

A URL is not an asset. A prepared file is not approval. A successful render is not rights approval.

## Discovery providers

Prefer the narrowest source that matches the story need:

- `OFFICIAL_SOURCE`: exact company/product/source page for factual proof. Capture locally with browser/Chrome tooling when needed; do not fabricate the page.
- `WIKIMEDIA_COMMONS`: documentary/proof imagery with accepted per-file license metadata.
- `PEXELS`: generic real photos/video, normally non-evidentiary B-roll.
- `PIXABAY`: generic real photos/video alternative, normally non-evidentiary B-roll.
- `POLYHAVEN`: CC0 3D/HDRI/texture inputs when a spatial visual genuinely helps.
- `GENERATED_NON_EVIDENTIARY`: metaphors/illustrations only; must never prove a real claim.

Use the existing scouts. Search terms should come from a concrete story beat, not a vague theme.

## Production materialization

### Scout candidate

```bash
node scripts/materialize-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --scout=<scout-result.json> \
  --candidate-id=<id>
```

Supported production bridge providers are Pexels, Pixabay and Wikimedia Commons. The bridge validates the selected candidate, source relationship, HTTPS download host, redirect chain, byte limits and file type before local prep.

### Browser/official/local capture

```bash
node scripts/materialize-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --local-input=<exact local file>
```

Use this for official screenshots/figures captured from the cited page, exact official exports or other already-local provenance-backed material.

The materializer:

- never changes `rightsVerified` to true;
- never marks production `APPROVED`;
- normalizes video to the Longform 1920×1080/30 preset;
- normalizes image to a deterministic 1920×1080 derivative;
- copies the derivative into the target package;
- computes SHA-256;
- records provenance/materialization metadata;
- sets status to `MATERIALIZED_PENDING_REVIEW`.

## Approval is separate and explicit

After inspecting the exact materialized file:

```bash
node scripts/approve-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --rights-note="<what source/license/restrictions were verified for this exact use>" \
  --visual-note="<what was checked in the exact crop/clip and why it fits the story>"
```

Approval verifies the current local SHA again. If the file changed after materialization, approval fails.

Rights notes must be concrete. For example:

- Pexels: exact source page + Pexels license + creator retained + generic non-endorsement use checked.
- Pixabay: exact source page + Pixabay Content License + creator/source retained + restricted-use concerns checked.
- Wikimedia: exact Commons file page + license + attribution if required + personality/privacy/trademark restrictions reviewed where relevant.
- Official source: exact official page/export origin + intended quotation/screenshot use reviewed; provenance is not a blanket permission claim.

The agent performs this review as part of production. The user is not asked to search/download media.

## Evidence safety

`provesRealWorldClaim: true` is allowed only for evidence that genuinely comes from the cited real source.

Never use as proof:

- generated screenshots;
- recreated dashboards made to look official;
- unrelated stock video;
- generic AI artwork;
- an illustrative chart with invented data;
- a logo reconstruction.

When a generated or generic asset is used for explanation, keep `provesRealWorldClaim: false`.

## Remotion use

Only `APPROVED` local files may enter final source. Use local/static paths; never HTTP URLs.

Real B-roll is not mandatory filler. Use it when the real-world visual changes comprehension, texture or rhythm. Keep clips short and semantically matched. For software/product proof prefer real official UI/source over generic keyboard footage.

For animation, combine real media with the existing stack as the story requires: crops, masks, tracked callouts, parallax, depth, typography, diagrams, SVG/Skia, Three/R3F, Rive/Lottie, transitions and procedural effects. The external medium is one layer of the explanation, not a replacement for story-directed motion.

## Completion contract

Before telling the orchestrator that media production is ready:

- every required external asset is local;
- every required external asset is SHA-bound;
- every required asset is `APPROVED`;
- `MEDIA-PLAN.status` is `READY_FOR_RENDER` or `READY`;
- generated media is not factual evidence;
- no render-time remote URLs remain;
- final source references the approved local file, not a duplicate or pre-prep download.
