# Post-Render Review — verbindliche Reel-Qualität

Diese Datei ergänzt `ki/gehirn/REELS.md`, `ki/gehirn/CAPTION_SAFE_POSITION.md`, `ki/reels/AGENTS.md` und `ki/skills/motion-readability-light-first/SKILL.md` für **jede** finale Reel-Runde.

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

Für 1080 × 1920 ist `ki/gehirn/CAPTION_SAFE_POSITION.md` verbindlich, sofern der Nutzer keine reel-spezifische Abweichung verlangt.

- Caption standardmäßig mit **`bottom: 520px`** platzieren.
- Horizontal ungefähr **104px** Abstand links/rechts und bevorzugt maximal **820px** Caption-Breite.
- Der sichtbare Caption-Block liegt dadurch typischerweise ungefähr bei **y≈1260–1400**.
- Die letzten ungefähr **420 px** unten sind für Untertitel und andere kritische Informationen tabu.
- Der Bereich ungefähr **420–500 px vom unteren Rand** ist nur Puffer, keine bevorzugte Caption-Fläche.
- Caption-Fenster normalerweise 4–6 Wörter, maximal 2 Zeilen.
- Neue bedeutungstragende Visuals sollen möglichst bis ungefähr **y≈1240–1280** abgeschlossen sein.
- Zwischen Hauptvisual und Caption ungefähr `80–120 px` Luft anstreben.
- Rechte Like-/Kommentar-/Share-UI im Feed gedanklich mitprüfen.

## 4. Nicht statisch — aber auch nicht gehetzt

Wenn sich die Bedeutung ändert, muss sich der sichtbare Zustand ändern. Gleichzeitig darf ein wichtiger Zustand nicht so schnell vorbeiziehen, dass er nur technisch vorhanden ist.

### Zu langsam / statisch

- Ein bedeutungstragender neuer Satz/Halbsatz darf nicht mehrere Sekunden über einem praktisch unveränderten Bild laufen.
- Als Review-Warnsignal gilt ungefähr `>2.5 s` neuer Sprecherbedeutung ohne sichtbare Reaktion, sofern es kein bewusstes End-Hold ist.

### Zu schnell / unlesbar

Ein Reel fällt durch, wenn bei 1x-Geschwindigkeit:

- ein wichtiges Label, eine Card, Zahl oder Statusänderung bereits wieder verschwindet, bevor sie sauber erfasst werden kann
- mehrere unabhängige neue Informationen gleichzeitig auftauchen und der Blick nicht weiß, wohin zuerst
- ein Hero-/Payoff-Zustand praktisch keinen Hold hat
- ein Entrance direkt vom nächsten Entrance überschrieben wird
- man pausieren oder zurückspulen muss, um einen wichtigen Visual Beat zu verstehen

Richtwert bei 30 fps für kritische Informationszustände: nach Reveal/Settle mindestens ungefähr **12–24 Frames** klar lesbarer Zustand. Hero-Momente meist **18–30 Frames**, sofern Audio/Story es zulassen.

Wenn der Audioabschnitt zu kurz ist: Visualisierung vereinfachen oder Beats neu verteilen. **Nicht** mehrere wichtige Zustände unlesbar beschleunigen.

## 5. Light-First-Kohärenz

Der Standard-Look für zukünftige Reels ist **hell und visuell zusammenhängend**.

- Vollbild-Hintergründe standardmäßig hell: Offwhite, Hellgrau, sehr helles Cyan, Mint, Blau, Creme etc.
- Akzentfarben dürfen kräftig sein.
- Dunkle Cards/Objekte innerhalb einer hellen Szene sind erlaubt.
- Eine einzelne schwarze/dunkelblaue Fullscreen-Szene zwischen hellen Szenen ist ein Stilbruch und fällt durch.
- Dunkle Fullscreen-Szenen nur bei ausdrücklichem Nutzerwunsch oder zwingender Quelllogik und dann dokumentierte Ausnahme im `MOTION-READABILITY-REVIEW.md`.

Der Contact Sheet muss wie **ein zusammengehöriges Reel** aussehen, nicht wie zwei verschiedene Designsysteme.

## 6. Schluss muss bis zur letzten Aussage tragen

Die letzte Szene darf nicht früh „fertig aussehen“, während noch mehrere Sätze gesprochen werden.

Vor dem Render prüfen:

```text
letzte Sprecherphrase 1 → sichtbarer Beat
letzte Sprecherphrase 2 → sichtbarer Beat
letzte Sprecherphrase 3 → sichtbarer Beat
finale Aussage → klarer Endzustand + kurzer Hold
```

Falls die Schlussanimation bereits lange vor dem Voiceover-Ende im Endzustand steht, zusätzliche **semantische** Micro-Beats bauen oder die Progression neu verteilen.

## 7. Pflicht-Review nach jedem neuen Render

Mindestens prüfen:

- Opening
- Mitte jeder Szene
- Ende jeder Szene
- alle relevanten Visual-Beat-Wechsel
- letzte `8–12 s` besonders dicht
- normale Wiedergabegeschwindigkeit **1x**
- Smartphone-Größe / kleine Vorschau
- Feed-Eindruck
- Caption-Lesbarkeit und Caption-Höhe
- interne Label-Lesbarkeit
- Animation/Caption-Abstand
- leere Flächen
- statische Phasen
- **zu schnelle Phasen**
- gestaffelte Reveals statt Informationsstapel
- ausreichende Holds nach wichtigen Zuständen
- Light-First-Kohärenz über alle Szenen
- finalen End-Hold

Danach `06-projektdateien/MOTION-READABILITY-REVIEW.md` aktualisieren und ausführen:

```bash
node ki/scripts/validate-motion-readability-review.mjs <reel-package-dir>
```

## 8. Post-Render-Korrekturschleife

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

## 9. Freigabe-Gate

Nicht `approved`, wenn mindestens eines davon zutrifft:

- erster Moment wirkt leer/unbeabsichtigt
- Hauptvisual zu klein für Smartphone
- wichtige interne Labels zu klein
- große ungenutzte Fläche trotz kleiner Kernanimation
- mehrere Sekunden neue Sprecherbedeutung ohne sichtbare Reaktion
- ein wichtiger Visual Beat ist bei 1x zu kurz lesbar
- mehrere unabhängige Informationen erscheinen hektisch gleichzeitig
- Hero-/Payoff-Zustand hat keinen sinnvollen Hold
- dunkle Fullscreen-Szene ohne dokumentierte Ausnahme
- Contact Sheet wirkt wie zwei verschiedene Designsysteme
- Schluss steht sichtbar zu früh still
- Caption liegt sichtbar im Plattform-/Feed-UI-Bereich
- Caption und Animation konkurrieren
- mehr als 2 Caption-Zeilen stehen gleichzeitig sichtbar
- wichtiger Inhalt wird abgeschnitten
- neuer Source-Stand wurde nach letzter visueller Prüfung verändert
- `MOTION-READABILITY-REVIEW.md` oder dessen Validator ist nicht bestanden

Ziel ist nicht maximale Bewegung, sondern **maximale visuelle Erklärung pro sinnvoller Bewegung bei klarer Lesbarkeit und konsistent hellem Design**.
