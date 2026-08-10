# KI-Kanal — verbindlicher 3-Phasen-Produktionsablauf

Dieser Ablauf ist der Normalfall für jedes neue Reel.

## Phase 1 — ChatGPT: komplette Grundlage

Ziel: Nach Phase 1 muss der Mensch **nur noch das Voiceover erzeugen**.

Phase 1 erstellt:

- Thema, Titel und stabilen Slug
- Fakten-/Quellenprüfung, wenn Aktualität oder Genauigkeit es verlangt
- Wochenpaket mit 01–06-Struktur
- finalen Sprechertext in `01-script-audio/voiceover.md`
- denselben Sprechertext **ohne Szenen, Überschriften oder Anweisungen** als `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
- Szenenplan
- Animationen / New-Build-Entscheidung
- Zuschauer-Überschriften und kurze Animationslabels ohne Caption-Dopplung
- Bildbedarf pro Szene
- bei Bildbedarf hochwertige `02-bilder/image-prompts.md` nach `ki/BILDSTIL.md`
- `02-bilder/asset-manifest.json`, auch wenn bewusst keine externen Assets nötig sind
- `03-caption/subtitle-cues.json` als Audio-unabhängige Basis
- `06-projektdateien/reel.json`
- Assembly-Auftrag und Review-Checkliste
- ausführbaren Remotion-Source unter `ki/src/reels/<slug>/`
- Content-Grounding: Sprechertext → Meaning → Derive → Sanitize → Associate → Render-Props
- Composition-Registrierung
- fokussierte Source-/Contract-Checks
- `PHASE-STATUS.md`

**Phase 1 darf kein echtes Voiceover vortäuschen.** Fehlendes Audio ist hier normal.

### Phase-1-Fertigkriterium

Planung und Code-Grundlage sind vorhanden; der einzige normale manuelle nächste Schritt lautet:

> **PHASE 2: Voiceover erzeugen.**

Nur Skript/Plan ohne ausführbaren Source ist nicht Phase-1-fertig.

---

## Phase 2 — Mensch: nur Voiceover

1. `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt` öffnen.
2. Text wortgetreu mit der gewünschten Stimme erzeugen.
3. bevorzugt `voiceover.wav`, alternativ `voiceover.mp3` speichern.
4. Datei in `01-script-audio/` ablegen.
5. keine JSON-, Caption-, Szenen-, Prompt- oder TS/TSX-Datei ändern.

Wenn der Text geändert werden soll, zurück zu Phase 1.

### Phase-2-Fertigkriterium

Echte Audiodatei liegt neben dem finalen Skript.

---

## Phase 3 — Codex oder Antigravity: Assembly und Release

Phase 3 verwendet die vorhandene Phase-1-Grundlage und baut nicht neu von Null.

Pflichten:

1. Branch/Status prüfen.
2. `PHASE-STATUS.md` und Reel-Verträge lesen.
3. Struktur-/Preflight-Checks ausführen.
4. echtes Voiceover finden; bei Fehlen mit `PHASE 2 AUDIO FEHLT` stoppen.
5. reale Audio-Dauer messen.
6. Audio render-sicher integrieren.
7. Timing/Captions an reales Audio anpassen, ohne Sprechertext zu ändern.
8. genehmigte Animationen und Bildassets erhalten, außer ein nachweisbarer Fehler verlangt Korrektur.
9. Strukturcheck, fokussierte Tests und TypeScript ausführen.
10. pro Szene Opening/Mid/End-Hold Smoke-Frames rendern.
11. Smoke-Frames tatsächlich visuell prüfen und Fehler beheben.
12. finales MP4 rendern.
13. MP4 technisch validieren und normal/auf Smartphone-Größe ansehen.
14. Review-Checkliste und Status nur für tatsächlich abgeschlossene Punkte aktualisieren.

## Stop-Bedingungen

Nicht als fertig melden bei:

- fehlendem Audio
- fehlender Phase-1-Source
- fehlgeschlagenen Tests/Strukturchecks
- Text-/Caption-Mismatch
- überlappender oder abgeschnittener Typografie
- internen Regie-/Goal-Texten im Video
- unnötiger Caption-/Animations-Textdopplung
- ungrounded Zahlen
- falscher Animation
- ungeprüften Smoke-Frames
- nicht angesehenem finalen MP4

## Kurzform

```text
PHASE 1 — ChatGPT
alles außer echtem Audio
        ↓
PHASE 2 — Mensch
nur Voiceover
        ↓
PHASE 3 — Codex / Antigravity
integrieren + prüfen + rendern
```
