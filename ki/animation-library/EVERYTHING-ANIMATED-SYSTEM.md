# Everything Animated System

## Ziel

Der KI-Kanal soll nicht nur einzelne Szenen mit einer großen Hauptanimation versehen. Jede Aussage soll so weit wie sinnvoll sichtbar erklärt werden:

```text
Reel-Thema
→ Content-Modus
→ individuelle Vollanimation pro Szene
→ Wort-für-Wort-Untertitel
→ sichtbare Reaktion auf jedes wichtige Wort
→ erklärende Annotationen, Zahlen, Quellen und UI-Aktionen
→ inhaltlicher Übergang
→ synchrones Sounddesign
```

„Alles animieren“ bedeutet nicht, dass jedes Wort springen, glühen oder rotieren soll. Das System unterscheidet:

- **Vollanimation:** erklärt den ganzen Satz.
- **starke Wortanimation:** maximal drei pro Szene für zentrale Aktionen, Zahlen, Transformationen, Vergleiche oder Risiken.
- **unterstützende Wortanimation:** Connector, Messwert, Markierung, Cursor, Quelle oder Ergebniszustand.
- **normaler Untertitel-Reveal:** jedes übrige gesprochene Wort bleibt lesbar, aber ruhig.
- **Hold:** kurze Ruhe vor und nach der Hauptbewegung.

So bleibt das Reel lebendig, ohne hektisch oder langweilig zu werden.

## Umfang

### Vollständige Animationsbibliothek

```text
88 ausführbare Remotion-Animationen
22 visuelle Familien
4 ausführbare Mechanismen pro Familie
```

### Erweiterter Ideenkatalog

```text
132 gesamte Animationskonzepte
22 visuelle Familien
6 Konzepte pro Familie
```

Die zusätzlichen 44 Konzepte besitzen bereits Semantik, Layout, Bewegungsdramaturgie, Grundbausteine und Übergangsanker. Ihr Status bleibt `concept`, bis ausführbarer Remotion-Code, Testframes, MP4 und visuelle Prüfung existieren.

### Mikroanimationen

`microMotionCatalog.ts` enthält eine semantische Bewegungsgrammatik für:

- Hauptbegriffe und Definitionen
- Aktionen
- Transformationen
- Zahlen und Prozentwerte
- Vergleiche
- Negationen
- Ursache und Wirkung
- Risiken und Warnungen
- Quellen und Belege
- Zeit und Versionen
- Schritte und Abläufe
- Tools und UI-Aktionen
- Resultate
- Annotationen
- Übergänge
- Sound-Cues

Die Mechanismen sind kurz, deterministisch und für Wort-Synchronisierung vorgesehen. Sie ersetzen keine Vollanimation.

## 20 Content-Modi

`channelContentModes.ts` erkennt die Art des KI-Inhalts und legt die passende Produktion fest:

1. Concept Explainer
2. Tool UI Tutorial
3. Prompt Before/After
4. Model Comparison
5. AI News Update
6. Release Timeline
7. Pricing and Cost
8. Benchmark Data
9. Workflow Automation
10. Agent System
11. API and Code
12. Image Generation
13. Video Generation
14. Audio and Voice
15. Privacy and Security
16. Myth vs Fact
17. List and Ranking
18. Case Study
19. Troubleshooting
20. Source Verification

Dadurch wird nicht jedes Thema mit denselben Karten, Kreisen oder Diagrammen erklärt.

## Visuelle Quellen

Das System darf abhängig vom Inhalt verwenden:

- Remotion-Geometrie und Motion Graphics
- kinetische Typografie
- nachgebaute UI für Tutorials
- annotierte Screenshots
- Datencharts
- animierte Codeausschnitte
- generierte Illustrationen
- animierte Asset-Cutouts
- Quelldokumente
- Timelines
- Vergleichsbühnen

### Bildregel

Ein Bild darf nicht nur statisch gezeigt und generisch gezoomt werden. Mindestens eine inhaltliche Animation muss vorhanden sein:

- relevante Region wird fokussiert
- Objekte werden getrennt oder verbunden
- Tiefe und Ebenen erklären einen Zusammenhang
- Callouts zeigen Ursache oder Funktion
- Zustand verändert sich sichtbar
- Bildbestandteil wird als Übergangsobjekt weitergeführt

## Wichtige Wörter

`importantWordCoverage.ts` erkennt unter anderem:

- Negationen wie `nicht`, `kein`, `niemals`
- Risiken wie `falsch`, `Halluzination`, `unsicher`
- Zahlen und Prozentwerte
- Vergleiche wie `besser`, `schneller`, `mehr`, `weniger`
- Ursache und Wirkung
- Transformationen wie `wird`, `übersetzt`, `zerlegt`
- Aktionen wie `prüft`, `analysiert`, `entscheidet`
- Tools wie ChatGPT, Claude, Gemini, API, Agent und Prompt
- Quellen und Belege
- Reihenfolgen
- Ergebnisse

Jedes erkannte wichtige Wort erhält einen semantisch passenden Bewegungsmechanismus. Nach drei starken Bewegungen werden weitere Wörter nur unterstützend animiert.

## Universal Motion Plan

`universalMotionPlan.ts` prüft pro Szene:

- eine eindeutige Vollanimation existiert
- jedes wichtige Wort ist abgedeckt
- höchstens drei starke Wortbewegungen verwendet werden
- Überschrift, Hauptanimation und Untertitel getrennte Ebenen besitzen
- Soundeffekte an sichtbare Aktionen gebunden sind
- Start- und End-Hold vorhanden sind
- ein inhaltlich passender Übergang gewählt wird

Für das gesamte Reel werden zusätzlich geprüft:

- keine Vollanimation doppelt
- kein identisches Layout direkt hintereinander
- keine identische Bewegungssignatur direkt hintereinander
- mindestens vier visuelle Familien bei mindestens vier Szenen
- keine übermäßige Konzentration einer Mikroanimation

## KI-Kanal Masterplan

`channelReelMasterPlan.ts` verbindet:

```text
Szenenanalyse
+ Vollanimationsplan
+ Content-Modus
+ wichtige Wörter
+ Mikroanimationen
+ Sound-Cues
+ Übergänge
+ Implementierungsbrief
+ Qualitätsblocker
```

Der Masterplan kann als Markdown ausgegeben und direkt an Claude Code oder Codex übergeben werden.

## Verbindlicher Rhythmus

```text
Hold
→ sichtbare Ursache
→ Hauptbewegung
→ sichtbare Wirkung
→ Ergebnis-Hold
```

- Hard Cuts sind Standard.
- Übergänge werden nur verwendet, wenn Objekt, Form, Richtung oder Zustand in die nächste Szene übernommen werden kann.
- Kein Fade-to-black.
- Keine dauernden Pulse oder Rotationen.
- Keine dekorativen Partikel ohne Bedeutung.
- SFX unterstützen sichtbare Aktionen.
- Mobile Lesbarkeit ist wichtiger als Komplexität.

## Freigabe

Ein Reel gilt nur dann als vollständig animiert, wenn:

- Satzabdeckung 100 Prozent beträgt
- Wichtige-Wörter-Abdeckung 100 Prozent beträgt
- jede Szene eine Vollanimation besitzt
- keine Wiederholungsblocker vorliegen
- TypeScript und Tests bestanden sind
- Testframes und MP4 gerendert wurden
- mobile Lesbarkeit visuell geprüft wurde
- Sound und Übergänge in voller Geschwindigkeit kontrolliert wurden

## Ehrlicher Status

Als Code vorhanden:

- 88 ausführbare Vollanimationsmechanismen
- 44 weitere detaillierte Konzepte
- 38+ semantische Mikroanimationsmechanismen
- 20 KI-Content-Modi
- Wichtige-Wörter-Abdeckung
- Universal Motion Plan
- KI-Kanal Masterplan
- Tests für Katalog, Content-Modi, Mikroanimationen und Abdeckung

Noch nicht bestätigt:

- erfolgreicher TypeScript-Lauf der neuen Dateien
- bestandene neue Vitest-Tests
- echte Render der neuen Systeme
- visuelle Qualität der 88 vorhandenen Vollanimationen
- Umsetzung der zusätzlichen 44 Konzepte als Remotion-Komponenten

Diese Punkte dürfen nicht als bestanden bezeichnet werden, bevor sie tatsächlich ausgeführt und geprüft wurden.
