# Post-Render Review — verbindliche Reel-Qualität

Ein sauberer Source reicht nicht. Der **tatsächliche MP4** muss bei normaler Geschwindigkeit und in Smartphone-/Feed-Größe geprüft werden.

## 1. Opening

- erster sinnvoller Zustand sofort bzw. innerhalb ca. `0.2–0.4 s`
- kein leerer Pre-Roll
- Hook-Audio und erster visueller Zustand gehören zusammen

## 2. Smartphone-Lesbarkeit

- Hauptmechanik groß genug
- kritische interne Labels kurz und typischerweise mindestens ca. `28–32 px`
- keine kleine UI-Insel in riesiger Leere
- lieber sinnvolle Mechanik größer als Deko hinzufügen

## 3. Caption / Feed

Kanonisch laut `CAPTION_SAFE_POSITION.md`:

- `bottom: 250px`
- `104px` horizontaler Inset
- max. `860px`
- max. 2 Zeilen
- Glass-/Blur-Overlay
- Fullscreen-Hintergrund bleibt sichtbar; **kein separater Footer**

Review-Fails:

- Caption kollidiert mit Account/CTA/Feed-UI
- Caption und Hauptvisual konkurrieren
- mehr als 2 Zeilen
- eigener weißer/andersfarbiger Untertitel-Footer
- alter hoher Caption-Wert wird ohne dokumentierte Ausnahme wieder eingeführt

## 4. Motion Readability

High Energy ≠ High Speed.

Wichtige Zustände:

`REVEAL → SETTLE → READABLE HOLD`

Bei 1x fällt ein Beat durch, wenn:

- Pausieren/Zurückspulen nötig ist
- wichtiges Element verschwindet, bevor es erfasst werden kann
- zu viele neue Dinge gleichzeitig erscheinen
- Hero-Moment sofort überschrieben wird
- Ablauf subjektiv gehetzt wirkt

Richtwerte bei 30 fps:

- kritischer Hold meist mindestens `12–24 Frames`
- Hero-/Payoff-Hold meist `18–30 Frames`
- unabhängige neue Informationen meist `6–12 Frames` staffeln

## 5. Kein statischer Sprecherabschnitt

Die Gegenrichtung ist ebenfalls falsch.

- neue Sprecherbedeutung darf nicht mehrere Sekunden über praktisch unverändertem Bild laufen
- > ca. `2.5 s` ohne semantische Reaktion ist Warnsignal
- Hold erst nach abgeschlossener Aussage

## 6. Light-First

- Fullscreen standardmäßig hell
- kräftige Akzente erlaubt
- dunkle Fullscreen-Szene nur als dokumentierte Ausnahme
- kein einzelner dunkler Stilbruch zwischen hellen Szenen

## 7. Schluss

Die letzte Szene muss bis zur letzten Sprecherphrase weiterentwickelt werden.

```text
letzte Phrase(n)
→ sichtbare Beats
→ finaler Payoff
→ kurzer End-Hold
```

Nicht früh fertig aussehen, während Voiceover weiterläuft.

## 8. Pflicht-Review nach jedem Render

Mindestens prüfen:

- Opening
- Mitte/Ende jeder Szene
- Hero-Momente
- alle wichtigen Zustandswechsel
- letzte 8–12 Sekunden
- 1x Geschwindigkeit
- Smartphone-Größe
- Caption/Feed-Kollision
- Light-First-Kohärenz
- Audio hörbar

`MOTION-READABILITY-REVIEW.md` danach real ausfüllen und validieren.

## 9. Korrekturschleife

```text
Render ansehen
→ konkrete Ursache finden
→ Source ändern
→ Status: REVISION IMPLEMENTIERT — RERENDER ERFORDERLICH
→ neu rendern
→ neuen Render prüfen
```

Ein alter Render darf niemals einen danach geänderten Source freigeben.

## 10. Freigabe-Gate

Nicht freigeben bei:

- leerem Einstieg
- zu kleinem Hauptvisual
- unlesbaren/zu schnellen Beats
- mehreren Sekunden neuer Bedeutung ohne Reaktion
- dunklem Fullscreen-Stilbruch ohne Ausnahme
- Caption-/Feed-Kollision
- zweitem Footer-Hintergrund
- Schluss zu früh statisch
- stummem/praktisch unhörbarem Audio
- Render passt nicht zum aktuellen Source

Ziel: **maximale visuelle Erklärung bei klarer Lesbarkeit, nicht maximale Bewegung.**
