# 🧰 BAUKASTEN-KATALOG — `@studio/core` (alle Kanäle)

> Premium-Animationsbausteine nach Kategorie. **Erst hier auswählen, dann bauen** — nicht neu erfinden.
> Alle theme-fähig (Kanal-Akzent via `useTheme`/`var(--accent)`), frame-basiert (rendern sauber).
> Import: `import { … } from '@studio/core'`. Regeln fürs Reel: `core/gehirn/REEL-PRINZIPIEN.md`.
> Legende: ✅ vorhanden · 🔨 Lücke (geplant, Premium-Ausbau).

## 0 · Wann nehme ich was — Verwechslungsgefahr
> Bausteine die ähnlich aussehen, aber für unterschiedliche Situationen gebaut sind. Bug-Quelle
> Dispo-Falle-Reel (2026-07-17): falscher Baustein aus richtigem Paar genommen, obwohl der passende
> längst existierte. **Vor dem Bauen hier kurz checken, nicht nach Gefühl greifen.**

| Situation | Nimm | NICHT |
|---|---|---|
| Genau 2 Werte im direkten Duell (A vs. B) | `ComparisonBars` | `BarsPremium` (für 3+ Kategorien gebaut, wirkt bei 2 Werten generisch) |
| 3+ Kategorien nebeneinander | `BarsPremium` | `ComparisonBars` (zu schmal für viele Balken) |
| Eine Zahl zählt dramatisch hoch/runter (Hero-Moment) | `DramaticNumber` | `RollingNumber` (das ist der ruhige Odometer-Look, kein Spannungsaufbau) |
| Ruhiger Zähler im Hintergrund/Nebensächlich | `RollingNumber` | `DramaticNumber` (zu viel Wucht für Nebensache) |
| Zahl mit Mechanik-Feeling (Kachel-/Walzen-Look) | `SlotRoller`/`DigitSlots`/`SplitFlap`/`DrumRoller` je nach Mechanik | `DramaticNumber` (kein Mechanik-Look, reiner Zahlenlauf) |
| Wert über Zeit wächst (Kurve, Kontext Jahre/Monate) | `AreaPremium` | `BarsPremium` (Balken = Vergleich zwischen Kategorien, keine Zeitentwicklung) |
| Anteil von 100% (Quote/Prozent-Fortschritt) | `Gauge` | `PiePremium` (für Verteilung mehrerer Anteile, nicht 1 Quote) |
| Verteilung mehrerer Anteile am Ganzen | `PiePremium`/`RadarPremium` | `Gauge` (zeigt nur 1 Wert, keine Aufteilung) |
| EIN Icon an EINER Stelle wird durchgestrichen ("das nicht tun") | `IconStrike` | `DontDoInstead` (für eine ganze Liste von 3 Punkten gebaut, überdimensioniert für 1 Moment) |
| Liste von 3 "nicht tun" → "stattdessen"-Punkten | `DontDoInstead` | `IconStrike` (nur für 1 Icon, keine Liste) |
| "Jeden Monat/jede Woche passiert X" (wiederkehrender Vorgang) | `RecurringDeposit` | statisches Tag/Badge (zeigt nur einen Zustand, keine Wiederholung über Zeit) |
| Weiche wandernde Farbschleier (Aurora-Look) | `AuroraBG` | `PremiumGrade` (das ist Grading/Korn, keine Farbschleier) |
| Schwebende Ambient-Partikel über die GANZE Fläche (Hintergrund) | `ParticleField` | `Sparkles` (an ein Element/eine Box gebunden, kein Vollbild-Ambiente) |
| Funkeln/Burst an EINEM Element (Icon, Karte) | `Sparkles` | `ParticleField` (kein Bezug zu einem Element, treibt frei über die Fläche) |
| Sci-Fi/Hologramm-Look (Scanlinie + CRT-Raster + Flackern) | `HologramGrid` | `PulseGrid` (nur atmendes Raster, keine Scanlinie/kein Flacker-Sci-Fi-Look) |
| Perspektivischer Boden, zum Horizont scrollend (Retro-Wave/Tech-Deck) | `RetroGrid` | `PulseGrid`/`DynamicGrid` (die sind flach, kein 3D-Perspektiv-Boden) |
| Wanderndes Lichtband um eine Box/Karte (Premium-Rahmen-Signal) | `BorderBeam` | `Shine` (Shine läuft über den INHALT, BorderBeam nur über den Rand) |
| Fallende Kometen-Streifen als Hintergrund-Atmosphäre | `Meteors` | `ParticleField` (schwebt/treibt, fällt nicht gerichtet diagonal) |
| Fallende Zeichen-Ströme (Tech/Code/Digital-Ambiente) | `MatrixRain` | `Meteors` (Kometen, keine Zeichen) |
| Gottesstrahlen aus einem Punkt (dramatische Beleuchtung) | `LightRays` | `LightLeak` (zufälliges Overlay-Leck, kein gerichteter Strahlenkranz) |
| Fließende Verbindung zwischen 2 Punkten/Icons (Idee→Umsetzung, Datenfluss) | `AnimatedBeam` | `DataFlowPipes` (gelöscht/ungenutzt) — `AnimatedBeam` ist die aktuelle Lösung |
| Vorher/Nachher-Codezeilen oder Aussagen mit +/− Diff-Markern | `CodeCompare` | `PlanCompare` (ganze Pläne/Stufen, keine Zeilen-Diff), `FlipCard` (1 Karte dreht um, kein Nebeneinander) |
| Viele Tools/Kategorien/Themen als rotierende Icon-Menge | `IconOrbit` | `Constellation` (Wissens-Graph mit Verbindungslinien, keine reine Icon-Menge) |
| Ordner-/Datei-Hierarchie mit Einrückung | `FileTreeReveal` | `Mindmap`/`Cycle` (Konzept-Netz/Kreislauf, keine Datei-Struktur), `NumberedSteps` (lineare Schritte, keine Baumtiefe) |
| Buchstaben scrambeln zufällig, lösen sich zum Zielwort auf | `HyperText` | `Typewriter` (tippt Zeichen für Zeichen, kein Scramble), `SplitFlap`/`SlotRoller` (Zahlen-Walzen-Optik, kein Text-Scramble) |
| Horizontale App-/Tool-Icon-Leiste (Lineup) | `DockRow` | `IconOrbit` (Icons rotieren als Kugel, kein flaches Lineup) |
| Endlos scrollende Reihe aus Text-Chips/Begriffen | `TagMarquee` | `ScrollingImageStrip` (Bilder statt Text-Chips) |
| Markerstrich zieht unter dem Text durch, Text selbst bleibt ruhig | `TextHighlightSweep` | `Emphasis` (Text poppt/skaliert selbst, kein Marker-Strich) |
| Mehrere Kreise/Formen verschmelzen organisch ineinander | `GooBlobs` | `LiquidBlob` (EINE wabbelnde Form, keine Verschmelzung mehrerer) |
| Ein Wort im Satz wechselt durch, Rest bleibt fest | `WordRotate` | `WordStagger` (alle Wörter kommen einzeln rein, keins rotiert danach weiter) |
| Gestapelte, überlappende Nutzer-/Personen-Kreise (Social Proof "X.XXX Nutzer") | `AvatarCircles` | `SocialProofPost` (ganzer Post-Mockup, kein reiner Avatar-Stapel) |

## 1 · Hintergründe & Ambiente
✅ `LivingBackground` (fließender Mesh, immer bewegt) · `MeshGradientBG` · `AuroraBG` · `PulseGrid` · `DynamicGrid` · `FilmGrain` (Korn) · `Background`/`Vignette`
✅ **`ShaderBG`** — echter WebGL-Fragment-Shader (domain-warped Liquid), themed. Aus `@studio/core/three` (opt-in), Render `--gl=angle`.
✅ **`LightLeak`** (2026-07-20) — offizielles `@remotion/light-leaks`-Paket, synthetisches Licht-Leak/Overlay (`seed`, `hueShift`). Braucht `--gl=angle`. `hueShift` muss pro Nutzung auf Marken-Grün getestet werden (Standardwerte tendieren Richtung Lila/Blau).
✅ **`ParticleField`** (2026-07-20, aus react-bits/magic-ui portiert) — schwebende Glow-Partikel, Vollbild-Ambiente, deterministisch.
✅ **`HologramGrid`** (2026-07-20) — Scanlinie + CRT-Raster + Flackern, Sci-Fi/Hologramm-Look.
✅ **`RetroGrid`** (2026-07-21, aus magic-ui portiert, komplett neu als CSS-3D statt WebGL-Shader
  gebaut) — perspektivischer Boden, zum Horizont scrollend. Tech-Deck-Look, für KI-Kanal gedacht.
✅ **`Meteors`** (2026-07-21, aus magic-ui portiert, deterministisch statt `Math.random()`) —
  fallende Kometen-Streifen, Vollbild-Hintergrund-Atmosphäre.
✅ **`BorderBeam`** (2026-07-21, aus magic-ui portiert, SVG-Stroke statt CSS `offset-path`) —
  wanderndes Lichtband um eine Box/Karte, `width`/`height` der umschlossenen Box mitgeben.
✅ **`MatrixRain`** (2026-07-22, aus `remotion-bits` portiert — war bereits NATIV Remotion, nur
  eigenen Hook gegen width/height-Props getauscht) — fallende Zeichen-Ströme, Tech-Ambiente.
✅ **`LightRays`** (2026-07-22, aus react-bits abgeleitet, komplett neu als CSS-Conic-Gradient statt
  WebGL) — Gottesstrahlen aus einem Punkt, kein `--gl=angle` nötig (anders als `ShaderBG`/`LightLeak`).
✅ **`GooBlobs`** (2026-07-22, aus react-bits abgeleitet, SVG-Goo-Filter statt Canvas) — mehrere
  organische Formen verschmelzen/trennen sich fließend ineinander (Metaball-Effekt), Vollbild-Ambiente.
✅ **`IconOrbit`** (2026-07-22, aus magic-ui IconCloud abgeleitet, komplett neu als deterministische
  Fibonacci-Sphäre statt Canvas/Maus-Drag) — rotierende Kugel aus Icons, für "viele Tools/Kategorien/Bereiche".

## 2 · Kamera & Bewegung
✅ `PushIn` · `MotionBlur` · `CameraBlur` · `Float` · `Breathe` · `Move` (Posen, `stage`)
✅ **`KenBurns`** (Drift+Zoom) · **`ParallaxLayer`** (Ebenen-Tiefe)
✅ **`Shake`** (2026-07-21) — kurzes Kamera-/Element-Zittern für Impact-Momente (Schock/Fehler/Warnung),
  `at`+`strength` steuern Einschlag-Zeitpunkt und Stärke, klingt automatisch ab.
✅ **`Cursor`** (2026-07-21) — animierter Mauszeiger wandert Wegpunkte ab und klickt (Puls-Ring), für
  "so klickst du in der App"-UI-Erklärmomente.

## 3 · Übergänge / cineastische Beat-Entrances
✅ `@remotion/transitions` (Fade/Wipe/Slide/Clockwipe) via `transitions.ts`
✅ **`WhipIn`** (Whip-Pan) · **`ZoomPunch`** (Ripple/Zoom-Einschlag) · **`PushThrough`** (aus der Tiefe)

## 4 · Text-Einblendungen (Entrances)
✅ `MaskReveal` · `SoftBlurIn` · `PerCharRise` · `WordStagger` · `WordReveal` · `FocusBlurResolve` · `ChromaticReveal` (Glitch) · `Typewriter` · `Title`/`Body`/`Kicker`

## 5 · Text-Betonung / Highlight
✅ `Emphasis` · `ShimmerText` · `Shine`
✅ **`TextHighlightSweep`** (2026-07-22, aus magic-ui Highlighter abgeleitet) — Markerstrich zieht
  unter dem Text durch, Text selbst bleibt ruhig (anders als `Emphasis`: das poppt/skaliert den Text).

## 6 · Kinetische Typografie (Vollbild-Wortsequenzen)
✅ **`KineticCenterBuild`** (Wörter bauen sich zentriert auf, bleiben stehen)
✅ **`WordRotate`** (2026-07-22, aus react-bits abgeleitet) — fester Prefix/Suffix-Satz, EIN Wort darin
  rotiert durch mehrere Varianten (anders als `WordStagger`: dort kommen alle Wörter einzeln rein und bleiben).
✅ **`HyperText`** (2026-07-22, aus magic-ui abgeleitet, deterministisch statt Interval) — Buchstaben
  scrambeln zufällig, lösen sich zum Zielwort auf. Für Rätsel-/Reveal-Momente.
✅ **`TagMarquee`** (2026-07-22, aus magic-ui Marquee abgeleitet) — endlos scrollende Reihe aus
  Text-Chips/Begriffen (anders als `ScrollingImageStrip`: Text statt Bilder).

## 7 · Zahlen & Zähler
✅ `RollingNumber` (Odometer) · `Counter` · `SlotRoller` · `DigitSlots` · `SplitFlap` · `DrumRoller` · `DramaticNumber` · `CountdownRoller`

## 8 · Diagramme & Daten-Viz
✅ `AreaPremium` · `BarsPremium` · `PiePremium` · `RadarPremium` · `Gauge` · `StatBar` · `Table` · `BigStat` · `StatsCards` · `MilestoneTimeline` · **`LabeledAxisChart`** (Standard-Chart mit Pflicht `xLabel`/`yLabel` — kein Chart ohne Achsenbeschriftung mehr). (2026-07-21: alte handgerollte SVG-Charts `GrowthChart`/`Bars`/`Donut`/`PercentRing` entfernt, `PremiumCharts`-Familie ist jetzt die einzige Chart-Quelle.)
✅ **`DualAreaCompare`** (2026-07-22, Lücke geschlossen) — ZWEI Serien über Zeit mit Legende
  (z.B. "Miete vs. Kaufen", "mit/ohne Sparplan"). Vorher gab's nur Ein-Serien-Charts.

## 8a · Finanz-Metaphern (`metaphors.tsx`)
> Dokumentations-Lücke geschlossen (2026-07-22) — diese Datei war bisher hier nie gelistet.
> Abstraktes Finanz-Konzept als vertrautes Bild, prozedurales SVG. Details: `core/gehirn/METAPHORS.md`.
✅ `Snowball` (Zinseszins/exponentielles Wachstum, positiv gerahmt — Ball rollt bergab, wächst)
✅ **`DebtSpiral`** (2026-07-22, Lücke geschlossen) — Zinseszins GEGEN dich: Kreditkarten-/
  Schuldenfalle, rot/Warnfarbe, spiralt in einen Abgrund statt bergab zu rollen wie `Snowball`
✅ `LeakyBucket` (Inflation/Kaufkraftverlust — Eimer mit Löchern, Füllstand sinkt)
✅ `Diversification` ("nicht alle Eier in einen Korb")
✅ `DollarCostAverage` (Sparplan-Effekt: Kurs schwankt, regelmäßige Käufe glätten den Preis)
✅ `RuleOf72` (72 ÷ Zinssatz = Jahre bis Verdopplung)
✅ `CompoundVsSimple` (Zinseszins-Kurve vs. lineare Verzinsung, Schere öffnet sich)
✅ `TaxDrag` (jährlicher Steuerabzug bremst das Wachstum)
✅ `Correlation` (zwei Linien: synchron/korreliert vs. unabhängig)
✅ `SequenceRisk` (gleiche Durchschnittsrendite, andere Reihenfolge = anderes Ergebnis)
✅ `InflationAdjusted` (Nominalwert vs. realer/inflationsbereinigter Wert)
✅ `YieldCurve` (Zinssatz nach Laufzeit, typisch ansteigende Kurve)
✅ `MarketCycle` (Boom-Bust-Psychologie: Euphorie → Panik → Erholung)
✅ `PresentValue` (Geld heute ist mehr wert als Geld morgen, Barwert)

## 8b · Finanz-Karten & UI-Bausteine (`PremiumFinance.tsx`)
> Dokumentations-Lücke geschlossen (2026-07-22) — 31 Bausteine, bisher nie hier gelistet.
✅ **`CashflowWaterfall`** (2026-07-22, Lücke geschlossen) — Einnahmen-Balken → Ausgaben-Kategorien
  ziehen sichtbar ab → Rest bleibt hervorgehoben stehen. Für "so viel bleibt dir wirklich am
  Monatsende" — `RevenueCard` (unten) ist dafür zu business-artig.
✅ `Ticker` (Kurse/ETFs mit Kurs+Veränderung, glasige Zeilen — vertikale Liste, anders als
  `StockTicker` in `PremiumAccents.tsx`, das ein horizontal scrollendes Band ist, siehe Abschnitt 0)
✅ `RankedList` (nummerierte Rangliste, z.B. Top-ETFs nach Rendite)
✅ `ChecklistCompare` (Vorher/Nachher oder A/B nebeneinander, volle Breite)
✅ `ComparisonBars` (zwei Balken nebeneinander, schneller Vergleich — Details siehe Abschnitt 0)
✅ `PlanCompare` (Preis-/Broker-Vergleich, Karten nebeneinander, eine hervorgehoben)
✅ `InvestorQuote` (großes Zitat, Glaskarte, Autor)
✅ `SpeakerIntro` (Referenten-/Experten-Karte mit Zitat)
✅ `ProfileBadge` (Avatar+Name+Rolle+Statistik-Karte, z.B. Experten-Tipp)
✅ `CollabBadge` (Partnerschafts-Badge, zwei Initialen mit „+" verbunden)
✅ `AchievementBadge` (Meilenstein-Pokal mit Fortschrittsbalken + Belohnung)
✅ `ScoreRing` (Ergebnis-Ring mit Prozent + Verdikt, z.B. Anlegertyp-Test)
✅ `GoalRing` (Kreis-Fortschritt fürs Sparziel, Prozent in der Mitte)
✅ `LevelBar` (Level-/Fortschrittsbalken, z.B. Wissens-Level)
✅ `TrendBadge` (kompaktes Pill mit Trend-Pfeil + Prozentwert)
✅ `CalloutBadge` (Hinweis-Pille mit Verbindungslinie, zeigt auf einen Punkt)
✅ `Milestones` (horizontale Zeitleiste, z.B. Vermögensaufbau über Jahre)
✅ `StepList` (nummerierte Schritte, z.B. "So startest du")
✅ `ProcessFlow` (horizontale, verbundene Schritt-Kette, aktiver Schritt leuchtet auf)
✅ `TaskChecklist` (Aufgaben-Liste mit Metrik-Kopf, hakt sich nacheinander ab)
✅ `UpdateList` (Versions-Badge + abgehakte Neuerungen-Liste)
✅ `FeatureHighlight` (Icon+Titel+Text-Karten nebeneinander)
✅ `TitleCard` (große Aussage, ein Wort/Teil hervorgehoben)
✅ `LowerThird` (Namens-/Themen-Einblendung unten links)
✅ `ConceptExplainer` (Eyebrow + Titel + Aufzählung, Konzept erklären)
✅ `FlipCard` (Frage/Antwort-Karte, dreht sich um die Y-Achse)
✅ `DontDoInstead` (3 durchgestrichene "Nicht tun"-Punkte → choreografiert "Stattdessen")
✅ `AlertNotice` (Warnhinweis-Popup, z.B. Risiko-Disclaimer)
✅ `NewsBanner` (Breaking-News-Streifen, guter Hook-Opener)
✅ `SocialProofPost` (Social-Media-Post-Mockup mit Engagement-Zahlen)
✅ `CartSuccess` (Kauf-/Abschluss-Bestätigung mit Häkchen-Kreis)
✅ `RevenueCard` (große Kennzahl + 3-Spalten-Statistik-Fußzeile, business-artig)
✅ `PremiumOutro` (Abspann mit Glow-Rahmen, Subscribe-Pille, Kanalname)

## 9 · Konzept-Maps (Netze / Flüsse / Abläufe)
✅ `Mindmap` · `Flowchart` · `Pyramid` · `Cycle` · `NumberedSteps` · `CheckCards` · `Timeline` · **`NeuralNet`** (Signal/Backprop/Gewichte, premium) · **`Constellation`** (Wissens-/Ökosystem-Graph, für KI-Kanal) — `ProcessFlow` (ähnlich, Schritt-Kette) siehe Abschnitt 8b
✅ **`KanbanBoard`** (2026-07-21) — Spalten mit Karten, die zwischen Spalten wandern (Bogen-Flug-Animation).
  Für "von A nach B nach C"-Prozess-/Workflow-Aussagen, themen-neutral (nicht nur Finanz/KI).
✅ **`AnimatedBeam`** (2026-07-22, aus magic-ui abgeleitet, komplett neu ohne DOM-Refs/ResizeObserver —
  feste x/y-Koordinaten + manuell berechneter Bézier-Punkt statt `<animateMotion>`/SMIL, das auf
  echter Zeit statt Remotions Frame-Uhr läuft) — fließende Verbindung zwischen 2 Punkten/Icons.

## 10 · Icons & Piktogramme
✅ `Lucide` (1735, `icons.json`) · `Icon` (kuratiertes Flat-Set) · `IconTile` · **`PremiumIcon`** (Standard-Weg für jedes Icon: Gradient-Kreis/Quadrat + Border + Glow + Spring-Scale-In, sm/md/lg) · **`PremiumIconLabel`** (PremiumIcon + Label-Zeile) · **`DontDoInstead`** (3 durchgestrichene „Nicht tun"-Punkte choreografiert übergehend zu 3 hervorgehobenen „Stattdessen"-Punkten, in `PremiumFinance.tsx`)
✅ **`Flag`** (`country="DE"` etc., ISO-3166-1-alpha-2, via `country-flag-icons`) — Länderflaggen für
  internationale Markt-/Währungs-Szenen, gerahmt wie ein Premium-Icon (Border+Glow). Lucide deckt das nicht ab.
✅ **`IconStrike`** (`Lucide.tsx`) — EIN Icon poppt rein, wird dann durchgestrichen. Für einen einzelnen
  "das NICHT tun"-Moment an einer Stelle im Bild (z. B. "nicht panisch verkaufen"). Bei mehreren
  Punkten stattdessen `DontDoInstead` nehmen (Verwechslungsgefahr, siehe Abschnitt 0).

## 11 · Karten & Layout
✅ `Card` · `FeatureGrid` · `CompareSplit` · `Checklist` · `Quote` · `Badge` · `Callout` · `Balance` · `GoalTracker` · `Ranking`
✅ **`BentoGrid`** (2026-07-21) — asymmetrisches Kachel-Raster (`colSpan`/`rowSpan` pro Item), mehrere
  Content-Blöcke gleichzeitig zeigen (anders als `FeatureGrid`: uneinheitliche Kachelgrößen, kein reines Raster).
✅ **`FileTreeReveal`** (2026-07-22, aus magic-ui FileTree abgeleitet, komplett neu ohne Radix-Accordion) —
  Ordner-/Dateistruktur baut sich zeilenweise mit Einrückung nach Tiefe auf.
✅ **`DockRow`** (2026-07-22, aus magic-ui Dock abgeleitet, ohne Maus-Hover-Vergrößerung) — horizontale
  App-/Tool-Icon-Leiste, zeitversetzt erscheinend.
✅ `FlipCard` (`PremiumFinance.tsx`, bisher hier nicht gelistet) — Karte dreht sich um: Frage/Begriff → Antwort/Erklärung.
✅ `PlanCompare` (`PremiumFinance.tsx`, bisher hier nicht gelistet) — mehrere Pläne/Stufen/Optionen nebeneinander, eine hervorgehoben.
✅ **`AvatarCircles`** (2026-07-22, aus magic-ui abgeleitet) — gestapelte, überlappende Personen-Kreise
  + optionaler "+X"-Zähler (Social Proof "X Nutzer"), anders als `SocialProofPost` (kein ganzer Post-Mockup).
✅ **`ScrollingImageStrip`** (2026-07-22, aus `remotion-bits` inspiriert) — endlos loopende, horizontal
  scrollende Bildergalerie (Reihe von Bildern zieht durch), für Auswahl/Vielfalt/Katalog-Momente.
✅ `LowerThird` (`PremiumFinance.tsx`, bisher hier nicht gelistet) — Name/Rolle-Einblendung unten (Broadcast-Standard).

## 12 · Effekte & Partikel
✅ `Confetti` · `Sparkles` · `MoneyRain` · `Particles` · `Shine` · `ChromaticReveal`

## 13 · Reveals & Masken
✅ `SpotlightReveal` (Iris) · `MaskReveal` · **`WaveWipe`** (Wellenkante) · **`Dissolve`** (Korn-Auflösung)
✅ **`DrawOn`** (2026-07-21) — Stift zeichnet live eine Linie (`variant="underline"`) oder einen Kreis
  (`variant="circle"`) um etwas — für "genau HIER schau hin"-Betonung, hand-gezeichneter Look.
✅ **`BoundingBox`** (2026-07-21) — Eck-Rahmen zieht sich live um ein Element/eine Region (x/y/w/h),
  optionales Label. Für UI-Screenshots/Mockups: "dieser Button/dieser Bereich hier".

## 14 · Tech & Code (KI / Elektrotechnik)
✅ `GlassCodeBlock` · `Terminal` · **`LiveCodeCompile`** (tippt→läuft→Output, für KI-Kanal)
✅ **`CodeCompare`** (2026-07-22, aus magic-ui CodeComparison abgeleitet, komplett neu ohne
  Shiki/Async-Highlighting — einfache Monospace-Blöcke mit +/− Zeilen-Markern) — Vorher/Nachher
  nebeneinander, für "so kompliziert war es, so einfach ist es jetzt".
🔨 `TerminalCursorZoom` (optional)

*(2026-07-21: erst `Scramble`/`FlipIn3D`/`WaveText`/`Underline`/`KineticPunch` (TextFX/premium2)
sowie `Terminal`/`CodeDiff`/`ProgressSteps`/`DataFlowPipes`/`InfiniteMarquee`/`DynamicGrid`/
`MatrixDecode`/`TrackingIn`/`MarkerHighlight`/`SpotlightCard` (extras2) und `Constellation`/
`WaveWipe`/`Dissolve`/`LiveCodeCompile` (premium2) entfernt, weil nirgends in channels/ tatsächlich
genutzt — dann noch am selben Tag `Terminal`/`DynamicGrid`/`Constellation`/`WaveWipe`/`Dissolve`/
`LiveCodeCompile` wiederhergestellt, weil `channels/ki/gehirn/BAUSTEINE.md`+`REELS.md` sie fest für
den KI-Kanal einplanen (beim ersten Cleanup nicht geprüft, da ki zu dem Zeitpunkt pausiert war).
Endgültig entfernt bleiben nur die wirklich nirgends referenzierten: `Scramble`/`FlipIn3D`/
`WaveText`/`Underline`/`KineticPunch`/`CodeDiff`/`ProgressSteps`/`DataFlowPipes`/`InfiniteMarquee`/
`MatrixDecode`/`TrackingIn`/`MarkerHighlight`/`SpotlightCard`.)*

## 15 · Mockups & Geräte / Chat-UIs
✅ `PhoneMockup` · `AppScreenDemo` · `WindowMock` · `IconTile` · **`ChatUI`** (ChatGPT/Claude-Bubbles, tippt/antwortet — Kern für KI-Kanal)

## 15a · KI-Tool-Bausteine (Konzept/Demo, KI-Kanal-Kernlücken)
✅ **`TokenStream`** (Text → Token-Chips → Zahlen-Vektor/Embedding, Grundkonzept "wie liest ein LLM Text")
✅ **`AiCanvasReveal`** (Bild/Video entsteht progressiv — Scan+Rausch→scharf, für Prompt→Bild-Tool-Demos)
✅ **`BeforeAfterSlider`** (Wisch-Vergleich Original vs. KI-bearbeitet, für Foto/Video-Tool-Demos)
✅ **`AiThinking`** (kurzer "KI verarbeitet"-Übergangsmoment zwischen Prompt und Antwort)

## 16 · Branding / Rahmen (Hook / Intro / CTA)
✅ `LogoIntro` · `SubscribeBar` · `EndCard` · `Kicker` · `Progress` · `Disclaimer`

## 17 · Untertitel
✅ `Captions` · `CaptionsBoxed` (Karaoke, Wort-synchron, aus Audio) · **`KineticCaption`** (Premium-Untertitel: Wort für Wort, Keyword glüht, für stille Reels — DER Standard)

## 18 · Media (externes Footage)
✅ `Clip` (AI/Stock, plattform-neutral) · `LottieBox` · (Rive via `@remotion/rive`)

## 19 · Choreografie-Motor
✅ `stage`: `ZONE`/`cell` (Raster) · `Move` (Posen) · `Focus`/`dim` (Hervorhebung) · `Slot`

## 20 · Ton (optional, kostenlos)
✅ `Voiceover` · `SoundBed` (Auto-Ducking) · `Sfx` → `core/gehirn/SOUND.md`
✅ **`AudioVisualizer`** (2026-07-21) — Balken reagieren live auf den Audiopegel (`@remotion/media-utils`),
  Waveform-Look für Momente, in denen der Ton selbst sichtbar gemacht werden soll.

## 21 · Bewegungs-Feinschliff (Animationsprinzipien)
> Neu 2026-07-17. Macht aus "bewegt sich" ein "lebt" — die klassischen Animationsprinzipien
> (Anticipation, Overshoot, Secondary Motion) als Helfer-Funktionen, nicht als fertige Bausteine,
> weil sie IMMER in Kombination mit einem bestehenden Move/Element genutzt werden.
✅ **`anticipate(f, moveStart, pullFrames)`** (`tokens.ts`) — kurzer Gegenzug VOR der Hauptbewegung
  (0..1-Wert, selbst mit Pixel-/Scale-Betrag multiplizieren). Vor jedem größeren Hero-Move nutzen,
  nicht nur bei Zahlen.
✅ **`settleWobble(f, settleAt, amplitude, decayFrames)`** (`tokens.ts`) — Nebenteil (Badge/Icon/
  Akzent) schwingt ab, NACHDEM die Hauptbewegung schon steht (abklingende Sinus-Rotation in Grad).
  Für Akzent-Badges neben einer Hero-Zahl/einem Hero-Icon.
- Kombiniert mit `E.spring` (Overshoot-Easing, bereits Standard) ergibt das die volle Kette:
  Anticipation → Overshoot → Secondary Motion. Siehe Demo `_archive/AnimationPrinciplesDemo.tsx`.

## 22 · Wiederkehrende Vorgänge (monatlich/periodisch)
> Neu 2026-07-17. Bug-Auslöser: ein Satz wie "jeden Monat 100€ investieren" wurde nur als
> Text + statisches Tag gezeigt — der wiederkehrende VORGANG selbst war nicht zu SEHEN, nur zu lesen.
> Update selben Tags: der erste Entwurf zeigte den Zyklus als Text ("Monat 1 · 100€") — zu langweilig.
> Jetzt Kalender-Icon-Flip + Punkte-Reihe statt Zahlen/Text; der Abschluss-Hinweis war ebenfalls Text
> ("… 30 Jahre lang") — jetzt ein pulsierendes Unendlich-Icon. Auch das WAS-wächst-Label
> ("ETF-Sparplan") war noch Text — jetzt `containerIcon` (Lucide-Icon), Benennung übernimmt allein
> die Kopfzeile (Regel 7). Komplett textfrei. Siehe REEL-PRINZIPIEN.md Punkt 7.
✅ **`RecurringDeposit`** (`RecurringDeposit.tsx`) — Münze fällt pro Zyklus in einen Behälter, der sich
  schrittweise füllt; ein Kalender-Icon flippt pro Zyklus um, eine Punkte-Reihe füllt sich synchron,
  am Ende pulsiert ein Unendlich-Icon ("geht so weiter") — KEIN Text mehr im ganzen Baustein.
  Für jeden "jede Woche/jeden Monat X passiert"-Satz — NICHT durch einen einzelnen statischen
  Betrags-Tag ersetzen (Verwechslungsgefahr: ein Tag zeigt einen Zustand, `RecurringDeposit` zeigt
  eine Wiederholung über Zeit).

## Szenen-Fertigvorlagen (ganze Beats)
✅ `HookScene` · `StatScene` · `CompareScene` · `ExplainScene` · `CTAScene` · `IntroScene` · `StepsScene` · `ListScene` · `QuoteScene` · `SectionDivider`

---

## ✅ Lücken-Bauplan — erledigt
P1: `ShaderBG` (WebGL) · `WhipIn`+`ZoomPunch`+`PushThrough` · `KenBurns`+`ParallaxLayer` · `ChatUI` · `NeuralNet`→core (+ premium-Pass)
P2: `KineticCenterBuild` · `Constellation` · `WaveWipe`+`Dissolve` · `LiveCodeCompile`
**→ Jede Kategorie hat jetzt ≥1 Premium-Baustein.** Optional-Rest: `TerminalCursorZoom`, weitere Chart-Typen nach Bedarf.
