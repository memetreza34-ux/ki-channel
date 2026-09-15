# KI-Reels

## Kanonische Struktur

Für die aktive Woche und alle neuen Reels gilt:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/
├── 01_Montag/
│   └── 01_Reel-Titel/
├── 02_Dienstag/
│   └── 01_Reel-Titel/
├── 03_Mittwoch/
│   └── 01_Reel-Titel/
├── 04_Donnerstag/
├── 05_Freitag/
├── 06_Samstag/
└── 07_Sonntag/
```

Im Themen-/Reel-Ordner bleibt der Produktionsvertrag unverändert:

```text
NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Die Hierarchie ist damit immer:

```text
Woche → Wochentag → Thema/Reel → 01–06 Produktionsordner
```

Wenn an einem Tag mehrere Reels entstehen, werden sie innerhalb des Tages nummeriert:

```text
04_Donnerstag/
├── 01_Thema-A/
├── 02_Thema-B/
└── 03_Thema-C/
```

Neue Pakete ausschließlich mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel" YYYY-MM-DD
```

Der Generator bestimmt aus dem Datum automatisch den richtigen Wochentagsordner. Danach:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

Seit der Woche `2026-08-31_bis_2026-09-06` ist die Tagesebene Pflicht. Ältere abgeschlossene Wochen bleiben Legacy-kompatibel, solange sie nicht aktiv migriert werden.

## Produktionsphasen

- Phase 1 — ChatGPT: alles außer echtem Audio, inklusive Plattform-Copy und Remotion-Code-Grundlage
- Phase 2 — Mensch: nur Voiceover
- Phase 3 — Codex/Antigravity: Audio-Integration, Tests, Smoke-Review, Final-Render

Details: `ki/gehirn/PRODUKTIONSABLAUF.md`.

## Plattform-Publishing

Ein Reel wird einmal produziert. Plattform-spezifische Titel/Captions liegen pro Reel unter:

```text
03-caption/platform-copy.md
```

YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat dürfen denselben freigegebenen Master verwenden. Kein zweites Produktionspaket pro Plattform anlegen.

Details: `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/`.

## Kein Template-Ordner

Es gibt bewusst **keinen** flachen `_codex-hybrid-template` mehr. Generator, Core-Generator und die kanonischen Agent-/Gehirn-Dateien sind die einzige Vorlage.

- `scripts/new-ki-reel.mjs` = Wochentag-/Thema-Routing
- `scripts/new-ki-reel-core.mjs` = vollständiger 01–06-/Story-/Level-Up-Scaffold

## Legacy-Pakete

Ältere Reels können historische Dokumentnamen, frühere Phasenbegriffe oder die frühere flache Wochenstruktur enthalten. Sobald ein solches Paket aktiv weiterentwickelt wird, soll es in die aktuelle Struktur `Woche → Wochentag → Thema` migriert und seine Pfadreferenzen mitgezogen werden.

## Source

Ausführbarer Remotion-Code bleibt separat:

```text
ki/src/reels/<slug>/
```

Planungsdateien werden nicht dorthin kopiert. Source-Dateien, die JSON/Captions/SFX aus einem Produktionspaket importieren, müssen auf den vollständigen Tagespfad zeigen.
