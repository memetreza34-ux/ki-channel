# Phase 2 – individuelle Remotion-Umsetzung

## Status

Der vollständige Remotion-Code ist implementiert und als Composition `Reel-WhyAIReadsDifferently` registriert.

`npm run reel:why-ai:verify`, `npm run reel:why-ai:smoke`, `npm run reel:why-ai:stills`, `npm run reel:why-ai:video`, `npm run reel:why-ai:check`, `npm run reel:why-ai:full-release-check` und `npm run motion:verify` wurden tatsächlich ausgeführt und sind grün. Details siehe Prüfprotokoll unten und `review-checklist.md`.

Bei der Prüfung wurden folgende echte Fehler gefunden und an der Ursache behoben:

- `vitest.config.ts` enthielt `ki/**` nicht im `include`-Pattern, wodurch die drei eigenen Reel-Tests (`reelContract`, `sceneUniqueness`, `wordCueBounds`) von `reel:why-ai:test` nie ausgeführt wurden (0 Tests gefunden, aber Exit-Code Fehler durch leeren Filter).
- `ki/tsconfig.json` referenzierte `../../tsconfig.base.json` (zwei Ebenen hoch) statt `../tsconfig.base.json` (eine Ebene hoch), was den Vite/Vitest-Transform mit `TSCONFIG_ERROR` abbrechen ließ.
- `ki/src/motion-system/__tests__/renderPlan.test.ts` nutzte `Array.prototype.at()`, das unter dem in `tsconfig.base.json` konfigurierten `ES2020`-Lib-Target nicht existiert (`tsc --noEmit -p ki/tsconfig.motion.json` schlug fehl).
- `AttentionThreadWeaveScene.tsx` griff auf `node.accent` zu, obwohl die meisten Einträge des `NODES`-Union-Typs dieses Feld gar nicht deklarieren; strict TypeScript lehnte das ab. Ersetzt durch die bereits vorhandene `isStrong`-Variable, die inhaltlich dasselbe ausdrückt.
- `SentenceTokenShatterScene.tsx`: Der Scanner-Balken lag laut DOM-Reihenfolge über dem Token-Stack und überdeckte die Wörter „deinen“ und „Satz“ während der Konvergenz um Frame 100–115 fast vollständig. Token-Stack bekam `zIndex: 5`, der Balken wurde zusätzlich abgedunkelt.
- `SceneTransitionBridge.tsx`: Alle sieben Übergänge rendern mit `zIndex: 80`, höher als Titel (`zIndex: 30`) und kinetischer Untertitel (`zIndex: 40`) in `ReelChrome.tsx`. Am Übergang Szene 5→6 (Layer-Lift, Frame 648) führte das dazu, dass Titel und Untertitel der ankommenden Szene 6 für mehrere Frames komplett leer/unlesbar waren. Fix: Übergangs-Overlays auf `zIndex: 25` gesenkt, damit Titel und Untertitel immer sichtbar bleiben.

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

## Tatsächlich durchgeführte Prüfung (dieser Durchlauf)

- Alle 10 Smoke-Frames und alle 32 Stills wurden mit dem Read-Tool visuell geöffnet und geprüft.
- Ergebnis: `out/reels/why-ai-reads-differently/release-report.json` → `passed: true`, 33/33 Artefakte gültig, aktueller `sourceFingerprint`.
- Volles MP4 (`out/reels/why-ai-reads-differently/why-ai-reads-differently.mp4`, 7.9 MB) via `ffprobe` geprüft: H.264 1080×1920 30fps 1080 Frames / 36.0s, AAC-Stereo-Audiospur 36.05s vorhanden.
- Stichproben-Frames direkt aus dem finalen MP4 per `ffmpeg -ss ... -frames:v 1` gezogen (Frame 0, 15, 113, 200, 400, 654, 700, 938, 1000, 1079) und visuell mit den Stills abgeglichen — Fixes sind im finalen Render sichtbar.
- `npm run motion:verify` lief grün durch (0 fehlgeschlagene Tests) — das bestehende allgemeine Motion-System ist durch die Reel-Änderungen nicht beschädigt.

## Offene / nicht vollständig geprüfte Punkte

- Die Übergänge decken beim Scannen der Einzel-Stills teils kurzzeitig Hauptinhalt (nicht Titel/Untertitel) ab, z. B. Word-Stream über Szene 6 kurz vor Szene 7, sowie Branch-Flash am Ende von Szene 4. Das ist als bewusster, kurzer (12 Frames / 0.4 s) Übergangs-Effekt eingeordnet und nicht weiter verändert worden — bei Bedarf für spätere Politur vermerkt.
- Keine millisekundengenaue Voiceover-Synchronisierung behauptet; `voiceoverSrc` bleibt optional und wurde nicht mit echtem Audio getestet.
- Lautstärkeverhältnisse der `SynthSoundtrack.tsx`-Effekte wurden nur über die MP4-Audiospur (Vorhandensein, Dauer, Codec) geprüft, nicht per Lautheitsmessung/Waveform-Analyse einzelner Cues.
