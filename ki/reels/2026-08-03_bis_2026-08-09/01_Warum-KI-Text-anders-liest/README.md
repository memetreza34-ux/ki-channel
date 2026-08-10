# Warum KI deinen Text anders liest

**Reel-ID:** `2026-08-04-warum-ki-text-anders-liest`  
**Composition-ID:** `Reel-WhyAIReadsDifferently`  
**Format:** 1080 × 1920, 30 FPS, 36 Sekunden

## Wichtiger Legacy-Hinweis

Dieses Reel entstand **vor** dem heute verbindlichen 3-Phasen-Modell. Alte Dateinamen und Formulierungen wie „Phase 2 = Remotion-Implementierung“ sind historische Terminologie und dürfen nicht auf neue Reels übertragen werden.

Im aktuellen Modell gilt für dieses vorhandene Reel:

- die bereits vorhandene Remotion-Implementierung entspricht der **Phase-1-Code-Grundlage**
- echtes Voiceover fehlt → der nächste menschliche Schritt wäre **Phase 2: nur Audio**
- danach übernimmt **Phase 3: Audio-Integration, Prüfung und Render**

Aktueller Status: `06-projektdateien/PHASE-STATUS.md`.

## Inhalt

Das Reel erklärt, warum ein Sprachmodell Text nicht wie ein Mensch liest: Tokens → Zahlen/Vektoren → Bedeutungsraum → Attention → Wahrscheinlichkeiten → Antwort.

Der ausführbare Source liegt unter:

```text
ki/src/reels/why-ai-reads-differently/
```

Historische Planungsdateien bleiben als Referenz erhalten, sind aber kein Prozess-Template für neue Reels.

## Prüfung

```bash
npm run reel:why-ai:verify
npm run reel:why-ai:smoke
npm run reel:why-ai:full-release-check
```

Erst tatsächlich bestandene technische Prüfungen, reale Renders und visuelle Kontrolle erlauben eine Freigabe.
