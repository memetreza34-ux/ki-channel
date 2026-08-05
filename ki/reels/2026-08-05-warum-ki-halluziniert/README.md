# Warum KI halluziniert – und wie du es erkennst

Vollständiges Produktionspaket für ein 36-sekündiges Hybrid-Reel aus generierten Editorial-Bildern, UI-Nachbauten und individuellen Remotion-Animationen.

## Sofort finden

```text
Sprechtext       → script/voiceover.md
Untertitelzeiten → script/subtitle-cues.json
Szenen           → scenes/scene-01.md bis scene-08.md
Bildprompts      → visuals/image-prompts.md
Animationsregeln → visuals/animation-plan.md
Assetliste       → assets/asset-manifest.json
Codex-Auftrag    → codex/CODEX_ASSEMBLY_TASK.md
Qualitätsprüfung → codex/review-checklist.md
```

## Ordnerstruktur

```text
2026-08-05-warum-ki-halluziniert/
├── README.md
├── reel.json
├── script/
│   ├── voiceover.md
│   └── subtitle-cues.json
├── scenes/
│   ├── README.md
│   ├── scene-01.md
│   ├── scene-02.md
│   ├── scene-03.md
│   ├── scene-04.md
│   ├── scene-05.md
│   ├── scene-06.md
│   ├── scene-07.md
│   └── scene-08.md
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

## Produktionsdaten

- Format: 1080 × 1920
- Bildrate: 30 FPS
- Dauer: 36 Sekunden / 1080 Frames
- Sprache: Deutsch
- Szenen: 8
- Composition-ID: `Reel-WhyAIHallucinates`
- Audio: Voiceover, SFX standardmäßig aus
- Stil: hochwertige vereinfachte 3D-Editorial-Illustration

## Inhalt

1. überzeugende KI-Antwort ist nicht automatisch wahr
2. Sprachmodelle berechnen Fortsetzungen
3. fehlende Quellen können durch plausible Muster ersetzt werden
4. Namen, Zahlen, Studien und aktuelle Ereignisse sind besonders riskant
5. Warnzeichen: vage Antwort
6. Warnzeichen: unprüfbare Quelle
7. Warnzeichen: wechselnde Details
8. Prüfworkflow aus Gegenprüfung, Originalquelle und Beleg

## Noch einzufügen

```text
assets/images/scene-01-confident-answer.png
assets/images/scene-03-pattern-gap-machine.png
assets/images/scene-04-risk-documents.png
assets/images/scene-08-verification-desk.png
assets/audio/voiceover.wav
```

Die Bilder werden anhand von `visuals/image-prompts.md` erstellt. Fehlende Assets dürfen nicht durch Platzhalter ersetzt werden.

## Vorbereitung

Planung prüfen:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert
```

Nach Einfügen aller Pflichtassets:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready
```

Danach verwendet Codex primär:

```text
codex/CODEX-BRIEF.generated.md
```
