# Auftrag für Codex

Arbeite ausschließlich auf dem aktuellen Branch und verändere `main` nicht.

## Zuerst lesen

1. `alles/AGENTS.md`
2. `alles/ki/reel-brain/PRODUCTION-BRAIN.md`
3. diesen Reel-Ordner
4. `01-voice-script/voiceover.txt`
5. `03-szenen/szenenplan.md`
6. `03-szenen/alle-bildprompts.txt`
7. `04-caption/subtitle-cues.json`
8. alle Dateien in `timeline/`

## Vorhandener Remotion-Code

Die acht Szenen sind bereits vollständig vorgebaut unter:

```text
alles/ki/src/reels/why-ai-hallucinates/
```

Codex erfindet die Szenen nicht neu. Codex integriert die realen Assets, ersetzt die vorläufigen Wortzeiten durch das finale Transcript, synchronisiert die vorhandenen Bewegungen und korrigiert den aktuellen Render.

## Assets prüfen und bereitstellen

Beginne erst, wenn diese Dateien real vorhanden und nicht leer sind:

- `02-audio/voiceover.wav`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-01-confident-answer.png`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-03-pattern-gap-machine.png`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-04-risk-documents.png`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-08-verification-desk.png`

Keine Platzhalter oder fremden Bilder einsetzen. Aus `alles/` ausführen:

```bash
node scripts/stage-why-ai-hallucinates-assets.mjs
```

## Transcript und Synchronisierung

1. Transkribiere die finale 1,00x-Quelldatei mit Wortzeiten.
2. Ordne jedes Wort der richtigen Szene zu.
3. Schreibe die echten Quell-Cues in `04-caption/subtitle-cues.json`.
4. Der vorhandene Code teilt die Cue-Frames durch `playbackRate = 1.10`.
5. Richte wichtige Wortreaktionen und Hauptzustände an denselben Zeiten aus.
6. Prüfe Satzenden und Szenenwechsel gegen die echte Tonspur.

Wenn die beschleunigte Tonspur nicht sauber in 1080 Frames passt, darfst du ausschließlich die Framegrenzen technisch anpassen. Inhalt, Szenenreihenfolge und Voiceover bleiben unverändert. Aktualisiere dann gemeinsam `timeline/reel.json`, Checkpoints, Tests und Renderplan.

## Audio

```text
playbackRate = 1.10
preservePitch = true
soundMode = off
music = false
```

Keine Musik, Beeps, Noise-Sweeps, Übergangssounds oder Wort-SFX.

## Technische Prüfung

Aus `alles/`:

```bash
npx tsc --noEmit -p ki/tsconfig.json
npx vitest run ki/src/reels/why-ai-hallucinates/__tests__/contract.test.ts
node scripts/render-why-ai-hallucinates.mjs smoke
node scripts/render-why-ai-hallucinates.mjs stills
node scripts/render-why-ai-hallucinates.mjs video
node scripts/check-why-ai-hallucinates.mjs
```

Prüfe alle 32 Frames aus `timeline/reel.json` groß und in Smartphone-Größe. Sieh das vollständige MP4 in normaler Videogeschwindigkeit an. Behebe Fehler im Code und rendere danach erneut.

## Abschluss

Aktualisiere `05-review/checkliste.md` nur für wirklich bestandene Punkte. Melde getrennt:

- implementiert
- typechecked
- getestet
- gerendert
- visuell geprüft
- vom Nutzer freigegeben

Keinen Erfolg behaupten, der nicht wirklich ausgeführt und angesehen wurde.
