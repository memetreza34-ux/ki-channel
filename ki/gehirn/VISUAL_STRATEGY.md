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

Das umfasst ausdrücklich **mehr als Karten und Diagramme**. Remotion darf selbst bildartige Szenen bauen:

- SVG-/CSS-Illustrationen
- Objekte, Geräte und kleine Umgebungen
- pseudo-fotografische Flat-/2.5D-Szenen
- eigene Vector-Icons
- Masken, Clipping, Perspektive und Layer
- Objektzerlegung, Morphs, Fokusfahrten und Parallax
- Prozessketten, Tokens, Nodes, Pfade und Vergleiche
- UI, Code, Diagramme und Datenfluss

Wenn ein konkretes Objekt oder eine Alltagssituation die Erklärung trägt, soll zuerst geprüft werden, ob eine kontrollierbare Remotion-Illustration stärker ist als eine abstrakte Karte.

### `REAL_CAPTURE`

Verwenden, wenn das **tatsächliche Produktverhalten selbst der Beweis** ist.

### `HYBRID`

Verwenden, wenn eine räumliche/physische Szene den Gedanken trägt, aber präzise Information darüber gelegt werden muss.

### `EXTERNAL_STILL_REQUIRED`

Verwenden, wenn ein statisches räumliches/organisches Motiv deutlich stärker wäre als ein Code-Nachbau.

### `EXTERNAL_MOTION_REQUIRED`

Nur verwenden, wenn **die physische Bewegung selbst** die Erklärung trägt und ein Remotion-Nachbau unverhältnismäßig oder sichtbar schlechter wäre.

## 2. Entscheidungsfragen pro Beat

1. Ist das reale Produkt/Ergebnis selbst der Beweis? → `REAL_CAPTURE`
2. Braucht die Aussage exakte Daten/UI/Prozesslogik oder eine kontrollierbare Illustration? → `REMOTION_NATIVE`
3. Braucht sie räumliche/physische Anschaulichkeit plus präzise Overlays? → `HYBRID`
4. Reicht eine hochwertige räumliche Momentaufnahme? → `EXTERNAL_STILL_REQUIRED`
5. Ist komplexe physische Bewegung selbst unverzichtbar? → `EXTERNAL_MOTION_REQUIRED`
6. Wenn nichts davon klar begründet ist: Beat vereinfachen statt dekoratives Asset hinzufügen.

## 3. Remotion ist nicht automatisch die Premium-Lösung

Remotion ist bevorzugt für kontrollierbare Erklärgrafik **und kontrollierbare Illustration**, aber nicht aus Prinzip für jedes Hero-Motiv.

**Beste Erklärung gewinnt.**

## 4. Karten-/Boxen-Regel

Karte, Pill, Panel oder Rounded Rectangle ist nur dann eine gute Hauptform, wenn sie semantisch wirklich ein Objekt darstellt: UI-Element, Dokument, Datensatz, Nachricht, Datei oder Token/Chip.

Nicht erlaubt als Standardübersetzung für abstrakte Aussagen.

Schwach:

```text
Aussage → weiße Karte → Text → nächste Karte
```

Stärker:

```text
Aussage → Objekt/Illustration/Beziehung → sichtbare Handlung → veränderter Endzustand
```

## 5. Diversity Contract V2.1

Ein Reel soll visuell zusammengehören, aber nicht in einer einzigen Grammatik feststecken.

Richtwerte:

- nicht mehr als zwei aufeinanderfolgende Beats mit derselben Hauptgrammatik
- karten-/panelbasierte Beats normalerweise höchstens etwa **ein Viertel**
- mindestens die Hälfte der Beats objekt-, pfad-, form-, raum-, illustration- oder prozessbasiert
- mindestens ein klarer Hero-/Memorable-Moment
- wenn das Thema reale Dinge enthält, mindestens eine große visuelle Szene statt nur Symbole/Karten prüfen

Mögliche Mechanikfamilien:

- Objekt/physische Metapher
- Remotion-Illustration/Umgebung
- Prozess/Pfad
- Transformation/Morph
- Vergleich/Split
- echte UI/Capture
- Dokument/Quelle
- räumliche 3D-/2.5D-Szene
- Diagramm/Daten
- Typografie-Akzent

## 6. Jede Szene braucht eine Verb-Idee

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
- fokussiert
- setzt sich zusammen
- klappt auf
- wird herangezoomt

Schwach:

- zeigt
- erscheint
- steht da
- blendet Text ein

## 7. Motion-Dichte

Eine Szene darf nicht erst in den ersten 0,5 Sekunden animieren und danach mehrere Sekunden statisch bleiben.

Planungsrichtwert:

- alle 1,5–3 Sekunden eine sinnvolle Zustandsänderung
- 2–4 Micro-Beats pro längerer Szene
- statischer Hold über 2,5 Sekunden nur mit Begründung
- zentrale Motion-Cues später an echte Voiceover-Wörter koppeln

## 8. Icons und bildartige Remotion-Szenen

- finale Haupticons bevorzugt als eigene SVG-/Vector-Pfade
- keine Emoji als Ersatz für saubere Icons
- Illustration darf Schatten, Layer, Perspektive und kontrollierte Tiefe nutzen
- eine Remotion-Illustration darf wie ein vereinfachtes Bild wirken, solange sie keine reale Aufnahme vortäuscht
- Animationstext nicht zur Hauptbildsprache machen

## 9. Visual Beat Sheet

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
Modality
Warum diese Modality
Mechanikfamilie
Hero beat: JA/NEIN
benötigter Zuschauertext
Asset/Quelle, falls extern
```

Erst danach folgt `animation-plan.md`.

## 10. Real Capture und aktuelle Tool-Themen

Bei Tool-Reels echte Oberfläche bevorzugen, wenn Oberfläche oder Ergebnis Teil der Aussage ist.

## 11. Externe Assets

Phase 1 darf Bedarf definieren, Prompt/Shot-Brief schreiben, erwarteten Dateinamen festlegen und Asset im Manifest als `MISSING_REQUIRED` markieren.

Fehlt ein Pflichtasset, wird nicht stillschweigend durch generische Remotion-Karten ersetzt.

## 12. Anti-Dekoration

Nicht als Problemlösung akzeptieren:

- mehr Glow
- mehr Partikel
- zufällige Kamerafahrt
- unnötige 3D-Tiefe
- permanent bewegte Hintergründe
- Übergang zwischen jedem Beat
- Text groß machen, wenn eigentlich eine Erklärung fehlt

Motion dient Fokus, Ursache/Wirkung oder Zustandsänderung.

## 13. Freigabe

Vor Implementierung muss `visual-strategy.md` zeigen:

- warum jede Hauptbildsprache gewählt wurde
- wo der Hero-Moment liegt
- welche Beats ähnliche Grammatik verwenden
- wie Wiederholung vermieden oder bewusst begründet wird
- welche konkreten Remotion-Illustrationen/Objekte gebaut werden
- wie die Szene über ihre gesamte Dauer visuell weiterentwickelt wird

Wenn die Strategie überwiegend aus „Card + Label“ besteht, obwohl das Thema sichtbar handelnde Mechanismen erlaubt: **zurück in die Planung**.
