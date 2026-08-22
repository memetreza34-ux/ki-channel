# Post-Render Review — verbindliche Reel-Qualität

Diese Datei ergänzt `ki/gehirn/REELS.md`, `ki/gehirn/CAPTION_SAFE_POSITION.md`, `ki/reels/AGENTS.md` sowie die Skills `ki/skills/high-energy-remotion-reels/SKILL.md` und `ki/skills/voice-locked-captions/SKILL.md` für **jede** finale Reel-Runde.

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
- Hauptmechanik soll typischerweise ungefähr `55–85 %` der nutzbaren Visual-Safe-Fläche prägen, wenn die Aussage das zulässt.
- Interne Labels nur behalten, wenn sie für die Erklärung nötig sind.
- Kurze Labels bevorzugen; lange Satztexte gehören in Voiceover/Caption, nicht in die Animation.
- Kritische Labels bei 1080 × 1920 in der Regel nicht kleiner als ungefähr `28–32 px`; wichtige Zustandsbegriffe eher größer.
- Wenn ein Zuschauer Kleinsttext nicht liest, muss die Kernmechanik trotzdem verständlich bleiben.
- Leere Fläche nicht mit Deko füllen: lieber die vorhandene sinnvolle Mechanik größer, räumlicher und klarer komponieren.
- Eine kleine weiße Card in sehr viel freier Fläche ist ein Review-Fehler, auch wenn die Card technisch sauber animiert ist.

## 3. Caption- und Feed-Sicherheit

Für 1080 × 1920 ist `ki/gehirn/CAPTION_SAFE_POSITION.md` verbindlich.

- Caption standardmäßig mit **`bottom: 520px`** platzieren.
- Horizontal ungefähr **104px** Abstand links/rechts und bevorzugt maximal **820px** Caption-Breite.
- Der sichtbare Caption-Block liegt dadurch typischerweise ungefähr bei **y≈1260–1400**.
- Die letzten ungefähr **420 px** unten sind für Untertitel und andere kritische Informationen tabu.
- Der Bereich ungefähr **420–500 px vom unteren Rand** ist nur Puffer, keine bevorzugte Caption-Fläche.
- Caption-Fenster normalerweise 3–6 Wörter, maximal 2 Zeilen.
- Neue bedeutungstragende Visuals sollen möglichst bis ungefähr **y≈1240–1280** abgeschlossen sein.
- Zwischen Hauptvisual und Caption ungefähr `80–120 px` Luft anstreben.
- Rechte Like-/Kommentar-/Share-UI im Feed gedanklich mitprüfen; kritischer Caption-Text darf nicht an die rechte Kante gedrängt sein.
- Wenn viel ungenutzter Weißraum entsteht, Hauptvisual vergrößern/neu komponieren — **niemals Caption nach unten verschieben**.
- Der technische Clip-Guard um y≈1440 ist nur letzte Sicherung; die reale sichtbare Kollision entscheidet.

## 4. Visuelle Energie — kein Präsentationslook

Solange der Sprecher neue Bedeutung liefert, muss sich die visuelle Erklärung sichtbar weiterentwickeln.

Review-Ziele für Short-Form:

- ungefähr alle `0.6–1.5 s` ein semantischer Micro-Beat, solange neue Sprecherbedeutung kommt
- praktisch unveränderter Zustand länger als ungefähr `1.8 s` ist ein Warnsignal, sofern es kein bewusster End-Hold ist
- pro Szene normalerweise mindestens `3–6` unterscheidbare Visual Beats
- Card/Pill/Badge dürfen Teil des Designs sein, aber nicht automatisch die gesamte Mechanik bilden
- mindestens ein markanter visueller Moment pro Szene
- Kamera, Parallax, pseudo-3D, Transformation, Masken, SVG-Pfade, gerichtete Partikel/Flows oder kinetische Schlüsselwörter aktiv prüfen, wenn sie die Aussage verbessern

Nicht einfach zusätzliche Deko hinzufügen. Wenn der Render langweilig wirkt, zuerst **Komposition, Objektgröße, Zustandswechsel und räumliche Dynamik** verbessern.

Nicht freigeben, wenn sich das Reel wie eine PowerPoint mit sanften Fade-ins anfühlt.

## 5. Logos, Bilder und Screenshots dürfen leben

Wenn ein echtes lokales Logo, Markenasset, Bild oder Screenshot inhaltlich relevant ist:

- nicht automatisch statisch einblenden
- Logo bei Möglichkeit über Mask-Reveal, SVG-Stroke, Depth-Pop, Layer-Aufbau, Light-Sweep oder Übergang in die Hauptmechanik animieren
- Bilder/Screenshots über Fokus-Zoom, Crop-Travel, 2.5D, Parallax, Cutout-Layer oder native Overlays in die Erklärung integrieren
- bei Screenshots relevante Bereiche gezielt hervorheben/isolieren statt das komplette Bild passiv stehen zu lassen
- Markenlogos nie ungenau aus Erinnerung nachbauen

Ein Ken-Burns-Zoom allein gilt bei zentralen Bildassets nicht als ausreichend, wenn mehr semantische Animation möglich ist.

## 6. Voice-Lock — Caption und Szene müssen zur echten Stimme passen

Sobald echtes Voiceover vorliegt, dürfen Phase-1-Schätzungen nicht mehr die Produktions-Timeline bestimmen.

Pflichtprüfung:

- Composition-Dauer entspricht dem tatsächlich verwendeten Audio
- Szenenwechsel liegen auf natürlichen Sprecher-/Bedeutungsgrenzen
- Caption-Cues erscheinen nur während tatsächlich gesprochener Abschnitte
- natürliche Sprechpausen erzeugen keine weiterlaufende Wort-Hervorhebung
- finale Cues besitzen Wort-Timestamps
- aktives lila Wort folgt hörbar der Stimme
- Visual Beat und gesprochenes Schlüsselwort treffen denselben Moment
- letzte Caption endet zusammen mit der letzten gesprochenen Phrase

Ein proportionaler Active-Word-Fallback ist für Phase-1-Preview okay, **nicht für Production**.

Vor finaler Freigabe ausführen:

```bash
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
```

## 7. Schluss muss bis zur letzten Aussage tragen

Die letzte Szene darf nicht früh „fertig aussehen“, während noch mehrere Sätze gesprochen werden.

Vor dem Render prüfen:

```text
letzte Sprecherphrase 1 → sichtbarer Beat
letzte Sprecherphrase 2 → sichtbarer Beat
letzte Sprecherphrase 3 → sichtbarer Beat
finale Aussage → klarer Endzustand + kurzer Hold
```

Falls die Schlussanimation bereits lange vor dem Voiceover-Ende im Endzustand steht, zusätzliche **semantische** Micro-Beats bauen oder die Progression neu verteilen.

## 8. Pflicht-Review nach jedem neuen Render

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
- **Caption hörbar gegen die echte Stimme prüfen**
- **Szenenwechsel hörbar gegen die echte Stimme prüfen**
- interne Label-Lesbarkeit
- Animation/Caption-Abstand
- leere Flächen
- kleine Card-Inseln
- statische Phasen
- visuelle Energie / markante Momente
- Logo-/Bildanimation, falls solche Assets verwendet werden
- finalen End-Hold

## 9. Post-Render-Korrekturschleife

Wenn der Render einen echten visuellen oder akustischen Fehler zeigt:

```text
Render ansehen/anhören
→ konkrete Ursache in Source/Timing bestimmen
→ prüfen, ob dauerhafte Skill-/Gehirn-Regel fehlt
→ Source/Timing ändern
→ Status auf "Revision implementiert, Rerender erforderlich" setzen
→ neu rendern
→ neuen Render erneut prüfen
```

Ein alter Render darf **nicht** als visuelle Freigabe für eine danach geänderte Source verwendet werden.

Das gilt ausdrücklich auch für reine Caption-Positions-, Caption-Timing-, Szenen-Timing- oder Motion-Änderungen.

## 10. Freigabe-Gate

Nicht `approved`, wenn mindestens eines davon zutrifft:

- erster Moment wirkt leer/unbeabsichtigt
- Hauptvisual zu klein für Smartphone
- kleine Card-Insel in großer ungenutzter Fläche
- wichtige interne Labels zu klein
- mehrere Sekunden neue Sprecherbedeutung ohne sichtbare Reaktion
- Reel wirkt wie Präsentationsfolien statt Motion Design
- Schluss steht sichtbar zu früh still
- Caption liegt sichtbar zu tief im Plattform-/Feed-UI-Bereich
- Caption wurde unter `bottom: 500px` geschoben, um Platz für Visuals zu gewinnen
- Caption oder kritischer Text liegt zu nah an der rechten Feed-Interaktionsleiste
- Caption und Animation konkurrieren
- mehr als 2 Caption-Zeilen stehen gleichzeitig sichtbar
- Production-Caption läuft hörbar vor/hinter der Stimme
- Production-Cues besitzen keine Wort-Timestamps
- Szenenwechsel passen hörbar nicht zum Sprecherwechsel
- wichtiger Inhalt wird vom Clip-Guard abgeschnitten
- neuer Source-Stand wurde nach letzter visueller Prüfung verändert

Ziel ist **maximale visuelle Erklärung pro sinnvoller Bewegung bei sicher lesbarer, hörbar synchroner Caption**.
