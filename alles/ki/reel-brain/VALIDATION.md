# Prüfung zukünftiger Reels

Für jedes neu erstellte Reel wird der globale Animationsstandard vor dem Coding und erneut vor der Freigabe geprüft.

## Planungsprüfung

Aus dem Ordner `alles/`:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

Geprüft werden unter anderem:

- 125 bis 145 Wörter
- 60 bis 70 Sekunden geplante Dauer
- 8 bis 9 Szenen
- 1080 × 1920 bei 30 FPS
- Standard-Wiedergabe zwischen 1,00x und maximal 1,05x
- keine generierten oder hybriden Szenenbilder
- maximal zwei starke Bewegungen gleichzeitig
- maximal vier Bedeutungsbeats pro Szene
- mindestens eine Sekunde Ergebnis-Hold
- normale Satzuntertitel
- semantische Beat-Map
- Cover-Vertrag

## Finale Prüfung

Nach dem Einfügen des Voiceovers und Erzeugen der echten Wortzeiten:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema> \
--final
```

Zusätzlich geprüft werden:

- genau eine finale Audio- oder Mediendatei in `02-audio/`
- finale Transcript- beziehungsweise Wortzeitdatei

Der Bericht wird geschrieben nach:

```text
05-review/future-standard-report.json
```

Ein fehlgeschlagener Bericht stoppt den Build. Warnungen müssen gelesen und dokumentiert werden. Die Prüfung ersetzt nicht TypeScript, Tests, Render, Kontaktbogen, vollständige MP4-Ansicht oder Nutzerfreigabe.
