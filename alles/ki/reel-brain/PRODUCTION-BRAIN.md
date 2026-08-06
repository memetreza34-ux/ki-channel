# KI-Reel-Produktionsgehirn

## Zweck

Dieses Dokument beschreibt den dauerhaften Produktionsablauf. Für alle neuen Reels sind zusätzlich verbindlich:

1. `FUTURE-REEL-STANDARD.md`
2. `AUDIO-FIRST-SYNC-CONTRACT.md`
3. `brain.json`

Neue Reels verwenden `standardId: ki-animation-only-reel-v2`. Historische v1-Reels bleiben bestehen, dürfen aber nicht als Vorlage kopiert werden.

## Wichtigste Lernregel

Ein vorab geplanter Zeitplan ist niemals die finale Timeline.

```text
falsch:
feste Szenenframes → Audio hineinlegen

richtig:
finales Audio → Transcript → Szenen → Animationen → Untertitel → Dauer
```

Das echte Voiceover ist die einzige finale Zeitquelle.

## Repository-Struktur

```text
KI-Channel/
├── reels/
├── youtube/
└── alles/
```

Ein Reel liegt unter:

```text
reels/<woche>/<wochentag>/<reel-thema>/
├── 00-cover/
├── 01-voice-script/
├── 02-audio/
├── 03-szenen/
├── 04-caption/
├── 05-review/
├── 06-video/
├── render/
└── timeline/
```

## Standard für neue Reels

- 1080 × 1920, 30 FPS
- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- ein separates statisches Cover mit einem Satz
- Voiceover und Playback bei 1,00x
- keine Musik und keine Soundeffekte
- finales Video endet 1,2 bis 2,2 Sekunden nach dem letzten gesprochenen Wort

## Verantwortlichkeiten

### Planung

Vor dem Audio werden erstellt:

- Thema und direkter Hook
- finaler Voiceover-Text
- 8 bis 9 Hauptgedanken
- ein Cover-Satz und ein Hauptmotiv
- einfache Choreografie pro Szene
- ein bis drei semantische Sinnabschnitte pro Szene
- vollständiger Remotion-Vorbau
- Tests und Codex-Auftrag

Vorab verwendete Frames sind ausdrücklich als Platzhalter markiert.

### Nutzer

Der Nutzer:

1. erzeugt das Voiceover bei 1,00x
2. legt genau eine Audiodatei in `02-audio/`
3. erzeugt oder genehmigt das Cover
4. prüft das finale MP4 persönlich

### Codex

Codex:

1. liest alle globalen und lokalen Regeln
2. normalisiert das Audio
3. transkribiert Wörter, Sätze und Sinnpausen
4. misst Sprachbeginn und Sprachende
5. erstellt `timeline/final-sync.json`
6. ersetzt alle Platzhalter-Zeiten
7. leitet Szenengrenzen aus der Sprache ab
8. leitet Animationstrigger aus echten Wortzeiten ab
9. leitet Untertitel und violette Linie aus echten Satzzeiten ab
10. berechnet die Composition-Dauer aus dem Sprachende
11. führt Validator, TypeScript und Tests aus
12. rendert und prüft Checkpoints, Kontaktbogen, Cover und MP4
13. meldet nur tatsächlich geprüfte Ergebnisse

Codex darf weder Story noch Script eigenmächtig neu erfinden und nicht mergen.

## Audio-first-Vertrag

Final erforderlich:

```text
timeline/final-sync.json
```

Diese Datei enthält:

- Audio-Dauer
- Sprachbeginn
- Sprachende
- finale Composition-Dauer
- finale Szenengrenzen
- vollständige Satz-Untertitel
- violette Fortschrittslinie
- semantische Trigger
- Ergebnis-Holds

Toleranzen:

- Trigger maximal ±5 Frames
- Szenengrenze maximal ±6 Frames von der Sinnpause
- erster Untertitel spätestens 3 Frames nach Sprachbeginn
- Schluss-Hold 1,2 bis 2,2 Sekunden
- keine aktive Fallback-Zeitquelle

## Einfache visuelle Choreografie

Jede Szene folgt:

```text
1 Hauptobjekt
→ 1 gesprochener Sinnabschnitt
→ 1 dominante Hauptbewegung
→ 1 klares Ergebnis
```

Regeln:

- höchstens zwei kleine unterstützende Elemente
- maximal zwei starke Bewegungen gleichzeitig
- maximal drei Bedeutungsbeats
- Hauptvisual nutzt ungefähr 55 bis 72 Prozent der Animationsfläche
- keine Mini-Dashboards
- keine Ansammlung kleiner Karten
- keine dauerhaft sichtbare Szenennummer
- kein dauerhaft wiederholter Kicker
- keine Emojis als Hauptvisual
- keine dünnen Linien oder kleinen Labels als Kerninformation
- keine dekorative Dauerbewegung
- keine schnelle Effektkette
- wichtige Bewegung beginnt auf oder unmittelbar nach dem gesprochenen Sinnabschnitt
- Ergebnis bleibt mindestens eine Sekunde ruhig sichtbar

Ein wiederkehrendes Hauptobjekt wird bevorzugt, wenn es die Geschichte verständlicher macht.

## Semantische Animation

Nicht jedes Wort wird animiert. Pro Szene werden ein bis drei zentrale Sinnabschnitte ausgewählt.

```text
Sinnabschnitt
→ passende visuelle Reaktion
→ echter Transcript-Auslöser
→ sichtbarer Ergebniszustand
```

Eine Bewegung muss die Aussage erklären. Eine thematisch passende, aber inhaltlich unklare Bewegung ist nicht ausreichend.

## Untertitel-Vertrag

Neue Reels verwenden die zentrale Komponente:

```text
ki/src/components/StableSentenceCaption.tsx
```

Darstellung:

- vollständiger Satz oder Sinnabschnitt erscheint sofort
- Text bleibt vollständig stabil
- maximal zwei Zeilen
- 46 bis 52 px, mindestens 42 px
- Unterkante 210 bis 235 px, Standard 220 px
- weiß mit dunkler Kontur oder starkem Schatten
- kein großer Kasten
- keine Wort-für-Wort-Einblendung
- keine Einzelwort-Markierung
- kein Bounce oder Skalieren

Unter dem Satz bewegt sich genau eine violette Linie von 0 auf 100 Prozent. Ihre Dauer entspricht exakt der echten Satzdauer.

## Cover-Vertrag

Das Cover ist eine einzelne statische Bilddatei mit:

- einem Hauptmotiv
- genau einem kurzen deutschen Satz
- keiner Unterzeile
- keinen zusätzlichen Labels
- kontrolliert gesetzter Schrift
- Smartphone-Lesbarkeit

## Pflichtprüfungen

Vor finalem Render:

```bash
node scripts/validate-future-reel-standard.mjs <reel-ordner> --final
```

Der Build stoppt bei:

- fehlendem `final-sync.json`
- aktiver Fallback-Zeitquelle
- falscher Schlusslänge
- unsynchronen Triggern oder Szenengrenzen
- Wort-für-Wort-Untertiteln
- zu tiefen Untertiteln
- mehr als drei Beats pro Szene
- Mini-Dashboards oder unklarer Kartenansammlung
- nicht ausreichend großem Hauptvisual
- veraltetem Render nach Code- oder Sync-Änderung

## Definition of Done

Ein Reel ist erst fertig, wenn:

- finales Audio und echtes Transcript vorhanden sind
- `final-sync.json` gültig ist
- Produktionscode nur finale Sync-Daten nutzt
- Trigger und Szenengrenzen innerhalb der Toleranzen liegen
- Untertitel stabil und richtig positioniert sind
- finale Dauer am echten Sprachende ausgerichtet ist
- TypeScript und Tests bestanden sind
- aktuelle Checkpoints und Kontaktbogen geprüft wurden
- vollständiges MP4 bei normaler Geschwindigkeit und Smartphone-Größe angesehen wurde
- technische Artefaktprüfung bestanden ist
- Nutzer freigegeben hat

## Statussprache

- `planned`
- `implemented-placeholder-timing`
- `final-sync-created`
- `transcript-aligned`
- `typechecked`
- `tested`
- `rendered`
- `technically-validated`
- `visually-reviewed`
- `approved`
- `rejected`

## Neue belegte Erkenntnisse

Aus den bisherigen Rendern gelten dauerhaft:

- feste Szenenlängen führen ohne nachträglichen Audio-Umbau zu deutlicher Desynchronisation
- künstliche Videolänge erzeugt unnötige Schlussstille
- Wort-für-Wort-Untertitel wirken hektisch und unsynchron
- Untertitel nahe dem unteren Rand sind für Plattformen ungeeignet
- mehrere kleine Karten und Messwerte wirken kompliziert und gleichzeitig leer
- eine einfache Hauptmetapher pro Szene ist verständlicher als ein Mini-Dashboard
- Animationen müssen an Sinnabschnitte gekoppelt sein, nicht nur thematisch passen
