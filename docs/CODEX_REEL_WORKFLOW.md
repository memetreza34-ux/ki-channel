# Codex / Antigravity — Phase-3 Reel Workflow

Diese Datei beschreibt **nur Phase 3**. Phase 1 wurde bereits von ChatGPT erstellt; Phase 2 liefert das echte Voiceover.

## Voraussetzungen

Ein benanntes Wochenpaket existiert unter:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
```

und enthält `PHASE-STATUS.md`, Skript, Planung, Captions, `platform-copy.md` und Asset-Manifest. Der ausführbare Source existiert bereits unter:

```text
ki/src/reels/<slug>/
```

## Start

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/reels/AGENTS.md`
6. named reel `PHASE-STATUS.md`
7. reel-spezifisches `AGENTS.md`
8. `reel.json`, Skript, Szene/Animation, Captions, `platform-copy.md`, Manifest, Assembly-Auftrag

## Phase-3-Regel

Codex/Antigravity **implementiert das Reel nicht erneut von Null**. Vorhandene Phase-1-Source ist die Basis.

Wenn `PHASE-STATUS.md` nicht Phase 2 abgeschlossen / Phase 3 bereit meldet oder kein echtes Audio vorhanden ist, stoppen und den fehlenden Schritt melden.

## Audio

Bevorzugt:

`01-script-audio/voiceover.wav`

alternativ:

`01-script-audio/voiceover.mp3`

Fehlt beides: `PHASE 2 AUDIO FEHLT`.

Danach:

- Dauer messen
- Audio render-sicher integrieren
- Caption-/Szenen-Timing an reales Audio anpassen
- Sprechertext nicht umschreiben
- nicht heimlich time-stretchen oder abschneiden

## Bilder

Nur Assets aus `asset-manifest.json` verwenden. Nichts still substituieren oder herunterladen. Bildprompt-Arbeit ist Phase 1; Phase 3 repariert nur nachweisbare Asset-/Layout-Probleme.

## Plattform-Copy

`03-caption/platform-copy.md` ist Publishing-Metadaten-Handoff. Phase 3 ändert diese Datei nur, wenn sich durch die finale technische Fassung ein nachweisbarer Sach-/Titelkonflikt ergibt. Nicht das Reel für einzelne Plattformen neu bauen.

Zeitabhängige Plattformregeln werden erst bei konkreter Veröffentlichung aktuell verifiziert.

## Technische Reihenfolge

1. Branch und Worktree prüfen.
2. Strukturvalidator.
3. reel-spezifischen Preflight.
4. Phase-1-Source/Composition bestätigen.
5. Audio prüfen und messen.
6. Audio/Timing integrieren.
7. fokussierte Tests und TypeScript.
8. drei Smoke-Frames pro Szene: Opening, Midpoint, End-Hold.
9. alle Smoke-Frames visuell prüfen.
10. Textüberlauf, Dopplung, semantische Motion-Fehler und Safe-Zones an der Ursache beheben.
11. finales MP4 rendern.
12. technische Artefaktprüfung.
13. Video normal und auf Smartphone-Größe ansehen.
14. Checkliste/Status ehrlich aktualisieren.
15. `platform-copy.md` als Publishing-Handoff bestätigen.
16. finaler Strukturcheck.

## Visuelle Pflichtprüfung

Nicht freigeben bei:

- internen `goal`-/Regietexten
- Überschrift, Animation und Caption mit unnötig gleichem Text
- abgeschnittener Schrift
- Überlappung
- leerer Opening-Phase
- unfertigem Endframe
- falscher/unverständlicher Motion
- ungrounded Zahlen
- Wasserzeichen oder zufälligem Text in Bildern
- fehlender mobiler Lesbarkeit

## Definition of done

Getrennt berichten:

```text
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
publishing-bereit
```

Keinen dieser Zustände ohne tatsächlichen Nachweis behaupten. `publishing-bereit` bedeutet nicht automatisch `veröffentlicht`.
