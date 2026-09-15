---
name: rive-local-motion
description: Uses Rive safely in KI-channel reels only when a production-ready local .riv file already exists. Keeps free Rive Editor/Agent experimentation separate from the paid export boundary and never introduces remote Rive media into Remotion.
---

# Rive Local Motion — KI-Channel

Use Rive only for a concrete narrative beat that benefits from vector character/object motion, a state-machine-like visual or a reusable interactive-style animation.

## Current cost boundary

Rive Editor and the limited Rive Agent can be explored on the Free plan, but new `.riv` exports are not a Free-plan shipping capability. Therefore KI-channel production must **never depend on creating a new Rive export for free**.

Allowed free-path cases:

- a valid local `.riv` file already exists and the user has the right to use it;
- a previously exported/owned `.riv` asset is already available locally;
- Rive is used only for design experimentation/reference and the production implementation is rebuilt with Remotion/Lottie/Shapes.

If no local `.riv` exists, prefer:

1. shared Remotion StoryMotion/StoryMedia components;
2. Shapes/Paths/Three/Skia;
3. local Lottie;
4. only then document Rive as an optional non-free export path.

## Production safety

- Never use a remote Rive URL in a production render.
- Never depend on a Rive embed/hosted URL.
- Never claim a Free-plan Rive experiment is production-ready without a local `.riv` file.
- Never ask the user to pay merely to satisfy an implementation choice when the same story beat can be expressed well with the existing free stack.
- Keep the local `.riv` under the repository's local media/provenance rules and bind the exact production asset by SHA256 before final release.
- `StoryRiveLayer` is the canonical Remotion wrapper and already rejects `http://` and `https://` sources.

## Remotion use

Use `StoryRiveLayer` from `ki/src/reels/StoryMediaLayers.tsx` and pass a local `staticFile(...)` result.

Conceptually:

```tsx
<StoryRiveLayer src={staticFile('reel-assets/<composition>/<asset>.riv')} />
```

The source must already be local before render.

## QA

Any Rive beat must pass the same Storytelling/Visual QA as native Remotion:

- meaningful narrative purpose;
- mobile readability;
- no long static state;
- real Story-beat still/browser evidence;
- no console/runtime errors;
- exact final MP4 review.

Rive is an optional enhancement, never a release dependency.
