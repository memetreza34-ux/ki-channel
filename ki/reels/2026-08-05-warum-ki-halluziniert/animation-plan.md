# Animationsplan

## Produktionsprinzip

Jede Szene besitzt:

1. einen kurzen lesbaren Start-Hold
2. eine dominante, inhaltlich erklärende Hauptbewegung
3. höchstens drei starke Bewegungsereignisse
4. ruhige unterstützende Wortreaktionen
5. einen stabilen Ergebnis-Hold

Alle gesprochenen Wörter erscheinen in den Untertiteln. Nur wichtige Wörter erhalten eine zusätzliche visuelle Reaktion. Soundeffekte bleiben standardmäßig vollständig aus.

## Globale Ebenen

- Z 0: Hintergrund oder Bild
- Z 10: Bildbehandlung, Masken und Tiefenebenen
- Z 20: Hauptanimation
- Z 35: Connectoren, Fokusrahmen und Messwerte
- Z 50: Szenenlabels und kurze Annotationen
- Z 70: Headline
- Z 90: Untertitel
- Z 100: semantischer Übergang

## Typografie

- Headline: dunkle fette Sans-Serif, maximal zwei Zeilen
- Untertitel: rollendes Wortfenster, maximal neun sichtbare Wörter
- Standardwort: dunkel
- wichtiges Konzept: violett
- Risiko/Negation: rot
- geprüftes Ergebnis: grün
- Untertitel zeigen nur bereits gesprochene Wörter

---

## Szene 1 — `confidence-glass-fracture-v2`

### Zeitphasen, lokal

- Frames 0–10: ruhiger Start-Hold, Bild sichtbar
- 11–38: Confidence-Ring zeichnet sich um die Glasplatte
- 39–66: Ring schließt, Antwort wirkt stabil
- 67–88: Ring kippt minimal; keine Kamerabewegung
- 89–110: rote Risslinie wächst einmal durch das Glas
- 111–125: Ergebnis-Hold mit `NICHT BELEGT`

### Hauptobjekte

- Bild-Glasplatte
- SVG-Confidence-Ring
- SVG-Riss
- Remotion-Label `NICHT BELEGT`
- ein kontrollierter Glassplitter für den Übergang

### Wortreaktionen

- `überzeugend`: Ring schließt sich
- `trotzdem`: Ring verzieht sich um höchstens 5 Grad
- `erfinden`: Riss entsteht, kurzer roter Akzent

### Verboten

- kein dauerhaftes Glühen
- kein Glasscherbenregen
- kein Bildschirmzittern
- kein künstlicher Sound

### Übergang 1 → 2

Frames 116–125: ein einzelnes geometrisches Splitterstück bewegt sich nach rechts. In Szene 2 wird dieselbe Form als Wortchip weiterverwendet. Kein Fullscreen-Wipe.

---

## Szene 2 — `next-word-probability-rail-v2`

### Zeitphasen, lokal

- 0–10: Splitter/Wortchip rastet auf Satzschiene ein
- 11–34: Kontextimpuls läuft einmal durch vorhandene Wörter
- 35–64: vier Kandidatenbahnen öffnen
- 65–92: Werte rollen auf 46, 28, 17 und 9 Prozent
- 93–108: `WAHRHEIT` wird durch rotes Gate außerhalb der Bahn blockiert
- 109–122: Gewinner fährt in den Satz
- 123–131: stabiler Ergebnis-Hold

### Kandidaten

Fiktiver Satzanfang: `Die neue KI ist ...`

Kandidaten:

- `schneller` — 46 %
- `hilfreich` — 28 %
- `günstig` — 17 %
- `perfekt` — 9 %

Die Werte sind ausdrücklich als vereinfachtes Beispiel zu kennzeichnen.

### Wortreaktionen

- `keine`: rotes Gate blockiert `WAHRHEIT`
- `Wort für Wort`: Satzschiene setzt zwei Chips nacheinander ein
- `wahrscheinlichste`: Prozentbalken reagieren
- `berechnet`: Gewinner rastet ein

### Übergang 2 → 3

Gewinnerchip verlässt die Schiene nach unten und fällt in die linke Eingabe der Maschinenposition aus Szene 3.

---

## Szene 3 — `missing-source-pattern-filler-v1`

### Zeitphasen, lokal

- 0–12: Maschine und Quellenkanal vollständig sichtbar
- 13–34: Wortchip fällt in Eingabe
- 35–54: Quellenkanal öffnet sich, bleibt leer, rotes Label erscheint
- 55–88: drei Musterbausteine bewegen sich nacheinander zur zentralen Lücke
- 89–108: Pressmechanismus schließt und formt Aussagekarte
- 109–123: Badge wechselt von leer zu `PLAUSIBEL`
- 124–137: Ergebnis-Hold

### Bildbehandlung

- Bild nicht dauerhaft skalieren
- leichter Tiefenversatz der Maschine nur während Frames 55–108
- Input, zentrale Lücke und Output als separate Maskenbereiche behandeln
- Musterteile vollständig in Remotion zeichnen

### Wortreaktionen

- `Fehlen`: Quellenkanal wird sichtbar leer
- `Quellen`: rotes Quellenlabel
- `füllt`: Teile konvergieren
- `Lücken`: zentrale Lücke erhält Kontur
- `Mustern`: drei Musterarten werden sichtbar
- `Trainingsdaten`: seitliche Bibliothek öffnet sich

### Übergang 3 → 4

Die Aussagekarte dreht sich frontal, wird per Form-Match zu einem Dokument und teilt sich in vier Bildregionen. Dauer maximal 16 Frames.

---

## Szene 4 — `risk-category-document-orbit-v1`

### Zeitphasen, lokal

- 0–12: alle vier Dokumente sichtbar, ruhiger Hold
- 13–32: Fokusrahmen auf `NAMEN`
- 33–52: Fokusrahmen auf `ZAHLEN`, kleiner Zähler
- 53–74: Fokusrahmen auf `STUDIEN`, Quellenstempel
- 75–96: Fokusrahmen auf `AKTUELLES`, Datumsprüfung
- 97–114: Risikomesser steigt auf `HOCH`
- 115–131: gemeinsamer Warnrahmen und Ergebnis-Hold

### Bildbehandlung

- keine globale Zoomfahrt
- feste Kamera
- Fokus ausschließlich über Rahmen, lokale Helligkeit und leichte 8–14-Pixel-Tiefenbewegung
- Dokumente dürfen nicht aus dem Bild fliegen

### Wortreaktionen

- `gefährlich`: Risikomesser startet
- `Namen`: Identitätskarte markiert
- `Zahlen`: Wertanzeige erscheint
- `Studien`: neutraler Quellenstempel
- `aktuellen`: Datum wechselt von neutral zu veraltet

### Übergang 4 → 5

Der äußere Warnrahmen wird zum Rahmen des Chatfensters. Dokumente verschwinden per Hard Cut innerhalb des Rahmens; kein Fade.

---

## Szene 5 — `vague-answer-focus-collapse-v1`

### Zeitphasen, lokal

- 0–12: Chatfenster steht vollständig
- 13–40: Antwortzeilen erscheinen in drei schnellen Textblöcken
- 41–72: Scanner markiert drei vage Phrasen
- 73–96: Detailfragen `WER?`, `WELCHE?`, `WANN?` erscheinen rechts
- 97–116: alle Detailbalken bleiben leer; Messwert fällt auf null
- 117–137: Badge und Ergebnis-Hold

### UI-Regeln

- keine reale ChatGPT- oder Claude-Oberfläche kopieren
- neutrales Editorial-Chatfenster
- Beispieltexte gut lesbar, aber nicht wie Untertitel gestalten
- Cursor nicht verwenden; Scanner ist das Hauptwerkzeug

### Wortreaktionen

- `Drei`: Zähler `1/3`
- `Warnzeichen`: Badge öffnet
- `Antwort`: Chatkarte wird aktiv
- `vage`: Detailbalken fällt sichtbar auf null

### Übergang 5 → 6

Die letzte gelbe Unterstreichung wächst horizontal und wird zur Browser-Adresszeile. Der Rest wechselt per Hard Cut.

---

## Szene 6 — `dead-source-link-check-v1`

### Zeitphasen, lokal

- 0–10: Browserrahmen aus Übergang vollständig
- 11–30: drei Quellenkarten erscheinen
- 31–54: erster Link wird geöffnet und zeigt `404`
- 55–78: zweiter Link zeigt `DOMAIN NICHT GEFUNDEN`
- 79–102: dritter Link öffnet, Belegbereich bleibt leer
- 103–116: rote X-Markierungen erscheinen einmal
- 117–131: Ergebnis-Hold

### UI-Regeln

- neutrale Domains mit `.example`
- keine realen Publikationen oder Marken
- Fehlerzustände klar, aber nicht hektisch
- maximal ein Cursor

### Wortreaktionen

- `Quellen`: Karten erscheinen
- `nicht`: rotes Gate vor dem Browserinhalt
- `öffnen`: Linktests starten

### Übergang 6 → 7

Dritte Quellenkarte teilt sich vertikal in linke und rechte Antwortspalte. Dauer maximal 14 Frames.

---

## Szene 7 — `followup-detail-contradiction-v1`

### Zeitphasen, lokal

- 0–16: Antwort A sichtbar
- 17–40: Nachfragekarte `Bist du sicher?` erscheint
- 41–66: Antwort B sichtbar
- 67–94: drei Vergleichslinien verbinden Jahr, Name und Wert
- 95–112: drei Abweichungen blinken einmal rot
- 113–123: Delta-Zähler `3 WIDERSPRÜCHE`
- 124–137: Ergebnis-Hold

### Vergleichsregeln

- beide Antworten gleichzeitig lesbar
- gleiche Feldreihenfolge
- keine Bewegung nach dem finalen Markieren
- fiktive Daten mit kleinem Label `BEISPIEL`

### Wortreaktionen

- `konkrete Details`: Felder verbinden sich
- `wechseln`: Werte tauschen Farbe und Position minimal
- `Nachfrage`: mittlere Karte erscheint

### Übergang 7 → 8

Die drei Vergleichslinien bündeln sich in drei horizontale Pfade und werden zu den drei Prüfgates. Hintergrund per Hard Cut.

---

## Szene 8 — `verification-triple-gate-v1`

### Zeitphasen, lokal

- 0–12: Bilddesk und drei Pfade stehen
- 13–40: Gate 1 `GEGENPRÜFEN`; Vergleichshaken erscheint
- 41–70: Gate 2 `ORIGINALQUELLE`; Quellenfenster öffnet per Maske
- 71–98: Gate 3 `BELEG VERLANGEN`; Beleg-Token rastet ein
- 99–112: geprüfte Karte wird grün
- 113–128: ungeprüfte elegante Karte erscheint daneben; `SICHER ≠ WAHR`
- 129–143: finaler Hold; CTA bleibt stabil

### Bildbehandlung

- drei Stationen als feste Bildanker
- Antwortkarten, Gates, Beleg-Token, Haken, Datum und Labels in Remotion
- Quellenfenster des Bildes per Rechteckmaske öffnen
- keine globale Zoomfahrt
- maximal 2 % Kamerapush nur während Gate 2

### Wortreaktionen

- `gegenprüfen`: Gate 1 aktiv
- `Originalquellen`: Gate 2 und Dokumentmaske
- `Belegen`: Gate 3 und Beleg-Token
- `sicher`: zweite Karte erscheint
- `nicht wahr`: `=` wird rot durchgestrichen und zu `≠`

### Finaler Zustand

- `KI-ANTWORTEN PRÜFEN`
- `SICHER ≠ WAHR`
- geprüfte Karte grün
- ungeprüfte Karte violett
- mindestens 15 Frames vollständig unbewegt; Ziel nach visueller Prüfung auf 40 Frames erweitern, falls Voiceover-Timing dies erlaubt

---

## Audio

Standard:

```text
soundMode = off
```

Nur Voiceover. Keine Musik, keine Beeps, keine Noise-Sweeps, keine Sounds pro Wort. Codex erstellt keine SFX-Variante, solange dies nicht in einem späteren Auftrag ausdrücklich verlangt wird.
