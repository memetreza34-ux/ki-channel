# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-10

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Andere `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches sind Historie, Sicherungen oder frühere Arbeitsstände. Sie dürfen nicht als aktuelle Wahrheit verwendet werden, außer der Nutzer nennt einen solchen Branch ausdrücklich.

Neue normale Änderungen starten von `main` auf einem neuen Arbeitsbranch. `main` wird nicht direkt verändert, außer der Nutzer verlangt ausdrücklich eine Repository-Stabilisierung oder Kanonisierung.

## 2. Verbindliche Lesereihenfolge

Bei KI-Reel-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. `ki/reels/AGENTS.md`
6. das ausdrücklich genannte Wochen-Reel und dessen nächstes `AGENTS.md`
7. erst danach reel-spezifische Pläne und Source-Dateien

Ältere Dokumente, alte PR-Beschreibungen und historische Branches dürfen diese Reihenfolge nicht überschreiben.

## 3. Kanonische Produktionsstruktur

Planung, Audio, Assets und Export eines Reels liegen ausschließlich hier:

```text
ki/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Titel/
├── README.md
├── 01-script-audio/
├── 02-bilder/
├── 03-caption/
├── 04-pdf/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer Remotion-Code liegt getrennt hier:

```text
ki/src/reels/<slug>/
```

Planungsdateien werden niemals in `ki/src/reels/` verschoben. Ein Produktionspaket wird niemals direkt unter `ki/` oder flach unter `ki/reels/<slug>/` angelegt.

## 4. Verbindliches 3-Phasen-Modell

```text
PHASE 1 — ChatGPT
Idee + Fakten + Skript + Copy-Text + Szenen + Animationen + Bildprompts/Manifest + Captions + Remotion-Code-Grundlage + Checks

PHASE 2 — Mensch
nur das echte Voiceover erzeugen und in 01-script-audio ablegen

PHASE 3 — Codex / Antigravity
Audio integrieren + Timing + Tests + Smoke-Review + Final-Render + Export
```

Codex oder Antigravity bauen in Phase 3 ein bereits Phase-1-fertiges Reel nicht neu von Null.

## 5. Verbindliche visuelle Identität

- 1080 × 1920, 30 FPS, sofern der Reel-Vertrag nichts anderes festlegt
- heller editorialer Look
- dunkle Schrift
- Marken-Lila `#B98CFF` als primärer Akzent
- dunkles Lila `#6E45C9` für Tiefe/Kontrast
- faceless, keine erkennbaren Gesichter
- keine Cyberpunk-/Neon-Standardästhetik
- Sprechertext, Caption, Überschrift und Animation haben unterschiedliche Aufgaben und dürfen sich nicht unnötig wiederholen
- Bilder erklären eine Aussage; sie sind nie reine Dekoration

Details: `ki/gehirn/MASTER.md`, `ki/gehirn/REELS.md`, `ki/BILDSTIL.md`.

## 6. Statusbegriffe niemals vermischen

Diese Zustände sind getrennt:

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
```

Nur tatsächlich ausgeführte Prüfungen dürfen als bestanden gemeldet werden.

## 7. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene blockiert und deshalb kein aktueller Beweis für Codequalität.
- Ein `package-lock.json` ist noch nicht kanonisch erzeugt. Bis ein echter npm-Installationslauf möglich ist, darf kein erfundener Lockfile-Inhalt committed werden.

Diese beiden Punkte sind technische Betriebsgrenzen, keine Erlaubnis, Struktur-, Test- oder Qualitätsregeln zu umgehen.
