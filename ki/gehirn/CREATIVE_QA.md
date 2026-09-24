# Creative QA — Zuschauer vor Technik

Dieses Gate wird nach dem technischen Render und vor jeder Freigabe angewendet.
Ein Reel kann alle Tests bestehen und trotzdem langweilig oder irreführend sein. Dann ist es **nicht fertig**.

## 1. Hook-Gate

Die ersten 1–2 Sekunden müssen mindestens eines zeigen:

- sichtbaren Konflikt
- überraschendes Ergebnis
- konkrete Situation, die sofort eine Frage erzeugt
- Vorher/Nachher-Kontrast
- Frage, deren Antwort nicht offensichtlich ist

Nicht als Einstieg:

- Begrüßung
- Kanalname
- „Heute erkläre ich dir …“
- Fachbegriff ohne konkreten Zuschaueranker
- Kontext, der auch nach dem Hook kommen kann

**Test:** Wenn man zuerst erklären muss, warum der Begriff interessant ist, ist der Hook zu abstrakt.

## 2. Current-AI-/Themen-Gate

Vor dem visuellen Review prüfen:

- Ist klar, **was neu oder aktuell relevant ist**?
- Ist der Payoff mehr als „Begriff verstanden“?
- Gibt es eine konkrete Produktwirkung, Entscheidung oder sichtbare Konsequenz?
- Würde ein Nicht-Techniker nach 2 Sekunden wissen, warum er bleiben soll?
- Wird Herstellerclaim von echtem Beweis getrennt?
- Hat ein Ranking/Vergleich einen klaren Datumsstand und Kriterien?

Wenn nicht: **Reel nicht durch mehr Animation retten. Thema/Angle neu bauen.**

## 3. Visual-Story-Gate

Jeder bedeutungstragende Beat braucht sichtbare Handlung, Beziehung oder Zustandsänderung.

Bevorzugt:

- Objekt reist von A nach B
- etwas wird sortiert, ausgewählt oder verworfen
- zwei Dinge konkurrieren
- Form/Zustand verwandelt sich
- Bild/Objekt zerfällt und setzt sich neu zusammen
- Kamera fokussiert eine relevante Stelle
- Frage löst sichtbare Aufmerksamkeit/Fokus aus
- Ursache erzeugt sichtbar eine Wirkung
- Code verändert sich sichtbar
- Repo-Struktur baut sich auf
- Ranking verschiebt sich nachvollziehbar

Eine Karte ist nur erlaubt, wenn die Karte selbst semantisch das Objekt ist.

## 4. Remotion-Illustrations-Gate

Der Kanal ist **Remotion-first**. Jeder finale Frame wird in Remotion komponiert.

Prüfen, ob das Reel große eigene Remotion-native Visuals nutzt:

- SVG-/CSS-Szene
- Objekt/Umgebung
- pseudo-fotografische 2.5D-Illustration
- eigene Vector-Icons
- Code-/Terminal-Szene
- GitHub-/Repo-Szene
- Ranking-/Vergleichsmechanik
- Clipping/Masken/Layer/Perspektive
- Shapes/Paths
- Three nur bei echter Tiefenlogik

Nicht akzeptieren, wenn ein anschauliches Thema unnötig auf Karten + Labels reduziert wurde.

## 5. Real-Capture-/Truth-Gate

Ein Remotion-UI-Nachbau ist eine **Illustration**, kein echter Screenshot.

**FAIL**, wenn:

- ein UI-Nachbau wie ein echter Produkt-Capture präsentiert wird
- eine erfundene Schaltfläche/Option als aktuell real behauptet wird
- ein erfundener Output wie ein echtes Modellergebnis dargestellt wird
- ein nachgebautes Markenlogo wie das offizielle Original ausgegeben wird

Wenn reales Produktverhalten die Aussage belegt, muss ein echter Capture/echter Output verwendet und anschließend in Remotion eingebettet werden.

## 6. Logos und Icons

Prüfen:

- generische Icons sauber und konsistent, SVG/Vector bevorzugt
- keine Emoji als Haupticon
- offizielles Logo nur als echtes vorhandenes Markenasset
- ohne offizielles Asset neutraler Badge/Markenname/Kategorie-Icon
- keine visuell falschen Fake-Logos

## 7. Karten-Budget

Richtwert:

- höchstens etwa ein Viertel der Visual Beats primär karten-/boxbasiert
- mindestens die Hälfte objekt-, pfad-, form-, raum-, code-, illustration- oder prozessbasiert
- keine zwei langen Szenen hintereinander mit derselben Karten-Grammatik
- mindestens ein klarer Hero-/Memorable-Moment

## 8. Tempo- und Motion-Dichte

Prüfen:

- Konflikt spätestens nach 2 Sekunden klar
- innerhalb der ersten 3 Sekunden echte Zustandsänderung
- ungefähr alle 1,5–3 Sekunden eine bedeutungstragende sichtbare Veränderung
- kein fertiger statischer Zustand länger als etwa 2,5 Sekunden ohne Grund
- längere Szene hat normalerweise mindestens zwei echte Micro-Beats
- Bewegung ist an Sprecherinhalt gekoppelt, nicht nur dekorativ

50–60 Sekunden sind kein Ziel. Wenn 42 Sekunden reichen, wird nicht auf 55 gestreckt.

## 9. Fakten-Gate

Vereinfachung darf das mentale Modell nicht falsch machen.

Besonders prüfen:

- produkt-/modellspezifische Details als solche kennzeichnen
- illustrative Zahlen nicht wie Messwerte darstellen
- reale UI/Features bei aktuellem Produktbezug prüfen
- Rankings/Benchmarks nicht pseudo-präzise darstellen
- Preise/Limits/Versionen aktuell rechecken
- „immer“, „nie“, „alle“ vermeiden, wenn nicht belegt

## 10. Pattern-Interrupt-Gate

Mehrere Bildsprachen nutzen, wenn der Inhalt sie rechtfertigt:

- große Einzelobjekte/Illustration
- Pfad/Prozess
- Formveränderung
- Vergleich/Split
- Code/Terminal
- GitHub/Repo
- Dokument/UI
- räumliche 2.5D-/3D-Metapher
- kurzer Typografie-Akzent
- Diagramm nur bei echten Daten-/Gewichtsaussagen

## 11. Text-Gate

Sprecher = Aussage.  
Caption = Lesbarkeit.  
Animation = Erklärung.  
Header = Kapitelmarker.

Erlaubt sind normalerweise nur:

1. kurze Überschrift + Icon oben
2. wirklich nötige Objekt-/UI-Labels
3. synchroner Caption unten

**Nicht freigeben**, wenn zusätzlich graue Hilfssätze, Meta-Kommentare oder wiederholende Erklärungstexte im Visual stehen.

## 12. Caption-Gate

Für 1080×1920 gilt der aktuelle Standard aus `CAPTION_SAFE_POSITION.md`:

- Standard `bottom: 300px`
- aktiver Sprechfokus lila
- normalerweise 4–6 Wörter pro Sinnblock
- maximal 2 sichtbare Zeilen gleichzeitig
- Caption soll deutlich unter dem Hauptvisual sitzen
- finaler Sync nur aus echtem Audio

**Nicht freigeben**, wenn 3 oder mehr Caption-Zeilen gleichzeitig sichtbar sind.

## 13. Current-AI-Formatchecks

### `NEUE KI` / `KI-UPDATE`

- neue Fähigkeit schnell sichtbar
- echter Unterschied statt Feature-Liste
- Grenze/Haken vorhanden

### `X VS. Y`

- gleiche oder fair vergleichbare Aufgabe
- klare Kriterien
- Ergebnis visuell direkt vergleichbar

### `GITHUB-FUNDSTÜCK`

- echter Nutzen erkennbar
- Repo nicht nur wegen Stars gewählt
- Code/Terminal/Architektur oder echte Demo sichtbar

### `TOP KIs AKTUELL`

- Datumsstand vorhanden
- klare Kriterien
- keine pseudo-genauen Scores ohne Grundlage

### `LOHNT SICH X?`

- Vorteil
- Nachteil
- Zielgruppe
- klare Nutzungsempfehlung

## 14. Smartphone-Test

Finales MP4 auf Smartphone-Größe ansehen.

Fragen:

1. Würde ich nach 1 Sekunde weiterschauen?
2. Ist nach 3 Sekunden klar, worum es geht?
3. Passiert sichtbar genug, ohne hektisch zu werden?
4. Gibt es zu viel weiße/ungenutzte Fläche?
5. Wiederholt sich Kartenlogik?
6. Gibt es mindestens einen erinnerbaren visuellen Moment?
7. Versteht man die Kernmechanik kurz ohne Ton?
8. Sitzt die Caption tief genug, ohne in UI zu geraten?
9. Ist Code/Terminal auf Smartphone lesbar?
10. Wirkt irgendein UI-Nachbau fälschlich wie ein echter Capture?
11. Wirkt irgendeine Demo-Zahl wie ein echter Messwert ohne Quelle?

Wenn bei 1, 2, 5, 7, 10 oder 11 die Antwort schlecht ausfällt: **nicht freigeben**.

## 15. Reihenfolge bei Problemen

Wenn technisch sauber, aber langweilig:

1. Thema/Angle prüfen
2. Hook neu bauen
3. Leerlauf kürzen
4. Kartenbeats durch echte Objekt-/Illustrations-/Code-/Repo-Mechaniken ersetzen
5. unnötigen Visual-Text entfernen
6. Motion-Cues dichter an Sprecherbedeutung koppeln
7. erst danach neue Technik bauen

**Keine neue Animation Library als Ersatz für eine schwache Content-Idee.**

## 16. Finales Stop-Gate

Ein Reel ist **nicht freigegeben**, wenn mindestens eines zutrifft:

- schwacher/langsamer Hook
- keine klare sichtbare Veränderung
- monotone Kartenserie
- kein erinnerbarer visueller Moment
- UI-Nachbau als Fake-Beweis
- erfundener Output
- Fake-Logo
- redundante Textschichten
- 3+ Caption-Zeilen
- zentrale Visuals zu klein für Smartphone
- aktuelle Claims nicht rechecked
- Render gehört nicht exakt zum geprüften Source-Stand

## 17. Dokumentation

V2-Reels dokumentieren das Ergebnis in:

```text
06-projektdateien/creative-review.md
```

Mindestens:

```text
Hook: PASS | REWORK
Current-AI-Relevanz: PASS | REWORK
Remotion-native Visualqualität: PASS | REWORK
Visual Diversity: PASS | REWORK
Beweis-/Capture-Wahrheit: PASS | REWORK
Caption/Smartphone: PASS | REWORK
Fakten-Recheck: PASS | REWORK
Gesamt: PASS | REWORK
```

Nur `Gesamt: PASS` darf als kreativ freigegeben gelten.
