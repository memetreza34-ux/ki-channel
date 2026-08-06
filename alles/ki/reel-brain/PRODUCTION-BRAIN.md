# KI-Reel-Produktionsgehirn

## Zweck

Dieses Dokument ist die dauerhafte Wahrheit für den KI-Reel-Workflow. Es legt Struktur, Aufgaben, Timing, Animation, Audio und Qualitätsgates fest.

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

## Neue Standardrichtung ab dem nächsten Reel

Der erste vollständige Render war technisch brauchbar, aber visuell zu schnell, zu kurz und durch externe Szenenbilder inkonsistent. Deshalb gelten ab dem nächsten Reel diese Regeln:

- Reel-Länge: **60 bis 70 Sekunden**
- Voiceover: **125 bis 145 Wörter**
- Szenen: **8 bis 9**
- Szenenlänge: normalerweise mindestens **6 Sekunden**
- Audio: standardmäßig **1,00x**, maximal **1,05x** nur nach bewusster Freigabe
- Reel selbst: **100 Prozent Remotion-Animation**, keine generierten Szenenbilder
- Cover: genau **ein separates statisches Bild** mit einem klaren Satz zum Reel-Thema
- maximal **zwei** starke Bewegungen gleichzeitig
- pro Szene eine klare Aussage und eine dominante visuelle Erklärung
- jedes wichtige Bedeutungswort oder jeder wichtige Inhalt bekommt eine passende Animation
- Füllwörter erhalten nur Untertitel-Timing, keine große Einzelanimation
- Ergebniszustand mindestens **eine Sekunde** ruhig und lesbar halten
- keine leeren Szenenanfänge und keine hektischen Ketten aus mehreren Effekten

Beispiel für einen direkten Hook:

```text
Warum halluziniert deine KI, obwohl sie so sicher klingt?
```

## Aufgabenverteilung

### Planung und Vorbau

Vor dem Nutzer-Audio müssen vollständig vorliegen:

- Thema und direkter Hook
- finaler deutscher Voiceover-Text
- 8 bis 9 Szenen mit klarer Argumentationsfolge
- Cover-Prompt
- semantische Wort- und Inhaltsreaktionen
- vollständiger ausführbarer Remotion-Code
- Composition, Tests, Checkpoints und Build-Pipeline
- Reel-lokaler Codex-Auftrag

### Nutzer

Der Nutzer muss nur:

1. das Cover-Bild anhand des freigegebenen Cover-Prompts erzeugen
2. das Voiceover bei normaler Quellgeschwindigkeit erzeugen
3. genau eine Audio- oder Mediendatei in `02-audio/` ablegen
4. Codex den vorhandenen Gesamtbuild ausführen lassen
5. das finale MP4 persönlich freigeben

Für das Reel selbst werden standardmäßig keine Szenenbilder mehr benötigt.

### Codex

Codex ist Produktionsingenieur, nicht Creative Director. Codex:

1. prüft Branch und Arbeitsbaum
2. liest Root- und Reel-`AGENTS.md`
3. liest dieses Produktionsgehirn
4. erkennt und normalisiert das Audio
5. transkribiert das finale Voiceover
6. richtet Untertitel, semantische Animationen und Szenengrenzen an den echten Wortzeiten aus
7. verwendet den bereits programmierten Remotion-Code
8. führt TypeScript und fokussierte Tests aus
9. rendert alle Checkpoints und das vollständige MP4
10. erzeugt Kontaktbogen und technische Berichte
11. korrigiert belegte technische oder visuelle Fehler
12. behauptet keine Freigabe, die nicht wirklich erfolgt ist

Codex darf Storyboard und Voiceover nicht eigenmächtig neu erfinden, keine Musik oder SFX ergänzen und nicht mergen.

## Audiovertrag

```text
Quelldatei: 1,00x
Standard-Wiedergabe: 1,00x
Maximal ohne ausdrückliche Freigabe: 1,05x
Tonhöhe: natürlich erhalten
Musik: aus
Soundeffekte: aus
```

Die reale Audiodatei ist der endgültige Taktgeber. Untertitel und Animationen verwenden dieselben transkriptbasierten Wortzeiten.

## Cover-Vertrag

Das Cover ist ein separates statisches Bild und nicht Teil der Reel-Animation.

Es enthält:

- genau ein starkes Motiv
- einen kurzen, direkten deutschen Satz zum Thema
- klare Smartphone-Lesbarkeit
- denselben Markenstil wie das Reel
- keine unnötigen Details

## Animationsvertrag

Jede Szene folgt:

```text
klarer Startzustand
→ verständliche Ursache
→ eine dominante Hauptbewegung
→ sichtbare Wirkung
→ ruhiger Ergebnis-Hold
```

Regeln:

- Animation erklärt Inhalt, sie dekoriert ihn nicht nur
- wichtige Begriffe reagieren exakt beim gesprochenen Wort
- nicht jedes Wort erhält eine große Bewegung
- maximal sieben Untertitelwörter gleichzeitig
- keine Dauerzooms, Dauerpulse, Partikelteppiche oder zufälligen Bewegungen
- Hard Cut als Standard
- Übergänge nur bei echtem inhaltlichem Zusammenhang
- kleine Labels und dünne UI-Elemente vermeiden
- zentrale Informationen müssen auf dem Smartphone sofort lesbar sein

## Qualitätsgates

### Technisch

- 1080 × 1920, 30 FPS
- lückenlose Szenen
- finales Transcript vorhanden
- TypeScript und fokussierte Tests bestanden
- aktuelle Checkpoints und MP4 gerendert
- technische Artefaktprüfung bestanden

### Visuell

- keine hektische Bewegungskette
- keine leeren oder fast leeren Szenen
- Headline, Hauptvisual und Untertitel überlappen nicht
- wichtige Zustände mindestens eine Sekunde lesbar
- Text und UI funktionieren in Smartphone-Größe
- vollständiges aktuelles MP4 wurde angesehen

### Redaktionell

- Hook ist direkt und verständlich
- Script erreicht mindestens eine Minute, ohne künstliche Füllung
- jede Szene erklärt genau einen Hauptgedanken
- Visualisierung entspricht dem gesprochenen Inhalt
- Kernaussage bleibt auch ohne Ton verständlich

## Statussprache

- `planned`: Inhalt und Choreografie stehen
- `implemented`: Code existiert
- `typechecked`: TypeScript wurde ausgeführt
- `tested`: Tests wurden ausgeführt
- `rendered`: aktueller Code wurde gerendert
- `technically-validated`: Artefakte wurden technisch geprüft
- `visually-reviewed`: aktueller Render wurde angesehen
- `approved`: Nutzer hat freigegeben
- `rejected`: Nutzer hat die visuelle oder redaktionelle Richtung abgelehnt

## Lernregel

Belegte Nutzerkritik aus einem echten finalen Render darf sofort zur Produktionsregel werden. Der Halluzinations-Render hat diese belegten Erkenntnisse geliefert:

- 36 Sekunden waren zu kurz
- 1,10x verstärkte den hektischen Eindruck
- durchschnittlich rund 4,5 Sekunden pro Szene waren für mehrere Teilaktionen zu knapp
- generierte Szenenbilder passten stilistisch und inhaltlich nicht zuverlässig
- zu kleine UI-Details und zu viele schnelle Zustandswechsel minderten die Lesbarkeit
- der nächste Versuch muss einfacher, länger und vollständig animiert sein
