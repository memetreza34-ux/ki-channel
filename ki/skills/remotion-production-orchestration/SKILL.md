---
name: remotion-production-orchestration
description: >
  Verbindlicher Remotion-Ausfuehrungspfad fuer KI-Channel-Reels und Longform.
  Aktivieren, sobald Visual Strategy und Story feststehen und Remotion-Code,
  Studio-Preview, Audio/Caption-Integration, Rendering oder Remotion-QA ansteht.
---

# Remotion Production Orchestration

## Zweck

Dieser Skill verbindet die kreative V2-Produktionslogik des Repos mit der realen
Remotion-Ausfuehrung. Er ersetzt weder `reel-production-pipeline` noch die
Visual Strategy. Er beginnt **erst**, wenn klar ist, was der Zuschauer sehen soll.

## Vorbedingungen

Vor Remotion-Implementierung lesen:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/gehirn/VISUAL_STRATEGY.md`
6. reel-/longform-spezifischen Vertrag
7. `ki/gehirn/REMOTION_ANIMATION_CAPABILITIES.md`

Bei neuen Reels zusaetzlich muss `visual-strategy.md` pro Beat Modality, Hauptverb,
Startzustand, sichtbare Veraenderung und Endzustand enthalten.

## Offizielle Remotion-Skills

Wenn die Umgebung die Remotion Agent Skills bereitstellt, in dieser Reihenfolge
nur die fuer die konkrete Aufgabe benoetigten laden:

- `remotion-best-practices` — Router / Startpunkt
- `remotion-markup` — React-Markup, framebasierte Animation, Media, 3D, Effekte
- `remotion-interactivity` — editierbare Studio-Struktur, wenn sinnvoll
- `remotion-captions` — Caption-Daten und Darstellung
- `remotion-studio` — Preview
- `remotion-render` — Export/Stills
- `remotion-docs` — aktuelle API-Verifikation
- `remotion-upgrade` — nur bei explizitem Versions-/Upgrade-Schritt
- `remotion-multimedia` — nur fuer echte Media-Analyse/Trim/Crop-Metadaten
- `remotion-maps` — nur fuer Karten/Geo-Szenen

Die Repo-Version ist die technische Baseline. Keine neuere API aus einem Skill
uebernehmen, bevor sie fuer die installierte Remotion-Version verifiziert wurde.

## Harte Remotion-Regeln

- Animation ueber `useCurrentFrame()`, `interpolate()`, `spring()` bzw. repo-eigene Easing-Helfer.
- Keine CSS-`transition`, CSS-`animation` oder Tailwind-Animation als Render-Timing.
- Kein `Math.random()` oder nicht-deterministische Renderlogik.
- Keine Render-Time-Netzwerkdownloads.
- Reale Assets ueber stabile lokale/staticFile-Pfade oder explizite Props.
- Production-Render immer ueber `ki/src/production-entry.tsx`.
- Studio/Preview ueber `ki/src/index.ts` bzw. `Root.tsx`.
- `MotionPreviewRoot` darf nie in den Production-Entry gelangen.
- Jede neue Production-Composition wird in `ProductionRoot.tsx` registriert.
- Audio ist in Phase 3 real vorhanden und wird explizit integriert; keine Fake-Audio-Datei.
- Captions folgen dem final verwendeten Audio, nicht nur geschaetzten Phase-1-Cues.
- Direkte Frame-Seeks muessen korrekt aussehen; Animation darf nicht von vorherigen Frames abhaengen.

## Caption Contract

Neue oder ueberarbeitete Caption-Pipelines orientieren sich am offiziellen
`Caption`-Datenmodell aus `@remotion/captions`:

```ts
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};
```

Phase 1 darf Planungs-Cues fuehren. Phase 3 erzeugt/justiert finale Zeiten gegen
das tatsaechlich verwendete Voiceover. Kein Caption-Timing nur aus Gesamtlaenge
linear verteilen.

## Studio

Standard:

```bash
npm run remotion:studio
```

Wenn File-Watcher-Limits auftreten:

```bash
npm run remotion:studio:poll
```

Studio ist fuer Preview und visuelle Inspektion. Ein Studio-Eindruck ersetzt
keinen Production-Render.

## Implementierung

Pro Visual Beat:

```text
Sprecherbedeutung
-> sichtbarer Startzustand
-> eine dominante Veraenderung
-> lesbarer Endzustand
-> echte Audio-/Caption-Zeit
```

Erst semantische Mechanik waehlen, dann Komponente/Library. `REUSE_EXACT` nur bei
exaktem Fit. Sonst `NEW_BUILD`.

## Production-Root

Vor Render:

```bash
npm run remotion:integration-check
```

Der Check muss mindestens sichern:

- alle `remotion` / `@remotion/*` Pakete sind versionsgleich
- Studio- und Production-Entry existieren und sind getrennt
- ProductionRoot existiert
- Remotion-Skill/Agent-Routing ist vorhanden
- Studio-/Readiness-Scripts existieren

## Phase-3-Ausfuehrung

1. Voiceover und Pflichtassets pruefen.
2. Audio-Dauer/Pausen/Phrasen analysieren.
3. Timeline an reale Sprache koppeln.
4. Captions gegen finales Audio ausrichten.
5. `npm run remotion:readiness` ausfuehren.
6. relevante Smoke-Stills rendern und **ansehen**.
7. sichtbare Fehler an der Source beheben.
8. finales MP4 ueber Production-Entry rendern.
9. technische Post-Render-QA.
10. unabhaengigen `remotion-release-reviewer` fuer finalen Review verwenden.

## Stop-Bedingungen

Nicht render-ready melden bei:

- fehlendem Voiceover / Pflichtasset
- Remotion-Version-Mismatch
- Production-/Studio-Root-Verwechslung
- CSS-Timing statt framebasierter Animation
- nicht verifizierter Remotion-API
- nicht bestandener Readiness
- nicht angesehenen Smoke-Frames
- Caption-/Audio-Mismatch
- sichtbarer Animation in der Caption-Safe-Zone
- Creative-QA-FAIL

## Upgrade-Regel

Remotion nicht nebenbei aktualisieren. Bei einem Upgrade:

1. `remotion-upgrade` anwenden.
2. alle `remotion` und `@remotion/*` Pakete auf **exakt dieselbe** Version bringen.
3. `npx remotion versions` pruefen.
4. TypeScript, Tests, Readiness, Smoke-Render und finalen Review erneut ausfuehren.
