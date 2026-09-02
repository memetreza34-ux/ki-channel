# SFX-Plan — OpenAI × Cursor × SpaceX

SFX bleiben **semantisch, voice-first und nicht dauerhaft**. Ziel nach dem Render-Review: mehr hörbare Mikroreaktionen, aber kein Effektteppich.

## Sync-Regel

Die Events besitzen zusätzlich zu ihrem Fallback-`SCENE_OFFSET` einen `sync`-Anker auf `sentenceId + progress`.

Nach dem finalen Forced Alignment immer zuerst:

```bash
node ki/scripts/sync-reel-sfx-to-captions.mjs <reel-package-dir>
```

Danach erst:

```bash
node ki/scripts/resolve-reel-sfx.mjs <reel-package-dir>
```

Damit landen SFX an der echten gesprochenen Aussage statt an alten Plan-Prozenten.

## Geplante hörbare Events

- SpaceX-Eigentümerkarte landet → kurzer trockener Impact.
- `28 AUG 2026` erscheint → kleiner UI-/Date-Click.
- OpenAI↔Cursor-Verbindung bricht → digitaler Break-Akzent.
- Vertrags-Abwicklungsstatus landet → kleiner Status-Impact.
- `12 NOV 2026` rastet auf der Timeline ein → Confirm.
- bestehende Modelle wechseln auf `CONTINUE` → kurzer positiver UI-Akzent.
- mögliche frühere Abschaltung erscheint → dezenter Warning-/Deny-Akzent.
- OpenAI-Begründung wird gescannt → leiser Tech-Scan.
- Astra trifft das Lock-Gate → kurzer Lock/Deny-Impact.
- `NICHT BESTÄTIGT` Status wechselt → kleiner Status-Click.
- API-Key-Route klickt ein → UI-Click.
- Codex-Route klickt ein → anderer UI-/Digital-Akzent.
- AI-Gateway komplettiert 3/3 → dezenter Success.
- finaler Plattform-Payoff → ein trockener Abschluss-Impact.

## Dichte

14 geplante Events auf ungefähr 60–75 Sekunden sind ein **Maximum für dieses Reel**, nicht ein Mindestwert für jedes Reel. Beim finalen 1x-Review einzelne Events entfernen, wenn sie die Stimme überladen oder sich redundant anfühlen.

Nur lokale CC0-Auflösung nach finalem Scene-Lock. Keine Remote-Sounds im Render. Lautstärke-Caps des bestehenden Resolvers bleiben verbindlich.
