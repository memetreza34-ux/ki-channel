# Post-Render Review — verbindliche Reel-Qualität

Nach jedem echten Reel-Render wird bei **1x-Geschwindigkeit** geprüft. Ein technisch gültiges MP4 ist noch keine visuelle Freigabe.

## Pflichtprüfung

- Hook/erster Zustand sofort verständlich
- Überschrift lesbar und nicht zu hoch
- Caption tief genug, aber ohne Plattform-UI-Kollision
- Caption maximal 2 Zeilen
- kein separater Footer-/zweiter Hintergrund
- Fullscreen-Szenenhintergrund bleibt konsistent
- wichtige Zustände: `REVEAL → SETTLE → READABLE HOLD`
- unabhängige Informationen gestaffelt statt gleichzeitig gestapelt
- keine dunkle Fullscreen-Szene ohne genehmigte Ausnahme
- Voiceover hörbar und passend
- Caption/aktive Wörter folgen dem tatsächlich verwendeten Audio
- finale Szene endet nicht hektisch

## Motion Readability

Wichtige Zustände müssen bei normaler Wiedergabe beim ersten Anschauen verständlich sein. Muss man pausieren oder zurückspulen, ist der Beat zu schnell.

Bei 30 fps gelten als Startwerte:

- wichtige neue Zustände normalerweise etwa 12–24 Frames lesbarer Hold
- Hero-/Payoff-Zustände meist etwa 18–30 Frames
- unabhängige neue Informationen meist 6–12 Frames versetzt

Diese Zahlen sind Mindest-/Planungsrichtwerte; die echte Lesbarkeit des Renders entscheidet.

## Light-First

Standard sind helle Fullscreen-Szenen. Dunkle Cards/Objekte auf hellem Grund sind erlaubt. Dunkle Fullscreen-Szenen brauchen explizite/dokumentierte Ausnahme.

## Exakter Renderbezug

`MOTION-READABILITY-REVIEW.md` darf nur den tatsächlich angesehenen MP4 freigeben. Der Review wird deshalb an dessen SHA256/Dauer gebunden. Ein alter Review darf einen neuen Render nicht freigeben.

Zusätzlich muss der Production-Render vor dem Rendern mit

```bash
node ki/scripts/prepare-reel-render.mjs <reel-package-dir>
```

an einen **sauberen Git-Commit sowie Source-, Reel-, Caption- und Audio-Hashes** gebunden worden sein. Der daraus erzeugte lokale `RENDER_LOCKED`-Datensatz ist Teil der finalen Provenance-Prüfung. Ein MP4, das älter als dieser Render-Lock ist oder dessen Inputs danach geändert wurden, darf nicht finalisiert werden.

Nach dem Review:

```bash
node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir> <rendered-video.mp4>
```

Vor finalem Export laufen zusätzlich Voice-Lock, Entertainment, Source-Isolation (wenn vorhanden), Render-Provenance und Audio-/Video-Gate.

## Fail-Bedingungen

Kein `PASS`, wenn:

- `TOO_FAST_BEATS > 0`
- `SIMULTANEOUS_INFO_OVERLOADS > 0`
- ungenehmigte dunkle Fullscreen-Szene vorhanden
- Caption/Header kollidieren oder unlesbar sind
- Audio fehlt/stumm ist
- Caption merkbar vor/hinter der Stimme läuft
- der Review zu einem anderen MP4 gehört
- Source/Caption/Reel/Audio nach dem Render-Lock verändert wurden
- der finale MP4 nicht aus dem gelockten Produktionsstand stammen kann

Nach jeder Source-, Caption-, Audio- oder Timingänderung: neuer Render, neuer 1x-Review, neuer Provenance-Gate.
