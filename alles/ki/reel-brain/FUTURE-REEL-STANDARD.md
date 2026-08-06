# Verbindlicher Standard für zukünftige KI-Reels

Dieses Dokument gilt für jedes neu geplante KI-Reel. Neue Projekte verwenden `ki-animation-only-reel-v2`.

Der zentrale Unterschied zu älteren Reels:

> Das echte Voiceover bestimmt die Timeline. Vorgeplante Sekunden und Frames sind nur Platzhalter und dürfen niemals unverändert in den finalen Render übernommen werden.

Historische Reels mit `ki-animation-only-reel-v1` bleiben reproduzierbar, sind aber keine Vorlage für neue Produktionen.

## 1. Format und redaktioneller Rahmen

- 1080 × 1920
- 30 FPS
- Ziel: ungefähr 58 bis 70 Sekunden
- Ziel: 125 bis 145 gesprochene Wörter
- 8 bis 9 Szenen
- ein Hauptgedanke pro Szene
- keine künstliche Verlängerung auf eine feste Zielzeit
- finale Dauer = echtes Sprachende + 1,2 bis 2,2 Sekunden ruhiger Abschluss-Hold
- maximal 0,6 Sekunden vor dem ersten gesprochenen Wort
- keine unnötige Stille zwischen Szenen

## 2. Medienstrategie

### Reel

- 100 Prozent deterministische Remotion-Animation
- keine generierten Szenenbilder
- keine dekorativen Stockbilder
- keine flachen Bildflächen mit generischem Zoom
- keine Menschen, Hände, Körperteile oder Roboter als visuelle Abkürzung

### Cover

- genau ein separates statisches Cover-Bild
- genau ein kurzer deutscher Satz
- genau ein Hauptmotiv
- keine Nebenbotschaft, Unterzeile oder zusätzliche Labels
- der finale Satz wird kontrolliert gesetzt; keine KI-Fantasieschrift

## 3. Script und Dramaturgie

### Hook

Die erste Zeile ist eine direkte Frage, ein klarer Widerspruch oder eine überraschende Behauptung. Sie spricht den Zuschauer oder seine KI direkt an.

### Dramaturgie

1. direkte Hook
2. Problem
3. Ursache
4. Mechanismus
5. sichtbare Folge
6. Beispiel oder Warnzeichen
7. konkrete Lösung
8. klare Schlussaussage

### Textregeln

- ein Hauptgedanke pro Szene
- einfache Sprache
- keine unnötigen Fachwörter
- keine künstlichen Füllsätze
- keine Wiederholung derselben Aussage
- Hook, Erklärung, Beispiel und Lösung vollständig im Voiceover

## 4. Audio-first-Timeline

### Feste Regel

Vor dem Voiceover dürfen Szenen nur mit groben Platzhalter-Zeiten geplant werden. Nach dem Einfügen der finalen Audiodatei muss Codex eine neue finale Timeline erzeugen.

Reihenfolge:

```text
finales Audio
→ echtes Wort- und Satz-Transcript
→ Sprachbeginn und Sprachende
→ Satzblöcke
→ Szenengrenzen
→ Bedeutungs-Auslöser
→ Untertitel
→ Composition-Dauer
→ Checkpoints
```

Nicht erlaubt:

```text
feste 65-Sekunden-Timeline
→ Audio nachträglich hineinlegen
```

### Finale Synchronisationsdatei

Jedes finale Reel benötigt:

```text
timeline/final-sync.json
```

Diese Datei ist die einzige finale Zeitquelle. Sie enthält:

- Audio-Dauer
- Sprachbeginn und Sprachende
- finale Composition-Dauer
- finale Szenengrenzen
- vollständige Untertitelsätze
- violette Fortschrittslinie pro Untertitelsatz
- semantische Trigger-Frames
- Ergebnis-Holds

Fallback-Cues und geschätzte Frames dürfen nach Vorliegen des Audios nicht mehr vom Produktionscode verwendet werden.

### Toleranzen

- Animationstrigger höchstens 5 Frames vor oder nach dem passenden gesprochenen Ausdruck
- Szenenwechsel höchstens 6 Frames von der zugehörigen Satz- oder Sinnpause entfernt
- erster Untertitel höchstens 3 Frames nach Sprachbeginn sichtbar
- letzter visueller Inhalt endet 1,2 bis 2,2 Sekunden nach dem letzten gesprochenen Wort
- keine Schlussstille über 2,2 Sekunden

## 5. Einfache Choreografie

Jede Szene besitzt:

```text
1 Hauptobjekt
1 Hauptbewegung
1 klaren Ergebniszustand
```

Zusätzlich sind höchstens zwei kleine unterstützende Elemente erlaubt.

### Bewegungsbudget

- eine dominante Hauptanimation
- maximal zwei starke Bewegungen gleichzeitig
- ein bis drei semantische Beats pro Szene
- keine Kette aus schnellen Einzeleffekten
- keine Bewegung nur zur Dekoration
- kein Dauerpuls
- kein Zufallswackeln
- kein Partikelteppich
- keine unnötigen Kamerawechsel
- Hard Cut als Standard

### Animationsrhythmus

Die echte Sprache bestimmt die genauen Frames. Innerhalb einer Szene gilt ungefähr:

```text
0,0–0,4 s   Hauptobjekt sofort verständlich
0,4–1,5 s   Ursache oder Begriff wird sichtbar
1,5–4,5 s   eine Hauptbewegung erklärt den Satz
letzte 1,0+ s Ergebnis bleibt ruhig lesbar
```

Eine Animation darf nicht vor dem dazugehörigen gesprochenen Inhalt passieren.

## 6. Semantische Zuordnung

Nicht jedes einzelne Wort wird animiert. Animiert werden ein bis drei zentrale Sinnabschnitte pro Szene.

Beispiel:

```text
„fehlendes Ziel“
→ Ziel-Steckplatz bleibt leer

„muss sie raten“
→ Auswahl zeigt mehrere mögliche Wege
```

Füllwörter erhalten keine eigene Bewegung.

Vor dem Coding enthält jede Szene:

```text
Sinnabschnitt → sichtbare Reaktion → Transcript-Auslöser → Ergebniszustand
```

Die visuelle Reaktion muss den gesprochenen Inhalt direkt erklären und nicht nur dasselbe Thema dekorieren.

## 7. Visuelles Design

- Hauptvisual nutzt ungefähr 55 bis 72 Prozent der verfügbaren Animationsfläche
- Hauptobjekt groß und zentral
- bevorzugt ein wiederkehrendes Hauptobjekt über mehrere Szenen, sofern es zum Thema passt
- keine Mini-Dashboards
- keine Ansammlung kleiner Karten
- keine dünnen Linien als Hauptinformation
- keine winzigen Labels
- höchstens zwei kurze erklärende Labels gleichzeitig
- keine dauerhaft sichtbare Szenennummer
- kein unnötiger Kicker über jeder Szene
- keine Emojis als zentrale Erklärung
- freie Fläche dient Fokus und darf nicht unfertig wirken
- Ergebnis muss auch ohne Ton verständlich sein

## 8. Untertitel-System

Der Text erscheint nicht mehr Wort für Wort.

### Verbindliche Darstellung

- kompletter aktueller Satz oder Sinnabschnitt erscheint sofort
- Text bleibt während seiner gesamten Sprachdauer stabil
- maximal zwei Zeilen
- 46 bis 52 px, niemals unter 42 px
- weiß mit klarer dunkler Kontur oder starkem Schatten
- kein großer Hintergrundkasten
- keine springenden Wörter
- keine wechselnden Wortgrößen
- keine Wort-für-Wort-Enthüllung
- keine einzelne Wortmarkierung

### Position

- Untertitel-Unterkante standardmäßig 210 bis 235 px über dem unteren Rand
- Plattform-Safe-Zone beachten
- Hauptvisual darf nicht mit dem Untertitel kollidieren

### Violette Synchronisationslinie

Unter dem vollständigen Satz befindet sich genau eine dünne violette Linie:

```text
Satz erscheint sofort
→ Linie startet bei 0 Prozent
→ Linie läuft gleichmäßig mit der echten Satzdauer
→ Linie erreicht bei Satzende 100 Prozent
→ nächster Satz ersetzt den vorherigen
```

- Linienhöhe: 6 bis 10 px
- keine zusätzlichen Karaoke-Effekte
- keine Wortmarkierung
- Progress ausschließlich aus realen Satzzeiten

## 9. Finale Länge

Die geplante Zielzeit ist nur redaktionell. Die finale Composition wird aus dem echten Audio berechnet:

```text
finale Dauer = letztes gesprochenes Wort + 1,2 bis 2,2 Sekunden Hold
```

Ein Reel darf nicht auf 65 Sekunden gestreckt werden, wenn die Sprache bereits bei 58 Sekunden endet.

## 10. Qualitätskontrolle

Ein Reel ist erst freigabefähig, wenn:

- finales Audio vorhanden ist
- echtes Wort- und Satz-Transcript vorhanden ist
- `timeline/final-sync.json` vorhanden und gültig ist
- Produktionscode ausschließlich finale Sync-Daten verwendet
- Szenengrenzen aus dem Audio abgeleitet sind
- Animationstrigger innerhalb der Toleranz liegen
- kein Fallback-Timing im finalen Render aktiv ist
- Untertitel vollständig sofort erscheinen
- nur die violette Linie synchron läuft
- Untertitel 210 bis 235 px über dem unteren Rand liegen
- keine Wort-für-Wort-Einblendung vorhanden ist
- finale Dauer höchstens 2,2 Sekunden nach Sprachende liegt
- alle Szenen ein großes Hauptvisual besitzen
- jede Szene nur eine dominante Hauptbewegung nutzt
- keine Szene visuell zu klein, kompliziert oder leer wirkt
- TypeScript und fokussierte Tests bestanden sind
- aktuelle Checkpoints und Kontaktbogen geprüft wurden
- vollständiges MP4 in normaler Geschwindigkeit und Smartphone-Größe angesehen wurde
- Nutzer die Endfassung freigegeben hat

## 11. Abbruchregeln

Build oder Freigabe stoppen, wenn:

- `final-sync.json` fehlt
- Audio, Untertitel, Szenen und Animationen unterschiedliche Zeitquellen verwenden
- ein Trigger mehr als 5 Frames vom gesprochenen Ausdruck abweicht
- ein Szenenwechsel mehr als 6 Frames von der Sinnpause abweicht
- mehr als 2,2 Sekunden Stille nach Sprachende verbleiben
- Untertitel Wort für Wort aufgebaut werden
- Untertitel tiefer als 190 px über dem unteren Rand liegen
- mehr als drei Bedeutungsbeats in einer Szene vorkommen
- mehr als zwei starke Bewegungen konkurrieren
- mehrere kleine UI-Karten die Hauptaussage tragen
- ein wichtiger Satz visuell nur dekoriert statt erklärt wird
- alte Render nach einer Code- oder Sync-Änderung verwendet werden

## 12. Lernschleife

Nach jedem geprüften Reel wird unter `05-review/` dokumentiert:

- echte Audio- und Videodauer
- Sprachbeginn und Sprachende
- Schluss-Hold
- größte Trigger-Abweichung in Frames
- größte Szenenwechsel-Abweichung in Frames
- Untertitelposition
- zu komplizierte oder zu leere Szenen
- bewährte Hauptobjekte und Bewegungen
- Nutzerfeedback

Nur beobachtete Ergebnisse dürfen den globalen Standard verändern.
