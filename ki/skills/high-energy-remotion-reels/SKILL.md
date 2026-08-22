# Skill: High-Energy Remotion Reels

## Zweck

Dieser Skill gilt für alle Short-Form-Produktionen unter `ki/src/reels/`. Er verhindert statische Karten-Animationen, kleine UI-Inseln und visuell leere Reels. Ziel ist **maximale visuelle Erklärung mit maximal sinnvoll ausgereiztem Remotion**.

Zusätzlich ist `ki/skills/entertainment-first-reels/SKILL.md` verbindlich. High Energy ohne Entertainment-Dramaturgie reicht nicht.

## Grundregel

Ein Reel darf nicht wie eine animierte Präsentationsfolie aussehen.

Jede Szene braucht eine **große Hauptmechanik**, sichtbare räumliche Hierarchie, mehrere semantische Zustandswechsel und einen klaren visuellen Payoff. Karten, Panels und Badges sind nur Teil der Szene – niemals automatisch die Szene selbst.

## Product/UI-first

Bei konkreten Apps, Websites, Plattformen oder Features zuerst prüfen, ob die Aussage direkt in einer produktnahen Oberfläche inszeniert werden kann.

Bevor generische Kreise, Nodes oder `ENGINE`-Visuals gebaut werden:

1. reales bereits lokales zulässiges Asset prüfen
2. Remotion-native Produkt-/App-/Browser-/Device-UI prüfen
3. Screenshot/Bild als Layer prüfen, falls lokal vorhanden
4. erst danach abstrakte Metapher wählen

Wenn echte UI die Aussage klarer erklärt, ist abstrakte Visualisierung nur aus Bequemlichkeit nicht zulässig.

## Visual-Energy-Budget

Für Short-Form gilt als Ziel:

- innerhalb ungefähr jeder `0.6–1.5 s` passiert mindestens ein sichtbarer semantischer Micro-Beat, solange neue Sprecherbedeutung kommt
- spätestens bei einer neuen Phrase / neuem Gedanken muss Fokus, Zustand, Kamera oder Objektverhalten reagieren
- kein praktisch unveränderter Zustand länger als ungefähr `1.8 s`, außer bewusstem End-Hold nach abgeschlossener Aussage
- pro Szene normalerweise mindestens `3–6` unterscheidbare Visual Beats
- Hauptmechanik nutzt auf 1080×1920 typischerweise ungefähr `55–85 %` der verfügbaren Visual-Safe-Fläche
- kleine Desktop-Card in großem Weißraum ist ein Qualitätsfehler
- jede Szene braucht mindestens einen klaren Hero-Moment

Nicht künstlich wackeln. Jede Bewegung muss mindestens eine Funktion erfüllen: **erklären, fokussieren, vergleichen, verbinden, blockieren, transformieren, priorisieren, überraschen oder abschließen**.

## Mini-Story innerhalb jeder Szene

Jede Szene soll visuell möglichst diese Progression besitzen:

```text
SETUP → AKTION → KONSEQUENZ → PAYOFF
```

Nicht ausreichend:

```text
Card erscheint
→ schwebt
→ Text erscheint
→ Hold
```

## Remotion vollständig ausreizen

Bevor eine Szene freigegeben wird, aktiv prüfen, welche dieser Techniken die Aussage verbessern:

- spring-basierte Objekt-Entrances statt einfacher Fade-ins
- Kamera-Push, Pull, Pan oder kontrollierter Punch-Zoom
- Parallax zwischen Vordergrund, Hauptobjekt und Hintergrund
- pseudo-3D durch Perspektive, RotateX/RotateY, Layering und Schatten
- SVG-Pfadanimationen, Masken, Clip-Paths und Stroke-Draw bei eigenen Grafiken
- Morphing / Zustandswechsel statt Element austauschen
- Motion Trails, Datenpakete, Partikel und gerichtete Flüsse
- Licht-Sweeps, Scans, Glows und Fokus-Ringe bei **eigenen** UI-/Grafikelementen
- kinetische Schlüsselwörter, Zahlen und Statusbegriffe
- Split-Screen / Before-After / Layer-Reveal
- Objekt-Transformationen und physische Metaphern
- dynamische Diagramme und progressive Charts
- kontrollierte Scene-Transitions, die semantisch aus dem vorherigen Zustand entstehen
- Cursor-, Touch-, Scroll- und Toggle-Choreografie bei UI-Szenen

## Full-Frame vor Card-Layout

Standardentscheidung:

1. Kann die Mechanik selbst den Raum füllen? → **Full-Frame bauen.**
2. Braucht sie einen Rahmen? → Rahmen nur als sekundäre Struktur.
3. Braucht sie mehrere Informationen? → räumlich staffeln, nicht alles in eine weiße Karte legen.
4. Ist das Thema ein Produkt? → Produkt-/UI-Bühne statt abstrakter Card prüfen.

Verbotenes Default-Muster:

`weißer Hintergrund → kleine zentrierte Card → ein Element bewegt sich → mehrere Sekunden Hold`

## Markenassets — brand-safe Motion

Markenassets nie aus Erinnerung ungenau nachzeichnen.

Wenn ein offizielles Markenasset bereits lokal vorhanden und seine Verwendung zulässig ist:

- aktuelle Markenrichtlinien prüfen
- Asset exakt verwenden
- keine verbotenen Änderungen an Form, Farbe, Crop, Textur oder Proportion durchführen
- bei strengen Brand-Regeln primär **Position, Scale des unveränderten Assets, Container, Kamera, Hintergrund und die UI um das Asset herum** animieren
- das Markenasset kann als visueller Anker einer Szene dienen, ohne selbst verfälscht zu werden

### OpenAI-spezifische Vorsicht

Bei offiziellen OpenAI-Markenassets insbesondere nicht:

- verzerren
- croppen
- als Maske verwenden
- unzulässige Varianten erzeugen
- Effekte/Texturen direkt auf die Marke legen, wenn dies die Brand-Regeln verletzt

Wenn kein zulässiges offizielles Asset lokal vorliegt: kein Fake-Logo erzeugen. Stattdessen produktnahe UI oder korrekte Textreferenz verwenden.

## Bilder und Screenshots animieren

Statische Bilder sind kein Endzustand. Bei relevanten echten Bildern / Screenshots mindestens eine semantische Motion-Technik nutzen:

- Ken-Burns nur als Basis, nicht als alleiniger Effekt
- Perspektiv-Tilt / 2.5D-Depth
- Cutout-Layer und Parallax
- Mask-Reveal / Crop-Travel
- Fokus-Zoom auf den relevanten Bereich
- UI-/Diagramm-Layer Remotion-native darüberlegen
- Scanner / Highlight-Rahmen
- Cursor-/Touch-Fokus
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

## Kamera und räumliche Variation

Nicht jede Szene frontal und mittig bauen.

Innerhalb eines Reels bewusst variieren:

- weiter Establish-Zustand
- Push-in auf Detail
- Punch-Zoom auf Schlüsselstatus
- Pull-out für Vergleich oder Konsequenz
- perspektivischer Tilt / 2.5D
- horizontale/vertikale Reise durch UI oder Prozess

Kamera folgt der Bedeutung, nicht dem Wunsch nach Bewegung.

## Scene-Transition-Regel

Szenen nicht nur hart austauschen, wenn ein visueller Zusammenhang möglich ist.

Beispiele:

- Objekt aus Szene A wird zum Kernobjekt in Szene B
- Linie / Datenfluss führt in die nächste Szene
- Kamera fährt durch ein Element
- UI-Element expandiert in den nächsten Vollbildzustand
- Farb-/Lichtzustand trägt die Bedeutung weiter

## Qualitäts-Gate

Vor Freigabe jede Szene in Smartphone-Größe prüfen:

- ist das Hauptobjekt sofort groß genug?
- verändert sich das Bild passend zu jeder neuen Sprecherbedeutung?
- gibt es mindestens einen starken visuellen Moment, den man als Einzelbild wiedererkennt?
- nutzt die Szene Tiefe, Transformation oder gerichtete Bewegung statt nur Fade/Slide?
- wurde bei Produkt-/Feature-Themen echte UI vor abstrakten Kreisen geprüft?
- besitzt die Szene Setup → Aktion → Konsequenz → Payoff?
- wirkt das Reel eher wie Motion Design / UI-Cinema als wie PowerPoint?

Zusätzlich muss das Reel das Entertainment-Gate aus `ki/skills/entertainment-first-reels/SKILL.md` mit mindestens **8/10** bestehen.

Wenn die Antwort bei einem Punkt klar nein ist: Szene neu komponieren, nicht nur weitere Deko hinzufügen.
