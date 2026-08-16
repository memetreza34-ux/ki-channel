# KI-Kanal — Bild- und Prompt-System

## Zweck

Generierte Bilder sind **Erklärassets**, keine Dekoration. Ein Bild wird nur eingesetzt, wenn eine räumliche, objektbasierte oder alltägliche Szene die Aussage schneller verständlich macht als reine Remotion-Grafik.

**Ab sofort gilt zusätzlich:** Symbole, UI, Diagramme und erklärende Grafiken werden bevorzugt **direkt mit React, SVG, CSS und Remotion** gebaut. Sie dürfen nicht aus Bequemlichkeit als KI-Bild erzeugt werden, wenn ein sauberer Code-Nachbau technisch vernünftig möglich ist.

Standardstil für wirklich notwendige Bilder:

> hochwertige vereinfachte 3D-Editorial-Illustration, hell, faceless, wenige große Objekte, klare Tiefenwirkung, kontrollierter Marken-Lila-Akzent.

## Erst entscheiden: Remotion-native, Hybrid oder Bild?

Vor **jedem** geplanten Bildasset zuerst prüfen:

> Kann dieser visuelle Bestandteil sauber, hochwertig, skalierbar und kontrollierbar mit React/SVG/CSS in Remotion gebaut werden?

Wenn **ja** → `REMOTION_NATIVE` und **kein Bild erzeugen**.

Wenn **teilweise** → `HYBRID`: nur das komplexe Motiv als Bild; Text, UI, Pfeile, Zustände, Diagramme und andere präzise Informationsschichten bleiben Remotion-native.

Nur wenn Remotion inhaltlich oder qualitativ klar unterlegen wäre → `IMAGE_REQUIRED`.

### Remotion übernimmt standardmäßig

- Überschriften und Captions
- Icons und Symbole
- Zahlen, Rankings und Charts
- Pfeile, Connectoren und Prozessdiagramme
- App-, Browser-, Smartphone- und Desktop-UI
- Buttons, Inputs, Cards, Tabs, Dialoge und Menüs
- Code-/Terminal-Fenster und Dateibäume
- Nodes, Timelines, Branches, Commits und Statusanzeigen
- präzise UI/Chat/App-Texte
- Karten, Labels und Callouts
- animierte Fokuswechsel und Zustandsänderungen
- einfache 2D-/2.5D-Objekte und technische Formen

### Bild-KI übernimmt nur bei echtem Mehrwert

- hochwertige räumliche 3D-Szenen
- reale/stilisierte Alltagssituationen
- komplexe organische Objektgruppen
- visuelle Metaphern, die als physische Szene funktionieren
- Material, Licht, Schatten und Perspektive bei komplexen physischen Motiven
- aufwendige Produkte oder Umgebungen
- Umgebungen, die mit CSS/SVG unverhältnismäßig teuer wären
- fotografische/cinematic Motive

Kein Bild erzeugen, wenn Remotion dieselbe Aussage klarer und kontrollierter bauen kann.

**Bitmap-Icons, Screenshot-UI oder generierte Interface-Bilder sind nicht erlaubt, wenn SVG/React/CSS dieselbe Funktion sauber übernehmen kann.**

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

Nur wenn ein Objektlabel für das Verständnis unverzichtbar ist und nicht sinnvoll als Remotion-Ebene darüberliegen kann:

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
2. **Why image is required** — warum `REMOTION_NATIVE` nicht die bessere Lösung ist
3. **Visual metaphor / situation** — eine einzige klare Bildidee
4. **Main subjects** — wenige konkrete Objekte
5. **State / relationship** — was zwischen den Objekten sichtbar wahr sein muss
6. **Composition** — Vordergrund/Mitte/Hintergrund, Fokus und freie Bereiche
7. **Camera** — vertikal, Perspektive, Brennweitencharakter ohne extreme Verzerrung
8. **Materials and lighting** — hochwertig, editorial, weiche Schatten
9. **Brand accents** — Lila gezielt, nicht alles lila
10. **Safe zones** — oben/unten frei
11. **Negative constraints** — Gesichter, Cyberpunk, Wasserzeichen, zufälliger Text usw.
12. **Remotion separation** — ausdrücklich nennen, welche Texte/Overlays später Remotion baut
13. **Output filename** — erwarteter Asset-Name

## Canonical Prompt-Template

```text
Create a premium stylized 3D editorial illustration for a German AI explainer reel, vertical 9:16, composed for 1080x1920.

SCENE INTENT:
[one precise idea the viewer must understand]

WHY IMAGE IS REQUIRED:
[one concrete reason why React/SVG/CSS/Remotion alone is not the better visual solution]

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
[headline / captions / arrows / exact numbers / UI / labels / state changes / NONE]. Do not bake these elements into the image.

AVOID:
cyberpunk, neon sci-fi, dark server rooms, generic robots, overloaded infographic layouts, tiny objects, excessive icons, excessive arrows, random text, watermarks, distorted hands, cropped key objects, duplicate objects, inconsistent perspective, generated UI that should have been built in Remotion.

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

- Bildbedarf gegenüber `REMOTION_NATIVE` konkret begründet
- Aussage ohne Überschrift erkennbar
- richtige 9:16-Komposition
- keine erkennbaren Gesichter
- kein Wasserzeichen
- kein zufälliger/fehlerhafter Text
- keine generierte UI, die besser als React/SVG/CSS gebaut worden wäre
- keine abgeschnittenen Hauptobjekte
- keine deformierten Hände/Objekte
- konsistente Perspektive und Schatten
- Marken-Lila gezielt statt flächig
- genügend Raum für Remotion-Header und Captions
- Smartphone-Lesbarkeit
- kein unnötiges Objekt

Wenn zwei oder mehr dieser Punkte scheitern: Bild neu generieren oder Bildstrategie ändern; nicht mit Overlays kaschieren.
