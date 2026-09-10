# Antigravity — YouTube Longform Capability Matrix

Diese Datei beschreibt **was das Repo bereitstellt**. Sie ist kein Ersatz für eine echte Runtime-Ausführung.

Vor jedem neuen YouTube-Longform-Video:

```bash
node scripts/check-antigravity-longform-capabilities.mjs
```

Nur ein realer Exit 0 erlaubt, die Repository-/Runtime-Capabilities als `READY` zu bezeichnen.

## Medien

| Fähigkeit | Repo-Pfad | Bedeutung |
|---|---|---|
| aktuelle Web-/Source-Recherche | Longform Orchestrator + Browser/Chrome | Quellen und konkrete Medien finden |
| Pexels B-Roll/Bilder | `scout-pexels-assets.mjs` | Discovery; API-Key kann erforderlich sein |
| Pixabay B-Roll/Bilder | `scout-pixabay-assets.mjs` | Discovery; API-Key kann erforderlich sein |
| Wikimedia Commons | `scout-wikimedia-commons-assets.mjs` | reale/proof Bilder mit per-file Rechte-Metadaten |
| Polyhaven | `scout-polyhaven-assets.mjs` | CC0 3D/HDRI/Textur-Discovery |
| offizielle Source-Screenshots | Browser/Chrome → lokaler Input | exakte offizielle Seite/Figur lokal erfassen; kein Fake-UI |
| Scout → lokale Produktionsdatei | `materialize-longform-media.mjs` | Download-Host/Redirect/Größe prüfen, normalisieren, lokal kopieren, SHA binden |
| lokaler Source → Produktionsdatei | `materialize-longform-media.mjs --local-input` | Browser-Capture/Official Export/lokale Datei normalisieren + SHA binden |
| Rechte-/Sichtfreigabe | `approve-longform-media.mjs` | exakten SHA erneut prüfen; erst danach `APPROVED` |
| Render-Time-Hotlinks | verboten | finale TSX verwendet nur lokale freigegebene Dateien |

### Wichtige Wahrheit

Das Repo enthält **kein eigenes Text-to-Image-Modell**. Daher darf Antigravity nicht behaupten, aus diesem Repo heraus selbst ein externes generatives Bildmodell zu besitzen.

Für Longform ist das kein Produktionsblocker:

- reale Bilder kommen aus Official/Wikimedia/Pexels/Pixabay/lokalen Sources;
- illustrative Visuals können nativ mit Remotion/SVG/Canvas/Skia/Three/Rive/Lottie gebaut werden;
- externe generative Bilder sind nur ein optionaler separater Capability-Pfad und dürfen niemals als realer Claim-Beweis auftreten.

## Remotion / Motion / Effects

Die Workspaces deklarieren u. a.:

- Remotion Core/CLI
- `@remotion/effects`
- transitions
- shapes / paths
- noise / light-leaks / motion-blur
- `@remotion/skia` + React Native Skia
- Three.js + React Three Fiber + `@remotion/three`
- Lottie
- Rive
- GSAP
- RoughJS
- Recharts
- `@remotion/sfx`
- Remotion Bits MCP als optionale Pattern-Discovery

Policy: `OPEN_ENDED_STORY_DRIVEN`. Keine dieser Techniken ist Pflicht und keine Liste ist ein kreatives Limit. Der Longform-Engineer wählt die Technik nach Storyfunktion.

## Longform-spezifische Agents

### `ki-longform-production-orchestrator`

- führt Capability-Preflight aus;
- besitzt Phase 1 und 3;
- sucht Medien selbst;
- delegiert Read-only Research/Audits;
- erzwingt Materialisierung + Approval;
- startet ausschließlich den kanonischen Produktionsrender.

### `ki-longform-remotion-engineer`

- einziger visueller Writer auf dem Longform-Working-Tree;
- 1920×1080 / 30 FPS;
- echte Voice-Lock-Timeline;
- keine gleichen Fix-Dauern je Kapitel;
- nur `APPROVED` lokale Assets;
- keine Placeholder/Fake-Evidence;
- offene story-getriebene Remotion-/2D-/3D-/Effects-Nutzung.

## Audio / SFX

- Produktionsvoiceover: ausschließlich vom Nutzer.
- Forced Alignment / Timing: Agent/Phase 3.
- SFX: bestehender lokaler/Remotion-SFX-Pfad; semantisch statt dauerndem Whoosh/Click.
- finaler Master: Audio-Mastering + Master-QA über kanonischen Longform-Renderpfad.

## Produktions-Gates

```text
Capability Preflight
→ Voice Lock
→ Media DISCOVERED
→ Media MATERIALIZED_PENDING_REVIEW
→ Media APPROVED (exact SHA)
→ echte TSX + Root registration
→ check-ki-longform-render-readiness
→ Render Lock
→ render-ki-longform-master
→ Master QA
→ Contact Sheets
→ kompletter 1x Review
→ Release Gate
```

Ein direkter `npx remotion render` ist kein Produktionsmaster.

## Was `READY` nicht automatisch beweist

Der Capability-Preflight beweist nur, dass die benötigte Repository-/Runtime-Infrastruktur erreichbar ist. Er beweist **nicht**, dass:

- Pexels/Pixabay-Keys im konkreten Lauf vorhanden sind;
- ein bestimmter Medienkandidat erfolgreich heruntergeladen wurde;
- eine bestimmte Lizenz für jede denkbare Nutzung zulässig ist;
- ein konkretes TSX visuell gut ist;
- ein Render bestanden hat;
- ein Master vollständig angesehen wurde.

Diese Beweise entstehen erst in den jeweiligen Produktionsschritten.
