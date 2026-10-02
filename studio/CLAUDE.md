# Studio — Arbeitsvertrag

Hier entstehen alle neuen Videos: Erklärvideos, Reels/Shorts/TikToks, YouTube-Videos, Werbung.
`ki/` ist der Altbestand (bisherige Reels + Prüfsystem) und wird nur angefasst, wenn Arman es ausdrücklich sagt.

Mit Arman auf Deutsch, kurz und klar.

## Ablauf

1. **Briefing klären:** Thema, Kernaussage in einem Satz, Format, Länge, Plattform. Fehlt etwas Wichtiges → fragen, sonst sinnvoll annehmen und sagen.
2. **Projekt anlegen:** `npm run neu -- <slug> [vertical|landscape|square|portrait]` und `skript.md` füllen (Hook, Sprechertext, Szenentabelle, Fakten mit Quelle).
3. **Fakten prüfen:** KI-News, Modelle, Preise, Limits ändern sich ständig → im Web prüfen, Quelle + Datum in `skript.md`.
4. **Szene für Szene bauen.** Nach jeder Szene: `npm run look -- <ID> --range=<von>-<bis> --count=6` und die Bilder **ansehen**. Erst weiter, wenn die Szene gut aussieht.
5. **Ganzes Video prüfen:** `npm run look -- <ID> --count=18`, dann selbst kritisieren oder den Agenten `video-kritiker` drüberschauen lassen. Fehler beheben, erneut ansehen.
6. **Voiceover** (von Arman) liegt in `studio/public/projekte/<slug>/voiceover.mp3|wav` → `npm run untertitel -- <slug>` → Szenenzeiten an die echten Wortzeiten anpassen → `VOICEOVER` im Projekt setzen. Untertitel gegen das Skript gegenlesen.
7. **Rendern:** `npm run render -- <ID>` → `studio/out/<ID>.mp4`. Stichproben ansehen, dann Arman schicken.

Ohne angesehene Bilder gilt nichts als fertig. Ein bestandener Typecheck sagt nichts über Qualität.

## Was gute Motion hier ausmacht

- **Eine Aussage pro Szene**, ein klarer Blickfang. Die Fläche nutzen: im Hochformat liegt der Hauptinhalt zwischen y≈300 und y≈1450; Ränder laut `SAFE` in `kit/theme.ts` frei halten (Plattform-Buttons, Beschreibung).
- **Groß genug fürs Handy:** Überschrift 90–120 px, Labels ≥ 40 px, nichts unter 28 px (Hochformat, 1080 breit).
- **Bewegung erklärt etwas:** Zustand A → sichtbare Veränderung → Zustand B. Keine Deko-Bewegung, keine Farbflächen ohne Bedeutung, nichts nur „damit sich was bewegt“.
- **Gruppen gestaffelt** (`stagger`), nie alles gleichzeitig. Kurven aus `EASE` / `SPRING`. Linear nur für gleichmäßigen Takt (Tippen, Text-Stream) und Endlos-Schleifen.
- **Frame 0 zeigt schon etwas** – der Hook muss sofort stehen.
- **Kontinuität vor Effekt:** dasselbe Objekt über Szenen weiterführen (z. B. Kamera zoomt ins Handy → nächste Szene startet im Zoom). Sonst harter Schnitt.
- **Text-Rollen:** Überschrift (3–7 Wörter) ordnet ein · Untertitel = gesprochener Text · Labels kurz · nie denselben Satz zweimal im Bild.
- **Ton:** Soundeffekte leise (0,3–0,5) und nur an echten Ereignissen (Klick, Ankunft, Ergebnis).
- **Look:** hell, dunkle Schrift, Lila-Akzent (`COLORS`), faceless.

## Kit (`studio/kit`, Import aus `'../../kit'`)

| Baustein | Wofür |
|---|---|
| `Background` | Bühne: Grundfarbe, treibende Farbwolken, Punktraster (`light`/`dark`/`accent`) |
| `SafeArea` | Inhalt automatisch in die sichere Zone des Formats setzen |
| `Headline`, `BodyText`, `Pill`, `Marker` | Überschrift Wort für Wort mit Highlight/Marker, Fließtext, Kapitel-Label, Leuchtmarker |
| `Caption` / `CaptionTrack` | Untertitel als Satz / wortgenau zum Voiceover (`untertitel.json`) |
| `Icon`, `IconBadge`, `BrandLogo` | Icons zeichnen sich, Icon auf Kachel, Firmenlogos |
| `Arrow` | gezeichneter Pfeil zwischen zwei Punkten, optional Datenfluss (`flow`) |
| `ChatBubble`, `StreamText`, `TypingDots` | KI-Chat: Tipp-Punkte, Antwort Wort für Wort |
| `PhoneMockup`, `BrowserMockup`, `TerminalMockup` | Geräte/Fenster (neutral, kein echtes Markengerät) |
| `Counter`, `BarList`, `TokenChips` | Zahl zählt hoch, Balken/Rangliste mit Gewinner, Text → Tokens |
| `CameraRig`, `Cursor` | Kamerafahrt (Zoom/Schwenk), Mauszeiger mit Klick |
| `Sfx` | Sound an einem Frame: `click`, `pop`, `whoosh`, `success`, `notify`, `typing`, `reveal`, `glitch`, `error`, `think`, `riser`, `impact` … |
| `progress`, `pop`, `visible`, `stagger`, `mix` | Zeitachsen-Helfer (`kit/motion.ts`) |

- **Icons:** `import {Brain} from 'lucide'` (≈1.500 Stück, Namen auf lucide.dev/icons) → `<Icon icon={Brain} />` / `<IconBadge icon={Brain} />`. Achtung: Namen wie `Phone`, `Terminal`, `Camera` gibt es auch als Icon – die Mockups heißen deshalb `PhoneMockup` usw.
- **Logos:** `import {siClaude, siGooglegemini} from 'simple-icons'` → `<BrandLogo logo={siClaude} tile />`. OpenAI/ChatGPT und Microsoft sind dort **nicht** enthalten → Namen als Text oder `Pill`, Logo nie nachzeichnen.
- **Weitere Remotion-Pakete** sind installiert: `@remotion/transitions`, `paths`, `shapes`, `noise`, `layout-utils` (Text einpassen), `motion-blur`, `three`, `lottie`, `captions`.
- **Neuer Baustein:** erst im Projekt bauen. Wird er ein zweites Mal gebraucht → ins Kit verschieben und im `Kit-Katalog` zeigen (`npm run look -- Kit-Katalog`).
- `Kit-Katalog` und `So-Antwortet-KI` sind Referenzen: so soll es mindestens aussehen.

## Wahrheit & Medien

- Keine erfundenen Zahlen oder Fakten. Beispielwerte sichtbar als „Beispiel“ kennzeichnen.
- Keine KI-generierten Bilder, Videos oder Stimmen ohne Armans ausdrückliche Freigabe für genau dieses Video. Erlaubt ohne Rückfrage: Code-Grafik (React/SVG), lucide, simple-icons, die Kenney-CC0-Sounds in `public/sfx`, Dateien von Arman.
- Nachgebaute App-Oberflächen sind Illustration – nie als echten Screenshot ausgeben.
- Nur melden, was wirklich passiert ist: gebaut ≠ gerendert ≠ angesehen ≠ freigegeben.

## Technik

- Composition-ID = Projektname in `projekte/<slug>/Video.tsx` (`projekt.id`), registriert in `projekte/index.ts`.
- Deterministisch rendern: kein `Math.random()`, keine Netzwerkaufrufe im Video, Assets nur über `staticFile()` aus `studio/public`.
- `npm run studio` startet Remotion Studio zum Durchklicken. `npm run studio:check` = Typecheck.
- Renders (`studio/out`), Audio und `whisper.cpp/` bleiben lokal (gitignored).
- Git: Arbeitsbranch, kein Push/Merge nach `main` ohne Armans OK.
