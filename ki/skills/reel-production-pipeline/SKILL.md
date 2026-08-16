---
name: reel-production-pipeline
description: >
  Standardisierter Workflow zur Produktion eines neuen KI-Channel-Reels.
  Aktiviere diesen Skill, wenn der User ein neues Reel erstellen oder ein
  bestehendes Reel mit neuem Audio synchronisieren möchte.
---

# Reel Production Pipeline

## Übersicht
Dieser Skill definiert den exakten, reproduzierbaren Workflow für die Erstellung
eines neuen Reels im ki-channel Repository. Jeder Schritt ist zwingend und darf
nicht übersprungen werden.

## Voraussetzungen
- Der User hat eine Audio-Datei (`.mp4` oder `.wav`) bereitgestellt
- Das Repository ist unter `/Users/arman/.gemini/antigravity/scratch/ki-channel` ausgecheckt
- Git Working Tree ist sauber

## Kritische Regeln (aus MASTER.md)

> **STRIKE Speichern-Regel:** Alle Ergebnisse müssen JEDEN Wochentag als Git-Commit gesichert werden.

> **Keine Asset-Halluzination:** Du darfst unter keinen Umständen selbst Bilder, Assets oder Medien generieren. Nur vom User bereitgestellte Dateien verwenden.

> **Audio-basierte Synchronisation:** Keine rein mathematische/lineare Aufteilung. Timings MÜSSEN auf Basis einer Audio-Analyse (`ffmpeg silencedetect`) an die realen Sprechpausen gekoppelt werden.

---

## Workflow

### Schritt 1: Ordnerstruktur anlegen

Prüfe, ob der Wochenordner existiert. Falls nicht, erstelle ihn:

```
ki/reels/<YYYY-MM-DD>_bis_<YYYY-MM-DD>/<NN>_<Reel-Titel>/
├── 01-script-audio/     ← Audio-Datei hierher kopieren
├── 02-bilder/           ← asset-manifest.json
├── 03-caption/          ← subtitle-cues.json (wird generiert)
├── 04-vorschau/
├── 05-export/           ← Render-Output + Cover
└── 06-projektdateien/   ← reel.json (wird generiert)
```

### Schritt 2: Audio analysieren

**2a. Dauer ermitteln:**
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 <audio-datei>
```

**2b. Stille erkennen:**
```bash
ffmpeg -i <audio-datei> -af silencedetect=noise=-30dB:d=0.4 -f null - 2>&1 | grep silence
```

**2c. Frames berechnen:**
- FPS = 30
- Gesamtframes = `ceil(dauer * 30)`
- Stille-Grenzen als Frame-Nummern: `round(silence_end * 30)`

**2d. Szenen-Zuordnung:**
- Die 5 längsten Stille-Pausen markieren Szenen-Grenzen
- Szene 1: Frame 0 → erste große Pause
- Szene 2: erste Pause → zweite Pause
- usw.

### Schritt 3: Projektdateien generieren

**3a. `reel.json` erstellen** in `06-projektdateien/`:
```json
{
  "compositionId": "KI-<ReelName>",
  "format": {
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "durationInFrames": <berechnete-frames>
  },
  "audio": {
    "voiceoverRequired": true,
    "music": false,
    "sfx": false,
    "adaptivePhraseRetiming": true
  },
  "scenes": [
    {
      "sceneId": "<prefix>-01",
      "startFrame": 0,
      "endFrame": <erste-grenze>,
      "headline": "<kurz>",
      "spokenText": "<text-aus-audio>",
      "implementation": "NEW_BUILD"
    }
  ]
}
```

**3b. `subtitle-cues.json` erstellen** in `03-caption/`:
- Jeden gesprochenen Satz als einzelnen Cue mit sceneId, startFrame, endFrame, text
- Cues MÜSSEN lückenlos innerhalb ihrer Szene sein
- Alle sceneIds MÜSSEN gültigen Szenen entsprechen

### Schritt 4: Source-Code erstellen/aktualisieren

**4a. Reel-Verzeichnis** unter `ki/src/reels/<reel-name>/`:
- `contract.ts` — Importiert `reel.json` und `subtitle-cues.json`, exportiert Konstanten
- `Visuals.tsx` — Visuelle Komponenten für jede Szene
- `Reel<Name>.tsx` — Hauptkomponente mit Audio, Szenen und Untertiteln
- `index.ts` — Re-Exports

**4b. `Root.tsx` aktualisieren:**
- Voiceover importieren
- Composition registrieren mit `voiceoverSrc` in `defaultProps`

### Schritt 5: Pre-Render Validation

```bash
npx tsx ki/scripts/validate-reel.ts <composition-id>
```

Erst wenn ALLE Checks grün sind, weiter mit Schritt 6.

### Schritt 6: Rendern und Exportieren

**WICHTIG:** Das finale Video und ein ansprechendes Cover-Bild MÜSSEN im `05-export` Ordner gespeichert werden.

```bash
# Video rendern (speichert normalerweise in out/ oder direkt im Ordner)
npx remotion render ki/src/index.ts <CompositionId> ki/reels/<woche>/<reel>/05-export/<name>.mp4

# Wenn der Render nach out/ ging, MUSS er kopiert werden:
cp out/<name>.mp4 ki/reels/<woche>/<reel>/05-export/

# Ein repräsentatives Frame als cover.jpg extrahieren (falls nicht anders möglich)
ffmpeg -y -ss 00:00:10 -i ki/reels/<woche>/<reel>/05-export/<name>.mp4 -frames:v 1 -q:v 2 ki/reels/<woche>/<reel>/05-export/cover.jpg
```

### Schritt 7: Verifizieren

```bash
# Audio vorhanden?
ffprobe -v error -show_entries stream=codec_type -of csv=p=0 <output.mp4> | grep audio

# Dauer korrekt?
ffprobe -v error -show_entries format=duration -of csv=p=0 <output.mp4>
```

### Schritt 8: Git Commit (STRIKE-Regel!)

Da `.mp4`-Dateien und `images` in der `.gitignore` stehen, **MÜSSEN** die Exporte im Ordner `05-export/` zwingend per `-f` (force) hinzugefügt werden, damit sie auf GitHub laden:

```bash
git add -f ki/reels/<woche>/<reel>/05-export/<name>.mp4
git add -f ki/reels/<woche>/<reel>/05-export/cover.jpg
git add .
git commit -m "feat(reel): render <reel-titel> with audio-synced timings and export cover"
git push
```

---

## Checkliste (vor Abschluss)

- [ ] Audio analysiert mit `ffmpeg silencedetect`
- [ ] `reel.json` mit echten Audio-Timings
- [ ] `subtitle-cues.json` lückenlos und innerhalb Szenen-Grenzen
- [ ] `contract.ts` importiert JSON-Dateien (nicht hardcoden!)
- [ ] `Root.tsx` hat Voiceover-Import UND `voiceoverSrc` in defaultProps
- [ ] Pre-Render Validation bestanden
- [ ] Render hat Audio-Spur
- [ ] Finale .mp4 und cover.jpg im `05-export/` Verzeichnis abgelegt
- [ ] Exporte per `git add -f` hinzugefügt und Commit/Push erstellt

## Häufige Fehler (die dieser Skill verhindert)

| Fehler | Ursache | Lösung |
|---|---|---|
| Stummes Video | `voiceoverSrc` fehlt in defaultProps | Immer in Root.tsx prüfen |
| Animation asynchron | Lineare Aufteilung statt Stille-Erkennung | Immer `silencedetect` nutzen |
| Test bricht | Hardcodierte Frame-Werte im Test | Strukturelle Invarianten prüfen |
| Merge-Konflikt in Root.tsx | Parallele Branches | Immer zuerst `git pull` |
