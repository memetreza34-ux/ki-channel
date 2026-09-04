# Visual Assets — Produktionsstandard

## Ziel

Reels bleiben **native-first**, nutzen aber gezielt echte Visuals, wenn Logo, Wordmark, Produkt-UI, reales Bild, Gerät, Ort, Server, Chip, Interface oder Video die Aussage schneller verständlich, glaubwürdiger oder markentypischer macht.

Richtwert:

- ungefähr **70–80 % Remotion-native UI / Text / Diagramm / Motion**
- ungefähr **20–30 % echte Bilder, UI oder Screens**
- v4 branded/current-news: lieber **2–3 starke purposeful real/official Momente** als viele Füllbilder
- kein Stockmaterial nur zum Füllen
- externer Binär-Hard-Max bleibt über `reel.visuals.maxExternalBinaries` bewusst steuerbar

## Erlaubte Produktionsprovider

Bevorzugte Reihenfolge:

1. `NATIVE_UI`
2. `LOCAL_OFFICIAL_MEDIA`
3. `OFFICIAL_SOURCE_CARD`
4. `WIKIMEDIA_COMMONS`
5. `GITHUB_RAW`

Google-Bildersuche ist **niemals Lizenznachweis** und wird nicht als automatischer Produktionsprovider verwendet.

## LOCAL_OFFICIAL_MEDIA — echte Logos, Wordmarks und Produkt-UI

Dieser Provider schließt die bisherige Brand-Lücke.

Er ist für bereits **lokal vorhandene** offizielle Assets gedacht:

- Logo
- Wordmark
- Produkt-UI
- offizieller Screenshot
- offizielles Produktbild

Der Provider lädt **nichts automatisch herunter**.

Das Asset wird zuerst lokal unter dem jeweiligen Reel abgelegt, z. B.:

```text
02-bilder/
└── brand-assets/
    └── google-wordmark.png
```

Manifest-Beispiel:

```json
{
  "id": "scene1-google-wordmark",
  "sceneId": "scene1",
  "provider": "LOCAL_OFFICIAL_MEDIA",
  "renderMode": "LOCAL_OFFICIAL_IMAGE",
  "purpose": "Echte Google-Brand-Fidelity im Cover",
  "sourceFile": "02-bilder/brand-assets/google-wordmark.png",
  "sourceUrl": "https://official.example/press-kit",
  "sourceKind": "PRESS_KIT",
  "assetRole": "WORDMARK",
  "rightsStatus": "OFFICIAL_SOURCE_REFERENCE",
  "usageReviewNote": "Offizieller lokaler Press-Kit-Export; Brand-/Trademark-Nutzung manuell geprüft."
}
```

Erlaubte `sourceKind`:

- `PRESS_KIT`
- `OFFICIAL_WEBSITE`
- `OFFICIAL_PRODUCT_UI`
- `USER_PROVIDED_OFFICIAL_EXPORT`

Erlaubte `assetRole`:

- `LOGO`
- `WORDMARK`
- `PRODUCT_UI`
- `SCREENSHOT`
- `PRODUCT_IMAGE`

Der Resolver prüft:

- Datei liegt wirklich unter `02-bilder/`
- kein Symlink / kein Path-Escape
- JPEG / PNG / WebP anhand Dateiinhalts
- Größe max. 20 MB
- offizielle HTTPS-Quell-URL vorhanden
- Source-Kind + Asset-Rolle erlaubt
- `usageReviewNote` vorhanden

Danach wird das Asset nach:

`public/reel-assets/<compositionId>/...`

kopiert und per SHA256 gebunden.

`manualRightsReviewRequired: true` bleibt im aufgelösten Manifest erhalten.

Wichtig: `OFFICIAL_SOURCE_REFERENCE` dokumentiert Herkunft. Es ist **keine automatische pauschale Rechtsfreigabe**.

## OFFICIAL_SOURCE_CARD

Bleibt ein nativer Remotion-Proof mit Quellen-URL. Es kopiert keine Remote-Webseite als Binärbild und zählt deshalb nicht als echtes lokal materialisiertes Logo/UI-Asset.

## Wikimedia Commons

`resolve-reel-visual-assets.mjs` sucht mehrere Kandidaten und filtert hart nach:

- `CC0-1.0`, `PUBLIC_DOMAIN`, `CC-BY-4.0`
- JPEG / PNG / WebP
- Mindestauflösung

Danach deterministisches Ranking nach Relevanz, Suchrang, Auflösung, Crop-Eignung und Lizenz. Public Domain / CC0 werden bevorzugt, wenn Qualität vergleichbar ist.

Der Gewinner und Top-Kandidaten werden in `visual-assets-resolved.json` gespeichert.

## GitHub Raw

Nur erlaubt mit:

- exakter `raw.githubusercontent.com` URL
- voller 40-Zeichen-Commit-SHA
- deklarierter erlaubter Lizenz
- konkreter GitHub-Lizenzquelle

Keine Repository-weite Lizenzvermutung.

## Lokaler Render

Der Render selbst darf keine Remote-Media-URL verwenden.

`visual-assets-resolved.json` enthält je nach Provider:

- lokale Datei
- `staticFile`-Pfad
- SHA256
- MIME
- Quelle
- Lizenz-/Provenance-Status
- Attribution, falls erforderlich
- bei Commons: Auswahlscore + Top-Kandidaten
- bei `LOCAL_OFFICIAL_MEDIA`: Source-Kind, Asset-Rolle, Usage-Review und manuelles Rights-Review-Flag

`validate-reel-visual-assets.mjs` prüft lokale Dateien erneut gegen SHA256.

## Brand-Regel

Bei Markenstories:

- echtes lokales offizielles Logo/Wordmark/UI-Asset bevorzugen, wenn sauber vorhanden;
- klare Typografie ist besser als eine falsche Rekonstruktion;
- Funktionsicons dürfen Marken nie imitieren;
- echte Brand-Assets sollen nicht nur im Plan stehen, sondern vor Production-Render materialisiert sein oder eine dokumentierte Ausnahme haben.

## Ablauf pro Reel

1. Phase 1 entscheidet pro Szene: native Motion, lokales offizielles Brand/UI-Asset, Source-Proof, Commons/GitHub oder echtes Video.
2. Brand/Motion Director prüft offizielle Asset- und Farbquellen.
3. Offizielle lokale Dateien unter `02-bilder/` ablegen und im Manifest als `LOCAL_OFFICIAL_MEDIA` registrieren.
4. `node ki/scripts/resolve-reel-visual-assets.mjs <reel-package-dir>`
5. `node ki/scripts/validate-reel-visual-assets.mjs <reel-package-dir>`
6. Nur lokale `staticFile`-Assets im Remotion-Source verwenden.
7. Nach Render bei 1x prüfen: Brand-Erkennbarkeit, Farbtreue, Relevanz, Crop, Lesbarkeit, Bewegung, Überladung.

## Rendering

`ReelExternalVisual.tsx` bleibt Standardkomponente für echte Bilder. Neue v4-Reels dürfen zusätzlich eigene Brand-/UI-spezifische Compositing-Komponenten bauen, wenn diese den Story-Beat besser lösen.

Die Shared Library ist **keine Animations-Whitelist**. Neue Motion-Techniken sind erlaubt, wenn sie Story, Lesbarkeit, Determinismus, Performance und QA bestehen.
