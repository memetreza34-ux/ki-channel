# Reels

Die Ordnerfolge ist immer:

`Woche / Wochentag / Reel-Thema`

Ein Reel nutzt dieselbe einfache Produktionsstruktur von `00-cover` bis `06-video` sowie `render` und `timeline`.

## Standard für jedes neue Reel

- 60 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- normalerweise 6 bis 8 Sekunden pro Szene
- Reel vollständig mit Remotion animiert
- keine generierten Szenenbilder
- genau ein separates statisches Cover-Bild
- Cover enthält genau einen klaren deutschen Satz
- Voiceover und Wiedergabe standardmäßig 1,00x
- maximal 1,05x nur nach ausdrücklicher Freigabe
- maximal zwei starke Bewegungen gleichzeitig
- mindestens eine Sekunde ruhiger Ergebnis-Hold
- wichtige Bedeutungsinhalte werden passend animiert
- Füllwörter erhalten keine großen Einzelanimationen
- normale Satzuntertitel mit maximal zwei Zeilen

## Neues Reel anlegen

Technische Befehle aus `alles/` ausführen:

```bash
node scripts/create-future-reel.mjs \
<woche> <wochentag> <slug> \
--title "Titel" \
--hook "Direkter Hook" \
--scenes 8 \
--seconds 65
```

Danach den Standard prüfen:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

## Verbindliche Dokumente

```text
alles/ki/reel-brain/PRODUCTION-BRAIN.md
alles/ki/reel-brain/FUTURE-REEL-STANDARD.md
alles/ki/reel-brain/brain.json
alles/ki/reel-brain/NEW-REEL.md
alles/ki/reel-brain/VALIDATION.md
```

Ältere Reels können noch eine frühere Bild- oder Geschwindigkeitsstrategie verwenden. Diese historischen Werte nicht als Vorlage kopieren.
