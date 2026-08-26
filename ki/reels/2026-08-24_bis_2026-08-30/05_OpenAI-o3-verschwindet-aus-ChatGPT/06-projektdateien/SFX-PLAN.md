# SFX-Plan — OpenAI o3 verschwindet aus ChatGPT

## Grundregel

SFX unterstützen die Aussage, überdecken aber nie die Stimme. Pro Moment höchstens 1–2 unabhängige Effekte. Nur Sounds aus der lokal validierten CC0-Bibliothek unter `public/reel-sfx/`.

## Szene 1 — o3 endet heute

- `impact` kurz beim großen HEUTE/ENDE-Stempel
- optional sehr leiser `ui-error`-Akzent beim Verschwinden der o3-Karte
- kein dauerhafter Hintergrundsound

## Szene 2 — 90 Tage Auslaufphase

- `ui-click` oder `ui-generic` am 28.-Mai-Marker
- zweiter kurzer `ui-click` am 26.-August-Marker
- optional sehr kurzer `transition-rise` während die Timeline vorläuft

## Szene 3 — Nur ChatGPT betroffen

- `ui-click` beim Öffnen der Modellauswahl
- `ui-open-close` beim Entfernen von o3
- `ui-confirm` wenn das aktuelle Ersatzmodell einrastet

## Szene 4 — API bleibt

- sehr kleiner negativer `ui-error`-Akzent auf der ChatGPT-Seite
- klarer, aber leiser `ui-confirm`-Ton auf der grünen API-Seite
- kein harter Impact, damit die Kernaussage verständlich bleibt

## Szene 5 — Workflows prüfen

- maximal zwei `ui-confirm`-Clicks bei den wichtigsten Checkmarks
- ein kurzer `digital-accent` beim finalen CTA/Payoff

## Lautstärke-Startwerte

- UI-Klicks: sehr leise, ungefähr 8–14 % der Voiceover-Wahrnehmung
- Confirm/Error: ungefähr 10–16 %
- Impact/Stamp: ungefähr 14–22 %, nur sehr kurz
- Riser/Transition: ungefähr 6–12 %

Diese Werte sind Startpunkte. Final entscheidet der 1x-Audio-Review.

## Auswahlregel

Der Agent wählt nach lokalem Setup aus `sfx-index.json` nur Sounds mit passender `role`. Keine zufälligen Sounds aus dem Web und keine nicht geprüften Lizenzen.
