# Post-Render Review — verbindliche Reel-Qualität

Diese Datei ergänzt `ki/gehirn/REELS.md`, `ki/gehirn/CAPTION_SAFE_POSITION.md` und `ki/reels/AGENTS.md` für **jede** finale Reel-Runde.

Ein sauberer Source-Code reicht nicht. Ein Reel ist erst visuell freigabefähig, wenn der tatsächlich gerenderte MP4 auf normaler Geschwindigkeit und auf Smartphone-/Feed-Größe geprüft wurde.

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

## 3. Caption- und Feed-Sicherheit

Für 1080 × 1920 ist `ki/gehirn/CAPTION_SAFE_POSITION.md` verbindlich. Die aktuelle Geometrie wurde anhand eines echten veröffentlichten Instagram-Feed-Screenshots des Kanals nach oben korrigiert.

- Caption standardmäßig mit **`bottom: 520px`** platzieren.
- Horizontal ungefähr **104px** Abstand links/rechts und bevorzugt maximal **820px** Caption-Breite.
- Der sichtbare Caption-Block liegt dadurch typischerweise ungefähr bei **y≈1280–1400**.
- Die letzten ungefähr **420 px** unten sind für Untertitel und andere kritische Informationen tabu.
- Der Bereich ungefähr **420–500 px vom unteren Rand** ist nur Puffer, keine bevorzugte Caption-Fläche.
- Caption-Fenster normalerweise 4–6 Wörter, maximal 2 Zeilen.
- Header vollständig in **y=110–260**, Animation ausschließlich in **y=300–1160**.
- Zwischen Animationsende und konservativer Zwei-Zeilen-Caption mindestens **100px** freie Luft.
- Zwischen Hauptvisual und konservativer Zwei-Zeilen-Caption mindestens `100 px` Luft sicherstellen.
- Rechte Like-/Kommentar-/Share-UI im Feed gedanklich mitprüfen; kritischer Caption-Text darf nicht an die rechte Kante gedrängt sein.
- Wenn viel ungenutzter Weißraum entsteht, Hauptvisual vergrößern/neu komponieren — **niemals Caption nach unten verschieben**.
- Der technische Clip-Guard um y≈1440 ist nur letzte Sicherung; die reale sichtbare Kollision entscheidet.

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
- Feed-Eindruck mit gedanklich reservierter Plattform-UI unten/rechts
- Caption-Lesbarkeit und Caption-Höhe
- Caption ungefähr bei `bottom: 520px`, nicht wieder im alten unteren Bereich
- horizontaler Abstand zur rechten Interaktionsleiste
- maximal 2 Caption-Zeilen
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

Das gilt ausdrücklich auch für reine Caption-Positionsänderungen. Nach einer Änderung von `bottom`, horizontalem Inset, Caption-Größe, Zeilenlogik oder Safe-Zone sind frühere Render-/Review-Häkchen nicht mehr gültig.

## 8. Freigabe-Gate

Nicht `approved`, wenn mindestens eines davon zutrifft:

- erster Moment wirkt leer/unbeabsichtigt
- Hauptvisual zu klein für Smartphone
- wichtige interne Labels zu klein
- große ungenutzte Fläche trotz kleiner Kernanimation
- mehrere Sekunden neue Sprecherbedeutung ohne sichtbare Reaktion
- Schluss steht sichtbar zu früh still
- Caption liegt sichtbar zu tief im Plattform-/Feed-UI-Bereich
- Caption wurde unter `bottom: 500px` geschoben, um Platz für Visuals zu gewinnen
- Caption oder kritischer Text liegt zu nah an der rechten Feed-Interaktionsleiste
- Caption und Animation konkurrieren
- mehr als 2 Caption-Zeilen stehen gleichzeitig sichtbar
- wichtiger Inhalt wird vom Clip-Guard abgeschnitten
- neuer Source-Stand wurde nach letzter visueller Prüfung verändert

Ziel ist nicht maximale Bewegung, sondern **maximale visuelle Erklärung pro sinnvoller Bewegung bei sicher lesbarer Caption**.
