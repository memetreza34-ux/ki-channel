# KI-Reels — Produktionsvertrag

Gilt für alle Produktionspakete unter `ki/reels/` und erweitert `REPO-STATE.md`, `AGENTS.md`, `ki/AGENTS.md` und `ki/gehirn/MASTER.md`.

## Struktur ist unveränderlich

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Die sechs nummerierten Ordner niemals entfernen, umbenennen, verschieben oder flach zusammenlegen.

## Phasenstatus ist Pflicht

`06-projektdateien/PHASE-STATUS.md` entscheidet, welche Arbeit gerade zulässig ist.

- Phase 1 offen → Planung und Code-Grundlage vervollständigen
- Phase 2 → Mensch macht ausschließlich Voiceover
- Phase 3 → Agent integriert Audio, prüft und rendert

Phase 3 darf kein Phase-1-Reel neu entwerfen.

## Phase-1-Pflichtinhalt

Ein Reel ist erst Phase-1-fertig, wenn mindestens vorhanden sind:

- finaler Sprechertext in `01-script-audio/voiceover.md`
- reiner Copy-Fließtext in `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
- `06-projektdateien/reel.json`
- `scene-plan.md`
- `animation-plan.md`
- `03-caption/subtitle-cues.json`
- `03-caption/platform-copy.md`
- `02-bilder/asset-manifest.json`
- bei Bildbedarf `02-bilder/image-prompts.md`
- Assembly-/Agent-Auftrag
- Review-Checkliste
- ausführbarer Source unter `ki/src/reels/<slug>/`
- registrierte Composition
- fokussierte Source-/Contract-Checks

Ein Skript-/Plan-only Paket ist nicht Phase-1-fertig.

## Verbindliches sichtbares Textlayout

Für Production-Reels gilt `ki/gehirn/REELS.md` ohne reel-spezifische Abweichung, sofern der Nutzer sie nicht ausdrücklich verlangt:

- pro Szene eine kurze **Zwischenüberschrift oben mittig**
- zur Zwischenüberschrift ein semantisch passendes Icon
- keine zusätzliche Header-Unterzeile
- Untertitel unten in der sicheren Zone, nicht an der Displaykante
- Untertitel ohne weiße Box, Caption-Card oder flächigen Hintergrund
- Sans-Serif und smartphone-lesbar
- aktive Sprecherposition in Marken-Lila hervorheben
- finale Untertitel in Phase 3 mit dem echten Voiceover zeitlich abgleichen
- unterste ca. 220 px und seitliche Randzonen nicht für kritischen Text verwenden

Wenn `reel.json` die Zwischenüberschrift und ein Icon-Mapping trägt, darf Phase 3 diese nicht durch generische Titel ersetzen.

## Plattform-Copy

`03-caption/platform-copy.md` ist die einzige reel-spezifische Quelle für Publishing-Copy. Sie enthält mindestens getrennte Bereiche für:

- neutralen Kerntitel
- YouTube Shorts
- Instagram
- TikTok
- Facebook Reels
- Snapchat, falls genutzt

Die Plattformtexte dürfen die fachliche Aussage nicht verändern oder mehr versprechen als das Reel liefert.

Keine plattformspezifische Kopie des gesamten Produktionspakets anlegen. Publishing-Regeln: `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/`.

## Bildbereich

`02-bilder/README.md` und `ki/BILDSTIL.md` beachten. In `image-prompts.md` pro benötigtem Bild immer festhalten:

- sceneId und Zweck
- was die Bild-KI erzeugt
- was bewusst Remotion übernimmt
- vollständiger hochwertiger Prompt
- erwarteter Asset-Dateiname
- Crop/Fokus/Layers, falls relevant

Wenn kein Bild nötig ist, ausdrücklich `BILDER NICHT ERFORDERLICH` dokumentieren; keine dekorativen Assets erzeugen.

## Autorität innerhalb eines Reels

1. `PHASE-STATUS.md`
2. `reel.json`
3. `voiceover.md` / `VOICEOVER-ZUM-KOPIEREN.txt`
4. `scene-plan.md`
5. `animation-plan.md`
6. `subtitle-cues.json`
7. `platform-copy.md`
8. `asset-manifest.json` / `image-prompts.md`
9. `CODEX_ASSEMBLY_TASK.md`
10. `review-checklist.md`

Widerspruch erkennen, nicht verstecken.

## Fertig bedeutet wirklich fertig

Ein Reel ist erst vollständig fertig, wenn alle für Phase 3 relevanten aktuellen Checks tatsächlich bestanden sind, Smoke-Frames visuell geprüft wurden, das finale MP4 gerendert und in normaler Geschwindigkeit sowie auf Smartphone-Größe angesehen wurde.

Zur visuellen Freigabe gehört ausdrücklich: Header/Icon-Position, Safe Zones, transparente Untertitel und die Sprecher-Synchronität der lila Wort-/Phrasenhervorhebung prüfen.

`veröffentlicht` ist ein nachgelagerter Publishing-Status und ersetzt keine technische/visuelle Freigabe.
