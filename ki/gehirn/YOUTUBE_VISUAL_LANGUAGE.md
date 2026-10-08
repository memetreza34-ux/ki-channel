# YouTube Visual Language — Cinematic Editorial Tech

**Status:** kanonisch für neue KI-YouTube-Longform-Produktionen  
**Format:** 1920×1080, 30 FPS, faceless, deutsch  
**Engine:** Remotion ist die vollständige Composition-, Motion- und Render-Ebene.

## 1. Ziel

Der Kanal soll wie eine hochwertige animierte Tech-Dokumentation wirken — nicht wie ein SaaS-Dashboard, eine PowerPoint-Präsentation oder generischer Neon-KI-Content.

Die visuelle Identität heißt:

> **Cinematic Editorial Tech**

Sie verbindet:

- klare Editorial-Komposition
- große bedeutungstragende Objekte
- kontrollierte 2D-/2.5D-Tiefe
- echte Software-/Produktbeweise, wenn sie für die Wahrheit nötig sind
- präzise Daten-/Code-/UI-Darstellung
- ruhige Basis + scharfe semantische Motion-Ereignisse
- wenige wiederkehrende Markenmerkmale statt immer derselben Szene

## 2. 100-%-Remotion-Regel

Jeder finale Frame wird in Remotion komponiert und gerendert.

Erlaubt innerhalb von Remotion:

- React / SVG / CSS
- @remotion/shapes / @remotion/paths / @remotion/effects
- Charts und Datenvisualisierung
- Browser-, App-, Code- und Terminal-Illustrationen
- 2.5D und React Three Fiber, wenn echte Tiefe nötig ist
- echte Screenshots oder Screen-Captures als Beweis-Layer
- Audio, Captions, Masken, Fokus, Zoom, Crop und Compositing

Nicht als Standard:

- After Effects
- Premiere als visuelle Haupt-Assembly
- Canva-Video
- externe KI-Bilder oder KI-Videos nur zur Dekoration
- fremde Motion-Templates als fertige Bildwelt

Ein echter Capture bleibt echtes Quellenmaterial. Remotion rahmt und erklärt ihn; es fälscht ihn nicht.

## 3. Farbwelt

### Helle Basis

- Surface: `#F6F7FB`
- Paper: `#FFFFFF`
- Ink: `#141621`
- Muted Ink: `#667085`
- Purple: `#6E45C9`
- Purple Light: `#B98CFF`
- Info Blue: `#3D8BFF`
- Success: `#1E835C`
- Error: `#D95C6A`

### Dark Reset

Etwa 10–20 % eines Longform-Videos dürfen bewusst als dunkle Hero-/Reset-Szene gestaltet werden:

- Dark Surface: `#12131A`
- Dark Raised: `#1A1C26`
- Light Ink: `#F5F7FB`

Dunkel ist ein dramaturgischer Reset, kein zweites Standardtheme.

## 4. Typografie

Für den KI-Kanal gilt:

- Display/Titel: **Inter**, schwer und kompakt
- Body/UI: **Inter**
- Code/Terminal: system-monospace; später nur mit lokal render-sicher vorhandener Mono-Schrift ersetzen

Bebas Neue ist für neue KI-Longform-Titel nicht mehr die Standard-Display-Schrift.

Text dient der Orientierung, nicht als Ersatz für Visuals.

## 5. Wiedererkennungsmerkmal: Signal Thread

Das wiederkehrende Markenelement ist ein violetter **Signal Thread**.

Er ist keine Dekolinie, sondern visualisiert Informationsfluss und kann sich semantisch verwandeln:

- Prompt → Datenpfad
- Datenpfad → Token-/Agentenfluss
- Pfad → Chart-Achse
- Pfad → Verbindung zwischen Modellen
- Pfad → Code-/Terminal-Fokus
- Pfad → Unterstreichung eines Ergebnisses

Regeln:

- nie permanent dominant
- nie in jeder Szene identisch
- muss an die Sprecherbedeutung gebunden sein
- darf Szenen über Objektkontinuität verbinden
- keine zufällige Loop-Bewegung nur als Branding

## 6. Fünf primäre Visual-Familien

Neue Longform-Beats werden bevorzugt aus diesen Familien gebaut.

### A. HERO_OBJECT

Großes einzelnes Objekt oder System als Fokus.

Beispiele:

- Modell-Core
- Browser
- Smartphone
- GPU/Chip
- Datei
- Bild-/Video-Frame
- Mikrofon
- Repository

### B. PROCESS_SYSTEM

Sichtbarer Ablauf mit Startzustand, Veränderung und Endzustand.

Beispiele:

- Tokenfluss
- Agenten-Workflow
- Retrieval/RAG
- Daten-/Tool-Calls
- Pipeline
- Fehlerkaskade

### C. PRODUCT_EVIDENCE

Echter Produktbeweis innerhalb von Remotion.

Beispiele:

- echter Capture
- echter Output
- GitHub-Stand
- reale Modellantwort
- aktuelle UI

### D. COMPARISON_DATA

Zwei oder mehr Systeme teilen eine gemeinsame Bewertungslogik.

Beispiele:

- A/B-Output
- Ranking-Leiter
- Preis-/Leistungsachse
- Benchmark
- Stärken-/Schwächen-Matrix

### E. KINETIC_TYPE

Nur für sehr starke Aussagen, Kapitelresets oder Reveal-Momente.

Nicht für normale Erklärpassagen.

## 7. Produktionsregeln

- Große Visuals vor kleinen Cards.
- Grid ist Werkzeug, nicht permanenter Hintergrund.
- Nodes/Kreise nur wenn Netz-, Prozess- oder Beziehungslogik erklärt wird.
- Rounded Cards nur wenn die Karte semantisch wirklich ein Dokument, UI-Element, Datensatz, Nachricht, Datei oder Token ist.
- Keine drei Kapitel hintereinander mit Dashboard-/Panel-Grammatik.
- Mindestens ein deutlicher Hero-Moment pro Video.
- Über ein 5–6-Minuten-Video mehrere größere visuelle Resets verteilen.
- 3D nur wenn Tiefe Verständnis erzeugt; nicht als Premium-Abkürzung.
- Markenlogos nur redaktionell korrekt und nicht als Ersatz für Erklärung.

## 8. Motion Language

Kanonische Runtime: `ki/src/motion/easing.ts` + `ki/src/motion/choreography.ts`.

Grundwerte bei 30 FPS:

- Micro: ca. 5–8 Frames
- Standard: ca. 10–16 Frames
- Hero: ca. 18–28 Frames
- Kamera: grob 24–60 Frames, wenn semantisch gerechtfertigt
- Stagger: meist 2–4 Frames

Signatur:

- normaler Enter: `cubic-bezier(0.2, 0, 0, 1)`
- Hero Enter: `cubic-bezier(0.16, 1, 0.3, 1)`
- Move: `cubic-bezier(0.65, 0, 0.35, 1)`
- kein Bounce/Overshoot als Default

Motion-Principles:

1. Startzustand → sichtbare Veränderung → Endzustand.
2. Hero / Support / Texture.
3. Objektkontinuität vor ständig neuen Slides.
4. Hard Cut als Standard.
5. Morph/Push/Mask nur bei echter semantischer Kontinuität.
6. Eine dominante Kamerabewegung pro Beat.
7. Keine Idle-Motion gegen Langeweile.
8. Effects sind Finish, niemals Ersatz für Choreografie.
9. Follow-through darf Support-Layer 2–4 Frames später landen lassen.
10. Voiceover bestimmt Beat-Timing.

## 9. Layout und Rhythmus

16:9 wird für Longform nativ komponiert, nicht aus 9:16 hochskaliert.

Richtwerte:

- Außenränder typischerweise 80–120 px
- klare Fokalzone statt gleichmäßiger Verteilung
- große Objekte und Beweise laptop-/TV-lesbar
- negative Fläche bewusst nutzen
- Kapitelmarker klein; Hauptvisual trägt die Aussage
- keine permanente Fortschritts-/Dashboard-Leiste als Standardmarkenelement

Ein visueller Reset kann sein:

- hell → dunkel
- Überblick → Detail
- UI → physische/2.5D-Metapher
- Prozess → direkter Vergleich
- Capture → abstrakte Erklärung
- statischer Ergebniszustand → große Transformation

## 10. Referenzen und Library

Externe Motion-Referenzen kommen erst nach Story, Visual Strategy und Choreography.

Verbindlich:

- `MOTION_REFERENCES.md`
- `APPROVED_KI_VISUALS.md`

Referenzen liefern Mechanik, nicht Bildwelt.

## 11. Qualitätsgate

Ein Longform-Video ist nicht fertig, weil TypeScript und Render grün sind.

Vor Freigabe visuell prüfen:

- klare Bildsprache über alle Kapitel
- keine zufällige Template-Sammlung
- keine Dashboard-Monotonie
- eindeutiger Hero pro Beat
- Motion folgt Bedeutung
- große Visual-Veränderungen über die Laufzeit
- Dark Resets nur bewusst
- Grid/Card/Nodes nicht als Gewohnheit
- Captures groß und lesbar
- Text nicht als Ersatz für Illustration
- Thumbnail separat in klein prüfen

Diese Datei schlägt ältere Longform-Regeln, wenn sie der 100-%-Remotion- oder Cinematic-Editorial-Tech-Positionierung widersprechen.
