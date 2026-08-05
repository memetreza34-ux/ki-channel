# KI-Reel-Produktionsgehirn

## Zweck

Dieses Dokument ist die dauerhafte Wahrheit für den gesamten KI-Reel-Workflow. Es legt fest, wie das Repository sichtbar aufgebaut ist, was vorab programmiert wird, welche Medien der Nutzer einfügt und welche Aufgaben Codex anschließend ausführt.

## Kanäle bleiben vollständig getrennt

- Dieses Repository ist ausschließlich für den KI-Kanal.
- FinanzNeo bleibt ein eigenständiges Repository.
- Keine FinanzNeo-Dateien, FinanzNeo-Workspaces oder FinanzNeo-Kanalordner hier anlegen.
- Übernommen wird nur die bewährte Ordner- und Produktionslogik.

## Verbindliche sichtbare Repository-Struktur

```text
KI-Channel/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── reels/
├── youtube/
└── alles/
```

Bedeutung:

- `reels/` enthält ausschließlich aktive Reel-Projekte.
- `youtube/` bleibt für spätere längere Videos reserviert.
- `alles/` enthält den gesamten technischen Unterbau: Remotion-Code, Bibliotheken, Skripte, Tests, Regeln und interne Dokumentation.

Keine zusätzlichen sichtbaren Technikordner am Repository-Root anlegen.

## Verbindliche Reel-Struktur

Jedes Reel liegt unter:

```text
reels/<woche>/<wochentag>/<reel-thema>/
```

Jeder Reel-Ordner verwendet genau diese Struktur:

```text
reel-thema/
├── 00-cover/
├── 01-voice-script/
├── 02-audio/
├── 03-szenen/
│   └── EINZELNE-SZENEN/
│       ├── scene-01/
│       ├── scene-02/
│       └── ...
├── 04-caption/
├── 05-review/
├── 06-video/
├── AGENTS.md
├── README.md
├── render/
└── timeline/
```

### Sichtbare Inhalte

- `00-cover/`: Cover und Hook.
- `01-voice-script/`: kopierfertiger Fließtext, Szenenzuordnung und Voice-Anweisung.
- `02-audio/`: genau eine vom Nutzer eingefügte Audio- oder Mediendatei.
- `03-szenen/`: alle Prompts, Szenenindex und ein eigener Ordner pro Szene.
- `04-caption/`: Social-Caption und Hinweise zum Video-Untertitel.
- `05-review/`: Status, Quellenprüfung, Timing, QA-Berichte und Codex-Ausführung.
- `06-video/`: finales MP4.
- `render/`: automatisch erzeugte Prüf-Frames.
- `timeline/`: technischer Reel-Vertrag, Storyboard, Motion-Design und Animationsmanifest.

Keine alten Parallelstrukturen, doppelten Planungsdateien oder zusätzliche Sammelordner innerhalb eines Reel-Projekts behalten.

## Aufgabenverteilung

### Planung und Vorbau

Vor dem Einfügen externer Medien werden vollständig erstellt:

- Thema, Hook und redaktionelle Struktur
- finaler deutscher Voiceover-Text
- Szenenreihenfolge und Kernaussage jeder Szene
- Entscheidung, welche Szenen Bilder benötigen
- vollständige Bildprompts
- Überschriften, Untertitelregeln und wichtige Wortreaktionen
- individuelle Hauptanimationen und Übergänge
- ausführbarer Remotion-Code für sämtliche Szenen
- Composition-Registrierung
- Audiovertrag und Medienvertrag
- Tests, Checkpoints und Renderpipeline
- Reel-lokaler Codex-Auftrag

Die Planung ist kein loses Konzept. Der Remotion-Code muss vor dem Einfügen der Nutzer-Medien existieren.

### Nutzer

Der Nutzer muss nur:

1. den fertigen Voiceover-Text in einem Voice-Tool bei normaler Quellgeschwindigkeit erzeugen
2. genau eine unterstützte Audio- oder Mediendatei direkt in `02-audio/` ablegen
3. die freigegebenen Bildprompts verwenden
4. bei jeder als Bildszene markierten Szene genau eine unterstützte Bilddatei direkt in den jeweiligen Szenenordner legen
5. den vorhandenen Gesamtbuild mit Codex starten
6. das finale MP4 persönlich ansehen und freigeben

Der Dateiname der eingefügten Medien ist egal. Der Ordner bestimmt die Funktion.

### Medienregeln

Audio:

```text
02-audio/<beliebiger-dateiname>.wav|mp3|m4a|aac|ogg|mp4|mov|webm
```

Bildszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/<beliebiger-dateiname>.png|jpg|jpeg|webp
```

Regeln:

- In `02-audio/` liegt genau eine unterstützte Medien-Datei.
- In jeder benötigten Bildszene liegt genau eine unterstützte Bilddatei.
- In Remotion-only-Szenen liegt keine Bilddatei.
- Fehlende, leere oder doppelte Medien stoppen den Build.
- Codex darf fehlende Medien nicht durch Platzhalter oder fremde Bilder ersetzen.

### Codex

Codex ist nach dem Einfügen der Medien Produktionsingenieur, nicht Creative Director.

Codex:

1. prüft Branch und Arbeitsbaum
2. liest Root- und Reel-lokale `AGENTS.md`
3. liest dieses Produktionsgehirn
4. führt ausschließlich den reel-spezifischen Gesamtbuild aus
5. erkennt die Nutzer-Medien anhand ihrer Ordner
6. normalisiert Audio und Bilder für Remotion
7. verwendet den bereits programmierten Remotion-Code
8. führt TypeScript und fokussierte Tests aus
9. rendert alle Checkpoint-Frames
10. führt technische Artefaktprüfung aus
11. rendert Cover und vollständiges MP4
12. erzeugt Kontaktbogen und Build-Bericht
13. behebt nur konkret nachgewiesene technische Fehler
14. führt nach einer Korrektur denselben Gesamtbuild erneut aus
15. behauptet keine manuelle visuelle Freigabe

Codex darf nicht:

- das Storyboard neu erfinden
- das Voiceover umschreiben
- neue Vollanimationen entwerfen, obwohl sie bereits programmiert sind
- Dateien nur aus Geschmacksgründen refaktorieren
- Musik oder Soundeffekte ergänzen
- mergen oder einen Pull Request auf „Ready“ setzen

## Ein-Befehl-Prinzip

Jedes vorprogrammierte Reel besitzt einen einzigen normalen Build-Befehl. Für das Halluzinations-Reel lautet er aus `alles/`:

```bash
node scripts/build-why-ai-hallucinates.mjs \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_warum-ki-halluziniert
```

Ein Gesamtbuild soll Medienprüfung, Staging, Tests, TypeScript, Checkpoint-Render, MP4, Cover, technische QA, Kontaktbogen und Build-Bericht bündeln.

## Audiovertrag

```text
Quelldatei: bei 1,00x erzeugen
Remotion playbackRate: 1.10
Tonhöhe: natürlich erhalten
Musik: aus
Soundeffekte: aus
```

Das Audio darf nicht vorab extern auf 1,10x beschleunigt werden, sonst entsteht doppelte Beschleunigung.

### Transcript-Synchronisierung

Vorläufige Cues dienen nur dem Vorbau. Exakte Synchronität darf erst nach Verarbeitung des echten Voiceovers behauptet werden.

Für einen Wortzeitpunkt `t` in der 1,00x-Quelldatei gilt:

```text
Videosekunde = t / 1.10
Videoframe = round(Videosekunde × 30)
```

Untertitel, wichtige Wortreaktionen und erklärende Zustandswechsel müssen dieselben finalen Zeitpunkte verwenden. Keine getrennten Schätzsysteme.

Falls die automatische Wortzeit-Ermittlung für ein Reel noch nicht technisch ausgeführt wurde, muss dieser Punkt ausdrücklich als offen gemeldet werden. Vorläufige Cues dürfen nicht als exakte Transkriptsynchronisierung bezeichnet werden.

## Bildvertrag

Ein Bild ist ein visueller Anker. Remotion übernimmt:

- Überschriften und Untertitel
- Zahlen, Diagramme und Labels
- Fokusrahmen und Quellenstatus
- Masken und regionale Reveals
- Zustandsänderungen
- Connectoren und Übergänge

Ein flaches Bild darf nicht so behandelt werden, als seien seine Objekte echte getrennte Ebenen. Erlaubt sind nur ehrliche Masken, lokale Hervorhebung, leichte Tiefenwirkung und darüberliegende Remotion-Elemente.

## Animationsvertrag

Jede Szene folgt:

```text
lesbarer Startzustand
→ sichtbare Ursache
→ eine dominante Hauptbewegung
→ sichtbare Wirkung
→ stabiler Ergebnis-Hold
```

Regeln:

- eine dominante Erklärung pro Satz
- höchstens drei starke gleichzeitige Bewegungen
- jedes gesprochene Wort im Untertitel
- maximal neun Wörter gleichzeitig
- nur wichtige Wörter stark hervorheben
- kein generischer Dauerzoom
- kein Dauerpuls, kein Partikelteppich, kein zufälliges Wackeln
- Hard Cut als Standard
- Übergang nur bei weitergeführtem Objekt, Form, Richtung oder Zustand
- keine doppelte Vollanimation innerhalb eines Reels
- keine direkt wiederholte Layout- oder Bewegungssignatur

## Qualitätsgates

### Technisch

- korrekte Auflösung, FPS und Dauer
- fortlaufende Szenengrenzen
- gültige Medien und Assetpfade
- geordnete Cues innerhalb der Szenen
- TypeScript wirklich ausgeführt und bestanden
- fokussierte Tests wirklich ausgeführt und bestanden
- gültige PNG- und MP4-Artefakte
- aktueller Build-Bericht vorhanden

### Visuell

- keine abgeschnittenen Texte
- keine Überlappung von Headline, Hauptvisual und Untertitel
- keine leeren Szenenanfänge
- finaler Zustand vollständig sichtbar
- maximal drei konkurrierende starke Bewegungen
- Bildszenen enthalten echte Erklärung statt bloßem Zoom
- Smartphone-Kontrast und Lesbarkeit bestätigt
- vollständiges aktuelles MP4 angesehen

### Redaktionell

- Visualisierung entspricht exakt dem gesprochenen Inhalt
- Beispiele sind als Beispiele erkennbar
- Wahrscheinlichkeiten und Messwerte sind nicht irreführend
- Quellenstatus wird nicht als Wahrheit ausgegeben
- Kernaussage ist ohne Ton verständlich

## Statussprache

Diese Begriffe dürfen nicht vermischt werden:

- `planned`: Inhalt und Choreografie stehen
- `implemented`: Code existiert
- `typechecked`: TypeScript wurde wirklich ausgeführt
- `tested`: Tests wurden wirklich ausgeführt
- `rendered`: aktueller Code wurde wirklich gerendert
- `technically-validated`: aktuelle Artefakte wurden technisch geprüft
- `visually-reviewed`: aktueller Render wurde wirklich angesehen
- `approved`: Nutzer hat die Endfassung freigegeben

Eine implementierte Szene ist nicht automatisch getestet, gerendert oder freigegeben.

## Lernregel

Nach jedem freigegebenen Reel werden nur belegte Erkenntnisse übernommen:

- wiederkehrende visuelle Fehler
- tatsächlich bessere Bewegungsrhythmen
- bewährte Schriftgrößen und Safe-Zones
- funktionierende Bildbehandlungen
- verworfene Sound- und Übergangsmuster

Eine subjektive Vermutung wird nicht sofort zur globalen Regel. Änderungen am Gehirn benötigen einen konkreten beobachteten Grund.
