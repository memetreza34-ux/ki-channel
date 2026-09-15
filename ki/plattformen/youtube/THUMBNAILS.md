# YouTube Thumbnails / Covers

## Ziel

Das Thumbnail soll **eine** klare Idee verkaufen, die das Video tatsächlich liefert. Kein visuelles Rätsel, keine Fake-Dramatik.

## Kanalstil

- faceless
- heller Premium-Editorial-Look
- dunkler Haupttext
- gezielter Marken-Lila-Akzent `#B98CFF`
- `#6E45C9` für Tiefe/Kontrast
- wenige große Elemente
- klare Silhouette
- starke Lesbarkeit auf kleiner Darstellung

## Aufbau

Bevorzugt:

```text
1 Hauptobjekt / Hauptkonflikt
+ 1 unterstützendes Element
+ optional 2–5 kurze Wörter
```

Nicht gleichzeitig Titel, Erklärung, viele Icons, Pfeile und mehrere konkurrierende Motive verwenden.

## Longform v1

Neue Longform-v1-Pakete planen in `03-thumbnail/THUMBNAIL-PLAN.json` mindestens **drei deutlich unterschiedliche Konzepte A/B/C**.

Die Varianten sollen unterschiedliche visuelle Ideen testen, nicht nur minimale Farb- oder Positionsänderungen. Erst nach Review wird `selectedVariant` gesetzt und die ausgewählte Fassung als `05-export/thumbnail-selected.png` exportiert.

## Text

Thumbnail-Text ist optional. Wenn Text nötig ist:

- sehr kurz
- ergänzt den YouTube-Titel statt ihn 1:1 zu kopieren
- keine langen Sätze
- keine kleinen Unterzeilen

## Bild-KI

Bei generierten Thumbnail-Assets gelten die Qualitätsprinzipien aus `ki/BILDSTIL.md`, aber die Komposition wird an das konkrete YouTube-Cover angepasst.

Generierte Bilder enthalten standardmäßig **keinen eingebrannten Text**. Typografie wird kontrolliert separat gesetzt.

Generierte Thumbnail-Visuals dürfen kreativ sein, aber keine falsche Produktfunktion, reale Person, reale Zahl oder realen Vorgang als dokumentarischen Fakt vortäuschen.

## Verboten

- erkennbare Gesichter als notwendiges Clickbait-Mittel
- generische Roboterköpfe
- Cyberpunk-/Neon-Klischee
- rote Kreise/Pfeile ohne echte Funktion
- falsche UI-Screenshots
- erfundene Zahlen
- Logo-/Markenmissbrauch
- Aussage, die im Video nicht geliefert wird

## Qualitätsgate

Vor Freigabe prüfen:

- Idee in sehr kleiner Darstellung erkennbar
- eindeutiger Fokus
- Titel und Thumbnail ergänzen sich
- Varianten sind tatsächlich unterschiedlich
- kein Text abgeschnitten
- keine zufällige KI-Schrift
- keine Wasserzeichen
- fachlich wahr
- visuell konsistent mit dem Kanal
- ausgewählte Variante hält exakt das Video-Versprechen ein
