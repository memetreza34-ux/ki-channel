# Longform Source Contract

Gilt für `ki/src/longform/`.

## Antigravity Writer

Für `LONGFORM_V1` ist `ki-longform-remotion-engineer` der kanonische visuelle Writer. Vor einem neuen Longform-Build muss der Longform-Orchestrator `node scripts/with-longform-node20.mjs scripts/check-antigravity-longform-capabilities.mjs` erfolgreich ausführen und `.agents/workflows/longform-full-cycle.md` befolgen.

## Timeline

- Standard: 1920×1080 / 30 FPS / 16:9.
- Dauer folgt Thema und finalem Voiceover; keine künstliche Streckung. Neue Longform-v1-Pakete sind nicht mehr technisch auf 5:00–6:00 Minuten begrenzt.
- Finale Kapitel-/Szenendauern stammen aus echtem Voice-Lock/Forced Alignment.
- **Keine gleichen Fix-Dauern pro Kapitel** (z. B. 1000 Frames je Kapitel) und keine stillen Restcontainer hinter dem Voiceover.
- Composition-Ende folgt dem echten Audio plus bewusstem, kurzem End-Hold; niemals einem Placeholder-Zeitbudget.

### Expliziter Sync-Vertrag für neue Pakete

Neue `LONGFORM_V1`-Pakete mit `syncContract: LONGFORM_CHOREOGRAPHY_V1` müssen vor finaler Remotion-Implementierung den Sync aus `ki/youtube-longform/LONGFORM-SYNC.md` durchlaufen.

Finale Timing-Autorität ist:

```text
06-projektdateien/CHOREOGRAPHY-RESOLVED.json
```

Der finale TS/TSX-Source muss diese konkrete Datei binden und den gemeinsamen Helper verwenden:

```ts
createLongformChoreographyTiming(...)
```

Der Helper liegt unter `ki/src/longform/choreographyTiming.ts`.

Verbindlich:

- semantische Sprachintervalle stammen aus akzeptierten `WORD-TIMINGS.json`;
- ein unabhängiger zweiter Aligner muss `ALIGNMENT-QUALITY.json = ALIGNMENT_CONSENSUS_PASSED` liefern;
- jeder geplante Visual-Beat besitzt ein explizites `ENTER → HOLD → EXIT`-Intervall;
- SFX-Anker stammen aus demselben Choreografie-Beat;
- lange HOLD-Phasen sind bei Longform erlaubt und oft erwünscht;
- keine finale Animation aus Prozentwerten der Gesamtdauer, geschätzten Kapiteldauern oder einem einzelnen unbeschränkten Triggerframe ableiten;
- wenn Phrase/Timing nicht eindeutig auflösbar ist, blockieren statt schätzen.

Vor kanonischem Render muss `scripts/check-ki-longform-sync-readiness.mjs <package>` bestehen. Der kanonische Renderer ruft diesen Gate selbst auf.

## Motion / Visuals

- `OPEN_ENDED_STORY_DRIVEN`: keine feste Animationstechnik-Whitelist. React/SVG/CSS/Canvas/WebGL/Three/Skia/Rive/Lottie/GSAP/Remotion sowie neue geeignete Techniken dürfen genutzt werden, wenn sie Story, Lesbarkeit oder Beweisführung verbessern.
- vorhandenen Stack, Repo-Komponenten, relevante Remotion-Skills und Remotion Bits zuerst prüfen; neue Dependencies nur bei echtem Capability-Gap.
- native Remotion-Visuals bevorzugen, wenn sie die Aussage besser und klarer tragen; reale Medien bevorzugen, wenn reale Bildinformation selbst Teil der Aussage ist.
- Real Media wird aktiv komponiert: Crop/Zoom, Masken, Callouts, Depth/Parallax, PIP, Source-Highlighting und kurze semantische Intercuts sind erlaubt, wenn sie die Aussage verbessern.
- keine minutenlangen Card-/Slide-Zustände. Master-QA blockiert lange Freeze-/Stagnationszustände; Source-Design soll sie bereits verhindern.
- pro Kapitel klare Zustandsentwicklung statt permanenter Dekobewegung.
- Motion-Dichte folgt der Story: Cold Open dichter, Proof ruhiger, Reveals gezielt, Kapitelwechsel klar, Payoff mit Raum.
- Animation ist kein Selbstzweck: jede Bewegung erklärt, fokussiert, vergleicht, beweist, überleitet oder zahlt die Story aus.

## Externe Medien

Externe Medien dürfen im finalen TSX **nur** verwendet werden, wenn das zugehörige `MEDIA-PLAN.json` für genau diese Datei enthält:

- `status: "APPROVED"`
- `rightsVerified: true`
- lokale `localFile`
- gültige SHA-256
- passende Quelle/Provenance.

Der normale Longform-Pfad ist:

```text
Scout/Browser/Local Source
→ materialize-longform-media.mjs
→ MATERIALIZED_PENDING_REVIEW
→ exakte Datei visuell + Rechte/Quelle prüfen
→ approve-longform-media.mjs
→ APPROVED + SHA
→ erst dann TSX/staticFile
```

- Scout-URLs, Pexels-/Pixabay-CDN-URLs und andere HTTP-Medien niemals direkt im TSX verwenden.
- keine Remote-Downloads zur Renderzeit.
- keine generierten Fake-Screenshots oder generierten Medien als Beleg realer Ereignisse/Claims.
- `GENERATED_NON_EVIDENTIARY` darf nur Erklärung/Metapher sein und nie `provesRealWorldClaim: true` tragen.
- Fehlt ein required Asset, ist das ein **Blocker**. Niemals durch `Visual`, `B-Roll here`, generische Card oder erfundene UI ersetzen.
- User-Media bleibt zulässig und wird ebenfalls lokal/provenance-seitig gebunden.

## Determinismus / Text

- `useCurrentFrame`, `interpolate`, `spring`, `Sequence`; kein `Math.random()` im deterministischen Renderpfad.
- direkte Frame-Seeks müssen deterministisch funktionieren.
- Text knapp halten: Kapitelmarker, Objektlabels, echte UI-Begriffe, Zahlen/Claims bei Bedarf; kein dauerhaft eingebranntes Transcript.
- interne Begriffe wie `TODO`, `TBD`, `PLACEHOLDER`, `Payoff Visual`, `Demo Visual`, `B-Roll here` oder ähnliche Planner-Texte dürfen nie im Render-Source landen.
- Thumbnail-Komposition darf im selben Source-Ordner liegen, ist aber eine eigene Composition.

## Render-Wahrheit

- nach Source-Änderung alten Render nicht als aktuelle Freigabe verwenden.
- direkter `npx remotion render` ist nur Prototype und nie ein Produktionsreview-Master.
- Produktionsreview nur über `node scripts/with-longform-node20.mjs scripts/render-ki-longform-master.mjs <package>` nach bestandenem Sync-/Readiness-Gate.
- TypeScript/Test/Render/Review nur behaupten, wenn tatsächlich ausgeführt.

Für neue Pakete ab 2026-09-05 sind zusätzlich `ki/youtube-longform/LONGFORM-V1.md` und `ki/youtube-longform/LONGFORM-SYNC.md` verbindlich.
