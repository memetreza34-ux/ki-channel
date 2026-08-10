# KI-Kanal — Bild- und Prompt-System

## Zweck

Generierte Bilder sind **Erklärassets**, keine Dekoration. Ein Bild wird nur eingesetzt, wenn eine räumliche, objektbasierte oder alltägliche Szene die Aussage schneller verständlich macht als reine Remotion-Grafik.

Standardstil:

> hochwertige vereinfachte 3D-Editorial-Illustration, hell, faceless, wenige große Objekte, klare Tiefenwirkung, kontrollierter Marken-Lila-Akzent.

## Erst entscheiden: Bild oder Remotion?

### Remotion übernimmt bevorzugt

- Überschriften und Captions
- Zahlen, Rankings, Charts
- Pfeile, Connectoren, Prozessdiagramme
- präzise UI/Chat/App-Texte
- Karten, Labels und Callouts
- animierte Fokuswechsel

### Bild-KI übernimmt bevorzugt

- hochwertige räumliche 3D-Szenen
- reale/stilisierte Alltagssituationen
- komplexe Objektgruppen
- visuelle Metaphern
- Material, Licht, Schatten, Perspektive
- Umgebungen, die mit CSS/SVG unnötig teuer wären

Kein Bild erzeugen, wenn Remotion dieselbe Aussage klarer und kontrollierter bauen kann.

## Feste visuelle Regeln

- vertikal 9:16, Komposition für 1080 × 1920
- weiß oder sehr hellgrau / leicht lila getönt
- leicht isometrisch oder klare redaktionelle Perspektive
- weiche realistische Schatten
- hochwertige matte/halbmatte 3D-Materialien
- 3–5 große Hauptobjekte als Richtwert
- ein klarer Fokus
- großzügige Abstände
- `#B98CFF` nur als gezielter KI-/Fokus-Akzent
- `#6E45C9` für Tiefe/Kontrast
- Grün nur Lösung/Vorteil
- Rot nur Risiko/Fehler/Grenze

## Faceless

- keine erkennbaren Gesichter
- keine Porträts
- keine Face-Cam-Optik
- Person nur, wenn sie inhaltlich nötig ist: von hinten, angeschnitten oder stilisierte gesichtslose Figur
- keine Roboterfigur als generisches KI-Symbol

## Safe-Zones

- oben mindestens ca. 110 px ruhig lassen
- unten mindestens ca. 220 px ruhig lassen
- Hauptmotiv vollständig im mittleren sicheren Bereich
- keine wichtigen Hände/Objekte/Labels an den Rand
- keine sichtbaren Safe-Zone-Linien rendern

## Text im generierten Bild

Standard: **kein Text im Bild**.

Nur wenn ein Objektlabel für das Verständnis unverzichtbar ist:

- maximal 0–3 Labels
- Deutsch
- 1–3 Wörter je Label
- keine Überschrift
- kein Untertitel
- kein Erklärungssatz
- keine Zahlen, die Remotion präziser darstellen kann

## Sprache der Prompts

Der vollständige Bildgenerierungs-Prompt wird standardmäßig **auf Englisch** geschrieben, weil räumliche, Material-, Kamera- und Lichtanweisungen so konsistent modellübergreifend formuliert werden können.

Sichtbarer Text im Bild bleibt, falls unvermeidbar, ausschließlich deutsch.

## Pflichtstruktur jedes Bildprompts

Jeder finale Prompt in `02-bilder/image-prompts.md` muss diese Informationen enthalten:

1. **Scene intent** — eine Aussage, die das Bild erklären soll
2. **Visual metaphor / situation** — eine einzige klare Bildidee
3. **Main subjects** — wenige konkrete Objekte
4. **State / relationship** — was zwischen den Objekten sichtbar wahr sein muss
5. **Composition** — Vordergrund/Mitte/Hintergrund, Fokus und freie Bereiche
6. **Camera** — vertikal, Perspektive, Brennweitencharakter ohne extreme Verzerrung
7. **Materials and lighting** — hochwertig, editorial, weiche Schatten
8. **Brand accents** — Lila gezielt, nicht alles lila
9. **Safe zones** — oben/unten frei
10. **Negative constraints** — Gesichter, Cyberpunk, Wasserzeichen, zufälliger Text usw.
11. **Remotion separation** — ausdrücklich nennen, welche Texte/Overlays später Remotion baut
12. **Output filename** — erwarteter Asset-Name

## Canonical Prompt-Template

```text
Create a premium stylized 3D editorial illustration for a German AI explainer reel, vertical 9:16, composed for 1080x1920.

SCENE INTENT:
[one precise idea the viewer must understand]

VISUAL CONCEPT:
[one simple physical scene or metaphor; no infographic collage]

MAIN SUBJECTS:
[3–5 large concrete objects, their positions and relationships]

VISIBLE STATE / RELATIONSHIP:
[what must be visually true; start/result relationship if relevant]

COMPOSITION AND CAMERA:
clean editorial composition, strong central hierarchy, slightly isometric or natural product-illustration perspective, no extreme wide-angle distortion, important subjects fully inside the middle safe area, calm negative space above and below.

MATERIALS AND LIGHTING:
premium simplified 3D forms, refined matte and semi-matte materials, soft realistic contact shadows, subtle ambient occlusion, controlled studio lighting, crisp silhouettes, high-quality editorial rendering.

BRAND:
white or very light warm-gray/lilac background; #B98CFF used only as the main AI/focus accent; #6E45C9 only for depth or contrast; natural object colors elsewhere.

FACELESS:
no recognizable faces, no portraits, no face-cam framing; if a human presence is essential, show only a faceless simplified figure, back view, crop, or hands.

TEXT:
no headline, no subtitle, no paragraph text, no random letters, no watermark. If absolutely necessary, use only the explicitly listed short German object labels: [labels or NONE].

SAFE ZONES:
keep approximately the top 110 px and bottom 220 px visually calm and free of essential objects or labels. Do not draw guides or safe-zone lines.

REMOTION WILL ADD:
[headline / captions / arrows / exact numbers / UI labels / NONE]. Do not bake these elements into the image.

AVOID:
cyberpunk, neon sci-fi, dark server rooms, generic robots, overloaded infographic layouts, tiny objects, excessive icons, excessive arrows, random text, watermarks, distorted hands, cropped key objects, duplicate objects, inconsistent perspective.

OUTPUT:
clean premium 3D editorial image, mobile-readable composition, filename: [scene-XX-description.png].
```

## Dateinamen

Für Reel-Assets:

```text
scene-01-<kurzer-name>.png
scene-02-<kurzer-name>.png
...
```

Mehrere Layer:

```text
scene-03-bg.png
scene-03-subject.png
scene-03-overlay-mask.png
```

Keine Namen wie `final2.png`, `image123.png` oder `neu.png`.

## Qualitätsgate für jedes erzeugte Bild

Vor Freigabe tatsächlich prüfen:

- Aussage ohne Überschrift erkennbar
- richtige 9:16-Komposition
- keine erkennbaren Gesichter
- kein Wasserzeichen
- kein zufälliger/fehlerhafter Text
- keine abgeschnittenen Hauptobjekte
- keine deformierten Hände/Objekte
- konsistente Perspektive und Schatten
- Marken-Lila gezielt statt flächig
- genügend Raum für Remotion-Header und Captions
- Smartphone-Lesbarkeit
- kein unnötiges Objekt

Wenn zwei oder mehr dieser Punkte scheitern: Bild neu generieren oder Bildstrategie ändern; nicht mit Overlays kaschieren.
