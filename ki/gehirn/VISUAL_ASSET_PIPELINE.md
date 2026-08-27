# Kanonische Visual-Asset-Pipeline — KI-Reels

## Ziel

Externe Bilder, Screens und Open-Source-Assets dürfen Reels visuell stärker machen, aber nie die Produktionssicherheit zerstören. Remotion rendert **ausschließlich lokale Assets** oder Remotion-native UI. Kein Render-Time-Hotlinking.

## Reihenfolge

1. **NATIVE_UI** — präzise UI, Diagramme, Text, Zahlen und Zustände direkt in Remotion bauen.
2. **OFFICIAL_SOURCE_CARD** — eine offizielle Quelle als kleine Beleg-/Authentizitätsfläche darstellen, ohne eine komplette fremde Seite zu kopieren.
3. **GITHUB_RAW** — Open-Source-Asset nur mit Repository, Commit/Ref und Lizenzangabe.
4. **DIRECT_HTTPS** — nur wenn Quelle + Nutzungsrecht in `visual-assets.json` dokumentiert und lokal gecacht wurden.

Google-Bildersuche ist **keine Lizenzquelle** und darf niemals allein die Nutzungsfreigabe begründen.

## Pro Reel

`06-projektdateien/visual-assets.json` ist der Vertrag.

Jeder Eintrag braucht mindestens:

- `id`
- `sceneId`
- `provider`
- `purpose`
- `renderMode`
- `rightsStatus`
- `sourceUrl` wenn extern

Erlaubte Provider im automatischen Pfad:

- `NATIVE_UI`
- `OFFICIAL_SOURCE_CARD`
- `GITHUB_RAW`
- `DIRECT_HTTPS_REVIEWED`

## Rechte

Automatisch akzeptierbar:

- `CC0-1.0`
- `PUBLIC_DOMAIN`
- `CC-BY-4.0` nur wenn Attribution im Manifest vorhanden ist
- `MIT` / `Apache-2.0` für tatsächlich lizenzierte Repo-Assets
- `NATIVE_ORIGINAL`
- `OFFICIAL_SOURCE_REFERENCE` für kleine native Source-Proof-Karten, die nur Quelle/Datum/kurze Paraphrase zeigen

Nicht automatisch akzeptierbar:

- `UNKNOWN`
- `GOOGLE_SEARCH_RESULT`
- Social-Media-Reuploads ohne Ursprungsnachweis
- Stock-/Brandbilder ohne dokumentierte Lizenz oder Review

## Rendering

Externe Binärassets werden vor dem Render unter `public/reel-visuals/<reelId>/` lokal vorbereitet. Der Ordner bleibt regenerierbar/ignored.

Remotion darf keine `http://` oder `https://` Bildquelle direkt rendern.

## Qualitätsregel

Ein externes Bild wird nur verwendet, wenn es mindestens einen dieser Zwecke erfüllt:

1. beweist die Quelle,
2. zeigt ein reales Produkt/Interface, das native Nachbauen schlechter erklären würde,
3. erhöht die visuelle Abwechslung ohne Informationsverlust.

Kein Asset nur als Dekoration hinzufügen, wenn es die Szene unruhiger macht.
