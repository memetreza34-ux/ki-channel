# KI-Kanal Reel-Pakete

Die Reel-Ablage ist dauerhaft als **Wochenordner → Reel-Ordner → feste 01–06 Produktionsbereiche** organisiert.

## Verbindliche Struktur

```text
ki/reels/
├── README.md
├── AGENTS.md
├── animation-history.json
└── YYYY-MM-DD_bis_YYYY-MM-DD/
    ├── 01_Reel-Titel/
    │   ├── README.md
    │   ├── 01-script-audio/
    │   ├── 02-bilder/
    │   ├── 03-caption/
    │   ├── 04-pdf/
    │   ├── 05-export/
    │   └── 06-projektdateien/
    ├── 02_Naechstes-Reel/
    └── ...
```

### `01-script-audio/`

Skript, Sprechertext, Voiceover-Dateien, Transkript und Audio-Plan.

### `02-bilder/`

Bildprompts, Asset-Manifest, Bilder, Masken und Layer. Große Medien dürfen lokal/gitignored bleiben, wenn der Produktionsvertrag das vorsieht.

### `03-caption/`

Subtitle-Cues, Wort-Timestamps und Social-Media-Caption.

### `04-pdf/`

Optionale PDF-Inhalte und fertige PDF-Artefakte.

### `05-export/`

Smoke-Frames, finale MP4s und andere veröffentlichungsfertige Exporte. Große Renderdateien bleiben normalerweise gitignored.

### `06-projektdateien/`

Briefing, `reel.json`, Szenenplan, Animation-/Remotion-Plan, Assembly-Auftrag, Review-Checklist sowie generierte Codex-Reports und Briefs.

## Harte Grenzen

**Verboten:**

```text
ki/<reel-name>/
ki/reels/<flacher-reel-ordner>/
ki/src/reels/<planungspaket>/
```

`ki/src/reels/<slug>/` ist ausschließlich für **ausführbaren Remotion-Sourcecode nach erfolgreichem Preflight** vorgesehen, zum Beispiel TS/TSX, Contracts, Komponenten und Tests. Planungsdateien gehören dort niemals hin.

## Neue Reels

Neue Reel-Ordner ausschließlich mit dem Generator anlegen:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Optional mit Bezugsdatum:

```bash
node scripts/new-ki-reel.mjs "Reel Titel" 2026-08-09
```

Der Generator ermittelt Montag–Sonntag, vergibt automatisch die nächste zweistellige Reel-Nummer und legt alle sechs Pflichtordner an.

## Codex-Paket vorbereiten

Beispiel:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht
```

Strikte Asset-Readiness:

```bash
node scripts/prepare-codex-reel.mjs \
  2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht \
  --ready
```

Generierte Dateien landen unter `06-projektdateien/`, nicht flach im Reel-Root und nicht unter `ki/src/reels/`.

## Legacy-Hinweis

`_codex-hybrid-template/` stammt aus der früheren flachen Paketstruktur. Es bleibt vorerst nur als historische Referenz im Repository und darf **nicht** als Vorlage für neue Produktions-Reels kopiert werden. Neue Pakete entstehen ausschließlich über `new-ki-reel.mjs`.

## Pflichtprüfung

Vor und nach jeder Änderung an Reel-Ordnern:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

Der Validator blockiert insbesondere:

- Reel-Projekte direkt im `ki/`-Root,
- Planungsdateien in `ki/src/reels/`,
- ungültige Wochenordner,
- Reel-Ordner ohne `NN_`-Präfix,
- fehlende 01–06 Pflichtordner,
- flach abgelegte Planungsdateien.

Diese Struktur darf nicht für einzelne Agents, IDEs oder Reels umgangen oder vereinfacht werden.
