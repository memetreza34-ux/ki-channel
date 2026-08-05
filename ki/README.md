# KI-Kanal

Dieses Repository gehört ausschließlich zum deutschen KI-Faceless-Kanal.

**FinanzNeo ist ein eigenes Repository. Es besitzt keine gemeinsame Reel-, Asset-, Code- oder Produktionsstruktur mit diesem Projekt.** Ein FinanzNeo-Ordner neben `Ki-channel` im Finder ist nur ein getrennter Schwesterordner im lokalen Oberordner.

## Hauptstruktur

```text
ki/
├── AGENTS.md
├── README.md
├── animation-library/
├── bausteine/
├── brand/
├── gehirn/
├── reels/
├── src/
├── package.json
└── remotion.config.ts
```

## Ein Reel bleibt bewusst übersichtlich

```text
ki/reels/<datum-und-slug>/
├── 01_START-HIER.md
├── 02_VOICEOVER.md
├── 03_SZENEN.md
├── 04_BILDER/
├── 05_AUDIO/
├── 06_CODEX.md
└── 99_INTERN/
```

Der Nutzer arbeitet normalerweise nur mit den ersten sechs Einträgen. Technische JSON-, Timing-, Manifest- und Prüfdateien liegen gesammelt in `99_INTERN/`.

## Aktuelles Reel

```text
ki/reels/2026-08-05-warum-ki-halluziniert/
```

Titel:

```text
Warum KI halluziniert – und wie du es erkennst
```

Direkter Einstieg:

```text
ki/reels/2026-08-05-warum-ki-halluziniert/01_START-HIER.md
```

## Codex-Vorbereitung

Nach Einfügen der vier Bilder und des Voiceovers:

```bash
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready
```

Danach den Auftrag aus dieser Datei an Codex geben:

```text
ki/reels/2026-08-05-warum-ki-halluziniert/06_CODEX.md
```

Der automatisch erzeugte technische Brief liegt unter:

```text
ki/reels/2026-08-05-warum-ki-halluziniert/99_INTERN/CODEX-BRIEF.generated.md
```
