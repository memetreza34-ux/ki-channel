# Codex-first workflow für zukünftige KI-Reels

## Ziel

Der Nutzer erzeugt nur das finale Voiceover und das separate Cover-Motiv. Das Reel selbst wird vollständig mit vorprogrammierten Remotion-Szenen gebaut. Codex übernimmt nach dem Einfügen des Audios die technische Synchronisierung, Prüfung und Ausgabe.

## Verbindliche Produktionswerte

- 1080 × 1920
- 30 FPS
- 60 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 6 bis 8 Sekunden pro normaler Szene
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- ein separates statisches Cover mit einem Satz
- Voiceover und Wiedergabe standardmäßig 1,00x
- höchstens 1,05x nur nach ausdrücklicher Freigabe
- keine Musik und keine Soundeffekte

## Sichtbare Reel-Struktur

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

### Bedeutung

- `00-cover/` enthält Cover-Satz, Cover-Motiv und später die finale statische Bilddatei.
- `01-voice-script/` enthält Fließtext, Szenenzuordnung und Voice-Anweisung.
- `02-audio/` enthält genau eine finale Audio- oder Mediendatei.
- `03-szenen/` enthält Szenenpläne und semantische Beat-Maps, aber keine generierten Szenenbilder.
- `04-caption/` enthält Social-Caption und Regeln für die Video-Untertitel.
- `05-review/` enthält Status, Kontaktbogen, Analysen und QA-Berichte.
- `06-video/` enthält das finale MP4.
- `render/` enthält aktuelle Checkpoint-Frames.
- `timeline/` enthält den technischen Reel-Vertrag, Storyboard und Motion-Design.

## Planung vor dem Nutzer-Audio

Vor dem Einfügen der Audiodatei müssen fertig sein:

1. direkter Hook
2. 125 bis 145 Wörter Voiceover
3. 8 bis 9 Szenen mit je einem Hauptgedanken
4. semantische Beat-Map jeder Szene
5. ein Cover-Satz und ein Hauptmotiv
6. vollständiger Remotion-Code für alle Szenen
7. Composition-Registrierung
8. Tests
9. Checkpoints und Renderpipeline
10. reel-spezifischer Codex-Auftrag

Eine Beat-Map verwendet:

```text
wichtiger Ausdruck → visuelle Reaktion → Transcript-Auslöser → Ergebniszustand
```

## Nutzer-Schritt

Der Nutzer:

1. erzeugt das Voiceover bei 1,00x
2. legt genau eine Audio- oder Mediendatei direkt in `02-audio/`
3. erzeugt beziehungsweise liefert das freigegebene Cover-Motiv
4. startet Codex mit dem vorhandenen Reel-Auftrag
5. prüft Cover und finales MP4 persönlich

Im Reel selbst müssen keine Bilder eingefügt werden.

## Codex-Ablauf

Codex:

1. prüft Branch und Arbeitsbaum
2. liest Root- und Reel-`AGENTS.md`
3. liest Produktionsgehirn und Zukunftsstandard
4. prüft Wortzahl, Szenenzahl und geplante Dauer
5. prüft, dass alle Szenen als Remotion-Code existieren
6. erkennt und normalisiert das reale Audio
7. transkribiert das finale Voiceover mit Wortzeiten
8. richtet Untertitel, Szenengrenzen und semantische Animationen an derselben Zeitbasis aus
9. führt TypeScript und fokussierte Tests aus
10. rendert Smoke-Frames
11. prüft die Smoke-Frames groß und auf Smartphone-Größe
12. korrigiert belegte Probleme
13. rendert alle Checkpoints
14. erzeugt und prüft einen Kontaktbogen
15. rendert das statische Cover
16. rendert das vollständige MP4
17. sieht das MP4 in normaler Geschwindigkeit und Smartphone-Größe an
18. führt technische Artefaktprüfung aus
19. aktualisiert nur tatsächlich bestandene Review-Punkte

## Audio und Synchronisierung

Das reale Audio ist der Taktgeber.

Bei 1,00x:

```text
Videoframe = round(Wortzeit in Sekunden × 30)
```

Bei ausdrücklich freigegebener anderer Playback-Rate:

```text
Videosekunde = Quellzeit / Playback-Rate
Videoframe = round(Videosekunde × 30)
```

Wichtige Animationen dürfen nicht vor dem gesprochenen Ausdruck erscheinen. Vorläufige Cues dürfen nicht als exakte Transkript-Synchronisierung bezeichnet werden.

## Animation

Jede Szene besitzt:

```text
klaren Startzustand
→ Begriff oder Ursache
→ dominante Hauptbewegung
→ sichtbare Wirkung
→ mindestens eine Sekunde Ergebnis-Hold
```

- maximal zwei starke Bewegungen gleichzeitig
- maximal vier Bedeutungsbeats pro Szene
- keine schnellen Effektketten
- keine dekorative Dauerbewegung
- keine generierten Szenenbilder
- keine wiederholte Vollchoreografie
- Hard Cut als Standard

## Untertitel

- normale Satzuntertitel
- keine hektischen Zwei- bis Vier-Wort-Blöcke
- maximal zwei Zeilen
- ungefähr 50 px, mindestens 40 px
- weiß mit dunkler Kontur oder starkem Schatten
- kein großer Untertitelkasten
- nur bereits gesprochene Wörter
- dezente Hervorhebung des aktuellen wichtigen Wortes
- kein Bounce des gesamten Satzes

## Cover

Das Cover ist eine einzige statische Bilddatei mit:

- einem Hauptmotiv
- genau einem kurzen deutschen Satz
- keiner weiteren Botschaft
- klarer Smartphone-Lesbarkeit

Das Motiv kann extern erzeugt werden. Der deutsche Satz wird deterministisch gesetzt, damit keine Fantasieschrift entsteht.

## Definition of Done

Ein zukünftiges Reel ist erst fertig, wenn:

- Wortzahl und echte Dauer geprüft sind
- reales Transcript eingebaut ist
- semantische Beat-Abdeckung vollständig ist
- TypeScript und fokussierte Tests bestanden sind
- aktuelle Checkpoint-Frames gerendert und geprüft wurden
- Kontaktbogen geprüft wurde
- aktuelles Cover geprüft wurde
- aktuelles MP4 vollständig in normaler Geschwindigkeit angesehen wurde
- Smartphone-Lesbarkeit bestätigt ist
- technische Artefaktprüfung bestanden ist
- Nutzer die Endfassung freigegeben hat
