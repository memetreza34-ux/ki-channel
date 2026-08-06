# Audio-first-Synchronisationsvertrag v3

## Einzige Reihenfolge

```text
Voiceover bei 1,00x
→ Wort-Transcript
→ Satzpaare
→ Szenengrenzen
→ Bedeutungs-Trigger
→ Composition-Dauer
→ Render
```

## `timeline/final-sync.json`

Finale Reels verwenden nur diese Datei. Für jede Szene enthält sie ein `captionPair` mit exakt zwei Sätzen. Jeder Satz enthält seine vollständige Wortliste mit `startFrame` und `endFrame`.

## Untertitel-Synchronisation

- beide Sätze sind während des gesamten Paars sichtbar
- aktives Wort: `startFrame <= frame < endFrame`
- während einer Sprechpause ist kein Wort aktiv
- Farbe des aktiven Wortes: Violett
- keine Fortschrittslinie
- keine Änderung der Wortgröße

## Animations-Synchronisation

Nur zentrale Sinnabschnitte lösen Animationen aus. Jeder Beat enthält `expression`, `transcriptStartFrame`, `animationStartFrame` und `resultFrame`. `animationStartFrame` darf höchstens fünf Frames vom echten Wortbeginn abweichen.

## Szenen

Szenenwechsel werden aus Satz- und Sinnpausen berechnet. Die letzte Szene endet 1,2 bis 2,2 Sekunden nach dem letzten gesprochenen Wort.

## Verboten

- Audio in eine feste Timeline legen
- gleichmäßig verteilte Wörter als final bezeichnen
- lokale Fallback-Frames nach dem Transcript verwenden
- Untertitel anhand der Szenendauer statt echter Wortzeiten animieren
- alte Checkpoints nach einer Sync-Änderung wiederverwenden
