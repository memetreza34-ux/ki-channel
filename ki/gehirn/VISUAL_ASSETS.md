# Visual Assets — Produktionsstandard

## Ziel

Reels bleiben **native-first**, nutzen aber gezielt echte Visuals, wenn ein reales Bild, Produkt, Gerät, Ort, Server, Chip, Interface oder anderes Motiv die Aussage schneller verständlich oder glaubwürdiger macht.

Bewährter Richtwert aus den Apple-Messages- und Codex-Transfer-Tests:

- ungefähr **70–80 % Remotion-native UI / Text / Diagramm / Motion**
- ungefähr **20–30 % echte Bilder oder Screens**, typischerweise **1–2 starke externe Visual-Momente pro Reel**
- Standard-Hard-Max: **2 externe Binärvisuals pro Reel**
- `0` ist ausdrücklich erlaubt, wenn kein echtes Bild einen erklärenden Mehrwert bringt
- mehr als `2` nur bewusst über `reel.visuals.maxExternalBinaries` und nach Review
- kein Stockbild nur zum Füllen

`validate-reel-visual-assets.mjs` erzwingt diesen Standard-Hard-Max jetzt technisch. Ohne expliziten Override in `reel.json` bricht der Production-Gate bei mehr als zwei externen Binärvisuals ab.

Der Grundsatz ist: **ein starkes echtes Bild ist besser als mehrere mittelmäßige Füllbilder**.

## Erlaubte Quellen

Automatischer Kern:

1. `NATIVE_UI`
2. `OFFICIAL_SOURCE_CARD`
3. `WIKIMEDIA_COMMONS`
4. `GITHUB_RAW`

Google-Bildersuche ist **niemals Lizenznachweis** und wird nicht als automatischer Produktionsprovider verwendet.

## Wikimedia Commons

`resolve-reel-visual-assets.mjs` sucht mehrere Kandidaten und filtert zuerst hart nach:

- erlaubter Lizenz: `CC0-1.0`, `PUBLIC_DOMAIN`, `CC-BY-4.0`
- JPEG / PNG / WebP
- Mindestauflösung

Danach werden die Kandidaten **deterministisch gerankt**. Bewertet werden:

- semantische Übereinstimmung zwischen Suchbegriff und Titel/Beschreibung
- Suchrang
- Auflösung
- Crop-/Seitenverhältnis-Eignung
- Lizenzstatus
- negative Punkte für Logo/Icon/Diagramm/Map/Screenshot, wenn ein echtes Foto gewünscht ist
- negative Punkte für extreme Panorama-/Hochkant-Verhältnisse

Public Domain und CC0 werden bevorzugt, sofern die visuelle Qualität vergleichbar ist. Das reduziert unnötige On-Screen-Credits.

Der Gewinner und die Top-Kandidaten werden in `visual-assets-resolved.json` gespeichert. Damit ist nachvollziehbar, **warum genau dieses Bild ausgewählt wurde**.

## GitHub Raw

Nur erlaubt, wenn im Manifest vorhanden:

- exakte `raw.githubusercontent.com` URL
- voller 40-Zeichen-Commit-SHA
- deklarierte erlaubte Lizenz
- konkrete GitHub-Lizenzquelle

Keine Repository-weite Lizenzvermutung.

## Lokaler Render

Externe Bilder werden **vor dem Remotion-Render** heruntergeladen nach:

`public/reel-assets/<compositionId>/...`

Der Render selbst darf keine Remote-Media-URL verwenden.

`visual-assets-resolved.json` enthält u. a.:

- lokale Datei
- `staticFile`-Pfad
- SHA256
- MIME
- Quelle
- Lizenz
- Attribution, falls erforderlich
- bei Commons: Auswahlscore + Top-Kandidaten

`validate-reel-visual-assets.mjs` prüft die lokale Datei erneut gegen SHA256.

## Rendering

`ReelExternalVisual.tsx` ist die Standardkomponente für echte Bilder:

- `object-fit: cover`
- definierter Fokuspunkt
- kontrollierter Push-In
- leichter Pan
- kein Remote-Src

On-Screen-Credit wird standardmäßig nur erzwungen, wenn die Lizenz ihn verlangt (`CC-BY-4.0`). Bei Public Domain / CC0 bleibt die Herkunft vollständig im Manifest dokumentiert, ohne unnötigen Textbalken im Bild.

## Motion-Bausteine

`ReelVisualMotion.tsx` enthält die nach echten Render-Tests akzeptierten Bausteine:

- `CameraPush`
- `FocusHalo`
- `ScanSweep`
- `ParallaxFloat`
- `SourceProofCard`

Focus-Halos bleiben bewusst dezent: sie sollen den Blick lenken und nicht wie Editor-Markierungen aussehen.

## Ablauf pro Reel

1. Phase 1 entscheidet pro Szene: `NATIVE_UI`, `OFFICIAL_SOURCE_CARD`, `WIKIMEDIA_COMMONS` oder `GITHUB_RAW`.
2. Für externe Bilder Suchbegriff + Zweck + optional Auswahlpräferenzen definieren.
3. Standardmäßig höchstens 2 externe Binärvisuals verwenden; nur bei echtem Mehrwert erhöhen.
4. `node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>`
5. `node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>`
6. Nur lokale `staticFile`-Assets im Remotion-Source verwenden.
7. Nach Render bei 1x prüfen: Relevanz, Crop, Lesbarkeit, Bewegung, Überladung.

## Auswahlpräferenzen im Manifest

Optional für Wikimedia:

```json
{
  "selection": {
    "minimumLongEdge": 1400,
    "minimumShortEdge": 800,
    "preferredOrientation": "LANDSCAPE",
    "mediaIntent": "PHOTO_OR_REAL_VISUAL",
    "preferPublicDomainOrCC0": true,
    "candidateLimit": 20
  }
}
```

`preferredOrientation`: `AUTO`, `PORTRAIT`, `LANDSCAPE`, `SQUARE`.
