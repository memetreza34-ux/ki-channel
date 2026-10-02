# Studio — Arbeitsvertrag

Hier entstehen alle neuen Videos: Erklärvideos, Reels/Shorts/TikToks, YouTube-Videos, Werbung.
`ki/` ist der Altbestand (bisherige Reels + Prüfsystem) und wird nur angefasst, wenn Arman es ausdrücklich sagt.

Mit Arman auf Deutsch, kurz und klar.

## Ablauf

1. **Briefing klären:** Thema, Kernaussage in einem Satz, Format, Länge, Plattform. Fehlt etwas Wichtiges → fragen, sonst sinnvoll annehmen und sagen.
2. **Projekt anlegen:** `npm run neu -- <slug> [vertical|landscape|square|portrait]` für Erklärvideos, `npm run neu -- <slug> --vorlage=werbung` für Werbeclips (gleich in 9:16, 1:1 und 4:5). Dann `skript.md` füllen (Hook, Sprechertext, Szenen, Fakten mit Quelle).
3. **Fakten prüfen:** KI-News, Modelle, Preise, Limits ändern sich ständig → im Web prüfen, Quelle + Datum in `skript.md`.
4. **Szene für Szene bauen.** Nach jeder Szene: `npm run look -- <ID> --range=<von>-<bis> --count=6` und die Bilder **ansehen**. Erst weiter, wenn die Szene gut aussieht.
5. **Ganzes Video prüfen:** `npm run look -- <ID> --count=18`, dann selbst kritisieren oder den Agenten `video-kritiker` drüberschauen lassen. Fehler beheben, erneut ansehen.
6. **Voiceover** spricht Arman selbst ein (keine KI-Stimme). Datei liegt in `studio/public/projekte/<slug>/voiceover.mp3|wav` → `npm run untertitel -- <slug>` → Szenenzeiten an die echten Wortzeiten anpassen → `VOICEOVER` im Projekt setzen. Untertitel gegen das Skript gegenlesen.
7. **Musik** liefert Arman (z. B. YouTube Audio Library) als `studio/public/projekte/<slug>/musik.mp3` → `MUSIK` setzen; `<Music>` senkt sie unter der Stimme automatisch ab. Für TikTok/Instagram oft besser ohne Musik rendern und den Trend-Sound in der App wählen – vorher fragen.
8. **Rendern:** `npm run render -- <ID>` → `studio/out/<ID>.mp4` (bei Werbung jedes Format: `<ID>`, `<ID>-square`, `<ID>-portrait`). Cover/Thumbnail: `npm run still -- <ID> --frame=<n>`. Stichproben ansehen, dann Arman schicken.

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
| `LineChart`, `Donut` | Kurve zeichnet sich, Ring füllt sich mit mitzählender Prozentzahl |
| `Checklist`, `Steps` | Punkte werden abgehakt (oder durchgekreuzt) · nummerierte Schritte mit Verbindungslinie |
| `BeforeAfter` | Vorher/Nachher mit wischender Trennlinie |
| `ScreenFocus` | Zoomt in Screenshot/Bildschirmaufnahme/Mockup auf eine Stelle, Rest abgedunkelt |
| `PunchText` | Werbe-Knaller: ein Wort pro Schlag, passt sich automatisch der Breite an |
| `Sticker` | Störer „NEU“/„GRATIS“ mit Wackeln |
| `EndCard` | Abspann mit pulsierendem Knopf (Kanalname/Logo optional, sobald festgelegt) |
| `Scenes`, `scenesDuration` | Szenenfolge mit Übergängen: `cut` (Standard), `fade`, `slide-up/-down/-left/-right`, `wipe`, `zoom` |
| `Music` | Hintergrundmusik mit Ein-/Ausblenden und automatischem Absenken unter der Stimme |
| `CameraRig`, `Cursor` | Kamerafahrt (Zoom/Schwenk), Mauszeiger mit Klick |
| `Sfx` | Sound an einem Frame, 41 Stück (Liste in `SFX_FILES`, anhören: Composition `Sound-Katalog`) |
| `useLayout` | Maße/sichere Zone des aktuellen Formats; `u` skaliert Größen für andere Formate mit |
| `progress`, `pop`, `visible`, `stagger`, `mix` | Zeitachsen-Helfer (`kit/motion.ts`) |

- **Icons:** `import {Brain} from 'lucide'` (≈1.500 Stück, Namen auf lucide.dev/icons) → `<Icon icon={Brain} />` / `<IconBadge icon={Brain} />`. Achtung: Namen wie `Phone`, `Terminal`, `Camera` gibt es auch als Icon – die Mockups heißen deshalb `PhoneMockup` usw.
- **Logos:** `import {siClaude, siGooglegemini} from 'simple-icons'` → `<BrandLogo logo={siClaude} tile />`. OpenAI/ChatGPT und Microsoft sind dort **nicht** enthalten → Namen als Text oder `Pill`, Logo nie nachzeichnen.
- **Schriften:** `FONT.sans` (Inter) für alles, `FONT.display` (Bebas Neue, nur Großbuchstaben) für Werbe-Knaller/Sticker, `FONT.mono` (JetBrains Mono) für Code.
- **Sounds nach Zweck:** Klick/Bedienung `click tap key typing hover toggle` · Erscheinen `pop blip whoosh whooshFast swipe swipeOut slideIn swoosh` · Gewicht `impact thud punch punchHeavy boom tink bell` · Ergebnis `success successBig notify ding chime levelUp question error wrong` · Spannung/Technik `riser riseShort fall reveal glitch think computing energy` · Jingles `jingleSteel jinglePizzi jingleHit`. Arman hat sie noch nicht alle gehört – unpassende Sounds aus `studio/assets-roh/kenney/` (lokal, alle 6 Kenney-Pakete) ersetzen.
- **Mehrere Formate:** `format: ['vertical', 'square', 'portrait']` im Projekt. Dann Layout mit `SafeArea` und `useLayout().u` bauen statt mit festen Pixelpositionen.
- **Weitere Remotion-Pakete** sind installiert: `@remotion/transitions`, `paths`, `shapes`, `noise`, `layout-utils` (Text einpassen), `motion-blur`, `three`, `lottie`, `captions`.
- **Neuer Baustein:** erst im Projekt bauen. Wird er ein zweites Mal gebraucht → ins Kit verschieben und im `Kit-Katalog` zeigen (`npm run look -- Kit-Katalog`).
- Referenzen (so soll es mindestens aussehen): `Kit-Katalog`, `Kit-Katalog-Erklaeren`, `So-Antwortet-KI` (Erklärvideo), `Werbung-Demo` (Werbeclip in 3 Formaten).

## Werbeclips

- Aufbau 10–15 s: Knaller-Hook (≤ 2 s) → Problem → Lösung/Nutzen → Handlungsaufforderung. Vorlage: `--vorlage=werbung`.
- Ein Gedanke pro Szene, viel Tempo, wenig Text. Übergänge dürfen hier häufiger sein als im Erklärvideo, aber nie zwei Texte übereinander überblenden (`slide`/`zoom` statt `fade` zwischen Textszenen).
- Keine Versprechen ohne Beleg („gratis“, „x-mal schneller“, Preise). Kanalname/Handle/Logo erst verwenden, wenn Arman sie festgelegt hat.

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
