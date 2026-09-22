# Antigravity / Gemini — KI-Channel Contract V2

Vor jeder Aufgabe zuerst `REPO-STATE.md`, danach `AGENTS.md` lesen.

Für KI-Reels zusätzlich:

1. `ki/AGENTS.md`
2. `ki/gehirn/MASTER.md`
3. `ki/reels/AGENTS.md`
4. reel-spezifische V2-Dateien

Je nach Aufgabe außerdem:

- Story/Hook → `ki/gehirn/STORY_RETENTION.md`
- Fakten → `ki/gehirn/FAKTENQUELLEN.md`
- Visual-Auswahl → `ki/gehirn/VISUAL_STRATEGY.md`
- finaler Zuschauerreview → `ki/gehirn/CREATIVE_QA.md`
- Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`

## Kanonischer Stand

`main` ist die aktuelle Produktionswahrheit. Andere Branches sind Historie/Backup, außer der Nutzer nennt sie ausdrücklich.

Normale Änderungen auf einem Arbeitsbranch von `main`; `main` nur bei ausdrücklich verlangter Repository-Kanonisierung direkt aktualisieren.

## Neue Reels = V2

Neue Reel-Pakete ausschließlich über:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

V2-Reels besitzen unter `06-projektdateien/` mindestens:

- `production-contract-v2.json`
- `creative-brief.md`
- `source-ledger.md`
- `visual-strategy.md`
- `creative-review.md`
- `PHASE-STATUS.md`

Legacy-Reels ohne V2-Vertrag bleiben kompatibel, definieren aber nicht den neuen Produktionsstandard.

## 3 Phasen

### Phase 1 — ChatGPT

Phase 1 erstellt die komplette Planungs- und Code-Grundlage **vor echtem Audio**.

Reihenfolge:

```text
Creative Brief
→ Fakten / Source Ledger
→ finaler Sprechertext
→ Visual Beats
→ Visual Strategy
→ Animation-/Shot-Plan
→ Asset-/Capture-Entscheidung
→ Captions/Plattform-Copy
→ reel.json
→ Remotion-/Production-Source + Composition
```

Audio darf in Phase 1 fehlen. Das ist normal.

Direkt vom Thema in Source-Code springen ist ein Prozessfehler.

### Phase 2 — Mensch

Immer:

- `voiceover.wav` oder `voiceover.mp3` aus dem freigegebenen Copy-Text erzeugen

Nur wenn `visual-strategy.md` es ausdrücklich verlangt:

- REAL_CAPTURE aufnehmen
- externes Still-/Hybrid-/Motion-Asset bereitstellen

Wenn kein externes Medium erforderlich ist, bleibt Phase 2 ausschließlich Voiceover.

### Phase 3 — Antigravity / Codex

Antigravity arbeitet auf der vorhandenen Phase-1-Implementierung. Nicht von Null neu bauen.

Ablauf:

1. `PHASE-STATUS.md` lesen.
2. `creative-brief.md`, `source-ledger.md`, `visual-strategy.md` lesen.
3. Struktur/V2-Contract prüfen.
4. vorhandenen Source und Composition prüfen.
5. echtes Voiceover suchen.
6. fehlt Audio: `PHASE 2 AUDIO FEHLT` und stoppen.
7. alle im Manifest erforderlichen realen Assets/Captures prüfen; fehlende nicht ersetzen oder vortäuschen.
8. Audio-Dauer, Phrasen und Pausen analysieren.
9. Visual Beats, Animation, Holds und Szenenwechsel an die reale Sprecherbedeutung anpassen.
10. Pausen sind Timing-Signale, aber nicht alleinige Szenenlogik.
11. falls ein lokaler Sprecherabschnitt noch zu schnell/langsam ist: zuerst Visual/Hold, dann natürliche Pause, erst danach bei Bedarf komplette Phrase/Cue pitch-erhaltend leicht retimen.
12. Speedwechsel niemals mitten im Wort oder abrupt; Wortlaut/Reihenfolge unverändert.
13. bevorzugter Retiming-Bereich `0.97x–1.03x`, bei echtem Bedarf bis ungefähr `0.94x–1.06x`; stärkere Korrektur → neues Phase-2-Voiceover.
14. Captions/Wort-Timestamps gegen das final tatsächlich verwendete Audio ausrichten.
15. genehmigte Modality, Visual Beats und `REUSE_EXACT`/`NEW_BUILD` erhalten.
16. fokussierte Tests und TypeScript ausführen.
17. Opening/Mid/End sowie relevante Beat-Wechsel als Smoke-Frames rendern und **ansehen**.
18. echte Probleme beheben.
19. finales MP4 rendern, technisch prüfen, in normaler Geschwindigkeit und auf Smartphone-Größe ansehen.
20. `POST_RENDER_REVIEW.md` durchführen.
21. `CREATIVE_QA.md` durchführen und `creative-review.md` dokumentieren.
22. Source-Ledger-Claims mit Recheck-Pflicht vor Publishing erneut prüfen.
23. Status nur für tatsächlich ausgeführte Prüfungen aktualisieren.
24. lokale Audio-Retiming-Stellen/Faktoren nennen oder `kein Retiming nötig` melden.

## Visual Strategy — kein Remotion-Default

Vor technischer Umsetzung gilt `ki/gehirn/VISUAL_STRATEGY.md`.

Erlaubte primäre Modalities:

- `REMOTION_NATIVE`
- `REAL_CAPTURE`
- `HYBRID`
- `EXTERNAL_STILL_REQUIRED`
- `EXTERNAL_MOTION_REQUIRED`

Keine Modality ist automatisch besser. **Beste Erklärung gewinnt.**

Wenn echte Tool-Oberfläche oder reales Ergebnis selbst Teil des Beweises ist, `REAL_CAPTURE` prüfen statt eine Fake-UI nachzubauen.

Wenn ein räumliches/organisches Motiv die Aussage stärker trägt, kann Hybrid/externes Asset korrekt sein.

## Anti-Karten-Regel

Cards/Panels nur als echte semantische Objekte, z. B. UI, Dokument, Datei, Nachricht, Datensatz oder Token.

Nicht als Standardcontainer für abstrakte Aussagen.

Neue Reels sollen, sofern der Inhalt Alternativen erlaubt:

- nicht mehr als zwei gleiche Hauptgrammatiken direkt hintereinander nutzen
- Karten-/Panelbeats ungefähr auf ein Drittel oder weniger begrenzen
- mindestens einen echten Hero-/Memorable-Moment enthalten

## Repository-Struktur

Planung:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
```

Source:

```text
ki/src/reels/<slug>/
```

Nie Planung nach `ki/src/reels/` verschieben. Nie flache Reel-Pakete unter `ki/reels/<slug>/` erzeugen.

## Externe Bilder / Assets

`ki/BILDSTIL.md` ist anzuwenden, **nachdem** die Visual Strategy `HYBRID` oder `EXTERNAL_STILL_REQUIRED` gewählt hat.

Phase 1 darf:

- Bedarf definieren
- Prompt/Shot-Brief schreiben
- erwarteten Dateinamen festlegen
- Manifeststatus `MISSING_REQUIRED` setzen

Phase 3 darf nur tatsächlich vorhandene Dateien verwenden.

Präzise Header, Captions, Zahlen, Pfeile, Labels und UI-Overlays bleiben kontrollierte Remotion-Ebenen, sofern das Asset selbst nicht ein echter Capture dieser UI ist.

## Publishing / Plattformen

Short-Form wird einmal produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technische Anpassung erforderlich ist.

Plattform-Copy liegt im Reel unter:

```text
03-caption/platform-copy.md
```

Keine zweite Skript-/Source-Kopie in `ki/plattformen/` erzeugen. YouTube Longform ist separat.

Aktuelle Plattformlimits/Monetarisierungsregeln bei konkreter Veröffentlichung neu prüfen.

## Spezieller Legacy-Fall: Context-Overload-Reel

Wenn ausdrücklich dieses bestehende Legacy-Reel fortgesetzt/fertiggestellt wird:

```text
ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/
```

Den vorhandenen Source unter:

```text
ki/src/reels/antigravity-context-overload/
```

wiederverwenden und nicht neu erfinden. Legacy-Verträge dieses Reels gelten für seine Fortsetzung, solange sie nicht mit höherrangigen aktuellen Sicherheits-/Wahrheitsregeln kollidieren.

## Verifikation

Kanonische technische Gates:

```bash
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
```

Zusätzlich für V2-Reels:

- Story-Preflight
- Source Ledger
- Visual Strategy
- Smoke-Review
- `POST_RENDER_REVIEW.md`
- `CREATIVE_QA.md`
- `creative-review.md = PASS`

Keine Demo-Werte, Fake-Assets, nicht ausgeführte Tests oder erfundene Erfolgsmeldungen.
