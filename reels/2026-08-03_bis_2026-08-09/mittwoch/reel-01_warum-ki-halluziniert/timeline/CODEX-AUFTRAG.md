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

Baue alle acht individuellen Szenen exakt nach `03-szenen/szenenplan.md`. Nutze ausschließlich die deklarierten Assets. Bilder erhalten erklärende Masken, Zustandsänderungen und Overlays; kein generischer Dauerzoom. Untertitel zeigen nur bereits gesprochene Wörter und maximal neun gleichzeitig.

## Audio

Audio besteht ausschließlich aus `02-audio/voiceover.wav`.

Verbindliche Wiedergabe:

```text
playbackRate = 1.10
preservePitch = true
soundMode = off
music = false
```

Die Stimme muss mit **1,10x** abgespielt werden, ohne künstlich höhere Tonlage. Untertitel, wichtige Wortreaktionen, Szenenbewegungen und Übergänge müssen anhand der tatsächlich beschleunigten Tonspur synchronisiert werden. Keine Timings von der ursprünglichen 1,00x-Datei ungeprüft übernehmen.

Keine Musik, Beeps, Noise-Sweeps, Übergangssounds oder Wort-SFX hinzufügen.

## Prüfung

1. TypeScript und fokussierte Tests ausführen.
2. Test hinzufügen, der `playbackRate === 1.1`, `preservePitch === true`, `soundMode === "off"` und `music === false` prüft.
3. Alle 32 Frames aus `timeline/reel.json` nach `render/` rendern.
4. Jeden Frame groß und in Smartphone-Größe visuell prüfen.
5. Fehler korrigieren.
6. Vollständiges MP4 nach `06-video/` rendern.
7. MP4 in normaler Videogeschwindigkeit vollständig ansehen und prüfen, ob die Stimme hörbar bei 1,10x läuft, aber natürlich bleibt.
8. `05-review/checkliste.md` nur für tatsächlich bestandene Punkte aktualisieren.

Keinen Erfolg behaupten, der nicht wirklich getestet, gerendert und angesehen wurde.
