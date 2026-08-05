# Prototype Review

Kein Prototyp wird wegen eines erfolgreichen Typechecks als visuell gelungen betrachtet.

## Prüfreihenfolge

### 1. Technische Grundlage

```bash
node scripts/verify-animation-library.mjs
```

Erforderlich:

- JavaScript-Syntax gültig
- TypeScript gültig
- Vitest-Tests erfolgreich
- Renderplan gültig

### 2. Smoke-Frames

```bash
node scripts/render-animation-library.mjs smoke
```

Pro Prototyp werden Frame 0, 90 und 179 geprüft. Bei 18 Prototypen entstehen 54 Smoke-PNGs.

### 3. Vollständige Prüfframes

```bash
node scripts/render-animation-library.mjs stills
```

Pro Prototyp:

```text
0, 30, 60, 90, 120, 150, 179
```

### 4. Bewegungsprüfung

```bash
node scripts/render-animation-library.mjs videos
```

Jedes MP4 wird in normaler Geschwindigkeit und auf Smartphone-Größe angesehen.

### 5. Technischer Bericht

```bash
node scripts/check-animation-library-renders.mjs
```

Erwartung:

```text
126 PNG-Dateien
18 MP4-Dateien
144/144 technisch gültige Artefakte
```

## Allgemeine Abnahme

- [ ] Inhalt ist ohne Ton grundsätzlich verständlich.
- [ ] Die Hauptbewegung erklärt den Satz und ist nicht bloß Dekoration.
- [ ] Anfangsframe wirkt absichtlich gestaltet.
- [ ] Spätestens innerhalb der ersten 20 Frames beginnt eine verständliche Aktion.
- [ ] Der Mittelpunkt besitzt einen klaren visuellen Wendepunkt.
- [ ] Der Endframe zeigt ein stabiles Ergebnis.
- [ ] Keine ungewollte leere Fläche.
- [ ] Keine abgeschnittenen Elemente.
- [ ] Kein Text unterhalb mobiler Mindestgröße.
- [ ] Keine dauerhafte Pulsation ohne Bedeutung.
- [ ] Keine Bewegung bleibt grundlos stehen.
- [ ] Kein Prototyp wirkt wie eine andere Composition mit ausgetauschtem Text.
- [ ] Übergang hinein und hinaus ist konzeptionell möglich.

## Knowledge Magnet

- [ ] Query-Magnet ist sofort als Suchanfrage erkennbar.
- [ ] Relevante Dokumente bewegen sich sichtbar anders als irrelevante.
- [ ] Irrelevante Dokumente verschwinden nicht zu früh.
- [ ] Feldlinien überladen das Bild nicht.
- [ ] Ergebnis `3 Belege` ist mindestens 20 Frames stabil.

## Budget Leak Meter

- [ ] Kostenanzeige ist nicht widersprüchlich zur Füllhöhe.
- [ ] Alle drei Lecks sind einzeln erkennbar.
- [ ] Abdichtung wirkt kausal und nicht wie ein bloßer Farbwechsel.
- [ ] Einsparung erscheint erst nach den Optimierungen.
- [ ] Ströme verursachen keine visuellen Artefakte.

## Context Window Train

- [ ] Begrenztes Fenster mit vier Plätzen ist sofort verständlich.
- [ ] Neue Nachricht schiebt alte Information sichtbar heraus.
- [ ] Angeheftete Regel bleibt nachvollziehbar erhalten.
- [ ] Keine Karte verlässt den sichtbaren Bereich unkontrolliert.
- [ ] Bewegung wirkt wie ein Fenster und nicht nur wie eine normale Liste.

## Decision Tree Burst

- [ ] Frage und Bedingungen sind logisch verbunden.
- [ ] Ungültige Äste werden klar verworfen.
- [ ] Der gewählte Weg bleibt visuell dominant.
- [ ] Das Baumdiagramm bleibt trotz hoher Dichte lesbar.
- [ ] Kein Ast schneidet einen Textknoten ungewollt.

## Human AI Relay

- [ ] Rollenwechsel zwischen Mensch und KI ist ohne Erklärung erkennbar.
- [ ] Task-Marker erreicht jede Station zur richtigen Zeit.
- [ ] Karten wirken nicht wie vier identische Standardkarten.
- [ ] Übergaben sind die Hauptidee, nicht die statische Track-Anzeige.
- [ ] Schlussaussage bleibt mindestens 25 Frames sichtbar.

## Knowledge Tree Graft

- [ ] Altes Wissen, unsicheres Wissen und neue Information unterscheiden sich.
- [ ] Verifikation ist vor der Einfügung sichtbar.
- [ ] Der neue Ast wird tatsächlich an den Baum angeschlossen.
- [ ] Die alte Aussage wird markiert und nicht einfach gelöscht.
- [ ] Revisionserhöhung erscheint erst nach erfolgreicher Aktualisierung.

## Magnetic Phrase Slicer

- [ ] Der Satz ist vor dem Schnitt als zusammenhängende Aussage lesbar.
- [ ] Die Schnittlinien treffen verständliche Wortgrenzen.
- [ ] Einzelne Tokens bleiben während der räumlichen Trennung lesbar.
- [ ] Die drei Ziellanes unterscheiden sich visuell.
- [ ] Das magnetische Einrasten wirkt kontrolliert und nicht zufällig.

## Vector Prism Converter

- [ ] Der Begriff erreicht das Prisma sichtbar als ein Input.
- [ ] Die drei Ausgabedimensionen entstehen aus dem Prisma und nicht unabhängig davon.
- [ ] Farbcodierung bleibt vom Strahl bis zum Zahlenwert konsistent.
- [ ] Beispielzahlen werden als Illustration und nicht als echte Modellrechnung verstanden.
- [ ] Das finale Vektorformat bleibt mindestens 25 Frames stabil.

## Dynamic Podium Rise

- [ ] Kriterien werden nacheinander aktiviert und beeinflussen sichtbar die Werte.
- [ ] Podiumhöhen stimmen ungefähr mit den gezeigten Scores überein.
- [ ] Positionswechsel sind im Bewegungsablauf nachvollziehbar.
- [ ] Gewinner wird erst nach dem letzten Kriterium festgelegt.
- [ ] Die Animation wirkt nicht wie ein gewöhnliches statisches Balkendiagramm.

## Subway Workflow Map

- [ ] Die Strecke ist als zusammenhängender Workflow erkennbar.
- [ ] Das Paket folgt der Linie ohne sichtbare Sprünge.
- [ ] Jede Station wird erst nach tatsächlicher Ankunft als aktiv markiert.
- [ ] Die Alternativroute ist als Fehlerpfad und nicht als zweites Ziel verständlich.
- [ ] Das Ergebnis erscheint erst nach der letzten Station.

## Funnel Compression Output

- [ ] Mindestens sechs unterschiedliche Quellen sind am Anfang lesbar.
- [ ] Quellen bewegen sich kausal in den Trichter.
- [ ] Filterebenen sind sichtbar, aber überladen die Szene nicht.
- [ ] Viele Elemente werden tatsächlich zu einem Ergebnis verdichtet.
- [ ] Das Resultat wirkt wie eine Zusammenfassung und nicht wie ein beliebiger Textblock.

## Anomaly X-Ray Scanner

- [ ] Der Prozess sieht vor dem Scan zunächst plausibel und stabil aus.
- [ ] Die Scannerfläche bewegt sich kontinuierlich durch alle Schritte.
- [ ] Die Fehlerquelle wird erst beim Erreichen des betroffenen Schritts sichtbar.
- [ ] Downstream-Auswirkung ist vom Ursprungsfehler unterscheidbar.
- [ ] Die Reparatur ändert Ursache, Route und Status sichtbar.

## Meaning Terrain

- [ ] Zwei klar getrennte Bedeutungsregionen sind erkennbar.
- [ ] Verwandte Begriffe stehen innerhalb derselben Region näher zusammen.
- [ ] Höhen und Konturlinien stören die Lesbarkeit nicht.
- [ ] Die Landschaft baut sich sichtbar auf und ist nicht nur ein statischer Hintergrund.
- [ ] Der Schluss erklärt, dass Abstand Bedeutung und nicht Ort darstellt.

## Dependency Bridge Builder

- [ ] Wortinseln sind vor den Brücken einzeln verständlich.
- [ ] Starke Beziehungen bauen breitere und stabilere Brücken.
- [ ] Die schwache Direktverbindung verschwindet erst nach dem Lasttest.
- [ ] Pulssignale bewegen sich entlang der tatsächlichen Brücken.
- [ ] Die Animation erklärt Beziehungen und wirkt nicht wie ein dekoratives Netzwerk.

## Probability Fluid Columns

- [ ] Kandidaten und Prozentwerte sind jederzeit zuordenbar.
- [ ] Kontextsignale verändern sichtbar die Füllstände.
- [ ] Füllhöhe und Prozentzahl widersprechen sich nicht.
- [ ] Flüssigkeitsbewegung bleibt kontrolliert und verursacht kein Flackern.
- [ ] Gewinner wird erst nach der letzten Wahrscheinlichkeitsverschiebung markiert.

## Residual River

- [ ] Hauptstrom und Seitenkanäle unterscheiden sich sofort.
- [ ] Jeder Verarbeitungsschritt verändert den sichtbaren Strom.
- [ ] Seiteninformation wird erkennbar zurück in den Hauptstrom geführt.
- [ ] Datenpunkte folgen dem Fluss ohne Sprünge.
- [ ] Das Endergebnis zeigt Hauptsignal plus Ergänzungen.

## Answer Loom

- [ ] Kontextfäden erreichen den Webstuhl sichtbar.
- [ ] Jede Shuttle-Bewegung erzeugt genau einen weiteren Wortbaustein.
- [ ] Wörter bleiben während des Webens lesbar.
- [ ] Das Ergebnis entsteht kausal aus den Fäden und nicht unabhängig davon.
- [ ] Der vollständige Satz bleibt mindestens 25 Frames stabil.

## Confidence Glass Crack

- [ ] Die Aussage wirkt vor der Prüfung bewusst überzeugend.
- [ ] Quellen-, Datums- und Belegfragen erzeugen sichtbaren Druck.
- [ ] Risse beginnen an einer nachvollziehbaren Stelle und breiten sich kontrolliert aus.
- [ ] Confidence-Anzeige wird nicht als Wahrheitswert dargestellt.
- [ ] Der Schluss trennt sprachliche Sicherheit klar von Wahrheit.

## Ergebnisdokumentation

Für jeden Prototyp werden gespeichert:

- akzeptierte Frames
- fehlerhafte Frames
- konkrete visuelle Probleme
- vorgenommene Korrekturen
- Ergebnis des MP4-Tests
- Verständlichkeitswert 0–100
- Neuheitswert 0–100
- Produktionssicherheitswert 0–100
- Status `prototype`, `verified` oder `retired`

`renderReview.ts` prüft technische Artefakte, Quellfingerprint und manuelle Mindestwerte. Nur eine blockerfreie Animation darf als `verified` empfohlen werden.

Die Review-Werte werden als `render-review`-Beobachtung an das Creative Brain übergeben. Mehrere Ergebnisse können über `learningPipeline.ts` chronologisch und ohne doppelte Anwendung eingespielt werden. Wiederholte Evidenz kann danach kontrolliert über `brainTuning.ts` die Auswahlgewichte und den Schwellenwert für neue Animationen anpassen.
