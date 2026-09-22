# 🧰 Werkzeuge — welches wann

Das Repository hat Skills, Agenten und Regeln für unterschiedliche Produktionsschritte. Diese Datei legt fest, **wann** was dran ist.

## Die Regel

> Erst starke Idee wählen. Dann Story und Bedeutung entscheiden. Danach Fakten sichern. Danach Bildsprache wählen. Erst dann Technik und Motion. Nach Veröffentlichung aus echten Daten lernen.

## Reel bauen — in dieser Reihenfolge

| # | Schritt | Werkzeug | Wofür genau |
|---|---|---|---|
| 0 | Thema auswählen | `THEMENWAHL.md` | Relevanz, Hook-Potenzial, sichtbarer Mechanismus, Payoff, Grounding |
| 1 | Reel anlegen | `reel-production-pipeline` | Ordner, Phasen, V2-Pflichtdateien |
| 2 | Story/Hook prüfen | `STORY_RETENTION.md` | Viewer Promise, Hook, 3-second proof, Payoff, Memorable Moment |
| 3 | Fakten sichern | `FAKTENQUELLEN.md` | Claims klassifizieren, Quellen, sichtbare Zahlen, Recheck |
| 4 | Sprechertext finalisieren | `REELS.md` | eine klare Idee, gesprochener Spannungsbogen, Visual Beats vorbereiten |
| 5 | Bildsprache wählen | `VISUAL_STRATEGY.md` | REMOTION_NATIVE vs REAL_CAPTURE vs HYBRID vs externe Assets |
| 6 | Tonfall und Hierarchie | `motion-art-direction` | Was ist Held, was Stütze, was bewegt sich nicht |
| 7 | Bildaufbau | `shot-composition` | Raster, sichere Zonen, Objektbeziehungen, Blickführung |
| 8 | Mechanik wählen | `REMOTION_ANIMATION_CAPABILITIES.md` | passende Technik erst nach der Visual Strategy |
| 8a | Technik ansehen | `npm run motion-demos:list` | Beispiele für Morph, Pfad, Prozess und Übergänge |
| 9 | API nachschlagen | `remotion-docs` | aktuelle Signaturen statt Erinnerung |
| 10 | Bewegung umsetzen | `animation-principles` + `BEWEGUNG.md` | Kurve, Dauer, Staffelung |
| 11 | Farbe über Zeit | `color-motion` | Palette und Zustandswechsel |
| 12 | Rhythmus zum Ton | `beat-sync-editing` | Schnitte/Akzente am echten Voiceover |
| 13 | Grounding prüfen | `content-grounding-test` | Sprecher → Meaning → Beat → Modality → Render-Props |
| 14 | Rendern | `remotion-render` | Export und technische Kontrolle |
| 15 | Technischer Review | `POST_RENDER_REVIEW.md` | Kollisionen, Safe-Zones, Lesbarkeit, Renderfehler |
| 16 | Creative Review | `CREATIVE_QA.md` | Hook, Tempo, Kartenlastigkeit, Storytelling, Smartphone-Eindruck |
| 17 | Nach Veröffentlichung lernen | `PERFORMANCE_LEARNING.md` | echte Retention-/Watch-/Action-Signale diagnostizieren und kontrollierte Tests ableiten |

**Schritt 16 ist ein echtes Stop-Gate.** Technisch fehlerfrei reicht nicht.

Schritt 17 ist kein Release-Gate. Er verbessert zukünftige Themen-, Hook- und Visual-Entscheidungen anhand realer Kanal-Daten.

## Technik-Demos

`ki/src/animation-library/demo/` zeigt Mechaniken, die über klassische Karten-Grammatik hinausgehen.

```bash
npm run motion-demos:stills
```

Demos sind keine automatische Produktionswahl. Erst Aussage, Beat und Modality bestimmen, dann entscheiden, ob eine Demo-Technik passt.

## Agenten

| Agent | Wann |
|---|---|
| `content-test-runner` | Grounding-Tests diagnostizieren, bevor gerendert wird |
| `context-overload-reel-builder` | nur für den dafür freigegebenen reel-spezifischen Phase-3-Fall |

Agenten starten nur, wenn der Schritt sie wirklich verlangt.

## Häufigste Fehler

### 1. Schlechte Idee technisch perfektionieren

Wenn Relevanz, Hook, sichtbarer Mechanismus oder Payoff schon vor Produktion schwach sind, zuerst `THEMENWAHL.md` anwenden. Nicht hoffen, dass Motion das Thema rettet.

### 2. Zu früh an Motion denken

`animation-principles` beantwortet **wie** sich etwas bewegt. Es beantwortet nicht:

- ob die Story stark ist
- welche Aussage wichtig ist
- welche Bildsprache die beste ist
- ob reale UI der bessere Beweis wäre

Wer hier startet, animiert oft eine Karte sauber, die nie hätte existieren sollen.

### 3. Remotion mit Qualität verwechseln

Remotion ist stark für kontrollierbare Erklärlogik. Es ist aber nicht automatisch die beste Lösung für jedes Hero-Motiv.

Wenn reale UI, räumliche Szene, Hybrid oder externes Motion-Asset die Aussage klarer macht, entscheidet `VISUAL_STRATEGY.md` entsprechend.

### 4. Mehr Technik bauen, obwohl die Story schwach ist

Wenn Hook, Leerlauf oder visuelle Wiederholung das Problem sind, zuerst `STORY_RETENTION.md` und `CREATIVE_QA.md` anwenden — **nicht** die Animation Library erweitern.

### 5. Auf einen einzelnen Upload überreagieren

Performance-Daten sind wertvoll, aber eine einzelne Veröffentlichung ist kein neuer Kanalvertrag. `PERFORMANCE_LEARNING.md` trennt Diagnose von vorschnellen globalen Regeländerungen.

## Prüfung

`ki/src/motion/__tests__/werkzeuge.test.ts` hält die Tabelle ehrlich: installierte Skills und Agenten müssen eingeordnet sein; referenzierte Gehirn-Dokumente müssen existieren.
