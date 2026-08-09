# Audio-Plan

## Grundrichtung

- Keine dominante Musik, die die Erklärung überdeckt.
- Moderner, leichter elektronischer Puls mit 92–98 BPM.
- Musik bleibt im Hintergrund und trägt nur den Rhythmus.
- Soundeffekte erklären Bewegungen, nicht jede Kleinigkeit.
- Sprache bleibt jederzeit klar verständlich.

## Pegelziel

| Spur | Ziel |
|---|---|
| Voiceover | Hauptspur, klar und trocken |
| Musik | etwa 16–20 dB unter Voiceover |
| wichtige SFX | etwa 10–14 dB unter Voiceover |
| atmosphärische SFX | etwa 20–24 dB unter Voiceover |

## Szenenbezogener SFX-Plan

### Szene 1

- kurzer, trockener Impact beim Einrasten des Satzes
- feiner Spannungsanstieg vor dem Zerbrechen
- weiche magnetische Klicks für einzelne Tokens
- kein aggressiver Glasbruch

### Szene 2

- sauberer Scanner-Sweep
- kurze digitale Ticks bei jeder Umwandlung
- tiefer, kurzer Whoosh beim Übergang in den Bedeutungsraum

### Szene 3

- räumliche Fly-by-Sounds für Vektorpunkte
- sehr weiche Cluster-Snaps
- subtiler Orbit-Riser ohne dramatischen Trailercharakter

### Szene 4

- dünne Zips entlang wachsender Attention-Fäden
- tiefe Pulse nur bei starken Verbindungen
- ein klarer Lock-Sound beim stärksten Zusammenhang

### Szene 5

- leises Entfalten der drei Pfade
- Wahrscheinlichkeits-Ticks bei Prozentänderungen
- ein eindeutiger Winner-Snap, aber kein Gameshow-Sound

### Szene 6

- kontinuierliches, sehr leises Layer-Hum
- pro Ebene ein eigener kurzer Frequenzakzent
- Öffnungsimpuls beim Freigeben der Wortkapseln

### Szene 7

- präzise Wortklicks statt Tastaturgeräusch
- kurze violette Spur mit einem leichten Air-Swish
- Resolve-Ton beim vollständigen Satz

### Szene 8

- klarer Split-Hit
- dezentes mechanisches Kippen der Waage
- kurze Warnfrequenz, nicht alarmistisch
- ruhiger Abschlussakkord unter `KI-ANTWORTEN PRÜFEN`

## Übergänge

Die Übergangssounds müssen aus dem letzten Objekt der alten Szene entstehen. Kein universeller Whoosh zwischen allen Szenen.

| Übergang | Soundbrücke |
|---|---|
| 1 → 2 | fallende Tokenklicks werden zum Scanner-Takt |
| 2 → 3 | Scanner-Hum öffnet sich räumlich |
| 3 → 4 | Cluster-Snap wird zum ersten Thread-Zip |
| 4 → 5 | Connection-Lock startet den ersten Pfad |
| 5 → 6 | Winner-Snap geht in Layer-Hum über |
| 6 → 7 | Öffnungsimpuls löst Wortklicks aus |
| 7 → 8 | Satz-Resolve wird zum Split-Hit |

## Audio-Synchronisierung

Nach der finalen Voiceover-Aufnahme:

1. Wort-Timestamps erzeugen.
2. Timestamps in eine JSON-Datei schreiben.
3. Globale Zeiten mit der Transkript-Pipeline auf lokale Szenenzeiten abbilden.
4. Schlüsselwörter als `audioKeywords` definieren.
5. Testen, ob sichtbare Kernaktionen maximal 200 ms vor oder 250 ms nach dem gesprochenen Schlüsselwort starten.
