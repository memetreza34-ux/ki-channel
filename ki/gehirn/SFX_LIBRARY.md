# SFX-Bibliothek — kostenlos, lokal, kommerziell nutzbar

## Ziel

Reels sollen kleine passende Soundeffekte bekommen, ohne Lizenzrisiko und ohne Cloud-Abo.

Die automatische Standardbibliothek ist deshalb **CC0-only**.

## Kanonische Packs

| Pack | Offizielle Quelle | Dateien laut Quelle | Lizenz | Typische Nutzung |
|---|---|---:|---|---|
| Kenney UI Audio | https://kenney.nl/assets/ui-audio | 50 | CC0 1.0 | Klicks, Switches, kleine UI-Akzente |
| Kenney Interface Sounds | https://kenney.nl/assets/interface-sounds | 100 | CC0 1.0 | Confirm, Error, Open/Close, Buttons |
| Kenney Impact Sounds | https://kenney.nl/assets/impact-sounds | 130 | CC0 1.0 | Stempel, Hits, starke Reveal-Momente |
| Kenney Sci-fi Sounds | https://kenney.nl/assets/sci-fi-sounds | 70 | CC0 1.0 | Tech, Scan, Energie, Transitions |
| Kenney Digital Audio | https://kenney.nl/assets/digital-audio | 60 | CC0 1.0 | digitale Akzente, Riser, Übergänge |

Zusammen sind das ungefähr **410 Sounds**.

## Rechtlicher Standard

Automatisch eingebunden werden nur Packs, die:

1. in `ki/config/sfx-sources.json` explizit als `CC0-1.0` allowlisted sind,
2. eine offizielle Kenney-Quellseite besitzen,
3. beim Download zusätzlich eine `License.txt` enthalten, die CC0/Creative Commons Zero bestätigt.

Bei einem Widerspruch wird der Import abgebrochen.

CC0 bedeutet für diesen Workflow: kommerzielle Nutzung, Bearbeitung und Einbindung in monetarisierte Videos ohne verpflichtende Namensnennung. Trotzdem wird die Provenance im Index behalten.

## Lokale Installation

```bash
node ki/scripts/setup-reel-sfx-library.mjs
node ki/scripts/validate-reel-sfx-library.mjs
```

Das Setup lädt nur die fünf allowlisteten Kenney-Packs aus einem öffentlichen CC0-GitHub-Mirror, prüft die mitgelieferten Lizenztexte und konvertiert die Audiodateien deterministisch zu 48-kHz-Stereo-PCM-WAV.

Die offizielle Kenney-Seite bleibt die Lizenz-/Source-Autorität; der GitHub-Mirror ist nur Transportquelle.

## Runtime-Dateien

```text
public/reel-sfx/
├── kenney/
│   ├── kenney-ui-audio/
│   ├── kenney-interface-sounds/
│   ├── kenney-impact-sounds/
│   ├── kenney-sci-fi-sounds/
│   └── kenney-digital-audio/
├── licenses/
└── sfx-index.json
```

Diese Binärdateien sind lokale Runtime-Artefakte und werden nicht in Git committed.

`sfx-index.json` enthält pro Sound:

- Pack
- Originaldateiname
- lokale Runtime-Datei
- Dauer
- automatische Rolle/Kategorie
- Creator
- Lizenz
- offizielle Quellseite

## Rollen

Der Index klassifiziert Sounds grob in:

- `ui-click`
- `ui-toggle`
- `ui-confirm`
- `ui-error`
- `ui-open-close`
- `impact`
- `tech-accent`
- `transition-rise`
- `transition-down`
- `digital-accent`
- `ui-generic`
- `generic`

Die Rolle ist nur eine Vorauswahl. Vor einem finalen Reel muss der konkrete Sound im 1x-Review passend und nicht störend wirken.

## Lautstärke-Regel

SFX sind Unterstützung, nicht Hauptton:

- Voiceover bleibt klar dominant.
- UI-Klicks sehr leise.
- Impacts nur auf echte Hero-/Reveal-Momente.
- Keine Soundeffekt-Kette auf jedes einzelne Wort.
- Maximal etwa 1–2 unabhängige SFX-Ereignisse gleichzeitig.

## Nicht automatisch zulässig

Freesound, beliebige Google-Treffer oder unbekannte GitHub-Audiodateien werden **nicht** automatisch importiert. Sie brauchen jeweils eine eigene, überprüfte Lizenz-/Provenance-Freigabe.
