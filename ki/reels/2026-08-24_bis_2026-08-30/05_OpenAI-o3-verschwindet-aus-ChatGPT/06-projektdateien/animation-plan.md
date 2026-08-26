# Animation Plan — o3 verschwindet heute aus ChatGPT

## Global
- 1080×1920, 30 fps
- Light-First
- Header bei `top:112`
- Captions ausschließlich Shared Safe Layout
- keine harte Caption-Geometrie im Reel-Source
- Szenenstart wird nach lokalem Forced Alignment aus dem ersten gemappten Wort abgeleitet

## Szene 1
- o3-Tile scale/settle
- Datum `26. AUGUST` erscheint
- `HEUTE ENDE`-Stempel erst danach
- Hold mindestens 16 Frames

## Szene 2
- Timeline wächst links → rechts
- `28. MAI` zuerst, `90 TAGE` danach, `26. AUGUST` zuletzt
- Hero-Hold auf vollständiger Timeline

## Szene 3
- ChatGPT Picker öffnet
- o3-Zeile wird markiert und herausgeschoben
- Ersatzzeile rückt nach
- `NUR CHATGPT` bleibt lesbar stehen

## Szene 4
- zwei Wege: ChatGPT / API
- ChatGPT-Zweig schließt sichtbar
- API-Zweig bleibt aktiv und bekommt Check
- keine gleichzeitigen Zusatzlabels

## Szene 5
- Workflow-Karten nacheinander aktualisieren
- o3-Badge → aktuelles Modell
- Abschlusszustand `HEUTE TESTEN`

Alle Timingwerte im Source sind relative Szenenbeats; die absoluten Szenengrenzen kommen aus `reel.json` nach Forced Alignment.