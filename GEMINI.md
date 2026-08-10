# Antigravity / Gemini — KI-Channel Contract

Vor jeder Aufgabe zuerst `REPO-STATE.md`, danach `AGENTS.md` lesen. Für KI-Reels zusätzlich `ki/AGENTS.md`, `ki/gehirn/MASTER.md` und `ki/reels/AGENTS.md`. Für Plattform-/YouTube-Aufgaben zusätzlich `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/AGENTS.md`.

## Kanonischer Stand

`main` ist die aktuelle Produktionswahrheit. Andere Branches sind Historie/Backup, außer der Nutzer nennt sie ausdrücklich.

Normale Änderungen auf einem Arbeitsbranch von `main`; `main` nur bei ausdrücklich verlangter Repository-Kanonisierung direkt aktualisieren.

## 3 Phasen

### Phase 1 — ChatGPT

Phase 1 erstellt bereits die komplette Code- und Planungsgrundlage. Dazu gehören Skript, `VOICEOVER-ZUM-KOPIEREN.txt`, Szenen, Animationen, Bildprompts/Manifest falls nötig, Captions, `03-caption/platform-copy.md`, `reel.json`, Remotion-Source, Composition und fokussierte Checks.

**Audio darf in Phase 1 fehlen.** Das ist normal.

### Phase 2 — Mensch

Der Mensch erzeugt nur `voiceover.wav` oder `voiceover.mp3` aus dem freigegebenen Text.

### Phase 3 — Antigravity / Codex

Antigravity arbeitet auf der vorhandenen Phase-1-Implementierung. Nicht von Null neu bauen.

Ablauf:

1. `PHASE-STATUS.md` lesen.
2. Struktur prüfen.
3. vorhandenen Source und Composition prüfen.
4. echtes Voiceover suchen.
5. fehlt Audio: `PHASE 2 AUDIO FEHLT` und stoppen.
6. Audio-Dauer messen und integrieren.
7. Captions/Timing an echtes Audio anpassen, ohne Text umzuschreiben.
8. genehmigte Animationen und Grounding-Pipeline erhalten.
9. fokussierte Tests und TypeScript ausführen.
10. drei Smoke-Frames pro Szene rendern und visuell prüfen.
11. echte Probleme beheben.
12. finales MP4 rendern, technisch prüfen und in normaler Geschwindigkeit ansehen.
13. Checkliste/Status nur für tatsächlich ausgeführte Prüfungen aktualisieren.

## Repository-Struktur

Planung:

`ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/`

Source:

`ki/src/reels/<slug>/`

Nie Planung nach `ki/src/reels/` verschieben. Nie flache Reel-Pakete unter `ki/reels/<slug>/` erzeugen.

## Publishing / Plattformen

Short-Form wird einmal produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat verwenden denselben freigegebenen Master, solange keine technische Anpassung erforderlich ist.

Plattform-Copy liegt im Reel unter:

`03-caption/platform-copy.md`

Keine zweite Skript-/Source-Kopie in `ki/plattformen/` erzeugen. YouTube Longform ist ein separates Format und wird nicht automatisch aus einem Reel verlängert.

Aktuelle Plattformlimits/Monetarisierungsregeln bei konkreter Veröffentlichung neu prüfen.

## Bilder

`ki/BILDSTIL.md` ist verbindlich. Phase 1 entscheidet zuerst, ob ein Bild überhaupt nötig ist. Falls ja, liegt der Prompt unter `02-bilder/image-prompts.md`; der Prompt ist standardmäßig Englisch, sichtbare Labels im Bild nur kurz und deutsch. Überschriften, Captions, Pfeile, Zahlen und längere Texte gehören in Remotion.

## Aktuelles Context-Overload-Reel

Wenn ausdrücklich dieses Reel fortgesetzt/fertiggestellt wird:

`ki/reels/2026-08-03_bis_2026-08-09/02_Warum-mehr-Kontext-KI-schlechter-macht/`

Phase-3-Skill:

`.agents/skills/build-context-overload-reel/SKILL.md`

Der vorhandene Source liegt unter:

`ki/src/reels/antigravity-context-overload/`

Er wird wiederverwendet und nicht neu erfunden.

## Verifikation

Canonical gates:

```bash
npm run repo:wiring-check
npm run ki:reel:structure-check
npm run typecheck
npm test
npm run content:runtime:verify
npm run repo:verify
```

Workspaces nie mit `--workspaces=false` umgehen. Keine Demo-Werte, Fake-Assets oder erfundene Erfolgsmeldungen.
