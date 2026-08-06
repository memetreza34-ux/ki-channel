# Meaning-first Motion System v1

Dieses System verhindert, dass Sprechertext direkt in zufällige Karten, Pfeile und Fades übersetzt wird.

## Pflichtkette

`Sprechertext → Kommunikationsziel → sichtbarer Ausgangszustand → bedeutungsvolle Veränderung → Endzustand → Render-Modus → Qualitätsprüfung`

Jeder Beat braucht eine sichtbare Zustandsänderung. Ambient Motion, Partikel, schwebende Karten oder ein Kamerazoom zählen nicht als Hauptveränderung.

## Render-Modi

- `image`: komplexe räumliche 3D-Editorial-Szene; Remotion bewegt nur Kamera, Fokus und Overlays.
- `remotion`: UI, Zahl, Text, Markierung oder einfache präzise Transformation.
- `hybrid`: 3D-Szene plus gezielte Remotion-Ebene für Ursache, Beleg oder Veränderung.

## Szenenarchetypen v1

- `cause_effect`
- `before_after`
- `problem_solution`
- `input_process_result`
- `comparison`
- `spatial_metaphor`
- `ui_demo`

Mehr als zwei gleiche Archetypen hintereinander sind verboten. Ein Reel darf nicht ausschließlich aus Karten- oder UI-Szenen bestehen.

## Qualitätsgate

Vor dem Vollrender werden Hook, jeder Szenenwechsel, der dichteste Informationsmoment und das Ende als Kontrollframes gerendert. Eine Szene wird neu geplant, wenn:

- die Aussage ohne Untertitel nicht erkennbar ist;
- die Bewegung nur dekorativ ist;
- das Layout vorherige Szenen wiederholt;
- wichtige Inhalte in den oberen 96 px oder unteren 195 px liegen;
- mehr als eine Hauptaussage gleichzeitig erklärt wird;
- die visuelle Bewertung unter 8/10 liegt.

## Verwendung

```bash
npm run motion:route -- ki/examples/example-beats.json ki/examples/example-motion-plan.json
npm run validate:motion-router -- ki/examples/example-motion-plan.json
```
