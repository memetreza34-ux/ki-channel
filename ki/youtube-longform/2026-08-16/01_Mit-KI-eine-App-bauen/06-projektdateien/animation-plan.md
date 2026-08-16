# Animation Plan

Alle Beats: `NEW_BUILD` + `REMOTION_NATIVE`.

## Hook
1. Einzelner großer Prompt erscheint → chaotische Code-Layer entstehen → noch keine funktionierende App.
2. Prompt schrumpft → Workflow-Stufen ordnen sich → App-Fenster wird als Ergebnis sichtbar.

## Problem eingrenzen
3. Vage Wolke `Produktivitäts-App` → zerlegt sich in `NUTZER`, `EINGABE`, `ERGEBNIS`.
4. Nutzerkarte sendet Aufgabe in Input → Status entsteht → offene Aufgabe erscheint.
5. viele blasse Feature-Karten tauchen auf → werden bewusst ausgeblendet → MVP-Pfad bleibt.

## Nutzerfluss
6. isoliertes App-Fenster → zerlegt sich in verbundene Zustands-Nodes.
7. Eingabe-Node → Daten-Node → Aktion → Zustand → UI-Update läuft nacheinander auf.
8. finaler Pfad bleibt groß und lesbar stehen.

## Repository
9. ungeordnete Dateien → sortieren sich in UI/Logik/Daten/Komponenten.
10. Commit-Punkt setzt stabilen Snapshot auf Timeline.
11. spätere Änderung färbt Diff ein → Vergleich mit stabilem Punkt wird sichtbar.

## Kontext und kleine Schritte
12. großer Mega-Prompt füllt die Fläche → verliert Fokus → wird durch 4-Fragen-Karte ersetzt.
13. `IST-ZUSTAND`, `ÄNDERUNG`, `GRENZE`, `TEST` aktivieren sich nacheinander.
14. eine konkrete Aufgabe fließt in eine einzelne Komponente.
15. Input + Button werden verbunden → Listeneintrag erscheint → grüner Prüfschritt.
16. nächster Baustein wird erst nach Erfolg freigegeben.

## Testen
17. Browser-App wird bedient statt nur gezeigt.
18. Leer-Eingabe → roter Fehlerzustand.
19. Reproduktionspfad 1–2–3 erscheint → Fehler wiederholt sich identisch.
20. relevante Stelle im Code/State wird fokussiert → Fix wird eingesetzt.
21. derselbe Testpfad läuft erneut → grüner Verifikationszustand.

## Branches
22. stabile Hauptlinie bleibt horizontal.
23. Experiment-Branch zweigt sichtbar ab → neue Funktion entsteht getrennt.
24. Erfolg: Vergleich → Merge zurück in stabile Linie; Misserfolg: Branch blendet aus, Hauptlinie bleibt unverändert.

## Abschluss
25. finaler App-Flow wird wie ein Nutzer durchlaufen.
26. drei große Checks erscheinen: `NUTZERWEG`, `ZUSTÄNDE`, `ÄNDERUNGEN`.
27. komplette Pipeline `PROBLEM → FLOW → REPO → BUILD → TEST → SICHERN` baut sich auf.
28. Schluss-Hold: funktionierender Prototyp im Zentrum, KI als Beschleuniger neben dem kontrollierten Workflow.