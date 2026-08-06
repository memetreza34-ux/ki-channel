# Untertitelvertrag

## Darstellung

- kompletter aktueller Satz oder Sinnabschnitt erscheint sofort
- Text bleibt während der gesamten Cue-Dauer stabil
- keine Wort-für-Wort-Einblendung
- keine Karaoke-Markierung
- keine einzelne Wortmarkierung
- keine wechselnde Wortgröße
- kein Bounce oder Springen
- maximal zwei Zeilen
- 46 bis 52 px, niemals unter 42 px
- weiß mit dunkler Kontur oder starkem Schatten
- kein großer Hintergrundkasten

## Position

- Untertitel-Unterkante standardmäßig 220 px
- erlaubt: 210 bis 235 px
- Plattform-Safe-Zone beachten
- Hauptvisual und Untertitel dürfen sich nicht überlappen

## Synchronisation

Unter dem vollständigen Satz befindet sich genau eine violette Linie:

```text
Satz erscheint sofort
→ Linie startet bei 0 Prozent
→ Linie läuft mit der echten Satzdauer
→ Linie erreicht am Satzende 100 Prozent
```

- Linienhöhe: 6 bis 10 px
- nur die Linie bewegt sich
- Satzstart und Satzende kommen aus `timeline/final-sync.json`
- erster Untertitel spätestens 3 Frames nach Sprachbeginn
- kein geschätztes lokales Timing im finalen Build

## Nicht erlaubt

- `visibleCount`
- `slice(0, visibleCount)`
- Wort-Reveal anhand eines linearen Interpolationswerts
- Fallback-Cues im finalen Render
- mehrere Fortschrittsindikatoren
- Untertitel tiefer als 190 px über dem unteren Rand
