---
description: Build the optional local Remotion CC0 SFX supplement from the reviewed allowlist without changing any reel, then explain how to opt in explicitly.
---

# /setup-remotion-cc0-sfx

Use `.agents/skills/remotion-cc0-sfx-supplement/SKILL.md`.

1. Confirm the existing Kenney CC0 library remains the primary production SFX source.
2. Run:

```bash
node ki/scripts/setup-remotion-cc0-sfx-supplement.mjs
```

3. Run:

```bash
node scripts/check-remotion-cc0-sfx-integration.mjs
```

4. Inspect `public/reel-sfx/remotion-cc0-index.json` and confirm:
   - status `LOCAL_REMOTION_CC0_SFX_SUPPLEMENT_READY`;
   - exactly the reviewed CC0 allowlist is present;
   - source/runtime SHA256 exists for every item;
   - no blocked/unreviewed sound appears.
5. Do not enable the supplement globally.
6. Only for a reel with a concrete semantic need, explicitly set:

```json
"allowRemotionCc0Supplement": true
```

inside that reel's `sfx` contract.
7. Re-run the normal SFX resolver and review the selected event at 1x with voice priority.
8. If the optional supplement setup/download fails, leave the reel opt-in false and continue with the existing local Kenney CC0 library.

Never use remote `remotion.media` audio directly in a production render.
