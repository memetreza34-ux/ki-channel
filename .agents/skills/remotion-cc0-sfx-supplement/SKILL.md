---
name: remotion-cc0-sfx-supplement
description: Safely extends the existing local Kenney CC0 SFX library with a small reviewed allowlist of official Remotion SFX whose detail pages explicitly state Creative Commons 0, while keeping render-time audio local and opt-in per reel.
---

# Remotion CC0 SFX Supplement — KI-Channel

Use this skill only when the existing local Kenney CC0 library lacks a semantically strong sound for a visible story event.

## Production authority

The existing local CC0 SFX pipeline remains primary:

`ki/config/sfx-sources.json` → `setup-reel-sfx-library.mjs` → `resolve-reel-sfx.mjs`

This Remotion supplement is optional and may never replace that baseline.

## Reviewed allowlist

Only entries from:

`ki/config/remotion-sfx-cc0.json`

may be localized automatically.

Current reviewed CC0 items:

- `whip`
- `whoosh`
- `pageTurn`
- `uiSwitch`
- `mouseClick`
- `shutterModern`
- `shutterOld`

The official Remotion detail page for each of these explicitly states Creative Commons 0.

Do not use unreviewed `@remotion/sfx` exports automatically. In particular, `ding` and `recordScratch` are deliberately blocked because their official Remotion pages state that they are not explicitly released under a free license.

## Setup

```bash
node ki/scripts/setup-remotion-cc0-sfx-supplement.mjs
```

The setup:

1. downloads only allowlisted `https://remotion.media/*.wav` URLs;
2. refuses redirects outside `remotion.media`;
3. limits file size;
4. converts to local 48 kHz stereo PCM WAV;
5. records source/runtime SHA256;
6. writes `public/reel-sfx/remotion-cc0-index.json`;
7. never edits a reel or production manifest.

## Reel opt-in

A reel may use this supplement only with:

```json
{
  "sfx": {
    "allowRemotionCc0Supplement": true
  }
}
```

Without this exact opt-in, `resolve-reel-sfx.mjs` uses only the existing base CC0 library, preserving previous deterministic selection behavior.

## Hard rules

- CC0-1.0 only.
- Voice remains priority.
- Every SFX must correspond to a visible semantic event.
- No remote audio during Remotion render.
- No meme/recognizable-franchise sounds merely because `@remotion/sfx` exports them.
- If supplement setup fails, disable the supplement and continue with the base local CC0 library.
