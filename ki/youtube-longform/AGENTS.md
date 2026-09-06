# YouTube-Longform — Produktionsvertrag

Gilt für Produktionspakete unter `ki/youtube-longform/`.

Für neue Pakete ab **2026-09-05** gelten zusätzlich und vorrangig:

1. `LONGFORM-V1.md`
2. `RENDER-GATES.md`

Ältere Pakete bleiben Legacy-kompatibel.

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

### Phase 1 — Agent / ChatGPT / Codex

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
