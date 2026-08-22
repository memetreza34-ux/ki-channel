# Skill: High-Energy Remotion Reels

## Zweck

Dieser Skill gilt für alle Short-Form-Produktionen unter `ki/src/reels/`. Er verhindert statische Karten-Animationen, kleine UI-Inseln und visuell leere Reels. Ziel ist **maximale visuelle Erklärung mit maximal sinnvoll ausgereiztem Remotion**.

## Grundregel

Ein Reel darf nicht wie eine animierte Präsentationsfolie aussehen.

Jede Szene braucht eine **große Hauptmechanik**, sichtbare räumliche Hierarchie und mehrere semantische Zustandswechsel. Karten, Panels und Badges sind nur Teil der Szene – niemals automatisch die Szene selbst.

## Visual-Energy-Budget

Für Short-Form gilt als Ziel:

- innerhalb ungefähr jeder `0.6–1.5 s` passiert mindestens ein sichtbarer semantischer Micro-Beat, solange neue Sprecherbedeutung kommt
- spätestens bei einer neuen Phrase / neuem Gedanken muss Fokus, Zustand, Kamera oder Objektverhalten reagieren
- kein praktisch unveränderter Zustand länger als ungefähr `1.8 s`, außer bewusstem End-Hold nach abgeschlossener Aussage
- pro Szene normalerweise mindestens `3–6` unterscheidbare Visual Beats
- Hauptmechanik nutzt auf 1080×1920 typischerweise ungefähr `55–85 %` der verfügbaren Visual-Safe-Fläche
- kleine Desktop-Card in großem Weißraum ist ein Qualitätsfehler

Nicht künstlich wackeln. Jede Bewegung muss mindestens eine Funktion erfüllen: **erklären, fokussieren, vergleichen, verbinden, blockieren, transformieren, priorisieren oder abschließen**.

## Remotion vollständig ausreizen

Bevor eine Szene freigegeben wird, aktiv prüfen, welche dieser Techniken die Aussage verbessern:

- spring-basierte Objekt-Entrances statt einfacher Fade-ins
- Kamera-Push, Pull, Pan oder kontrollierter Punch-Zoom
- Parallax zwischen Vordergrund, Hauptobjekt und Hintergrund
- pseudo-3D durch Perspektive, RotateX/RotateY, Layering und Schatten
- SVG-Pfadanimationen, Masken, Clip-Paths und Stroke-Draw
- Morphing / Zustandswechsel statt Element austauschen
- Motion Trails, Datenpakete, Partikel und gerichtete Flüsse
- Licht-Sweeps, Scans, Glows und Fokus-Ringe bei technischer Bedeutung
- kinetische Schlüsselwörter, Zahlen und Statusbegriffe
- Split-Screen / Before-After / Layer-Reveal
- Objekt-Transformationen und physische Metaphern
- dynamische Diagramme und progressive Charts
- kontrollierte Scene-Transitions, die semantisch aus dem vorherigen Zustand entstehen

## Full-Frame vor Card-Layout

Standardentscheidung:

1. Kann die Mechanik selbst den Raum füllen? → **Full-Frame bauen.**
2. Braucht sie einen Rahmen? → Rahmen nur als sekundäre Struktur.
3. Braucht sie mehrere Informationen? → räumlich staffeln, nicht alles in eine weiße Karte legen.

Verbotenes Default-Muster:

`weißer Hintergrund → kleine zentrierte Card → ein Element bewegt sich → mehrere Sekunden Hold`

## Logos und Markenassets animieren

Wenn ein echtes Logo / Markenasset inhaltlich relevant ist und als lokales, zulässiges Asset vorliegt, soll es **nicht nur statisch eingeblendet** werden.

Mögliche Logo-Animationen:

- SVG-Stroke-Draw oder Mask-Reveal
- Logo aus Einzelteilen / Pfaden zusammensetzen
- kontrollierter Scale + Rotation + Depth-Pop
- Licht-Sweep durch die Wortmarke
- Übergang vom Logo in die eigentliche Mechanik
- Logo als Portal, Node, Badge, Gerät oder Systemzustand weiterverwenden

Markenlogo niemals aus Erinnerung ungenau nachzeichnen. Entweder echtes lokales Asset verwenden oder klar als textbasierte Markenreferenz darstellen.

## Bilder und Screenshots animieren

Statische Bilder sind kein Endzustand. Bei relevanten echten Bildern / Screenshots mindestens eine semantische Motion-Technik nutzen:

- Ken-Burns nur als Basis, nicht als alleiniger Effekt
- Perspektiv-Tilt / 2.5D-Depth
- Cutout-Layer und Parallax
- Mask-Reveal / Crop-Travel
- Fokus-Zoom auf den relevanten Bereich
- UI-/Diagramm-Layer Remotion-native darüberlegen
- Light Sweep / Scanner / Highlight-Rahmen
- Bild in Device-/Browser-/Objektszene integrieren
- Übergang aus Bilddetail in eine native Remotion-Erklärung

## Hintergrund ist Teil der Motion

Weiße oder ruhige Flächen dürfen existieren, aber nicht tot wirken. Je nach Thema sinnvoll verwenden:

- langsame Gradient-Verschiebung
- dezente Grid-/Depth-Bewegung
- gerichtete Partikel
- Lichtkegel / atmosphärische Ebenen
- Parallax-Formen

Hintergrundbewegung bleibt subtil und konkurriert nicht mit Caption oder Hauptmechanik.

## Scene-Transition-Regel

Szenen nicht nur hart austauschen, wenn ein visueller Zusammenhang möglich ist.

Beispiele:

- Objekt aus Szene A wird zum Kernobjekt in Szene B
- Linie / Datenfluss führt in die nächste Szene
- Kamera fährt durch ein Element
- Badge wird zum neuen Vollbildzustand
- Farb-/Lichtzustand trägt die Bedeutung weiter

## Qualitäts-Gate

Vor Freigabe jede Szene in Smartphone-Größe prüfen:

- ist das Hauptobjekt sofort groß genug?
- verändert sich das Bild passend zu jeder neuen Sprecherbedeutung?
- gibt es mindestens einen starken visuellen Moment, den man als Einzelbild wiedererkennt?
- nutzt die Szene Tiefe, Transformation oder gerichtete Bewegung statt nur Fade/Slide?
- wirkt das Reel eher wie Motion Design als wie PowerPoint?

Wenn die Antwort bei einem Punkt klar nein ist: Szene neu komponieren, nicht nur weitere Deko hinzufügen.
