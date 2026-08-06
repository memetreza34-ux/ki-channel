# Neues Reel anlegen

Neue Reels werden nicht mehr aus dem alten Hybrid-Template kopiert. Verwende aus `alles/`:

```bash
node scripts/create-future-reel.mjs \
<woche> \
<wochentag> \
<slug> \
--title "Titel des Reels" \
--hook "Direkter Hook" \
--scenes 8 \
--seconds 65
```

Beispiel:

```bash
node scripts/create-future-reel.mjs \
2026-08-10_bis_2026-08-16 \
montag \
reel-01_warum-ki-dich-missversteht \
--title "Warum KI dich manchmal missversteht" \
--hook "Warum versteht deine KI manchmal genau das Gegenteil?" \
--scenes 8 \
--seconds 65
```

Das Skript erzeugt automatisch:

- die sichtbare FinanzNeo-artige Reel-Ordnerstruktur
- 8 oder 9 Szenenordner
- einen 60- bis 70-sekündigen Timeline-Vertrag
- leere semantische Beat-Maps
- Cover-Vertrag
- Voiceover-Dateien
- Untertitelvertrag
- Review-Checkliste
- Checkpoint-Frames
- Produktionsstatus

Danach müssen Script, Szenen und Bedeutungsbeats vollständig ausgefüllt werden. Anschließend:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

Das Scaffold-Skript überschreibt niemals einen vorhandenen Reel-Ordner.
