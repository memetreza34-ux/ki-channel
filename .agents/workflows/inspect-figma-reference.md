---
description: Temporarily use the official Figma remote MCP as a read-oriented design reference for one KI-channel story beat, then translate the useful principles into local Remotion without making Figma a production dependency.
---

# /inspect-figma-reference <figma-link> <beat-id>

Use `.agents/skills/figma-design-reference/SKILL.md`.

## Preconditions

1. Read the target reel's `story-beats.json` and identify the exact narrative job of `<beat-id>`.
2. Use Figma only if a concrete frame/reference materially improves layout, hierarchy or motion thinking.
3. The official remote MCP is configured as `figma` with `serverUrl: https://mcp.figma.com/mcp` and is disabled by default.

## Safe activation

1. Temporarily enable only the `figma` MCP in Antigravity.
2. Authenticate through the normal Figma OAuth flow if needed.
3. Keep the configured write/create/download tools disabled.
4. Use only a few targeted read/context calls against the supplied Figma link/frame.

## Extract

Return only implementation-relevant observations:

- hierarchy;
- spacing/grid;
- visual grouping;
- focal point;
- component rhythm;
- interaction/motion principle if visible in the design context;
- what should be recreated natively in Remotion;
- what should **not** be copied.

## Production boundary

Do not:

- create or modify Figma files;
- download production media through the Figma MCP;
- put Figma URLs into Remotion source;
- make Figma required for render;
- replace existing approved story/text because a reference looks different.

Implement the useful principle locally through the normal single-writer Story Engineer, then run story-beat stills and browser/visual QA.

After the reference pass, disable Figma again and report whether it was actually used, unavailable or rate-limited.
