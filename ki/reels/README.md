# KI-Kanal Reel-Pakete

Die Reel-Ablage ist dauerhaft nach dem bewährten FinanzNeo-Prinzip organisiert: **Wochenordner → Reel-Ordner → feste 01–06 Produktionsbereiche**.

## Verbindliche Struktur

```text
ki/reels/
├── README.md
├── AGENTS.md
├── animation-history.json
├── _codex-hybrid-template/
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

### 01-script-audio
Skript, Sprechertext, Voiceover-Dateien, Transkript und Audio-Plan.

### 02-bilder
Bildprompts, Asset-Manifest, Bilder, Masken und Layer. Große Medien dürfen weiterhin lokal/gitignored bleiben.

### 03-caption
Subtitle-Cues, Wort-Timestamps und Social-Media-Caption.

### 04-pdf
Optionale PDF-Inhalte und fertige PDF-Artefakte.

### 05-export
Smoke-Frames, finale MP4s und andere veröffentlichungsfertige Exporte. Große Renderdateien bleiben normalerweise gitignored.

### 06-projektdateien
Briefing, `reel.json`, Szenenplan, Animation-/Remotion-Plan, Assembly-Auftrag, Review-Checklist und sonstige technische Planungsdateien.

## Harte Grenzen

**Verboten:**

```text
ki/<reel-name>/
ki/reels/<flacher-reel-ordner>/
ki/src/reels/<planungspaket>/
```

`ki/src/reels/<slug>/` ist ausschließlich für den **ausführbaren Remotion-Sourcecode nach erfolgreichem Preflight** vorgesehen, zum Beispiel TS/TSX, Contracts und Tests. Planungsdateien gehören dort niemals hin.

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
