# YouTube-Longform — Produktionsvertrag

Gilt für Produktionspakete unter `ki/youtube-longform/`.

Für neue Pakete ab **2026-09-05** gelten zusätzlich und vorrangig:

1. `LONGFORM-V1.md`
2. `RENDER-GATES.md`
3. `.agents/workflows/longform-full-cycle.md` für Antigravity-Ausführung

Ältere Pakete bleiben Legacy-kompatibel.

## Antigravity-Preflight — verbindlich

Vor einer neuen YouTube-Longform-Produktion muss Antigravity zuerst ausführen:

```bash
node scripts/check-antigravity-longform-capabilities.mjs
```

Bei non-zero Exit: **STOP**. Keine Ersatz-Composition, kein Placeholder-Render, keine Behauptung, dass Bilder/B-Roll/Effects/Longform-Render vollständig verfügbar seien.

Für Longform sind die dedizierten Workspace-Agents zu verwenden:

- `ki-longform-production-orchestrator`
- `ki-longform-remotion-engineer`

Die Reel-Agenten bleiben für Reels erhalten und sind nicht der kanonische Longform-Writer.

## Format

- eigenständiges Content-Format, niemals künstlich aus einem Reel verlängern
- Standardformat: **1920×1080, 30 FPS, 16:9**
- deutsch, faceless, heller KIwerkraum-Look
- Dauer folgt Thema und finalem Voiceover; 5–6 Minuten sind ab Longform v1 kein technisches Hard-Limit
- `OPEN_ENDED_STORY_DRIVEN`: keine feste Animationstechnik-Whitelist
- externe Bilder/Videos sind zulässig, wenn konkrete Quelle, Rechte/Lizenz, nötige Attribution und lokale Datei im `MEDIA-PLAN.json` dokumentiert und geprüft sind
- keine Remote-Medien zur Renderzeit
- generierte Medien dürfen reale Claims niemals als Fake-Beleg darstellen

## Zuständigkeiten — verbindlich

### Phase 1 — Agent / ChatGPT / Codex / Antigravity

Der Nutzer muss **keine Bilder und keine B-Roll beschaffen**.

Phase 1 umfasst:

- Thema / Research / Claims
- finales Skript
- Kapitel
- Visual-Story-Plan
- konkrete Bild-/B-Roll-/Official-Media-Suche
- Originalquellen identifizieren
- Lizenz-/Rechte-Vorprüfung
- konkrete Kandidaten in `MEDIA-PLAN.json` locken
- Thumbnail-Konzepte
- Metadaten-Draft
- Remotion-Source-Grundlage

`MEDIA-PLAN` darf Phase 1 nicht nur mit abstrakten Aussagen wie „Server-B-Roll suchen“ beenden, wenn eine konkrete Quelle bereits sinnvoll auffindbar ist.

### Phase 2 — Mensch

**Einzige reguläre Nutzeraufgabe:** den freigegebenen Sprechertext vertonen und als `voiceover.wav` oder `voiceover.mp3` in `01-script-audio/` ablegen.

Der Nutzer muss nicht:

- Bilder suchen
- B-Roll suchen
- Medien herunterladen
- Rechte recherchieren
- Animationen bauen
- Untertitel bauen
- Thumbnail bauen
- rendern

Fehlt Audio, exakt stoppen mit:

`PHASE 2 AUDIO FEHLT`

### Phase 3 — Agent / Codex / Antigravity

- echtes Voiceover messen
- Forced Alignment / reale Timings erzeugen
- Kapitel/Visual Beats voice-locken
- in Phase 1 gewählte Medien final herunterladen/materialisieren
- finale Rechte/Provenance an die konkrete lokale Datei binden
- SHA-256 berechnen
- B-Roll trimmen/croppen/normalisieren
- finalen Remotion-Source bauen
- SFX/Visuals an reale Timings binden
- technische Gates ausführen
- kanonischen Review-Master rendern
- Thumbnail/Subtitles/Upload-Paket erzeugen
- kompletten 1x-Review durchführen

## Medienzustände — nicht vermischen

Externe Medien durchlaufen zwingend getrennte Zustände:

1. `DISCOVERED` / Phase-1-Kandidat
2. `MATERIALIZED_PENDING_REVIEW`
3. `APPROVED`
4. erst danach Nutzung im finalen Remotion-Source

Scout-/Browser-URLs dürfen niemals direkt als Render-Asset benutzt werden.

Für Pexels/Pixabay/Wikimedia-Scout-Kandidaten:

```bash
node scripts/materialize-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --scout=<scout-result.json> \
  --candidate-id=<candidateId>
```

Für lokal erfasste offizielle Screenshots/Figuren oder andere exakte lokale Inputs:

```bash
node scripts/materialize-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --local-input=<local-file>
```

Materialisierung setzt **niemals** automatisch `rightsVerified=true`.

Nach Prüfung der exakten lokalen Datei:

```bash
node scripts/approve-longform-media.mjs <package> \
  --asset-id=<assetId> \
  --rights-note="<konkrete Rechte-/Quellenprüfung>" \
  --visual-note="<konkrete Crop-/Timing-/Semantikprüfung>"
```

Freigabe ist an den SHA-256 der exakt geprüften Datei gebunden. Ändert sich die Datei, muss neu materialisiert/geprüft werden.

## Paketstruktur

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
├── README.md
├── 01-script-audio/
├── 02-visuals/
├── 03-thumbnail/
├── 04-metadata/
├── 05-export/
└── 06-projektdateien/
```

Longform v1 ergänzt insbesondere `CHAPTERS.json`, `CLAIMS.json`, `MEDIA-PLAN.json`, `THUMBNAIL-PLAN.json`, `LONGFORM-VERSION.json`, `RELEASE-PLAN.json`, `RENDER-LOCK.json` und Review-Artefakte.

Ausführbarer Source:

```text
ki/src/longform/<sourceSlug>/
```

## Harte Render-Regel

Ein direkter Remotion-Render ist **kein Produktionsreview-Master**.

Kanonischer Produktionsreview ausschließlich über:

```bash
node scripts/render-ki-longform-master.mjs <longform-package>
```

Vor Render müssen `check-ki-longform-render-readiness.mjs` und Render-Lock bestehen. Danach muss `check-ki-longform-master.mjs` bestehen.

Ein Render wird u. a. blockiert bei:

- fehlendem Voiceover
- nicht voice-gelockter Timeline
- fehlenden/unapproved Medien
- fehlender Rechteprüfung oder SHA-256
- README-only-/uncommitted Source
- sichtbaren Platzhaltern
- Fake-Evidence
- direkten Remote-Medien

Der gemasterte Output wird u. a. auf Freeze/Stagnation, Tail-Stille, Codec/Format, Audio-Loudness/True-Peak und extrem schlechte Videokompression geprüft.

## Visual-Rhythmus

Longform braucht weniger Dauerbewegung als Reels, aber keine minutenlangen statischen Slides.

- Cold Open: hohe Motion-/Informationsdichte
- Erklärung: mittel
- Beweis/Quelle: ruhig und fokussiert, aber visuell bewusst komponiert
- Reveal: gezielt dichter
- Kapitelwechsel: klarer Visual-World-Wechsel
- Payoff: Raum geben
- keine Deko-Motion als Füller
- keine praktisch unveränderten Zustände >=15 s im finalen Master
- statische Abschnitte ab 8 s müssen bewusst reviewed werden
- UI/Diagramme groß genug für Laptop/TV

## Text / Captions

- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Kapitelüberschrift kurz und sparsam
- Animationstext nur als kurze Objekt-/Zustandslabels, Zahlen oder gezielte Claim-Betonung
- finale `subtitles.srt`, `subtitles.vtt` und `transcript.txt` gehören zum Upload-Paket
- interne Planner-/Goal-/Debug-/Placeholder-Texte niemals sichtbar

## Thumbnail

`ki/plattformen/youtube/THUMBNAILS.md` ist verbindlich. Mindestens drei deutlich unterschiedliche Konzepte; erst nach Review eine Variante auswählen.

## Wahrheit / Release

- aktuelle Fakten unmittelbar vor Veröffentlichung neu prüfen
- `CLAIMS.json` und `MEDIA-PLAN.json` sind Produktionswahrheit
- Tests/Render/Review nur als erledigt markieren, wenn tatsächlich ausgeführt
- `MASTER-QA.json.status` muss `PASSED` sein
- Kontaktbögen müssen visuell geprüft werden
- kompletter gemasterter Review-Master muss 1x ohne Skip angesehen werden
- `RELEASE-PLAN.oneXReviewCompletedAt` muss gesetzt sein
- SHA-256 des angesehenen Masters muss in `reviewedMasterSha256` stehen
- finaler `05-export/video.mp4` muss byte-identisch mit dem technisch geprüften Review-Master sein
- `RELEASE-PLAN.json` darf erst danach `READY` werden
