# Visual Strategy — beste Bildsprache vor Technik

Diese Datei entscheidet **welche visuelle Form einen Sprecher-Beat am besten erklärt**.

Sie steht bewusst vor Library-Auswahl, Remotion-Implementierung und Bildprompting.

## Grundregel

> Nicht „Was kann Remotion bauen?“ fragen, sondern zuerst: **„Was muss der Zuschauer sehen, damit die Aussage sofort verständlich wird?“**

Danach wird die passende Produktionsform gewählt.

## 1. Visual-Modality-Router

Für jeden bedeutungstragenden Visual Beat genau eine primäre Strategie wählen:

### `REMOTION_NATIVE`

Verwenden, wenn Präzision, Zustandslogik oder kontrollierbare Animation wichtiger ist als organische Realität.

Typische Fälle:

- echte/vereinfachte UI
- Diagramme und verifizierte Zahlen
- Prozessketten
- Tokens, Nodes, Pfade, Auswahl, Sortierung
- Vergleichszustände
- Code/Terminal
- Datenfluss
- abstrakte technische Mechanismen

### `REAL_CAPTURE`

Verwenden, wenn das **tatsächliche Produktverhalten selbst der Beweis** ist.

Typische Fälle:

- echte Tool-Oberfläche
- echter Workflow
- echte Suche / reales Ergebnis
- Before/After aus derselben Anwendung
- Feature, dessen Aussehen oder Verhalten aktuell produktabhängig ist

Regeln:

- keine erfundene UI als Ersatz für einen realen Produktbeweis
- Produktstand/Datum dokumentieren
- sensible Daten entfernen
- Capture nur zuschneiden/markieren; Aussage nicht durch irreführende Montage verändern

### `HYBRID`

Verwenden, wenn eine räumliche/physische Szene den Gedanken trägt, aber präzise Information darüber gelegt werden muss.

Beispiel:

- 3D-Metapher oder reale Szene als Hero-Motiv
- Remotion ergänzt Labels, Pfeile, Zustände, Zahlen, Fokus und Caption

### `EXTERNAL_STILL_REQUIRED`

Verwenden, wenn ein statisches räumliches/organisches Motiv deutlich stärker wäre als ein Code-Nachbau.

Beispiele:

- komplexe physische Metapher
- Alltagssituation
- Produkt-/Umgebungsszene
- Material/Licht/Perspektive als Bedeutungsträger

Dann gilt `ki/BILDSTIL.md`.

### `EXTERNAL_MOTION_REQUIRED`

Nur verwenden, wenn **die physische Bewegung selbst** die Erklärung trägt und ein Remotion-Nachbau unverhältnismäßig oder sichtbar schlechter wäre.

Beispiele:

- organische Materialbewegung
- komplexe räumliche Kamerafahrt
- physischer Prozess, dessen Glaubwürdigkeit von echter/hochwertig generierter Bewegung abhängt

Externes Motion-Asset ist kein Ersatz für schwache Art Direction. Text/UI/Quellen bleiben kontrolliert in Remotion.

## 2. Entscheidungsfragen pro Beat

In dieser Reihenfolge beantworten:

1. Ist das reale Produkt/Ergebnis selbst der Beweis? → `REAL_CAPTURE`
2. Braucht die Aussage exakte Daten/UI/Prozesslogik? → `REMOTION_NATIVE`
3. Braucht sie räumliche/physische Anschaulichkeit plus präzise Overlays? → `HYBRID`
4. Reicht eine hochwertige räumliche Momentaufnahme? → `EXTERNAL_STILL_REQUIRED`
5. Ist komplexe physische Bewegung selbst unverzichtbar? → `EXTERNAL_MOTION_REQUIRED`
6. Wenn nichts davon klar begründet ist: Beat vereinfachen statt dekoratives Asset hinzufügen.

## 3. Remotion ist nicht automatisch die Premium-Lösung

Remotion ist bevorzugt für kontrollierbare Erklärgrafik, aber nicht aus Prinzip für jedes Hero-Motiv.

Wenn ein Beat durch folgende Dinge lebt, darf externe/Hybrid-Bildsprache die bessere Wahl sein:

- Materialität
- Raumtiefe
- physischer Maßstab
- glaubwürdige Umgebung
- starke Alltagsmetapher
- organische Bewegung

Umgekehrt darf keine Bild-KI eingesetzt werden, nur weil eine React/SVG-Szene Arbeit macht.

**Beste Erklärung gewinnt.**

## 4. Karten-/Boxen-Regel

Karte, Pill, Panel oder Rounded Rectangle ist nur dann eine gute Hauptform, wenn sie **semantisch wirklich ein Objekt** darstellt:

- UI-Element
- Dokument
- Datensatz
- Nachricht
- Datei
- Token/Chip

Nicht erlaubt als Standardübersetzung für abstrakte Aussagen.

Schwaches Muster:

```text
Aussage → weiße Karte → Text → nächste Karte
```

Stärker:

```text
Aussage → sichtbare Beziehung / Handlung / Zustandswechsel → Ergebnis
```

## 5. Diversity Contract

Ein Reel soll visuell zusammengehören, aber nicht in einer einzigen Grammatik feststecken.

Richtwerte:

- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- karten-/panelbasierte Beats normalerweise höchstens etwa ein Drittel
- mindestens ein klarer Hero-/Memorable-Moment
- mehrere sinnvolle Mechanikfamilien, wenn der Inhalt sie trägt
- keine erzwungene Vielfalt: ein durchgehender Prozess darf bewusst visuell konsistent bleiben

Mögliche Mechanikfamilien:

- Objekt/physische Metapher
- Prozess/Pfad
- Transformation/Morph
- Vergleich/Split
- echte UI/Capture
- Dokument/Quelle
- räumliche 3D-Szene
- Diagramm/Daten
- Typografie-Akzent

## 6. Jede Szene braucht eine Verb-Idee

Vor der Umsetzung muss die Szene mit einem **Verb** beschreibbar sein.

Gut:

- zerfällt
- verbindet
- wählt
- blockiert
- sortiert
- prüft
- vergleicht
- öffnet
- sucht
- verwirft
- verwandelt
- reist

Schwach:

- zeigt
- erscheint
- steht da
- blendet Text ein

Wenn die Hauptaktion nur „erscheint“ ist, Mechanik neu denken.

## 7. Visual Beat Sheet

`06-projektdateien/visual-strategy.md` dokumentiert pro Beat:

```text
Beat-ID
Sprecherstelle
Bedeutung
Zuschauer muss sehen
Hauptverb
Startzustand
sichtbare Veränderung
Endzustand
Modality: REMOTION_NATIVE | REAL_CAPTURE | HYBRID | EXTERNAL_STILL_REQUIRED | EXTERNAL_MOTION_REQUIRED
Warum diese Modality
Mechanikfamilie
Hero beat: JA/NEIN
benötigter Zuschauertext
Asset/Quelle, falls extern
```

Erst danach folgt `animation-plan.md`.

## 8. Real Capture und aktuelle Tool-Themen

Bei Tool-Reels soll echte Oberfläche bevorzugt werden, wenn die Oberfläche oder das Ergebnis Teil der Aussage ist.

Nicht jede Erklärung braucht Screenrecording. Aber ein aktuelles Feature nur mit erfundener UI zu erklären, obwohl der reale Zustand relevant ist, schwächt Vertrauen.

Capture-Regel:

- aktuelles Datum/Version dokumentieren
- nur relevante Fläche zeigen
- Cursor/Zoom/Fokus sinnvoll einsetzen
- keine privaten Informationen
- keine sichtbaren Preise/Funktionsnamen ungeprüft übernehmen

## 9. Externe Assets

Das Repo selbst erfindet keine bereitgestellten Medien.

Phase 1 darf:

- Bedarf definieren
- Prompt/Shot-Brief schreiben
- erwarteten Dateinamen festlegen
- Asset im Manifest als `MISSING_REQUIRED` markieren

Phase 3 darf nur tatsächlich vorhandene Dateien verwenden.

Fehlt ein Pflichtasset, wird nicht stillschweigend durch generische Remotion-Karten ersetzt.

## 10. Anti-Dekoration

Nicht als Problemlösung akzeptieren:

- mehr Glow
- mehr Partikel
- zufällige Kamerafahrt
- unnötige 3D-Tiefe
- permanent bewegte Hintergründe
- Übergang zwischen jedem Beat
- Text groß machen, wenn eigentlich eine Erklärung fehlt

Motion dient Fokus, Ursache/Wirkung oder Zustandsänderung.

## 11. Freigabe

Vor Implementierung muss `visual-strategy.md` zeigen:

- warum jede Hauptbildsprache gewählt wurde
- dass nicht automatisch Remotion oder automatisch Bild-KI bevorzugt wurde
- wo der Hero-Moment liegt
- welche Beats ähnliche Grammatik verwenden
- wie Wiederholung vermieden oder bewusst begründet wird

Wenn die Strategie überwiegend aus „Card + Label“ besteht, obwohl das Thema sichtbar handelnde Mechanismen erlaubt: **zurück in die Planung**.
