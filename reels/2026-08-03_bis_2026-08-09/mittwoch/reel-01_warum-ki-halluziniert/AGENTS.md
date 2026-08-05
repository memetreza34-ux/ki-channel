# Dieses KI-Reel ist bereits programmiert

Die kreative Planung, alle acht Animationen und die vollständige Remotion-Composition sind abgeschlossen.

## Codex darf nicht

- neue Animationen entwerfen,
- vorhandene Animationen ohne konkrete Fehlermeldung neu schreiben,
- das Storyboard oder Voiceover umdeuten,
- alternative Komponenten erzeugen,
- feste Namen für deine eingefügten Medien verlangen,
- Musik oder Soundeffekte hinzufügen,
- globale Feature-Flags aktivieren,
- mergen oder einen Pull Request auf „Ready“ setzen.

## Codex soll nur diesen Befehl ausführen

Aus `alles/`:

```bash
node scripts/build-why-ai-hallucinates.mjs \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_warum-ki-halluziniert
```

Der Befehl erkennt deine Medien, bereitet die Runtime-Dateien vor, prüft den vorprogrammierten Code, rendert das Reel und erzeugt technische Prüfdateien.

## Fehlerbehebung

Nur wenn ein tatsächlich ausgeführter Befehl mit einer konkreten Fehlermeldung scheitert, darf Codex den kleinsten nachweisbaren technischen Defekt beheben. Danach muss derselbe Gesamtbefehl erneut ausgeführt werden.

Keine spekulative Refaktorierung. Die manuelle visuelle Endfreigabe bleibt beim Nutzer.
