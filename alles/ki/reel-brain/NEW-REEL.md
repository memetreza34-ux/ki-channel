# Neues Reel anlegen

Neue Reels verwenden `ki-animation-only-reel-v2`.

Aus `alles/`:

```bash
node scripts/create-future-reel.mjs \
<woche> \
<wochentag> \
<slug> \
--title "Titel des Reels" \
--hook "Direkter Hook" \
--scenes 8 \
--seconds 64
```

Optional kann der technische Remotion-Ordner angegeben werden:

```bash
--source-dir ki/src/reels/<technischer-slug>
```

Das Skript erzeugt:

- die sichtbare Reel-Ordnerstruktur
- 8 oder 9 Szenenordner
- einen ausdrücklich als Platzhalter markierten Timeline-Vertrag
- ein Hauptobjekt, eine Hauptbewegung und ein Ergebnis als Pflichtfelder
- semantische Beat-Maps mit maximal drei Beats pro Szene
- Cover-Vertrag
- Voiceover-Dateien
- Untertitelvertrag für vollständige Sätze
- `timeline/final-sync.template.json`
- Review-Checkliste
- Produktionsstatus

## Planung prüfen

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema>
```

## Nach dem finalen Voiceover

Codex muss:

```text
Audio transkribieren
→ timeline/final-sync.json erzeugen
→ Platzhalter-Szenenframes ersetzen
→ Trigger aus echten Wortzeiten setzen
→ vollständige Satzuntertitel einbauen
→ violette Fortschrittslinie synchronisieren
→ finale Videolänge aus Sprachende berechnen
```

Danach:

```bash
node scripts/validate-future-reel-standard.mjs \
../reels/<woche>/<wochentag>/<reel-thema> \
--final
```

Das Scaffold-Skript überschreibt niemals einen vorhandenen Reel-Ordner. Ein v2-Reel darf nicht final gerendert werden, solange `final-sync.json` fehlt oder Fallback-Timing aktiv ist.
