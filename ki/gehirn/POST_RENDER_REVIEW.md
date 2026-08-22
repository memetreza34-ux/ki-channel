# Post-Render Review — verbindliche Reel-Qualität

Diese Datei ergänzt `ki/gehirn/REELS.md`, `ki/gehirn/CAPTION_SAFE_POSITION.md`, `ki/reels/AGENTS.md` sowie die Skills `ki/skills/entertainment-first-reels/SKILL.md`, `ki/skills/high-energy-remotion-reels/SKILL.md` und `ki/skills/voice-locked-captions/SKILL.md` für **jede** finale Reel-Runde.

Ein sauberer Source-Code reicht nicht. Ein Reel ist erst visuell freigabefähig, wenn der tatsächlich gerenderte MP4 auf normaler Geschwindigkeit und auf Smartphone-/Feed-Größe geprüft wurde.

## 1. Kein leerer Einstieg

Der Zuschauer soll ab dem ersten Moment erkennen, dass etwas passiert.

- Frame 0 darf ruhig sein, aber nicht wie eine versehentlich leere weiße Fläche wirken.
- Das erste Hauptvisual soll sofort schwach sichtbar sein oder innerhalb der ersten ungefähr `0.2–0.4 s` eindeutig erscheinen.
- Keine lange Intro-Fade, kein Logo-Pre-Roll, kein dekoratives Warten vor dem Inhalt.
- Hook-Audio und erster visueller Zustand beginnen als ein gemeinsamer Moment.
- Bei konkretem Produkt-/Feature-Thema soll der Hook möglichst innerhalb der ersten `1–2 s` ohne Ton grob erkennen lassen, worum es geht.

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
- mindestens ein markanter visueller Hero-Moment pro Szene
- Kamera, Parallax, pseudo-3D, Transformation, Masken, SVG-Pfade, gerichtete Partikel/Flows oder kinetische Schlüsselwörter aktiv prüfen, wenn sie die Aussage verbessern
- nicht jede Szene mit identischer mittiger Frontal-Komposition bauen

Nicht einfach zusätzliche Deko hinzufügen. Wenn der Render langweilig wirkt, zuerst **Komposition, Objektgröße, Zustandswechsel, Mini-Story und räumliche Dynamik** verbessern.

Nicht freigeben, wenn sich das Reel wie eine PowerPoint mit sanften Fade-ins anfühlt.

## 5. Entertainment-First / Product-UI-Review

Bei konkreten Apps, Websites, Plattformen oder Features prüfen:

- zeigt das Reel die Produktoberfläche / Interaktion, wenn dies die Aussage klarer erklärt?
- wurde echte UI bewusst gegen abstrakte Metapher abgewogen?
- wirkt das Produkt konkret oder könnte dieselbe Animation beliebig für zehn andere Themen verwendet werden?
- besitzt jede Szene sichtbar **Setup → Aktion → Konsequenz → Payoff**?
- gibt es pro Szene einen Frame, der als eigenständiger Hero-Moment funktioniert?

### Warnsignale

- Kreis mit Text in der Mitte als wiederholter Default
- mehrfach kleine Karten nebeneinander ohne räumliche Progression
- generische `ENGINE`-/Node-Grafik, obwohl eine konkrete UI-Situation möglich wäre
- Headline + kleine Mechanik + riesige weiße Fläche
- fünf Szenen, die im Contact Sheet wie Varianten derselben Folie aussehen

### Entertainment-Score

`06-projektdateien/ENTERTAINMENT-REVIEW.md` muss nach dem Review erneut bewertet werden.

Ziel:

- mindestens **8/10**
- keine Kategorie `0`

Unter 8/10 ist das Reel nicht freigabefähig, selbst wenn technische Tests bestehen.

## 6. Markenassets, Bilder und Screenshots

Wenn ein echtes lokales Logo, Markenasset, Bild oder Screenshot inhaltlich relevant ist:

- Markenrichtlinien haben Vorrang vor dekorativer Motion
- Markenlogo nie ungenau aus Erinnerung nachbauen
- offizielles Asset exakt und nur im zulässigen Rahmen verwenden
- bei strengen Brand-Regeln primär Container, Position, Kamera, Hintergrund, UI und Übergang um das **unveränderte** Asset animieren
- Bilder/Screenshots über Fokus-Zoom, Crop-Travel, 2.5D, Parallax, Cutout-Layer, Cursor/Touch oder native Overlays in die Erklärung integrieren
- bei Screenshots relevante Bereiche gezielt hervorheben/isolieren statt das komplette Bild passiv stehen zu lassen

### OpenAI-spezifisch

Bei offiziellen OpenAI-Markenassets keine Verformung, kein Crop, keine Verwendung als Maske, keine unzulässige Variante und keine verbotenen Effekte/Texturen auf der Marke.

Wenn kein zulässiges offizielles Asset lokal vorliegt: kein Fake-Logo zeichnen.

Ein Ken-Burns-Zoom allein gilt bei zentralen Bildassets nicht als ausreichend, wenn mehr semantische Animation möglich ist.

## 7. Voice-Lock — Caption und Szene müssen zur echten Stimme passen

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

## 8. Schluss muss bis zur letzten Aussage tragen

Die letzte Szene darf nicht früh „fertig aussehen“, während noch mehrere Sätze gesprochen werden.

Vor dem Render prüfen:

```text
letzte Sprecherphrase 1 → sichtbarer Beat
letzte Sprecherphrase 2 → sichtbarer Beat
letzte Sprecherphrase 3 → sichtbarer Beat
finale Aussage → klarer Endzustand + kurzer Hold
```

Falls die Schlussanimation bereits lange vor dem Voiceover-Ende im Endzustand steht, zusätzliche **semantische** Micro-Beats bauen oder die Progression neu verteilen.

## 9. Pflicht-Review nach jedem neuen Render

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
- Product-/UI-Nähe bei konkreten Tools/Apps/Features
- Markenrichtlinien bei verwendeten Logos
- finalen End-Hold

## 10. Contact-Sheet- und Scrub-Gate

Nach jedem relevanten Review-Render zusätzlich:

1. Frames in regelmäßigen Abständen als Contact Sheet betrachten.
2. Reel schnell durchscrubben, zunächst auch ohne Ton.
3. Prüfen, ob Szenen wirklich unterschiedliche Bildzustände besitzen.

Nicht freigeben, wenn:

- mehrere Contact-Sheet-Frames fast gleich aussehen, obwohl neue Aussagen gesprochen werden
- dieselbe Card-/Kreis-Komposition in fast jeder Szene wiederkehrt
- die Caption sichtbar mehr „erzählt“ als die Animation
- der Hook ohne Ton keinerlei konkrete Produkt-/Themeninformation liefert, obwohl das Thema visuell konkret darstellbar wäre

## 11. Post-Render-Korrekturschleife

Wenn der Render einen echten visuellen oder akustischen Fehler zeigt:

```text
Render ansehen/anhören
→ konkrete Ursache in Source/Timing bestimmen
→ Entertainment-Score + Product/UI-Entscheidung erneut prüfen
→ prüfen, ob dauerhafte Skill-/Gehirn-Regel fehlt
→ Source/Timing ändern
→ Status auf "Revision implementiert, Rerender erforderlich" setzen
→ neu rendern
→ neuen Render erneut prüfen
```

Ein alter Render darf **nicht** als visuelle Freigabe für eine danach geänderte Source verwendet werden.

Das gilt ausdrücklich auch für reine Caption-Positions-, Caption-Timing-, Szenen-Timing- oder Motion-Änderungen.

## 12. Freigabe-Gate

Nicht `approved`, wenn mindestens eines davon zutrifft:

- erster Moment wirkt leer/unbeabsichtigt
- Hauptvisual zu klein für Smartphone
- kleine Card-Insel in großer ungenutzter Fläche
- wichtige interne Labels zu klein
- mehrere Sekunden neue Sprecherbedeutung ohne sichtbare Reaktion
- Reel wirkt wie Präsentationsfolien statt Motion Design / UI-Cinema
- Produkt-/Feature-Thema bleibt unnötig generisch, obwohl konkrete UI besser erklären würde
- keine klare Mini-Story / kein Payoff in mehreren Szenen
- Entertainment-Score unter 8/10 oder eine Kategorie 0
- Contact Sheet zeigt zu wenig visuelle Variation
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
- Markenasset wurde verfälscht oder Brand-Guidelines ignoriert
- neuer Source-Stand wurde nach letzter visueller Prüfung verändert

Ziel ist **maximale visuelle Erklärung + Entertainment pro sinnvoller Bewegung bei sicher lesbarer, hörbar synchroner Caption**.
