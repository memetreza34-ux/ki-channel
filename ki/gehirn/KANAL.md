# 🧠 KI-Kanal — Kanal-Gehirn (Identität)

> Kanal-spezifische Identität für Claude, Codex, Antigravity und weitere Produktionsagenten.
> Repository-Regeln: `AGENTS.md` + `ki/AGENTS.md`.
> Gemeinsame visuelle Bausteine: `core/brand-kit/`.
> Brand-Technik: `ki/brand/brand.ts`.

## Was ist der KI-Kanal

Deutscher, animierter und vollständig faceless KI-Kanal. Inhaltlich bleibt der Kanal bewusst breit: Tools, Konzepte, praktische Use-Cases, News/Trends und ehrliche Einordnung.

Der rote Faden ist immer derselbe:

**Künstliche Intelligenz verständlich, praktisch und visuell klar machen — ohne Hype-Lärm.**

## Zielgruppe

**„Jeder, den KI betrifft.“** — breit, deutschsprachig und nicht nur technisch vorgebildet.

- Die Zielgruppe sieht KI überall, ist teils fasziniert und teils überfordert oder skeptisch.
- Sie will verstehen, was hinter KI steckt und was davon im Alltag wirklich nützlich ist.
- Fachwissen darf nie Voraussetzung sein.
- Der Kanal gibt Orientierung, erklärt Zusammenhänge und zeigt konkrete Anwendung.

## Ton & Stimme — seriös, modern, klar

- Immer **„du“**, nie unnötig distanziert.
- Neugierig und kompetent, aber nicht belehrend oder überheblich-nerdig.
- Vertrauenswürdig und ehrlich: keine Fake-Wunder, keine erfundenen Fähigkeiten, keine Panikmache.
- Kurze, gesprochene Sätze statt Fachtext.
- Fachbegriffe nur verwenden, wenn sie sofort verständlich erklärt oder visualisiert werden.
- Faszination ist erlaubt, muss aber eingeordnet werden.

## USP — drei Säulen

1. **Komplexe KI einfach erklären** — Animationen und klare Metaphern statt Fachchinesisch.
2. **Konkrete Tools und Use-Cases** — welches Tool, wofür, wie und mit welchem realen Nutzen.
3. **Aktuelle Entwicklungen einordnen** — nicht nur News wiederholen, sondern erklären, was sie bedeuten.

## Content-Säulen

1. **Konzept-Erklärer** — LLM, Training, Token, Kontext, Prompting, Agenten usw.
2. **Tool & Use-Case** — konkrete Anwendung mit erkennbarem Nutzen.
3. **News eingeordnet** — was ist neu und was bedeutet es wirklich?
4. **Prompt / Trick** — bessere Nutzung statt leere „10×“-Versprechen.
5. **Mythos / Einordnung** — Behauptung prüfen und ehrlich bewerten.

## 🎨 Visuelle Identität — verbindlich

Die technische Wahrheit liegt in `ki/brand/brand.ts` und der Bildstil in `ki/BILDSTIL.md`.

- **Hintergrund:** weiß `#FFFFFF` oder sehr hell / leicht lila getönt `#F3F0FA`.
- **Standardtext:** dunkel und kontrastreich (`ink` `#1A1A2E`).
- **Marken-Lila:** `#B98CFF` als KI-, Fokus- und Premium-Akzent.
- **Dunkles Lila:** `#6E45C9` für Tiefe und Kontrast.
- **Grün:** Vorteil / Lösung.
- **Rot:** Risiko / Grenze / Fehler.
- **Blau:** nur gezielt für Tech-/Info-Kontext, nicht als zweite Hauptmarke.
- Viel Luft, wenige große Elemente, klare Hierarchie und Smartphone-Lesbarkeit.
- Faceless: keine Face-Cam und keine erkennbaren Gesichter.

Der Standard ist **kein dunkler Cyberpunk-/Neon-Look**. Dunkle Tech-Deck-Referenzen dürfen höchstens als Layout-Inspiration dienen; die tatsächliche Kanaloberfläche bleibt hell, editorial und lila akzentuiert.

## Kern-Bausteine

Je nach Aussage bevorzugt vorhandene Bausteine aus `core/brand-kit/` und der Animation Library verwenden, z. B.:

- `ChatUI` für Chat- und Prompt-Demos
- `NeuralNet` für Modell-/Netzwerk-Erklärungen
- `WindowMock`, `AppScreenDemo`, `PhoneMockup` für Tool-/UI-Demos
- `BigStat`, `BarsPremium`, `Ranking` für geerdete Vergleiche
- `KineticCaption` / Caption-Komponenten für Untertitel

Animationen werden nicht dekorativ ausgewählt. Sprechertext, Meaning Contract und Production Eligibility bestimmen, ob eine Library-Animation wiederverwendet werden darf.

## 🚫 No-Gos

- Kein Hype-Clickbait mit falschem Versprechen.
- Kein Angstporno als Selbstzweck.
- Kein Tool-Spam ohne echten Nutzen.
- Kein Fachchinesisch ohne Erklärung.
- Keine erfundenen Zahlen oder Demo-Werte als Fakten.
- Keine dekorative Animation, die dem Sprecherinhalt widerspricht.
- Kein dunkler Cyberpunk-/Roboter-Look als Standardästhetik.
- Keine erkennbaren Gesichter.

## Verbindliche Verweise

- Reel-Strategie: `ki/gehirn/REELS.md`
- Bildstil: `ki/BILDSTIL.md`
- Repository-/Produktionsregeln: `AGENTS.md`
- KI-spezifische Strukturregeln: `ki/AGENTS.md`
- Brand-Technik: `ki/brand/brand.ts`
- Gemeinsamer Bausteinkatalog: `core/brand-kit/KATALOG.md`
- Produktionsbereite Animationen werden technisch über `ki/src/animation-library/productionEligibility.ts` bestimmt.
