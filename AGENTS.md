# KI-Channel — Agent Operating Contract

## Start here

Vor jeder Arbeit zuerst `REPO-STATE.md` lesen. Bei Dateien unter `ki/` danach `ki/AGENTS.md` und `ki/gehirn/MASTER.md`.

Zusätzlich je nach Aufgabe:

- Reel-Arbeit → `ki/reels/AGENTS.md`
- Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`

## Mission

Dieses Repository produziert hochwertige deutsche faceless KI-Erklärinhalte mit Remotion und verteilt freigegebene Short-Form-Master kontrolliert auf YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat. Agenten arbeiten als Produktionsingenieure: bestehende Verträge respektieren, semantisch passende Visualisierung bauen, prüfen und wahrheitsgemäß berichten.

## Git und Branches

- `main` ist der kanonische Produktionsstand.
- Historische `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches niemals als aktuelle Wahrheit behandeln, wenn der Nutzer sie nicht ausdrücklich nennt.
- Für normale Arbeit von `main` einen Arbeitsbranch verwenden.
- `main` nicht direkt verändern, außer der Nutzer verlangt ausdrücklich Repository-Stabilisierung/Kanonisierung.
- Keine PRs mergen, schließen oder als ready markieren, außer die Aufgabe umfasst das ausdrücklich.
- Keine unrelated Dateien anfassen.

## Verbindliches 3-Phasen-Modell für Reels

### Phase 1 — ChatGPT

Phase 1 liefert die komplette Produktionsgrundlage vor dem Audio:

- finales Voiceover-Skript
- zusätzlich reiner Fließtext `VOICEOVER-ZUM-KOPIEREN.txt`
- Szenen-, Animations- und Caption-Planung
- eine universelle, direkt kopierbare Social Caption mit genau fünf Hashtags in `03-caption/platform-copy.md`
- Bildentscheidung, hochwertige Bildprompts und Asset-Manifest, falls Bilder nötig sind
- `reel.json`
- ausführbare Remotion-Code-Grundlage unter `ki/src/reels/<slug>/`
- Composition-Registrierung
- Content-Grounding und fokussierte Checks
- klarer `PHASE-STATUS.md`

Fehlendes Voiceover-Audio ist in Phase 1 normal und kein Grund, die Code-Grundlage aufzuschieben.

### Phase 2 — Mensch

Der Mensch erzeugt ausschließlich das echte Voiceover aus dem freigegebenen Fließtext und legt `voiceover.wav` bevorzugt, alternativ `voiceover.mp3`, in `01-script-audio/` ab.

### Phase 3 — Codex / Antigravity

Phase 3 beginnt erst mit echtem Audio. Der Agent:

- verwendet die vorhandene Phase-1-Source
- integriert Audio
- misst reale Dauer
- synchronisiert Captions/Timing
- führt Struktur-, TypeScript- und fokussierte Tests aus
- rendert und prüft Smoke-Frames
- rendert erst danach das finale MP4
- prüft das finale Video technisch und visuell

Fehlt Audio, mit `PHASE 2 AUDIO FEHLT` stoppen. Kein Audio erfinden und das Reel nicht von Null neu bauen.

## Autoritative Reel-Dateien

Wenn vorhanden, gelten in dieser Reihenfolge:

1. `06-projektdateien/PHASE-STATUS.md`
2. `06-projektdateien/reel.json`
3. `01-script-audio/voiceover.md`
4. `01-script-audio/VOICEOVER-ZUM-KOPIEREN.txt`
5. `06-projektdateien/scene-plan.md`
6. `06-projektdateien/animation-plan.md`
7. `03-caption/subtitle-cues.json`
8. `03-caption/platform-copy.md`
9. `02-bilder/asset-manifest.json`
10. `02-bilder/image-prompts.md`, wenn Bilder benötigt werden
11. `06-projektdateien/CODEX_ASSEMBLY_TASK.md`
12. `06-projektdateien/review-checklist.md`

Widersprüche nicht still auflösen. Höher priorisierte Quelle erhalten und den Konflikt an der Ursache korrigieren.

## Publishing-Regel

Plattformordner sind Packaging, keine zweite Produktionswahrheit. Kein zweites Skript, `reel.json` oder Remotion-Projekt nur für YouTube/TikTok/Instagram/Facebook/Snapchat anlegen.

Short-Form-Master bleibt unter `ki/reels/`. Dieselbe Caption wird für alle Social-Plattformen verwendet; sie gehört in `03-caption/platform-copy.md`. Keine PDF für Short-Form anlegen.

YouTube Longform ist ein separates Format und darf nicht automatisch aus einem Short künstlich verlängert werden.

Zeitabhängige Plattformlimits oder Monetarisierungsregeln bei konkreter Veröffentlichung aktuell prüfen.

## Remotion-Regeln

- deterministisch: `useCurrentFrame()`, `interpolate()`, `spring()`, `Sequence`
- kein `Math.random()` im Render
- keine Render-Time-Netzwerkaufrufe oder Downloads
- Assets über Repository/staticFile-Pfade
- direkte Frame-Seeks müssen funktionieren
- Hard Cut ist Standard; Übergang nur bei echter semantischer Kontinuität
- eine dominante erklärende Bewegung pro Satz, maximal drei starke Bewegungen gleichzeitig
- keine Demo-Zahlen als Fakten
- keine vollständige Library-Animation zweimal im selben Reel

## Text-Hierarchie

- Überschrift: 3–7 Wörter, ordnet die Szene ein
- Caption: gesprochener Text
- Animationstext: nur kurze Objekt-/Zustandslabels
- Animation: zeigt Mechanismus oder Zustandsänderung

Interne `goal`, `communicationGoal`, Debug- oder Regietexte dürfen nie im finalen Video sichtbar werden. Sprechertext nicht zusätzlich als langen Untertitel oben oder innerhalb der Animation duplizieren.

## Bildregeln

`ki/BILDSTIL.md` ist verbindlich. Bilder werden nur eingesetzt, wenn sie die Aussage besser erklären als reine Remotion-Grafik. Generierte Bilder enthalten keine Überschrift, keine Untertitel, keine Wasserzeichen und keine langen Texte. Sichtbare Bildlabels sind selten, kurz und deutsch; Prompt-Text ist standardmäßig Englisch für Modellpräzision.

## Wahrheitspflicht

Nie behaupten, dass Tests, Typecheck, Audio-Sync, Smoke-Frames, Render, visuelle Prüfung oder Veröffentlichung bestanden/erfolgt sind, wenn sie nicht tatsächlich ausgeführt wurden. Ein technisch gültiges MP4 ist nicht automatisch visuell freigegeben.

Bei einem Blocker immer nennen:

- exakter Befehl
- Fehler
- betroffene Datei
- nächste sinnvolle Aktion

Keine Fehler mit `any`, `@ts-ignore`, deaktivierten Tests, Fake-Assets, Fake-Berichten oder geschwächten Validatoren verstecken.


## STRIKE KI-Regel (Keine künstlichen Assets)
Du darfst unter keinen Umständen selbst Bilder, Assets oder sonstige Medien generieren, erfinden oder halluzinieren. Du darfst ausschließlich Dinge (Dateien, Bilder, Audios) verwenden, die der Nutzer dir explizit zur Verfügung gestellt hat!
