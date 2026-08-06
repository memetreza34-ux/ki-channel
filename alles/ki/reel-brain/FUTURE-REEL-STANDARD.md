# Verbindlicher Standard für zukünftige KI-Reels v4

Neue Reels verwenden `ki-animation-only-reel-v4`.

## Untertitel

- immer nur der aktuell gesprochene Satz sichtbar
- vollständiger Satz erscheint sofort
- erster Satz bleibt bis zum Beginn des zweiten Satzes sichtbar
- zweiter Satz bleibt bis zum Szenenende sichtbar
- nur das aktuell gesprochene Wort wird violett
- in Sprechpausen kein Wort markiert
- Satzwechsel an natürlicher Satzpause
- keine Wort-für-Wort-Enthüllung
- keine Fortschrittslinie
- keine große graue Hintergrundbox
- keine Größenänderung oder Bounce
- 48 px Standard, mindestens 44 px
- Unterkante 300 bis 350 px, Standard 320 px
- echte Wortzeiten aus `timeline/final-sync.json`

## Überschrift und Icon

Jede Szene benötigt neben der Überschrift ein eigenes semantisches Vektor-Icon. Das Icon muss das Szenenthema ohne Text vermitteln, auf Smartphone-Größe lesbar bleiben und mit genau einer kleinen Bewegung auf ein relevantes Schlüsselwort reagieren. Generische Glitzer-, Roboter- oder Dekorationssymbole sind nicht ausreichend.

## Animation

```text
1 großes Hauptobjekt
→ 1 dominante Ursache-Wirkung-Bewegung
→ höchstens 2 unterstützende Elemente
→ 1 stabiler Ergebniszustand
```

- Hauptvisual nutzt ungefähr 68 bis 82 Prozent der Animationsfläche
- Szene ist innerhalb von zwei Sekunden verständlich
- wichtige Bewegung startet maximal fünf Frames vom gesprochenen Trigger entfernt
- Ergebnis bleibt mindestens eine Sekunde sichtbar
- keine wiederholte weiße Rahmenbühne
- keine Mini-Dashboards
- keine Ansammlung kleiner blasser Karten als Hauptaussage
- keine rein dekorative Dauerbewegung
- acht Szenen benötigen acht unterscheidbare Mechaniken

## Anti-Wiederholung

Zusätzlich gilt `ANTI-REPETITION-CONTRACT.md`.

- mindestens die letzten zwei vergleichbaren Reels vor dem Coding prüfen
- für jede Szene eine neue Silhouette, Raumlogik, Hauptbewegung und ein neuer Endzustand
- alle `primaryMotion`-Werte innerhalb eines Reels eindeutig
- alle `headingIcon`-Werte innerhalb eines Reels eindeutig
- null zentrale Hauptmechaniken aus dem unmittelbar vorherigen Reel wiederverwenden
- neue Texte, Farben, Richtungen oder Geschwindigkeiten zählen allein nicht als neue Animation
- `05-review/anti-repetition-matrix.md` ist verpflichtend
- konkrete frühere Nutzerkritik wird zum Freigabeblocker

## Produktion

- 1080 × 1920, 30 FPS
- ungefähr 58 bis 70 Sekunden
- 125 bis 145 Wörter
- 8 bis 9 Szenen
- Voiceover und Playback 1,00x
- keine Musik, SFX oder generierten Szenenbilder
- finale Dauer = Sprachende + 1,2 bis 2,2 Sekunden
- finale Zeitquelle ausschließlich `timeline/final-sync.json`
- Platzhalter-Timing darf nur für stumme Vorschauen verwendet werden

## Pflichtprüfung

```bash
node scripts/validate-reel-v4.mjs <reel-ordner> --final
node scripts/validate-reel-animation-novelty.mjs <reel-ordner> --final
```

Danach TypeScript, fokussierte Tests, Smoke-Frames, Animation-Director-Prüfung, Icon-Prüfung, alle Checkpoints, Kontaktbogen, MP4 und Smartphone-Prüfung. Keine Freigabe ohne Nutzerzustimmung.
