# Auftrag für Codex

Kopiere den folgenden Auftrag in Codex, nachdem alle vier Bilder und `voiceover.wav` eingefügt wurden.

```text
Lies alle für diesen Ordner geltenden AGENTS.md-Dateien.

Arbeite ausschließlich auf dem aktuellen Branch:
feature/codex-reel-ai-halluzinationen

Baue das Reel:
ki/reels/2026-08-05-warum-ki-halluziniert/

Nutze als sichtbare Produktionsgrundlage:
- 02_VOICEOVER.md
- 03_SZENEN.md
- 04_BILDER/PROMPTS.md

Nutze für technische Details ausschließlich die Dateien in:
- 99_INTERN/

Führe zuerst aus:
npm run codex:reel:prepare -- 2026-08-05-warum-ki-halluziniert --ready

Stoppe, falls ein Pflichtbild oder 05_AUDIO/voiceover.wav fehlt. Erstelle keine Platzhalter und verwende keine fremden Bilder.

Implementiere exakt eine Remotion-Composition:
Reel-WhyAIHallucinates

Vorgaben:
- 1080 × 1920
- 30 FPS
- exakt 1080 Frames
- exakt 8 Szenen
- finaler Voiceover-Text darf nicht umgeschrieben werden
- jedes gesprochene Wort als Untertitel
- maximal 9 sichtbare Untertitelwörter
- nur wichtige Wörter stark animieren
- Bilder nicht nur generisch zoomen
- maximal 3 starke Bewegungen gleichzeitig
- keine Musik
- keine Soundeffekte
- keine Menschen, Hände oder Roboter
- main nicht verändern

Erstelle reel-spezifischen Code unter:
ki/src/reels/why-ai-hallucinates/

Führe Typecheck und fokussierte Tests aus. Rendere anschließend alle Prüfframes und das vollständige MP4. Prüfe jedes Bild sowie das MP4 in normaler Geschwindigkeit und in Smartphone-Größe. Behebe abgeschnittene Texte, Überlappungen, leere Szenenanfänge, zu hektische Bewegungen und schwache Übergänge.

Behaupte keinen Erfolg für Tests, Render oder visuelle Prüfungen, die nicht wirklich ausgeführt wurden. Aktualisiere die Checkliste in 99_INTERN nur mit tatsächlich bestandenen Punkten.

Berichte am Ende:
1. Branch und letzter Commit
2. geänderte Dateien
3. ausgeführte Befehle mit Resultat
4. gefundene und fehlende Assets
5. Umsetzung jeder Szene
6. visuelle Probleme und Korrekturen
7. Voiceover- und Untertitelstatus
8. Pfade zu Prüfframes und MP4
9. technische Prüfung
10. verbleibende Probleme
11. Bestätigung, dass main unverändert blieb
```

## Vorher prüfen

Diese Dateien müssen existieren:

```text
04_BILDER/scene-01-confident-answer.png
04_BILDER/scene-03-pattern-gap-machine.png
04_BILDER/scene-04-risk-documents.png
04_BILDER/scene-08-verification-desk.png
05_AUDIO/voiceover.wav
```
