# KI-Reel-Produktionsgehirn

## Zweck

Dieses Dokument ist die dauerhafte Wahrheit für den KI-Reel-Workflow. Für alle neu erstellten Reels gilt zusätzlich der detaillierte Standard in `FUTURE-REEL-STANDARD.md` und die maschinenlesbare Version in `brain.json`.

Bei Widersprüchen gilt für neue Reels diese Reihenfolge:

1. reel-spezifische, ausdrücklich vom Nutzer freigegebene Entscheidung
2. `FUTURE-REEL-STANDARD.md`
3. dieses Produktionsgehirn
4. `brain.json`
5. ältere Templates und historische Reel-Dateien

Historische Reels dürfen von den neuen Standardwerten abweichen. Ihre alten Werte dürfen nicht als Vorlage für neue Reels kopiert werden.

## Repository-Struktur

```text
KI-Channel/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── reels/
├── youtube/
└── alles/
```

- `reels/`: aktive Reel-Projekte
- `youtube/`: spätere Longform-Videos
- `alles/`: Remotion-Code, Bibliotheken, Skripte, Tests und interne Regeln
- FinanzNeo bleibt ein getrenntes Repository; übernommen wird nur die Produktionslogik.

## Reel-Struktur

```text
reels/<woche>/<wochentag>/<reel-thema>/
├── 00-cover/
├── 01-voice-script/
├── 02-audio/
├── 03-szenen/
│   └── EINZELNE-SZENEN/
├── 04-caption/
├── 05-review/
├── 06-video/
├── AGENTS.md
├── README.md
├── render/
└── timeline/
```

## Verbindliche Standardrichtung für neue Reels

Der erste vollständige Halluzinations-Render war technisch brauchbar, aber visuell zu schnell, zu kurz und durch externe Szenenbilder inkonsistent. Deshalb gelten für alle zukünftigen Reels diese Standardwerte:

- Reel-Länge: **60 bis 70 Sekunden**
- Voiceover: **125 bis 145 Wörter**
- Szenen: **8 bis 9**
- normale Szenenlänge: **6 bis 8 Sekunden**
- absolute Mindestlänge einer normalen Szene: **5,5 Sekunden**
- Audio: standardmäßig **1,00x**
- maximal **1,05x** nur nach echter Hörprobe und bewusster Freigabe
- Reel selbst: **100 Prozent Remotion-Animation**
- keine generierten Szenenbilder und keine Stockbilder im Reel
- Cover: genau **ein separates statisches Bild** mit einem klaren Satz
- pro Szene genau eine klare Aussage und eine dominante visuelle Erklärung
- maximal zwei starke Bewegungen gleichzeitig
- höchstens vier klar unterscheidbare Bedeutungsbeats pro Szene
- mindestens eine Sekunde ruhiger Ergebnis-Hold
- keine hektischen Effektketten

## Aufgabenverteilung

### Planung und Vorbau

Vor dem Nutzer-Audio müssen vollständig vorliegen:

- Thema und direkter Hook
- finaler deutscher Voiceover-Text mit 125 bis 145 Wörtern
- 8 bis 9 Szenen mit klarer Argumentationsfolge
- ein Cover-Konzept mit einem Satz und einem Hauptmotiv
- semantische Beat-Liste pro Szene
- vollständiger ausführbarer Remotion-Code
- Composition-Registrierung
- Tests, Checkpoints und Build-Pipeline
- Reel-lokaler Codex-Auftrag

Die Beat-Liste verwendet dieses Format:

```text
wichtiger Ausdruck → visuelle Reaktion → Transcript-Auslöser → Ergebniszustand
```

Kein wichtiger Bedeutungsinhalt darf nur gesprochen werden, ohne visuell erklärt zu werden.

### Nutzer

Der Nutzer muss nur:

1. das freigegebene Cover-Bild beziehungsweise Cover-Motiv erzeugen
2. das Voiceover bei 1,00x Quellgeschwindigkeit erzeugen
3. genau eine unterstützte Audio- oder Mediendatei in `02-audio/` ablegen
4. Codex den vorhandenen Gesamtbuild ausführen lassen
5. Cover und finales MP4 persönlich ansehen und freigeben

Für das Reel selbst werden keine generierten Szenenbilder benötigt.

### Codex

Codex ist Produktionsingenieur, nicht Creative Director. Codex:

1. prüft Branch und Arbeitsbaum
2. liest Root- und Reel-`AGENTS.md`
3. liest `PRODUCTION-BRAIN.md`, `FUTURE-REEL-STANDARD.md` und `brain.json`
4. prüft Scriptlänge, Szenenzahl und geplante Dauer
5. erkennt und normalisiert das Audio
6. transkribiert das finale Voiceover mit echten Wortzeiten
7. richtet Szenengrenzen, Untertitel und semantische Animationen an derselben Zeitbasis aus
8. verwendet den bereits programmierten Remotion-Code
9. führt TypeScript und fokussierte Tests aus
10. rendert alle Checkpoints, das Cover und das vollständige MP4
11. erzeugt Kontaktbogen und technische Berichte
12. prüft das MP4 in normaler Geschwindigkeit und Smartphone-Größe
13. korrigiert belegte technische oder visuelle Fehler
14. führt nach Änderungen denselben vollständigen Build erneut aus
15. behauptet keine Prüfung oder Freigabe, die nicht wirklich erfolgt ist

Codex darf Storyboard und Voiceover nicht eigenmächtig neu erfinden, keine generierten Szenenbilder, Musik oder SFX ergänzen und nicht mergen.

## Script-Vertrag

### Hook

Die erste Aussage ist eine direkte Frage, ein klarer Widerspruch oder eine überraschende Behauptung. Sie spricht den Zuschauer oder seine KI direkt an.

Beispiel:

```text
Warum halluziniert deine KI, obwohl sie so sicher klingt?
```

### Dramaturgie

Ein typisches Reel folgt:

```text
Hook
→ Problem
→ Ursache
→ Mechanismus
→ Folge oder Risiko
→ Warnzeichen oder Beispiel
→ einfache Lösung
→ klare Schlussaussage
```

Regeln:

- ein Hauptgedanke pro Szene
- einfache Sprache
- keine künstlichen Füllsätze
- keine unnötigen Fachwörter
- keine Wiederholung derselben Aussage
- Beispiele eindeutig als Beispiele kennzeichnen
- Hook, Erklärung und Lösung vollständig im Voiceover abdecken

## Audiovertrag

```text
Quelldatei: 1,00x
Standard-Wiedergabe: 1,00x
Maximal ohne neue ausdrückliche Entscheidung: 1,05x
Tonhöhe: natürlich erhalten
Musik: aus
Soundeffekte: aus
```

Die reale Audiodatei ist der endgültige Taktgeber. Untertitel, Szenengrenzen, wichtige Wortreaktionen und Ergebnis-Holds verwenden dieselben transkriptbasierten Wortzeiten.

Bei 1,00x:

```text
Videoframe = round(Wortzeit in Sekunden × 30)
```

Bei einer ausdrücklich freigegebenen anderen Playback-Rate:

```text
Videosekunde = Quellzeit / Playback-Rate
Videoframe = round(Videosekunde × 30)
```

Vorläufige Cues dürfen nicht als exakte Synchronisierung bezeichnet werden.

## Cover-Vertrag

Das Cover ist ein separates statisches Bild und nicht Teil der Reel-Animation.

Es enthält:

- genau ein starkes Hauptmotiv
- genau einen kurzen, direkten deutschen Satz zum Thema
- keine zusätzlichen Labels, Untertitel oder Nebenbotschaften
- klare Smartphone-Lesbarkeit
- denselben Markenstil wie das Reel
- keine unnötigen Details

Der Satz wird deterministisch gesetzt. Ein Bildgenerator darf keine lesbare Schrift erfinden. Das finale Cover bleibt trotzdem genau eine Bilddatei.

## Animationsvertrag

Jede Szene folgt:

```text
klarer Startzustand
→ verständliche Ursache oder Begriff
→ eine dominante Hauptbewegung
→ sichtbare Wirkung
→ ruhiger Ergebnis-Hold
```

### Standardrhythmus

```text
0,0–0,6 s   klarer Startzustand
0,6–2,0 s   Ursache oder Begriff erscheint
2,0–4,8 s   Hauptanimation erklärt den Inhalt
4,8–6,0+ s  Ergebnis wird sichtbar und gehalten
```

Die echte Audiodatei bestimmt die genauen Zeitpunkte.

### Bewegungsregeln

- Animation erklärt Inhalt und dekoriert ihn nicht nur
- wichtige Begriffe reagieren exakt beim gesprochenen Ausdruck
- Füllwörter erhalten keine große Einzelanimation
- maximal zwei starke Bewegungen gleichzeitig
- höchstens vier Bedeutungsbeats pro Szene
- kein Dauerzoom
- kein Dauerpuls
- kein Partikelteppich
- keine zufällige Bewegung
- keine schnellen Kamerawechsel
- Hard Cut als Standard
- Übergang nur bei echtem inhaltlichem Zusammenhang
- keine vollständige Choreografie innerhalb eines Reels wiederholen
- aufeinanderfolgende Szenen verwenden unterschiedliche Layout- oder Bewegungssignaturen

## Layout-Vertrag

- Hauptvisual groß und zentral
- keine unnötig leeren Flächen
- keine überfüllten Mini-Dashboards
- keine dünnen Linien oder winzigen Labels als Kerninformation
- Headline, Hauptvisual und Untertitel besitzen getrennte Safe-Zones
- zentrale Informationen müssen auf Smartphone-Größe sofort lesbar sein
- Ergebniszustand muss auch ohne Ton verständlich sein

## Untertitel-Vertrag

- normale Satzuntertitel, keine hektischen Zwei- bis Vier-Wort-Blöcke
- maximal zwei Zeilen
- ungefähr 50 px, bei langen Sätzen mindestens 40 px
- weiß mit dunkler Kontur oder starkem Schatten
- kein großer Untertitelkasten
- nur bereits gesprochene Wörter anzeigen
- aktuelles wichtiges Wort nur dezent hervorheben
- kein Bounce oder Springen des gesamten Satzes
- Timing ausschließlich aus echten Wortzeiten

## Qualitätsgates

### Redaktionell

- Hook ist direkt und verständlich
- Script liegt zwischen 125 und 145 Wörtern oder eine begründete Ausnahme ist dokumentiert
- Reel erreicht mindestens ungefähr eine Minute ohne künstliche Füllung
- jede Szene erklärt genau einen Hauptgedanken
- Visualisierung entspricht exakt dem gesprochenen Inhalt
- alle wichtigen Bedeutungsbeats sind visuell abgedeckt
- Kernaussage bleibt auch ohne Ton verständlich

### Technisch

- 1080 × 1920, 30 FPS
- lückenlose Szenen
- finales Transcript vorhanden
- TypeScript und fokussierte Tests bestanden
- aktuelle Checkpoints, Cover und MP4 gerendert
- technische Artefaktprüfung bestanden
- alte Render werden nach einer Codeänderung nicht wiederverwendet

### Visuell

- keine hektische Bewegungskette
- maximal zwei starke gleichzeitige Bewegungen
- keine leere oder unfertig wirkende Szene
- Headline, Hauptvisual und Untertitel überlappen nicht
- Ergebniszustand mindestens eine Sekunde lesbar
- Text und UI funktionieren in Smartphone-Größe
- Kontaktbogen wurde geprüft
- vollständiges aktuelles MP4 wurde in normaler Geschwindigkeit angesehen
- keine generierten Szenenbilder im Reel
- Cover enthält genau einen Satz und ein Hauptmotiv

## Abbruchregeln

Build oder Freigabe stoppen, wenn:

- Voiceover unter 55 Sekunden liegt und der Inhalt gequetscht wirkt
- mehr als zwei starke Bewegungen gleichzeitig konkurrieren
- ein wichtiger Satzteil keine passende Visualisierung besitzt
- eine Szene weniger als eine Sekunde Ergebnis-Hold bietet
- Kerntext auf Smartphone-Größe nicht lesbar ist
- die Szene nur aus dekorativer Bewegung besteht
- finale Audiodatei nicht transkribiert wurde
- alte Render nach einer Codeänderung verwendet werden

## Statussprache

- `planned`: Inhalt und Choreografie stehen
- `implemented`: Code existiert
- `transcript-aligned`: echte Wortzeiten wurden eingebaut
- `typechecked`: TypeScript wurde wirklich ausgeführt
- `tested`: Tests wurden wirklich ausgeführt
- `rendered`: aktueller Code wurde wirklich gerendert
- `technically-validated`: aktuelle Artefakte wurden technisch geprüft
- `visually-reviewed`: aktueller Render wurde wirklich angesehen
- `approved`: Nutzer hat freigegeben
- `rejected`: Nutzer hat die visuelle oder redaktionelle Richtung abgelehnt

## Lernregel

Nach jedem geprüften Reel wird unter `05-review/` eine kurze Analyse gespeichert:

- tatsächliche Dauer und Wortzahl
- zu schnelle oder zu langsame Stellen
- unklare oder besonders verständliche Visualisierungen
- Probleme bei Untertiteln und Safe-Zones
- bewährte Animationen
- mögliche Regeländerungen

Belegte Nutzerkritik aus einem echten Render darf zur Produktionsregel werden. Der Halluzinations-Render hat diese belegten Erkenntnisse geliefert:

- 36 Sekunden waren zu kurz
- 1,10x verstärkte den hektischen Eindruck
- durchschnittlich rund 4,5 Sekunden pro Szene waren für mehrere Teilaktionen zu knapp
- generierte Szenenbilder passten stilistisch und inhaltlich nicht zuverlässig
- kleine UI-Details und schnelle Zustandswechsel minderten die Lesbarkeit
- zukünftige Reels müssen einfacher, länger und vollständig in Remotion animiert sein
