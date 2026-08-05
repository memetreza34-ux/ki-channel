# Warum KI halluziniert – und wie du es erkennst

Dieses Reel ist kreativ geplant und technisch vorprogrammiert. Codex soll keine Animation mehr entwerfen oder neu schreiben.

## Was bereits fertig programmiert ist

- vollständige Remotion-Composition mit acht Szenen
- vier bildgeführte Szenen: 1, 3, 4 und 8
- vier vollständig programmierte UI- und Diagrammszenen: 2, 5, 6 und 7
- globale Überschriften und Caption-Safe-Zone
- 1,10×-Audiowiedergabe
- vier vollständige Bildprompts
- 32 Render-Checkpoints
- technische Artefaktprüfung

Der vorprogrammierte Code liegt unter:

```text
alles/ki/src/reels/why-ai-hallucinates/
```

## Deine Medien

### Audio

Lege genau eine Audio- oder Mediendatei direkt in:

```text
02-audio/
```

Der Dateiname ist egal. Unterstützt werden WAV, MP3, M4A, AAC, OGG, MP4, MOV und WEBM. Die Quelldatei wird auf 1,10× verarbeitet; beschleunige sie nicht vorher selbst.

### Bilder

Lege bei jeder Bildszene genau eine Bilddatei direkt in den passenden Ordner:

```text
03-szenen/EINZELNE-SZENEN/scene-01/<beliebiger-name>.png
03-szenen/EINZELNE-SZENEN/scene-03/<beliebiger-name>.jpg
03-szenen/EINZELNE-SZENEN/scene-04/<beliebiger-name>.webp
03-szenen/EINZELNE-SZENEN/scene-08/<beliebiger-name>.jpeg
```

Der Ordner bestimmt die Szene. Der Dateiname ist egal. Pro erwarteter Bildszene darf genau eine unterstützte Bilddatei vorhanden sein.

## Einziger normaler Build-Befehl

Aus `alles/`:

```bash
node scripts/build-why-ai-hallucinates.mjs \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_warum-ki-halluziniert
```

## Automatische Ausgaben

```text
06-video/final-reel.mp4
00-cover/cover.png
05-review/contact-sheet.png
05-review/codex-render-qa.json
05-review/build-report.json
```

## Aktueller Stand

- Skript und Bildprompts fertig
- acht Remotion-Szenen programmiert
- Produktionsgehirn vorhanden
- Medien, Tests, Render und manuelle visuelle Freigabe noch nicht bestätigt
