# Bildprompts

## Gemeinsamer Stilanker

Alle vier Motive müssen dieselbe visuelle Welt besitzen:

```text
premium simplified 3D editorial illustration, sophisticated technology explainer aesthetic, near-white studio background, dark graphite materials, restrained violet accent light, subtle warm gray shadows, clean geometric forms, high-end product visualization, realistic soft global illumination, crisp edges, controlled depth, uncluttered composition, vertical 9:16 framing, central safe area for motion graphics, no people, no hands, no faces, no robots, no readable text, no logos, no watermark, no UI labels, no decorative particle cloud
```

### Negative Prompt für alle Bilder

```text
humans, hands, faces, body parts, android, humanoid robot, glowing brain, cyberpunk city, blue neon overload, random particles, illegible text, gibberish letters, logos, brands, watermark, subtitles, infographic labels, flat clipart, childish cartoon, Pixar character, busy background, lens flare, extreme bloom, low contrast, black background, generic laptop mockup
```

### Technische Vorgaben

- Seitenverhältnis: 9:16
- bevorzugte Ausgabe: mindestens 1536 × 2730 Pixel
- keine eingebauten Überschriften oder Untertitel
- Hauptobjekte nicht am äußersten Rand abschneiden
- freier Bereich oben für Überschrift
- freier Bereich unten für Untertitel
- Remotion ergänzt alle Texte, Pfeile, Zahlen, Risse, Labels und Diagramme

---

## Bild 1 — überzeugende, aber instabile Antwort

**Datei:** `assets/images/scene-01-confident-answer.png`

### Prompt

```text
A premium simplified 3D editorial illustration of a single elegant transparent glass answer panel floating in a clean near-white studio. The panel looks authoritative and highly polished, with subtle layered abstract lines inside suggesting a fluent AI answer, but no readable text. A refined violet confidence halo surrounds the panel. The lower third of the glass contains only a hairline structural tension, almost invisible, leaving room for an animated crack overlay later. Dark graphite support geometry, soft realistic shadow underneath, balanced centered composition, high-end technology explainer aesthetic, generous empty space above and below, vertical 9:16, no people, no hands, no logos, no readable text.
```

### Kompositionshinweise

- Glasplatte zentral bei ungefähr 50 % Bildhöhe
- oben mindestens 280 Pixel ruhiger Raum
- unten mindestens 350 Pixel ruhiger Raum
- Confidence-Halo darf nicht vollständig geschlossen sein; Remotion baut ihn fertig
- keine sichtbaren roten Risse im Ausgangsbild

### Remotion-Verwendung

- Bild als flache Basis
- subtiler Parallax zwischen Hintergrund und Glas über Masken/Clipping möglich
- Confidence-Ring, Riss, `NICHT BELEGT` und Glassplitter ausschließlich in Remotion

---

## Bild 3 — Maschine füllt eine Quellenlücke

**Datei:** `assets/images/scene-03-pattern-gap-machine.png`

### Prompt

```text
A premium simplified 3D editorial cutout of an abstract AI pattern-filling machine, isolated on a transparent background. The machine has one clearly visible empty central slot, a left input channel, a clean right output tray, and three smaller side feeders containing distinct geometric pattern tiles. Materials are matte graphite, frosted white, and restrained violet. The design communicates transformation and assembly without resembling a factory robot. Front three-quarter view, crisp silhouette, separated components suitable for masking, no readable text, no logos, no people, no hands, no cables crossing the silhouette, high-end product visualization, transparent background, vertical composition.
```

### Kompositionshinweise

- echtes transparentes PNG bevorzugt
- zentraler leerer Slot muss deutlich sichtbar sein
- linke Eingabe und rechte Ausgabe räumlich getrennt
- drei Seitenkanäle erkennbar, aber nicht überladen
- keine eingebaute Karte mit Text

### Remotion-Verwendung

- Maschine als Cutout
- Wortchip, Quellenkanal, Musterteile, Pressbewegung und Ausgabekarte werden in Remotion ergänzt
- leichte Tiefenbewegung nur während des Pressvorgangs

---

## Bild 4 — vier riskante Dokumentarten

**Datei:** `assets/images/scene-04-risk-documents.png`

### Prompt

```text
A premium simplified 3D editorial illustration of four distinct floating document objects arranged in an open square formation on a near-white studio background. Top left: an abstract identity record card with a blank portrait placeholder and no personal data. Top right: a clean numerical report sheet with abstract bars but no readable numbers. Bottom left: a research paper object with neutral diagram shapes and no logo. Bottom right: a current-news card with a blank date area and no brand. Objects are elegant, realistic, clearly separated, slightly angled toward the camera, dark graphite and soft white materials with restrained violet details, generous negative space between them for animated labels and focus frames, vertical 9:16, no people, no hands, no readable text, no logos.
```

### Kompositionshinweise

- vier Objekte dürfen sich nicht überlappen
- Mitte frei lassen für Risikomesser
- oben und unten sichere Textbereiche erhalten
- Dokumente sollten visuell verschieden sein
- Nachrichtendokument braucht eine klar leere Datumsfläche

### Remotion-Verwendung

- Fokusrahmen springt zwischen den vier Bildregionen
- Labels, Datumsprüfung, Risikomesser und Warnrahmen in Remotion
- kein generischer Kamerazoom auf das Gesamtbild

---

## Bild 8 — Prüfdesk ohne Menschen

**Datei:** `assets/images/scene-08-verification-desk.png`

### Prompt

```text
A premium simplified 3D editorial verification desk without people, shown in a clean near-white studio. Three clearly separated stations are arranged from left to right: a floating answer-card holder, a central source-document inspection window with layered paper and a blank date strip, and a right-side verified-result tray. The stations are connected by subtle physical rails but contain no labels or readable text. Materials are graphite, frosted white, and restrained violet; the result tray has only a very subtle neutral green accent that can be intensified later. Strong separation between foreground objects and background, controlled depth, plenty of empty space above for a headline and below for subtitles, high-end technology explainer aesthetic, vertical 9:16, no people, no hands, no logos, no readable text.
```

### Kompositionshinweise

- drei Stationen müssen visuell klar getrennt sein
- Antwortkarte links darf nicht bereits grün sein
- Quellenfenster mittig braucht eine sichtbare Maskenfläche
- Ergebnisfach rechts benötigt Platz für Remotion-Badge
- keine eingebauten Haken, Texte oder Pfeile

### Remotion-Verwendung

- Aussagekarte und drei Gates werden zusätzlich gebaut
- Quellenfenster wird per Maske geöffnet
- Datum, Dokumentstatus, Beleg-Token und `GEPRÜFT` werden in Remotion gerendert
- zweite ungeprüfte Karte wird als Remotion-Objekt ergänzt

---

## Qualitätskontrolle vor Verwendung

Jedes erzeugte Bild wird abgelehnt, wenn:

- Text oder Fantasieschrift eingebaut ist
- Hände, Menschen oder Roboter sichtbar sind
- das Hauptobjekt die Headline- oder Untertitelzone blockiert
- violette Neonbeleuchtung den gesamten Kontrast übernimmt
- das Motiv nur dekorativ ist und keine klare Funktion besitzt
- wichtige Teile am Rand abgeschnitten sind
- die vier Bilder sichtbar unterschiedliche Stile verwenden
