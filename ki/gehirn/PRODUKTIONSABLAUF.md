# KI-Kanal — verbindlicher 3-Phasen-Produktionsablauf

Dieser Ablauf gilt für neue Reel-Produktionen im KI-Kanal. Ziel ist eine klare Trennung: **Phase 1 liefert die komplette Grundlage, Phase 2 ist nur Audio, Phase 3 ist technische Endmontage und Render.**

## Phase 1 — ChatGPT: komplette Grundlage

Phase 1 muss ein Reel so weit vorbereiten, dass der Mensch anschließend **nur noch das Voiceover erzeugen** muss.

ChatGPT erstellt bzw. vervollständigt:

- Thema, Titel und stabilen Reel-Slug
- das kanonische Wochenpaket unter `ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/`
- alle permanenten Ordner `01-script-audio` bis `06-projektdateien`
- den finalen, verbindlichen Sprechertext in `01-script-audio/voiceover.md`
- Szenenplan und Szenenreihenfolge
- passende, production-ready Animationen oder einen begründeten New-Build-Plan
- `reel.json` mit Format, FPS, Dauer, Szenen und Animation-IDs
- Subtitle-Cues als Grundlage für die spätere Audio-Synchronisierung
- Asset-Manifest und die Entscheidung, ob Bilder/Videos überhaupt nötig sind
- Assembly-/Agent-Auftrag und Review-Checkliste
- die **ausführbare Remotion-Code-Grundlage** unter `ki/src/reels/<slug>/`
- Sprechertext → Meaning Contract → Runtime-Derive → Sanitize → Associate → Render-Props
- Composition-Registrierung in der Remotion-Root
- fokussierte Contract-/Source-Checks für das Reel
- einen klaren Phasenstatus im Reel-Paket

Phase 1 darf **kein Voiceover vortäuschen oder erfinden**. Wenn Audio Pflicht ist, bleibt das Asset bis Phase 2 bewusst offen.

### Fertig-Kriterium Phase 1

Phase 1 ist erst abgeschlossen, wenn Planung **und** Code-Grundlage vorhanden sind und der nächste notwendige manuelle Schritt eindeutig lautet:

> **PHASE 2: Voiceover erzeugen und als Audio-Datei ablegen.**

Ein Reel-Paket, das nur Skript und Plan enthält, aber noch keinen ausführbaren Source besitzt, ist **nicht Phase-1-fertig**.

---

## Phase 2 — Mensch: nur Voiceover

Der Mensch macht in Phase 2 ausschließlich das Audio.

1. `01-script-audio/voiceover.md` öffnen.
2. Den dort markierten finalen Sprechertext **wortgetreu** verwenden.
3. Ein sauberes zusammenhängendes deutsches Voiceover erzeugen.
4. Die Datei als `voiceover.wav` bevorzugt, alternativ `voiceover.mp3`, in `01-script-audio/` ablegen.
5. Keine Szene, Animation, Caption, JSON- oder TS/TSX-Datei ändern.

Wenn der Sprechertext geändert werden soll, geht das Reel zurück zu Phase 1. Eine heimliche Textänderung in Phase 2 würde Motion-Grounding und Untertitel entkoppeln.

### Fertig-Kriterium Phase 2

Im Ordner `01-script-audio/` liegt der finale Sprechertext **und** die dazugehörige echte Voiceover-Datei.

---

## Phase 3 — Codex oder Antigravity: Assembly, Prüfung und Export

Der Coding-Agent übernimmt nach dem Audio die technische Endmontage. Er baut das Reel **nicht erneut von Null**, sondern verwendet die freigegebene Phase-1-Grundlage.

Pflichten von Codex/Antigravity:

- niemals auf `main` arbeiten
- Repository-, KI- und Reel-Agent-Regeln lesen
- Phase-1-Source und Phase-2-Audio prüfen
- Voiceover in die Composition integrieren
- reale Audio-Dauer messen und Timing nur dann anpassen, wenn es technisch nötig und inhaltlich korrekt ist
- Sprechertext nicht umschreiben
- genehmigte Animation-IDs nicht willkürlich austauschen
- Subtitle-Timing an das echte Audio angleichen, ohne Wörter zu verlieren
- Strukturcheck, Reel-Check, fokussierte Tests und TypeScript-Checks ausführen
- pro Szene Smoke-Frames für Anfang, Mitte und finalen lesbaren Hold rendern
- alle Smoke-Frames visuell prüfen und echte Probleme beheben
- erst danach das finale MP4 rendern
- finales MP4 technisch validieren und in normaler Geschwindigkeit ansehen
- Review-Checkliste nur für tatsächlich geprüfte Punkte abhaken
- Export-Artefakte im vorgesehenen Reel-Ordner ablegen

### Stop-Bedingungen Phase 3

Nicht als fertig melden, wenn:

- Voiceover fehlt
- Tests oder Strukturchecks fehlschlagen
- Audio und Untertitel auseinanderlaufen
- sichtbare Werte nicht vom Sprechertext getragen werden
- Text abgeschnitten/überlappt ist
- eine Szene inhaltlich falsche Bewegung zeigt
- Smoke-Frames nicht tatsächlich geprüft wurden
- das finale MP4 nicht tatsächlich gerendert und angesehen wurde

---

## Kurzform

```text
PHASE 1 — ChatGPT
Idee + Skript + Planung + Animationen + Captions + Manifest + Remotion-Code + Checks
        ↓
PHASE 2 — Mensch
NUR Voiceover erzeugen und in 01-script-audio ablegen
        ↓
PHASE 3 — Codex / Antigravity
Audio integrieren + Timing prüfen + Tests + Smoke Review + Final Render + Export
```

## Verbindliche Regel

**Nach Phase 1 darf der Mensch nicht erst herausfinden müssen, was noch programmiert werden muss.** Der einzige normale manuelle Produktionsschritt zwischen ChatGPT und dem Coding-Agent ist das Voiceover.