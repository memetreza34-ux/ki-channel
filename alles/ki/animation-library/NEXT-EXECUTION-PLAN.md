# Nächster Ausführungsplan

## Ziel

Die Animationsbibliothek wird von 18 auf mindestens 22 ausführbare visuelle Familien erweitert und anschließend technisch sowie visuell geprüft. Kein Prototyp gilt ohne echten Render als verifiziert.

## Sofortige Arbeit

1. Die bereits vorhandenen Prototypen `Latency Tunnel Race`, `Timeline Microscope`, `Benchmark Racetrack` und `Encryption Vault Layers` in Registry und Renderkonfiguration aufnehmen.
2. Prototype-Coverage auf alle 22 visuellen Familien anheben.
3. Smoke- und Vollrendervertrag dynamisch aus der Registry ableiten.
4. Prüfchecklisten für die vier neuen Familien ergänzen.
5. Den Szenenanalyzer für mehrdeutige Sätze und zusammengesetzte Erklärziele härten.
6. Einen vollständigen Reel-Produktionslauf aus Rohtext, Brain-Zustand, Bibliotheksauswahl und New-Build-Vorschlägen erzeugen.
7. Nach echten Renderreviews nur bestandene Prototypen auf `verified` setzen.

## Geplantes technisches Ziel

```text
22 Prototypen × 7 PNG-Prüfframes = 154 PNG-Dateien
22 Prototypen × 1 MP4 = 22 MP4-Dateien
176/176 technisch gültige Artefakte
```

## Verbindliche Regeln

- `main` bleibt unverändert.
- Entwicklung bleibt auf `feature/animation-library-brain`.
- Keine parallelen Änderungen am Referenz-Reel-Branch.
- Keine Animation wird aufgrund von TypeScript-Erfolg als visuell gut bewertet.
- Keine unpassende Bibliotheksanimation wird erzwungen; unter dem Qualitätswert entsteht ein New-Build-Vertrag.
- Neue Informationen aktualisieren das Creative Brain nur mit Zeitstempel, Quelle, Vertrauen und nachvollziehbarer Beobachtung.
- Exakte Animationen, Layoutfamilien und Bewegungssignaturen unterliegen Wiederholungsschutz.
