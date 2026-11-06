---
name: wissens-short
description: Produziert einen Allgemeinwissen-Short (9:16, 45–75 s) im Denkwürfel-Daten-Look – fester neugieriger Titel, ein sauberes Objekt oder Diagramm, echte Zahl mit Quelle. Verwenden, sobald Arman einen Wissens-Short, ein Fakten-Video, „Zahlen-Video“ oder ein neues Thema für den Kanal will („mach ein Short über …“, „wie viel …“, „so oft …“).
---

# Wissens-Short produzieren

Seit 2026-10-31 ist Denkwürfel ein **Allgemeinwissen-Kanal in Zahlen** (Format-Vorbild: Instagram „schraffuren“ – nie deren Name, Logo oder konkrete Themen übernehmen). Ältere Vorgaben (Toki, heller Kanal-Look, KI-only) gelten für Shorts nicht mehr.

Code: `studio/projekte/wissen/` – `bausteine.tsx` (Farben, Titel, Zähler, Puls, Auftritt, Globus), Beispiele `Szenen.tsx` (Blitze, Jeans, Erdbahn) und `Daten.tsx` (Strom pro ChatGPT-Frage).

## Ablauf (3 Phasen wie immer)

1. **Thema + Fakten:** eine überraschende Zahl, die man in *einem* Bild zeigen kann. Quelle + Datum aus Primärquelle (NASA, UN, Statistisches Bundesamt, Firmenangabe …). Eigene Rechnungen als „rund“ kennzeichnen und im Skript vorrechnen.
2. **Skript** (`kanal/shorts/<Mo>_bis_<So>/<thema>/audio/script.txt` + `LIES-MICH.txt`): Satz 1 = Titel als Frage/Behauptung, dann 4–7 Beats (Zahl → Mechanismus/Vergleich → Wendung → Pointe, letzter Satz führt in den Anfang zurück), 130–220 Wörter (≈ 180 Wörter/Minute), Regeln unter „Skript“ weiter unten. Danach aufhören – **Stimme nur Arman**, nie synthetisch.
3. **Video aus dem Audio:** Wortzeiten (`npm run untertitel`), Beats wortgenau legen, mit Bausteinen bauen, Probebilder prüfen, Agent `video-kritiker` laufen lassen, nachbessern, rendern, -14 LUFS.

## Look

**Text-Diät (Arman, 2026-11-02):** Das Bild erzählt, der Text kommt aus der Stimme (Wort-für-Wort-`Untertitel`). Pro Szene unter dem Titel nur Bild + **höchstens eine** große Zahl oder **ein** Label + winzige Quelle. Keine Erklärsätze, keine Panels mit mehreren Zeilen, keine Statuszeilen-Stapel. Requisiten mit Licht, Verlauf und Tiefe (Glas, Metall, Leuchten, Sternenhimmel) statt flacher Kästen. Referenz: `GPS-Rohschnitt`.


- Grund `BG #0E1424`, Text `HELL #F3EFE7`, **eine** Akzentfarbe `AKZENT #FF6B4A` (Schlüsselwort im Titel, Einheit, Höhepunkt), Nebeninfo `STAHL #8A93A8`.
- Titel oben (Space Grotesk 700, 92 px, max. 2 Zeilen), steht die ganze Szene.
- Zahlen in Inter 800 (nicht Space Grotesk – deren „1“ wirkt falsch), 170 px, Einheit in Akzent daneben.
- Quelle klein darunter (JetBrains Mono, 28 px, „QUELLE: …“), nie die Pointe vorwegnehmen.
- Ein Objekt in der Mitte, groß (≈ 60 % Breite), sauber gezeichnet mit Licht/Schatten – keine Clipart, keine Icon-Kacheln.

## Zwei Bildwelten – pro Video entscheiden (Arman, 2026-11-01)

Vorbilder: Instagram **schraffuren** (Welt) und **scroll.engineer** (Technik). Nur Format und Machart übernehmen, nie Name, Logo, Themen oder konkrete Videos.

| | **A · Welt** (schraffuren) | **B · Technik** (scroll.engineer) |
|---|---|---|
| Frage | „Wie viel / wie oft / wo?“ – Zahl, Vergleich, Gesellschaft, Geografie, Alltag | „Wie funktioniert …?“ – Mechanismus in Technik, Körper, Natur, Physik |
| Bild | kleine 3D-Welt schräg von oben (Kenney-Modelle, `Modell` aus `kit/Modell3D`), Abendlicht, Karte/Route | Kamera fliegt **in** das Objekt: Ego-Perspektive, Durchsicht/Röntgen, Schnitt, Explosionsansicht; Lehm-Look (einfache Formen, Dunst) oder dunkel-kinoreif |
| Text im Bild | Titel oben, große Zahl + Quelle | Callouts: Pille mit Linie + Kreis am Bauteil („Turbine“), Messwert-Panel live (z. B. „15 km/h · sonst 100“), Ecken-Tag `nachgebaut` / `Illustration` (Mono, klein) |
| Beispiel | `Zug-Probe-3D` | – |

- **Pro Video eine Hauptwelt** wählen und in `skript.md` begründen. Mischen pro Szene erlaubt, wenn es der Story dient: z. B. Welt für Einstieg und Zahl → Kamera taucht ins Objekt → Technik für den Mechanismus.
- Gemeinsam bleibt: Denkwürfel-Farben, eine Akzentfarbe, Titel oben, Quelle, Armans Stimme, faceless.
- Nachgebaute Geräte/Apps immer mit Ecken-Tag `nachgebaut` – nie als echte Aufnahme ausgeben.

### Was die Vorbilder konkret machen (Bild-für-Bild-Analyse 2026-11-01)

Ausgewertet, je 6 Reels Bild für Bild über die ganze Länge: schraffuren „Zug endet in Basel“ (54 s), „Musk wird reicher“ (66 s), „Gehalt als Kassenbon“ (62 s), „Blackout“, „Dein Leben in Wochen“ (62 s), „Ewige Tabelle der Bundesliga“ (60 s); scroll.engineer „Apple Watch“ (84 s), „Navy-Täuschkörper“ (83 s), „Google Maps“, „Turbolader“, „AirTags“ (98 s), „SpaceX-Handy“ (83 s). Ton bei **allen 12** komplett gemessen (Lautheit, Pausen, Bassband, Effekt-Spitzen per Web-Audio im Browser, nichts heruntergeladen); Skript bei allen 12 aus den eingebrannten Untertiteln gelesen (erste 5–10 s + Schluss).

| Muster | schraffuren | scroll.engineer | Für uns |
|---|---|---|---|
| Länge | 50–66 s | 83–98 s (einmal 158 s) | **45–75 s** statt 15–45 s; Länge kommt aus der Geschichte, nicht aus der Regel |
| Bild 0 | Titel groß + Held-Objekt sofort (Karte, Balken, Kassenbon) | mitten im Mechanismus (Hautschnitt, Rakete über Wasser), Untertitel läuft ab Wort 1 | Frame 0 = Titel + Held, schon in Bewegung |
| Held | **ein** Objekt trägt das ganze Video und verändert sich (Kassenbon wird länger, Summe sinkt; Balken wachsen; Wochen-Raster färbt sich nach Lebensphasen; Ranglisten-Linien laufen durch 60 Jahre; Karte → 3D-Landschaft) | ein Gerät/Ort, Kamera wechselt Blickwinkel (außen → Schnitt → Detail → außen) | ein Held pro Video, der sich verwandelt statt neuer Szenen |
| Schnitte | selten (alle 10–20 s), meist Kamerafahrt/Zoom als Übergang | alle 5–10 s neue Einstellung, oft harter Schnitt | Welt: Fahrten; Technik: Einstellungswechsel erlaubt |
| Live-Element | „Während du dieses Video schaust …“ + Uhr 0:13 und mitlaufender Betrag; Jahr + Tabellenführer oben links wechseln mit | Messwert-Panel live; **Status-Chip** unten links wechselt (REPORTED → OFFLINE → NEARBY → PRECISE) | mind. ein Wert läuft mit der Videozeit |
| Untertitel | Satzstücke 4–7 Wörter, weiß, teils roter Kasten | 3–4 Wörter, Wort für Wort: aktives Wort hell/fett, Rest grau, Kasten mit Akzentbalken; Schlüsselwort unterstrichen | Wort-für-Wort im Kanal-Look (`Untertitel` in `technik-bausteine.tsx`) |
| Labels | kleine Ortsnamen, Zahlen am Objekt („+19 Min“) | Mono-Labels mit Pfeil („‹ BLOOD VESSELS“), Callout-Pillen; **Kapitel-Label** oben links pro Abschnitt („▢ ORBITING CELL TOWER“ → „▢ THE SATELLITE“ → „▢ ORBITAL SPEED“); große Zahl als Karte mit Umrechnung („17,000 mph ≈ 7.7 km every second“) | `Callout`, kurze Mono-Labels, Kapitel-Label (`EckTag` links oben), Zahl immer mit greifbarer Umrechnung |
| Ehrlichkeit | Quelle winzig unten links, dauerhaft | Tag „illustrative reconstruction“, „magnified illustration“, „recreated model · not to scale · time-lapse“ | `EckTag` + Quelle |
| Schluss | Pointe als Rechenergebnis/Wendung („… kommen bei dir also nur knapp 0,53 € an.“, „Und du zehn Cent.“, „Sie lässt sie nur nicht mehr in ihr Netz.“) oder Frage („Und du wartest noch?“); letztes Bild = erstes Bild → **Loop** | 4 von 6 enden mit Frage an die Zuschauer („Would you trust …?“, „Would you rather hear …?“, „Did you know …?“), 1 mit Auflösung als Pointe (Maps: „the phones sitting inside are the sensors“) | Pointe-Satz, dann Bild in Frame 0 zurückführen; Fragen nur, wenn echte Meinungsfrage |
| Farbe | Schwarz/Creme + eine Signalfarbe (Rot) | gedämpft Grau/Blau + eine Leuchtfarbe (Grün, Orange) | bleibt: Blau + Koralle |

#### Skript (aus Untertiteln gelesen)

- **Erster Satz = ganze Behauptung inklusive Rätsel**, in ≤ 5 s. Die 12 Einstiege fallen in vier Muster:
  1. **Widerspruch/Paradox:** „Dieser Zug der Deutschen Bahn wird nie ankommen.“ · „The U.S. Navy built a rocket that tricks incoming missiles into chasing a warship that doesn't exist.“
  2. **Irrtum korrigieren:** „Your Apple Watch doesn't actually feel your heartbeat, it watches your blood.“ · „That STUTUTUTU sound … That's actually the sound …“
  3. **Unmögliches Wissen:** „Google Maps can see a traffic jam miles ahead of you, without cameras, road sensors …“ · „AirTags don't use GPS.“
  4. **Zuschauer-Versprechen / offene Schleife:** „… wie lange du dieses Video schaust, wie viel reicher sechs der Reichsten in genau dieser Zeit werden.“ · „Wie gut du die nächsten Tage überstehst, hängt vor allem an einer Sache.“ · „So sieht ein ganz normales Gehalt in Deutschland als Kassenbon aus.“
  Danach sofort Name/Fachbegriff oder das Bild-Versprechen („It's called Nulka.“).
- Lautwörter und Schlüsselbegriffe im Untertitel in Akzentfarbe („STUTUTUTU“ rot).
- **Tempo ≈ 180 Wörter/Minute** bei beiden (Arman eher zügig sprechen; 60 s ≈ 170–180 Wörter).
- **Du-Ansprache und Alltagsbezug** (schraffuren: „bei dir“, „Deinen Chef kostet das …“); Zahlen konkret mit Einheit, kein „rund“-Gemurmel.
- **Sätze kurz:** Atempause etwa alle 3,5 s → ein Satz ≈ 10 Wörter. Ein Satz = ein Bildwechsel.
- Keine Begrüßung, kein „In diesem Video“, kein Abo-Aufruf im Sprechtext.

#### Ton (gemessen)

Messwerte je Reel (Pausen ≥ 0,3 s · Bassband Ø · Dynamik = Spitze/Median · ein Effekt-Akzent alle … s):

| Reel | Pausen | Bass | Dynamik | Akzent alle |
|---|---|---|---|---|
| schraffuren „Zug Basel“ (54 s) | 9 (3,5 s) | −52,0 dB | 2,5 | 2,6 s |
| schraffuren „Musk“ (66 s) | 6 (2,3 s) | −53,2 dB | 2,8 | 2,0 s |
| schraffuren „Gehalt“ (62 s) | 11 (4,5 s) | −55,5 dB | 2,8 | 2,1 s |
| schraffuren „Blackout“ (50 s) | 9 (3,3 s) | −50,4 dB | 2,4 | 2,2 s |
| schraffuren „Leben in Wochen“ (62 s) | 7 (4,9 s) | −57,6 dB | 4,8 | 2,1 s |
| schraffuren „Bundesliga“ (60 s) | 3 (0,9 s) | −55,2 dB | 2,6 | 2,1 s |
| scroll.engineer „Apple Watch“ (84 s) | 20 (9,4 s) | −48,5 dB | 1,9 | 2,5 s |
| scroll.engineer „Navy“ (83 s) | 4 (1,8 s) | −41,5 dB | 1,7 | 4,2 s |
| scroll.engineer „Google Maps“ (158 s) | 2 (1,0 s) | −45,3 dB | 1,8 | 3,0 s |
| scroll.engineer „Turbolader“ (96 s) | 18 (9,7 s) | −57,4 dB | 1,9 | 2,9 s |
| scroll.engineer „AirTags“ (98 s) | 0 | −43,7 dB | 1,8 | 3,4 s |
| scroll.engineer „SpaceX“ (83 s) | 21 (10,2 s) | −58,3 dB | 1,8 | 3,2 s |

| | schraffuren (Welt) | scroll.engineer (Technik) | Für uns |
|---|---|---|---|
| Stille | kurze Atempausen zwischen Sätzen (3–11 pro Video, zusammen ≤ 5 s) | zwei Stile: durchgehend dicht (Navy, Maps, AirTags: 0–4 Pausen) oder mit gesetzten Pausen (Apple Watch, Turbo, SpaceX: ~20 Pausen, ≈ 10 s) | Stimme + Unterlage durchgehend, Satzpausen auf ≤ 0,5 s kürzen |
| Unterlage | leise, kaum Bass (−50 bis −58 dB) | dichte Videos mit Bass-Teppich (−41 bis −45 dB), Pausen-Videos ohne (−48 bis −58 dB) | Welt: leise Musik (`musik-wissen.py`); Technik: tiefer Drone/Atmo-Teppich |
| Effekte | sehr regelmäßig **alle 2,0–2,6 s** ein kleiner Ton – an jedem sichtbaren Ereignis (Bon-Zeile, Kästchen, Linie) | **alle 2,5–4,2 s** ein Akzent – an Schnitten/Einschlägen | Welt: Mikro-Sounds im 2-s-Takt an Ereignissen (`kTick`, `kPop`); Technik: tiefe Akzente an Schnitten (`kWhoosh`, `impact`) |
| Dynamik | lebendig (2,4–4,8) | stark verdichtet (1,7–1,9), in allen sechs gleich | Endmischung −14 LUFS; Technik stärker komprimieren |

#### Werkzeug-Abgleich: Vorbild-Technik → unser Baustein (Stand 2026-11-01)

| Technik der Vorbilder | Unser Werkzeug | Status |
|---|---|---|
| Titel oben + große Zahl mit Quelle | `Titel`, `Zaehler` (`bausteine.tsx`) | vorhanden |
| „Während du schaust …“ – Videozeit + mitwachsender Wert | `Videouhr` (`technik-bausteine.tsx`) | vorhanden |
| Karte mit Route, Länder färben sich, Zoom | `Karte` (`erklaer-werkzeuge.tsx`) | vorhanden |
| Zeitstrahl, Jahr läuft mit | `Zeitleiste` | vorhanden |
| 3D-Welt schräg von oben (Stadt, Zug, Gleise) | `Modell` + Kenney-Modelle, `Kino` (Bloom, Tilt-Shift), `Studiolicht` | vorhanden – Modellauswahl bisher nur Zug + Stadt; weitere Kenney-CC0-Pakete nach Rückfrage laden |
| Kamera fliegt ins Objekt, Röntgen/Durchsicht | `ThreeCanvas`-Kamera, `roentgen()` | vorhanden |
| Callout-Pille mit Linie am Bauteil | `Callout` + `projiziere3D` | vorhanden |
| Messwert-Panel („15 mph · usual 65“) | `MessPanel` | vorhanden |
| Status-Chip (REPORTED → OFFLINE → NEARBY) | `StatusChip` | vorhanden |
| Kapitel-Label oben links | `Kapitel` | vorhanden |
| Hinweis „illustrative reconstruction / not to scale“ | `EckTag` | vorhanden |
| Untertitel Wort für Wort, Schlüsselwort unterstrichen, Lautwort farbig | `Untertitel` (`schluessel`, `farbig`) | vorhanden |
| Formeln | `Formel` (KaTeX) | vorhanden |
| Balken-Rangliste | `BarList` (Kit), `Zaehler` | vorhanden |
| Ranglisten-Linien über Jahrzehnte (Bump-Chart) | `Rangliste` (`erklaer-werkzeuge.tsx`) | vorhanden |
| Raster aus vielen Kästchen (Leben in Wochen) | `Raster` (Phasen färben sich wellenartig ein) | vorhanden |
| Kassenbon, der Zeile für Zeile wächst | `Kassenbon` (`erklaer-werkzeuge.tsx`) | vorhanden |
| Archivbilder/historische Fotos | `npm run bilder` (Wikimedia, freie Lizenzen) | vorhanden |
| Mikro-Sounds im 2-s-Takt (Welt) | Kanal-Sounds `kTick`, `kPop`, `kDing`, `kWhoosh` | vorhanden |
| Leise Musik (Welt) | `musik-wissen.py` → `musik/wissen.wav` | vorhanden |
| Dichter Bass-Klangteppich (Technik) | `musik-technik.py` → `musik/technik.wav` | vorhanden (neu) |
| Fotorealistische Renderings (Kriegsschiff auf Meer, Auto-Schnittbild) | – | **Lücke:** braucht detaillierte 3D-Modelle (z. B. CC0 von Poly Haven/Sketchfab) – nur nach Rückfrage laden; sonst stilisiert lösen |
| 3D-Menschen (Apple-Watch-Reel) | `Figur` (2D-Strichmännchen) | bewusst nicht: Kanal ist faceless |

#### Bilder von draußen

- Erst selbst bauen (3D, SVG, Karte) – echte Fotos nur, wenn das Original zählt (historisches Foto, echter Ort, Weltall).
- Quellen ohne Key: Wikimedia Commons (`npm run bilder`), NASA-Archiv (`--quelle=nasa`), Pixabay (`npm run broll`). Vor jedem Download Datei + Lizenz nennen; Lizenzzeile kommt automatisch in `quellen.md`.
- KI-generierte Bilder nur mit Armans Freigabe für genau dieses Video, im Bild mit `EckTag` „KI-Illustration“ (der verbundene Generator hat derzeit kein Guthaben).

## Bewegungssprache (fest)

- Eintritte outQuint über 12 Frames, Weg ≤ 24 px; Objekte skalieren 0,92 → 1 (`useAuftritt`), nicht einblenden.
- **Frame 0 zeigt Titel + Objekt** (Hook).
- Pro Szene genau **ein Höhepunkt**: `pulsBei(f, ab)` auf der Zahl + `kDing`.
- Zähler laufen live mit (z. B. „seit dieses Video läuft“) – stärkstes Mittel gegen Wegwischen.

## Sicherheitszonen (9:16)

Alles Wichtige zwischen **y 200 und y 1480**. Darunter verdecken TikTok/Instagram Beschreibung und Knöpfe; rechts ab x ≈ 960 die Aktions-Buttons. Kein Logo/Balken unten.

## Sounds (eigene Kanal-Sounds, `Sfx` aus `kit/Stage`)

`kWhoosh`/`kSwish` Szenenwechsel · `kAnstieg` Füllen/Wachsen · `kDing` Pointe · `kPop` Objekt erscheint · `kTick` nur an echten Ereignissen. Leise (0,3–0,5).

**Musik (Armans Ja vom 2026-10-31):** eigene Synthese `python3 studio/scripts/musik-wissen.py` → `public/musik/wissen.wav` (40 s, loopbar). Einbinden mit `<Music src="musik/wissen.wav" volume={0.22} captions={wortzeiten} duckTo={0.35} />` – immer leise, unter der Stimme abgesenkt.

## Checkliste vor dem Abgeben (an Bildern prüfen)

- [ ] Frame 0: Titel + Objekt sichtbar.
- [ ] Ein Blickfang pro Bild, keine großen leeren Flächen.
- [ ] Nichts unter y 1480 oder rechts in der Button-Spalte.
- [ ] Jede Zahl mit Quelle; nichts doppelt (Titel ≠ Label ≠ Quelle).
- [ ] Ein Höhepunkt pro Szene, Sound nur an Ereignissen.
- [ ] `video-kritiker` gelaufen, Punkte erledigt.
