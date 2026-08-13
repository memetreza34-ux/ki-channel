# Animation Plan — Visual Beats

**Grundsatz:** Inhalt zuerst. Jeder Beat ist `NEW_BUILD`; keine vorhandene Library-Animation bildet diesen App-Prototyp-Workflow exakt genug ab.

| Beat | Sprecherstelle | Gemeinte Aussage | Start → Bewegung → Ende | Umsetzung |
|---|---|---|---|---|
| P1 | „einfache Idee“ | Ausgangspunkt ist nur eine grobe Idee | große Idee-Karte sofort sichtbar → Fokus zieht an | NEW_BUILD |
| P2 | „App-Prototyp“ | Idee kann zu einem sichtbaren Entwurf werden | Idee → Verbindung → große App-Vorschau | NEW_BUILD |
| P3 | „Schreib mir eine App“ | ein vager Auftrag reicht nicht | Prompt erscheint → Warnzustand „zu offen“ | NEW_BUILD |
| P4 | „klares Ziel“ | Ziel begrenzt die Aufgabe | Planfläche → Ziel-Kachel rastet ein | NEW_BUILD |
| P5 | „Funktionen / Ablauf“ | Anforderungen strukturieren die App | drei große Kacheln erscheinen nacheinander | NEW_BUILD |
| P6 | „Oberfläche, Eingaben, Logik, Ergebnis“ | Plan besteht aus klaren Bereichen | vier Bereiche verbinden sich zu einem Gesamtplan | NEW_BUILD |
| P7 | „nicht ein riesiger Block“ | Code entsteht modular | großer Monolith wird sichtbar → teilt sich | NEW_BUILD |
| P8 | „Oberfläche, Daten und Funktionen“ | drei Bausteintypen arbeiten zusammen | UI / DATEN / LOGIK fahren einzeln ein | NEW_BUILD |
| P9 | „erster Prototyp verbunden“ | Module ergeben die App | drei Module → Linien → App-Vorschau wird vollständig | NEW_BUILD |
| P10 | „testen“ | Entwurf wird geprüft | große Testkarte schiebt sich vor Vorschau | NEW_BUILD |
| P11 | „Button falsch“ | Funktionsfehler ist sichtbar | Button-Aktion → rotes Fehlerzeichen → Fix | NEW_BUILD |
| P12 | „Daten fehlen“ | Datenfehler ist eigener Prüfpunkt | Datenkarte leer → rot → gefüllt/grün | NEW_BUILD |
| P13 | „Handy brechen“ | responsive Darstellung kann scheitern | UI läuft aus Rahmen → Layout zieht sich korrekt zusammen | NEW_BUILD |
| P14 | „KI kann Fehler finden“ | KI liefert Diagnose/Änderungsvorschlag | Fehlerliste → Patch-Vorschlag | NEW_BUILD |
| P15 | „du entscheidest“ | Mensch bleibt Freigabe-Gate | Patch stoppt → Entscheidung → Freigabe | NEW_BUILD |
| P16 | „Idee → Struktur → Code → Test → korrigieren → Prototyp“ | kompletter Workflow ist iterativ und kontrolliert | fünf große Schritte aktivieren sich bis kurz vor Ende → finaler Prototyp + kurzer Hold | NEW_BUILD |

### Post-Render-Vorgaben bereits im Design

- P1 ist ab Frame 0 schwach, aber eindeutig sichtbar.
- Hauptmechanik nutzt den Raum oberhalb der Caption-Zone großflächig.
- wichtige interne Labels liegen ungefähr bei 30–38 px.
- keine neue Sprecherbedeutung soll mehrere Sekunden auf einem unveränderten Bild liegen.
- P14–P16 verteilen die gesamte letzte Szene bis zur letzten Phrase; finaler Hold erst danach.
- Phase 3 verschiebt Beat-Grenzen an die reale Stimme; semantische Reihenfolge bleibt unverändert.
