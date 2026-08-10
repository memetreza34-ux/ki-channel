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
- Phase 3 → Agent integriert Audio, synchronisiert, prüft und rendert

Phase 3 darf kein Phase-1-Reel neu entwerfen.

## Phase-1-Pflichtinhalt

Ein Reel ist erst Phase-1-fertig, wenn mindestens vorhanden sind:

- finaler Sprechertext in `01-script-audio/voiceover.md`
- reiner Copy-Fließtext in `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
- Standardziel Short-Form: ungefähr **50–60 Sekunden** bzw. meist ungefähr **120–150 gesprochene Wörter**, wenn die Idee das trägt
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

## Animation Contract — individuell vor Reuse

Vor Implementierung muss der Sprechertext in **Visual Beats** zerlegt werden. Ein Beat kann je nach Bedeutung ein Wort, eine Phrase, ein Halbsatz, ein Satz oder eine zusammenhängende Satzgruppe sein.

Für jeden Beat muss `animation-plan.md` festhalten:

```text
Sprecherstelle
→ Aussage/Bedeutung
→ Startzustand
→ sichtbare Veränderung
→ Endzustand
→ REUSE_EXACT oder NEW_BUILD
→ Sprecher-Timing
```

Regeln:

- **nicht zuerst in der Library stöbern und danach Inhalt daraufbiegen**
- bestehende Animation nur als `REUSE_EXACT`, wenn sie die Aussage wirklich exakt erklärt
- „ähnlich“, „haben wir schon“ oder „passt ungefähr“ ist nicht ausreichend
- ohne exakten Fit: **individuelle reel-spezifische Remotion-Animation bauen**
- eine Szene darf mehrere Micro-Animationen enthalten
- wenn sich die Aussage innerhalb eines Satzes sichtbar ändert, muss der visuelle Zustand passend reagieren
- nicht jedes Wort braucht Bewegung; jedes bedeutungstragende Wort/jede Phrase braucht aber eine bewusste visuelle Entscheidung
- keine dekorative Füllanimation

Phase 3 darf NEW_BUILD/REUSE_EXACT nicht aus Bequemlichkeit ändern.

## Phase-3 Timeline Contract — Audio darf lokal feinjustiert werden

Das echte Voiceover ist die akustische Grundlage. Der Agent muss die **gesamte audiovisuelle Timeline** optimieren, nicht nur Captions verschieben.

Bei zu schnellem/zu langsamem Sprecherabschnitt gilt:

1. zuerst Animation, Hold, Szenenlänge und Beat-Timing anpassen
2. natürliche Pause an Phrase-/Satzgrenze leicht verkürzen oder verlängern
3. wenn nötig eine komplette Phrase / einen Cue **pitch-erhaltend lokal time-stretchen**
4. danach Caption-Cues und Wort-Timestamps auf das tatsächlich verwendete Audio neu synchronisieren

Verbindlich:

- Speedwechsel nur an natürlichen Phrasen-/Pausengrenzen, niemals mitten im Wort
- keine abrupten Speed-Sprünge
- Pitch erhalten
- Sprechertext bleibt wortgleich und in gleicher Reihenfolge
- bevorzugt ungefähr `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`
- über ungefähr ±6 % nicht weiter verzerren; stattdessen Phase-2-Voiceover neu erzeugen lassen
- keine Wörter schneiden, duplizieren oder künstlich verlängern
- keine starre Zielsekunde erzwingen, wenn Natürlichkeit leidet
- verwendete lokale Retiming-Faktoren im Phase-3-Abschlussbericht nennen

Ziel: **Stimme, Visual Beat, Animation, Zustandswechsel und Caption treffen denselben Moment.**

## Verbindliches sichtbares Textlayout

Für Production-Reels gilt `ki/gehirn/REELS.md` ohne reel-spezifische Abweichung, sofern der Nutzer sie nicht ausdrücklich verlangt:

- pro Szene eine kurze **Zwischenüberschrift oben mittig**
- komplette Zwischenüberschrift in dunklem Marken-Lila `#6E45C9`
- zur Zwischenüberschrift ein semantisch passendes, deutlich lesbares und eher größeres Icon
- keine zusätzliche Header-Unterzeile
- Untertitel unten in der sicheren Zone, nicht an der Displaykante
- Untertitel ohne weiße Box, Caption-Card oder flächigen Hintergrund
- Sans-Serif und smartphone-lesbar
- aktive Sprecherposition in Marken-Lila hervorheben
- finale Untertitel in Phase 3 mit dem **tatsächlich final verwendeten Audio** zeitlich abgleichen

## Harte Caption-Zone

Bei 1080 × 1920 gilt ab ungefähr `y=1440` die reservierte Caption-/Bottom-Safe-Zone.

**Dort und darunter ist sichtbare Animation verboten.**

Das bedeutet:

- keine Animationskarte
- kein Node
- keine Linie
- kein Partikel
- keine Illustration
- kein Animationslabel
- keine dekorative UI

unter/ hinter den Untertiteln.

Animationen müssen vorher enden. Wenn Platz fehlt, Animation höher, kompakter oder individuell neu bauen. Untertitel nicht nach unten verschieben.

Die gemeinsame Production-Shell darf zusätzlich clippen. Wird dadurch wichtiger Inhalt abgeschnitten, ist das ein Layoutfehler und keine akzeptable Lösung.

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

Zur visuellen/akustischen Freigabe gehört ausdrücklich:

- Visual Beats passen exakt zum Sprecherinhalt
- keine bequeme/ungefähre Library-Reuse
- Sprecher, Visual Beat und Caption treffen zeitlich denselben Moment
- lokale Audio-Speedkorrekturen klingen natürlich und pitch-erhaltend
- Header/Icon-Position
- vollständige lila Zwischenüberschrift
- Caption-Safe-Zone
- **keinerlei sichtbare Animation unter der Caption-Zone**
- keine Clip-bedingt abgeschnittenen wichtigen Inhalte
- transparente Untertitel
- Sprecher-Synchronität der lila Wort-/Phrasenhervorhebung

`veröffentlicht` ist ein nachgelagerter Publishing-Status und ersetzt keine technische/visuelle Freigabe.
