# Maximum-Remotion-Regel — alles Machbare zuerst in Code

Diese Regel verschärft `REMOTION_NATIVE_VISUALS.md` für alle neuen Reels.

## Grundsatz

**Versuche grundsätzlich zuerst, den kompletten sichtbaren Reel-Inhalt direkt in Remotion zu bauen — nicht nur UI, Symbole und Diagramme, sondern auch illustrative Bildwelten, Mockups, Objekte und visuelle Metaphern, sofern sie mit React, SVG, CSS, Canvas oder WebGL hochwertig darstellbar sind.**

Ein externes oder KI-generiertes Bild ist die Ausnahme, nicht der normale Weg.

## Was möglichst Remotion-native gebaut wird

Neben UI, Icons, Charts und technischen Grafiken ausdrücklich auch:

- illustrative Hero-Motive
- Cover-Motive und Thumbnail-artige Kompositionen
- stilisierte Produktdarstellungen, wenn keine echte Fotorealistik nötig ist
- Geräte, Laptops, Smartphones, Browserfenster und Screens
- Ordner, Dokumente, Karten, Boxen, Akten, Clouds, Server, Datenpakete und ähnliche Erklärobjekte
- 2D- und 2.5D-Szenen mit Perspektive
- einfache pseudo-3D-Objekte über CSS-Transforms, SVG, Layering, Schatten und Gradients
- abstrakte Räume, Bühnen, Schreibtische, Dashboards und technische Umgebungen
- visuelle Metaphern wie Wege, Türen, Schichten, Trichter, Netzwerke, Waagen, Stapel, Flüsse und Container
- einfache Landschafts-/Raumkompositionen, wenn sie stilisiert statt fotorealistisch sein dürfen
- Licht, Glow, Schatten, Tiefenstaffelung, Glas-/Karten-Look und Materialillusionen
- Vorher/Nachher-Bilder, Split-Screens und Transformationen
- jedes Symbol, Piktogramm oder logo-ähnliche neutrale Zeichen, das ohne Markenverletzung als SVG gebaut werden kann

## Bevorzugte technische Reihenfolge

1. React + CSS für Struktur, Layout, Karten, Geräte, Flächen und pseudo-3D
2. SVG für Symbole, Illustrationen, Formen, Masken, Pfade und Vektorgrafiken
3. Remotion-Interpolation für Bewegung, Kamera, Fokus und Zustandswechsel
4. Canvas für komplexere 2D-Zeichenlogik
5. WebGL / Three.js nur wenn räumliche Tiefe einen echten Mehrwert bringt
6. Externes Bild erst danach

## Bild nur als letzte Stufe

`IMAGE_REQUIRED` ist nur zulässig, wenn mindestens einer dieser Gründe wirklich vorliegt:

- echte Fotorealistik ist Teil der Aussage
- reale Person/Hände sind inhaltlich unverzichtbar
- ein konkretes reales Produkt muss exakt erkennbar sein
- sehr komplexe organische Natur-/Materialdetails sind zentral
- eine komplexe 3D-Szene wäre in Remotion unverhältnismäßig teuer und qualitativ klar schlechter

Vor `IMAGE_REQUIRED` muss aktiv geprüft werden, ob eine **stilisierte Remotion-Version** die Aussage nicht sogar klarer erklären würde.

## Cover-Regel

Auch Cover werden standardmäßig zuerst als **Remotion-native Hero-Komposition** geplant. Das bedeutet: große Formen, starke Typografie, SVG-Icons, Devices, UI, Before/After, pseudo-3D und kontrollierte Licht-/Schatteneffekte direkt im Code.

Nur wenn das Cover bewusst echte Fotografie, ein reales Produkt oder eine komplexe organische Szene benötigt, darf ein Bildasset verwendet werden.

## Qualitätsprinzip

Remotion-native darf nicht wie eine billige Präsentationsfolie aussehen. Ziel ist ein hochwertiger Social-Media-Look:

- große visuelle Hierarchie
- echte Tiefenwirkung
- saubere Schatten und Layer
- starke Objektformen statt vieler kleiner Cards
- klare Perspektive
- mobile Lesbarkeit
- präzise Brand-Farben
- semantische Bewegung statt Deko

Wenn eine Code-Illustration zu technisch oder flach wirkt, wird sie **besser gestaltet**, nicht sofort durch ein KI-Bild ersetzt.

## Entscheidungsregel

Vor jedem externen Bild:

> Kann ich die Aussage als hochwertige stilisierte Illustration, pseudo-3D-Szene, SVG-Grafik, UI, Objektkomposition oder Motion-Graphic direkt in Remotion bauen?

Wenn ja: **REMOTION_NATIVE**.

Wenn teilweise: **HYBRID**, aber nur der unvermeidbare reale/komplexe Motivteil extern; alles andere bleibt Code.

Wenn nein: **IMAGE_REQUIRED** mit konkreter Begründung.
