# Assets — KI-Kanal

Lizenz-Log pro Datei. Große Dateien (`*.mp3/*.ogg/*.mov/*.wav`) bleiben lokal (gitignored) — nur diese Tabelle + Nutzung im Code kommen ins Repo.

## sfx/ — Kern-SFX-Set (2026-07-18, Kenney.nl "Interface Sounds", CC0, kostenlos)

Kein ElevenLabs nötig. Erster Versuch mit einzeln von Mixkit-Kategorieseiten geratenen Sounds war
schlecht (nicht kuratiert, Treffer unpassend) — stattdessen das kuratierte, sauber benannte
**Kenney.nl "Interface Sounds"-Pack** verwendet (kenney.nl/assets/interface-sounds, CC0-Lizenz,
88 Sounds, klar benannt nach Funktion: click/error/glitch/confirmation/select/switch/…).
**Keine Musik, keine Meme-Sounds.**

| Datei (unser Name) | Quelle (Kenney-Datei) | Zweck |
|---|---|---|
| `click-ui.ogg` | click_001.ogg | UI-Klick (Buttons/Icons) |
| `click-key.ogg` | click_003.ogg | Tasten-Klick (Tippen) |
| `whoosh-soft.ogg` | open_002.ogg | weicher Übergang / Mockup fährt rein |
| `whoosh-digital.ogg` | maximize_003.ogg | schnellerer Tech-Übergang |
| `pop-soft.ogg` | drop_002.ogg | Element poppt auf |
| `chime-success.ogg` | confirmation_001.ogg | Erfolg/Haken/Bestätigung |
| `chime-notification.ogg` | bong_001.ogg | Chat-Antwort kommt an |
| `impact-soft.ogg` | close_002.ogg | Badge/Stempel landet |
| `riser-tension.ogg` | scratch_002.ogg | Spannungsaufbau vor Reveal |
| `glitch-blip.ogg` | glitch_002.ogg | Token-/Daten-Verarbeitung |
| `error-buzz.ogg` | error_003.ogg | falsche Antwort / durchgestrichen |
| `keyboard-loop-texture.ogg` | tick_002.ogg | Tipp-Textur-Bett |
| `ai-thinking-pulse.ogg` | scroll_003.ogg | KI-Verarbeitungs-Puls |
| `reveal-swell.ogg` | select_006.ogg | Tool-/Zahlen-Reveal |

**Kenney CC0-Lizenz** (kenney.nl/docs/license, auch als "Creative Commons Zero"): komplett gemeinfrei,
keine Attribution nötig, uneingeschränkte kommerzielle Nutzung inkl. YouTube-Monetarisierung.

**Noch nicht von Arman gegengehört** — Auswahl über Kenney-Dateinamen getroffen (klar benannt, kuratiertes
Pack), aber vor dem ersten echten Reel-Einsatz kurz per Player bestätigen.

**Zuordnung zu Bausteinen:** `channels/ki/bausteine/sfx-map.ts` (Dateiendungen dort auf `.ogg` aktualisiert).
Nutzung via `<Sfx>` aus `@studio/core`, siehe `core/gehirn/SOUND.md`.

## fonts/
Inter (400/600/700/800/900), Bebas Neue (400) — geteilt aus `core`, siehe `public/fonts/`.

**Kein Musik-Bett aktuell.**
