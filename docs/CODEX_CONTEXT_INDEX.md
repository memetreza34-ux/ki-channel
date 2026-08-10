# Codex Context Index

Ziel: minimalen, richtigen Kontext laden und keine historischen Branches/Docs als Wahrheit verwenden.

## Immer zuerst

1. `REPO-STATE.md`
2. `AGENTS.md`

## Für KI-Reels

3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/reels/AGENTS.md`
6. named weekly reel `06-projektdateien/PHASE-STATUS.md`
7. nächstes reel-spezifisches `AGENTS.md`
8. nur die für die aktuelle Phase benötigten Reel-Dateien

## Branch-Regel

`main` ist kanonisch. Historische `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches nicht laden, außer der Nutzer nennt sie ausdrücklich.

## Phase 1

Wird normalerweise von ChatGPT abgeschlossen. Source-Ziel:

```text
ki/src/reels/<slug>/
```

Planungsdateien bleiben im Wochenpaket.

## Phase 2

Nur menschliches Voiceover. Kein Coding-Kontext nötig.

## Phase 3

Codex/Antigravity liest `docs/CODEX_REEL_WORKFLOW.md` und verwendet den vorhandenen Phase-1-Source. Fehlendes Audio ist ein Stop-Blocker.

## Gemeinsame technische Quellen

Nur bei Bedarf öffnen:

- `ki/src/animation-library/productionEligibility.ts`
- konkret verwendete Registry/Prototype-Dateien
- `ki/src/motion-system/`
- `core/brand-kit/`
- `ki/brand/brand.ts`

Nicht automatisch die komplette Animation Library lesen.

## Bilder

Bei Asset-/Bildfragen:

- `ki/BILDSTIL.md`
- named reel `02-bilder/README.md`
- `02-bilder/image-prompts.md`
- `02-bilder/asset-manifest.json`

## Statussprache

Immer getrennt halten:

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
```
