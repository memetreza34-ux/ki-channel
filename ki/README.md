# KI-Kanal

Dieses Repository gehört ausschließlich zum deutschen KI-Faceless-Kanal.

**FinanzNeo ist ein eigenes Repository und besitzt keine gemeinsame Reel-, Asset-, Code- oder Produktionsstruktur mit diesem Projekt.** Ein gleichnamiger Ordner neben `Ki-channel` im Finder ist lediglich ein Schwesterordner im lokalen Oberordner und kein Bestandteil dieses Repositories.

## Hauptstruktur

```text
ki/
├── AGENTS.md                 # Regeln für Codex im KI-Bereich
├── README.md                 # dieser Einstieg
├── animation-library/        # Animationskatalog und Produktionsdokumentation
├── bausteine/                # wiederverwendbare visuelle Grundbausteine
├── brand/                    # Farben, Typografie und Designregeln
├── gehirn/                   # Kanalwissen und redaktionelle Regeln
├── reels/                    # jedes echte Reel als eigenes Produktionspaket
├── src/                      # Remotion- und TypeScript-Quellcode
├── package.json
└── remotion.config.ts
```

## Reel-Struktur

Jedes echte Reel liegt vollständig in einem eigenen Ordner:

```text
ki/reels/<datum-und-slug>/
├── README.md
├── reel.json
├── script/
│   ├── voiceover.md
│   └── subtitle-cues.json
├── scenes/
│   ├── README.md
│   ├── scene-01.md
│   ├── scene-02.md
│   └── ...
├── visuals/
│   ├── image-prompts.md
│   └── animation-plan.md
├── assets/
│   ├── asset-manifest.json
│   ├── README.md
│   ├── images/
│   └── audio/
└── codex/
    ├── CODEX_ASSEMBLY_TASK.md
    ├── CODEX-BRIEF.generated.md
    ├── codex-package-report.json
    └── review-checklist.md
```

Damit sind Sprechtext, Szenen, Bilder, Animationen, Assets und Codex-Auftrag sofort getrennt auffindbar.

## Aktuelles Reel

```text
ki/reels/2026-08-05-warum-ki-halluziniert/
```

Titel:

```text
Warum KI halluziniert – und wie du es erkennst
```

## Codex-Vorbereitung

Planung prüfen:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert
```

Nach Einfügen aller Bilder und des Voiceovers:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready
```

Codex verwendet anschließend primär:

```text
ki/reels/2026-08-05-warum-ki-halluziniert/codex/CODEX-BRIEF.generated.md
```
