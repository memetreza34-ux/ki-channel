# Auftrag für Codex

Arbeite ausschließlich auf dem aktuellen Branch und verändere `main` nicht.

## Zuerst lesen

1. `alles/AGENTS.md`
2. diesen Reel-Ordner
3. `01-voice-script/voiceover.txt`
4. `03-szenen/szenenplan.md`
5. `03-szenen/alle-bildprompts.txt`
6. `04-caption/subtitle-cues.json`
7. alle Dateien in `timeline/`

## Assets prüfen

Beginne erst, wenn diese Dateien real vorhanden und nicht leer sind:

- `02-audio/voiceover.wav`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-01-confident-answer.png`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-03-pattern-gap-machine.png`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-04-risk-documents.png`
- `03-szenen/BILDER-HIER-EINFUEGEN/scene-08-verification-desk.png`

Keine Platzhalter oder fremden Bilder einsetzen.

## Implementierung

Der technische Code liegt unter `alles/`. Führe npm-Befehle aus `alles/` aus. Erstelle die Composition `Reel-WhyAIHallucinates` im bestehenden Remotion-System. Schreibe Voiceover, Szenenreihenfolge, Frames, Überschriften und Bildkonzepte nicht um.

Baue alle acht individuellen Szenen exakt nach `03-szenen/szenenplan.md`. Nutze ausschließlich die deklarierten Assets. Bilder erhalten erklärende Masken, Zustandsänderungen und Overlays; kein generischer Dauerzoom. Untertitel zeigen nur bereits gesprochene Wörter und maximal neun gleichzeitig. Audio besteht ausschließlich aus dem Voiceover.

## Prüfung

1. TypeScript und fokussierte Tests ausführen.
2. Alle 32 Frames aus `timeline/reel.json` nach `render/` rendern.
3. Jeden Frame groß und in Smartphone-Größe visuell prüfen.
4. Fehler korrigieren.
5. Vollständiges MP4 nach `06-video/` rendern.
6. MP4 in normaler Geschwindigkeit vollständig ansehen.
7. `05-review/checkliste.md` nur für tatsächlich bestandene Punkte aktualisieren.

Keinen Erfolg behaupten, der nicht wirklich getestet, gerendert und angesehen wurde.
