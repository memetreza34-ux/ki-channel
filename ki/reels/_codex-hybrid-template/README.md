# Codex hybrid reel template

Copy this directory to a dated reel slug and replace every `REPLACE_ME` value before implementation.

## Required workflow

1. Complete all planning files.
2. Generate the images from `image-prompts.md`.
3. Place images, layers, masks, and voiceover at paths in `asset-manifest.json`.
4. Run `npm run codex:reel:prepare -- <slug> --ready`.
5. Give Codex the generated `CODEX-BRIEF.generated.md` and the short task from `CODEX_ASSEMBLY_TASK.md`.

## Default production standard

- 1080 × 1920
- 30 FPS
- 30–40 seconds
- 7–9 scenes
- German voiceover
- premium simplified 3D/editorial images
- white or near-white background, dark typography, violet accent
- voiceover-only audio by default
- every scene has one dominant explanatory motion
- every spoken word appears in subtitles
- only important words receive strong animation
- no flat image with generic zoom only

Do not implement from this template directly. Copy it to a real slug first.
