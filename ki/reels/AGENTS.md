# KI-Reels — Produktionsvertrag

Gilt für alle Produktionspakete unter `ki/reels/` und erweitert `REPO-STATE.md`, `AGENTS.md`, `ki/AGENTS.md` und `ki/gehirn/MASTER.md`.

Numerische Produktionswerte stammen verbindlich aus `ki/reels/production-standard.json`. Dieser Vertrag erklärt sie; er definiert keine abweichende zweite Zahlenquelle.

## Struktur ist unveränderlich

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
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

## Remotion-native Visual Contract — Code vor Bild

Zusätzlich gilt dauerhaft `REMOTION_NATIVE_VISUALS.md` und für ausführbaren Source `ki/src/reels/AGENTS.md`.

**Wenn Symbole, UI oder erklärende Grafiken sauber mit React, SVG, CSS und Remotion gebaut werden können, werden sie direkt in Code gebaut.** Ein generiertes PNG/JPG ist dafür kein gleichwertiger Ersatz.

Standardmäßig `REMOTION_NATIVE`:

- Icons und Symbole
- App-/Browser-/Smartphone-/Desktop-UI
- Buttons, Inputs, Cards, Tabs, Menüs und Dialoge
- Code-/Terminal-Fenster und Dateibäume
- Charts, Diagramme, Timelines und Prozessgrafiken
- Nodes, Connectoren, Pfeile, Linien und Statuspunkte
- Tabellen, Badges, Labels und Fortschrittsanzeigen
- Branches, Commits, Pull Requests und andere Git-/GitHub-Mechaniken
- abstrakte technische Formen und einfache 2D-/2.5D-Objekte
- Before/After- und Zustandswechsel

Bilder sind nur vorzuziehen, wenn Fotografie, komplexe organische Motive, reale Menschen/Hände, Materialien, Produkte oder aufwendige räumliche 3D-Umgebungen einen echten Mehrwert liefern. Dann möglichst `HYBRID`: komplexes Motiv als Bild, präzise Informationsschichten weiterhin Remotion-native.

Für jeden Visual Beat zusätzlich zur `NEW_BUILD`-/`REUSE_EXACT`-Entscheidung das Medium festlegen:

```text
REMOTION_NATIVE
IMAGE_REQUIRED
HYBRID
```

`REMOTION_NATIVE` ist der Default. `IMAGE_REQUIRED` oder `HYBRID` brauchen eine konkrete Begründung.

Nicht in ein generiertes Bild backen, wenn Remotion es kontrollierter übernehmen kann: Überschriften, Untertitel, UI-Text, Zahlen, Code, Buttons, Pfeile, Diagramme, Labels, Statusanzeigen oder animierte Fokuszustände.

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

Für Production-Reels gelten `ki/gehirn/REELS.md`, **`ki/gehirn/CAPTION_SAFE_POSITION.md`** und für Source **`ki/src/reels/captionSafe.ts`** ohne reel-spezifische Abweichung, sofern der Nutzer sie nicht ausdrücklich verlangt:

- pro Szene eine kurze **Zwischenüberschrift oben mittig**
- komplette Zwischenüberschrift in dunklem Marken-Lila `#6E45C9`
- zur Zwischenüberschrift ein semantisch passendes, deutlich lesbares und eher größeres Icon
- keine zusätzliche Header-Unterzeile
- Untertitel ohne weiße Box, Caption-Card oder flächigen Hintergrund
- Sans-Serif und smartphone-lesbar
- aktive Sprecherposition in Marken-Lila hervorheben
- Untertitel bei 1080×1920 standardmäßig mit **`bottom: 520px`** positionieren
- horizontal **104px Sicherheitsabstand** links und rechts
- bevorzugte maximale Caption-Breite **820px**
- Caption-Fenster normalerweise **4–6 Wörter**, maximal **2 Zeilen gleichzeitig**
- die letzten ungefähr **420px** unten niemals für Untertitel oder andere kritische Informationen verwenden
- `420–500px` vom unteren Rand nur als Puffer behandeln
- neue Reel-Sources verwenden die Shared-Geometrie aus `ki/src/reels/captionSafe.ts`; keine Altwerte neu hart codieren
- finale Untertitel in Phase 3 mit dem **tatsächlich final verwendeten Audio** zeitlich abgleichen

## Caption-/Visual-Safe-Zone

Bei 1080 × 1920 gilt:

- Caption-Position: standardmäßig **`bottom: 520px`**
- sichtbarer Caption-Block typischerweise ungefähr **y≈1280–1400**
- Überschrift nicht an den oberen Rand kleben: Header beginnt bei **y=110**, ist **150px** hoch und endet vor der Animation
- Hauptanimation ausschließlich zwischen **y=300 und y=1160**; nichts darf in Header oder Caption hineinragen
- neue bedeutungstragende Visuals zwischen ungefähr **y≈1120–1160** abschließen
- zwischen Animationsende und einer zweizeiligen Caption mindestens **100px** freie Luft halten
- mindestens **100px** Luft zwischen Hauptvisual und konservativer Zwei-Zeilen-Caption sicherstellen
- der bestehende technische Clip-Guard um `y≈1440` ist nur eine letzte Sicherung und **nicht** die Caption-Positionsregel
- kein Animationsobjekt, keine Karte, kein Node, keine Linie, kein Partikel, keine Illustration und kein Animationslabel darf mit dem sichtbaren Caption-Block konkurrieren
- rechts Interaktions-UI gedanklich mitprüfen; Caption/Labels nicht unnötig bis an die rechte Kante führen

Wenn Platz fehlt: Animation höher, kompakter oder individuell neu bauen. **Untertitel nicht nach unten verschieben.**

Wird wichtiger Inhalt durch den technischen Clip-Guard abgeschnitten oder kollidiert er trotz technischer Bounds mit der Caption, ist das ein Layoutfehler und keine akzeptable Lösung.

Wenn `reel.json` die Zwischenüberschrift und ein Icon-Mapping trägt, darf Phase 3 diese nicht durch generische Titel ersetzen.

## Post-Render-Qualität ist verbindlich

Zusätzlich gilt für **jedes** Reel `ki/gehirn/POST_RENDER_REVIEW.md`.

Insbesondere:

- erster visueller Zustand sofort bzw. innerhalb der ersten ungefähr `0.2–0.4 s` lesbar; kein leer wirkender weißer Einstieg
- Hauptmechanik groß genug für Smartphone statt kleiner UI-Insel in viel Leerraum
- kritische interne Labels kurz und in der Regel mindestens ungefähr `28–32 px` bei 1080 × 1920
- vorhandene sinnvolle Mechanik vergrößern statt Leerraum mit Deko zu füllen
- neue Sprecherbedeutung darf nicht über mehrere Sekunden auf praktisch unverändertem Bild liegen; ungefähr `>2.5 s` ist ein Review-Warnsignal, sofern kein bewusster End-Hold vorliegt
- die letzte Szene muss bis zur letzten inhaltlichen Phrase sichtbar weiterentwickelt werden
- Caption im Feed-Eindruck klar oberhalb von Beschreibung/Account-/Interaktions-UI halten
- rechte Feed-Interaktionsleiste darf Caption oder kritische Visual-Labels nicht bedrängen
- nach jeder Source- oder Caption-Positionsänderung ist ein **neuer** Render + neue visuelle Prüfung Pflicht; ein alter MP4 darf nie den neuen Source-Stand freigeben

Wenn ein Nutzer einen gerenderten MP4 oder echten Publishing-Screenshot zur Analyse gibt und daraus konkrete Fehler sichtbar werden, diese Erkenntnisse nicht nur lokal reparieren: prüfen, ob sie als dauerhafte Produktionsregel in `POST_RENDER_REVIEW.md`, `REELS.md`, `CAPTION_SAFE_POSITION.md` oder diesem Vertrag verankert werden müssen.

## Universelle Social-Media-Caption

`03-caption/platform-copy.md` ist die einzige reel-spezifische Quelle für Publishing-Copy. Sie enthält genau **eine** direkt kopierbare Caption für YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat.

- keine Überschriften, Labels oder Plattformabschnitte in der Datei
- keine plattformspezifischen Textvarianten
- genau fünf thematisch passende Hashtags am Ende
- kein Transcript-Dump, Fake-Hype oder falsches Versprechen
- keine PDF erstellen oder einen `04-pdf/`-Ordner für neue Reels anlegen

Keine plattformspezifische Kopie des gesamten Produktionspakets anlegen. Publishing-Regeln: `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/`.

## Bildbereich

Vor jedem externen Bild zuerst `REMOTION_NATIVE_VISUALS.md` anwenden.

`02-bilder/README.md` und `ki/BILDSTIL.md` beachten. In `image-prompts.md` pro benötigtem Bild immer festhalten:

- sceneId und Zweck
- warum `REMOTION_NATIVE` hier nicht die bessere Lösung ist
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

Ein Reel ist erst vollständig fertig, wenn alle für Phase 3 relevanten aktuellen Checks tatsächlich bestanden sind, Smoke-Frames visuell geprüft wurden, das finale MP4 gerendert und in normaler Geschwindigkeit sowie auf Smartphone-/Feed-Größe angesehen wurde.

Zur visuellen/akustischen Freigabe gehört ausdrücklich:

- Visual Beats passen exakt zum Sprecherinhalt
- keine bequeme/ungefähre Library-Reuse
- Symbole, UI und erklärende Grafiken sind Remotion-native, sofern technisch vernünftig möglich
- `IMAGE_REQUIRED` / `HYBRID` ist bei externen Bildern nachvollziehbar begründet
- Sprecher, Visual Beat und Caption treffen zeitlich denselben Moment
- lokale Audio-Speedkorrekturen klingen natürlich und pitch-erhaltend
- Header/Icon-Position
- vollständige lila Zwischenüberschrift
- Caption standardmäßig `bottom: 520px` bei 1080×1920
- Caption verwendet die Shared-Geometrie aus `ki/src/reels/captionSafe.ts`
- horizontaler Caption-Sicherheitsabstand zur Feed-UI ist eingehalten
- maximal 2 Caption-Zeilen gleichzeitig
- Caption nicht im unteren Plattform-/Feed-UI-Bereich
- Hauptvisual auf Smartphone ausreichend groß
- wichtige interne Labels auf Smartphone lesbar
- keine unnötig große Leere bei gleichzeitig kleiner Kernanimation
- kein langer statischer Abschnitt während neue Sprecherbedeutung weiterläuft
- Schluss trägt sichtbar bis zur letzten inhaltlichen Phrase
- keine Clip-bedingt abgeschnittenen wichtigen Inhalte
- transparente Untertitel
- Sprecher-Synchronität der lila Wort-/Phrasenhervorhebung
- aktueller Render gehört exakt zum aktuell geprüften Source-Stand

`veröffentlicht` ist ein nachgelagerter Publishing-Status und ersetzt keine technische/visuelle Freigabe.
