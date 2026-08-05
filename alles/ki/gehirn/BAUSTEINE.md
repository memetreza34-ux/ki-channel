# 🧰 KI-Kanal — Baukasten nach Satz-Kategorien (Intent-Routing)

> **So benutzen:** Du hast einen Satz aus dem Script → finde die passende **Kategorie** → nimm den/die
> **Baustein(e)** → an KI-Kanal anpassen (🟣 Lila=KI/Fokus, 🔵 Blau=Tech/Info, 🟢 Grün=Vorteil/Lösung,
> 🔴 Rot=Grenze/Risiko/Fehler; Fachbegriff nur mit sofortiger Erklärung).
> Bausteine leben in `@studio/core` (Signaturen: `core/brand-kit/KATALOG.md`). **Erweiterbar** — neue Kategorie unten anhängen.
> Regel: **erst Konzept/Kategorie, dann animieren.** Vor dem Bauen immer Abschnitt 0 in `KATALOG.md` checken
> (Verwechslungsgefahr-Tabelle, z. B. `DramaticNumber` vs. `RollingNumber`).

---

## 1 · Wie eine KI "denkt" (Kern-Baustein des Kanals)
**Sätze:** „So verarbeitet ein neuronales Netz deine Eingabe." · „Das Modell gewichtet jeden Faktor."
**Bausteine:** `NeuralNet` (Signal/Backprop/Gewichte, premium)
**Farbe:** lila. **Tipp:** nicht zu lange stehen lassen — Signal-Fluss zeigen, dann weiter zum Nutzen.

## 2 · Chat-/Tool-Demo (Kern-Baustein des Kanals)
**Sätze:** „Du tippst das rein …" · „ChatGPT antwortet mit …" · „So sieht das Ergebnis aus."
**Bausteine:** `ChatUI` (ChatGPT/Claude-Bubbles, tippt/antwortet) · `AiThinking` (kurzer Verarbeitungs-Moment
zwischen Prompt und Antwort, statt improvisierter Wartezeit)
**Tipp:** Prompt kurz & echt wirkend, Antwort nicht zu textlastig — Kernaussage highlighten (`Emphasis`).

## 2a · Text → Token/Vektor (Grundkonzept LLM)
**Sätze:** „Die KI liest deinen Text nicht wie du — sie zerlegt ihn in **Token**." · „Jedes Wort wird zur Zahl."
**Bausteine:** `TokenStream` (Wörter → Chips → Zahlen-Vektor/Embedding)
**Tipp:** kurzer Satz reicht, nicht überladen — das AHA ist "Text = Zahlen für die Maschine".

## 2b · Bild-/Video-Generierung (Tool-Demo)
**Sätze:** „Du gibst den Prompt ein — und die KI **malt** das Bild." · „Aus Text wird ein Video."
**Bausteine:** `AiCanvasReveal` (Bild baut sich progressiv auf, Scan+Rausch→scharf)
**Tipp:** Reveal spät zeigen (Spannungsbogen), Prompt-Text kurz vorher einblenden.

## 2c · Vorher/Nachher (Foto-/Video-Tool)
**Sätze:** „So sah's vorher aus — und so macht's die KI." · „Ein Klick, komplett neues Ergebnis."
**Bausteine:** `BeforeAfterSlider` (Wisch-Vergleich)
**Verwechslungsgefahr:** NICHT `CompareSplit` nehmen (das ist nebeneinander/VS, kein Wisch-Reveal auf demselben Bild).

## 3 · Prompt-Trick (schlecht vs. gut)
**Sätze:** „So NICHT prompten." · „Mit dieser einen Änderung wird's 10× besser."
**Bausteine:** `CompareSplit` (VS-Badge, zwei `ChatUI`-Ausschnitte nebeneinander)
**Farbe:** eine Seite grau/rot (schlecht), andere lila/grün (gut).

## 4 · Code/Prompt → Ergebnis live
**Sätze:** „Du gibst diesen Befehl ein …" · „… und die KI baut das."
**Bausteine:** `LiveCodeCompile` (tippt → läuft → Output) · `GlassCodeBlock` · `Terminal`
**Tipp:** für technischere Tool-Reels (z. B. Coding-Assistenten), nicht für reine Konzept-Erklärer.

## 5 · Zusammenhänge / Wissens-Netz
**Sätze:** „KI hängt mit [X, Y, Z] zusammen." · „Das ganze KI-Ökosystem im Überblick."
**Bausteine:** `Constellation` (Wissens-/Ökosystem-Graph) · `Mindmap`
**Farbe:** lila Knoten, Verbindungslinien dezent.

## 6 · Zahl enthüllen (dramatischer Reveal)
**Sätze:** „**1 Milliarde** Anfragen pro Tag." · „Das Modell hat **175 Milliarden** Parameter."
**Bausteine:** `DramaticNumber` (Spannung, Fake-Stopp) · `BigStat` · `Counter`
**Tipp:** Zahl kommt SPÄT (Spannungsbogen), nicht am Anfang. `RollingNumber` nur für ruhige Nebensache.

## 7 · Prozent / Quote / Wahrscheinlichkeit
**Sätze:** „**73 %** der Firmen nutzen schon KI." · „Die KI ist sich zu **90 %** sicher."
**Bausteine:** `PercentRing` (1 Quote) · `StatBar` · `Gauge` (Wahrscheinlichkeit/Konfidenz als Tacho)

## 8 · Verteilung mehrerer Anteile
**Sätze:** „So teilt sich der KI-Markt auf." · „Diese Anteile machen Trainingsdaten aus."
**Bausteine:** `Donut` / `PiePremium` (NICHT `PercentRing` — das zeigt nur 1 Wert)

## 9 · Zwei Dinge vergleichen (Duell)
**Sätze:** „**Mensch vs. KI**." · „**GPT vs. Claude**." · „Alt vs. neu."
**Bausteine:** `ComparisonBars` (genau 2 Werte) · `CompareSplit`
**Farbe:** eine Seite neutral, andere lila hervorgehoben.

## 10 · Rangliste / mehrere Tools
**Sätze:** „Die **besten** KI-Tools gerade." · „Top 3 KI-Fehler, die du machst."
**Bausteine:** `Ranking` · `BarsPremium` (3+ Kategorien) · `Table`

## 11 · Wachstum über Zeit
**Sätze:** „KI-Nutzung wächst **rasant**." · „So hat sich [Modell/Adoption] entwickelt."
**Bausteine:** `GrowthChart` (mit Callout-Marker) · `AreaPremium` · `LabeledAxisChart` (Pflicht-Achsenbeschriftung)

## 12 · Risiko / Abwägung / Grenze
**Sätze:** „KI kann viel — aber nicht alles." · „Mehr Automatisierung = mehr Kontrollverlust?"
**Bausteine:** `Gauge` (Tacho) · `Balance` (Waage kippt)
**Farbe:** rot = Risiko-Seite, grün/lila = Nutzen-Seite.

## 13 · Schritte / Anleitung
**Sätze:** „In **3 Schritten** zum guten Prompt." · „So richtest du das Tool ein."
**Bausteine:** `NumberedSteps` · `Checklist` · `CheckCards`

## 14 · Kernaussage betonen (Vollbild-Statement)
**Sätze:** „**KI ersetzt keine Ideen — nur Aufwand**." · „Nicht der Hype zählt. Der Nutzen."
**Bausteine:** `KineticCenterBuild` (Wörter bauen sich auf) · `BigStat` · `MaskReveal`

## 15 · Zitat / Autorität
**Sätze:** „**Sam Altman**: ‚…'." · „Ein KI-Forscher sagt …"
**Bausteine:** `Quote`

## 16 · Label / Stempel
**Sätze:** „**NEU**." · „**GRATIS**." · „**KOSTENLOS**." · „ACHTUNG: Fake."
**Bausteine:** `Badge` (Stempel, gedreht)

## 17 · Gründe / Vorteile (Grid)
**Sätze:** „**3 Gründe**, warum du dieses Tool nutzen solltest." · „Das bringt dir KI."
**Bausteine:** `FeatureGrid` (Icon-Karten) · `CheckCards`

## 18 · Mythos / Falsch-Richtig-Check
**Sätze:** „Viele denken, KI kann das — stimmt das?" · „Mythos vs. Realität."
**Bausteine:** `IconStrike` (1 falsche Behauptung durchgestrichen) · `DontDoInstead` (3 Mythen → 3 Richtigstellungen)
**Verwechslungsgefahr:** `IconStrike` nur für EINEN Moment, `DontDoInstead` für eine ganze 3er-Liste (siehe `KATALOG.md` Abschnitt 0).

## 19 · Abstraktes KI-Konzept → Metapher (WICHTIG — der Premium-Hebel)
**Sätze:** „Ein LLM ist wie ein **Autovervollständiger auf Steroiden**." · „Trainingsdaten sind der **Treibstoff**."
**Bausteine:** custom SVG/Metapher passend zum Bild, ggf. Bild-Prompt an Arman (Flow/Nano Banana) + Kamera/Reveal.
**Fehlt eine Metapher als Baustein?** → in `core/brand-kit/components/metaphors.tsx` bauen (goldene Regel: geteilt → core).

## 20 · Hook / Frage (Reel-Start)
**Sätze:** „Was, wenn eine KI das für dich in **10 Sekunden** macht?" · „Diesen Fehler bei ChatGPT machst du auch."
**Bausteine:** `KineticCaption` + `MaskReveal` + geteaste große Zahl/Frage (`BigStat`, noch ohne Auflösung)

## 21 · Gesprochener Satz (Untertitel)
**Jede Script-Zeile:** → `KineticCaption` (Wort für Wort, Keyword glüht lila). Text jede Szene ANDERS animiert.

## 22 · News / Aktualität (schnelle Produktion)
**Sätze:** „Das ist **neu** bei [Tool/Modell]." · „Diese Woche hat sich das geändert."
**Bausteine:** schnelle Kombi aus `ChatUI`/`Badge`("NEU")/`Table` — KEINE aufwendige Custom-Animation (Zeitdruck, siehe `REELS.md` „Aktualität").

## 23 · Hintergrund & Stimmung (immer)
**Jede Szene:** `LivingBackground` (lila) oder `ShaderBG` (WebGL) — **dezent**, futuristisch-clean, viel Luft. `FilmGrain` leicht.

## 24 · Kamera & Übergänge (zwischen Szenen)
**Szenenwechsel:** `WhipIn` · `ZoomPunch` · `PushThrough` · `KenBurns` · `Dissolve`/`WaveWipe` — variieren, nie 2× gleich.

---

## ➕ Erweitern
Neue Satz-Kategorie fällt auf? → hier als „## N · <Kategorie>" anhängen (Sätze + Baustein + ggf. Metapher).
Fehlt ein Baustein für eine Kategorie? → in `core/brand-kit` bauen (goldene Regel: geteilt → core) und in `KATALOG.md` eintragen.
