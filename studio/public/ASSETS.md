# Assets im Studio – Herkunft und Lizenz

| Ordner/Datei | Herkunft | Lizenz |
|---|---|---|
| `fonts/Inter-*.woff2` | aus `ki/public/fonts` (Inter, Rasmus Andersson) | SIL Open Font License 1.1 |
| `fonts/BebasNeue-400.woff2` | aus `ki/public/fonts` (Bebas Neue, Dharma Type) | SIL Open Font License 1.1 |
| `fonts/JetBrainsMono-*.woff2` | npm `@fontsource/jetbrains-mono` 5.x, Latin-Subset | SIL Open Font License 1.1 |
| `sfx/*.ogg` (14 alte) | aus `ki/public/sfx` – Kenney.nl „Interface Sounds“, Zuordnung siehe `ki/public/ASSETS.md` | CC0 |
| `sfx/*.ogg` (27 neue, 2026-10-02) | Kenney.nl: Interface Sounds, UI Audio, Digital Audio, Impact Sounds, Sci-fi Sounds, Music Jingles – mit Armans Freigabe geladen, Zuordnung unten | CC0 |

Neue Sounds (unser Name ← Kenney-Paket/Datei):

| Name | Quelle |
|---|---|
| tap | ui-audio/click2 |
| hover | ui-audio/rollover3 |
| toggle | interface-sounds/toggle_002 |
| swipe / swipe-out / slide-in | interface-sounds/maximize_002 / minimize_002 / maximize_005 |
| blip | interface-sounds/select_003 |
| success-big | interface-sounds/confirmation_004 |
| question / wrong | interface-sounds/question_001 / error_006 |
| ding / chime | digital-audio/twoTone1 / threeTone1 |
| level-up / rise-short / fall | digital-audio/powerUp12 / phaserUp3 / phaserDown1 |
| punch / punch-heavy / thud | impact-sounds/impactPunch_medium_001 / impactPunch_heavy_000 / impactSoft_heavy_001 |
| tink / bell | impact-sounds/impactGlass_light_002 / impactBell_heavy_002 |
| boom / computing / swoosh / energy | sci-fi-sounds/lowFrequency_explosion_001 / computerNoise_002 / doorOpen_001 / forceField_000 |
| jingle-steel / jingle-pizzi / jingle-hit | music-jingles/STEEL01 / PIZZI14 / HIT03 |

Die vollständigen sechs Pakete (mit `License.txt`) liegen lokal in `studio/assets-roh/kenney/` (nicht im Git) – zum Austauschen einzelner Sounds.

| `fonts/SpaceGrotesk-*`, `ArchivoBlack-400`, `Fraunces-*`, `Caveat-*`, `Nunito-*` | npm `@fontsource/*` 5.x, Latin-Subset (Designs nacht/pop/papier/pastell) | SIL Open Font License 1.1 |
| `lottie/emoji/*.json` (41) | Google Noto Emoji Animation, fonts.gstatic.com/s/e/notoemoji/latest/<code>/lottie.json, mit Armans Freigabe am 2026-10-02 geladen | **CC BY 4.0 – Namensnennung nötig:** „Animierte Emojis: Google Noto, CC BY 4.0“ in die Videobeschreibung |
| `lottie/ui/*.json` (79) | npm `react-useanimations` 2.10 (`lib/<name>/<name>.json`) | MIT |

| `beispiel/standbild.jpg` | eigener Render (Composition `Design-Katalog`) – Testbild für Footage/ScreenFocus | eigenes Material |
| `beispiel/illustration-test.svg` | selbst gezeichnet im unDraw-Farbschema – Test für `Illustration` | eigenes Material |
| `projekte/<slug>/broll/*` | Pixabay über `npm run broll` – Quelle je Datei in `studio/projekte/<slug>/quellen.md` | Pixabay Content License (frei, ohne Namensnennung) |

Icons und Logos kommen nicht als Dateien, sondern aus npm-Paketen (werden beim Rendern nur bei Bedarf geladen):

- `lucide` – ISC
- `@iconify-json/ph` (Phosphor) – MIT
- `@iconify-json/tabler` – MIT
- `@iconify-json/fluent-emoji-flat` (Microsoft Fluent Emoji) – MIT
- `@iconify-json/logos` (SVG Logos) – CC0 für die SVG-Daten
- `simple-icons` – CC0 für die SVG-Daten

Bei allen Firmenlogos gehören die Marken ihren Inhabern: nur redaktionell verwenden (Produkt wird genannt/erklärt), nie verändert oder als eigenes Zeichen.

Projekt-Audio (`projekte/<slug>/voiceover.*`) bleibt lokal und wird nicht committet.

## Ergänzungen 2026-11-08

| Pfad | Quelle | Lizenz |
|---|---|---|
| `sfx/vorbild/*.ogg` (11) | eigene Synthese, `studio/scripts/sounds-vorbild.py` | eigen |
| `sfx/vorbild/metall.ogg`, `glas.ogg` | Kenney.nl Impact Sounds (`impactMetal_heavy_001`, `impactGlass_medium_000`) | CC0 |
| `modelle/kenney/auto/*.glb` (13 + Textures) | Kenney.nl Car Kit 3.1, mit Armans Freigabe am 08.11. geladen (4,8 MB), komplettes Paket in `studio/assets-roh/kenney-3d/car-kit/` | CC0 |
| `modelle/kenney/natur/*.glb` (28) | Kenney.nl Nature Kit 2.1, mit Armans Freigabe am 08.11. geladen (10,5 MB), komplettes Paket in `studio/assets-roh/kenney-3d/nature-kit/` | CC0 |
| `modelle/kenney/moebel/*.glb` (24) | Kenney.nl Furniture Kit 2.0, mit Armans Freigabe am 08.11. geladen (5,1 MB), komplettes Paket in `studio/assets-roh/kenney-3d/furniture-kit/` | CC0 |
