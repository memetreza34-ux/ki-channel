# Globaler Animationsplan

Die detaillierte Choreografie jeder Szene liegt in `../scenes/scene-01.md` bis `scene-08.md`. Diese Datei enthält nur die Regeln, die für das gesamte Reel gelten.

## Rhythmus

```text
Start-Hold
→ sichtbare Ursache
→ dominante Hauptbewegung
→ sichtbare Wirkung
→ Ergebnis-Hold
```

- eine dominante Erklärung pro Szene
- maximal drei starke Bewegungen gleichzeitig
- unterstützende Bewegungen bleiben klein und semantisch
- keine Dauerpulse, Endlosrotationen oder dekorativen Partikel
- Hard Cuts sind Standard
- Übergänge nur bei echtem Objekt-, Form- oder Zustandsbezug

## Ebenen

| Z | Inhalt |
|---:|---|
| 0 | Hintergrund oder Bild |
| 10 | Bildmasken und Tiefenbehandlung |
| 20 | Hauptanimation |
| 35 | Connectoren, Fokusrahmen, Messwerte |
| 50 | kurze Annotationen und Statuslabels |
| 70 | Überschrift |
| 90 | Untertitel |
| 100 | semantischer Übergang |

## Typografie und Farben

- Überschrift: dunkel, fett, maximal zwei Zeilen
- Untertitel: maximal neun bereits gesprochene Wörter
- normale Wörter: dunkel
- wichtige Konzepte: violett
- Risiko, Negation und Widerspruch: rot
- tatsächlich geprüfter Zustand: grün
- UI-Texte müssen klar anders aussehen als Untertitel

## Bildbehandlung

Ein Bild darf niemals nur mit einem langsamen Standardzoom gezeigt werden.

Erlaubt sind:

- lokale Masken und Reveals
- Fokusrahmen
- regionale Helligkeitsänderung
- Parallax zwischen real getrennten Ebenen
- SVG-Risse, Pfeile und Connectoren
- Charts, Zähler und Statuswechsel
- Remotion-Objekte, die logisch mit dem Bild interagieren

## Übergangskarte

| Von | Nach | Übergang |
|---|---|---|
| Szene 1 | Szene 2 | ein Glassplitter wird zum Wortchip |
| Szene 2 | Szene 3 | Gewinnerchip fällt in die Maschine |
| Szene 3 | Szene 4 | Aussagekarte wird zu vier Dokumenten |
| Szene 4 | Szene 5 | Warnrahmen wird zum Chatrahmen |
| Szene 5 | Szene 6 | Unterstreichung wird zur Browserleiste |
| Szene 6 | Szene 7 | Quellenkarte teilt sich in A/B-Antworten |
| Szene 7 | Szene 8 | drei Vergleichslinien werden zu Prüfgates |

## Audio

```text
soundMode = off
```

Nur das finale Voiceover wird verwendet. Keine Musik, keine Beeps, keine Noise-Sweeps und keine Effekte pro Wort.

## Pflichtprüfung

- jede Szene besitzt einen sichtbaren Anfang
- jede Szene endet stabil
- keine Vollanimation doppelt
- keine benachbarten Layout- oder Bewegungssignaturen identisch
- alle wichtigen Wörter sind synchron zur sichtbaren Aktion
- Übergänge verdecken keine Untertitel
- letzter Frame ist vollständig lesbar
