# Animation Plan

Alle Beats: `NEW_BUILD` + `REMOTION_NATIVE`.

## 1. Hook
1. Einzelne Nutzerkarte `ZIEL` erscheint.
2. Erwartete Chat-Antwort erscheint kurz als einfache Blase.
3. Blase klappt auf und wird zu einem Agent-Workspace mit mehreren Arbeitsschritten.
4. Vier Tool-Verbindungen leuchten nacheinander auf.
5. Ergebnis fließt sichtbar als Feedback zurück in den Agent-Kern.

## 2. Chatbot gegen Agent
6. Split-Screen: links `FRAGE → ANTWORT` als einmalige lineare Bewegung.
7. Rechts wird aus `ZIEL` eine Kette `SUCHEN → VERGLEICHEN → PRÜFEN`.
8. Der Chatbot stoppt; der Agent-Zweig arbeitet sichtbar weiter.
9. Mehrere Zwischenergebnisse landen in einem gemeinsamen Zustand.

## 3. Vier Bausteine
10. `MODELL` rastet als zentraler Kern ein.
11. `ANWEISUNGEN` legen einen sichtbaren Rahmen um den Kern.
12. `WERKZEUGE` docken als Funktionsmodule an.
13. `KONTEXT` füllt einen Speicher-/State-Ring.
14. Erst mit allen vier Modulen wird der Agent als `BEREIT` markiert.

## 4. Agenten-Loop
15. `ZIEL` startet den Loop.
16. `BEOBACHTEN` liest vorhandenen Zustand ein.
17. `ENTSCHEIDEN` markiert genau einen nächsten Schritt.
18. `HANDELN` löst ein Tool aus.
19. `ERGEBNIS` kehrt in den Kontext zurück.
20. Zweite Runde beginnt mit verändertem Zustand, damit die Wiederholung sichtbar wird.

## 5. Beispiel: Entscheidungsvorlage
21. Drei Dokumentkarten werden gefunden und geöffnet.
22. Kernaussagen lösen sich aus den Dokumenten und sammeln sich auf einem Board.
23. Zwei Werte kollidieren sichtbar; `KONFLIKT` erscheint.
24. Agent verzweigt gezielt zu `FEHLENDE INFO SUCHEN`.
25. Neue Information schließt die Lücke.
26. Entwurf wird aus den geprüften Punkten zusammengesetzt.
27. Checkliste prüft Anforderungen und gibt den Entwurf frei.

## 6. Werkzeuge
28. Toolbox zeigt `SUCHE`, `DATEIEN`, `CODE`, `BROWSER` in neutralem Zustand.
29. Für eine aktuelle Frage wird nur `SUCHE` aktiviert.
30. Für Projektkontext schaltet der Fokus zu `DATEIEN`.
31. Für Berechnung/Test wird `CODE` aktiviert.
32. Für UI-Interaktion wird `BROWSER` aktiviert.
33. Nicht benötigte Tools bleiben bewusst deaktiviert.

## 7. Risiken
34. Eine rote `FALSCHE ANNAHME` entsteht am Anfang einer Aktionskette.
35. Der Fehler propagiert sichtbar durch Suche, Datei und Ergebnis.
36. Eine externe Dokumentkarte enthält `FREMDE ANWEISUNG` und versucht in den Steuerpfad zu springen.
37. Risiko-Zone isoliert diese Fremdinstruktion statt sie direkt zu übernehmen.

## 8. Kontrolle
38. Tool-Permissions zeigen nur freigegebene Rechte.
39. Riskante Aktion läuft gegen ein `BESTÄTIGUNG NÖTIG`-Gate.
40. Ergebnis passiert eine Verifikationsstufe.
41. Stop-Kriterium entscheidet zwischen `FERTIG`, `WEITER` und `NACHFRAGEN`.

## 9. Einsatz & Schluss
42. Fester klassischer Workflow läuft auf einer geraden Schiene.
43. Agenten-Pfad verzweigt dynamisch abhängig von fehlender Information.
44. Labels `VORHERSEHBAR` und `FLEXIBEL` ordnen beide Ansätze ein, ohne Siegerpose.
45. Finale Agenten-Anatomie baut sich zusammen: `ZIEL → KONTEXT → ENTSCHEIDEN → TOOL → FEEDBACK`.
46. Schluss-Hold: Agent-Kern im Zentrum, außen `WERKZEUGE`, `REGELN`, `KONTROLLE`; Caption-freie, lesbare Endkarte.
