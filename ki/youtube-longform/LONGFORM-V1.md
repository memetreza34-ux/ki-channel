# YouTube Longform v1

Gilt für neue Produktionspakete ab **2026-09-05** unter `ki/youtube-longform/`.

Longform v1 erweitert den bestehenden YouTube-Longform-Bereich. Ältere Pakete bleiben Legacy-kompatibel und werden nicht rückwirkend umgebaut.

## Ziel

Ein Longform-Video soll als reproduzierbares Produktionspaket entstehen:

```text
Research / Story
→ Kapitel + Claims
→ finales Nutzer-Voiceover
→ reale Audio-Timings
→ Media-/B-Roll-Plan
→ story-driven Remotion-Source
→ Untertitel + Thumbnail + Master
→ technische Gates
→ vollständiger visueller/akustischer Review
→ Upload-Paket
```

## Format

- 1920×1080
- 30 FPS
- 16:9
- deutsch
- faceless
- Produktionsdauer folgt dem Thema und dem finalen Voiceover; **5–6 Minuten sind ab v1 kein technisches Hard-Limit mehr**
- keine künstliche Streckung, Wiederholung oder Füllsätze für Laufzeit

## Kanonisches Paket

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
├── README.md
├── 01-script-audio/
│   ├── SCRIPT.md
│   ├── CHAPTERS.json
│   ├── CLAIMS.json
│   └── voiceover.wav|mp3              # erst nach Phase 2
├── 02-visuals/
│   ├── MEDIA-PLAN.json
│   ├── images/
│   ├── broll/
│   ├── official/
│   └── generated/
├── 03-thumbnail/
│   └── THUMBNAIL-PLAN.json
├── 04-metadata/
│   └── YOUTUBE.md
├── 05-export/
└── 06-projektdateien/
    ├── LONGFORM-VERSION.json
    ├── RELEASE-PLAN.json
    └── REVIEW-CHECKLIST.md
```

Ausführbarer Source bleibt getrennt:

```text
ki/src/longform/<sourceSlug>/
```

Neues Paket:

```bash
node scripts/new-ki-longform.mjs "Video Titel" YYYY-MM-DD
```

Strukturprüfung:

```bash
node scripts/check-ki-longform-structure.mjs
```

## Story und Kapitel

`CHAPTERS.json` ist die Story-Struktur, nicht nur eine YouTube-Zeitstempelliste.

Ein Kapitel braucht bei Befüllung mindestens:

- `id`
- `title`
- klaren Story-Zweck
- später reale Start-/End-Timings nach Voice-Lock

Typische Story-Funktionen können sein:

```text
COLD_OPEN
SETUP
PROBLEM
MECHANISM
PROOF
DEMO
COUNTERPOINT
IMPLICATION
PAYOFF
OUTRO
```

Die Reihenfolge folgt der konkreten Story und ist keine Pflichtschablone.

## Claims und Quellen

Jede relevante faktische Behauptung wird in `CLAIMS.json` nachvollziehbar mit dem Kapitel verbunden.

Empfohlener Eintrag:

```json
{
  "claimId": "claim-017",
  "chapterId": "chapter-03",
  "claim": "Konkrete prüfbare Aussage",
  "sourceType": "OFFICIAL",
  "sourceUrl": "https://...",
  "sourceDate": "2026-09-05",
  "confidence": "HIGH",
  "counterpoint": null,
  "onScreenProof": true,
  "factChecked": true
}
```

Regeln:

- aktuelle Tools, Preise, Modelle, Gesetze, Regeln und News unmittelbar vor Veröffentlichung erneut prüfen
- `factChecked: true` nur mit tatsächlicher Quelle
- Unsicherheit sichtbar als Unsicherheit behandeln
- ein visuelles Asset ersetzt keine Quellenprüfung
- generierte Bilder/Videos dürfen niemals als Beleg für reale Ereignisse, Personen, Produkteigenschaften oder Zahlen dienen

## Medien, Bilder und B-Roll

Longform v1 erlaubt automatische oder agentische Medienauswahl **nur innerhalb eines kontrollierten Provenance-Vertrags**.

Zulässige Quellklassen:

- `USER_PROVIDED`
- `OFFICIAL_SOURCE`
- `WIKIMEDIA_COMMONS`
- `OPEN_LICENSE_VERIFIED`
- `GENERATED_NON_EVIDENTIARY`

Externes Material darf erst produktiv genutzt werden, wenn:

1. die konkrete Originalquelle bekannt ist,
2. Nutzungsrecht/Lizenz für den konkreten Einsatz geprüft wurde,
3. notwendige Attribution dokumentiert ist,
4. das konkrete Medium lokal gespeichert wurde,
5. die lokale Datei dem `MEDIA-PLAN.json`-Eintrag zugeordnet ist,
6. das freigegebene Asset einen SHA-256 besitzt,
7. Timing und Bildinhalt visuell geprüft wurden.

Verboten:

- Render-Time-Downloads
- „Google-Bildsuche = Nutzungsrecht"
- zufällige Web-Bilder ohne Originalquelle
- erfundene/falsche Markenassets
- generierte Fake-Screenshots als realer Produktbeleg
- KI-generierte Szenen als dokumentarischer Beweis realer Vorgänge

Google/Web-Suche darf Discovery sein. **Rechtequelle ist immer die konkrete Originalquelle/Lizenz.**

### `MEDIA-PLAN.json`

Ein produktiver Eintrag sollte mindestens enthalten:

```json
{
  "assetId": "media-008",
  "chapterId": "chapter-03",
  "purpose": "Physische Größenordnung eines Rechenzentrums zeigen",
  "mediaType": "VIDEO",
  "sourceType": "WIKIMEDIA_COMMONS",
  "sourceUrl": "https://...",
  "license": "...",
  "attribution": "...",
  "localFile": "02-visuals/broll/media-008.mp4",
  "sha256": "...",
  "rightsVerified": true,
  "provesRealWorldClaim": false,
  "status": "APPROVED"
}
```

### Video-B-Roll vorbereiten

Vorhandene sichere FFmpeg-Provenance-Pipeline wird wiederverwendet. Longform-Preset:

```bash
node scripts/prepare-longform-video-asset.mjs <lokales-video> --provenance=<manifest|USER_PROVIDED> --start=0 --duration=6
```

Das Preset erzwingt 1920×1080 / 30 FPS. `PREPARED` bedeutet noch nicht `APPROVED`.

## Animation und Visual Worlds

Verbindliche Policy:

```text
OPEN_ENDED_STORY_DRIVEN
```

Es gibt **keine feste Animationstechnik-Whitelist**.

Erlaubt ist jede technisch stabile, deterministische Technik, die die Story besser erklärt, zum Beispiel:

- React / CSS / SVG
- Canvas / Skia
- Three.js / React Three Fiber / Remotion Three
- Rive / Lottie
- GSAP, sofern frame-deterministisch integriert
- Diagramme, Charts, Maps und Datenvisualisierung
- typografische Animation
- Partikel, Licht, Blur, Noise und Transition-Systeme
- reale Fotos und B-Roll
- echte Produkt-/Brand-Assets
- UI-Demonstrationen
- generierte nicht-beweisende Visuals
- neue Open-Source-Techniken bei echtem Capability-Gap

Vor einer neuen Dependency prüfen:

1. Kann der vorhandene Stack das bereits sauber?
2. Gibt es im Repo eine passende Komponente?
3. Gibt es einen passenden Remotion Skill / Remotion Bits Baustein?
4. Bringt das neue Projekt eine echte neue Fähigkeit oder bessere Qualität?
5. Ist es deterministisch, wartbar, lizenzierbar und renderbar?

Neue Libraries werden nicht gesammelt, nur weil sie existieren.

## Motion-Dichte

Longform wird nicht wie ein 60-Sekunden-Reel dauerhaft maximal bewegt.

Richtlinie:

- Cold Open / erste 30 Sekunden: hohe Informations- und Motion-Dichte
- Erklärung: mittel
- Beweis / wichtige Quelle: ruhig und fokussiert
- Überraschung / Reveal: gezielt hoch
- Kapitelwechsel: klarer visueller Zustands- oder World-Wechsel
- Payoff: Raum geben
- Outro: reduzieren

Ziel: **keine visuelle Langeweile, aber auch keine Motion-Fatigue.**

Kapitel dürfen unterschiedliche Visual Worlds verwenden: Editorial/Source, Spatial/3D, Product UI, Real B-Roll, Abstract Concept, Data/Charts usw.

## Audio

- finales Produktions-Voiceover ausschließlich vom Nutzer
- Timeline nach realem Voiceover locken, nicht umgekehrt
- Forced Alignment / echte Timings als Autorität verwenden, wenn verfügbar
- keine künstlichen Pausen nur für Animation
- SFX nur, wenn sie Aktion, Reveal, Transition, Zahl, UI-Interaktion oder Story-Bedeutung unterstützen
- kein Whoosh-/Click-Dauerfeuer
- Musik, falls genutzt, als separaten Mix-Bus behandeln und Sprache priorisieren

## Untertitel

Longform verwendet keine permanenten großen Reel-Captions als Standard.

Pflicht im finalen Upload-Paket:

- `subtitles.srt`
- `subtitles.vtt`
- `transcript.txt`

Im Bild selbst nur gezielte Betonungen: zentrale Begriffe, Zahlen, Namen, Claims, kurze Zitate oder Kapitelmarker.

## Thumbnail

`THUMBNAIL-PLAN.json` startet mit mindestens drei deutlich unterschiedlichen Konzepten A/B/C.

Jede Variante muss:

- die tatsächliche Videoaussage versprechen
- auf kleine Darstellung funktionieren
- ein klares Hauptmotiv besitzen
- nicht nur dieselbe Komposition minimal umfärben
- Brand-Konsistenz wahren, ohne jedes Thumbnail gleich aussehen zu lassen

Finale Regeln aus `ki/plattformen/youtube/THUMBNAILS.md` bleiben verbindlich.

## Export / Upload-Paket

Zielausgabe:

```text
05-export/
├── video.mp4
├── thumbnail-selected.png
├── title.txt
├── description.md
├── chapters.txt
├── subtitles.srt
├── subtitles.vtt
├── transcript.txt
├── sources.md
└── manifest.json
```

Zusätzliche Thumbnail-Testvarianten dürfen erhalten bleiben.

## Review und Release

Ein erfolgreicher technischer Render ist keine Freigabe.

Vor `READY` müssen mindestens belegt sein:

- Source-/Claim-Review
- Medienrechte-/Provenance-Review
- TypeScript/Test/Smoke, soweit für das Paket vorgesehen
- vollständiger Render
- visueller Review des gesamten Masters
- akustischer Review des gesamten Masters
- Thumbnail-Review
- Untertitel-Review
- Export-/Upload-Paket vollständig

`RELEASE-PLAN.json` darf nur auf `READY` stehen, wenn die dort geforderten Review-Felder tatsächlich `true` sind.

## Kompatibilität

- bestehende Reels werden durch Longform v1 nicht verändert
- bestehende Legacy-Longforms vor 2026-09-05 werden nicht rückwirkend migriert
- `ki/src/longform/AGENTS.md` regelt Source-Code
- `ki/youtube-longform/AGENTS.md` regelt Produktionspakete
- `ki/plattformen/youtube/LONGFORM.md`, `THUMBNAILS.md` und `UPLOAD.md` regeln Plattform-Ausgabe
