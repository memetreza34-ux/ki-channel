# Prüfung zukünftiger Reels

Neue Reels verwenden `ki-animation-only-reel-v2` und werden vor dem Coding sowie erneut vor dem finalen Render geprüft.

## Planungsprüfung

Aus `alles/`:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

Geprüft werden:

- 125 bis 145 Wörter
- ungefähr 58 bis 70 Sekunden redaktionelles Ziel
- 8 bis 9 Szenen
- 1080 × 1920 bei 30 FPS
- 1,00x bis maximal freigegebene 1,05x
- keine generierten Szenenbilder
- ein Hauptobjekt pro Szene
- maximal zwei unterstützende Elemente
- maximal zwei starke Bewegungen gleichzeitig
- maximal drei Bedeutungsbeats pro Szene
- mindestens eine Sekunde Ergebnis-Hold
- Caption-Modus `instant-full-sentence-with-violet-progress-line`
- Untertitel-Unterkante 210 bis 235 px
- Cover-Vertrag

Die Planungsprüfung akzeptiert ausdrücklich nur als Platzhalter markierte Szenenframes.

## Finale Prüfung

Nach Einfügen und Transkription des Voiceovers:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema> \
--final
```

Zusätzlich zwingend:

- genau eine nicht leere Audio- oder Mediendatei
- `timeline/final-sync.json`
- Status `final-transcript-aligned`
- Zeitquelle `final-voiceover-transcript`
- `fallbackTimingActive: false`
- Audio-Dauer, Sprachbeginn und Sprachende
- finale Composition-Dauer
- Schluss-Hold 1,2 bis 2,2 Sekunden
- lückenlose finale Szenen
- `boundaryReferenceFrame` an jeder inneren Szenengrenze
- größte Szenengrenzen-Abweichung höchstens 6 Frames
- ein bis drei finale Bedeutungsbeats pro Szene
- größte Trigger-Abweichung höchstens 5 Frames
- vollständige Untertitelsätze mit `revealMode: instant`
- keine Wortmarkierung
- genau eine violette Fortschrittslinie
- erster Untertitel spätestens 3 Frames nach Sprachbeginn
- Produktionscode verwendet `StableSentenceCaption`
- Produktionscode verweist auf finale Sync-Daten
- Produktionscode enthält kein `visibleCount`, Wort-für-Wort-Reveal oder Karaoke-System

## Bericht

```text
05-review/future-standard-report.json
```

Der Bericht enthält unter anderem:

- Wortzahl
- Dauer
- Szenenzahl
- größte Trigger-Abweichung
- größte Szenengrenzen-Abweichung
- Schluss-Hold
- alle Fehler und Warnungen

Ein fehlgeschlagener Bericht stoppt den finalen Build. Die Prüfung ersetzt nicht TypeScript, Tests, aktuelle Render, Kontaktbogen, vollständige MP4-Ansicht, Smartphone-Prüfung oder Nutzerfreigabe.
