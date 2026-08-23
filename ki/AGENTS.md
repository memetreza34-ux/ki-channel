# KI-Channel — Regeln unter `ki/`

Diese Datei erweitert `REPO-STATE.md` und `AGENTS.md`.

## Gehirn zuerst

Für jede KI-Aufgabe zuerst `ki/gehirn/MASTER.md` lesen. Es verweist auf die autoritativen Bereiche:

- `KANAL.md` — Identität und Ton
- `REELS.md` — Reel- und Text-Hierarchie
- `PLATTFORMEN.md` — Publishing, YouTube und weitere Plattformen
- `PRODUKTIONSABLAUF.md` — 3 Phasen
- `../BILDSTIL.md` — Bild-/Prompt-Qualität

Danach den passenden Produktionsvertrag lesen:

- Short-Form → `ki/reels/AGENTS.md`
- YouTube Longform → `ki/youtube-longform/AGENTS.md`

Für **jedes Short-Form-Reel** sind zusätzlich diese fünf Repo-Skills Pflichtlektüre:

- `ki/skills/entertainment-first-reels/SKILL.md` — UI-/Brand-first, Mini-Story, Hero-Momente, Entertainment-Score
- `ki/skills/high-energy-remotion-reels/SKILL.md` — visuelle Dichte, Full-Frame-Motion, Kamera, Tiefe, Logo-/Bildanimation
- `ki/skills/voice-locked-captions/SKILL.md` — echtes Audio als Autorität für Caption, Wort-Timing, Visual Beat und Szenengrenzen
- `ki/skills/final-video-delivery/SKILL.md` — finale Abgabe erst nach vollständigem Render-, Audio- und Hör-Gate; keine stumme Preview als fertiges Video
- `ki/skills/final-export-package/SKILL.md` — nach finalem Render automatisch vollständiges `05-export/`-Paket mit MP4 + Cover + Caption + Manifest erzeugen und validieren

## Harte Short-Form-Ordnerstruktur

Jedes Produktionsreel liegt dauerhaft hier:

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

Nicht zulässig:

```text
ki/<reel-name>/
ki/reels/<slug>/
ki/src/reels/<planning-package>/
```

Vor und nach Strukturänderungen:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

## Datei-Eigentum Short-Form

- `01-script-audio/` — Skript, Copy-Fließtext, echtes Voiceover, Transcript/Timing
- `02-bilder/` — Bildentscheid, hochwertige Prompts, Asset-Manifest, Bilder/Layers/Masks
- `03-caption/` — Subtitle-Cues, Wort-Timestamps, `platform-copy.md` und kanonische `FINAL-CAPTION.txt`
- `04-pdf/` — optionale PDF-Assets
- `05-export/` — Review-Artefakte plus **finales Publish-Paket: MP4 + Cover + Caption + Manifest**
- `06-projektdateien/` — `PHASE-STATUS`, `reel.json`, Szene/Animation, Assembly-Auftrag, `ENTERTAINMENT-REVIEW.md`, Review

Ausführbarer TS/TSX-Code ausschließlich separat:

```text
ki/src/reels/<slug>/
```

Keine Planungsdokumente in den Source-Ordner kopieren.

## Phasen

Für Short-Form gilt:

- Phase 1 muss **vor Audio** bereits Source-Code und Composition-Grundlage enthalten.
- Phase 1 darf Caption-/Szenen-Timings schätzen, aber diese Werte sind ausdrücklich nur Preview-/Planwerte.
- Phase 1 ist erst fertig, wenn `ENTERTAINMENT-REVIEW.md` mindestens **8/10** erreicht und keine Kategorie `0` hat.
- Wenn echtes Audio bereits im selben Auftrag erzeugt wird, darf direkt in Phase 3 übergegangen werden.
- Sobald echtes Audio vorliegt, ist **dieses Audio die Zeit-Autorität**: Wort-Timestamps, Caption-Gruppen, Visual Beats, Szenengrenzen und Composition-Dauer werden daran neu ausgerichtet.
- Ein proportionaler Caption-Fallback ist nur für Preview zulässig und darf nicht als finale Synchronisation durchrutschen.
- Bei einer verlangten **fertigen Video-Abgabe** darf der Agent die Aufgabe nicht nach einem Preview-/Smoke-Render beenden. Er arbeitet bis zum aktuellen finalen MP4 mit hörbarem Voiceover, bestandenen Audio-/Render-Gates, vollständigem Export-Paket und finaler Hör-/Sichtprüfung weiter. Erst dann wird das Video gezeigt und die Aufgabe beendet.

Für Production-Captions nach echtem Audio ausführen:

```bash
node ki/scripts/validate-voice-locked-captions.mjs <reel-package-dir>
```

Vor jeder finalen Video-Abgabe:

```bash
node ki/scripts/validate-final-video.mjs <final-video.mp4>
```

Ein fehlender oder praktisch stummer Audiostream blockiert die finale Abgabe **und blockiert den Export in `05-export/`**.

## Automatischer Final-Export — Pflicht

Wenn ein Reel final gerendert wurde, darf Antigravity/Codex **nicht** bei `render complete` stoppen.

Verpflichtende Reihenfolge:

1. finalen MP4 aus aktuellem Source rendern
2. `validate-final-video.mjs` erfolgreich ausführen
3. nach Contact-Sheet-/Hero-Review `reel.json -> export.coverTimeSeconds` setzen
4. `03-caption/FINAL-CAPTION.txt` publish-ready vervollständigen
5. Finalize-Befehl ausführen:

```bash
node ki/scripts/finalize-reel-export.mjs <reel-package-dir> <rendered-video.mp4>
```

6. vollständiges Paket prüfen:

```bash
node ki/scripts/validate-reel-export-package.mjs <reel-package-dir>
```

7. den **exportierten** MP4 unter `05-export/` vollständig ansehen und anhören
8. Cover und Caption visuell/inhaltsseitig prüfen
9. erst dann `FINAL VIDEO READY — EXPORT PACKAGE READY`

Kanonischer Finalzustand:

```text
05-export/
├── <compositionId>.mp4
├── <compositionId>-cover.png
├── <compositionId>-caption.txt
└── <compositionId>-export-manifest.json
```

Ein MP4 außerhalb dieses Pakets ist nur Arbeitsware. Ein stummer MP4 darf niemals als finale Datei in `05-export/` landen.

## Visual Standard

- heller oder weißer editorialer Hintergrund ist erlaubt, darf aber nicht wie tote Leerfläche wirken
- dunkle, formatgerecht lesbare Typografie
- `#B98CFF` primärer Fokus-Akzent
- `#6E45C9` Tiefe/Kontrast
- faceless
- keine generische Cyberpunk-/Neon-Ästhetik
- `REMOTION_NATIVE_MAXIMUM`: möglichst alles Sichtbare direkt mit React/SVG/CSS/Canvas/WebGL/Remotion bauen
- **Product/UI-first:** bei Apps, Websites, Plattformen oder Features zuerst produktnahe UI-/Device-/Browser-Szenen prüfen; generische Kreise/Nodes sind kein Default
- jede Szene als Mini-Story planen: **Setup → Aktion → Konsequenz → Payoff**
- jede Szene braucht mindestens einen erkennbaren Hero-Moment
- Hauptmechanik auf Smartphone groß und dominant; keine kleine Card-Insel in riesigem Leerraum
- solange neue Sprecherbedeutung kommt, ungefähr alle `0.6–1.5 s` einen semantischen sichtbaren Micro-Beat anstreben
- Full-Frame-Komposition, Kamera, Parallax, pseudo-3D, Masken, SVG-Pfade, Zustandswechsel und Transformationen aktiv prüfen
- nicht jede Szene frontal/mittig bauen; Kamera-Grammatik und räumliche Inszenierung bewusst variieren
- Logos/Markenassets nur als echte lokale zulässige Assets verwenden und aktuelle Markenrichtlinien respektieren; kein Fake-Logo und keine verbotene Markenmodifikation
- bei strengen Brand-Regeln die **Umgebung um das unveränderte Logo** animieren: Container, Position, Kamera, UI, Übergang, Hintergrund
- Bilder/Screenshots bei Relevanz mit Fokus-Zoom, Masken, 2.5D, Parallax, Cursor/Touch oder nativen Overlay-Ebenen in die Erklärung integrieren
- bei zu flachen Code-Visuals zuerst Komposition, Perspektive, Schatten, Tiefe und Layering verbessern
- externe Bilder/Medien nur als begründete Ausnahme und niemals erfinden
- keine erfundenen Zahlen

## Text-Hierarchie

- Überschrift/Kapitelmarker: kurz, Zuschauer-Sprache
- Short-Form-Caption: Sprechertext synchron
- Animationslabels: kurze Objekt-/Zustandsbegriffe
- interne Regie-/Goal-Texte: niemals sichtbar

Kein langer Sprechertext doppelt als Headline und Animationstext. Keine wortweise Kopie des Transcripts in die Animation.

## Testing

Mindestens formatbezogen prüfen:

- Format/FPS/Dauer
- kontinuierliche Szenenbereiche
- eindeutige IDs
- Asset-Pfade
- keine ungrounded Werte
- Visual-Safe-Zones über reale Smoke-Frames
- Packaging/Metadaten vorhanden
- `ENTERTAINMENT-REVIEW.md` vorhanden und Phase 1 mindestens 8/10 ohne 0-Kategorie
- bei produktbezogenen Reels: UI-/Brand-first-Entscheidung dokumentiert
- Contact-Sheet-/Scrub-Review zeigt echte visuelle Variation statt fünf ähnlicher Karten
- Hook ist auch ohne Ton in den ersten 1–2 Sekunden grob verständlich
- bei Phase 3: Caption-Worttimings gegen reales Audio validiert
- bei Phase 3: natürliche Sprechpausen erzeugen keine falschen aktiven Caption-Wörter
- bei Phase 3: Szenengrenzen liegen auf echten Sprecher-/Bedeutungsgrenzen
- bei finaler Video-Abgabe: Video- und Audiostream vorhanden
- bei finaler Video-Abgabe: Audio technisch nicht stumm/praktisch unhörbar
- bei finaler Video-Abgabe: finalen MP4 tatsächlich ansehen **und anhören**
- finaler Render gehört exakt zum aktuellen Source-Stand
- `03-caption/FINAL-CAPTION.txt` ist publish-ready und ohne Platzhalter
- `reel.json.export.coverTimeSeconds` ist nach Hero-Review gesetzt
- `finalize-reel-export.mjs` erfolgreich
- `validate-reel-export-package.mjs` erfolgreich
- finaler MP4, Cover, Caption und Manifest liegen im `05-export/`

Ein bestandenes Unit-Test-Set ersetzt keine visuelle oder akustische Prüfung.
