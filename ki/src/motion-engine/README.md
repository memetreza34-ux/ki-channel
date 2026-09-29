# Motion Engine V1

Dieses Modul ist die kanonische Bewegungs-Schicht fuer hochwertige Remotion-Szenen.

Ziel: Nicht mehr `Element erscheint -> steht`, sondern choreografierte Bewegung mit klaren Phasen:

`anticipation -> acceleration -> impact -> overshoot -> settle -> alive hold`

## Grundregeln

- Eine Capability ist kein Qualitaetsbeweis.
- `NEW_BUILD` darf nicht automatisch auf einen kleinen Satz Standard-Layouts reduziert werden.
- Kamera, Hero-Objekt und Support-Objekte werden als gemeinsame Choreografie geplant.
- Ein Hold darf visuell ruhig sein, aber nicht tot: Licht, Perspektive, Fokus oder Objektspannung duerfen subtil weiterleben.
- Grosse Bewegung braucht Motion Blur oder eine andere Geschwindigkeitslesbarkeit.
- Kamera-Shake ist nur bei Impact erlaubt und muss abklingen.
- UI-/Card-Komponenten sind keine Motion-Engine-Primitives.

## Kanonische Primitives

- `CinematicCameraRig`
- `ChoreographedObject`
- `ImpactShake`
- `AliveHold`
- `DirectionalBlur`
- `SceneMotionOrchestrator`

## Einsatz

Neue Hero-Szenen sollten direkt auf diesen Primitives oder auf reel-spezifischem TSX aufbauen. Die alte `TechVisualKit`/`CreativeRecipeRuntime`-Schicht darf fuer einfache Utility-Szenen weiter existieren, ist aber keine Standardquelle fuer Hero-Motion.
