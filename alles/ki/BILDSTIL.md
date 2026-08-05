# KI-Kanal — Bildstil

## Ziel

Der Kanal erklärt **KI-Tools, KI-Konzepte und KI-News verständlich**. Die Bilder müssen deshalb nicht nur gut aussehen, sondern den gesprochenen Satz **inhaltlich korrekt, einfach und sofort verständlich** wiedergeben.

Der Bildstil ist:

> **Hochwertige, vereinfachte 3D-Editorial-Illustrationen mit realen Alltagssituationen, klarer visueller Aussage und wenigen deutschen Objektbeschriftungen.**

Keine Fantasiewelt. Keine Cyberpunk-Optik. Keine überladene Infografik. Keine rein dekorativen KI-Bilder.

---

## Aufgabenverteilung: Bild-KI und Remotion

### Remotion übernimmt

- Überschriften
- Untertitel und Sprechertext-Hervorhebungen
- Zahlen und Statistiken
- Pfeile und Verbindungslinien
- Karten und einfache Prozessdiagramme
- Logos und Icons
- Zooms, Fokuswechsel und Markierungen
- einfache Vergleiche und Schrittfolgen
- Einblendungen und Übergänge

### Die Bild-KI übernimmt

- komplexe räumliche 3D-Szenen
- stilisierte Alltagssituationen ohne erkennbare Gesichter
- visuelle Metaphern
- zusammenhängende Objektgruppen
- Szenen, die Remotion nicht sinnvoll aus einfachen Komponenten bauen kann
- hochwertige 3D-Objekte mit Licht, Schatten, Material und Perspektive

**Wichtig:** Die Bild-KI soll nicht dieselben Dinge bauen, die Remotion besser und sauberer animieren kann.

---

## Grundregel für jeden Satz

Bevor ein Bildprompt geschrieben wird, muss der Satz visuell übersetzt werden.

### Schritt 1: Kernaussage bestimmen

Frage:

> Was soll der Zuschauer nach diesem Satz sofort verstehen?

### Schritt 2: Eine klare Bildidee wählen

Nur eine dieser Strukturen verwenden:

- Ursache → Wirkung
- Vorher → Nachher
- Problem → Lösung
- Mensch → KI-Unterstützung
- Eingabe → Verarbeitung → Ergebnis
- Vergleich zweier Situationen
- eine klare Alltagsszene

### Schritt 3: Bild auf das Wesentliche reduzieren

- maximal 3 bis 5 Hauptobjekte
- maximal 1 klare Aussage
- maximal 1 Szene oder 2 klar getrennte Bereiche
- keine unnötigen Dekorationen
- keine kleinen Details, die auf dem Smartphone nicht erkennbar sind

---

## Feste Stilregeln

### Hintergrund

- weiß oder sehr hellgrau
- sauber und ruhig
- keine dunklen Räume
- keine Cyberpunk-Hintergründe
- keine futuristischen Städte

### Formen und Materialien

- hochwertige, vereinfachte 3D-Formen
- weich, rund und modern
- leicht isometrische Perspektive
- weiche realistische Schatten
- klare Tiefenwirkung
- reale Objektfarben
- Marken-Lila `#B98CFF` nur als gezielter KI- oder Fokus-Akzent
- dunkleres Marken-Lila `#6E45C9` nur für Kontrast, Tiefe oder Schatten innerhalb des KI-Fokus
- Grün nur für Vorteil/Lösung, Rot nur für Grenze/Risiko/Fehler

### Faceless-Regel

Der Kanal bleibt vollständig faceless.

- keine sichtbaren oder erkennbaren Gesichter
- keine Face-Cam-Optik
- keine realistisch porträtierten Personen
- falls eine Alltagsszene zwingend eine Person braucht: nur von hinten, seitlich ohne Gesicht, angeschnitten oder als vereinfachte gesichtslose 3D-Figur
- Hände, Körperhaltungen und Silhouetten sind erlaubt, wenn sie die Aussage wirklich verständlicher machen
- keine Person nur als Dekoration einsetzen

### Komposition

- wenige große Objekte
- klare Hierarchie
- großzügige Abstände
- sofort auf dem Smartphone verständlich
- das wichtigste Objekt steht klar im Fokus
- kein visuelles Chaos

### Safe-Zones für Remotion

Die generierte Illustration muss Platz für die festen Remotion-Ebenen lassen.

- Format immer `1080 × 1920` im Hochformat `9:16`
- oben mindestens etwa `96 px` ruhige, freie Fläche für die wechselnde Kopfzeile
- unten mindestens etwa `195 px` ruhige, freie Fläche für Untertitel
- keine wichtigen Objekte, Beschriftungen, Gesichter, Hände oder Ergebnisse in diese Bereiche setzen
- Hauptmotiv bevorzugt im mittleren sicheren Bereich platzieren
- bei Vollbildmotiven die wichtigsten Inhalte so anordnen, dass Remotion bei `objectFit: cover` nichts Entscheidendes abschneidet
- keine sichtbaren Safe-Zone-Linien, Positionshinweise oder Layout-Markierungen in das Bild rendern

### Deutsche Beschriftungen

Beschriftungen sind erlaubt, wenn sie direkt zu einem Objekt gehören und für das Verständnis notwendig sind.

Regeln:

- nur kurze deutsche Begriffe
- maximal 1 bis 3 Beschriftungen pro Bild
- maximal 1 bis 3 Wörter pro Beschriftung
- keine Überschrift im Bild
- keine langen Erklärungssätze
- keine englischen Labels
- keine winzige Schrift
- keine Beschriftung, die Remotion besser darüberlegen kann
- Beschriftungen niemals in der oberen Kopfzeilen- oder unteren Caption-Zone platzieren

Beispiele für gute Beschriftungen:

- „Aufgabe“
- „Werkzeuge“
- „Ergebnis“
- „Echte Daten“
- „Erfundene Ergänzung“
- „Aktueller Kontext“
- „Alte Information“

---

## Verboten

- erkennbare Gesichter oder Face-Cam-Szenen
- realistische Porträts
- Roboter nur als Dekoration
- Neon-Cyberpunk
- dunkle Technikräume
- Sci-Fi-Labore ohne echten inhaltlichen Grund
- große Datenzentren ohne Bezug zum Satz
- reine Karten-und-Pfeile-Infografiken
- zu viele Boxen
- zu viele Icons
- zu viele Pfeile
- kleine technische Details
- komplizierte Abläufe in einem einzigen Bild
- lange Texte im Bild
- englische Beschriftungen
- Überschriften im generierten Bild
- wichtige Inhalte in Kopfzeilen- oder Caption-Zonen
- sichtbare Layout-Hinweise, Safe-Zone-Markierungen oder Prompt-Anweisungen im Bild
- generische „KI sieht futuristisch aus“-Motive
- Bilder, die nur schön sind, aber den Satz nicht erklären

---

## Masterprompt

```text
Erstelle eine hochwertige stilisierte 3D-Editorial-Illustration im vertikalen Format 9:16 und in einer Komposition für 1080 × 1920.

Die Illustration soll genau eine komplexe Aussage aus dem Bereich Künstliche Intelligenz durch eine einfache, sofort verständliche visuelle Szene erklären.

Zeige eine reale oder leicht stilisierte Alltagssituation mit wenigen großen 3D-Objekten. Verwende keine rein abstrakte Infografik und keine Fantasiewelt.

Der Kanal ist vollständig faceless:
keine erkennbaren Gesichter,
keine Face-Cam-Optik,
keine realistischen Porträts.
Falls eine Person zwingend nötig ist, nur von hinten, seitlich ohne sichtbares Gesicht, angeschnitten oder als vereinfachte gesichtslose 3D-Figur darstellen.

Die Szene muss auch ohne Überschrift verständlich sein.

Verwende maximal 3 bis 5 Hauptobjekte.
Verwende maximal 1 bis 3 kurze deutsche Objektbeschriftungen direkt an den passenden Elementen.
Keine langen Texte.
Keine Überschrift.
Keine englischen Begriffe.
Keine unnötigen Pfeile.
Keine komplizierten Prozesskarten.

Lasse oben mindestens etwa 96 px ruhige freie Fläche für die Remotion-Kopfzeile und unten mindestens etwa 195 px ruhige freie Fläche für Untertitel.
Platziere keine wichtigen Objekte oder Beschriftungen in diesen Bereichen.
Das Hauptmotiv soll vollständig im mittleren sicheren Bereich liegen.
Keine sichtbaren Safe-Zone-Linien oder Layout-Hinweise rendern.

Visueller Stil:
weißer oder sehr hellgrauer Hintergrund,
hochwertige vereinfachte 3D-Editorial-Illustration,
weiche realistische Schatten,
runde moderne Formen,
leicht isometrische Perspektive,
reale Objektfarben,
Marken-Lila #B98CFF nur als gezielter KI- oder Fokus-Akzent,
dunkleres Marken-Lila #6E45C9 nur für Tiefe oder Kontrast,
klare Tiefenwirkung,
wenige große Elemente,
großzügige Abstände,
modern, ruhig und auf einem Smartphone sofort verständlich.

Vermeide:
Cyberpunk,
Neon-Technikwelt,
dunkle Räume,
Roboter als Dekoration,
Fantasiewelten,
überladene Infografiken,
zu viele Karten,
zu viele Pfeile,
kleine Details,
englische Labels,
lange Texte,
Überschriften im Bild,
erkennbare Gesichter,
Porträts,
wichtige Inhalte in den oberen oder unteren Safe-Zones.
```

---

## Beispiel 1 — KI-Agent erledigt eine Aufgabe

### Kernaussage

Ein KI-Agent erhält eine Aufgabe, nutzt passende Werkzeuge und liefert ein fertiges Ergebnis.

### Bildprompt

```text
Erstelle eine hochwertige stilisierte 3D-Editorial-Illustration im vertikalen Format 9:16 für 1080 × 1920.

Zeige eine klare Arbeitssituation:

In der Mitte befindet sich ein kompaktes, modernes KI-Modul in Marken-Lila #B98CFF. Vor dem Modul liegt eine ungeordnete Aufgabe aus mehreren Dokumenten, einer E-Mail und einer kleinen Checkliste.

Neben dem KI-Modul stehen drei unterschiedliche Arbeitswerkzeuge: ein Browserfenster, ein Kalender und ein Dateiordner.

Auf der anderen Seite liegt ein sauber abgeschlossenes Ergebnis: ein fertiges Dokument mit gesetztem Haken.

Die Szene soll ohne Überschrift verständlich zeigen:
Die KI erhält eine Aufgabe, wählt passende Werkzeuge aus und liefert selbstständig ein Ergebnis.

Nur diese kurzen deutschen Objektbeschriftungen direkt an den passenden Elementen verwenden:

„Aufgabe“
„Werkzeuge“
„Ergebnis“

Keine Überschrift.
Keine Erklärungssätze.
Keine Pfeile.
Keine klassische Infografik.
Keine Roboterfigur.
Keine erkennbare Person und kein Gesicht.
Keine futuristische Umgebung.
Keine dunkle Cyberpunk-Optik.

Oben etwa 96 px und unten etwa 195 px ruhig und frei lassen. Alle wichtigen Objekte und Beschriftungen im mittleren sicheren Bereich platzieren. Keine Safe-Zone-Linien rendern.

Stil:
hochwertige vereinfachte 3D-Editorial-Illustration,
weißer Hintergrund,
weiche realistische Schatten,
runde Premium-Formen,
leicht isometrische Perspektive,
reale Objektfarben,
Marken-Lila #B98CFF ausschließlich am KI-Modul,
klare räumliche Anordnung,
wenige große Elemente,
auf einem Smartphone sofort verständlich.
```

---

## Beispiel 2 — Warum KI halluziniert

### Kernaussage

Wenn Informationen fehlen, kann eine KI eine glaubwürdig wirkende, aber falsche Ergänzung erzeugen.

### Bildprompt

```text
Erstelle eine hochwertige vertikale 3D-Editorial-Illustration im Format 9:16 für 1080 × 1920.

Zeige eine einzelne klare Szene:

In der Mitte steht ein stilisiertes KI-Modul mit Marken-Lila #B98CFF. Links liegen mehrere echte Informationsquellen: Dokumente, Bilder und Datenkarten. Einige Informationen erreichen das KI-Modul vollständig, an einer Stelle fehlt jedoch sichtbar ein wichtiges Puzzleteil.

Rechts erzeugt das KI-Modul eine überzeugend aussehende Antwort. Ein Teil der Antwort besteht aus echten Informationsbausteinen, ein anderer Teil wird durch ein neu eingesetztes, aber falsches Puzzleteil ergänzt.

Die Bildaussage muss ohne Überschrift verständlich sein:
Die KI ergänzt fehlende Informationen manchmal selbst und kann dadurch eine falsche Antwort erzeugen.

Keine Überschrift.
Keine langen Texte.
Keine Prozesskarten.
Keine klassischen Diagramme.
Keine Pfeile.
Keine zusätzlichen Infografik-Elemente.
Keine Menschen und keine Gesichter.

Nur zwei kurze deutsche Objektbeschriftungen direkt in der Szene:

„Echte Daten“
„Erfundene Ergänzung“

Oben etwa 96 px und unten etwa 195 px ruhig und frei lassen. Alle wichtigen Objekte und Beschriftungen im mittleren sicheren Bereich platzieren. Keine Safe-Zone-Linien rendern.

Visueller Stil:
hochwertige stilisierte 3D-Illustration,
weißer oder sehr hellgrauer Hintergrund,
weiche Schatten,
runde Premium-Formen,
Marken-Lila #B98CFF nur am KI-Modul oder zentralen Fokus,
reale Farben für Dokumente und Objekte,
klare Tiefenwirkung,
leicht isometrische Perspektive,
modern, ruhig und sofort verständlich,
keine Roboterfigur,
keine Cyberpunk-Optik,
keine Fantasiewelt,
vertikal 9:16.
```

---

## Beispiel 3 — KI hat keine echte Erinnerung

### Kernaussage

Eine KI arbeitet nur mit dem Kontext, den sie aktuell sehen kann. Ältere Informationen können verloren gehen.

### Bildprompt

```text
Erstelle eine hochwertige vertikale 3D-Editorial-Illustration im Format 9:16 für 1080 × 1920.

Zeige eine klare Szene:

In der Mitte steht ein stilisiertes KI-Modul in Marken-Lila #B98CFF. Vor dem Modul liegen mehrere einzelne Gesprächskarten wie lose Blätter auf einem Tisch. Einige ältere Gesprächskarten verblassen, lösen sich auf oder fallen aus dem sichtbaren Bereich heraus.

Eine neue Nachricht kommt von links hinzu. Das KI-Modul verarbeitet nur die aktuell sichtbaren Gesprächskarten. Eine ältere wichtige Information liegt weiter hinten und ist nicht mehr mit dem KI-Modul verbunden.

Die Bildaussage soll ohne Überschrift sofort verständlich sein:
Die KI arbeitet nur mit dem Kontext, den sie aktuell sehen kann. Alte Informationen können verloren gehen.

Keine Überschrift.
Keine langen Texte.
Keine klassischen Prozesskarten.
Keine Pfeile.
Keine Diagramme.
Keine UI-Screenshots.
Keine Menschen und keine Gesichter.

Nur diese kurzen deutschen Objektbeschriftungen direkt in der Szene:

„Aktueller Kontext“
„Alte Information“
„Neue Nachricht“

Oben etwa 96 px und unten etwa 195 px ruhig und frei lassen. Alle wichtigen Objekte und Beschriftungen im mittleren sicheren Bereich platzieren. Keine Safe-Zone-Linien rendern.

Visueller Stil:
hochwertige stilisierte 3D-Illustration,
weißer oder sehr hellgrauer Hintergrund,
weiche realistische Schatten,
runde Premium-Formen,
Marken-Lila #B98CFF nur als KI- oder Fokus-Akzent,
dunkle gut lesbare deutsche Schrift,
klare Tiefenwirkung,
leicht isometrische Perspektive,
ruhige moderne Bildungsillustration,
wenige große Objekte,
sofort auf dem Smartphone verständlich,
keine Roboterfigur,
keine Cyberpunk-Optik,
keine Fantasiewelt,
keine überladene Infografik.
```

---

## Beispiel 4 — Gute und schlechte Prompts

### Kernaussage

Ein klarer Prompt mit Kontext und Beispiel führt zu einem besseren Ergebnis als eine unklare Anweisung.

### Bildprompt

```text
Erstelle eine hochwertige stilisierte 3D-Editorial-Illustration im vertikalen Format 9:16 für 1080 × 1920.

Zeige eine klare Gegenüberstellung mit zwei Bereichen.

Links liegt eine kurze, unklare Eingabe neben einem unfertigen oder verwirrenden Ergebnis. Die Objekte wirken unsortiert und unvollständig.

Rechts liegt eine strukturierte Eingabe mit klar sichtbarem Kontext und einem Beispiel. Darunter entsteht ein deutlich hochwertigeres und vollständiges Ergebnis.

Die Bildaussage soll ohne Überschrift sofort verständlich sein:
Eine klare Aufgabe mit Kontext und Beispiel führt zu einem besseren Ergebnis.

Keine Überschrift.
Keine langen Erklärungssätze.
Keine klassische Infografik aus vielen Karten.
Keine unnötigen Pfeile.
Keine englischen Beschriftungen.
Keine Menschen und keine Gesichter.

Nur diese drei kurzen deutschen Objektbeschriftungen verwenden:

„Unklar“
„Kontext + Beispiel“
„Besseres Ergebnis“

Oben etwa 96 px und unten etwa 195 px ruhig und frei lassen. Alle wichtigen Objekte und Beschriftungen im mittleren sicheren Bereich platzieren. Keine Safe-Zone-Linien rendern.

Visueller Stil:
weißer Hintergrund,
hochwertige vereinfachte 3D-Editorial-Illustration,
weiche realistische Schatten,
runde moderne Formen,
leicht isometrische Perspektive,
reale Objektfarben,
Marken-Lila #B98CFF nur als gezielter Fokus-Akzent,
klare Trennung der beiden Bereiche,
wenige große Elemente,
auf einem Smartphone sofort verständlich,
keine Cyberpunk-Optik,
keine Fantasiewelt,
keine Roboterfigur.
```

---

## Qualitätsprüfung vor Verwendung

Ein Bildprompt ist nur gut, wenn alle Fragen mit **Ja** beantwortet werden:

1. Erklärt das Bild genau den gesprochenen Satz?
2. Ist die Kernaussage innerhalb einer Sekunde erkennbar?
3. Enthält das Bild nur eine Aussage?
4. Sind höchstens 3 bis 5 Hauptobjekte vorhanden?
5. Sind die Beschriftungen kurz und auf Deutsch?
6. Fehlt eine Überschrift im Bild?
7. Sind keine Elemente enthalten, die Remotion besser erstellen kann?
8. Ist das Bild auf einem Smartphone gut lesbar?
9. Ist die Szene real, verständlich und nicht fantasievoll?
10. Wird Marken-Lila #B98CFF gezielt und nicht überall eingesetzt?
11. Bleibt die Szene vollständig faceless, ohne erkennbare Gesichter oder Porträts?
12. Sind die obere Kopfzeilen- und untere Caption-Zone frei von wichtigen Inhalten?
13. Sind keine sichtbaren Layout-Hinweise, Safe-Zone-Linien oder Prompt-Anweisungen im Bild?

Wenn eine Antwort **Nein** ist, muss der Prompt vereinfacht werden.
