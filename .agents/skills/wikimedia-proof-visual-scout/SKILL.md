---
name: wikimedia-proof-visual-scout
description: Safely discovers Wikimedia Commons images for real proof/history/documentary beats while preserving per-file license and attribution metadata and never changing production source automatically.
---

# Wikimedia Commons Proof Visual Scout — KI-Channel

Use this skill for a concrete documentary/proof beat that benefits from a real historical photo, device, building, technical object, document or event image.

## Hard boundary

This skill is discovery-only.

It may:
- query the official Wikimedia Commons Action API;
- inspect imageinfo/extmetadata;
- rank JPEG/PNG/WebP candidates by relevance, resolution, crop suitability and rights status;
- preserve file page, author/credit, license and attribution metadata;
- write candidate JSON under `out/asset-scout/wikimedia-commons/`.

It must not:
- download a candidate automatically;
- edit `visual-assets.json` or `visual-assets-resolved.json`;
- insert Commons URLs into Remotion;
- treat Wikimedia itself as a warranty of copyright/personality/trademark status;
- claim a candidate is production-approved.

## Allowed automatic scout rights

Keep discovery aligned with the existing production resolver:

- `CC0-1.0`
- `PUBLIC_DOMAIN`
- `CC-BY-4.0`

Prefer CC0/Public Domain. CC BY 4.0 requires usable attribution metadata.

## Search

```bash
node scripts/scout-wikimedia-commons-assets.mjs "NVIDIA data center GPU server" --orientation=portrait --top=6
```

## Selection policy

1. Start from the exact narrative job in `story-beats.json`.
2. Prefer official-source proof when the claim itself is about a specific company/product announcement.
3. Use Commons for real-world documentary context, history, people/places/objects or technical imagery where it materially improves understanding.
4. Return at most 1–3 finalists.
5. Inspect the exact Commons file page and attribution/license details before production.
6. For identifiable people, trademarks, private-property contexts or other non-copyright restrictions, require manual review before commercial publication.
7. After explicit selection, use the existing `ki/scripts/resolve-reel-visual-assets.mjs` local-resolution path; no remote media at render time.

Wikimedia Commons reuse rules vary per file. Never infer permission from the fact that a file appears on Commons alone.
