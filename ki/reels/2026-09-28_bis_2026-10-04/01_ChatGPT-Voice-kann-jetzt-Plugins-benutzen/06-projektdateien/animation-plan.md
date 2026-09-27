# Animation Plan — ChatGPT Voice kann jetzt Plugins benutzen

**Status:** FERTIG — Phase-1-Timing, vor echtem Audio

## Global

- 1080×1920, 30 fps
- geplant: 1470 Frames / 49 s
- 7 Szenen à 210 Frames als semantische Grundstruktur
- keine CSS-Timelines; nur Remotion-Frames
- Caption-Zone ab ca. y=1440 freihalten
- keine externe Bildgenerierung

## Szene 1 — Voice → Workflow

Dunkler Hero. Voice-Orb pulsiert, Tool-Signale öffnen sich sofort. Große Kinetic-Type-Bewegung macht den Zustandswechsel sichtbar. Kein Intro-Hold.

## Szene 2 — Web / iOS / Android

Echte `ThreeCanvas`-Szene mit drei räumlichen Device-Objekten. Remotion-Frame steuert Rotation/Drift; kein R3F-`useFrame()`.

## Szene 3 — Plugin-Netz

Mehrere `AnimatedDataPath`-Routen laufen vom Voice-Core zu semantischen Tool-Endpunkten. Payloads bewegen sich sichtbar entlang der Wege.

## Szene 4 — Work erzeugt Artefakte

2.5D-Workspace. Ein Voice-Objekt morphiert nacheinander zu Dokument, Slides und Sheet. Tiefe entsteht über `DepthStage`, nicht über Cards.

## Szene 5 — Call endet, Aufgabe läuft weiter

Memorable Beat: Call-Ring schließt/verschwindet, aber der Pfad bleibt in Bewegung und endet in großer `TEXT`-Typografie.

## Szene 6 — Grenzen

Schutz-/Limit-Ringe, Locks und kontrollierte Geometrie bauen sich um den Workflow-Hub. Keine rote Warnkarte.

## Szene 7 — Verdict

Voice-Wellen verdichten sich zu Hub. Große Abschlusszeile `WORKFLOW-STEUERUNG` wird Hauptvisual. Kurzer lesbarer End-Hold.
