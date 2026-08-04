# Langfristige Animationsrotation

## Ziel

Abwechslung muss nicht nur innerhalb eines Reels funktionieren. Das System soll auch über viele Reels erkennen, wenn dieselben Animationen, Familien, Layouts oder Bewegungsmuster zu dominant werden.

Der Code liegt in:

```text
ki/src/animation-library/rotationReport.ts
```

## Analysierter Verlauf

`createAnimationRotationReport()` betrachtet standardmäßig die letzten 40 tatsächlich registrierten Szenennutzungen. Das Fenster ist konfigurierbar, aber auf maximal 500 Einträge begrenzt.

Ausgewertet werden:

- vollständige Animation-ID
- visuelle Familie
- Layoutfamilie
- Bewegungssignatur
- Cooldown pro Animation
- Gesamtzahl bisheriger Nutzungen
- erlernte semantische Klarheit
- Katalogstatus einschließlich `retired`

## Konzentrationswarnungen

Das System berechnet für jede Kategorie Anzahl und Anteil im aktuellen Verlaufsfenster.

Beispiele:

```text
eine Animation = 40 % der letzten Szenen → Blocker
eine visuelle Familie = 50 % → Blocker
ein Layout = 25 % → Warnung
eine Bewegungssignatur = 40 % → Blocker
```

Kleine Stichproben lösen nicht sofort starke Blocker aus. Eine Konzentration benötigt mindestens mehrere reale Nutzungen.

## Cooldowns

Eine Animation wird als blockiert gemeldet, wenn:

- sie ausgemustert wurde oder
- ihr `cooldownUntilReelIndex` über dem aktuellen Reel-Index liegt.

Dadurch wird eine gerade verwendete Animation nicht direkt im nächsten Reel erneut empfohlen.

## Empfehlungen

Der Bericht liefert:

- aktuell blockierte Animationen
- noch nie verwendete Animationen
- empfohlene verfügbare Animationen
- unterrepräsentierte visuelle Familien
- Konzentrationswerte pro Animation, Familie, Layout und Bewegung
- konkrete Warnmeldungen
- Gesamtstatus `healthy`

Empfehlungen bevorzugen wenig verwendete Animationen mit hoher erlernter semantischer Klarheit. Inhaltliche Passung muss danach trotzdem vom Szenen- und Reel-Planer bestätigt werden.

## Wichtige Grenze

Der Rotation Report wählt nicht selbst blind eine Animation aus. Er ist ein Langzeit-Gedächtnis und Priorisierungssignal.

Die endgültige Reihenfolge bleibt:

```text
Satz verstehen
→ semantisch passende Kandidaten bestimmen
→ Cooldown und Rotation prüfen
→ abwechslungsreiche Gesamtchoreografie planen
→ bei fehlender Passung neue Animation bauen
```

Neuheit darf niemals eine inhaltlich unpassende Animation erzwingen.

## Tests

```text
ki/src/animation-library/__tests__/rotationReport.test.ts
```

Geprüft werden:

- starke Wiederholung einer Animation
- Überkonzentration einer visuellen Familie
- aktive Cooldowns
- Bevorzugung ungenutzter Animationen
- Priorisierung bisher fehlender Familien
- ungültige Reel-Indizes und Fenstergrößen

## Status

Der Rotationsbericht ist als Code und Testvertrag vorhanden. TypeScript- und Vitest-Erfolg sind noch nicht tatsächlich bestätigt. Reale Empfehlungen werden erst aussagekräftig, sobald mehrere freigegebene Reels echte Nutzungsdaten in das Brain geschrieben haben.
