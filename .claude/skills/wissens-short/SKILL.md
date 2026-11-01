---
name: wissens-short
description: Produziert einen Allgemeinwissen-Short (9:16, 15–45 s) im Denkwürfel-Daten-Look – fester neugieriger Titel, ein sauberes Objekt oder Diagramm, echte Zahl mit Quelle. Verwenden, sobald Arman einen Wissens-Short, ein Fakten-Video, „Zahlen-Video“ oder ein neues Thema für den Kanal will („mach ein Short über …“, „wie viel …“, „so oft …“).
---

# Wissens-Short produzieren

Seit 2026-10-31 ist Denkwürfel ein **Allgemeinwissen-Kanal in Zahlen** (Format-Vorbild: Instagram „schraffuren“ – nie deren Name, Logo oder konkrete Themen übernehmen). Ältere Vorgaben (Toki, heller Kanal-Look, KI-only) gelten für Shorts nicht mehr.

Code: `studio/projekte/wissen/` – `bausteine.tsx` (Farben, Titel, Zähler, Puls, Auftritt, Globus), Beispiele `Szenen.tsx` (Blitze, Jeans, Erdbahn) und `Daten.tsx` (Strom pro ChatGPT-Frage).

## Ablauf (3 Phasen wie immer)

1. **Thema + Fakten:** eine überraschende Zahl, die man in *einem* Bild zeigen kann. Quelle + Datum aus Primärquelle (NASA, UN, Statistisches Bundesamt, Firmenangabe …). Eigene Rechnungen als „rund“ kennzeichnen und im Skript vorrechnen.
2. **Skript** (`kanal/shorts/<Mo>_bis_<So>/<thema>/audio/script.txt` + `LIES-MICH.txt`): Satz 1 = Titel als Frage/Behauptung, dann 2–4 Beats (Zahl → Vergleich → Pointe), 60–110 Wörter. Danach aufhören – **Stimme nur Arman**, nie synthetisch.
3. **Video aus dem Audio:** Wortzeiten (`npm run untertitel`), Beats wortgenau legen, mit Bausteinen bauen, Probebilder prüfen, Agent `video-kritiker` laufen lassen, nachbessern, rendern, -14 LUFS.

## Look

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
