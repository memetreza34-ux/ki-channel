# Scene Plan

| Szene | Frames | Überschrift | Kernmechanik |
|---|---:|---|---|
| bug-01 | 0–360 | Der Bug zeigt sich | App-Button → reproduzierbarer sichtbarer Fehler; Blind-Rewrite wird bewusst verworfen |
| bug-02 | 360–720 | Reproduzieren statt raten | Klick / Soll / Ist + Fehlermeldung + betroffener Code werden zu einem Debug-Paket |
| bug-03 | 720–1080 | Ursache statt Fehlermeldung | Trace läuft UI → Handler → State → API zurück und markiert den plausiblen Bruch |
| bug-04 | 1080–1440 | Kleiner Patch, klare Tests | minimaler Diff-Patch + Erklärung + Testlauf statt großflächiger Rewrite |
| bug-05 | 1440–1800 | Fix wirklich beweisen | denselben Fehler erneut auslösen → Fehler verschwindet → Tests bleiben grün → verifizierter Fix |

Alle Szenen bleiben oberhalb der Caption-Zone `y=1440`. Szene 5 trägt sichtbar bis zur letzten Sprecherphrase.
