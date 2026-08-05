# Codex-first hybrid reel workflow

## Ziel

Der Nutzer soll im Reel-Ordner nur die Dateien sehen, mit denen er wirklich arbeitet. Technische Verträge und Prüfdateien liegen gesammelt in `99_INTERN/`.

## Reel-Struktur

```text
ki/reels/<slug>/
├── 01_START-HIER.md
├── 02_VOICEOVER.md
├── 03_SZENEN.md
├── 04_BILDER/
│   ├── PROMPTS.md
│   └── fertige PNGs
├── 05_AUDIO/
│   └── voiceover.wav
├── 06_CODEX.md
└── 99_INTERN/
    ├── reel.json
    ├── subtitle-cues.json
    ├── animation-plan.md
    ├── asset-manifest.json
    ├── review-checklist.md
    ├── CODEX-BRIEF.generated.md
    └── codex-package-report.json
```

## Sichtbare Arbeitsdateien

- `01_START-HIER.md` erklärt den Ablauf.
- `02_VOICEOVER.md` enthält den finalen Sprechtext.
- `03_SZENEN.md` enthält alle Szenen, Bilder, Animationen und Übergänge.
- `04_BILDER/PROMPTS.md` enthält die Bildprompts.
- `04_BILDER/` nimmt die fertigen Bilder auf.
- `05_AUDIO/` nimmt das finale Voiceover auf.
- `06_CODEX.md` ist der einzige Auftrag, der an Codex übergeben wird.

## Technische Dateien

Alles, was der Nutzer normalerweise nicht manuell bearbeiten muss, liegt in `99_INTERN/`:

- Format, Dauer und Framebereiche
- ungefähre oder finale Wortzeiten
- technischer Animationsvertrag
- Asset-Manifest
- Review-Checkliste
- automatisch erzeugter Codex-Brief
- Paketbericht

## Vorbereitung

Planung ohne Pflichtassets prüfen:

```bash
npm run codex:reel:prepare -- <slug>
```

Nach Einfügen aller Bilder und des Voiceovers:

```bash
npm run codex:reel:prepare -- <slug> --ready
```

Der Befehl erzeugt:

```text
ki/reels/<slug>/99_INTERN/CODEX-BRIEF.generated.md
ki/reels/<slug>/99_INTERN/codex-package-report.json
```

## Codex-Ablauf

Codex erhält nur den Auftrag aus `06_CODEX.md`. Danach soll Codex:

1. das Paket mit `--ready` prüfen
2. den generierten Brief aus `99_INTERN/` lesen
3. die Remotion-Composition implementieren
4. fokussierte Tests und Typecheck ausführen
5. Checkpoints rendern und visuell prüfen
6. Fehler korrigieren
7. das aktuelle MP4 rendern und ansehen
8. technische Artefaktprüfungen ausführen
9. nur tatsächlich bestandene Punkte abhaken

## Bildregel

Ein Bild darf niemals nur mit einem generischen Dauerzoom gezeigt werden. Remotion ergänzt stattdessen inhaltliche Masken, lokale Fokusse, Labels, Zustandsänderungen, Diagramme, Übergangsobjekte oder UI-Reaktionen.

## Audio

- Voiceover zuerst
- keine Musik
- SFX standardmäßig aus
- keine Beeps, Noise-Sweeps oder Sounds pro Wort

## Definition of Done

Ein Reel ist erst fertig, wenn Readiness, TypeScript, Tests, aktuelle Checkpoint-Render, aktuelles MP4, technische Artefaktprüfung und manuelle visuelle Prüfung tatsächlich bestanden wurden.
