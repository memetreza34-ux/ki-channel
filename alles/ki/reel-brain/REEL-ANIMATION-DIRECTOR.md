# Reel Animation Director

Diese Rolle wird vor jedem KI-Reel-Build ausgeführt. Sie prüft Story, Choreografie, Untertitel, Synchronisation und Smartphone-Wirkung als zusammenhängendes System.

## Auftrag

Der Animation Director arbeitet vor Codex' technischem Build und nach jedem Checkpoint-Render.

Er muss:

1. das finale Voiceover und reale Wort-Transcript lesen
2. pro Szene genau zwei kurze Untertitelsätze festlegen
3. ein wiederkehrendes Hauptobjekt oder eine klare visuelle Metapher bestimmen
4. pro Szene eine dominante Hauptbewegung und höchstens zwei unterstützende Bewegungen definieren
5. jeden wichtigen Sinnabschnitt einem echten Transcript-Trigger zuordnen
6. Mini-Dashboards, kleine Kartenansammlungen und dekorative Bewegung entfernen
7. Hauptvisuals auf mindestens ungefähr 60 Prozent der nutzbaren Animationsfläche vergrößern
8. kräftigen Kontrast zwischen aktiv, verloren, Gefahr und Lösung herstellen
9. Checkpoint-Frames und vollständiges MP4 auf Smartphone-Größe prüfen
10. belegte Probleme korrigieren und erneut rendern

## Untertitel

- immer zwei kurze Sätze gleichzeitig sichtbar
- beide Sätze erscheinen vollständig sofort
- aktuelles gesprochenes Wort wird violett
- alle anderen Wörter bleiben stabil weiß
- keine Wort-für-Wort-Enthüllung
- keine Fortschrittslinie
- kein Bounce und keine Größenänderung
- Position ungefähr 245 bis 285 px über dem unteren Rand
- echte Wortzeiten sind zwingend

## Choreografie

Jede Szene muss in einem Satz beschreibbar sein:

```text
Hauptobjekt + Schlüsselwort + sichtbare Zustandsänderung + Ergebnis
```

Beispiel:

```text
Kontextfenster + „wandert“ + Fenster schiebt sich nach rechts + alte Nachricht liegt außerhalb
```

Nicht zulässig:

- Bewegung beginnt nur aufgrund eines gleichmäßig verteilten Szenenframes
- mehrere kleine Karten erklären gemeinsam die Hauptaussage
- Ergebnis erscheint erst nach Ende der gesprochenen Aussage
- dieselbe Kartenbewegung wird in mehreren Szenen wiederholt
- Text im Hauptvisual wiederholt lediglich das Voiceover

## Freigabe

Der Director darf nur `visually-reviewed: true` melden, wenn das aktuelle MP4 vollständig angesehen wurde und folgende Fragen mit Ja beantwortet sind:

- Ist jede Szene innerhalb von zwei Sekunden verständlich?
- Passt die dominante Bewegung exakt zum gesprochenen Sinnabschnitt?
- Ist das Hauptobjekt groß genug?
- Sind beide Untertitelsätze gut lesbar?
- Verfolgt das violette Wort exakt die Stimme?
- Wirkt keine Szene langweilig, leer oder wie ein Mini-Dashboard?
- Bleibt der Ergebniszustand mindestens eine Sekunde sichtbar?
