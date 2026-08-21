# KI-Reels

## Kanonische Struktur

Jedes echte Short-Form-Produktionsreel liegt ausschließlich unter:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 05-export/
└── 06-projektdateien/
```

Neue Pakete nur mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Danach:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

## Produktionsphasen

- Phase 1 — ChatGPT: alles außer echtem Audio, inklusive Plattform-Copy und Remotion-Code-Grundlage
- Phase 2 — Mensch: nur Voiceover
- Phase 3 — Codex/Antigravity: Audio-Integration, Tests, Smoke-Review, Final-Render

Details: `ki/gehirn/PRODUKTIONSABLAUF.md`.

## Plattform-Publishing

Ein Reel wird einmal produziert. Seine gemeinsame Social-Media-Caption liegt unter:

```text
03-caption/platform-copy.md
```

YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master und exakt dieselbe Caption. `platform-copy.md` enthält nur kopierfertigen Text plus genau fünf Hashtags. Keine Plattformvarianten und keine PDFs anlegen.

Details: `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/`.

## Kein Template-Ordner

Es gibt bewusst **keinen** flachen `_codex-hybrid-template` mehr. Der Generator und die kanonischen Agent-/Gehirn-Dateien sind die einzige Vorlage. Dadurch können neue Chats keinen veralteten Flat-Layout-Workflow kopieren.

## Legacy-Pakete

Ältere Reels können historische Dokumentnamen oder frühere Phasenbegriffe enthalten und noch keine `platform-copy.md` besitzen. Wenn ein solches Paket weiterbearbeitet oder erneut veröffentlicht werden soll, wird es zuerst auf den aktuellen Vertrag migriert. Historische Begriffe überschreiben niemals das aktuelle 3-Phasen-Modell.

## Source

Ausführbarer Remotion-Code bleibt separat:

```text
ki/src/reels/<slug>/
```

Planungsdateien werden nicht dorthin kopiert.
