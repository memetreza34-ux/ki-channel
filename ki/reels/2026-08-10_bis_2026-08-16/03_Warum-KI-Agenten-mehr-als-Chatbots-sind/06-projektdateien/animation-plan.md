# Animation Plan — Visual Beats

**Grundsatz:** Inhalt zuerst. Jeder Beat ist `NEW_BUILD`; keine bestehende Library-Animation bildet die jeweilige Mechanik exakt genug ab.

| Beat | Sprecherstelle | Gemeinte Aussage | Start → Bewegung → Ende | Umsetzung |
|---|---|---|---|---|
| A1 | „Chatbot wartet“ | klassischer Chat reagiert auf neue Eingabe | Chatkarte ist ab Frame 0 bereits leicht sichtbar → Antwort erscheint → deutlich lesbarer Wartezustand | NEW_BUILD |
| A2 | „Agent bekommt ein Ziel“ | Agent startet von einem Ziel | große Zielkarte erscheint → Agent wird aktiviert | NEW_BUILD |
| A3 | „mehrere Schritte planen“ | Ziel wird in Teilaufgaben zerlegt | 1 Ziel → 3 größere, smartphone-lesbare Schritte | NEW_BUILD |
| A4 | „Werkzeuge benutzen“ | Agent hat verfügbare Tools | großer Agentkern → vier große Tool-Karten fahren ein | NEW_BUILD |
| A5 | „suchen / Dateien / Code / Daten“ | verschiedene Werkzeugtypen | Tool-Karten werden nacheinander deutlich aktiviert | NEW_BUILD |
| A6 | „nur Text“ vs. Ergebnis | Tools liefern Resultate zurück | Aktivierung → große Resultat-Chips fließen zurück | NEW_BUILD |
| A7 | „prüft das Ergebnis“ | Aktion wird nicht nur ausgeführt | Ergebnis → großes Prüffeld → Status entsteht | NEW_BUILD |
| A8 | „welcher Schritt als Nächstes“ | Entscheidung nach Ergebnis | Prüffeld → nächste Plan-Karte leuchtet | NEW_BUILD |
| A9 | „mächtig“ | Schleife kann selbstständig weiterlaufen | Plan → Tool → Check → Plan als großer sichtbarer Loop | NEW_BUILD |
| A10 | „Berechtigungen zu weit“ | Handlungsspielraum wächst | enger Kreis → großer Berechtigungsradius | NEW_BUILD |
| A11 | „Fehler mehrere Aktionen“ | ein Fehler kann kaskadieren | erste Fehlaktion → 3 größere Folgeaktionen kippen rot | NEW_BUILD |
| A12 | „je mehr selbst handeln darf / klare Grenzen“ | mehr Autonomie verlangt präzisere Guardrails | Autonomie-Leiste wächst → erlaubte Tools bleiben sichtbar → „mehr Freiheit → genauere Grenzen“ | NEW_BUILD |
| A13 | „wann stoppen / Mensch bestätigen“ | kritische Aktion braucht einen Stopp- und Freigabepunkt | Aktion stoppt am Gate → Bestätigung erforderlich → Mensch bestätigt | NEW_BUILD |
| A14 | „Sprache, Planung, Werkzeuge, Aktionen“ | sichere Agenten verbinden mehrere Ebenen | vier große Pipeline-Karten erscheinen nacheinander → kontrollierte Aktion → Signalpunkt läuft bis Szenenende weiter durch die Pipeline | NEW_BUILD |

## Post-Render-Polish 2026-08-12

Der erste echte Referenzrender wurde auf Smartphone-Lesbarkeit geprüft. Daraus folgen für diese Version zusätzlich:

- Hauptkarten und zentrale Mechaniken ca. 15–20 % präsenter als im ersten Render.
- interne Labels größer und kürzer; die Aussage muss auch ohne Kleinsttext verständlich bleiben.
- vorhandenen Raum mit der erklärenden Mechanik füllen, nicht mit dekorativen Zusatzelementen.
- Szene 5 darf nach der Bestätigung nicht statisch werden: A12 → A13 → A14 bleiben bis zum Ende als sichtbare Zustandsfolge aktiv.
- Frame 0 darf nicht wie ein leerer weißer Start wirken; das erste Hauptvisual ist sofort schwach sichtbar.
- harte Caption-Zone y=1440 bleibt unverändert; die größere Visualisierung wird ausschließlich oberhalb davon komponiert.

Phase 3 verschiebt Beat-Grenzen an die reale Stimme; semantische Reihenfolge bleibt unverändert.
