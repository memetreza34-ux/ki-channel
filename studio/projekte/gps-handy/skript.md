# Wie weiß dein Handy, wo du bist? (GPS)

**Status:** Phase 1 fertig (2026-11-01). Stummer Rohschnitt mit geschätzten Zeiten: Composition `GPS-Rohschnitt` (`projekte/wissen/GpsRohschnitt.tsx`, 2026-11-02). Wartet auf Armans Aufnahme in
`kanal/shorts/2026-11-02_bis_2026-11-08/gps-handy/audio/`.

- **Kernaussage:** Dein Handy empfängt nur – es misst, wie spät die Zeitsignale von vier Satelliten ankommen, und rechnet daraus deinen Ort. Ohne Einsteins Relativitätstheorie läge es jeden Tag ~10 km daneben.
- **Format:** 9:16, ≈ 60 s (185 Wörter bei ≈ 180 Wörtern/Minute), Loop: letzter Satz = erster Satz.
- **Einstieg:** Muster „Irrtum korrigieren“ (die meisten glauben, das Handy „funkt“ zum Satelliten).

## Bildwelt: Mix aus A (Welt) und B (Technik)

Start in der **Welt** (Erde von außen, Satellitenbahnen, Ort als Punkt auf der Karte) → Kamera **taucht ins Handy und in die Satellitenuhr** (Technik: Callouts, Messwert-Panel, Videouhr) → zurück zur Erde für den Loop. Begründung: Das Rätsel ist geografisch („wo bist du?“), die Lösung ist ein Mechanismus (Zeit → Entfernung → Schnittpunkt).

## Fakten (Quelle + Datum)

| Aussage im Skript | Wert | Quelle |
|---|---|---|
| gut dreißig GPS-Satelliten | 31 einsatzbereit (Stand 3.7.2023), Space-Force-Briefing April 2026: 32 | gps.gov/space-segment (abgerufen 2026-11-01); CGSIC-Briefing 21.4.2026 |
| rund 20.000 km Höhe | ≈ 20.200 km (mittlere Erdumlaufbahn) | gps.gov/space-segment |
| zweimal am Tag um die Erde | 2 Umläufe pro Tag | gps.gov/space-segment |
| mind. 4 Satelliten von überall sichtbar | 6 Bahnebenen × 4 Plätze | gps.gov/space-segment |
| Handy sendet nichts | GPS-Empfänger sind reine Empfänger (Satelliten senden Ort + Zeit) | gps.gov/gps |
| ≈ 7 Hundertstelsekunden Laufzeit | 20.200 km ÷ 299.792 km/s ≈ 0,067 s (senkrecht darüber; schräg etwas mehr) | **eigene Rechnung, „etwa“** |
| Atomuhren an Bord | ja | gps.gov/space-segment |
| +38 µs pro Tag | Schwerkraft +45 µs, Geschwindigkeit −7 µs → +38 µs/Tag | R. Pogge, Ohio State University, „Real-World Relativity: The GPS Navigation System“ |
| ≈ 10 km Fehler pro Tag | 38 µs × Lichtgeschwindigkeit ≈ 11 km; Pogge: „about 10 kilometers each day“ | Pogge (s. o.) |
| Uhren vor dem Start langsamer gestellt | Frequenz 10,22999999543 MHz statt 10,23 MHz | N. Ashby, „Relativity in the Global Positioning System“, Living Reviews in Relativity 6 (2003) |
| „mehrere Meter“ während des Videos | 10 km / 86.400 s ≈ 0,116 m/s → nach 45 s ≈ 5 m, nach 60 s ≈ 7 m | **eigene Rechnung** (Videouhr zeigt den laufenden Wert) |

## Szenenplan (Feinschnitt erst auf Armans Aufnahme)

| # | Sprechtext (Kurzform) | Bild | Bausteine |
|---|---|---|---|
| 1 | „…kein einziges Signal ins All. Es hört nur zu.“ | Frame 0: Titel „So weiß dein Handy, wo du bist“ + Handy auf der Erde, ein Funkpfeil nach oben wird durchgestrichen, dann kommen Wellen von oben herein | Titel, `Untertitel`, `EckTag` „Illustration“ |
| 2 | gut dreißig Satelliten, 20.000 km, zweimal am Tag | Erde (3D-Kugel oder NASA-Bild „Blue Marble“, gemeinfrei) mit 6 Bahnringen, Punkte kreisen; Zahl 20.200 km am Bahnring | `Globus`/`ThreeCanvas`, `Zaehler`, `Kapitel` „Die Satelliten“ |
| 3 | funkt nur Ort + Uhrzeit, Atomuhr | Kamera fliegt an einen Satelliten, Röntgenblick: Atomuhr innen, Callout „Atomuhr“, Datenpaket „Ort · 12:00:00,000000“ | `roentgen()`, `Callout`, `Kapitel` „Das Signal“ |
| 4 | 7 Hundertstel, Zeit wird Entfernung | Signal-Welle wandert zum Handy; `MessPanel`: Laufzeit 0,067 s → × Lichtgeschwindigkeit → 20.200 km | `MessPanel`, `StatusChip` „Empfängt“ |
| 5 | Kugeln schneiden sich, 4. Satellit = Uhr, „dieser Punkt bist du“ | 3 durchsichtige Kugeln wachsen, Schnittpunkt leuchtet; 4. Satellit korrigiert die Handyuhr; Karte zoomt auf den Punkt | `Karte` (Zoom auf Ort), `StatusChip` „Position gefunden“ |
| 6 | Zeit vergeht oben schneller, +38 µs/Tag | zwei Uhren nebeneinander (Erde / Satellit), die obere läuft davon; Formel-Zeile +45 µs − 7 µs = **+38 µs** | `Formel` mit `\akzent{38}` |
| 7 | 10 km pro Tag, während du schaust | Karte: Standortpunkt driftet weg; **`Videouhr`** zählt Meter mit (0,116 m/s) | `Videouhr`, `Karte` |
| 8 | Uhren vorher langsamer gestellt, Loop | Uhr wird vor dem Start „zurückgedreht“, Kamera zurück zur Erde → exakt Frame 0 | Loop-Übergang |

**Ton:** Mischung – leise Welt-Musik (`musik-wissen.py`) bis Szene 2, ab Szene 3 tiefer Technik-Teppich (`musik-technik.py`), Mikro-Sounds alle ≈ 2 s an Ereignissen (`kTick`, `kPop`), Akzent `impact` beim Schnittpunkt und bei „+38“.

**Bilder von draußen (nur falls gebraucht, vor Download fragen):** `npm run bilder -- "blue marble" --quelle=nasa --bild`, `npm run bilder -- "GPS satellite" --quelle=nasa --bild`.
