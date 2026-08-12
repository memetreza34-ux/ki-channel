# Post-Render Review — verbindliche Reel-Qualität

Diese Datei ergänzt `ki/gehirn/REELS.md` und `ki/reels/AGENTS.md` für **jede** finale Reel-Runde.

Ein sauberer Source-Code reicht nicht. Ein Reel ist erst visuell freigabefähig, wenn der tatsächlich gerenderte MP4 auf normaler Geschwindigkeit und auf Smartphone-Größe geprüft wurde.

## 1. Kein leerer Einstieg

Der Zuschauer soll ab dem ersten Moment erkennen, dass etwas passiert.

- Frame 0 darf ruhig sein, aber nicht wie eine versehentlich leere weiße Fläche wirken.
- Das erste Hauptvisual soll sofort schwach sichtbar sein oder innerhalb der ersten ungefähr `0.2–0.4 s` eindeutig erscheinen.
- Keine lange Intro-Fade, kein Logo-Pre-Roll, kein dekoratives Warten vor dem Inhalt.
- Hook-Audio und erster visueller Zustand beginnen als ein gemeinsamer Moment.

## 2. Smartphone zuerst — Hauptvisual groß genug

Die Animation soll die verfügbare Fläche **nutzen**, statt wie ein kleines Desktop-Widget in viel leerem Weiß zu stehen.

- Hauptmechanik so groß bauen, dass sie auf einem echten Smartphone ohne Zoomen sofort lesbar ist.
- Interne Labels nur behalten, wenn sie für die Erklärung nötig sind.
- Kurze Labels bevorzugen; lange Satztexte gehören in Voiceover/Caption, nicht in die Animation.
- Kritische Labels bei 1080 × 1920 in der Regel nicht kleiner als ungefähr `28–32 px`; wichtige Zustandsbegriffe eher größer.
- Wenn ein Zuschauer Kleinsttext nicht liest, muss die Kernmechanik trotzdem verständlich bleiben.
- Leere Fläche nicht mit Deko füllen: lieber die vorhandene sinnvolle Mechanik größer und klarer komponieren.

## 3. Vertikale Fläche bewusst nutzen

Die harte Caption-Zone bleibt unverändert geschützt.

- Animation darf den Raum oberhalb `y≈1440` aktiv nutzen.
- Zwischen Hauptvisual und Caption möglichst ungefähr `80–120 px` sichtbare Luft.
- Wenn viel ungenutzter Weißraum entsteht, zuerst Hauptvisual vergrößern/neu komponieren — niemals Caption nach unten verschieben.
- Keine wichtige Karte, Linie, Beschriftung oder Bewegung in/unter der Caption-Zone.

## 4. Kein langer statischer Sprecherabschnitt

Wenn sich die Bedeutung ändert, muss sich auch der sichtbare Zustand ändern.

- Ein bedeutungstragender neuer Satz/Halbsatz darf nicht mehrere Sekunden über einem praktisch unveränderten Bild laufen.
- Als Review-Warnsignal gilt ungefähr `>2.5 s` neuer Sprecherbedeutung ohne sichtbare Reaktion, sofern es kein bewusstes End-Hold ist.
- Mögliche Reaktion: Fokuswechsel, Zustandswechsel, Gate, Progression, Verbindung, Auswahl, Bestätigung, Ergebnis oder neue Micro-Animation.
- Nicht künstlich ständig wackeln lassen. Bewegung muss Bedeutung erklären.
- End-Hold ist erlaubt, aber erst wenn die inhaltliche Aussage wirklich abgeschlossen ist.

## 5. Schluss muss bis zur letzten Aussage tragen

Die letzte Szene darf nicht früh „fertig aussehen“, während noch mehrere Sätze gesprochen werden.

Vor dem Render prüfen:

```text
letzte Sprecherphrase 1 → sichtbarer Beat
letzte Sprecherphrase 2 → sichtbarer Beat
letzte Sprecherphrase 3 → sichtbarer Beat
finale Aussage → klarer Endzustand + kurzer Hold
```

Falls die Schlussanimation bereits lange vor dem Voiceover-Ende im Endzustand steht, zusätzliche **semantische** Micro-Beats bauen oder die Progression neu verteilen.

## 6. Pflicht-Review nach jedem neuen Render

Mindestens prüfen:

- Opening
- Mitte jeder Szene
- Ende jeder Szene
- alle relevanten Visual-Beat-Wechsel
- letzte `8–12 s` besonders dicht
- normale Wiedergabegeschwindigkeit
- Smartphone-Größe / kleine Vorschau
- Caption-Lesbarkeit
- interne Label-Lesbarkeit
- Animation/Caption-Abstand
- leere Flächen
- statische Phasen
- finalen End-Hold

## 7. Post-Render-Korrekturschleife

Wenn der Render einen echten visuellen Fehler zeigt:

```text
Render ansehen
→ konkrete Ursache in Source bestimmen
→ Source ändern
→ Status auf "Revision implementiert, Rerender erforderlich" setzen
→ neu rendern
→ neuen Render erneut prüfen
```

Ein alter Render darf **nicht** als visuelle Freigabe für eine danach geänderte Source verwendet werden.

Nach Source-Änderungen sind frühere Häkchen für neuen Smoke-/Final-Render und visuelle Endfreigabe nicht mehr gültig.

## 8. Freigabe-Gate

Nicht `approved`, wenn mindestens eines davon zutrifft:

- erster Moment wirkt leer/unbeabsichtigt
- Hauptvisual zu klein für Smartphone
- wichtige interne Labels zu klein
- große ungenutzte Fläche trotz kleiner Kernanimation
- mehrere Sekunden neue Sprecherbedeutung ohne sichtbare Reaktion
- Schluss steht sichtbar zu früh still
- Animation ragt in Caption-Zone
- Caption und Animation konkurrieren
- neuer Source-Stand wurde nach letzter visueller Prüfung verändert

Ziel ist nicht maximale Bewegung, sondern **maximale visuelle Erklärung pro sinnvoller Bewegung**.
