# Codex-Auftrag: Referenz-Reel umsetzen

## Auftrag

Setze das vollständige Reel `Warum KI deinen Text anders liest` als hochwertige Remotion-Composition um.

Arbeite ausschließlich im Repository:

```text
memetreza34-ux/ki-channel
```

und ausschließlich auf dem Branch:

```text
feature/sentence-to-motion-system
```

## Sicherheitsregeln

- `main` niemals verändern.
- Pull Request #1 nicht mergen und nicht als bereit markieren.
- Bestehende Tests nicht entfernen, überspringen oder abschwächen.
- Bestehende Motion-System-Compositions nicht löschen oder ersetzen.
- Keine Abhängigkeit hinzufügen, solange die Aufgabe mit vorhandenen Paketen stabil lösbar ist.
- Keine externe API, keine Secrets und keine Netzwerkanfrage zur Renderzeit.
- Keine nichtdeterministischen Animationen.
- Bei einem Testfehler anhalten, Ursache analysieren und gezielt beheben.

## Zuerst lesen

1. `ki/reels/2026-08-04-warum-ki-text-anders-liest/README.md`
2. `ki/reels/2026-08-04-warum-ki-text-anders-liest/reel.json`
3. `ki/reels/2026-08-04-warum-ki-text-anders-liest/voiceover.md`
4. `ki/reels/2026-08-04-warum-ki-text-anders-liest/scene-plan.md`
5. `ki/reels/2026-08-04-warum-ki-text-anders-liest/remotion-plan.md`
6. `ki/reels/animation-history.json`
7. `ki/src/motion-system/PRODUCTION.md`
8. `ki/src/motion-system/ARCHITECTURE.md`

## Ergebnis

Erstelle eine neue Composition:

```text
Reel-WhyAIReadsDifferently
```

mit:

```text
1080 × 1920
30 FPS
1080 Frames
36 Sekunden
```

## Verbindliche visuelle Regeln

- Acht Szenen, acht eindeutige `animationId`s.
- Keine vollständige Stage oder Szenenkomposition zweimal verwenden.
- Keine zwei aufeinanderfolgenden Szenen mit derselben Layoutfamilie.
- Keine Szene darf nur aus Text und einem Fade bestehen.
- Keine Szene darf nur die bestehenden zehn Motion-Stages mit neuen Labels wiederverwenden.
- Kleine Primitives dürfen genutzt und verbessert werden.
- Jede Szene muss den Voiceover-Inhalt auch ohne Ton grundsätzlich erklären.
- Die letzte Form einer Szene soll die erste Form der nächsten Szene vorbereiten.
- Keine universelle Schwarzblende und kein vollständiger visueller Reset zwischen Szenen.
- Heller, hochwertiger Grundstil mit dunkler Typografie und violettem Akzent.
- Nicht kindlich, nicht überladen, keine generische Cyberpunk-Ästhetik.

## Umsetzungsreihenfolge

### 1. Reel-Vertrag laden

- `reel.json` typisieren und validieren.
- Prüfen, dass alle Szenen lückenlos von Frame 0 bis Frame 1080 reichen.
- Prüfen, dass alle `animationId`s eindeutig sind.
- Prüfen, dass mindestens acht visuelle Familien vorhanden sind.

### 2. Dateistruktur erstellen

Nutze die in `remotion-plan.md` definierte Zielstruktur unter:

```text
ki/src/reels/why-ai-reads-differently/
```

### 3. Szenen nacheinander umsetzen

Reihenfolge:

1. `SentenceTokenShatterScene`
2. `TokenVectorScannerScene`
3. `EmbeddingClusterOrbitScene`
4. `AttentionThreadWeaveScene`
5. `NextTokenBranchRaceScene`
6. `TransformerLayerElevatorScene`
7. `AnswerWordAssemblyScene`
8. `BrilliantWrongSplitBalanceScene`

Nach jeder Szene:

- mindestens Start-, Mittel- und Endframe rendern
- Safe-Zones kontrollieren
- Textüberlauf kontrollieren
- Übergang zur nächsten Szene kontrollieren
- keine neue Szene beginnen, solange die aktuelle sichtbar fehlerhaft ist

### 4. Tests erstellen

Mindestens folgende Tests ergänzen:

- alle acht Szenen-IDs vorhanden
- alle acht Animation-IDs eindeutig
- keine Frame-Lücke und keine Überschneidung
- Gesamtdauer exakt 1080 Frames
- alle On-Screen-Texte innerhalb definierter Längen
- keine unbekannte Animation-ID
- deterministische Beispielwerte
- Testframes innerhalb der Composition-Dauer

### 5. Preview registrieren

Registriere `Reel-WhyAIReadsDifferently` in einem Reel-Preview-Bereich, ohne die bisherigen Motion-System-Compositions zu beschädigen.

### 6. Renderbefehle ergänzen

Erstelle oder erweitere Skripte für:

```bash
npm run reel:why-ai:stills
npm run reel:why-ai:video
npm run reel:why-ai:check
```

Erwartete Artefakte:

```text
out/reels/why-ai-reads-differently/stills/*.png
out/reels/why-ai-reads-differently/why-ai-reads-differently.mp4
out/reels/why-ai-reads-differently/release-report.json
```

### 7. Qualitätsprüfung

Vor Abschluss ausführen:

```bash
npm run motion:verify
npm run reel:why-ai:stills
npm run reel:why-ai:video
npm run reel:why-ai:check
```

Danach das gesamte bestehende Release-Gate nicht umgehen:

```bash
npm run motion:full-release-check
```

## Visuelle Abnahme

Die Arbeit ist nicht fertig, nur weil Tests grün sind. Prüfe die Renderbilder und das MP4 auf:

- zu viel leere Fläche
- zu kleine Texte
- unruhige Bewegungen
- wiederholte Fade-/Scale-Muster
- schlechte Blickführung
- harte Szenensprünge
- Objekte außerhalb der Safe-Zone
- Animation ohne erkennbare Verbindung zum Sprechertext
- generisches Kartenlayout
- Frames, die wie unfertige Zwischenstände wirken

## Abschlussbericht

Am Ende dokumentieren:

- geänderte Dateien
- ausgeführte Befehle
- Testergebnisse
- Renderpfade
- erkannte und behobene visuelle Probleme
- noch offene Probleme
- keine Behauptung über erfolgreiche Render, falls sie nicht tatsächlich ausgeführt wurden
