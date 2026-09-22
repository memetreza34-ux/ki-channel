# Fakten & Quellen — Grounding vor Veröffentlichung

Diese Datei regelt, wie Aussagen für den KI-Kanal belegt, aktualisiert und im Reel sichtbar gemacht werden.

Ziel: keine scheinpräzisen Zahlen, veralteten Produktbehauptungen, erfundenen Quellen oder zu absoluten Vereinfachungen.

## 1. Jede relevante Aussage bekommt einen Typ

Vor dem finalen Script relevante Claims klassifizieren:

- `EVERGREEN` — grundlegendes Konzept, das nicht kurzfristig verfällt
- `CURRENT` — aktuelle Nachricht, Version, Markt-/Produktzustand
- `VENDOR_CLAIM` — Aussage eines Herstellers über sein Produkt
- `MEASURED` — selbst gemessener/aus einem Test stammender Wert
- `ILLUSTRATIVE` — bewusst erfundener Demo-Wert nur zur Erklärung
- `INFERENCE` — begründete Einordnung, nicht direkt als Fakt aus einer Quelle übernommen

Je aktueller oder messbarer eine Aussage ist, desto strenger muss die Quelle sein.

## 2. Quellenhierarchie

Bevorzugt:

1. offizielle Dokumentation / technische Spezifikation / Primärquelle
2. offizieller Changelog / Release Note / Herstellerankündigung
3. Paper / Standard / Originaldatensatz
4. seriöse Sekundärquelle mit nachvollziehbarer Primärgrundlage
5. Community/Reddit nur für Erfahrungen, Stimmung oder reproduzierbare Hinweise — nicht als alleinige Quelle für harte Fakten

Hersteller-Marketing darf als Hersteller-Claim zitiert werden, aber nicht automatisch als unabhängig bewiesene Leistung behandelt werden.

## 3. Source Ledger ist Pflicht bei V2-Reels

`06-projektdateien/source-ledger.md` enthält mindestens:

```text
Claim-ID
Claim / genaue Aussage
Typ
Quelle / Titel
URL oder Repo-/Datei-Referenz
Veröffentlicht / aktualisiert
Geprüft am
Primärquelle: JA/NEIN
Was genau die Quelle stützt
Unsicherheit / Einschränkung
Recheck nötig vor Publish: JA/NEIN
Status: VERIFIED | QUALIFIED | REMOVE
```

Nicht jede triviale Formulierung braucht einen Eintrag. Jede sichtbare Zahl, aktuelle Produktbehauptung, konkrete Quelle, Ranking-Aussage oder fachlich kritische Vereinfachung schon.

## 4. Aktuelle KI-/Tool-Themen

Bei folgenden Aussagen **immer aktuell prüfen**:

- Preise
- Plan-/Abo-Namen
- Limits und Credits
- Feature-Verfügbarkeit
- unterstützte Länder/Sprachen/Plattformen
- Modellnamen
- Benchmarks
- Release-Status
- Nutzungsrechte
- API-/Produktverhalten, wenn es sich geändert haben kann

Ein altes Reel darf deshalb nicht blind als Faktenquelle für ein neues Reel dienen.

## 5. Sichtbare Zahlen

Eine Zahl im finalen Bild braucht genau einen dieser Zustände:

### Verifiziert

Quelle/Messung im Ledger vorhanden.

### Klar illustrativ

Wenn nur ein Mechanismus demonstriert wird, muss die Zahl visuell als Beispiel erkennbar sein, z. B. `Beispiel`, `vereinfacht` oder ohne scheinbare Messpräzision.

### Entfernen

Wenn weder echte Grundlage noch klare illustrative Kennzeichnung vorhanden ist.

Nicht erlaubt:

- erfundene Prozentwerte, die wie Modellwahrscheinlichkeiten aussehen
- erfundene Sekundenwerte, die wie gemessene Latenz wirken
- Rankings ohne Quelle
- „X-mal besser/schneller“ ohne nachvollziehbare Grundlage

## 6. Vereinfachung ohne falsches Mentalmodell

Ein Reel darf vereinfachen, aber nicht so stark, dass der Zuschauer ein falsches Grundmodell lernt.

Prüffragen:

- Wurde aus „kann“ versehentlich „immer“?
- Wurde aus einem bestimmten System pauschal „KI“?
- Wurde Tool-/Web-/Retrieval-Nutzung mit einem isolierten Sprachmodell vermischt?
- Wird ein Beispiel als allgemeingültiger Mechanismus dargestellt?
- Wird Korrelation als Ursache verkauft?

Wenn eine Einschränkung für das richtige Verständnis nötig ist, gehört sie ins Script — nicht nur in interne Notizen.

## 7. Quellen im sichtbaren Video

Quellenangaben müssen lesbar und ehrlich sein.

- keine erfundenen Paper-/Autorennamen als real wirkende Belege
- Demo-Quellen klar als Beispiel markieren
- bei realen Quellen Namen/Jahr nur zeigen, wenn sie tatsächlich geprüft wurden
- keine URL-Wand im Reel; ausführlichere Links können in Beschreibung/Projektdatei liegen
- ein Screenshot einer Quelle ist kein Beweis, wenn der Screenshot nicht zur behaupteten Aussage passt

## 8. REAL_CAPTURE und Screenshots

Bei echter Produktoberfläche dokumentieren:

- Capture-Datum
- Produkt/Version/Plan, soweit relevant
- welche Aussage der Capture belegt
- ob sich UI oder Feature bis Veröffentlichung ändern kann

Vor Publish erneut prüfen, wenn das Feature schnelllebig ist.

## 9. Recheck vor Veröffentlichung

Claims mit `Recheck nötig vor Publish: JA` werden direkt vor dem finalen Release noch einmal geprüft.

Typische Recheck-Fälle:

- News
- Preise
- Produktlimits
- Modell-/Feature-Verfügbarkeit
- aktuelle Rankings
- laufende Betas

Wenn sich die Fakten geändert haben, zurück zu Script/Visuals statt veralteten Inhalt zu veröffentlichen.

## 10. Stop-Gate

Nicht freigeben bei:

- ungeklärter sichtbarer Zahl
- erfundener real wirkender Quelle
- aktueller Produktbehauptung ohne aktuelle Prüfung
- Quelle, die die konkrete Aussage nicht trägt
- kritischer Vereinfachung, die ein falsches Mentalmodell erzeugt
- `REMOVE`-Claim, der noch im Script/Render vorkommt

Wahrheit hat Vorrang vor einer stärkeren Hook-Formulierung.
