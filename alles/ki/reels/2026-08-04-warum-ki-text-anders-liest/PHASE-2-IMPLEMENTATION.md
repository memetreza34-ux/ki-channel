# Phase 2 – individuelle Remotion-Umsetzung

## Status

Der vollständige Remotion-Code ist implementiert und als Composition `Reel-WhyAIReadsDifferently` registriert. Ein echter Typecheck, Testlauf und Render wurden in dieser Umgebung noch nicht ausgeführt. Die Composition bleibt deshalb im Prüfstatus.

## Umgesetzte Choreografie

Jede der acht Szenen besitzt eine eigene vollständige Animation:

1. `sentence-token-shatter-v1` – geschlossener Satz, Wortgrenzen, räumliches Zerlegen und Übergabe an den Scanner
2. `token-vector-scanner-v1` – transparente Scannerkammer, Scanbalken, Token-zu-Vektor-Umwandlung und Punktauflösung
3. `embedding-cluster-orbit-v1` – deterministische räumliche Begriffscluster mit leichter Kameradrehung
4. `attention-thread-weave-v1` – gewichtete SVG-Verbindungen, Pfadaufbau und pulsierende starke Beziehungen
5. `next-token-branch-race-v1` – drei unterschiedliche Pfade, deterministische Prozentverläufe und spätes Gewinner-Signal
6. `transformer-layer-elevator-v1` – vertikale Modellschichten mit sichtbarer Veränderung pro Ebene
7. `answer-word-assembly-v1` – Wörter kommen aus verschiedenen Tiefen und rasten ohne Typewriter-Cursor ein
8. `brilliant-wrong-split-balance-v1` – Antwort teilt sich, Waage kippt und endet mit der Prüfaufforderung

## Überschriften und Untertitel

- Jede Szene besitzt eine feste obere Überschrift innerhalb der Safe-Zone.
- Der Sprechtext wird unten als kinetischer Untertitel aufgebaut.
- Alle Wörter besitzen manuelle Frame-Cues.
- Inhaltlich wichtige Wörter erhalten stärkere Skalierung, Farbe und Lichtreaktion.
- Risikowörter wie `falsch` und `versteht` werden separat als Warnung choreografiert.
- Maximal zwei kompakte Textbereiche sind gleichzeitig aktiv: Szenenüberschrift oben und Sprechtext unten.

## Übergänge

Zwischen den acht Szenen werden sieben unterschiedliche Übergänge verwendet:

- Scanner-Wipe
- Punkt-Tunnel
- Thread-Pull
- Branch-Flash
- Layer-Lift
- Word-Stream
- Split-Fold

Die Übergänge übernehmen jeweils eine Form oder Bewegungsrichtung aus der vorherigen Szene. Es gibt keinen vollständigen visuellen Reset zwischen den Szenen.

## Sounddesign

`SynthSoundtrack.tsx` erzeugt kurze deterministische WAV-Soundeffekte direkt aus Code. Dadurch sind keine externen Binärdateien oder fremden Soundbibliotheken nötig.

Enthalten sind unter anderem:

- tiefer Hook-Impact
- Token-Bruch und magnetische Klicks
- Scanner-Sweeps
- räumliche Datenbewegungen
- Attention-Pulse
- Probability-Ticks
- Layer-Hums
- Wort-Klicks
- Warn- und Abschlussakzente

Eine echte Voiceover-Datei ist noch nicht eingecheckt. Die Composition akzeptiert optional `voiceoverSrc`, damit eine finale Sprachspur später synchron ergänzt werden kann.

## Zusätzliche erklärende Animationen

Neben den direkt gesprochenen Aussagen wurden bewusst unterstützende Animationen ergänzt:

- Mensch-gegen-Maschine-Leselogik in Szene 1
- Token-Indizes und feste Beispielvektoren
- Nähe-Legende im Bedeutungsraum
- sichtbare Attention-Gewichte
- Alternativkandidaten bei der Wortauswahl
- Hinweis `Muster – kein menschliches Verständnis`
- transparente Ausgabealternativen
- Quellenwarnung und Wahrheit-vs.-Sicherheit-Kontrast

Diese Elemente sollen den Inhalt verständlicher machen, ohne dekorative B-Roll oder unpassende Standardanimationen einzusetzen.

## Codepfad

```text
ki/src/reels/why-ai-reads-differently/
├── contract.ts
├── visualUtils.ts
├── ReelWhyAIReadsDifferently.tsx
├── index.ts
├── components/
├── scenes/
└── __tests__/
```

## Prüfkommandos

Zuerst nur Syntax, Reel-Verträge und TypeScript prüfen:

```bash
npm run reel:why-ai:verify
```

Danach schnelle Testbilder:

```bash
npm run reel:why-ai:smoke
```

Vollständige 32 Prüfbilder, MP4 und technischer Bericht:

```bash
npm run reel:why-ai:full-release-check
```

Erwartetes technisches Endergebnis:

```text
out/reels/why-ai-reads-differently/release-report.json
33/33 gültige Artefakte
```

Die technische Prüfung ersetzt nicht die visuelle Kontrolle von Textüberlauf, Choreografie, Rhythmus, Lautstärke und inhaltlicher Verständlichkeit.
