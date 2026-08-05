# Interner Animationsvertrag

Diese Datei ist für Codex. Die verständliche Szenenplanung steht in `../03_SZENEN.md`.

## Globale Ebenen

```text
Z 0   Hintergrund/Bild
Z 10  Masken und Bildbehandlung
Z 20  Hauptanimation
Z 35  Connectoren, Fokusrahmen, Zahlen
Z 50  kurze Labels
Z 70  Headline
Z 90  Untertitel
Z 100 Übergang
```

## Rhythmus

```text
Start-Hold → Ursache → Hauptbewegung → Wirkung → Ergebnis-Hold
```

- keine Szene startet leer
- maximal drei starke Bewegungen gleichzeitig
- Hard Cut als Standard
- semantischer Übergang nur bei gemeinsamem Objekt, Rahmen, Linie oder Zustand
- keine Fade-to-black-Übergänge
- keine Dauerpulse, Endlosrotationen oder dekorativen Partikel
- Bilder niemals nur dauerhaft zoomen
- finaler Zustand jeder Szene muss lesbar bleiben

## Untertitel

- jedes gesprochene Wort rendern
- nur bereits gesprochene Wörter zeigen
- maximal neun Wörter gleichzeitig
- Standardwort dunkel
- Konzept violett
- Risiko/Negation rot
- geprüftes Ergebnis grün
- UI-Text und Untertitel optisch trennen
- echte Wortzeiten nach Einfügen des Voiceovers ermitteln

## Audio

```text
soundMode = off
music = false
```

Nur `05_AUDIO/voiceover.wav`. Keine Beeps, Sweeps, Noise-Effekte oder Sounds pro Wort.

## Szenenverträge

### Szene 1

- Hauptanimation: `confidence-glass-fracture-v2`
- Ring aufbauen, einmal verziehen, einmal Riss zeichnen
- genau ein Glassplitter als Übergangsobjekt

### Szene 2

- Hauptanimation: `next-word-probability-rail-v2`
- Kandidatenwerte 46/28/17/9, Summe 100
- `WAHRHEIT` außerhalb der Bahn
- Gewinnerchip wird Übergang zu Szene 3

### Szene 3

- Hauptanimation: `missing-source-pattern-filler-v1`
- Quellenkanal bleibt leer
- drei Musterteile füllen die Lücke
- Ergebnis ausschließlich `PLAUSIBEL`

### Szene 4

- Hauptanimation: `risk-category-document-orbit-v1`
- feste Kamera
- lokale Fokusrahmen für Namen, Zahlen, Studien, Aktuelles
- Risikomesser und Datumsprüfung in Remotion

### Szene 5

- Hauptanimation: `vague-answer-focus-collapse-v1`
- neutraler Chat-Nachbau
- vage Phrasen markieren
- `WER?`, `WELCHE?`, `WANN?` bleiben leer

### Szene 6

- Hauptanimation: `dead-source-link-check-v1`
- neutrale `.example`-Domains
- drei unterschiedliche Fehlerzustände
- rote X nur einmal einblenden

### Szene 7

- Hauptanimation: `followup-detail-contradiction-v1`
- Antwort A und B gleichzeitig sichtbar
- drei stabile Abweichungen
- Ergebnis `3 WIDERSPRÜCHE`

### Szene 8

- Hauptanimation: `verification-triple-gate-v1`
- drei Gates in fester Reihenfolge
- nur vollständig geprüfte Karte wird grün
- `KI-ANTWORTEN PRÜFEN` und `SICHER ≠ WAHR` bis Frame 1079
