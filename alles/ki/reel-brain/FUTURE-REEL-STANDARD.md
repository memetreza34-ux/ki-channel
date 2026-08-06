# Verbindlicher Standard für zukünftige KI-Reels

Dieses Dokument gilt für jedes neu geplante Reel nach dem Halluzinations-Reel. Es ersetzt die frühere Hybrid-Strategie mit generierten Szenenbildern.

## 1. Format und Länge

- 1080 × 1920
- 30 FPS
- Ziel: 60 bis 70 Sekunden
- Ziel: 125 bis 145 gesprochene Wörter
- 8 bis 9 Szenen
- normalerweise 6 bis 8 Sekunden pro Szene
- keine Szene unter 5,5 Sekunden, außer ein bewusster kurzer Abschlussbeat
- mindestens 1,0 Sekunde ruhiger Ergebnis-Hold pro Szene

## 2. Medienstrategie

### Reel

- 100 Prozent Remotion-Animation
- keine generierten Szenenbilder
- keine dekorativen Stockbilder
- keine flachen Bildflächen mit Zoom
- keine Menschen, Hände, Körperteile oder Roboter als visuelle Abkürzung

### Cover

- genau ein separates statisches Cover-Bild
- ein klarer deutscher Satz, der das Reel-Thema direkt benennt
- nur ein Hauptmotiv
- keine weiteren Labels, Untertitel oder Nebenbotschaften
- das Motiv muss auch ohne Text zum Thema passen
- der finale Satz wird kontrolliert gesetzt; keine KI-Fantasieschrift

## 3. Script-Standard

Der Text soll einfach, direkt und verständlich sein.

### Hook

Die erste Zeile ist eine direkte Frage, ein klarer Widerspruch oder eine überraschende Behauptung. Sie spricht den Zuschauer oder seine KI direkt an.

Beispiel:

> Warum halluziniert deine KI, obwohl sie so sicher klingt?

### Dramaturgie

1. direkte Hook-Frage
2. Problem klar benennen
3. Ursache erklären
4. Mechanismus sichtbar machen
5. Folge oder Risiko zeigen
6. konkrete Warnzeichen oder Beispiele
7. einfache Handlungsempfehlung
8. klare Abschlussaussage

### Textregeln

- ein Hauptgedanke pro Szene
- keine künstlichen Füllsätze
- keine unnötigen Fachwörter
- keine Wiederholung derselben Aussage in anderer Form
- Beispiele müssen klar als Beispiele erkennbar sein
- Hook, Erklärung und Lösung müssen im Voiceover vollständig vorkommen

## 4. Audio und Timing

- Voiceover wird bei 1,00x erzeugt
- Standard-Playback im Reel: 1,00x
- höchstens 1,05x nach echter Hörprobe und ausdrücklicher Entscheidung
- keine automatische 1,10x-Beschleunigung
- Tonhöhe natürlich erhalten
- keine Musik
- keine Soundeffekte

Die finale Audiodatei ist der Taktgeber. Exakte Wortzeiten kommen aus dem realen Transcript.

```text
Wortzeit in Sekunden × 30 = Ziel-Frame bei 1,00x
```

Bei einer freigegebenen anderen Playback-Rate:

```text
Videosekunde = Quellzeit / Playback-Rate
Videoframe = round(Videosekunde × 30)
```

Untertitel, wichtige Wortreaktionen, Szenengrenzen und Ergebnis-Holds verwenden dieselbe finale Zeitbasis.

## 5. Animationsrhythmus

Jede Szene folgt grundsätzlich diesem Rhythmus:

```text
0,0–0,6 s   klarer lesbarer Startzustand
0,6–2,0 s   Begriff oder Ursache erscheint
2,0–4,8 s   dominante Hauptanimation erklärt den Inhalt
4,8–6,0+ s  Ergebnis wird sichtbar und ruhig gehalten
```

Die Werte sind Richtlinien, keine starre Schablone. Der gesprochene Inhalt bestimmt das echte Timing.

### Bewegungsbudget

- eine dominante Hauptanimation pro Szene
- maximal zwei starke Bewegungen gleichzeitig
- höchstens vier klar unterscheidbare Bedeutungsbeats pro Szene
- keine Kette aus schnellen Effekten
- keine Bewegung nur, damit etwas ständig in Bewegung bleibt
- keine schnellen Kamerawechsel
- Hard Cut als Standard
- Übergänge nur, wenn Objekt, Richtung, Zustand oder Form sinnvoll weitergeführt werden

## 6. Semantische Animation

Jeder wichtige Bedeutungsinhalt erhält eine passende sichtbare Reaktion.

Beispiele:

- `Wahrheit` → Prüfmechanismus oder blockiertes Wahrheitssignal
- `wahrscheinlich` → Ranking, Prozentwerte oder Auswahlprozess
- `Lücke` → sichtbar fehlender Baustein
- `Muster` → wiederkehrende Formen füllen eine Lücke
- `Quelle` → überprüfbarer Herkunftspfad
- `wechseln` → widersprüchliche Werte tauschen sich
- `gegenprüfen` → Vergleich oder Prüfgate wird aktiviert

Füllwörter wie `und`, `die`, `weil`, `eine`, `sich` erhalten keine große Einzelanimation. Sie werden nur sauber im Untertitel synchronisiert.

Vor dem Coding muss jede Szene eine Beat-Liste enthalten:

```text
wichtiger Ausdruck → visuelle Reaktion → Startwort → Ergebniszustand
```

Kein wichtiger Inhalt darf nur im Voiceover vorkommen, ohne visuell erklärt zu werden.

## 7. Layout und Lesbarkeit

- Hauptvisual groß und zentral
- keine unnötig leeren Flächen
- keine überfüllten Mini-Dashboards
- keine dünnen Linien oder winzigen Labels als Kerninformation
- Headline, Hauptvisual und Untertitel besitzen getrennte Safe-Zones
- alle Kerninformationen müssen auf Smartphone-Größe lesbar sein
- Ergebniszustand muss ohne Voiceover verständlich sein

### Untertitel

- normale lesbare Satzuntertitel, keine hektischen Zwei- bis Vier-Wort-Blöcke
- maximal zwei Zeilen
- ungefähr 50 px, bei langen Sätzen mindestens 40 px
- weiß mit dunkler Kontur oder starkem Schatten
- kein großer Untertitelkasten
- aktuelles wichtiges Wort darf dezent hervorgehoben werden
- kein Bounce oder Springen des gesamten Satzes
- nur bereits gesprochene Wörter anzeigen
- Timing aus echten Wortzeiten

## 8. Animationsvielfalt

- keine vollständige Szene oder Vollanimation innerhalb eines Reels wiederholen
- direkt aufeinanderfolgende Szenen dürfen nicht dieselbe Layoutfamilie verwenden
- nicht jede Szene als Karte in der Mitte aufbauen
- Diagramm, Prozess, Vergleich, Raum, Textmetapher, UI und Objektmechanik bewusst abwechseln
- wiederverwendet werden nur kleine Primitive, nicht die komplette Choreografie

## 9. Qualitätskontrolle

Ein neues Reel ist erst freigabefähig, wenn:

- Script zwischen 125 und 145 Wörtern liegt
- echte Dauer zwischen 60 und 70 Sekunden liegt oder eine begründete Abweichung dokumentiert ist
- alle Szenen eine klare Aussage besitzen
- alle wichtigen Bedeutungsbeats visuell abgedeckt sind
- keine generierten Szenenbilder eingebaut sind
- Cover genau ein statisches Bild mit einem klaren Satz ist
- Voiceover mit 1,00x oder bewusst freigegebenen maximal 1,05x läuft
- TypeScript und fokussierte Tests bestanden sind
- alle Checkpoint-Frames aktuell gerendert wurden
- Kontaktbogen geprüft wurde
- vollständiges MP4 in normaler Geschwindigkeit angesehen wurde
- Smartphone-Lesbarkeit geprüft wurde
- keine Szene als zu schnell, zu klein, zu leer oder unklar bewertet wurde
- technische Artefaktprüfung bestanden ist
- Nutzer die Endfassung persönlich freigegeben hat

## 10. Abbruchregeln

Der Build oder die Freigabe stoppt, wenn:

- das Voiceover kürzer als 55 Sekunden ist und der Inhalt dadurch gequetscht wird
- mehr als zwei starke Bewegungen gleichzeitig konkurrieren
- ein wichtiger Satzteil keine passende Visualisierung besitzt
- eine Szene weniger als eine Sekunde Ergebnis-Hold bietet
- Text auf Smartphone-Größe nicht lesbar ist
- die Szene nur aus dekorativer Bewegung besteht
- die finale Audiodatei nicht transkribiert wurde
- alte Render nach einer Codeänderung verwendet werden

## 11. Lernschleife

Nach jedem final geprüften Reel wird eine kurze Analyse unter `05-review/` gespeichert:

- tatsächliche Dauer und Wortzahl
- zu schnelle oder zu langsame Stellen
- unklare oder besonders verständliche Visualisierungen
- Probleme bei Untertiteln und Safe-Zones
- bewährte Animationen
- Regeln, die für zukünftige Reels angepasst werden sollten

Nur beobachtete Ergebnisse werden in den globalen Standard übernommen.