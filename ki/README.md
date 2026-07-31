# KI-Kanal — direkter Einstieg

Der KI-Faceless-Kanal ist über diesen Ordner auf `main` direkt auffindbar.

## Aktueller Produktionsstand

Die aktive Entwicklung des vollständigen KI Auto-Reel Builders läuft derzeit auf:

```text
Branch: agent/ki-reel-builder-v1
Draft-PR: #2
Kanalpfad: channels/ki
```

Der Produktionsbranch bleibt bis zum bestandenen echten Test-Reel getrennt. Auf `main` dient diese Datei als stabiler Einstiegspunkt.

## Zum aktuellen KI-Builder wechseln

```bash
git fetch origin
git switch agent/ki-reel-builder-v1
git pull
```

Danach zuerst lesen:

```text
CHATGPT_START_HIER.md
channels/ki/CHATGPT_GEHIRN.md
channels/ki/SCHEDULING_POLICY.md
```

## Schnellbefehle im Produktionsbranch

```bash
cd channels/ki
npm run builder:status
npm run reel:new -- <vollständige Themenparameter>
npm run week:new -- --plan="/pfad/week-plan.json"
npm run test:auto-reel
```

## Terminlogik

- `Mach ein Reel` → nächster freier Produktionstag.
- `Plane eine ganze Woche` → sieben unterschiedliche Reels von Montag bis Sonntag.
- Maximal ein Reel pro Wochentag.
- Keine vorsorglich leeren Tagesordner.

## Kanalprofil

- Thema: Künstliche Intelligenz verständlich erklärt
- Inhalte: KI-Tools, Agenten, Automatisierung, Konzepte, Sicherheit und relevante Neuigkeiten
- Sprache: Deutsch
- Format: hochwertige Faceless-Reels mit 3D-Illustrationen und Meaning-first-Remotion
- Bildwelt: helle Premium Editorial-Tech-Illustrationen mit Graphit, Lila und Cyan
