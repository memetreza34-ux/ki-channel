# Semantic Micro-Motion Runtime

## Ergebnis

Die semantischen Wortmechanismen sind nicht mehr nur Katalogdaten. Sie besitzen jetzt einen eigenen Remotion-Runtime-Renderer und eine Gallery mit **38 ausführbaren Compositions**.

```text
38 Mikroanimationsmechanismen
38 eindeutige Remotion-Composition-IDs
90 Frames pro Vorschau
1080 × 1920
30 FPS
```

## Unterstützte Renderer

- kinetische Typografie
- Hauptobjekt-Transformationen
- Connectoren und Ursache-Wirkung-Pfade
- Zahlen, Prozentwerte und Stacks
- Warnungen, Quellen, Checks und Callouts
- UI-Panels, Cursor, Scrollen und Commands
- semantische Übergänge

Die Runtime wählt den Renderer anhand der Ebene und der Mechanismus-ID. Kleine Bausteine dürfen gemeinsam genutzt werden; der sichtbare Zweck bleibt pro Mechanismus semantisch definiert.

## Code

```text
ki/src/animation-library/microMotionCatalog.ts
ki/src/animation-library/microMotionRuntime.tsx
ki/src/animation-library/MicroMotionGalleryRoot.tsx
ki/src/animation-library/micro-motion-remotion-entry.tsx
```

## Prüfung

```bash
node scripts/verify-micro-motions.mjs
```

## Smoke-Render

```bash
node scripts/render-micro-motions.mjs smoke
```

Erwartet:

```text
38 Mechanismen × 3 Prüfframes = 114 PNG-Dateien
```

## Vollständiger Render

```bash
node scripts/render-micro-motions.mjs all
node scripts/check-micro-motion-renders.mjs
```

Erwartet:

```text
38 Mechanismen × 5 PNGs = 190 PNG-Dateien
38 Mechanismen × 1 MP4 = 38 MP4-Dateien
Gesamt = 228 technische Artefakte
```

Bericht:

```text
out/semantic-micro-motions/release-report.json
```

## Einsatzregel

Mikroanimationen ergänzen die individuelle Vollanimation der Szene. Sie ersetzen sie nicht.

Pro Szene:

- alle Wörter erscheinen im Untertitel
- jedes wichtige Wort erhält eine semantische Reaktion
- maximal drei Reaktionen dürfen stark sein
- weitere wichtige Wörter werden ruhig unterstützt
- ein Sound-Cue darf nur an eine sichtbare Aktion gebunden sein
- der Anfang und das Ergebnis erhalten einen lesbaren Hold

## Ehrlicher Status

Als Code vorhanden:

- 38 Remotion-Compositions
- eigener Gallery-Root
- eigener Renderplan
- Smoke-, Still- und Video-Pipeline
- 228-Artefakte-Vertrag
- TypeScript-, Vitest- und Node-Test-Wrapper

Noch nicht bestätigt:

- erfolgreicher TypeScript-Lauf
- bestandene Tests
- erfolgreiche 114 Smoke-PNGs
- erfolgreiche 190 vollständige PNGs
- erfolgreiche 38 MP4s
- manuelle visuelle Abnahme

Kein Mechanismus gilt ohne tatsächlichen Render und Sichtprüfung als `verified`.
