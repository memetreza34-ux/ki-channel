---
name: motion-director
description: Plan professional cinematic Remotion motion graphics shot by shot before writing animation code.
---

# Motion Director (KI Channel)

Read `ki/gehirn/YOUTUBE_VISUAL_LANGUAGE.md`, `ki/gehirn/APPROVED_KI_VISUALS.md`, `ki/gehirn/BEWEGUNG.md` and the current script before designing.

## Required shot contract
For each shot specify:

| Field | Requirement |
|---|---|
| Narrative beat | What specific viewer question is answered |
| Focal object | One recognizable large object, not a generic card |
| Composition | Exact spatial hierarchy, dominant object size, safe margins |
| Frame 0 | What is already visible / clear and strong |
| State A | Initial object state |
| State B | Material shape, geometry, position, scale, value or semantic state changes |
| State C | Meaningful result and duration of hold |
| Camera | Motivated push/orbit/crop/cut; not perpetual zoom |
| Transition | Continuity through shared object, edge, path or motivated hard cut |
| Easing | Use `ki/src/motion/easing.ts` defaults |
| Mechanisms | Only meaningful Remotion-native primitives; new build if no semantic fit |
| Sources | REAL_CAPTURE for genuine product claims; synthetic UI clearly illustration |
| QA samples | At least entry, transformation peak, exit, with frame indices |

**Minimum 3 meaningful stages per longer beat, multiple micro-beats per chapter.**

## Visual rejection rules
- no floating cards for abstract ideas
- no tiny nodes floating in unused 16:9 space
- no permanent grid/particles/sparkles
- no scene consisting of fade-in + static hold + fade-out
- no "make it dynamic" with effects alone
- no unnecessary 3D, template stacking or fake evidence
- never use motion just to defeat pixel-difference metrics

## Deliverables
A storyboard with shot times, key frames and timing; a list of existing vs custom components; audience reading-time checks; 3 concrete visual references (if available); an explicit hypothesis for what looks cinematic.

Do not approve your own output based on code compilation. Pass to `/creative-critic` after a real render.
