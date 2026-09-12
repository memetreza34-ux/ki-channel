# Generated Media Materialization

Use this skill when a KI-channel reel needs an original illustrative image or short illustrative B-roll that does not need to be real-world evidence.

## Purpose

This capability closes the gap between a visual plan and a real local asset. The orchestrator may request generated media, validate the request without spending API credits, materialize the file through the configured Google Gemini API, and hand only SHA-bound local media to Remotion.

This skill never creates or replaces production voiceover.

## Source decision comes first

For every visual beat choose the source type before generating anything:

1. **Real/official evidence required** → use provenance-backed official/local/discovered media. Do not generate it.
2. **Mechanism can be shown natively** → prefer procedural Remotion when it explains the claim better.
3. **Original illustration, atmosphere or transition is useful** → generated media is allowed.

Generated media is never acceptable as `PROOF`, `EVIDENCE`, `OFFICIAL`, `OFFICIAL_UI`, `PRODUCT_UI`, `REAL_EVENT`, `REAL_FOOTAGE`, `BRAND_IDENTITY` or `SOURCE`.

## Request file

Create this file inside the target reel:

`06-projektdateien/GENERATED-MEDIA-REQUESTS.json`

Schema:

```json
{
  "schemaVersion": 1,
  "items": [
    {
      "id": "scene-03-model-metaphor",
      "kind": "IMAGE",
      "prompt": "A vertical cinematic cutaway illustration of layered abstract reasoning paths, no logos, no readable UI text",
      "purpose": "Explain the model's internal decision metaphor without presenting it as factual evidence",
      "sceneId": "scene-03",
      "claimId": "claim-03",
      "evidenceRole": "ILLUSTRATION",
      "aspectRatio": "9:16",
      "imageSize": "1K"
    },
    {
      "id": "scene-05-data-transition",
      "kind": "BROLL",
      "prompt": "A vertical cinematic macro shot of abstract data particles passing through transparent layers, smooth controlled camera movement, no text or logos",
      "purpose": "Bridge two explainer beats with purposeful synthetic motion",
      "sceneId": "scene-05",
      "evidenceRole": "TRANSITION",
      "aspectRatio": "9:16",
      "durationSeconds": 6,
      "resolution": "720p"
    }
  ]
}
```

Allowed `evidenceRole` values are only:

- `ILLUSTRATION`
- `ATMOSPHERE`
- `TRANSITION`

Allowed kinds:

- `IMAGE`
- `BROLL`

Default safety/cost limit is 8 generated assets per run. `KI_MEDIA_MAX_ITEMS` may intentionally raise this to at most 20.

## Verify before spending credits

Run:

```bash
node --check scripts/materialize-generated-media.mjs
node scripts/materialize-generated-media.mjs verify <reel-package-dir>
```

`verify` performs no Gemini/Veo API call. It validates schema, role truthfulness, aspect ratio, duration/resolution combinations and the per-run cap.

## Materialize

The local environment needs:

```bash
GEMINI_API_KEY=...
```

Never write, print or commit the key.

Then run:

```bash
node scripts/materialize-generated-media.mjs materialize <reel-package-dir>
```

Defaults:

- image model: `gemini-3.1-flash-image`
- B-roll model: `veo-3.1-generate-preview`
- image: 9:16, 1K unless requested otherwise
- B-roll: 9:16, 720p, 4/6/8 seconds

Models can be overridden without code changes:

```bash
KI_IMAGE_MODEL=...
KI_VIDEO_MODEL=...
```

## Outputs

Generated binaries are written under the already git-ignored runtime asset root:

`public/reel-assets/generated/<reel>/...`

The committed production evidence is:

`06-projektdateien/GENERATED-MEDIA.json`

Each successful item records provider, model, generation time, prompt, request fingerprint, MIME type, byte size, SHA256, local `staticFile` path and explicit synthetic/evidence flags.

If the same request fingerprint, model and SHA-bound local file still exist, the script reuses it instead of charging for another generation.

## Remotion contract

Only consume a generated asset after `GENERATED-MEDIA.json` contains the matching item and the local file exists.

For generated B-roll:

- treat it as visual material, not documentary footage;
- mute its generated/native audio in production unless a separate explicit audio review approves otherwise;
- production voiceover remains dominant;
- do not call it real footage in captions, source cards or review notes.

## Fail closed

If `GEMINI_API_KEY` is missing, generation fails without creating a fake success record.

If the provider returns no actual bytes, the file is not considered materialized.

Never fabricate `GENERATED-MEDIA.json`, hashes, generation results, API operations or local files. A written prompt is only **planned**; an existing SHA-bound output is **materialized**.