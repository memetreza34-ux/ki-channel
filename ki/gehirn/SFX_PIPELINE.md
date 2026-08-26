# Kanonische SFX-Pipeline — KI-Reels

## Ziel

SFX sollen automatisch passend zu echten visuellen Ereignissen gewählt werden, ohne lizenzrechtlich unsichere Web-Downloads und ohne manuelle Dateinamen pro Reel.

## Bibliothek

Die lokale Kernbibliothek besteht ausschließlich aus allowlisteten Kenney-Packs mit `CC0-1.0`.

Setup:

```bash
node ki/scripts/setup-reel-sfx-library.mjs
node ki/scripts/validate-reel-sfx-library.mjs
```

Das Setup erzeugt lokal:

```text
public/reel-sfx/
├── kenney/
├── licenses/
└── sfx-index.json
```

Die Audio-Binaries bleiben lokal/ignored. In Git bleiben Quellenkonfiguration, semantische Events, aufgelöste Metadaten und Lizenz-/Provenance-Regeln.

## Zwei SFX-Dateien pro Reel

```text
06-projektdateien/sfx-events.json
06-projektdateien/sfx-resolved.json
```

`sfx-events.json` beschreibt nur **was** akustisch passieren soll und **wann relativ zum visuellen Ereignis**:

```json
{
  "id": "sfx01",
  "sceneId": "scene1",
  "anchor": {"type": "SCENE_OFFSET", "frame": 24},
  "roles": ["ui-click"],
  "keywords": ["click", "select"],
  "preferredDurationSeconds": 0.18,
  "volume": 0.09
}
```

Der Agent soll hier **keinen konkreten Dateinamen** auswählen.

`sfx-resolved.json` wird erst nach finalem Voice-/Scene-Lock automatisch erzeugt.

## Auswahl

```bash
node ki/scripts/resolve-reel-sfx.mjs <reel-package-dir>
```

Der Resolver rankt deterministisch nach:

1. exakter Rollenübereinstimmung
2. kompatibler Rollenfamilie
3. Keywords im Original-Dateinamen
4. Nähe zur gewünschten Dauer
5. Wiederholungsvermeidung innerhalb desselben Reels

Kein `Math.random()`. Kein Netzwerkzugriff während Remotion-Render.

## Timing

SFX hängen an visuellen Final-Frames, nicht an alten Planzeiten.

Standardanker:

- `SCENE_OFFSET` — Frame relativ zum finalen Szenenstart
- `SCENE_END_OFFSET` — negativer Offset relativ zum finalen Szenenende
- `ABSOLUTE` — nur für ausdrücklich stabile globale Beats

Damit verschieben sich Sounds automatisch mit, wenn Pause-Kompression und Forced Alignment die Szenen neu setzen.

## Lautstärke

Voiceover hat Priorität. Harte Obergrenzen:

- Impact: `0.20`
- UI: `0.14`
- Tech/Digital: `0.12`
- Transition: `0.10`

Höhere gewünschte Werte werden automatisch gekappt.

## Lizenz-Gate

```bash
node ki/scripts/validate-reel-sfx-plan.mjs <reel-package-dir>
```

Production akzeptiert automatisch nur:

`CC0-1.0`

Der Gate prüft außerdem:

- alle aufgelösten Events vorhanden
- Sound existiert in der aktuellen lokalen Bibliothek
- Sounddatei existiert lokal
- Event liegt innerhalb der finalen Composition
- Lautstärke bleibt unter dem Voice-First-Limit
- keine extrem dichten Doppeltrigger

## Automatische Gesamtpipeline

Der normale Sync-Befehl bleibt:

```bash
node ki/scripts/align-reel-local.mjs <reel-package-dir>
```

Reihenfolge:

```text
Pause-Kompression
→ Forced Alignment
→ Captions
→ Scene-Lock
→ SFX Auto-Resolution
→ SFX Gate
→ Commit
→ prepare-reel-render
```

`prepare-reel-render.mjs` bindet `sfx-resolved.json` per SHA256 an den Render-Lock. Finalizer und Export-Package-Gate akzeptieren keinen anderen Soundplan als den tatsächlich gerenderten.
