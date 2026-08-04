# Image prompts

Generate images before Codex implementation. Keep all long text, subtitles, arrows, charts, percentages, and interface labels out of the image unless a short object label is essential.

## Global visual style

```text
Premium simplified 3D editorial illustration, slightly isometric, clean near-white studio background, dark charcoal materials, controlled violet accents, soft realistic shadows, rounded but mature forms, precise composition, high visual hierarchy, no childish cartoon style, no photorealistic people, no neon cyberpunk, no clutter, no watermark, no logo, no subtitles, no headline, no diagram arrows, vertical 9:16 composition with generous safe areas at top and bottom.
```

## Scene 1 background

Output:

```text
assets/images/scene-01-background.png
```

Prompt:

```text
REPLACE_ME. Background environment only. Leave the main subject area open for a separate transparent foreground layer. Preserve clean negative space for Remotion title and subtitles.
```

## Scene 1 foreground object

Output:

```text
assets/layers/scene-01-main-object.png
```

Prompt:

```text
REPLACE_ME. Isolated main object on transparent background, complete object visible, clean edges, consistent camera angle and lighting with scene-01-background.png, no floor baked into the cutout, no text.
```

## Scene 3 main illustration

Output:

```text
assets/images/scene-03-main.png
```

Prompt:

```text
REPLACE_ME. One clear explanatory composition with three to five primary objects. Keep important regions spatially separated so Remotion can focus them with masks, callouts, and data overlays. No text or arrows.
```

## Scene 6 background

Output:

```text
assets/images/scene-06-background.png
```

Prompt:

```text
REPLACE_ME. Background layer only, matching the global style and leaving depth space for a separate subject layer.
```

## Scene 6 subject

Output:

```text
assets/layers/scene-06-subject.png
```

Prompt:

```text
REPLACE_ME. Transparent isolated subject, full silhouette visible, matching scene-06-background.png perspective and light direction, no text.
```

## Scene 8 background

Output:

```text
assets/images/scene-08-background.png
```

Prompt:

```text
REPLACE_ME. Strong but calm final editorial image, clean center composition, large readable negative space for the final Remotion message, no text, no logo.
```

## Generation review

Reject an image when:

- the main message is unclear
- composition is overloaded
- objects overlap planned subtitle or headline safe zones
- required object cannot be isolated cleanly
- image contains fake text, watermarks, labels, or arrows
- lighting or perspective differs between background and cutout layers
- only a generic zoom would be possible
