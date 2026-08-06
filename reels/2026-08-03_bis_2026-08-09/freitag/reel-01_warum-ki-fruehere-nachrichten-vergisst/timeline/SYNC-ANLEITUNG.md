# Audio-first-Sync-Anleitung v3

## 1. Neues Voiceover erzeugen

Verwende exakt `01-voice-script/script-fliesstext.txt` bei 1,00x. Das frühere Voiceover passt nicht mehr zum überarbeiteten 128-Wörter-Script.

## 2. Wort-Transcript erzeugen

Das Transcript benötigt für jedes Wort:

```json
{"word":"Kontextfenster","start":4.12,"end":4.58}
```

## 3. Finale Timeline erzeugen

```bash
cd alles
node scripts/prepare-why-ai-forgets-final-sync.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst \
<Pfad-zum-Transcript.json>
```

Das Skript erzeugt:

- acht Szenengrenzen
- acht Caption-Paare
- exakt zwei Sätze pro Paar
- Wortzeiten für jedes sichtbare Wort
- semantische Animationstrigger
- finale Composition-Dauer
- 1,8 Sekunden Schluss-Hold

## 4. Validieren

```bash
node scripts/validate-reel-v3.mjs \
../reels/2026-08-03_bis_2026-08-09/freitag/reel-01_warum-ki-fruehere-nachrichten-vergisst \
--final
```

## 5. Prüfen

- beide Sätze stehen vollständig
- nur das aktive Wort wird violett
- keine Fortschrittslinie
- Untertitel stehen bei 260 px
- jede Hauptbewegung startet am passenden Sinnwort
- keine Szene wirkt klein, blass oder wie ein Mini-Dashboard
