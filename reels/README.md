# Reels

Ordnerfolge:

```text
Woche / Wochentag / Reel-Thema
```

## Standard für jedes neue Reel

Neue Reels verwenden `ki-animation-only-reel-v2`:

- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- vollständig in Remotion animiert
- keine generierten Szenenbilder
- ein separates statisches Cover mit einem Satz
- Voiceover und Wiedergabe bei 1,00x
- keine Musik und keine Soundeffekte
- ein Hauptobjekt und eine Hauptbewegung pro Szene
- maximal drei Bedeutungsbeats pro Szene
- vollständige Satzuntertitel erscheinen sofort
- genau eine violette Linie läuft synchron zur Satzdauer
- Untertitel-Unterkante 210 bis 235 px

## Wichtig: Audio bestimmt die Timeline

Die beim Anlegen erzeugten Frames sind nur Platzhalter.

Nach dem finalen Voiceover muss Codex:

```text
Audio transkribieren
→ timeline/final-sync.json erzeugen
→ Szenengrenzen ersetzen
→ Animationstrigger ersetzen
→ Untertitel ersetzen
→ finale Videolänge berechnen
```

Die finale Composition endet 1,2 bis 2,2 Sekunden nach dem letzten gesprochenen Wort. Sie wird nicht künstlich auf eine alte Zielzeit verlängert.

## Neues Reel anlegen

Aus `alles/`:

```bash
node scripts/create-future-reel.mjs \
<woche> <wochentag> <slug> \
--title "Titel" \
--hook "Direkter Hook" \
--scenes 8 \
--seconds 64
```

Planung prüfen:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

Nach Audio und `final-sync.json`:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema> \
--final
```

## Verbindliche Dokumente

```text
alles/ki/reel-brain/PRODUCTION-BRAIN.md
alles/ki/reel-brain/FUTURE-REEL-STANDARD.md
alles/ki/reel-brain/AUDIO-FIRST-SYNC-CONTRACT.md
alles/ki/reel-brain/brain.json
alles/ki/reel-brain/VALIDATION.md
```

Historische v1-Reels bleiben bestehen, dürfen aber nicht als Vorlage für neue Produktionen kopiert werden.
