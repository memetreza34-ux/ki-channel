# Voiceover — So findet KI den Bug im Code

**143 Wörter · Ziel ungefähr 50–60 s · natürlich sprechen, nicht auf exakt 60,0 s zwingen.**

## Szene 1 — Der Bug zeigt sich
Deine App funktioniert, bis du auf genau diesen Button klickst. Statt blind Code umzuschreiben, kann KI den Fehler Schritt für Schritt eingrenzen – wenn du ihr die richtigen Signale gibst.

## Szene 2 — Reproduzieren statt raten
Zuerst braucht sie nicht das ganze Projekt, sondern den reproduzierbaren Fehler: Was hast du geklickt, was sollte passieren und was ist stattdessen passiert? Dazu kommen Fehlermeldung und betroffener Code.

## Szene 3 — Ursache statt Fehlermeldung
Dann sucht die KI nach der Ursache, nicht nur nach der roten Meldung. Sie verfolgt Datenfluss, Bedingungen und Funktionsaufrufe zurück, bis ein plausibler Bruch im Ablauf sichtbar wird.

## Szene 4 — Kleiner Patch, klare Tests
Erst jetzt entsteht ein Patch. Gute KI ändert möglichst wenig, erklärt die betroffene Stelle und lässt Tests prüfen, ob der Fix wirklich funktioniert – ohne nebenbei etwas anderes kaputtzumachen.

## Szene 5 — Fix wirklich beweisen
Der wichtigste Schritt kommt danach: denselben Fehler erneut auslösen. Verschwindet er, Tests bleiben grün und der Rest läuft weiter, ist aus einem KI-Vorschlag ein überprüfter Fix geworden.
