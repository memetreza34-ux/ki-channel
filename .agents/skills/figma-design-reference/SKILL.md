---
name: figma-design-reference
description: Uses the official Figma remote MCP as an optional read-oriented design reference for KI-channel motion/layout decisions without making Figma a production dependency or allowing remote assets into Remotion.
---

# Figma Design Reference — KI-Channel

Use this skill only when a concrete reel beat benefits from a professional layout, interaction or motion-design reference and native repository patterns are not enough.

## Purpose

Figma is a reference/context source, not the renderer and not the production authority.

Preferred use cases:

- inspect spacing, hierarchy, composition and visual rhythm from a specific Figma frame;
- inspect component/variable/layout context when a Figma design already exists;
- use a frame as inspiration for a Remotion-native implementation;
- compare a proposed UI/motion composition against a concrete design reference.

## Hard safety boundary

The workspace Figma MCP is disabled by default.

When temporarily enabled for this task:

- authenticate through Figma OAuth locally;
- keep write/create/download tools disabled;
- do not create or modify Figma files from this workflow;
- do not use Figma as a remote media host during render;
- do not copy an external design blindly or claim ownership of third-party design work;
- do not let Figma availability block Remotion production.

The MCP configuration intentionally disables:

- `add_code_connect_map`;
- `create_new_file`;
- `download_assets`;
- `generate_diagram`;
- `generate_figma_design`.

## Production handoff

Translate only the useful design principles into local Remotion components:

1. identify the exact story job of the reference;
2. extract layout/motion principles, not decorative copying;
3. implement locally through StoryMotion/StoryMedia/Remotion APIs;
4. use only local production assets;
5. run story-beat stills + browser/visual QA;
6. keep Figma optional and disable it again after the reference pass.

## Usage discipline

Figma MCP limits depend on plan/seat and may change. Use a small number of high-value calls against a specific frame/link instead of exploratory browsing.

If the MCP is unavailable or rate-limited, continue with repository-native design systems, Remotion Bits, official Remotion APIs and browser QA.
