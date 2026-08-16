# KI-Channel — kanonischer Repository-Stand

**Status:** 2026-08-16

Diese Datei ist der Einstiegspunkt für jeden neuen Chat, Codex-, Antigravity- oder anderen Coding-Agenten.

## 1. Kanonischer Branch

`main` ist der einzige kanonische Produktionsstand.

Andere `feature/*`, `fix/*`, `codex/*` und `backup/*` Branches sind Historie, Sicherungen oder frühere Arbeitsstände. Sie dürfen nicht als aktuelle Wahrheit verwendet werden, außer der Nutzer nennt einen solchen Branch ausdrücklich.

Neue normale Änderungen starten von `main` auf einem neuen Arbeitsbranch. `main` wird nicht direkt verändert, außer der Nutzer verlangt ausdrücklich eine Repository-Stabilisierung oder Kanonisierung.

## 2. Verbindliche Lesereihenfolge

Bei KI-Kanal-Arbeit gilt:

1. `REPO-STATE.md`
2. `AGENTS.md`
3. `ki/AGENTS.md`
4. `ki/gehirn/MASTER.md`
5. danach die passende Domäne:
   - Reel-Arbeit → `ki/reels/AGENTS.md`
   - YouTube Longform → `ki/youtube-longform/AGENTS.md`
   - Plattform/Publishing → `ki/gehirn/PLATTFORMEN.md` + `ki/plattformen/AGENTS.md`
6. das ausdrücklich genannte Reel/Longform-Video/Format und dessen nächstes `AGENTS.md`
7. erst danach konkrete Pläne, Source- oder Plattformdateien

Für ausführbaren Source gelten zusätzlich die nächstliegenden Source-Verträge:

- Reels → `ki/src/reels/AGENTS.md`
- Longform → `ki/src/longform/AGENTS.md`

Ältere Dokumente, alte PR-Beschreibungen und historische Branches dürfen diese Reihenfolge nicht überschreiben.

## 3. Kanonische Short-Form-Produktionsstruktur

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

## 4. Kanonische YouTube-Longform-Struktur

YouTube Longform ist seit 2026-08-16 als eigenes Produktionsformat aktiv.

Produktionspakete liegen hier:

```text
ki/youtube-longform/YYYY-MM-DD/NN_Video-Titel/
├── README.md
├── 01-script-audio/
├── 02-visuals/
├── 03-thumbnail/
├── 04-metadata/
├── 05-export/
└── 06-projektdateien/
```

Ausführbarer Source:

```text
ki/src/longform/<slug>/
```

Aktive Startvorgabe:

- 1920 × 1080
- 30 FPS
- 16:9
- finale Laufzeit nach echtem Voiceover: 5:00–6:00 Minuten
- `REMOTION_NATIVE_MAXIMUM`
- Thumbnail als eigene Composition

Aktives erstes Video:

```text
ki/youtube-longform/2026-08-16/01_Mit-KI-eine-App-bauen/
```

Video-Composition: `KI-Longform-AIAppWorkflow`
Thumbnail-Composition: `KI-Longform-AIAppWorkflow-Thumbnail`

## 5. Plattform-/Publishing-Struktur

Plattformlogik liegt hier:

```text
ki/plattformen/
├── youtube/
├── instagram/
├── tiktok/
├── facebook/
└── snapchat/
```

Diese Ordner enthalten **Publishing-Regeln und Templates, keine zweite Produktionswahrheit**.

Short-Form wird einmal produziert. YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat dürfen denselben freigegebenen Master verwenden. Plattform-spezifische Copy eines Reels gehört nach:

```text
03-caption/platform-copy.md
```

YouTube Longform ist ein separates Format unter `ki/youtube-longform/` und wird nicht automatisch aus Reels erzeugt.

Details: `ki/gehirn/PLATTFORMEN.md` und `ki/plattformen/`.

## 6. Verbindliches 3-Phasen-Modell

Für Short-Form und Longform gilt derselbe Verantwortungsrahmen:

```text
PHASE 1 — ChatGPT
Idee + Fakten + Skript + Copy-Text + Szenen/Kapitel + Visual Beats + Visual-/Asset-Entscheidungen + Packaging + Remotion-Code-Grundlage + Checks

PHASE 2 — Mensch
nur das echte Voiceover erzeugen und in 01-script-audio ablegen

PHASE 3 — Codex / Antigravity
Audio integrieren + echte Timeline synchronisieren + Tests + Smoke-Review + Final-Render + Export
```

Codex oder Antigravity bauen in Phase 3 ein bereits Phase-1-fertiges Format nicht neu von Null.

Fehlt Audio in Phase 3: exakt `PHASE 2 AUDIO FEHLT`.

## 7. Verbindliche visuelle Identität

- Short-Form standardmäßig 1080 × 1920 / 30 FPS
- Longform aktuell 1920 × 1080 / 30 FPS
- heller editorialer Look
- dunkle Schrift
- Marken-Lila `#B98CFF` als primärer Akzent
- dunkles Lila `#6E45C9` für Tiefe/Kontrast
- faceless, keine erkennbaren Gesichter
- keine Cyberpunk-/Neon-Standardästhetik
- `REMOTION_NATIVE_MAXIMUM`: sichtbare Inhalte so weit wie technisch und gestalterisch sinnvoll in React/SVG/CSS/Canvas/WebGL/Remotion bauen
- externe Bilder nur als begründete Ausnahme; keine erfundenen Assets
- Sprechertext, Caption/Untertitel, Überschrift und Animation haben unterschiedliche Aufgaben und dürfen sich nicht unnötig wiederholen
- Plattformtitel/Thumbnail dürfen niemals mehr versprechen als der Inhalt liefert

Details: `ki/gehirn/MASTER.md`, `ki/gehirn/REELS.md`, `ki/gehirn/PLATTFORMEN.md`, `ki/BILDSTIL.md`, `ki/reels/REMOTION_NATIVE_VISUALS_MAXIMUM.md`.

## 8. Statusbegriffe niemals vermischen

Diese Zustände sind getrennt:

```text
geplant
implementiert
technisch getestet
gerendert
visuell geprüft
freigegeben
veröffentlicht
```

Nur tatsächlich ausgeführte Prüfungen dürfen als bestanden gemeldet werden. `veröffentlicht` bedeutet nicht automatisch `fachlich freigegeben`, wenn der Freigabeprozess übersprungen wurde.

## 9. Bekannte externe Einschränkungen

- GitHub Actions ist für dieses private Repository derzeit auf Konto-/Billing-/Runner-Ebene blockiert und deshalb kein aktueller Beweis für Codequalität.
- Ein `package-lock.json` ist noch nicht kanonisch erzeugt. Bis ein echter npm-Installationslauf möglich ist, darf kein erfundener Lockfile-Inhalt committed werden.

Diese beiden Punkte sind technische Betriebsgrenzen, keine Erlaubnis, Struktur-, Test- oder Qualitätsregeln zu umgehen.
