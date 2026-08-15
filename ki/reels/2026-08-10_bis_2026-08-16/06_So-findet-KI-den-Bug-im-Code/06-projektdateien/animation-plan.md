# Animation Plan — 16 Visual Beats

1. `Deine App funktioniert ... Button klickst` → App ist sichtbar → Button pulst/klickt → Fehlerpanel erscheint → **NEW_BUILD** → Szene 1 Anfang.
2. `Statt blind Code umzuschreiben` → großer Codeblock droht alles zu ersetzen → Rewrite-Fläche wird durchgestrichen/zurückgezogen → **NEW_BUILD**.
3. `Schritt für Schritt eingrenzen` → Fehlerpanel wird mit klarer Trace-Linie verbunden → Scope wird kleiner → **NEW_BUILD**.
4. `richtigen Signale` → drei Signalkarten Klick / Soll / Ist erscheinen → **NEW_BUILD**.
5. `reproduzierbaren Fehler` → Klickfolge wird nummeriert abgespielt → derselbe Fehler erscheint erneut → **NEW_BUILD** → Szene 2.
6. `was sollte ... stattdessen` → Soll/Ist-Split zeigt erwartete vs. tatsächliche UI → **NEW_BUILD**.
7. `Fehlermeldung und betroffener Code` → Error-Card + Codeausschnitt docken an Debug-Paket → **NEW_BUILD**.
8. `nach der Ursache` → rote Meldung bleibt rechts, Trace startet bewusst davor zurück → **NEW_BUILD** → Szene 3.
9. `Datenfluss` → Datenpunkt wandert UI → Handler → State → API → **NEW_BUILD**.
10. `Bedingungen und Funktionsaufrufe` → Branch teilt sich; falscher Pfad wird sichtbar → **NEW_BUILD**.
11. `plausibler Bruch` → eine konkrete Kante/Condition wird fokussiert, Rest dimmt ab → **NEW_BUILD**.
12. `Erst jetzt entsteht ein Patch` → Mini-Diff mit exakt einer entfernten/einer ergänzten Zeile → **NEW_BUILD** → Szene 4.
13. `ändert möglichst wenig, erklärt` → Patch bleibt klein; Erklärungspointer markiert nur betroffene Stelle → **NEW_BUILD**.
14. `lässt Tests prüfen` → drei Test-Chips laufen nacheinander, kein Erfolg vor Abschluss → **NEW_BUILD**.
15. `denselben Fehler erneut auslösen` → exakt derselbe Klick wird wiederholt; Error-Panel bleibt weg → **NEW_BUILD** → Szene 5.
16. `Tests bleiben grün ... überprüfter Fix` → Tests grün + Nebenpfade laufen + Badge `VERIFIZIERT` erscheint erst ganz am Ende → **NEW_BUILD**.

Keine dekorative Füllanimation. Jede sichtbare Zustandsänderung folgt Sprecherbedeutung. Caption-Zone bleibt vollständig leer von Animation.
