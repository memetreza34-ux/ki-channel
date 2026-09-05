# YouTube-Longform — Produktionsvertrag

Gilt für Produktionspakete unter `ki/youtube-longform/`.

Für neue Pakete ab **2026-09-05** gilt zusätzlich und vorrangig `LONGFORM-V1.md`. Ältere Pakete bleiben Legacy-kompatibel.

## Format

- eigenständiges Content-Format, niemals künstlich aus einem Reel verlängern
- Standardformat: **1920×1080, 30 FPS, 16:9**
- deutsch, faceless, heller KIwerkraum-Look
- Dauer folgt Thema und finalem Voiceover; 5–6 Minuten bleiben für ältere Pakete historischer Startkorridor, sind ab Longform v1 aber kein technisches Hard-Limit
- `OPEN_ENDED_STORY_DRIVEN`: keine feste Animationstechnik-Whitelist; jede deterministisch renderbare Technik darf genutzt werden, wenn sie die Story besser trägt
- externe Bilder/Videos sind zulässig, wenn konkrete Quelle, Rechte/Lizenz, nötige Attribution und lokale Datei im `MEDIA-PLAN.json` dokumentiert und geprüft sind
- keine Remote-Medien zur Renderzeit
- generierte Medien dürfen reale Claims niemals als Fake-Beleg darstellen

## Paketstruktur

Legacy-Grundstruktur bleibt stabil:

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

Longform v1 ergänzt innerhalb dieser Ordner insbesondere `CHAPTERS.json`, `CLAIMS.json`, `MEDIA-PLAN.json`, `THUMBNAIL-PLAN.json`, `LONGFORM-VERSION.json`, `RELEASE-PLAN.json` und `REVIEW-CHECKLIST.md`.

Ausführbarer Source:

```text
ki/src/longform/<sourceSlug>/
```

## 3 Phasen

### Phase 1 — Inhalt / Research / Source

Thema, Recherche, finales Skript, Kapitel, Claims, Visual-/Media-Plan, Thumbnail-Konzepte, Metadaten und Remotion-Source vorbereiten. Externe Medien erst nach Provenance-/Rechteprüfung produktiv binden.

### Phase 2 — Mensch

Nur den freigegebenen Sprechertext vertonen und als `voiceover.wav` oder `voiceover.mp3` in `01-script-audio/` ablegen.

### Phase 3 — Sync / Build / Review / Export

Audio messen und integrieren, Kapitel/Visual Beats an reale Stimme anpassen, Forced Alignment nutzen, B-Roll/Visuals final binden, Tests/Smoke/Render durchführen, Untertitel und Thumbnail erzeugen, kompletten Master visuell und akustisch prüfen und Upload-Paket fertigstellen.

Fehlt Audio, exakt stoppen mit:

`PHASE 2 AUDIO FEHLT`

## Visual-Rhythmus

Longform braucht weniger Dauerbewegung als Reels. Trotzdem darf neue Sprecherbedeutung nicht minutenlang auf demselben Zustand liegen.

- Cold Open: höhere Motion-/Informationsdichte
- Erklärung: mittel
- Beweis/Quelle: ruhig und fokussiert
- Reveal: gezielt dichter
- Kapitelwechsel: klarer visueller Zustands- oder World-Wechsel
- Payoff: Raum geben
- keine Deko-Motion als Füller
- UI und Diagramme groß genug für YouTube auf Laptop/TV

## Text / Captions

- keine dauerhaft eingebrannten Volltext-Untertitel als Standard
- Kapitelüberschrift kurz und sparsam
- Animationstext nur als kurze Objekt-/Zustandslabels, Zahlen oder gezielte Claim-Betonung
- finale `subtitles.srt`, `subtitles.vtt` und `transcript.txt` gehören zum Upload-Paket
- interne Planner-/Goal-/Debug-Texte niemals sichtbar

## Thumbnail

`ki/plattformen/youtube/THUMBNAILS.md` ist verbindlich. Longform v1 plant mindestens drei deutlich unterschiedliche Thumbnail-Konzepte; erst nach Review wird eine Variante ausgewählt.

## Wahrheit / Release

- aktuelle Fakten unmittelbar vor Veröffentlichung neu prüfen
- `CLAIMS.json` und `MEDIA-PLAN.json` sind bei v1 Teil der Produktionswahrheit
- Tests, Render, Thumbnail-Export, Audio-Sync oder visuelle Freigabe nur als erledigt markieren, wenn tatsächlich ausgeführt
- ein technischer Render ist keine Release-Freigabe
- `RELEASE-PLAN.json` darf nur bei tatsächlich abgeschlossenen technischen, visuellen, akustischen und Quellen-Reviews auf `READY` stehen