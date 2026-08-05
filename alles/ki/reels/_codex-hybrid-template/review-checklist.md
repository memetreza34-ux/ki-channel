# Review checklist

Leave every item unchecked until it has actually been verified on the current source state.

## Package and assets

- [ ] Planning validation passes.
- [ ] Strict `--ready` validation passes.
- [ ] Final voiceover exists at the manifest path.
- [ ] Every required image, layer, and mask exists.
- [ ] Image dimensions and transparency match their declared role.
- [ ] No placeholder or unrelated asset is used.

## Content

- [ ] Hook is understandable in the first second.
- [ ] Every scene communicates one clear idea.
- [ ] Statistics and dates have visible source context.
- [ ] Final message remains stable for at least 40 frames.
- [ ] The reel remains understandable without audio.

## Images and animation

- [ ] Every image scene has meaningful animation beyond a generic zoom.
- [ ] Layered assets move consistently with their declared depth.
- [ ] Flat images are treated only with honest masks, focus, overlays, or camera movement.
- [ ] Every scene has one dominant explanatory motion.
- [ ] No scene exceeds three competing strong motions.
- [ ] No complete animation is reused.
- [ ] Consecutive scenes do not repeat layout or motion signature.
- [ ] No decorative particle, glow, rotation, or camera move distracts from meaning.

## Typography and subtitles

- [ ] Every scene has a readable headline in the top safe zone.
- [ ] Every spoken word appears in subtitle cues or final transcript timing.
- [ ] Only already-spoken words appear in the active subtitle window.
- [ ] Subtitle window remains compact.
- [ ] Important words receive semantic emphasis.
- [ ] Headline, main visual, annotations, and subtitles do not overlap.
- [ ] All text is readable at phone size.
- [ ] No text is clipped.

## Transitions

- [ ] Hard cuts are used where no semantic continuation exists.
- [ ] Every non-hard-cut transition carries a real object, shape, direction, or state.
- [ ] No transition hides an important subtitle or result.
- [ ] No fade to black is used.

## Audio

- [ ] Final voiceover is present and correctly aligned.
- [ ] Default render uses `soundMode: "off"`.
- [ ] No synthetic beeps, noise sweeps, or word-by-word SFX exist.
- [ ] Optional SFX version, when requested, contains no more than five cues.
- [ ] Optional SFX version was A/B compared against voiceover-only.
- [ ] Voiceover-only remains final unless SFX version is clearly better.

## Technical checks

- [ ] Composition dimensions, FPS, and duration match `reel.json`.
- [ ] Scene frame ranges are continuous and complete.
- [ ] Scene IDs, animation IDs, layouts, and motion signatures satisfy uniqueness rules.
- [ ] Subtitle cues are sorted and within scene bounds.
- [ ] Focused TypeScript check passes.
- [ ] Focused tests pass.
- [ ] Smoke frames render from current source.
- [ ] Every smoke frame was visually inspected.
- [ ] All checkpoints render from current source.
- [ ] Full MP4 renders from current source.
- [ ] Full MP4 was watched at normal speed.
- [ ] Full MP4 was checked at phone size.
- [ ] Technical artifact report passes.

## Release status

```text
Status: NOT READY
Reason: Template only. Replace after actual implementation, render, and visual review.
```
