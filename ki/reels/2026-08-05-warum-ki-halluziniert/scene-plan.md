# Szenenplan

## Globale visuelle Regeln

- 1080 × 1920, 30 FPS
- Headline-Safe-Zone: ungefähr Y 150–310
- Hauptvisual: ungefähr Y 350–1420
- Untertitel-Safe-Zone: ungefähr Y 1510–1765
- keine Menschen, Hände oder Körperteile
- keine generischen Roboterköpfe oder leuchtenden Gehirne
- fast weißer Hintergrund, dunkle Typografie, violetter Akzent
- Rot nur für Risiko, Fehler und Widerspruch
- Grün nur für tatsächlich geprüfte Zustände
- jedes Bild erhält eine inhaltliche Remotion-Bewegung; kein reiner Dauerzoom
- pro Szene eine dominante Erklärung und höchstens drei starke gleichzeitige Bewegungen
- jede Szene endet mit einem lesbaren Ergebniszustand

---

## Szene 1 — Klingt sicher. Ist es wahr?

**Frames:** 0–125  
**Dauer:** 4,2 Sekunden  
**Modus:** generiertes Editorial-Bild + Remotion-Overlays

### Sprechtext

„KI kann völlig überzeugend klingen und trotzdem etwas erfinden.“

### Bild

`assets/images/scene-01-confident-answer.png`

Zentral schwebt eine elegante gläserne Antwortplatte mit einer abstrakten, glaubwürdig wirkenden Textstruktur. Das Bild enthält keine lesbaren Wörter und keine eingebauten Untertitel. Die Platte wirkt hochwertig und sicher, besitzt aber im unteren Bereich bereits eine sehr feine, kaum sichtbare Spannungslinie.

### Hauptaussage

Eine überzeugende Form ist kein Wahrheitsbeweis.

### Visuelle Choreografie

1. Bild startet stabil und hochwertig.
2. Remotion baut über der Platte einen violetten Confidence-Ring auf.
3. Beim Wort „trotzdem“ kippt der Ring minimal aus seiner sicheren Position.
4. Beim Wort „erfinden“ zieht sich eine rote SVG-Risslinie durch die Platte.
5. Hinter dem Riss erscheint kurz der Zustand `NICHT BELEGT` als Remotion-Label.
6. Schluss-Hold zeigt weiterhin die elegante Antwort, aber nun sichtbar instabil.

### Wichtige Wörter

- `überzeugend`: Confidence-Ring schließt sich
- `trotzdem`: Ring verliert Symmetrie
- `erfinden`: Riss entsteht

### Übergang

Ein kleines Glassplitter-Fragment wird als Übergangsobjekt nach rechts aus dem Bild getragen und verwandelt sich in Szene 2 in einen Wortkandidaten.

---

## Szene 2 — KI berechnet Fortsetzungen

**Frames:** 126–257  
**Dauer:** 4,4 Sekunden  
**Modus:** reine Remotion-Animation

### Sprechtext

„Das passiert, weil sie keine Wahrheit nachschlägt, sondern Wort für Wort die wahrscheinlichste Fortsetzung berechnet.“

### Hauptvisual

Eine horizontale Kandidatenbahn zeigt den vorhandenen Satzanfang links und vier mögliche nächste Wörter rechts. Prozentwerte verändern sich sichtbar, ein Kandidat gewinnt und wird an den Satz angefügt.

### Hauptaussage

Das Modell wählt wahrscheinlich passende Fortsetzungen, nicht automatisch wahre Aussagen.

### Visuelle Choreografie

1. Glassplitter aus Szene 1 rastet als erstes Wortteil auf einer Satzschiene ein.
2. Ein violetter Kontextimpuls läuft über den Satzanfang.
3. Vier Wortkandidaten erscheinen in unterschiedlichen Spuren.
4. Prozentwerte rollen kontrolliert ein und ergeben zusammen 100 Prozent.
5. Ein graues Ziel `WAHRHEIT` bleibt außerhalb der Auswahlbahn und wird beim Wort „keine“ durch ein rotes Gate blockiert.
6. Der stärkste Kandidat fährt auf die Hauptschiene und erweitert den Satz.
7. Ergebnis-Hold zeigt `WAHRSCHEINLICHSTE FORTSETZUNG`.

### Wichtige Wörter

- `keine`: rotes Block-Gate vor `WAHRHEIT`
- `Wort für Wort`: Satzschiene erweitert sich schrittweise
- `wahrscheinlichste`: Prozentwerte reagieren
- `berechnet`: Gewinner rastet ein

### Übergang

Der gewählte Wortchip bewegt sich nach unten und wird zum Eingabeteil der Maschine in Szene 3.

---

## Szene 3 — Fehlende Quellen werden gefüllt

**Frames:** 258–395  
**Dauer:** 4,6 Sekunden  
**Modus:** freigestelltes Editorial-Objekt + Remotion

### Sprechtext

„Fehlen klare Quellen, füllt sie Lücken mit Mustern aus ihren Trainingsdaten.“

### Bild

`assets/images/scene-03-pattern-gap-machine.png`

Freigestellte hochwertige 3D-Editorial-Maschine mit zentraler sichtbarer Lücke, seitlichen Musterbausteinen und sauberem violettem Material. Kein Text, keine Menschen, transparenter Hintergrund.

### Hauptaussage

Fehlende Belege können durch plausible Muster ersetzt werden.

### Visuelle Choreografie

1. Der Wortchip aus Szene 2 fällt in die linke Eingabe der Maschine.
2. Ein Quellenkanal bleibt sichtbar leer; Remotion zeigt ein rotes `QUELLE FEHLT`-Label.
3. Aus drei Seitenkanälen fließen abstrakte Musterstücke in die Lücke.
4. Die Maschine presst daraus eine vollständige, sauber wirkende Aussagekarte.
5. Ein kleines Badge wechselt von `BELEGT` zu `PLAUSIBEL`.
6. Schluss-Hold zeigt: optisch vollständig, aber ohne echte Quelle.

### Wichtige Wörter

- `Fehlen`: Quellenkanal bleibt leer
- `Quellen`: rotes Quellenlabel
- `füllt`: Musterstücke bewegen sich zur Lücke
- `Mustern`: Bausteine leuchten nacheinander
- `Trainingsdaten`: seitliche Musterbibliothek wird sichtbar

### Übergang

Die fertige Aussagekarte dreht sich in die Frontalansicht und teilt sich in vier Dokumenttypen für Szene 4.

---

## Szene 4 — Hier wird es besonders riskant

**Frames:** 396–527  
**Dauer:** 4,4 Sekunden  
**Modus:** generiertes Editorial-Bild + Remotion-Fokus

### Sprechtext

„Besonders gefährlich wird es bei Namen, Zahlen, Studien und aktuellen Ereignissen.“

### Bild

`assets/images/scene-04-risk-documents.png`

Vier klar getrennte, hochwertige 3D-Dokumentobjekte in einem offenen quadratischen Arrangement: Identitätskarte ohne echte Daten, Zahlenblatt ohne lesbare Zahlen, Forschungsdokument ohne Logo, Nachrichtenkarte ohne reale Marke. Keine eingebauten Wörter. Viel freier Raum für Remotion-Labels.

### Hauptaussage

Bestimmte Kategorien benötigen besonders konsequente Prüfung.

### Visuelle Choreografie

1. Vier Dokumente rotieren langsam aus der Aussagekarte von Szene 3 heraus.
2. Remotion versieht sie nacheinander mit den Labels `NAMEN`, `ZAHLEN`, `STUDIEN`, `AKTUELLES`.
3. Bei jeder Nennung zoomt nicht die gesamte Kamera, sondern ein Fokusrahmen springt kontrolliert zum passenden Objekt.
4. Ein Risikomesser steigt stufenweise von niedrig auf hoch.
5. `AKTUELLES` erhält zusätzlich einen Datumsstempel, der sichtbar veraltet und rot wird.
6. Schluss-Hold zeigt alle vier Kategorien mit einem gemeinsamen Warnrahmen.

### Wichtige Wörter

- `gefährlich`: Risikomesser springt an
- `Namen`: erstes Dokument markiert
- `Zahlen`: Zähler läuft kurz und friert ein
- `Studien`: Quellenstempel erscheint
- `aktuellen`: Datumsstempel wird geprüft

### Übergang

Der Warnrahmen schließt sich zu einem Chatfenster-Rahmen für Szene 5.

---

## Szene 5 — Warnzeichen 1: vage Antworten

**Frames:** 528–665  
**Dauer:** 4,6 Sekunden  
**Modus:** Remotion-UI-Nachbau

### Sprechtext

„Drei Warnzeichen helfen dir: Die Antwort bleibt vage,“

### Hauptvisual

Ein klarer, neutraler Chat-Nachbau zeigt eine optisch flüssige Antwort. Mehrere schwammige Formulierungen werden nacheinander erkannt und markiert.

### Beispieltext im UI

- „Experten gehen davon aus …“
- „Mehrere Studien zeigen …“
- „In vielen Fällen …“

Diese Texte sind UI-Inhalt, nicht Untertitel.

### Hauptaussage

Flüssige Sprache ohne überprüfbare Details ist ein Warnsignal.

### Visuelle Choreografie

1. Antwortzeilen werden schnell, aber nicht vollständig als Typewriter aufgebaut.
2. Ein Fokus-Scanner fährt über den Text.
3. Die Phrasen `Experten`, `mehrere Studien` und `viele Fälle` erhalten gelbe Unterstreichungen.
4. Rechts erscheint eine Detailanzeige mit `WER?`, `WELCHE?`, `WANN?` — alle bleiben leer.
5. Beim Wort „vage“ kollabiert ein Detailbalken auf null.
6. End-Hold zeigt Badge `WARNZEICHEN 1 · KEINE KONKRETEN DETAILS`.

### Wichtige Wörter

- `Drei Warnzeichen`: Zähler 1/3 erscheint
- `Antwort`: Chatkarte öffnet sich
- `vage`: Detailbalken fällt auf null

### Übergang

Die gelbe Unterstreichung verlängert sich zur Browser-Adresszeile in Szene 6.

---

## Szene 6 — Warnzeichen 2: tote Quellen

**Frames:** 666–797  
**Dauer:** 4,4 Sekunden  
**Modus:** Remotion-Browser-Nachbau

### Sprechtext

„Quellen lassen sich nicht öffnen,“

### Hauptvisual

Drei Quellenlinks werden kontrolliert geöffnet und technisch geprüft.

### Visuelle Choreografie

1. Unterstreichung aus Szene 5 wird zur Browserleiste.
2. Drei Quellenkarten erscheinen mit neutralen Domains wie `quelle-a.example`.
3. Ein Cursor öffnet den ersten Link: `404`.
4. Zweiter Link zeigt `DOMAIN NICHT GEFUNDEN`.
5. Dritter Link öffnet zwar, enthält aber keinen genannten Beleg; Quellenzeile bleibt leer.
6. Jeder Fehler erhält ein rotes X, aber nur einmal ohne Dauerpuls.
7. End-Hold zeigt `WARNZEICHEN 2 · QUELLE NICHT PRÜFBAR`.

### Wichtige Wörter

- `Quellen`: Quellenkarten kommen an
- `nicht`: Zugriffsgate blockiert
- `öffnen`: Browserprüfung startet

### Übergang

Die letzte Browserkarte teilt sich vertikal in zwei Chatantworten für Szene 7.

---

## Szene 7 — Warnzeichen 3: Details wechseln

**Frames:** 798–935  
**Dauer:** 4,6 Sekunden  
**Modus:** Remotion-UI-Vergleich

### Sprechtext

„oder konkrete Details wechseln nach einer Nachfrage.“

### Hauptvisual

Links steht Antwort A, rechts nach einer Nachfrage Antwort B. Datum, Name und Zahlenwert unterscheiden sich sichtbar.

### Beispielinhalte

Antwort A:

- Jahr: 2022
- Name: Projekt Nova
- Wert: 48 Prozent

Antwort B:

- Jahr: 2021
- Name: Projekt Noma
- Wert: 61 Prozent

Die Beispiele sind bewusst fiktiv.

### Visuelle Choreografie

1. Linke Antwort erscheint und friert ein.
2. Eine kurze Nachfragekarte `Bist du sicher?` fährt in die Mitte.
3. Rechte Antwort erscheint.
4. Vergleichslinien verbinden Jahr, Name und Wert.
5. Abweichungen blinken einmal rot und bleiben danach stabil markiert.
6. Ein Delta-Zähler zeigt `3 WIDERSPRÜCHE`.
7. End-Hold zeigt `WARNZEICHEN 3 · DETAILS WECHSELN`.

### Wichtige Wörter

- `konkrete Details`: drei Felder werden verbunden
- `wechseln`: Werte tauschen sichtbar den Zustand
- `Nachfrage`: mittlere Nachfragekarte erscheint

### Übergang

Die drei Vergleichslinien bündeln sich zu drei Prüfgates in Szene 8.

---

## Szene 8 — Prüfen statt vertrauen

**Frames:** 936–1079  
**Dauer:** 4,8 Sekunden  
**Modus:** generiertes Editorial-Bild + Remotion-Prozess

### Sprechtext

„Deshalb gilt: wichtige Aussagen gegenprüfen, Originalquellen öffnen und bei Unsicherheit ausdrücklich nach Belegen fragen. Klingt eine Antwort sicher, ist sie noch lange nicht wahr.“

### Bild

`assets/images/scene-08-verification-desk.png`

Hochwertige 3D-Editorial-Szene eines abstrakten Prüfdesks ohne Menschen: links eine Antwortkarte, mittig ein Quellenfenster, rechts ein verifiziertes Ergebnisfach. Keine lesbaren Wörter, keine Logos, klar getrennte Ebenen und viel freier Raum.

### Hauptaussage

Drei einfache Prüfhandlungen reduzieren das Risiko deutlich.

### Visuelle Choreografie

1. Drei Linien aus Szene 7 werden zu drei Gates:
   - `AUSSAGE GEGENPRÜFEN`
   - `ORIGINALQUELLE ÖFFNEN`
   - `BELEG VERLANGEN`
2. Eine Aussagekarte fährt nacheinander durch alle Gates.
3. Beim ersten Gate erscheint ein Vergleichshaken.
4. Beim zweiten öffnet sich das Quellenfenster des Bildes per Maske und erhält Datum plus Dokumentstatus.
5. Beim dritten Gate wird ein Beleg-Token an die Karte angeheftet.
6. Nur danach wechselt die Karte von violett zu grün und erhält `GEPRÜFT`.
7. Beim letzten Satz erscheint daneben eine zweite, elegant wirkende, aber ungeprüfte Karte. Sie bleibt violett und erhält `SICHER ≠ WAHR`.
8. Abschluss-Hold mindestens 40 Frames mit CTA: `KI-ANTWORTEN PRÜFEN`.

### Wichtige Wörter

- `gegenprüfen`: erstes Gate aktiv
- `Originalquellen`: Quellenfenster öffnet sich
- `Belegen`: Beleg-Token rastet ein
- `sicher`: ungeprüfte Karte wirkt hochwertig
- `nicht wahr`: Gleichheitszeichen wird sichtbar durchgestrichen

### Ende

Kein zusätzlicher Outro-Screen. Das geprüfte Ergebnis und `SICHER ≠ WAHR` bleiben bis zum letzten Frame vollständig lesbar.
