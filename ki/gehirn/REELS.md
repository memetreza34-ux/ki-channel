# 📱 KI-Kanal — Reel-Strategie (TikTok / Instagram / Shorts)

> KI- und plattformspezifische Content-Regeln. Technische und strukturelle Pflichten stehen in `AGENTS.md` und `ki/AGENTS.md`; Bildregeln in `ki/BILDSTIL.md`.
> Ton: seriös, modern, neugierig, klar, immer „du“ und inhaltlich geerdet.

## Reel ≠ langes Video

| | **Reel / Short** | **Langes YouTube-Video** |
|---|---|---|
| Ziel | Reichweite + Neugier + ein klarer Aha-Moment | Tiefe + Vertrauen + Watchtime |
| Länge | meist 15–45 s, maximal 60 s | meist 5–12 min |
| Inhalt | **eine** Kernidee / ein Tool / ein Konzept | mehrere zusammenhängende Punkte |
| Einstieg | Spannung ab Sekunde 0, kein Intro | ruhigerer Einstieg möglich |
| Ton-aus | Untertitel müssen den Inhalt tragen | Audio kann stärker führen |

**Merke:** Ein Reel ist ein präzise visualisierter KI-Gedanke mit Spannung — kein Mini-Vortrag und keine Feature-Liste.

## Spannungsbogen

```text
0–2 s       HOOK       starke, wahre Reibung / Fähigkeit / Frage
2–6 s       EINSATZ    warum betrifft das den Zuschauer?
6–X s       AUFBAU     Ursache, Mechanismus oder konkrete Anwendung sichtbar machen
letzter Beat REVEAL    Ergebnis / Aha / ehrliche Einordnung
Ende         LOOP/CTA   nur wenn es natürlich zum Inhalt passt
```

Bei KI gilt: **erst Aufmerksamkeit, dann Erklärung und Einordnung.** Der Hook darf stark sein, aber nie mehr versprechen als das Reel tatsächlich liefert.

## Geeignete KI-Hooks

- **Fähigkeit + Grenze:** „Diese KI baut dir X — aber genau hier liegt der Haken.“
- **Fehlanwendung:** „Du benutzt ChatGPT an dieser Stelle falsch.“
- **Einordnung:** „Alle reden von X. Das kann es wirklich.“
- **Neugier-Lücke:** „Es gibt einen Grund, warum KI manchmal überzeugend falsch liegt.“
- **Use-Case:** „Wenn du diese Aufgabe noch komplett von Hand machst, lohnt sich dieser KI-Schritt.“

Keine erfundenen Gratis-Versprechen, Zeitangaben, Leistungswerte oder Superlative nur für den Hook.

## Wiederkehrende Reel-Formate

1. **Konzept in kurzer Form erklärt** — z. B. Token, Kontext, LLM, Training, Agenten.
2. **Tool + konkreter Use-Case** — was macht es, wann hilft es, wo sind Grenzen?
3. **News eingeordnet** — was ist neu und was bedeutet es für den Zuschauer?
4. **Prompt / Workflow-Trick** — schlechter Ansatz vs. besserer Ansatz mit sichtbarem Unterschied.
5. **Mythos / Kann KI das wirklich?** — Behauptung → Prüfung → Einordnung.

## Visualisierung — Bedeutung vor Dekoration

Jede dominante Bewegung muss eine Aussage erklären.

- Sprechertext und `SceneMeaningContract` bestimmen die sichtbare Logik.
- Library-Reuse nur bei Production Eligibility und echter semantischer Passung.
- Bei schwacher Passung lieber `new-build` als eine falsche Animation erzwingen.
- `ChatUI` für Chat-/Prompt-Demos.
- `NeuralNet`, Token-/Vektor-Visuals oder semantische Cluster für Modellkonzepte.
- `WindowMock`, `AppScreenDemo`, `PhoneMockup` für Tool-/UI-Erklärungen.
- `BigStat`, `BarsPremium`, `Ranking`, Charts nur mit geerdeten Werten oder klar als relative Darstellung.
- Keine Demo-Zahlen als angebliche Fakten.
- Maximal drei starke gleichzeitige Bewegungen; meist reicht eine dominante Erklärbewegung pro Satz.

## Visuelle Identität

Verbindliche technische Quelle: `ki/brand/brand.ts`.

- Hintergrund weiß `#FFFFFF` oder sehr hell / leicht lila getönt `#F3F0FA`.
- Standardtext dunkel (`#1A1A2E`) und auf Smartphone klar lesbar.
- Marken-Lila `#B98CFF` = KI / Fokus / Premium.
- Dunkles Lila `#6E45C9` = Tiefe / Kontrast.
- Grün = Vorteil / Lösung.
- Rot = Risiko / Grenze / Fehler.
- Blau = gezielte Tech-/Info-Semantik, nicht zweite Hauptmarke.
- Faceless: niemals Face-Cam oder erkennbare Gesichter.
- Viel Weißraum, wenige große Elemente, klare visuelle Hierarchie.

Dunkle Tech-Decks dürfen Layout-Ideen liefern, aber **nicht** den tatsächlichen Standard-Look bestimmen. Kein Cyberpunk, keine Neon-Technikwelt und keine Roboterfigur als generisches KI-Symbol.

## Untertitel

- Jedes gesprochene Wort muss abgedeckt sein.
- Finale Audio-/Wort-Timestamps verwenden, wenn vorhanden; sonst explizite manuelle Cue-Frames.
- Aktives Fenster kompakt halten, normalerweise etwa 7–10 Wörter.
- Nur semantische Keywords stark animieren.
- Untertitel nie in einem schweren schwarzen Kasten.
- Caption-Zone von der Hauptvisualisierung trennen.

## 🖼️ Bilder — nur wenn sie inhaltlich nötig sind

Standard bleibt Motion/UI/Diagramm, wenn die Aussage damit ehrlich und klar erklärt werden kann.

Wenn eine Szene echtes Bildmaterial braucht:

1. Bildbedarf ausdrücklich festhalten — nicht still durch eine unpassende Animation ersetzen.
2. `ki/BILDSTIL.md` verbindlich anwenden.
3. Planung und Assets im Wochen-Reel unter `02-bilder/` ablegen.
4. Ausführbaren TS/TSX-Code ausschließlich unter `ki/src/reels/<slug>/` ablegen.
5. Fehlende Pflicht-Assets niemals erfinden oder still ersetzen.

Verbindliche Produktionsstruktur pro Reel:

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

Neue Pakete nur mit:

```bash
node scripts/new-ki-reel.mjs "Reel Titel"
```

Danach immer:

```bash
node scripts/check-ki-reel-folder-structure.mjs
```

## Übergänge und Kamera

- **Hard Cut ist der Default.**
- Einen Übergang nur einsetzen, wenn Objekt, Form, Richtung oder Zustand sinnvoll über die Beat-Grenze weitergeführt werden kann.
- Kein Übergang darf ein wichtiges gesprochenes Wort oder Ergebnis verdecken.
- Zoom / Push-in nur dann, wenn Fokus oder Bedeutungswechsel dadurch klarer wird.
- Kein mechanischer Zoom auf jede Szene.
- Öffnungs- und Ergebnis-Holds müssen lesbar bleiben.

## Aktualität

KI-News altern schnell. Für News-Reels:

- ein klarer Kernpunkt statt drei Meldungen gleichzeitig,
- Veröffentlichung schnell, aber keine ungeprüften Aussagen,
- reale Produktnamen, Funktionen, Preise, Limits und Verfügbarkeiten vor Veröffentlichung aktuell prüfen,
- News immer mit Bedeutung für den Zuschauer einordnen.

## Serien-Denken

Wiederkehrende Reihen wie „KI-Basics“, „Tool der Woche“ oder „Mythos-Check“ können Bindung schaffen. Jeder einzelne Short muss trotzdem eigenständig verständlich und nützlich sein.

## Verbindliche Qualitätslektionen

1. **Format immer 1080 × 1920, 30 FPS**, sofern der Reel-Vertrag nichts anderes ausdrücklich festlegt.
2. **Kontrast prüfen:** dunkler Text auf hellem Hintergrund; keine hell-auf-hell Kombination.
3. Für flache Bilder nur ehrliche Transformationen verwenden: Cover/Contain, Crop, Masken, Fokus, deklarierte Ebenen, Overlays, Connectoren und sinnvolle Kamerabewegung. Keine erfundene Objekttrennung.
4. **Safe-Zones:** oben ungefähr 96 px frei für die Kopfzeile, unten ungefähr 195 px frei für Captions; genaue Reel-Konstanten respektieren.
5. Kopfzeile darf pro Beat/Kapitel wechseln, aber nicht mit auslaufendem Content kollidieren.
6. Untertitel bleiben außerhalb der Hauptvisualisierung und bekommen keinen dominanten dunklen Kasten.
7. Hard Cuts sind Standard; Transition nur mit semantischer Kontinuität.
8. Zoom und Push-in nicht mechanisch wiederholen.
9. Animation ohne sofort verständlichen Bezug zum Sprechertext entfernen oder neu bauen.
10. Vor Fertigmeldung die deklarierten Audio-/Bild-Assets erneut prüfen; Assets können während des Baus ergänzt worden sein.
11. Keine Platzhalter als echte Assets ausgeben. Wenn ein Pflicht-Asset fehlt, ist das ein Blocker.
12. Generierte Bilder auf eingebrannten Text, Wasserzeichen und versehentliche Prompt-/Layout-Hinweise prüfen.
13. Zahlen, Rankings, Wahrscheinlichkeiten, Kosten und Latenzen dürfen nur als exakt dargestellt werden, wenn der Sprecherinhalt bzw. die Quelle sie trägt.
14. Eine komplette Library-Animation innerhalb desselben Reels nicht zweimal wiederverwenden.
15. Technisch erfolgreicher Render ≠ visuell freigegebener Render. Smoke-Frames und finales Video müssen tatsächlich geprüft werden.

## Do / Don't

**Do:** starker wahrer Hook, eine Idee, sichtbarer Mechanismus, echter Nutzen/Aha, klare Untertitel, geerdete Daten, faceless Premium-Look.

**Don't:** Intro-Floskeln, Cringe-Hype, drei Themen gleichzeitig, flache Aufzählungen, Fake-Wunder, Angstporno, dekorative Bewegung, erfundene Werte, wiederholte Komplettanimationen oder Cyberpunk als KI-Standard.

## Verbindliche Verweise

- Kanalidentität: `ki/gehirn/KANAL.md`
- Bildstil: `ki/BILDSTIL.md`
- Root-Produktionsvertrag: `AGENTS.md`
- KI-Strukturvertrag: `ki/AGENTS.md`
- Brand-Code: `ki/brand/brand.ts`
- Bausteinkatalog: `core/brand-kit/KATALOG.md`
- Production Eligibility: `ki/src/animation-library/productionEligibility.ts`
