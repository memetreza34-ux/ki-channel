# Verbindlicher Standard für zukünftige KI-Reels

Neue Reels verwenden `ki-animation-only-reel-v3`.

## Kernprinzip

```text
finales Voiceover
→ echtes Wort-Transcript
→ zwei kurze Untertitelsätze pro Szene
→ aktives Wort violett
→ Szenengrenzen
→ semantische Animations-Trigger
→ finale Videolänge
```

Vorgeplante Frames sind nur Platzhalter. Sie dürfen nie unverändert in den finalen Render gelangen.

## Redaktion

- 1080 × 1920, 30 FPS
- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- pro Szene genau zwei kurze Sätze
- ein Hauptgedanke pro Szene
- finale Dauer = letztes gesprochenes Wort + 1,2 bis 2,2 Sekunden
- Voiceover und Wiedergabe standardmäßig 1,00x
- keine Musik und keine Soundeffekte

## Untertitel

Jede Szene zeigt immer zwei kurze Sätze gleichzeitig.

- beide Sätze erscheinen vollständig sofort
- nur das aktuell gesprochene Wort wird violett
- alle anderen Wörter bleiben stabil weiß
- keine Wort-für-Wort-Enthüllung
- keine Größenänderung, kein Bounce und kein Verschieben
- keine Fortschrittslinie
- echte Wortanfangs- und Wortendzeiten sind verpflichtend
- Standardschrift 44 px, niemals unter 42 px
- Unterkante 245 bis 285 px, Standard 260 px
- keine große Hintergrundbox

Die finale Sync-Datei enthält für jedes Wort `text`, `startFrame` und `endFrame`.

## Choreografie

Jede Szene besitzt:

```text
1 großes Hauptobjekt
1 dominante Hauptbewegung
höchstens 2 unterstützende Elemente
1 klaren Ergebniszustand
```

- Hauptvisual nutzt ungefähr 60 bis 78 Prozent der Animationsfläche
- ein bis drei Sinnbeats pro Szene
- maximal zwei starke Bewegungen gleichzeitig
- wichtige Bewegung beginnt höchstens fünf Frames vom gesprochenen Trigger entfernt
- Ergebnis bleibt mindestens eine Sekunde sichtbar
- keine Mini-Dashboards
- keine Ansammlung kleiner Karten als Hauptaussage
- keine winzigen Labels oder dünnen Linien als Kernerklärung
- keine dekorative Dauerbewegung
- keine vollständige Choreografie innerhalb eines Reels wiederholen
- kräftiger Kontrast zwischen aktiv, verloren, Gefahr und Lösung
- Szene muss innerhalb von zwei Sekunden verständlich sein

## Pflichtrollen

1. **Animation Director** – entwirft einfache, starke und semantisch passende Choreografie.
2. **Sync Auditor** – prüft Wortzeiten, Trigger, Szenengrenzen und Schluss-Hold.
3. **Visual QA Agent** – prüft Kontaktbogen und MP4 in normaler Geschwindigkeit und Smartphone-Größe.

## Finale Zeitquelle

Jedes finale Reel benötigt `timeline/final-sync.json` mit Audiozeiten, Szenengrenzen, einem Untertitelpaar pro Szene, exakt zwei Sätzen pro Paar, Wortzeiten, semantischen Triggern und Ergebnis-Holds. Finaler Produktionscode darf keine geschätzten Caption- oder Beat-Frames verwenden.

## Toleranzen

- Animationstrigger: maximal ±5 Frames
- Szenenwechsel: maximal ±6 Frames von der Sinnpause
- erster Untertitel: spätestens 3 Frames nach Sprachbeginn
- Schluss-Hold: 1,2 bis 2,2 Sekunden

## Freigabeblocker

Nicht freigeben bei fehlendem Wort-Transcript, fehlender finaler Sync-Datei, falscher Satzzahl, Fortschrittslinie, Wortaufbau, fehlendem violetten Wort-Tracking, falscher Untertitelposition, Triggerabweichung, kleinen oder blassen Hauptvisuals, wiederholter Kartenbewegung, rein dekorativer Animation, altem Render oder fehlender Smartphone-Prüfung.

## Definition of Done

Ein Reel ist erst fertig, wenn reales Audio und Wort-Transcript vorhanden sind, der v3-Validator besteht, TypeScript und Tests bestehen, aktuelle Checkpoints gerendert wurden, Animation Director und Visual QA Agent dokumentiert geprüft haben, Kontaktbogen und aktuelles MP4 angesehen wurden und der Nutzer freigegeben hat.
