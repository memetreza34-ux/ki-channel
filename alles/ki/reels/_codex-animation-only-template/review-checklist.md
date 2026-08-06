# Review-Checkliste

## Script

- [ ] direkter Hook
- [ ] 125 bis 145 Wörter
- [ ] 8 bis 9 Szenen
- [ ] ein Hauptgedanke pro Szene
- [ ] keine künstlichen Füllsätze

## Audio-first-Synchronisierung

- [ ] finale Audiodatei vorhanden
- [ ] echte Wort- und Satzzeiten vorhanden
- [ ] `timeline/final-sync.json` vorhanden
- [ ] `timingSource` ist `final-voiceover-transcript`
- [ ] `fallbackTimingActive` ist `false`
- [ ] Szenengrenzen aus Satz- oder Sinnpausen abgeleitet
- [ ] größte Szenengrenzen-Abweichung höchstens 6 Frames
- [ ] größte Trigger-Abweichung höchstens 5 Frames
- [ ] erster Untertitel spätestens 3 Frames nach Sprachbeginn
- [ ] finale Composition endet 1,2 bis 2,2 Sekunden nach Sprachende
- [ ] keine künstliche Verlängerung auf eine alte Zielzeit

## Animation

- [ ] Reel vollständig in Remotion animiert
- [ ] keine generierten Szenenbilder
- [ ] ein Hauptobjekt pro Szene
- [ ] maximal zwei unterstützende Elemente
- [ ] eine dominante Hauptbewegung pro Szene
- [ ] maximal zwei starke Bewegungen gleichzeitig
- [ ] ein bis drei Bedeutungsbeats pro Szene
- [ ] mindestens eine Sekunde Ergebnis-Hold
- [ ] keine schnellen Effektketten
- [ ] keine Mini-Dashboards
- [ ] keine kleinen Kartenansammlungen als Hauptvisual
- [ ] keine Emojis als Hauptvisual
- [ ] Hauptvisual groß und auf Smartphone-Größe verständlich
- [ ] keine Animation beginnt vor dem gesprochenen Sinnabschnitt

## Untertitel

- [ ] vollständiger Satz erscheint sofort
- [ ] keine Wort-für-Wort-Einblendung
- [ ] keine Einzelwort-Hervorhebung
- [ ] kein Bounce oder Skalieren des Satzes
- [ ] maximal zwei Zeilen
- [ ] 46 bis 52 px, mindestens 42 px
- [ ] Unterkante zwischen 210 und 235 px
- [ ] genau eine violette Fortschrittslinie
- [ ] Linie läuft mit echter Satzdauer
- [ ] Hauptvisual und Untertitel überlappen nicht

## Cover

- [ ] genau eine statische Bilddatei
- [ ] genau ein Hauptmotiv
- [ ] genau ein deutscher Satz
- [ ] keine Nebenbotschaft
- [ ] Smartphone-Lesbarkeit geprüft

## Technik und Freigabe

- [ ] TypeScript bestanden
- [ ] fokussierte Tests bestanden
- [ ] aktuelle Checkpoint-Frames aus finaler Timeline gerendert
- [ ] Kontaktbogen geprüft
- [ ] aktuelles MP4 vollständig bei normaler Geschwindigkeit angesehen
- [ ] Smartphone-Größe geprüft
- [ ] technische Artefaktprüfung bestanden
- [ ] Nutzerfreigabe vorhanden
