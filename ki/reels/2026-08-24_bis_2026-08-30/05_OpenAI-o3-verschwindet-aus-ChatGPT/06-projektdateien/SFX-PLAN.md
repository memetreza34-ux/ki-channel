# SFX-System — OpenAI o3 verschwindet aus ChatGPT

## Status

**AUTOMATISCHE AUSWAHL IMPLEMENTIERT — LOKALE AUFLÖSUNG NACH FINALER SZENENZEIT**

Die SFX werden nicht mehr manuell per Dateiname ausgesucht. Das Reel definiert nur semantische Ereignisse in `sfx-events.json`.

Ablauf:

```text
finale Voice-/Scene-Timings
+ sfx-events.json
+ lokale CC0-Bibliothek (~410 Sounds)
        ↓
resolve-reel-sfx.mjs
        ↓
passenden Sound nach Rolle + Dateiname + Dauer auswählen
        ↓
exakten Frame aus visuellem Szenen-Event ableiten
        ↓
sfx-resolved.json
        ↓
ReelSfxTrack.tsx
```

## Events dieses Reels

- Szene 1: Impact exakt beim `HEUTE ENDE`-Stempel
- Szene 2: zwei UI-Klicks an den beiden Timeline-Markern
- Szene 3: Open/Close-/Click-Akzent beim Verlassen der o3-Zeile + Confirm beim Ersatzmodell
- Szene 4: negativer UI-Akzent beim ChatGPT-X + Confirm beim API-Haken
- Szene 5: zwei sehr leichte UI-/Confirm-Akzente bei den Workflow-Zeilen

Die Frames sind als **relative visuelle Anker innerhalb der jeweiligen finalen Szene** definiert. Wenn die Pause-Kompression die Szenen verschiebt, verschieben sich die SFX automatisch mit.

## Auswahlregeln

Der Resolver rankt Kandidaten deterministisch nach:

1. exakter gewünschter `role`
2. kompatibler Rollenfamilie
3. passenden Keywords im Original-Dateinamen
4. Nähe zur gewünschten Sounddauer
5. Wiederholungsvermeidung innerhalb desselben Reels

Es gibt kein `Math.random()` und keine Web-Suche während des Renders.

## Lizenz

Automatisch erlaubt sind ausschließlich Sounds mit:

`CC0-1.0`

Der Library-Setup-Schritt prüft die mitgelieferte `License.txt`. `validate-reel-sfx-plan.mjs` akzeptiert keine andere Lizenz.

## Lautstärke

Voiceover hat immer Priorität:

- Impact: maximal 0.20
- UI: maximal 0.14
- Tech/Digital: maximal 0.12
- Transition: maximal 0.10

Ein höherer Wert in `sfx-events.json` wird automatisch auf das sichere Rollenlimit begrenzt.

## Befehle

Normalerweise reicht künftig der bestehende Sync-Befehl:

```bash
node ki/scripts/align-reel-local.mjs \
  ki/reels/2026-08-24_bis_2026-08-30/05_OpenAI-o3-verschwindet-aus-ChatGPT
```

Nach Voice-Lock führt er automatisch aus:

```bash
node ki/scripts/resolve-reel-sfx.mjs <reel-package-dir>
node ki/scripts/validate-reel-sfx-plan.mjs <reel-package-dir>
```

Der Production-Render und der Finalizer verlangen den bestandenen SFX-Gate ebenfalls.
