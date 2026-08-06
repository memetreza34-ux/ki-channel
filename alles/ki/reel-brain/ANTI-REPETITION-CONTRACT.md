# Anti-Wiederholungs-Vertrag für KI-Reels

Dieser Vertrag gilt zusätzlich zum aktuellen Reel-Standard.

## Ziel

Ein neues Reel darf nicht nur ein altes Layout mit anderen Texten, Farben oder Themen sein. Es benötigt neue visuelle Metaphern, Raumlogik, Hauptbewegungen und Ergebniszustände.

## Pflichtvergleich

Vor dem Codieren werden mindestens die letzten zwei vergleichbaren Reels geprüft. Für jede neue Szene dokumentieren:

```text
vorherige Mechanik
→ neue Silhouette
→ neue Raumlogik
→ neue Hauptbewegung
→ neuer Ergebniszustand
```

Die Dokumentation liegt in `05-review/anti-repetition-matrix.md`.

## Harte Regeln

- alle `primaryMotion`-Werte innerhalb eines Reels sind eindeutig
- alle `headingIcon`-Werte innerhalb eines Reels sind eindeutig
- gegenüber dem unmittelbar vorherigen Reel werden null zentrale Hauptmechaniken wiederverwendet
- eine andere Farbe, Beschriftung oder Geschwindigkeit zählt nicht als neue Mechanik
- Karten, Balken, Listen oder Rahmen dürfen nicht erneut als Hauptvisual dienen, wenn sie zuvor kritisiert wurden
- mindestens sechs von acht Szenen benötigen eine deutlich andere Gesamtsilhouette als das Vergleichsreel
- eine Szene muss innerhalb von zwei Sekunden ohne Untertitel grob verständlich sein
- frühere konkrete Nutzerkritik wird zum Release-Blocker

## Nicht ausreichend neu

```text
alte Karte fährt links statt rechts ein
alter Balken wird kreisförmig
alte Szene erhält ein anderes Icon
alte Bühne bekommt neue Farben
mehr kleine Elemente werden ergänzt
```

## Ausreichend neu

```text
neues Hauptobjekt
+ neue räumliche Beziehung
+ neue Ursache-Wirkung-Bewegung
+ klar anderer Endzustand
```

## Pflichtprüfung

```bash
node scripts/validate-reel-animation-novelty.mjs <reel-ordner>
node scripts/validate-reel-animation-novelty.mjs <reel-ordner> --final
```

## Freigabeblocker

Nicht freigeben bei doppelter Hauptbewegung, doppeltem Icon, fehlender Vergleichsmatrix, ungeprüften Zeilen, Platzhaltertext, wiederverwendeter Hauptmechanik oder wiederholter Kritik aus dem vorherigen Render.
