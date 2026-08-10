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

- reale Dauer messen
- Audio render-sicher integrieren
- Captions, Szenen und Visual Beats an reales Audio anpassen
- Sprechertext nicht umschreiben
- natürliche Pausen bei Bedarf an Phrase-/Satzgrenzen leicht verkürzen/verlängern
- falls danach eine Phrase sichtbar zu schnell oder zu langsam für den geplanten Beat ist: pitch-erhaltend lokal time-stretchen

### Zulässiges lokales Voice-Retiming

Nicht pauschal die komplette Stimme beschleunigen/verlangsamen. Nur problematische **Phrasen oder Cues** feinjustieren.

Regeln:

- niemals Speedwechsel mitten im Wort
- nur an natürlichen Pausen-/Phrasengrenzen
- keine abrupten hörbaren Sprünge
- Pitch erhalten
- Wortlaut und Reihenfolge 1:1 erhalten
- bevorzugt `0.97x–1.03x`
- bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- stärkere Korrektur → nicht weiter verzerren; neues Voiceover/Phase 2 verlangen
- keine Wörter abschneiden/duplizieren/ergänzen
- nicht auf exakt 60 Sekunden zwingen, wenn Stimme unnatürlich würde

Nach jeder Audioänderung Caption-Cues und Wort-Timestamps gegen **das tatsächlich verwendete Audio** neu bestimmen.

Im Abschlussbericht lokale Retiming-Stellen und Faktoren nennen. Wenn kein Retiming nötig war, ebenfalls kurz sagen.

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
6. Audio integrieren.
7. Visual Beats, Pausen, Szenen und Animationen an reales Voiceover ausrichten.
8. nur falls nötig lokale Phrase-/Cue-Speedkorrektur innerhalb des Qualitätskorridors anwenden.
9. Caption-/Wort-Timestamps gegen das finale Audio synchronisieren.
10. fokussierte Tests und TypeScript.
11. drei Smoke-Frames pro Szene plus relevante Beat-Wechsel.
12. alle Smoke-Frames visuell prüfen.
13. Textüberlauf, Dopplung, semantische Motion-Fehler und Safe-Zones an der Ursache beheben.
14. finales MP4 rendern.
15. technische Artefaktprüfung.
16. Video normal und auf Smartphone-Größe ansehen und dabei auch auf unnatürliche Voice-Speed-Stellen hören.
17. Checkliste/Status ehrlich aktualisieren.
18. `platform-copy.md` als Publishing-Handoff bestätigen.
19. finaler Strukturcheck.

## Visuelle/akustische Pflichtprüfung

Nicht freigeben bei:

- internen `goal`-/Regietexten
- Überschrift, Animation und Caption mit unnötig gleichem Text
- abgeschnittener Schrift
- Überlappung
- leerer Opening-Phase
- unfertigem Endframe
- falscher/unverständlicher Motion
- Visual Beat nicht zeitgleich zur gemeinten Sprecherphrase
- hörbar künstlichem, hektischem oder gedehntem Voiceover-Retiming
- ungrounded Zahlen
- Wasserzeichen oder zufälligem Text in Bildern
- fehlender mobiler Lesbarkeit

## Definition of done

Getrennt berichten:

```text
implementiert
Audio integriert
Timeline synchronisiert
lokales Retiming: keines / Stellen + Faktoren
technisch getestet
gerendert
visuell + akustisch geprüft
freigegeben
publishing-bereit
```

Keinen dieser Zustände ohne tatsächlichen Nachweis behaupten. `publishing-bereit` bedeutet nicht automatisch `veröffentlicht`.
